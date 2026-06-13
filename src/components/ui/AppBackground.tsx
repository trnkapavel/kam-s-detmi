import type { ReactNode } from "react";

type AppBackgroundProps = {
  children: ReactNode;
};

export function AppBackground({ children }: AppBackgroundProps) {
  return (
    <div className="app-shell">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
