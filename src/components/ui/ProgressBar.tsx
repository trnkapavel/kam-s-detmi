import { WIZARD_STEPS } from "@/lib/constants";

type ProgressBarProps = {
  step: number;
};

export function ProgressBar({ step }: ProgressBarProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>Krok {step + 1}/{WIZARD_STEPS}</span>
      </div>
      <div className="flex gap-2">
        {Array.from({ length: WIZARD_STEPS }).map((_, index) => (
          <div
            key={index}
            className={`h-2 flex-1 rounded-full ${
              index <= step ? "bg-sky-600" : "bg-gray-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
