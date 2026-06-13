import type { ReactNode } from "react";

type PageShellProps = {
  children: ReactNode;
  className?: string;
};

/** Centruje obsah na mobilu; na desktopu využije širší plátno. */
export function PageShell({ children, className = "" }: PageShellProps) {
  return (
    <div className={`mx-auto w-full max-w-lg lg:max-w-6xl xl:max-w-7xl ${className}`}>
      {children}
    </div>
  );
}
