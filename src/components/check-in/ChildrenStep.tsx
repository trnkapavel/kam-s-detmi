"use client";

import { OptionButton } from "@/components/ui/OptionButton";
import { AgeStepper } from "@/components/ui/AgeStepper";
import { NumberStepper } from "@/components/ui/NumberStepper";
import { IntentPicker } from "@/components/ui/IntentPicker";
import { ChildCard } from "@/components/check-in/ChildCard";
import { MAX_CHILDREN, MIN_CHILDREN, MOOD_OPTIONS } from "@/lib/constants";
import {
  intentsToWants,
  MAX_CUSTOM_INTENTS,
  MAX_FAMILY_INTENTS,
  MAX_SINGLE_CHILD_INTENTS,
  type IntentType,
} from "@/lib/intents";
import { MOOD_ICONS, Icon, PartyPopper } from "@/lib/icons";
import type { ActivityType, ChildInput, ChildMood } from "@/types";

export type ChildDraft = {
  age: number;
  mood: ChildMood | null;
  wantsDifferent: boolean;
  customIntents: IntentType[];
  soloIntents: IntentType[];
};

export const emptyChild = (age = 5): ChildDraft => ({
  age,
  mood: null,
  wantsDifferent: false,
  customIntents: [],
  soloIntents: [],
});

type ChildrenStepProps = {
  children: ChildDraft[];
  familyIntents: IntentType[];
  onFamilyIntentsChange: (intents: IntentType[]) => void;
  onChildrenChange: (children: ChildDraft[]) => void;
  showAgreement: boolean;
};

export function ChildrenStep({
  children,
  familyIntents,
  onFamilyIntentsChange,
  onChildrenChange,
  showAgreement,
}: ChildrenStepProps) {
  const childCount = children.length;
  const isSolo = childCount === 1;

  function setChildCount(count: number) {
    if (count > children.length) {
      onChildrenChange([
        ...children,
        ...Array.from({ length: count - children.length }, () => emptyChild()),
      ]);
      return;
    }
    onChildrenChange(children.slice(0, count));
  }

  function updateChild(index: number, next: ChildDraft) {
    onChildrenChange(children.map((child, i) => (i === index ? next : child)));
  }

  function renderMoodPicker(child: ChildDraft, index: number) {
    return (
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
    );
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

      {isSolo ? (
        <ChildCard index={0} total={1} age={children[0].age} mood={children[0].mood}>
          <AgeStepper
            value={children[0].age}
            onChange={(age) => updateChild(0, { ...children[0], age })}
          />
          <IntentPicker
            label="Co dnes táhne?"
            hint="Vyber max 2 směry — tipy dopočítáme za tebe."
            intents={children[0].soloIntents}
            max={MAX_SINGLE_CHILD_INTENTS}
            onChange={(soloIntents) => updateChild(0, { ...children[0], soloIntents })}
          />
          {renderMoodPicker(children[0], 0)}
        </ChildCard>
      ) : (
        <>
          <IntentPicker
            label="Co dnes táhne celou rodinu?"
            hint="Společný směr pro všechny — max 2 volby."
            intents={familyIntents}
            max={MAX_FAMILY_INTENTS}
            onChange={onFamilyIntentsChange}
          />

          <p className="text-[15px] font-medium text-slate">Teď vyplň jednotlivé děti</p>

          {children.map((child, index) => (
            <ChildCard
              key={index}
              index={index}
              total={childCount}
              age={child.age}
              mood={child.mood}
            >
              <AgeStepper
                value={child.age}
                onChange={(age) => updateChild(index, { ...child, age })}
              />

              <div className="border-t border-hairline/70 pt-4">
                <OptionButton
                  selected={child.wantsDifferent}
                  onClick={() =>
                    updateChild(index, {
                      ...child,
                      wantsDifferent: !child.wantsDifferent,
                      customIntents: child.wantsDifferent ? [] : child.customIntents,
                    })
                  }
                  className="w-full"
                >
                  Chce něco jiného než rodina
                </OptionButton>
              </div>

              {child.wantsDifferent && (
                <IntentPicker
                  label="Jiný směr"
                  hint="Jedna volba, která přebije rodinný výběr."
                  intents={child.customIntents}
                  max={MAX_CUSTOM_INTENTS}
                  onChange={(customIntents) => updateChild(index, { ...child, customIntents })}
                />
              )}

              {renderMoodPicker(child, index)}
            </ChildCard>
          ))}
        </>
      )}

      {showAgreement && (
        <div className="flex items-center gap-2.5 rounded-xl bg-card-mint px-4 py-3.5 text-base font-semibold text-brand-green glass-tint animate-scale-in">
          <PartyPopper size={20} aria-hidden="true" />
          Super, shodujete se!
        </div>
      )}
    </div>
  );
}

function resolveChildWants(
  draft: ChildDraft,
  familyIntents: IntentType[],
  isSolo: boolean,
): ActivityType[] {
  if (isSolo) {
    return intentsToWants(draft.soloIntents);
  }
  if (draft.wantsDifferent && draft.customIntents.length > 0) {
    return intentsToWants(draft.customIntents);
  }
  return intentsToWants(familyIntents);
}

export function parseChildDraft(
  draft: ChildDraft,
  familyIntents: IntentType[],
  isSolo: boolean,
): ChildInput | null {
  const wants = resolveChildWants(draft, familyIntents, isSolo);
  if (draft.age < 1 || draft.age > 17 || wants.length === 0 || !draft.mood) {
    return null;
  }
  return { age: draft.age, wants, mood: draft.mood };
}

export function parseAllChildren(
  drafts: ChildDraft[],
  familyIntents: IntentType[],
): ChildInput[] | null {
  const isSolo = drafts.length === 1;
  const parsed = drafts.map((draft) => parseChildDraft(draft, familyIntents, isSolo));
  if (parsed.some((child) => child === null)) {
    return null;
  }
  return parsed as ChildInput[];
}
