import type { ReactNode } from "react";

type AnimatedStepProps = {
  stepKey: number | string;
  children: ReactNode;
};

export function AnimatedStep({ stepKey, children }: AnimatedStepProps) {
  return (
    <div key={stepKey} className="animate-step">
      {children}
    </div>
  );
}
