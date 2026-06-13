import { Loader2 } from "lucide-react";

type LoadingSpinnerProps = {
  label?: string;
  size?: "sm" | "md";
};

export function LoadingSpinner({ label, size = "md" }: LoadingSpinnerProps) {
  const sizeClass = size === "sm" ? "h-6 w-6" : "h-10 w-10";

  return (
    <div className="flex flex-col items-center justify-center gap-4" role="status" aria-live="polite">
      <Loader2
        className={`${sizeClass} animate-spin text-primary`}
        strokeWidth={2.5}
        aria-hidden="true"
      />
      {label && <p className="text-base text-slate">{label}</p>}
    </div>
  );
}
