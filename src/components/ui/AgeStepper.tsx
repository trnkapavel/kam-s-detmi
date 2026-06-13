import { NumberStepper } from "@/components/ui/NumberStepper";
import { AGE_MAX, AGE_MIN, QUICK_AGE_CHIPS } from "@/lib/constants";

type AgeStepperProps = {
  value: number;
  onChange: (value: number) => void;
};

export function AgeStepper({ value, onChange }: AgeStepperProps) {
  return (
    <div className="space-y-3">
      <NumberStepper
        value={value}
        onChange={onChange}
        min={AGE_MIN}
        max={AGE_MAX}
        label="Věk"
        suffix="let"
      />
      <div className="flex flex-wrap gap-2 pb-1">
        {QUICK_AGE_CHIPS.map((age) => (
          <button
            key={age}
            type="button"
            onClick={() => onChange(age)}
            className={`min-h-10 rounded-lg px-3.5 text-sm font-semibold transition-colors ${
              value === age
                ? "border-2 border-primary bg-card-lavender text-ink"
                : "glass border border-hairline-strong text-charcoal hover:border-primary/30"
            }`}
          >
            {age} let
          </button>
        ))}
      </div>
    </div>
  );
}
