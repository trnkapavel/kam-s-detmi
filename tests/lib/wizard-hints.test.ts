import { describe, expect, it } from "vitest";
import { emptyChild } from "@/components/check-in/ChildrenStep";
import { getProceedHint } from "@/lib/wizard-hints";

describe("getProceedHint", () => {
  it("upozorní na chybějící energii a čas", () => {
    expect(
      getProceedHint({
        step: 1,
        energy: null,
        timeAvailable: null,
        children: [emptyChild()],
        familyIntents: [],
        weatherReady: true,
      }),
    ).toBe("Vyber, jak se cítíš, a kolik máš času.");
  });

  it("upozorní na chybějící intenty u jednoho dítěte", () => {
    expect(
      getProceedHint({
        step: 2,
        energy: "ok",
        timeAvailable: "few_hours",
        children: [{ ...emptyChild(), mood: "calm", soloIntents: [] }],
        familyIntents: [],
        weatherReady: true,
      }),
    ).toBe("Ještě vyber, co dítě chce dělat.");
  });

  it("nevrátí hint, když je krok kompletní", () => {
    expect(
      getProceedHint({
        step: 1,
        energy: "ok",
        timeAvailable: "few_hours",
        children: [emptyChild()],
        familyIntents: [],
        weatherReady: true,
      }),
    ).toBeNull();
  });
});
