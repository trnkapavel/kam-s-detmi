import type { ChildDraft } from "@/components/check-in/ChildrenStep";
import type { IntentType } from "@/lib/intents";
import type { ParentEnergy, TimeAvailable } from "@/types";

type ProceedHintInput = {
  step: number;
  energy: ParentEnergy | null;
  timeAvailable: TimeAvailable | null;
  children: ChildDraft[];
  familyIntents: IntentType[];
  weatherReady: boolean;
};

function getChildrenProceedHint(children: ChildDraft[], familyIntents: IntentType[]): string {
  const isSolo = children.length === 1;

  if (isSolo) {
    const child = children[0];
    if (child.soloIntents.length === 0 && !child.mood) {
      return "Ještě vyber, co dítě chce dělat, a jeho náladu.";
    }
    if (child.soloIntents.length === 0) {
      return "Ještě vyber, co dítě chce dělat.";
    }
    if (!child.mood) {
      return "Ještě vyber náladu dítěte.";
    }
    return "Doplň údaje o dítěti.";
  }

  const missing: string[] = [];
  if (familyIntents.length === 0) {
    missing.push("alespoň jeden společný směr pro rodinu");
  }

  children.forEach((child, index) => {
    if (!child.mood) {
      missing.push(`náladu u dítěte ${index + 1}`);
    }
    if (child.wantsDifferent && child.customIntents.length === 0) {
      missing.push(`jiný směr u dítěte ${index + 1}`);
    }
  });

  if (missing.length === 1) {
    return `Ještě vyber ${missing[0]}.`;
  }
  if (missing.length > 1) {
    return `Ještě doplň: ${missing.join(", ")}.`;
  }
  return "Doplň údaje o dětech.";
}

export function getProceedHint(input: ProceedHintInput): string | null {
  const { step, energy, timeAvailable, children, familyIntents, weatherReady } = input;

  switch (step) {
    case 1: {
      if (!energy && !timeAvailable) {
        return "Vyber, jak se cítíš, a kolik máš času.";
      }
      if (!energy) {
        return "Vyber, jak se dnes cítíš.";
      }
      if (!timeAvailable) {
        return "Vyber, kolik máš času.";
      }
      return null;
    }
    case 2:
      return getChildrenProceedHint(children, familyIntents);
    case 3:
      return weatherReady ? null : "Počkaj na načtení počasí, nebo ho vyber ručně.";
    default:
      return null;
  }
}
