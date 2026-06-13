# Víkendový plán v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a weekend-ready results experience — share plan, timeline sequential tips, per-child conflict notes, check-in memory, and local feedback — without backend changes.

**Architecture:** Extend `Recommendation` with `schedule`, `childNotes`, and `alternativeId` in the deterministic engine; add small pure lib modules for share/prefs/feedback/maps; compose new result UI components on `/vysledky` and a prefs banner in `CheckInWizard`.

**Tech Stack:** Next.js 16, TypeScript, Vitest, Tailwind, sessionStorage/localStorage, Web Share API

**Design spec:** [docs/superpowers/specs/2026-06-13-weekend-plan-v1-design.md](../specs/2026-06-13-weekend-plan-v1-design.md)

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/types/index.ts` | Modify | `ScheduleSlot`, extended `Recommendation` |
| `src/engine/schedule.ts` | Create | Time slots for sequential plans |
| `src/engine/child-notes.ts` | Create | Per-child explanation strings |
| `src/engine/distance-score.ts` | Create | Distance bonus/penalty from city |
| `src/engine/score.ts` | Modify | Call distance adjustment |
| `src/engine/conflict.ts` | Modify | Attach schedule, childNotes, alternativeId |
| `src/lib/maps-links.ts` | Create | Apple/Google maps URLs |
| `src/lib/plan-share.ts` | Create | Share text builder + share action |
| `src/lib/check-in-prefs.ts` | Create | localStorage prefs save/load |
| `src/lib/weekend-feedback.ts` | Create | Feedback store + export |
| `src/components/results/PlanTimeline.tsx` | Create | Sequential timeline UI |
| `src/components/results/SharePlanButton.tsx` | Create | Header share button |
| `src/components/results/WeekendFeedback.tsx` | Create | 👍/👎 panel |
| `src/components/check-in/PrefsRestoreBanner.tsx` | Create | Restore last check-in |
| `src/components/ResultsView.tsx` | Modify | childNotes, alternative, timeline |
| `src/app/vysledky/page.tsx` | Modify | Share button, feedback panel |
| `src/components/CheckInWizard.tsx` | Modify | Prefs banner + save prefs on submit |
| `src/components/results/ActivityPreview.tsx` | Modify | Use `maps-links.ts` |
| `tests/engine/schedule.test.ts` | Create | Schedule unit tests |
| `tests/engine/child-notes.test.ts` | Create | Child notes tests |
| `tests/engine/distance-score.test.ts` | Create | Distance tests |
| `tests/lib/plan-share.test.ts` | Create | Share text tests |
| `tests/lib/check-in-prefs.test.ts` | Create | Prefs tests |
| `tests/lib/weekend-feedback.test.ts` | Create | Feedback tests |

---

### Task 1: Extend types

**Files:**
- Modify: `src/types/index.ts`

- [ ] **Step 1: Add ScheduleSlot and extend Recommendation**

```ts
export type ScheduleSlot = {
  label: string;
  timeHint: string;
  activityId: string;
};

export type Recommendation = {
  type: RecommendationType;
  activities: Activity[];
  reason: string;
  score: number;
  schedule?: ScheduleSlot[];
  childNotes?: string[];
  alternativeId?: string;
};
```

- [ ] **Step 2: Run typecheck**

Run: `npm run build`
Expected: PASS (no type errors)

---

### Task 2: Schedule engine

**Files:**
- Create: `src/engine/schedule.ts`
- Create: `tests/engine/schedule.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
import { describe, expect, it } from "vitest";
import { buildSchedule } from "@/engine/schedule";
import type { Activity } from "@/types";

const activity = (id: string): Activity =>
  ({
    id,
    name: id,
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
  }) as Activity;

