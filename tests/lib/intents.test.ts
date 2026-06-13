import { describe, expect, it } from "vitest";
import { intentsToWants, wantsToIntentSummary } from "@/lib/intents";

describe("intents", () => {
  it("mapuje vodu na vodní aktivity", () => {
    const wants = intentsToWants(["voda"]);
    expect(wants).toContain("bazen");
    expect(wants).toContain("aquapark");
  });

  it("shrnuje wants zpět do intent labelů", () => {
    const summary = wantsToIntentSummary(["bazen", "aquapark"]);
    expect(summary).toContain("Voda");
  });
});
