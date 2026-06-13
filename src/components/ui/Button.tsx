import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "link";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  children: ReactNode;
  fullWidth?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "btn-glow text-white disabled:bg-hairline-strong disabled:text-steel disabled:shadow-none",
  secondary: "btn-glass text-ink disabled:opacity-50",
  link: "bg-transparent text-link underline-offset-2 hover:underline disabled:opacity-50 min-h-0 px-0 py-0",
};

export function Button({
  variant = "primary",
  children,
  fullWidth = false,
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  const isLink = variant === "link";

  return (
    <button
      type={type}
      className={`inline-flex min-h-12 items-center justify-center gap-2.5 rounded-lg px-5 py-3 text-base font-semibold disabled:cursor-not-allowed ${
        variantClasses[variant]
      } ${fullWidth ? "w-full" : ""} ${isLink ? "" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
