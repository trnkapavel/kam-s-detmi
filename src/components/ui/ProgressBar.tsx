import { WIZARD_STEPS } from "@/lib/constants";
import { Sparkles } from "lucide-react";

type ProgressBarProps = {
  step: number;
};

export function ProgressBar({ step }: ProgressBarProps) {
  const progress = ((step + 1) / WIZARD_STEPS) * 100;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-[15px] font-medium text-slate">
          Krok {step + 1} / {WIZARD_STEPS}
        </p>
        <span className="flex items-center gap-1.5 text-[15px] font-semibold text-primary">
          <Sparkles size={14} strokeWidth={2.5} aria-hidden="true" />
          {Math.round(progress)} %
        </span>
      </div>
      <div className="glass-strong h-2 overflow-hidden rounded-full">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-primary-light transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={step + 1}
          aria-valuemin={1}
          aria-valuemax={WIZARD_STEPS}
        />
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: WIZARD_STEPS }).map((_, index) => (
          <div
            key={index}
            className={`h-1 flex-1 rounded-full transition-all duration-400 ${
              index <= step
                ? "bg-primary shadow-[0_0_8px_rgba(86,69,212,0.5)]"
                : "bg-white/50"
            }`}
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  );
}
