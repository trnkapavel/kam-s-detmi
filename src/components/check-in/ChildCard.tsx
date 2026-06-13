import type { ReactNode } from "react";
import { Baby } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { moodLabel } from "@/lib/labels";

const CHILD_CARD_STYLES = [
  {
    header: "bg-card-lavender",
    border: "border-primary/35",
    badge: "bg-primary text-white",
  },
  {
    header: "bg-card-mint",
    border: "border-brand-green/35",
    badge: "bg-brand-green text-white",
  },
  {
    header: "bg-card-sky",
    border: "border-link/35",
    badge: "bg-link text-white",
  },
  {
    header: "bg-card-peach",
    border: "border-brand-orange/40",
    badge: "bg-brand-orange text-white",
  },
] as const;

type ChildCardProps = {
  index: number;
  total: number;
  age: number;
  mood: import("@/types").ChildMood | null;
  children: ReactNode;
};

export function ChildCard({ index, total, age, mood, children }: ChildCardProps) {
  const style = CHILD_CARD_STYLES[index % CHILD_CARD_STYLES.length];
  const label = total === 1 ? "Dítě" : `Dítě ${index + 1}`;
  const subtitle = mood
    ? `${age} let · ${moodLabel(mood)}`
    : `${age} let · doplň náladu`;

  return (
    <GlassCard
      className={`overflow-hidden border-2 ${style.border} p-0`}
      variant="tint"
    >
      <div className={`flex items-center gap-3 px-4 py-3.5 ${style.header}`}>
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg font-bold shadow-sm ${style.badge}`}
          aria-hidden="true"
        >
          {total === 1 ? <Baby size={22} strokeWidth={2.25} /> : index + 1}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold tracking-tight text-ink">{label}</h3>
          <p className="truncate text-[13px] font-medium text-slate">{subtitle}</p>
        </div>
        {total > 1 && (
          <Baby size={22} className="shrink-0 text-primary/70" strokeWidth={2} aria-hidden="true" />
        )}
      </div>

      <div className="space-y-5 p-4 pt-5">{children}</div>
    </GlassCard>
  );
}
