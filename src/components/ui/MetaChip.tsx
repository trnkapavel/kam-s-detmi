import type { ReactNode } from "react";

type MetaChipProps = {
  icon?: ReactNode;
  children: ReactNode;
};

export function MetaChip({ icon, children }: MetaChipProps) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/70 px-2.5 py-1.5 text-[13px] font-medium text-charcoal glass">
      {icon}
      {children}
    </span>
  );
}
