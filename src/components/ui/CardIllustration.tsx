import type { ReactNode } from "react";

type CardIllustrationProps = {
  children: ReactNode;
  position?: "top-right" | "bottom-right";
  size?: "md" | "lg";
};

const sizeClasses = {
  md: "w-[148px] sm:w-[168px]",
  lg: "w-[172px] sm:w-[200px]",
};

export function CardIllustration({
  children,
  position = "top-right",
  size = "md",
}: CardIllustrationProps) {
  const positionClass =
    position === "bottom-right"
      ? "bottom-0 right-0 translate-x-1 translate-y-1"
      : "top-0 right-0 -translate-y-0.5 translate-x-1";

  return (
    <div
      className={`card-illustration pointer-events-none absolute ${positionClass} ${sizeClasses[size]}`}
      aria-hidden="true"
    >
      {children}
    </div>
  );
}
