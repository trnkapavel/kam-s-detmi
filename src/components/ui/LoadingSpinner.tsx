type LoadingSpinnerProps = {
  label?: string;
  size?: "sm" | "md";
};

export function LoadingSpinner({ label, size = "md" }: LoadingSpinnerProps) {
  const sizeClass = size === "sm" ? "h-5 w-5 border-2" : "h-8 w-8 border-[3px]";

  return (
    <div className="flex flex-col items-center justify-center gap-3" role="status" aria-live="polite">
      <div
        className={`${sizeClass} animate-spin rounded-full border-sky-200 border-t-sky-600`}
        aria-hidden="true"
      />
      {label && <p className="text-sm text-gray-600">{label}</p>}
    </div>
  );
}
