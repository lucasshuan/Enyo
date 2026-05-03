"use client";

import { useTransition, useEffect, useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAddGameSchema, type AddGameValues } from "@/schemas/game";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { createGame, checkGameSlugAvailability } from "@/actions/game";
import { cn } from "@/lib/utils";
import { resolveImageValue } from "@/lib/upload";
import { ImageUploadInput } from "@/components/ui/image-upload-input";
import { LabelTooltip } from "@/components/ui/label-tooltip";
import { LoaderCircle, Check, X } from "lucide-react";

interface AddGameFormProps {
  onSuccess: (slug: string) => void;
  onLoadingChange?: (loading: boolean) => void;
  onValidationChange?: (isValid: boolean) => void;
  formId: string;
}

export function AddGameForm({
  onSuccess,
  onLoadingChange,
  onValidationChange,
  formId,
}: AddGameFormProps) {
  const t = useTranslations("Modals.AddGame");
  const schema = useAddGameSchema();
  const [isPending, startTransition] = useTransition();

  const [slugAvailability, setSlugAvailability] = useState<{
    value: string;
    status: "idle" | "available" | "conflict";
  }>({ value: "", status: "idle" });
  const slugRequestRef = useRef(0);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<AddGameValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      backgroundImagePath: "",
      thumbnailImagePath: "",
      steamUrl: "",
      websiteUrl: "",
    },
    mode: "onChange",
  });

  const slug = watch("slug") ?? "";
  const canCheckSlug = slug.length >= 2;
  const isSlugChecking = canCheckSlug && slugAvailability.value !== slug;
  const hasSlugConflict =
    canCheckSlug &&
    slugAvailability.value === slug &&
    slugAvailability.status === "conflict";

  // Debounced slug availability check
  useEffect(() => {
    if (!canCheckSlug) return;
    const requestId = ++slugRequestRef.current;
    const timeoutId = window.setTimeout(async () => {
      const result = await checkGameSlugAvailability(slug);
      if (slugRequestRef.current !== requestId) return;
      setSlugAvailability({
        value: slug,
        status:
          result.success && result.data?.available === false
            ? "conflict"
            : "available",
      });
    }, 400);
    return () => window.clearTimeout(timeoutId);
  }, [slug, canCheckSlug]);

  useEffect(() => {
    onLoadingChange?.(isPending);
  }, [isPending, onLoadingChange]);

  useEffect(() => {
    onValidationChange?.(isValid && !isSlugChecking && !hasSlugConflict);
  }, [isValid, isSlugChecking, hasSlugConflict, onValidationChange]);

  const onSubmit = async (values: AddGameValues) => {
    startTransition(async () => {
      let backgroundImagePath: string | null;
      let thumbnailImagePath: string | null;
      try {
        [backgroundImagePath, thumbnailImagePath] = await Promise.all([
          resolveImageValue(values.backgroundImagePath),
          resolveImageValue(values.thumbnailImagePath),
        ]);
      } catch {
        toast.error(t("uploadError"));
        return;
      }

      const result = await createGame({
        ...values,
        backgroundImagePath,
        thumbnailImagePath,
        steamUrl: values.steamUrl || null,
        websiteUrl: values.websiteUrl || null,
        description: values.description ?? null,
      });

      if (result.success) {
        toast.success(t("success"));
        onSuccess(result.data?.game?.slug ?? "");
      } else {
        toast.error(result.error || t("error"));
      }
    });
  };

  return (
    <form
      id={formId}
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2"
    >
      <div className="flex flex-col gap-2">
        <LabelTooltip
          htmlFor="name"
          label={t("name.label")}
          required
          className="ml-1"
        />
        <input
          id="name"
          type="text"
          required
          {...register("name")}
          onChange={(e) => {
            const value = e.target.value;
            setValue("name", value, { shouldValidate: true });
            const slug = value
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .replace(/[^a-z0-9_-\s]/g, "")
              .trim()
              .replace(/\s+/g, "-");
            setValue("slug", slug, { shouldValidate: true });
          }}
          placeholder={t("name.placeholder")}
          className={cn(
            "field-base",
            errors.name ? "field-border-error" : "field-border-default",
          )}
        />
        {errors.name && (
          <p className="field-error-text">{errors.name.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <LabelTooltip
          htmlFor="slug"
          label={t("slug.label")}
          tooltip={t("slug.tooltip")}
          required
          className="ml-1"
        />
        <div className="relative">
          <input
            id="slug"
            type="text"
            required
            {...register("slug")}
            onChange={(e) => {
              const sanitized = e.target.value
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-z0-9_-]/g, "");
              setValue("slug", sanitized, { shouldValidate: true });
            }}
            placeholder={t("slug.placeholder")}
            className={cn(
              "field-with-icon",
              errors.slug || hasSlugConflict
                ? "field-border-error"
                : "field-border-default",
            )}
          />
          {isSlugChecking ? (
            <LoaderCircle className="text-secondary/25 absolute top-1/2 right-4 size-4 -translate-y-1/2 animate-spin" />
          ) : canCheckSlug && !errors.slug ? (
            hasSlugConflict ? (
              <X className="text-danger absolute top-1/2 right-4 size-4 -translate-y-1/2" />
            ) : slugAvailability.value === slug ? (
              <Check className="text-success absolute top-1/2 right-4 size-4 -translate-y-1/2" />
            ) : null
          ) : null}
        </div>
        {errors.slug && (
          <p className="field-error-text">{errors.slug.message}</p>
        )}
        {!errors.slug && hasSlugConflict && (
          <p className="field-error-text">{t("slug.taken")}</p>
        )}
      </div>

      <div className="col-span-full flex flex-col gap-2">
        <label
          htmlFor="description"
          className="text-secondary/80 ml-1 text-sm font-medium"
        >
          {t("descriptionField.label")}
        </label>
        <textarea
          id="description"
          rows={3}
          {...register("description")}
          placeholder={t("descriptionField.placeholder")}
          className={cn(
            "field-textarea custom-scrollbar",
            errors.description ? "field-border-error" : "field-border-default",
          )}
        />
        {errors.description && (
          <p className="field-error-text">{errors.description.message}</p>
        )}
      </div>

      <div>
        <Controller
          name="backgroundImagePath"
          control={control}
          render={({ field }) => (
            <ImageUploadInput
              value={field.value}
              onChange={field.onChange}
              label={t("backgroundImage.label")}
              error={errors.backgroundImagePath?.message}
              disabled={isPending}
            />
          )}
        />
      </div>

      <Controller
        name="thumbnailImagePath"
        control={control}
        render={({ field }) => (
          <ImageUploadInput
            value={field.value}
            onChange={field.onChange}
            label={t("thumbnailImage.label")}
            error={errors.thumbnailImagePath?.message}
            disabled={isPending}
          />
        )}
      />

      <div className="col-span-full flex flex-col gap-2">
        <label
          htmlFor="steamUrl"
          className="text-secondary/80 ml-1 text-sm font-medium"
        >
          {t("steamUrl.label")}
        </label>
        <input
          id="steamUrl"
          type="text"
          {...register("steamUrl")}
          className={cn(
            "field-base",
            errors.steamUrl ? "field-border-error" : "field-border-default",
          )}
        />
        {errors.steamUrl && (
          <p className="field-error-text">{errors.steamUrl.message}</p>
        )}
      </div>

      <div className="col-span-full flex flex-col gap-2">
        <label
          htmlFor="websiteUrl"
          className="text-secondary/80 ml-1 text-sm font-medium"
        >
          {t("websiteUrl.label")}
        </label>
        <input
          id="websiteUrl"
          type="text"
          {...register("websiteUrl")}
          className={cn(
            "field-base",
            errors.websiteUrl ? "field-border-error" : "field-border-default",
          )}
        />
        {errors.websiteUrl && (
          <p className="field-error-text">{errors.websiteUrl.message}</p>
        )}
      </div>
    </form>
  );
}
