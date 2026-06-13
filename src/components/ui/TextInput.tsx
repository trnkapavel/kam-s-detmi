import type { InputHTMLAttributes } from "react";

type TextInputProps = InputHTMLAttributes<HTMLInputElement>;

export function TextInput({ className = "", ...props }: TextInputProps) {
  return (
    <input
      className={`glass min-h-12 w-full rounded-lg border border-hairline-strong px-4 text-base text-charcoal outline-none transition-all duration-200 placeholder:text-steel focus:border-primary focus:ring-2 focus:ring-primary/25 ${className}`}
      {...props}
    />
  );
}
