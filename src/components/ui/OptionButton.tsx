import type { ReactNode } from "react";
import { Check } from "lucide-react";

type OptionButtonProps = {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
};

export function OptionButton({
  selected,
  onClick,
  children,
  icon,
  className = "",
}: OptionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`option-tile flex min-h-[52px] items-center gap-3 rounded-lg px-4 py-3.5 text-left text-base font-medium ${
        selected
          ? "option-tile-selected border-2 border-primary bg-card-lavender text-ink glass-tint"
          : "glass border border-hairline-strong text-charcoal hover:border-primary/30"
      } ${className}`}
    >
      {icon && (
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
            selected ? "bg-primary/15 text-primary" : "bg-white/60 text-slate"
          }`}
        >
          {icon}
        </span>
      )}
      <span className="flex-1">{children}</span>
      {selected && (
        <Check size={18} strokeWidth={2.5} className="shrink-0 text-primary" aria-hidden="true" />
      )}
    </button>
  );
}
