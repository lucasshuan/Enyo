"use client";

import { useTransition, useState, useEffect, useRef } from "react";

import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useEditProfileSchema,
  type EditProfileValues,
} from "@/schemas/profile";
import { X, Check, LoaderCircle } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { toast } from "sonner";
import { checkUsernameAvailability, updateProfile } from "@/actions/user";
import { useRouter, usePathname } from "@/i18n/routing";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils/helpers";
import { LabelTooltip } from "@/components/ui/label-tooltip";
import { ImageUploadInput } from "@/components/ui/image-upload-input";
import { resolveImageValue } from "@/lib/utils/upload";
import { CountryCombobox } from "@/components/ui/country-combobox";

export type UserData = {
  id: string;
  name?: string | null;
  username: string;
  bio?: string | null;
  profileColor?: string | null;
  country?: string | null;
  imagePath?: string | null;
};

const PROFILE_COLORS = [
  "#c00b3b", // Original Red
  "#3b82f6", // Blue
  "#8b5cf6", // Violet
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#db2777", // Pink
  "#06b6d4", // Cyan
  "#84cc16", // Lime
  "#d946ef", // Fuschia
  "#64748b", // Slate
];

interface EditProfileFormProps {
  user: UserData;
  onSuccess: () => void;
  onLoadingChange?: (loading: boolean) => void;
  onValidationChange?: (isValid: boolean) => void;
  formId: string;
}

