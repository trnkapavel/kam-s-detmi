"use client";

import { useState } from "react";
import { OptionButton } from "@/components/ui/OptionButton";
import { AgeStepper } from "@/components/ui/AgeStepper";
import { NumberStepper } from "@/components/ui/NumberStepper";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  ACTIVITY_OPTIONS,
  MAX_CHILDREN,
  MIN_CHILDREN,
  MOOD_OPTIONS,
} from "@/lib/constants";
import { maxWantsForChildCount } from "@/lib/children";
import { ACTIVITY_ICONS, MOOD_ICONS, Icon, PartyPopper } from "@/lib/icons";
import type { ActivityType, ChildInput, ChildMood } from "@/types";

export type ChildDraft = {
  age: number;
  wants: ActivityType[];
  mood: ChildMood | null;
};

export const emptyChild = (age = 5): ChildDraft => ({
  age,
  wants: [],
  mood: null,
});

type ChildrenStepProps = {
  children: ChildDraft[];
  onChildrenChange: (children: ChildDraft[]) => void;
  showAgreement: boolean;
};

export function ChildrenStep({ children, onChildrenChange, showAgreement }: ChildrenStepProps) {
  const [showAllActivities, setShowAllActivities] = useState<Record<number, boolean>>({});
  const childCount = children.length;
  const maxWants = maxWantsForChildCount(childCount);
  const featuredCount = 6;
  const featuredOptions = ACTIVITY_OPTIONS.slice(0, featuredCount);
  const hasMoreOptions = ACTIVITY_OPTIONS.length > featuredCount;

  function setChildCount(count: number) {
    if (count > children.length) {
      onChildrenChange([...children, ...Array.from({ length: count - children.length }, () => emptyChild())]);
      return;
    }
    onChildrenChange(children.slice(0, count));
  }

  function updateChild(index: number, next: ChildDraft) {
    onChildrenChange(children.map((child, i) => (i === index ? next : child)));
  }

  function toggleWant(index: number, want: ActivityType) {
    const child = children[index];
    const has = child.wants.includes(want);
    if (has) {
      updateChild(index, { ...child, wants: child.wants.filter((item) => item !== want) });
      return;
    }
    if (child.wants.length >= maxWants) {
      return;
    }
    updateChild(index, { ...child, wants: [...child.wants, want] });
  }

  function activityOptionsFor(index: number) {
    return showAllActivities[index] ? ACTIVITY_OPTIONS : featuredOptions;
  }

  return (
    <div className="space-y-5">
      <NumberStepper
        value={childCount}
        onChange={setChildCount}
        min={MIN_CHILDREN}
        max={MAX_CHILDREN}
        label="Kolik dětí jde s tebou?"
        suffix={childCount === 1 ? "dítě" : childCount < 5 ? "děti" : "dětí"}
      />

      {children.map((child, index) => (
        <GlassCard key={index} className="space-y-5 bg-surface/50 p-4" variant="tint">
          <h3 className="text-base font-bold text-ink">
            {childCount === 1 ? "Dítě" : `Dítě ${index + 1}`}
          </h3>

          <AgeStepper
            value={child.age}
            onChange={(age) => updateChild(index, { ...child, age })}
          />

          <div>
            <p className="mb-3 text-[15px] font-medium text-slate">
              Co dnes chce? (max {maxWants})
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {activityOptionsFor(index).map((option) => (
                <OptionButton
                  key={option.value}
                  selected={child.wants.includes(option.value)}
                  onClick={() => toggleWant(index, option.value)}
                  icon={<Icon icon={ACTIVITY_ICONS[option.value]} size={18} />}
                >
                  {option.label}
                </OptionButton>
              ))}
            </div>
            {hasMoreOptions && !showAllActivities[index] && (
              <button
                type="button"
                onClick={() => setShowAllActivities((current) => ({ ...current, [index]: true }))}
                className="mt-3 text-sm font-semibold text-link hover:underline"
              >
                Zobrazit všechny možnosti
              </button>
            )}
          </div>

          <div>
            <p className="mb-3 text-[15px] font-medium text-slate">Nálada</p>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              {MOOD_OPTIONS.map((option) => (
                <OptionButton
                  key={option.value}
                  selected={child.mood === option.value}
                  onClick={() => updateChild(index, { ...child, mood: option.value })}
                  icon={<Icon icon={MOOD_ICONS[option.value]} size={18} />}
                >
                  {option.label}
                </OptionButton>
              ))}
            </div>
          </div>
        </GlassCard>
      ))}

      {showAgreement && (
        <div className="flex items-center gap-2.5 rounded-xl bg-card-mint px-4 py-3.5 text-base font-semibold text-brand-green glass-tint animate-scale-in">
          <PartyPopper size={20} aria-hidden="true" />
          Super, shodujete se!
        </div>
      )}
    </div>
  );
}

export function parseChildDraft(draft: ChildDraft): ChildInput | null {
  if (draft.age < 1 || draft.age > 17 || draft.wants.length === 0 || !draft.mood) {
    return null;
  }
  return { age: draft.age, wants: draft.wants, mood: draft.mood };
}

export function parseAllChildren(drafts: ChildDraft[]): ChildInput[] | null {
  const parsed = drafts.map(parseChildDraft);
  if (parsed.some((child) => child === null)) {
    return null;
  }
  return parsed as ChildInput[];
}
