"use client";

import { useState, useEffect, useRef, useTransition, useCallback, useSyncExternalStore } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  User,
  AtSign,
  Globe,
  Gamepad2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  LoaderCircle,
  Search,
  X,
  Swords,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "@/i18n/routing";
import { toast } from "sonner";
import confetti from "canvas-confetti";

import { cn } from "@/lib/utils";
import { cdnUrl } from "@/lib/cdn";
import { Button } from "@/components/ui/button";
import { checkUsernameAvailability } from "@/actions/user";
import { completeOnboarding } from "@/actions/onboarding";
import { getGamesSimple, type SimpleGame } from "@/actions/get-games";
import { CountryCombobox } from "@/components/ui/country-combobox";

/* ────────────────────────────── types & schema ────────────────────────────── */

/* ─────────────────────────── sub-components ─────────────────────────── */

function StepIndicator({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={cn(
              "flex size-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-500",
              i === currentStep
                ? "bg-primary shadow-primary/30 scale-110 text-white shadow-lg"
                : i < currentStep
                  ? "bg-success text-white"
                  : "bg-card-strong/70 text-secondary/35",
            )}
          >
            {i < currentStep ? <Check className="size-4" /> : i + 1}
          </div>
          {i < totalSteps - 1 && (
            <div
              className={cn(
                "h-px w-6 transition-colors duration-500 sm:w-10",
                i < currentStep ? "bg-success/40" : "bg-card-strong/70",
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/* ──────────────────────────── main component ──────────────────────────── */

const emptySubscribe = () => () => {};

const TOTAL_STEPS = 5;

export function OnboardingWizard({
  username: initialUsername,
  userId,
  onFinish,
}: {
  username: string;
  userId: string;
  onFinish: () => void;
}) {
  const t = useTranslations("Onboarding");
  const tVal = useTranslations("Validations");
  const locale = useLocale();
  const { update } = useSession();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState(0);
  const [selectedGames, setSelectedGames] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const confettiFired = useRef(false);
  const confettiCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  // Games from database
  const [games, setGames] = useState<SimpleGame[] | null>(null);
  const [gameSearch, setGameSearch] = useState("");
  const gamesFetched = useRef(false);

  const schema = z.object({
    name: z
      .string()
      .min(3, tVal("nameMin", { count: 3 }))
      .max(50, tVal("nameMax", { count: 50 })),
    username: z
      .string()
      .min(3, tVal("min", { count: 3 }))
      .max(30, tVal("max", { count: 30 }))
      .regex(/^[a-z0-9_.]+$/, tVal("usernameFormat")),
    country: z.string().nullable().optional(),
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialUsername,
      username: initialUsername.toLowerCase().replace(/[^a-z0-9_.]/g, "_"),
      country: null,
    },
    mode: "onChange",
  });

  const watchedUsername = useWatch({ control, name: "username" }) || "";

  // Username availability check
  const [usernameStatus, setUsernameStatus] = useState<{
    value: string;
    status: "idle" | "checking" | "available" | "conflict";
  }>({ value: "", status: "idle" });
  const requestRef = useRef(0);

  const normalizedUsername = watchedUsername.trim().toLowerCase();
  const canCheck =
    !!normalizedUsername &&
    normalizedUsername.length >= 3 &&
    /^[a-z0-9_.]+$/.test(normalizedUsername);

  useEffect(() => {
    if (!canCheck) {
      requestRef.current += 1;
      return;
    }

    const reqId = ++requestRef.current;

    const timeout = window.setTimeout(async () => {
      const result = await checkUsernameAvailability(
        normalizedUsername,
        userId,
      );
      if (requestRef.current !== reqId) return;

      setUsernameStatus({
        value: normalizedUsername,
        status:
          !result.success || result.data?.available ? "available" : "conflict",
      });
    }, 400);

    return () => window.clearTimeout(timeout);
  }, [canCheck, normalizedUsername, userId]);

  // Derive the effective status: if can't check, always idle; if checking (value changed but no result yet), show checking
  const effectiveUsernameStatus = !canCheck
    ? ({ value: normalizedUsername, status: "idle" } as const)
    : usernameStatus.value !== normalizedUsername
      ? ({ value: normalizedUsername, status: "checking" } as const)
      : usernameStatus;

  // Entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Fetch games from DB when reaching the games step
  useEffect(() => {
    if (step !== 3 || gamesFetched.current) return;
    gamesFetched.current = true;
    void getGamesSimple().then((result) => {
      setGames(result.success && result.data ? result.data : []);
    });
  }, [step]);

  const gamesLoading = games === null && step === 3;
  const filteredGames = gameSearch
    ? (games ?? []).filter((g) =>
        g.name.toLowerCase().includes(gameSearch.toLowerCase()),
      )
    : (games ?? []);

  // Confetti on completion — fires onto the canvas placed inside the portal
  // (between backdrop and card), so particles appear behind the card.
  const fireConfetti = useCallback(() => {
    if (confettiFired.current) return;
    confettiFired.current = true;

    const canvas = confettiCanvasRef.current;
    if (!canvas) return;

    const fire = confetti.create(canvas, { resize: true, useWorker: false });
    const colors = ["#c00b3b", "#ff4655", "#f59e0b", "#10b981", "#8b5cf6"];

    void fire({ particleCount: 50, angle: 60, spread: 70, origin: { x: 0, y: 0.75 }, colors });
    void fire({ particleCount: 50, angle: 120, spread: 70, origin: { x: 1, y: 0.75 }, colors });
  }, []);

  const isUsernameOk =
    effectiveUsernameStatus.status === "available" ||
    effectiveUsernameStatus.status === "idle";
  const isUsernameChecking = effectiveUsernameStatus.status === "checking";

  const canProceed = () => {
    switch (step) {
      case 0:
        return true; // welcome
      case 1:
        return isValid && isUsernameOk && !isUsernameChecking; // identity
      case 2:
        return true; // country (optional)
      case 3:
        return true; // games (optional mock)
      case 4:
        return true; // completion
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1 && canProceed()) {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const toggleGame = (gameId: string) => {
    setSelectedGames((prev) =>
      prev.includes(gameId)
        ? prev.filter((id) => id !== gameId)
        : [...prev, gameId],
    );
  };

  const submittedValues = useRef<{ username: string; name: string } | null>(
    null,
  );

  const onCompleteSubmit = useCallback(
    (values: z.infer<typeof schema>) => {
      startTransition(async () => {
        const formData = new FormData();
        formData.append("username", values.username);
        formData.append("name", values.name);
        if (values.country) formData.append("country", values.country);

        const result = await completeOnboarding(formData);

        if (!result.success) {
          // Só faz signOut se o usuário não existe no banco (sessão órfã).
          // Não deve fazer signOut para erros de rede, backend offline, etc.
          const isOrphanSession = result.error
            ?.toLowerCase()
            .includes("user not found");

          if (isOrphanSession) {
            await signOut({ redirect: true, callbackUrl: "/" });
            return;
          }

          toast.error(result.error || "Something went wrong.");
          return;
        }

        submittedValues.current = {
          username: values.username,
          name: values.name,
        };

        setIsCompleted(true);
        setStep(TOTAL_STEPS - 1);
        fireConfetti();
      });
    },
    [fireConfetti],
  );

  const handleFinish = useCallback(() => {
    void update({
      username: submittedValues.current?.username,
      name: submittedValues.current?.name,
      onboardingCompleted: true,
    }).then(() => {
      onFinish();
      router.push("/dashboard");
    });
  }, [update, onFinish, router]);

  /* ── step content ── */

  const renderStep = () => {
    switch (step) {
      /* ─── 0: Welcome ─── */
      case 0:
        return (
          <div className="flex flex-col items-center gap-8 text-center">
            <div className="animate-pop-in relative">
              <div className="from-primary/20 absolute inset-0 rounded-full bg-linear-to-br to-transparent blur-3xl" />
              <div className="bg-primary/10 border-primary/20 relative flex size-28 items-center justify-center rounded-full border-2">
                <Swords className="text-primary size-14" />
              </div>
            </div>
            <div className="space-y-3">
              <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                {t("welcome.title")}
              </h2>
              <p className="text-muted mx-auto max-w-md text-lg">
                {t("welcome.subtitle")}
              </p>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-4 text-center">
              {[
                {
                  icon: Gamepad2,
                  label: t("welcome.feature1"),
                },
                {
                  icon: Swords,
                  label: t("welcome.feature2"),
                },
                {
                  icon: Sparkles,
                  label: t("welcome.feature3"),
                },
              ].map(({ icon: Icon, label }, i) => (
                <div
                  key={i}
                  className="animate-in flex flex-col items-center gap-2 rounded-2xl border border-gold-dim/25 bg-card-strong/25 p-4"
                  style={{ animationDelay: `${i * 100 + 200}ms` }}
                >
                  <Icon className="text-primary size-6" />
                  <span className="text-xs font-medium text-secondary/80">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      /* ─── 1: Identity ─── */
      case 1:
        return (
          <div className="mx-auto max-w-md space-y-6">
            <div className="space-y-2 text-center">
              <div className="bg-primary/10 mx-auto flex size-12 items-center justify-center rounded-full">
                <User className="text-primary size-6" />
              </div>
              <h3 className="text-2xl font-bold text-white">
                {t("identity.title")}
              </h3>
              <p className="text-muted text-sm">{t("identity.subtitle")}</p>
            </div>

            <div className="space-y-5">
              {/* Display Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-secondary/90">
                  {t("identity.nameLabel")}
                </label>
                <input
                  {...register("name")}
                  className="field-base field-border-default w-full rounded-2xl px-4 py-3"
                  placeholder={t("identity.namePlaceholder")}
                />
                {errors.name && (
                  <p className="text-danger text-xs">{errors.name.message}</p>
                )}
              </div>

              {/* Username / Profile Link */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-secondary/90">
                  {t("identity.usernameLabel")}
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <AtSign className="size-4 text-secondary/35" />
                  </div>
                  <input
                    {...register("username")}
                    className="field-base field-border-default w-full rounded-2xl py-3 pr-10 pl-10"
                    placeholder={t("identity.usernamePlaceholder")}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                    {isUsernameChecking && (
                      <LoaderCircle className="size-4 animate-spin text-secondary/45" />
                    )}
                    {effectiveUsernameStatus.status === "available" &&
                      canCheck && <Check className="text-success size-4" />}
                    {effectiveUsernameStatus.status === "conflict" && (
                      <X className="text-danger size-4" />
                    )}
                  </div>
                </div>
                {errors.username && (
                  <p className="text-danger text-xs">
                    {errors.username.message}
                  </p>
                )}
                {effectiveUsernameStatus.status === "conflict" && (
                  <p className="text-danger text-xs">
                    {t("identity.usernameTaken")}
                  </p>
                )}

                {/* URL Preview */}
                <div className="rounded-xl border border-gold-dim/25 bg-card-strong/25 px-4 py-2.5">
                  <p className="text-xs text-secondary/45">
                    {t("identity.urlPreview")}
                  </p>
                  <p className="mt-0.5 font-mono text-sm text-secondary/80">
                    bellona.gg/profile/
                    <span className="text-primary font-semibold">
                      {normalizedUsername || "..."}
                    </span>
                  </p>
                </div>
                <p className="text-xs text-secondary/35">{t("identity.urlHint")}</p>
              </div>
            </div>
          </div>
        );

      /* ─── 2: Country ─── */
      case 2:
        return (
          <div className="mx-auto max-w-md space-y-6">
            <div className="space-y-2 text-center">
              <div className="bg-primary/10 mx-auto flex size-12 items-center justify-center rounded-full">
                <Globe className="text-primary size-6" />
              </div>
              <h3 className="text-2xl font-bold text-white">
                {t("country.title")}
              </h3>
              <p className="text-muted text-sm">{t("country.subtitle")}</p>
            </div>

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

            <p className="text-center text-xs text-secondary/35">
              {t("country.hint")}
            </p>
          </div>
        );

      /* ─── 3: Games ─── */
      case 3:
        return (
          <div className="flex min-h-0 flex-col gap-4">
            <div className="shrink-0 space-y-2 text-center">
              <div className="bg-primary/10 mx-auto flex size-12 items-center justify-center rounded-full">
                <Gamepad2 className="text-primary size-6" />
              </div>
              <h3 className="text-2xl font-bold text-white">
                {t("games.title")}
              </h3>
              <p className="text-muted text-sm">{t("games.subtitle")}</p>
            </div>

            {/* Search */}
            <div className="relative shrink-0">
              <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-secondary/35" />
              <input
                type="text"
                value={gameSearch}
                onChange={(e) => setGameSearch(e.target.value)}
                placeholder={t("games.searchPlaceholder")}
                className="field-base field-border-default w-full rounded-2xl py-3 pr-4 pl-11"
              />
              {gameSearch && (
                <button
                  type="button"
                  onClick={() => setGameSearch("")}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-secondary/35 hover:text-secondary/70"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            {/* Game list */}
            <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto pr-1">
              {gamesLoading ? (
                <div className="flex flex-col items-center gap-3 py-12">
                  <LoaderCircle className="text-primary size-8 animate-spin" />
                  <p className="text-sm text-secondary/45">
                    {t("games.loading")}
                  </p>
                </div>
              ) : filteredGames.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-12">
                  <Gamepad2 className="size-8 text-secondary/25" />
                  <p className="text-sm text-secondary/45">
                    {t("games.noGames")}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {filteredGames.map((game) => {
                    const isSelected = selectedGames.includes(game.id);
                    return (
                      <button
                        key={game.id}
                        type="button"
                        onClick={() => toggleGame(game.id)}
                        className={cn(
                          "group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-200",
                          isSelected
                            ? "border-primary/40 bg-primary/10 shadow-primary/10 shadow-lg"
                            : "border-gold-dim/25 bg-card-strong/25 hover:border-gold-dim/35 hover:bg-white/4",
                        )}
                      >
                        {isSelected && (
                          <div className="bg-primary absolute top-2 right-2 z-10 flex size-5 items-center justify-center rounded-full">
                            <Check className="size-3 text-white" />
                          </div>
                        )}
                        <div className="relative aspect-368/178 w-full overflow-hidden bg-card-strong/45">
                          {game.thumbnailImagePath ? (
                            <Image
                              src={cdnUrl(game.thumbnailImagePath)!}
                              alt={game.name}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-110"
                              sizes="(max-width: 640px) 50vw, 180px"
                            />
                          ) : (
                            <div className="from-primary/20 flex h-full w-full items-center justify-center bg-linear-to-br to-transparent">
                              <Gamepad2 className="size-6 text-secondary/25" />
                            </div>
                          )}
                        </div>
                        <div className="px-3 py-2.5">
                          <span
                            className={cn(
                              "line-clamp-1 text-center text-xs font-medium",
                              isSelected ? "text-primary" : "text-secondary/70",
                            )}
                          >
                            {game.name}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <p className="shrink-0 text-center text-xs text-secondary/35">
              {t("games.hint")}
            </p>
          </div>
        );

      /* ─── 4: Complete ─── */
      case 4:
        return (
          <div className="flex flex-col items-center gap-8 py-8 text-center">
            {isCompleted ? (
              <>
                <div className="animate-pop-in relative">
                  <div className="from-success/20 absolute inset-0 rounded-full bg-linear-to-br to-transparent blur-3xl" />
                  <div className="border-success/30 bg-success/10 relative flex size-28 items-center justify-center rounded-full border-2">
                    <Check className="text-success size-14" />
                  </div>
                </div>
                <div className="space-y-3">
                  <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                    {t("complete.title")}
                  </h2>
                  <p className="text-muted mx-auto max-w-md text-lg">
                    {t("complete.subtitle")}
                  </p>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <LoaderCircle className="text-primary size-12 animate-spin" />
                <p className="text-muted text-lg">{t("complete.saving")}</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (!isMounted) return null;

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-200 flex items-center justify-center transition-all duration-500",
        isVisible ? "opacity-100" : "opacity-0",
      )}
    >
      {/* Backdrop */}
      <div className="bg-background/95 absolute inset-0 backdrop-blur-xl" />

      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-primary/5 animate-hero-glow absolute -top-40 left-1/4 h-80 w-80 rounded-full blur-[120px]" />
        <div className="animate-hero-glow absolute right-1/4 -bottom-40 h-80 w-80 rounded-full bg-purple-500/5 blur-[120px] [animation-delay:-4s]" />
      </div>

      {/* Confetti canvas — absolute inset-0 with resize:true so particles fill the
          full viewport but render behind the card (z-0 < card z-10) */}
      <canvas
        ref={confettiCanvasRef}
        className="pointer-events-none absolute inset-0 z-20 h-full w-full"
      />

      {/* Content */}
      <div
        className={cn(
          "relative z-10 flex max-h-dvh w-full max-w-2xl flex-col items-center gap-6 px-6 py-8 transition-all duration-700",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
        )}
      >
        {/* Progress */}
        {!isCompleted && (
          <div className="shrink-0">
            <StepIndicator currentStep={step} totalSteps={TOTAL_STEPS} />
          </div>
        )}

        {/* Card */}
        <div
          key={step}
          className="animate-in relative z-10 flex min-h-0 w-full flex-1 flex-col rounded-3xl border border-gold-dim/25 bg-card-strong/25 p-8 shadow-2xl backdrop-blur-sm sm:p-10"
        >
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex w-full shrink-0 items-center justify-between">
          <div>
            {step > 0 && step < TOTAL_STEPS - 1 && !isCompleted && (
              <Button
                type="button"
                intent="ghost"
                onClick={handleBack}
                disabled={isPending}
                className="rounded-2xl px-6"
              >
                <ArrowLeft className="mr-2 size-4 opacity-70" />
                {t("nav.back")}
              </Button>
            )}
          </div>

          <div>
            {step < 3 && (
              <Button
                type="button"
                intent="primary"
                onClick={handleNext}
                disabled={!canProceed() || isPending}
                className="rounded-2xl px-8"
              >
                {step === 0 ? t("nav.getStarted") : t("nav.next")}
                <ArrowRight className="ml-2 size-4" />
              </Button>
            )}
            {step === 3 && !isCompleted && (
              <Button
                type="button"
                intent="primary"
                onClick={() => {
                  setStep(4);
                  void handleSubmit(onCompleteSubmit)();
                }}
                disabled={!canProceed() || isPending}
                className="rounded-2xl px-8"
              >
                {isPending ? (
                  <LoaderCircle className="mr-2 size-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 size-4" />
                )}
                {t("nav.finish")}
              </Button>
            )}
            {isCompleted && step === TOTAL_STEPS - 1 && (
              <Button
                type="button"
                intent="primary"
                onClick={handleFinish}
                className="rounded-2xl px-8"
              >
                {t("nav.explore")}
                <ArrowRight className="ml-2 size-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