describe("buildSchedule", () => {
  it("returns one slot for few_hours", () => {
    const slots = buildSchedule("few_hours", [activity("a"), activity("b")]);
    expect(slots).toHaveLength(1);
    expect(slots[0].activityId).toBe("a");
    expect(slots[0].timeHint).toBeTruthy();
  });

  it("returns two slots for half_day with two activities", () => {
    const slots = buildSchedule("half_day", [activity("a"), activity("b")]);
    expect(slots).toHaveLength(2);
    expect(slots[0].label).toMatch(/Dopoledne/i);
    expect(slots[1].label).toMatch(/Odpoledne/i);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/engine/schedule.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Implement buildSchedule**

```ts
import type { Activity, ScheduleSlot, TimeAvailable } from "@/types";

const SLOT_TEMPLATES: Record<
  TimeAvailable,
  Array<{ label: string; timeHint: string }>
> = {
  few_hours: [{ label: "Teď", timeHint: "nejbližší volno" }],
  half_day: [
    { label: "Dopoledne", timeHint: "9:00–12:00" },
    { label: "Odpoledne", timeHint: "13:00–16:00" },
  ],
  full_day: [
    { label: "Dopoledne", timeHint: "9:00–12:00" },
    { label: "Odpoledne", timeHint: "13:00–16:00" },
    { label: "Večer", timeHint: "17:00–19:00" },
  ],
};

export function buildSchedule(
  timeAvailable: TimeAvailable,
  activities: Activity[],
): ScheduleSlot[] {
  const templates = SLOT_TEMPLATES[timeAvailable];
  const count = Math.min(templates.length, activities.length);

  return templates.slice(0, count).map((template, index) => ({
    ...template,
    activityId: activities[index].id,
  }));
}
```

- [ ] **Step 4: Run tests**

Run: `npm test -- tests/engine/schedule.test.ts`
Expected: PASS

---

### Task 3: Child notes engine

**Files:**
- Create: `src/engine/child-notes.ts`
- Create: `tests/engine/child-notes.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
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

describe("buildChildNotes", () => {
  it("describes overlap satisfaction per child", () => {
    const activity = {
      tags: { type: ["bazen", "park"] },
    } as Activity;
    const notes = buildChildNotes("overlap", [activity], baseCheckIn);
    expect(notes.length).toBe(2);
    expect(notes[0]).toMatch(/Dítě 1/i);
    expect(notes[1]).toMatch(/Dítě 2/i);
  });
});
```

- [ ] **Step 2: Run test — expect FAIL**

- [ ] **Step 3: Implement buildChildNotes**

```ts
import type { Activity, CheckIn, RecommendationType } from "@/types";
import { ACTIVITY_TYPE_LABELS } from "@/lib/constants";

function wantLabel(want: string): string {
  return ACTIVITY_TYPE_LABELS[want as keyof typeof ACTIVITY_TYPE_LABELS] ?? want;
}

function childWantsLine(childIndex: number, wants: string[]): string {
  const label = wants.map(wantLabel).join(", ");
  return `Dítě ${childIndex + 1}: ${label}`;
}

export function buildChildNotes(
  type: RecommendationType,
  activities: Activity[],
  checkIn: CheckIn,
): string[] {
  if (checkIn.children.length === 0) {
    return [];
  }

  if (type === "single") {
    return checkIn.children.map((child, index) => {
      const matched = child.wants.filter((want) =>
        activities[0]?.tags.type.includes(want),
      );
      const wants = matched.length > 0 ? matched : child.wants.slice(0, 1);
      return `${childWantsLine(index, wants)} ✓`;
    });
  }

  if (type === "overlap" || type === "compromise") {
    return checkIn.children.map((child, index) => {
      const activity = activities[0];
      const matched = child.wants.filter((want) => activity?.tags.type.includes(want));
      const suffix = matched.length > 0 ? " ✓" : " ~";
      return `${childWantsLine(index, matched.length > 0 ? matched : child.wants.slice(0, 1))}${suffix}`;
    });
  }

  if (type === "sequential") {
    return checkIn.children.map((child, index) => {
      const activity = activities[index];
      const name = activity?.name ?? "tip";
      return `Dítě ${index + 1} → ${name}`;
    });
  }

  if (type === "rotation") {
    const today = activities[0]?.name ?? "první volba";
    const next = activities[1]?.name ?? "druhá volba";
    if (checkIn.children.length === 2) {
      return [
        `Dnes: ${today} (priorita dítěte 1)`,
        `Příště: ${next} (priorita dítěte 2)`,
      ];
    }
    return [`Dnes: ${today}`, `Příště střídejte další tipy`];
  }

  return [];
}
```

Note: import `ACTIVITY_TYPE_LABELS` only if it exists; otherwise use a small local map mirroring wizard labels.

- [ ] **Step 4: Run tests — expect PASS**

---

### Task 4: Distance scoring

**Files:**
- Create: `src/engine/distance-score.ts`
- Create: `tests/engine/distance-score.test.ts`
- Modify: `src/engine/score.ts`

- [ ] **Step 1: Write failing distance tests**

```ts
import { describe, expect, it } from "vitest";
import { distanceScoreAdjustment } from "@/engine/distance-score";
import type { Activity, CheckIn } from "@/types";

const checkIn: CheckIn = {
  location: { mesto: "Praha", kraj: "Praha" },
  parent: { energy: "tired", timeAvailable: "half_day" },
  children: [{ age: 5, wants: ["park"], mood: "calm" }],
  weather: { condition: "cloudy", temp: 15, source: "manual" },
};

const near: Activity = {
  id: "near",
  coordinates: { lat: 50.08, lng: 14.42 },
} as Activity;

const far: Activity = {
  id: "far",
  coordinates: { lat: 48.81, lng: 14.32 },
} as Activity;

describe("distanceScoreAdjustment", () => {
  it("bonuses nearby activities", () => {
    expect(distanceScoreAdjustment(near, checkIn)).toBeGreaterThan(0);
  });

  it("penalizes far activities more for tired parent", () => {
    const penalty = distanceScoreAdjustment(far, checkIn);
    expect(penalty).toBeLessThan(-15);
  });
});
```

- [ ] **Step 2: Implement distanceScoreAdjustment**

Reuse haversine from `conflict.ts` — extract to `src/engine/geo.ts` if needed to avoid duplication:

```ts
// src/engine/geo.ts
export function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}
```

```ts
// src/engine/distance-score.ts
import { CITY_COORDS } from "@/lib/constants";
import type { Activity, CheckIn } from "@/types";
import { haversineKm } from "./geo";

export function distanceScoreAdjustment(activity: Activity, checkIn: CheckIn): number {
  if (!activity.coordinates) {
    return 0;
  }
  const origin = CITY_COORDS[checkIn.location.mesto];
  if (!origin) {
    return 0;
  }
  const km = haversineKm(origin, activity.coordinates);
  let adjustment = 0;
  if (km <= 10) adjustment = 10;
  else if (km <= 25) adjustment = 5;
  else if (km <= 50) adjustment = -15;
  else adjustment = -30;

  if (checkIn.parent.energy === "tired" && adjustment < 0) {
    adjustment = Math.round(adjustment * 1.5);
  }
  return adjustment;
}
```

- [ ] **Step 3: Wire into scoreActivity**

In `src/engine/score.ts`, at end of `scoreActivity`:

```ts
import { distanceScoreAdjustment } from "./distance-score";

// inside scoreActivity, before return:
score += distanceScoreAdjustment(activity, checkIn);
```

- [ ] **Step 4: Refactor conflict.ts to import haversine from geo.ts**

- [ ] **Step 5: Run all engine tests**

Run: `npm test -- tests/engine`
Expected: PASS

---

### Task 5: Enrich recommendations in conflict engine

**Files:**
- Modify: `src/engine/conflict.ts`
- Modify: `tests/engine/conflict.test.ts`

- [ ] **Step 1: Add enrichRecommendation helper**

```ts
import { buildSchedule } from "./schedule";
import { buildChildNotes } from "./child-notes";

function findAlternativeId(
  type: Recommendation["type"],
  primaryIds: Set<string>,
  scored: ScoredActivity[],
): string | undefined {
  const candidate = scored.find(
    ({ activity, score }) =>
      score > 0 &&
      !primaryIds.has(activity.id) &&
      (type === "single" || activity.conflictResolvers.includes(type as ConflictResolver)),
  );
  return candidate?.activity.id;
}

function enrichRecommendation(
  recommendation: Recommendation,
  checkIn: CheckIn,
  scored: ScoredActivity[],
): Recommendation {
  const primaryIds = new Set(recommendation.activities.map((a) => a.id));
  const enriched: Recommendation = {
    ...recommendation,
    childNotes: buildChildNotes(recommendation.type, recommendation.activities, checkIn),
    alternativeId: findAlternativeId(recommendation.type, primaryIds, scored),
  };
  if (recommendation.type === "sequential" && recommendation.activities.length >= 2) {
    enriched.schedule = buildSchedule(checkIn.parent.timeAvailable, recommendation.activities);
  }
  return enriched;
}
```

- [ ] **Step 2: Map enrichRecommendation in buildRecommendations and resolveConflict return paths**

```ts
return results.map((r) => enrichRecommendation(r, checkIn, scored));
```

- [ ] **Step 3: Add test assertion for sequential schedule**

In existing sequential test case in `conflict.test.ts`:

```ts
expect(sequential?.schedule?.length).toBeGreaterThanOrEqual(2);
expect(sequential?.childNotes?.length).toBeGreaterThanOrEqual(2);
```

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: PASS

---

### Task 6: Maps links helper

**Files:**
- Create: `src/lib/maps-links.ts`
- Modify: `src/components/results/ActivityPreview.tsx`

- [ ] **Step 1: Implement mapsLinks**

```ts
import type { Activity } from "@/types";

export function isAppleDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function mapsLinkForActivity(activity: Activity, placeMapsUrl?: string): string {
  if (isAppleDevice() && activity.coordinates) {
    const { lat, lng } = activity.coordinates;
    return `https://maps.apple.com/?ll=${lat},${lng}&q=${encodeURIComponent(activity.name)}`;
  }
  if (placeMapsUrl) return placeMapsUrl;
  if (activity.coordinates) {
    const { lat, lng } = activity.coordinates;
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${activity.name} ${activity.region.mesto}`)}`;
}
```

- [ ] **Step 2: Use in ActivityPreview**

Replace `place.mapsUrl` href with `mapsLinkForActivity(activity, place.mapsUrl)`.

---

### Task 7: Universal plan share (Web Share API)

**Files:**
- Create: `src/lib/plan-share.ts`
- Create: `tests/lib/plan-share.test.ts`
- Create: `src/components/results/SharePlanButton.tsx`

**Princip:** Jedno tlačítko → systémový share sheet (WhatsApp, iMessage, Mail, …). Žádné `whatsapp://` deep linky.

- [ ] **Step 1: Write failing tests**

```ts
import { describe, expect, it } from "vitest";
import { buildPlanShareText, canUseNativeShare } from "@/lib/plan-share";

describe("buildPlanShareText", () => {
  it("includes city, activities, and app url", () => {
    const text = buildPlanShareText({
      checkIn: {
        location: { mesto: "Praha", kraj: "Praha" },
        weather: { condition: "cloudy", temp: 15, source: "manual" },
      } as any,
      recommendations: [
        { type: "overlap", activities: [{ name: "Zoo Praha" }], reason: "test" },
      ],
      appUrl: "https://example.com",
    });
    expect(text).toContain("Praha");
    expect(text).toContain("Zoo Praha");
    expect(text).toContain("https://example.com");
  });
});

describe("canUseNativeShare", () => {
  it("returns false in node test env", () => {
    expect(canUseNativeShare()).toBe(false);
  });
});
```

- [ ] **Step 2: Implement plan-share module**

```ts
import type { CheckIn, Recommendation } from "@/types";

const TYPE_LABELS: Record<string, string> = {
  overlap: "Společně",
  sequential: "Sekvenční plán",
  compromise: "Kompromis",
  rotation: "Rotace",
  single: "Tip",
};

export type SharePlanPayload = {
  title: string;
  text: string;
  url: string;
};

export function canUseNativeShare(): boolean {
  return typeof navigator !== "undefined" && typeof navigator.share === "function";
}

export function buildPlanShareText(options: {
  checkIn: CheckIn;
  recommendations: Recommendation[];
  appUrl: string;
}): string {
  const { checkIn, recommendations, appUrl } = options;
  const lines = [
    `Kam s dětmi · ${checkIn.location.mesto}`,
    `${checkIn.weather.condition} (${checkIn.weather.temp} °C)`,
    "",
  ];
  for (const rec of recommendations) {
    const label = TYPE_LABELS[rec.type] ?? rec.type;
    lines.push(`${label}:`);
    if (rec.schedule && rec.schedule.length > 0) {
      rec.schedule.forEach((slot, i) => {
        const activity = rec.activities.find((a) => a.id === slot.activityId);
        lines.push(`  ${i + 1}. ${slot.timeHint} ${activity?.name ?? ""}`);
      });
    } else {
      rec.activities.forEach((a) => lines.push(`  · ${a.name}`));
    }
  }
  lines.push("", appUrl);
  return lines.join("\n");
}

export function buildPlanSharePayload(options: {
  checkIn: CheckIn;
  recommendations: Recommendation[];
  appUrl: string;
}): SharePlanPayload {
  const text = buildPlanShareText(options);
  return {
    title: "Kam s dětmi — tipy na výlet",
    text,
    url: options.appUrl,
  };
}

export type SharePlanResult = "shared" | "copied" | "cancelled";

export async function sharePlan(payload: SharePlanPayload): Promise<SharePlanResult> {
  if (canUseNativeShare()) {
    try {
      await navigator.share({
        title: payload.title,
        text: payload.text,
        url: payload.url,
      });
      return "shared";
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return "cancelled";
      }
      throw error;
    }
  }

  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(payload.text);
    return "copied";
  }

  throw new Error("Sdílení není v tomto prohlížeči podporováno");
}
```

- [ ] **Step 3: SharePlanButton with fallback modal**

```tsx
"use client";

import { useState } from "react";
import { buildPlanSharePayload, sharePlan } from "@/lib/plan-share";
import type { CheckIn, Recommendation } from "@/types";
import { Share } from "@/lib/icons"; // generic share icon, NOT WhatsApp
import { Button } from "@/components/ui/Button";

export function SharePlanButton({
  checkIn,
  recommendations,
}: {
  checkIn: CheckIn;
  recommendations: Recommendation[];
}) {
  const [status, setStatus] = useState<string | null>(null);
  const [fallbackText, setFallbackText] = useState<string | null>(null);

  async function handleShare() {
    const payload = buildPlanSharePayload({
      checkIn,
      recommendations,
      appUrl: window.location.origin,
    });

    try {
      const result = await sharePlan(payload);
      if (result === "shared") setStatus("Sdíleno");
      if (result === "copied") setStatus("Zkopírováno — vlož kam potřebuješ");
      if (result === "cancelled") return;
    } catch {
      setFallbackText(payload.text);
      return;
    }

    setTimeout(() => setStatus(null), 2500);
  }

  return (
    <>
      <div className="flex flex-col items-end gap-1">
        <Button variant="secondary" className="min-h-10 px-4 text-sm" onClick={() => void handleShare()}>
          <Share size={16} aria-hidden="true" />
          Sdílet
        </Button>
        {status && <span className="text-xs text-steel">{status}</span>}
      </div>

      {fallbackText && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/30 p-4 sm:items-center sm:justify-center">
          <div className="w-full max-w-md rounded-xl bg-white p-4 shadow-xl">
            <p className="mb-2 text-sm font-medium text-ink">Zkopíruj plán</p>
            <textarea readOnly className="h-40 w-full rounded-lg border p-3 text-sm" value={fallbackText} />
            <div className="mt-3 flex gap-2">
              <Button fullWidth onClick={() => void navigator.clipboard.writeText(fallbackText)}>
                Kopírovat
              </Button>
              <Button variant="secondary" fullWidth onClick={() => setFallbackText(null)}>
                Zavřít
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 4: Mount in vysledky/page.tsx header row**

- [ ] **Step 5: Run tests**

Run: `npm test -- tests/lib/plan-share.test.ts`
Expected: PASS

---

### Task 8: Plan timeline UI

**Files:**
- Create: `src/components/results/PlanTimeline.tsx`
- Modify: `src/components/ResultsView.tsx`

- [ ] **Step 1: Implement PlanTimeline**

```tsx
import type { Activity, ScheduleSlot } from "@/types";
import { mapsLinkForActivity } from "@/lib/maps-links";
import { Button } from "@/components/ui/Button";
import { Navigation } from "@/lib/icons";

export function PlanTimeline({
  schedule,
  activities,
}: {
  schedule: ScheduleSlot[];
  activities: Activity[];
}) {
  return (
    <ol className="relative space-y-4 border-l-2 border-primary/25 pl-5">
      {schedule.map((slot) => {
        const activity = activities.find((a) => a.id === slot.activityId);
        if (!activity) return null;
        return (
          <li key={slot.activityId} className="relative">
            <span className="absolute -left-[1.35rem] top-1 h-2.5 w-2.5 rounded-full bg-primary" />
            <p className="text-xs font-semibold uppercase tracking-wide text-steel">
              {slot.timeHint} · {slot.label}
            </p>
            <p className="text-base font-semibold text-ink">{activity.name}</p>
            <a href={mapsLinkForActivity(activity, activity.place?.mapsUrl)} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block">
              <Button variant="secondary" className="min-h-9 px-3 text-sm">
                <Navigation size={15} aria-hidden="true" />
                Mapy
              </Button>
            </a>
          </li>
        );
      })}
    </ol>
  );
}
```

- [ ] **Step 2: Render in RecommendationCard when schedule present**

Show `childNotes` as flex wrap chips above timeline.

Show alternative:

```tsx
{recommendation.alternativeId && (
  <p className="text-sm text-steel">
    Nebo zkus:{" "}
    <span className="font-medium text-link">
      {findActivityName(recommendation.alternativeId)}
    </span>
  </p>
)}
```

Pass `allActivities` from API response or collect from recommendations for name lookup.

---

### Task 9: Check-in prefs memory

**Files:**
- Create: `src/lib/check-in-prefs.ts`
- Create: `tests/lib/check-in-prefs.test.ts`
- Create: `src/components/check-in/PrefsRestoreBanner.tsx`
- Modify: `src/components/CheckInWizard.tsx`

- [ ] **Step 1: Implement prefs module**

```ts
import type { CheckIn } from "@/types";

const PREFS_KEY = "kam-s-detmi-check-in-prefs";
const DISMISS_KEY = "kam-s-detmi-prefs-dismissed";

export type CheckInPrefs = Pick<CheckIn, "location" | "parent" | "children">;

export function saveCheckInPrefs(checkIn: CheckIn): void {
  const prefs: CheckInPrefs = {
    location: checkIn.location,
    parent: checkIn.parent,
    children: checkIn.children,
  };
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}

export function loadCheckInPrefs(): CheckInPrefs | null {
  const raw = localStorage.getItem(PREFS_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CheckInPrefs;
  } catch {
    return null;
  }
}

export function isPrefsBannerDismissed(): boolean {
  return sessionStorage.getItem(DISMISS_KEY) === "1";
}

export function dismissPrefsBanner(): void {
  sessionStorage.setItem(DISMISS_KEY, "1");
}
```

- [ ] **Step 2: PrefsRestoreBanner**

Glass tint banner with „Použít nastavení z minulého týdne?“ [Ano] [Ne].

- [ ] **Step 3: Wire CheckInWizard**

- On mount: if prefs exist and not dismissed, show banner
- On Ano: apply prefs to wizard state
- On submit success (navigate to vysledky): `saveCheckInPrefs(checkIn)`

---

### Task 10: Weekend feedback

**Files:**
- Create: `src/lib/weekend-feedback.ts`
- Create: `tests/lib/weekend-feedback.test.ts`
- Create: `src/components/results/WeekendFeedback.tsx`
- Modify: `src/app/vysledky/page.tsx`

- [ ] **Step 1: Implement feedback store**

```ts
const FEEDBACK_KEY = "kam-s-detmi-weekend-feedback";
const SHOWN_KEY = "kam-s-detmi-feedback-shown";

export type WeekendFeedbackEntry = {
  date: string;
  mesto: string;
  outcome: "used" | "not_used" | "skipped";
  recommendationIndex?: number;
};

export function appendFeedback(entry: WeekendFeedbackEntry): void {
  const list = loadAllFeedback();
  list.push(entry);
  localStorage.setItem(FEEDBACK_KEY, JSON.stringify(list));
}

export function exportFeedbackMarkdown(): string {
  const list = loadAllFeedback();
  return list
    .map(
      (e) =>
        `### ${e.date} — ${e.mesto}\n\n**Použili jsme:** ${e.outcome}\n`,
    )
    .join("\n");
}
```

- [ ] **Step 2: WeekendFeedback UI**

Three buttons + optional „Exportovat feedback“ link.

- [ ] **Step 3: Show once per session on vysledky**

---

### Task 11: Final verification

- [ ] **Run full test suite**

Run: `npm test`
Expected: all pass

- [ ] **Run production build**

Run: `npm run build`
Expected: PASS

- [ ] **Manual iOS checklist**

1. Complete check-in → results show childNotes on conflict scenario
2. Sequential card shows timeline
3. Share opens iOS sheet or copies
4. New check-in offers prefs restore
5. Feedback panel saves and exports

---

## Spec Coverage Checklist

| Spec item | Task |
|-----------|------|
| A1 Sdílení | Task 7 |
| A2 Navigace | Task 6, 8 |
| A3 Paměť check-inu | Task 9 |
| A4 Feedback | Task 10 |
| B1 Timeline | Task 2, 8 |
| B2 Child notes | Task 3, 8 |
| B3 Alternativa B | Task 5, 8 |
| B4 Vzdálenost | Task 4 |

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-06-13-weekend-plan-v1.md`.

**Two execution options:**

1. **Subagent-Driven (recommended)** — fresh subagent per task, review between tasks
2. **Inline Execution** — implement task-by-task in this session with checkpoints

Which approach?
