import type { ReactNode } from "react";
import { StepChildIllustration } from "./StepChildIllustration";
import { StepLocationIllustration } from "./StepLocationIllustration";
import { StepParentIllustration } from "./StepParentIllustration";
import { StepWeatherIllustration } from "./StepWeatherIllustration";

type StepIllustrationProps = {
  step: number;
  className?: string;
};

export function StepIllustration({ step, className = "" }: StepIllustrationProps) {
  switch (step) {
    case 0:
      return <StepLocationIllustration className={className} />;
    case 1:
      return <StepParentIllustration className={className} />;
    case 2:
      return <StepChildIllustration variant="first" className={className} />;
    case 3:
      return <StepWeatherIllustration className={className} />;
    default:
      return null;
  }
}

type StepIllustrationSlotProps = {
  step: number;
  children?: ReactNode;
};

export function StepIllustrationSlot({ step }: StepIllustrationSlotProps) {
  if (step < 0 || step > 3) {
    return null;
  }

  return <StepIllustration step={step} className="h-auto w-full" />;
}
