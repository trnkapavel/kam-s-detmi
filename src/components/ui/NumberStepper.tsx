import type { ButtonHTMLAttributes } from "react";
import { Minus, Plus } from "lucide-react";

type NumberStepperProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
  suffix?: string;
  className?: string;
};

export function NumberStepper({
  value,
  onChange,
  min = 0,
  max = 99,
  label,
  suffix = "",
  className = "",
}: NumberStepperProps) {
  function decrement() {
    onChange(Math.max(min, value - 1));
  }

  function increment() {
    onChange(Math.min(max, value + 1));
  }

  return (
    <div className={className}>
      {label && <p className="mb-2 text-[15px] font-medium text-slate">{label}</p>}
      <div className="flex items-center gap-3">
        <StepperButton onClick={decrement} disabled={value <= min} aria-label="Snížit">
          <Minus size={20} strokeWidth={2.5} />
        </StepperButton>
        <div className="glass flex min-h-12 min-w-[5.5rem] flex-1 items-center justify-center rounded-lg border border-hairline-strong px-4">
          <span className="text-xl font-bold text-ink">
            {value}
            {suffix && <span className="ml-1 text-base font-semibold text-slate">{suffix}</span>}
          </span>
        </div>
        <StepperButton onClick={increment} disabled={value >= max} aria-label="Zvýšit">
          <Plus size={20} strokeWidth={2.5} />
        </StepperButton>
      </div>
    </div>
  );
}

function StepperButton({
  children,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-hairline-strong bg-canvas text-primary transition-colors hover:border-primary/40 hover:bg-card-lavender disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
