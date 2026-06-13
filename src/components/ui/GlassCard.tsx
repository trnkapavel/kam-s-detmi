import type { ReactNode } from "react";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
  variant?: "default" | "strong" | "tint";
  animate?: boolean;
  delay?: number;
};

export function GlassCard({
  children,
  className = "",
  variant = "default",
  animate = false,
  delay,
}: GlassCardProps) {
  const glassClass =
    variant === "strong" ? "glass-strong" : variant === "tint" ? "glass-tint" : "glass";

  const delayClass =
    delay === 1 ? "stagger-1" : delay === 2 ? "stagger-2" : delay === 3 ? "stagger-3" : delay === 4 ? "stagger-4" : delay === 5 ? "stagger-5" : "";

  return (
    <div
      className={`rounded-xl ${glassClass} ${animate ? `animate-in-up ${delayClass}` : ""} ${className}`}
    >
      {children}
    </div>
  );
}
