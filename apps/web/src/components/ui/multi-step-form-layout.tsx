"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Step {
  label: string;
}

interface MultiStepFormLayoutProps {
  title: string;
  description: string;
  steps: Step[];
  initialStep?: number;
  isLoading?: boolean;
  isStepValid?: boolean;
  labels: {
    back: string;
    next: string;
  };
  renderSubmit: React.ReactNode;
  children: (currentStep: number) => React.ReactNode;
}

export function MultiStepFormLayout({
  title,
  description,
  steps,
  initialStep = 0,
  isLoading = false,
  isStepValid = false,
  labels,
  renderSubmit,
  children,
}: MultiStepFormLayoutProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [maxReachedStep, setMaxReachedStep] = useState(initialStep);

  const isLastStep = currentStep === steps.length - 1;
  const canGoBack = currentStep > 0;

  const handleNext = () => {
    const next = currentStep + 1;
    if (next > maxReachedStep) setMaxReachedStep(next);
    setCurrentStep(next);
  };

  const handleStepClick = (idx: number) => {
    const isUnlocked =
      idx <= currentStep || (idx <= maxReachedStep && isStepValid);
    if (isUnlocked) setCurrentStep(idx);
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-10 sm:px-10 lg:px-12">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          {title}
        </h1>
        <p className="text-muted mt-1 text-sm">{description}</p>
      </div>

      {/* Steps indicator */}
      <div className="custom-scrollbar mb-8 overflow-x-auto pb-1">
        <div className="relative flex min-w-fit items-center pb-6 px-6">
          {steps.flatMap((step, idx) => {
            const isActive = idx === currentStep;
            const isPast = idx < currentStep;
            const isUnlocked = idx <= maxReachedStep && idx !== currentStep;
            const canClick = (isPast || isUnlocked) && !isActive;

            const button = (
              <button
                key={`step-${idx}`}
                type="button"
                onClick={() => canClick && handleStepClick(idx)}
                disabled={!canClick}
                className={cn(
                  "group relative size-6 shrink-0 transition-all duration-300",
                  canClick ? "cursor-pointer" : !isActive ? "cursor-not-allowed" : "cursor-default",
                )}
              >
                <div
                  className={cn(
                    "flex size-6 items-center justify-center rounded-full text-[10px] font-bold transition-all duration-300",
                    isActive
                      ? "bg-primary text-white shadow-primary/30 shadow-md"
                      : isPast || isUnlocked
                        ? "bg-success text-white group-hover:brightness-110"
                        : "bg-white/10 text-white/40",
                  )}
                >
                  {idx + 1}
                </div>
                <span
                  className={cn(
                    "absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold tracking-wider uppercase transition-colors duration-300",
                    isActive
                      ? "text-primary"
                      : isPast || isUnlocked
                        ? "text-success/60 group-hover:text-success/90"
                        : "text-white/25",
                  )}
                >
                  {step.label}
                </span>
              </button>
            );

            if (idx < steps.length - 1) {
              return [
                button,
                <div
                  key={`connector-${idx}`}
                  className={cn(
                    "h-px min-w-3 flex-1 mx-1.5",
                    idx < maxReachedStep ? "bg-success/20" : "bg-white/5",
                  )}
                />,
              ];
            }
            return [button];
          })}
        </div>
      </div>

      {/* Form content */}
      <div className="rounded-3xl border border-gold-dim bg-card-strong">
        <div className="p-6 lg:p-8">{children(currentStep)}</div>

        {/* Footer nav */}
        <div className="flex items-center justify-between gap-3 border-t border-white/5 bg-white/2 px-6 py-4 lg:px-8">
          <div>
            {canGoBack && (
              <Button
                type="button"
                intent="ghost"
                onClick={() => setCurrentStep((s) => s - 1)}
                disabled={isLoading}
                className="rounded-2xl px-6"
              >
                <ArrowLeft className="mr-2 size-4 opacity-70" />
                {labels.back}
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {!isLastStep ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={!isStepValid || isLoading}
                intent="primary"
                className="rounded-2xl px-8"
              >
                {labels.next}
                <ArrowRight className="ml-2 size-4" />
              </Button>
            ) : (
              renderSubmit
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