export function EditProfileForm({
  user,
  onSuccess,
  onLoadingChange,
  onValidationChange,
  formId,
}: EditProfileFormProps) {
  const t = useTranslations("Modals.EditProfile");
  const schema = useEditProfileSchema();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<EditProfileValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user.name || "",
      username: user.username || "",
      bio: user.bio || "",
      country: user.country || null,
      profileColor: user.profileColor || PROFILE_COLORS[0],
      imagePath: user.imagePath ?? null,
    },
    mode: "onChange",
  });

  const username = useWatch({ control, name: "username" }) || "";
  const [usernameAvailability, setUsernameAvailability] = useState<{
    value: string;
    status: "idle" | "available" | "conflict";
  }>({
    value: user.username,
    status: "available",
  });
  const usernameRequestRef = useRef(0);

  // Notify parent about loading state
  useEffect(() => {
    onLoadingChange?.(isPending);
  }, [isPending, onLoadingChange]);

  // Notify parent about validation state
  const normalizedUsername = username.trim().toLowerCase();
  const canCheckUsername =
    !!normalizedUsername &&
    normalizedUsername !== user.username &&
    schema.shape.username.safeParse(normalizedUsername).success;
  const isUsernameChecking =
    canCheckUsername && usernameAvailability.value !== normalizedUsername;
  const hasUsernameConflict =
    canCheckUsername &&
    usernameAvailability.value === normalizedUsername &&
    usernameAvailability.status === "conflict";
  const isFormValid = isValid && !isUsernameChecking && !hasUsernameConflict;

  useEffect(() => {
    onValidationChange?.(isFormValid);
  }, [isFormValid, onValidationChange]);

  useEffect(() => {
    if (!canCheckUsername) {
      usernameRequestRef.current += 1;
      return;
    }

    const requestId = ++usernameRequestRef.current;

    const timeoutId = window.setTimeout(async () => {
      const result = await checkUsernameAvailability(
        normalizedUsername,
        user.id,
      );

      if (usernameRequestRef.current !== requestId) {
        return;
      }

      if (!result.success) {
        setUsernameAvailability({
          value: normalizedUsername,
          status: "available",
        });
        return;
      }

      setUsernameAvailability({
        value: normalizedUsername,
        status: result.data?.available ? "available" : "conflict",
      });
    }, 400);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [canCheckUsername, normalizedUsername, user.id]);

  const onSubmit = async (values: EditProfileValues) => {
    if (isUsernameChecking || hasUsernameConflict) {
      return;
    }

    startTransition(async () => {
      let resolvedImagePath: string | null;
      try {
        resolvedImagePath = await resolveImageValue(values.imagePath);
      } catch {
        toast.error("Failed to upload image.");
        return;
      }

      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (key === "imagePath") return;
        if (value !== null && value !== undefined) {
          formData.append(key, value as string);
        }
      });
      if (resolvedImagePath) {
        formData.append("imagePath", resolvedImagePath);
      }

      const result = await updateProfile(formData);
      if (!result.success) {
        toast.error(result.error || "Ocorreu um erro ao atualizar o perfil.");
        return;
      }

      toast.success(t("success"));

      // Refresh session
      await update({
        username: values.username,
        name: values.name,
        imagePath: resolvedImagePath ?? undefined,
      });

      if (result.success && result.data) {
        const isProfilePage = pathname.includes("/profile/");
        if (isProfilePage) {
          router.push(`/profile/${result.data}`);
        }
      }

      onSuccess();
    });
  };

  return (
    <form
      id={formId}
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2"
    >
      <div className="md:col-span-2">
        <div className="w-25">
          <Controller
            name="imagePath"
            control={control}
            render={({ field }) => (
              <ImageUploadInput
                value={field.value}
                onChange={field.onChange}
                label={t("avatar.label")}
                dropzoneClassName="h-[100px]"
              />
            )}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <LabelTooltip label={t("name.label")} htmlFor="name" required />
        <input
          type="text"
          id="name"
          {...register("name")}
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
          label={t("username.label")}
          tooltip={t("username.description")}
          htmlFor="username"
          required
        />
        <div className="relative">
          <input
            type="text"
            id="username"
            {...register("username")}
            placeholder={t("username.placeholder")}
            className={cn(
              "field-with-icon",
              errors.username || hasUsernameConflict
                ? "field-border-error"
                : "field-border-default",
            )}
          />
          {isUsernameChecking ? (
            <LoaderCircle className="text-secondary/25 absolute top-1/2 right-4 size-4 -translate-y-1/2 animate-spin" />
          ) : canCheckUsername && !errors.username ? (
            hasUsernameConflict ? (
              <X className="text-danger absolute top-1/2 right-4 size-4 -translate-y-1/2" />
            ) : (
              <Check className="text-success absolute top-1/2 right-4 size-4 -translate-y-1/2" />
            )
          ) : null}
        </div>
        {errors.username && (
          <p className="field-error-text">{errors.username.message}</p>
        )}
        {!errors.username && hasUsernameConflict && (
          <p className="field-error-text">{t("username.taken")}</p>
        )}
      </div>

      {/* Country Selector */}
      <div className="flex flex-col gap-2">
        <LabelTooltip label={t("country.label")} />
        <Controller
          name="country"
          control={control}
          render={({ field }) => (
            <CountryCombobox
              value={field.value ?? null}
              onChange={field.onChange}
              locale={locale}
              placeholder={t("country.placeholder")}
              clearLabel={t("country.placeholder")}
            />
          )}
        />
      </div>

      <div className="col-span-full flex flex-col gap-2">
        <LabelTooltip label={t("bio.label")} htmlFor="bio" />
        <textarea
          id="bio"
          {...register("bio")}
          placeholder={t("bio.placeholder")}
          rows={3}
          className={cn(
            "field-textarea custom-scrollbar",
            errors.bio ? "field-border-error" : "field-border-default",
          )}
        />
        {errors.bio && <p className="field-error-text">{errors.bio.message}</p>}
      </div>
      <div className="col-span-full flex flex-col gap-3">
        <LabelTooltip
          label={t("color.label")}
          tooltip={t("color.description")}
        />
        <div className="flex flex-wrap gap-3 p-1">
          <Controller
            name="profileColor"
            control={control}
            render={({ field }) => (
              <>
                {PROFILE_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => field.onChange(color)}
                    className={cn(
                      "relative flex size-8 shrink-0 items-center justify-center rounded-full transition-transform hover:scale-110 active:scale-95",
                      field.value === color &&
                        "ring-primary ring-offset-background ring-2 ring-offset-2",
                    )}
                    style={{ backgroundColor: color }}
                  >
                    {field.value === color && (
                      <div className="size-2 rounded-full bg-white shadow-sm" />
                    )}
                  </button>
                ))}
              </>
            )}
          />
        </div>
      </div>
    </form>
  );
}
