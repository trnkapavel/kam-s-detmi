import { describe, expect, it } from "vitest";
import { buildChildNotes } from "@/engine/child-notes";
import type { Activity, CheckIn } from "@/types";

const baseCheckIn: CheckIn = {
  location: { mesto: "Praha", kraj: "Praha" },
  parent: { energy: "ok", timeAvailable: "half_day" },
  children: [
    { age: 5, wants: ["bazen"], mood: "active" },
    { age: 8, wants: ["les"], mood: "calm" },
  ],
  weather: { condition: "sunny", temp: 20, source: "manual" },
};

function activity(overrides: Partial<Activity> & Pick<Activity, "id" | "name">): Activity {
  return {
    description: "",
    region: { kraj: "Praha", okres: "Praha", mesto: "Praha" },
    tags: {
      type: ["park"],
      ageMin: 0,
      ageMax: 17,
      energyParent: ["low", "medium", "high"],
      weather: ["any"],
      duration: "half_day",
    },
    conflictResolvers: ["overlap"],
    ...overrides,
  };
}

describe("buildChildNotes", () => {
  it("describes overlap satisfaction per child", () => {
    const overlapActivity = activity({
      id: "hostivar",
      name: "Hostivařská přehrada",
      tags: {
        type: ["bazen", "les"],
        ageMin: 0,
        ageMax: 17,
        energyParent: ["medium"],
        weather: ["sunny"],
        duration: "half_day",
      },
    });

    const notes = buildChildNotes("overlap", [overlapActivity], baseCheckIn);

    expect(notes).toHaveLength(2);
    expect(notes[0]).toMatch(/Dítě 1/i);
    expect(notes[0]).toContain("Bazén");
    expect(notes[0]).toContain("✓");
    expect(notes[1]).toContain("Les");
    expect(notes[1]).toContain("✓");
  });

  it("marks partial compromise with tilde when wants do not match", () => {
    const compromiseActivity = activity({
      id: "park",
      name: "Park Stromovka",
      tags: {
        type: ["park"],
        ageMin: 0,
        ageMax: 17,
        energyParent: ["low"],
        weather: ["any"],
        duration: "few_hours",
      },
      conflictResolvers: ["compromise"],
    });

    const notes = buildChildNotes("compromise", [compromiseActivity], baseCheckIn);

    expect(notes[0]).toContain("~");
    expect(notes[1]).toContain("~");
  });

  it("maps each child to a sequential stop", () => {
    const notes = buildChildNotes(
      "sequential",
      [
        activity({ id: "aqua", name: "Aquapalace", tags: { type: ["bazen"], ageMin: 0, ageMax: 17, energyParent: ["medium"], weather: ["indoor_only"], duration: "half_day" } }),
        activity({ id: "strom", name: "Stromovka", tags: { type: ["les", "park"], ageMin: 0, ageMax: 17, energyParent: ["low"], weather: ["any"], duration: "few_hours" } }),
      ],
      baseCheckIn,
    );

    expect(notes[0]).toContain("Aquapalace");
    expect(notes[1]).toContain("Stromovka");
  });

  it("explains rotation for two children", () => {
    const notes = buildChildNotes(
      "rotation",
      [
        activity({ id: "a", name: "Bazén A" }),
        activity({ id: "b", name: "Les B", tags: { type: ["les"], ageMin: 0, ageMax: 17, energyParent: ["medium"], weather: ["any"], duration: "half_day" } }),
      ],
      baseCheckIn,
    );

    expect(notes[0]).toContain("Bazén A");
    expect(notes[1]).toContain("Les B");
  });

  it("returns single-match notes with checkmarks", () => {
    const notes = buildChildNotes(
      "single",
      [activity({ id: "zoo", name: "Zoo Praha", tags: { type: ["zoo"], ageMin: 0, ageMax: 17, energyParent: ["medium"], weather: ["any"], duration: "full_day" } })],
      {
        ...baseCheckIn,
        children: [
          { age: 4, wants: ["zoo"], mood: "active" },
          { age: 7, wants: ["zoo"], mood: "calm" },
        ],
      },
    );

    expect(notes).toHaveLength(2);
    expect(notes.every((note) => note.includes("✓"))).toBe(true);
  });
});
