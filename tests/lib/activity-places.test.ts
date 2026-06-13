import { describe, expect, it } from "vitest";
import { buildPlaceMeta, dedupeImages, isWikimediaUrl } from "@/lib/activity-places";
import type { Activity } from "@/types";

describe("isWikimediaUrl", () => {
  it("rozpozná Wikimedia URL", () => {
    expect(
      isWikimediaUrl(
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Hrad_Karlstejn_00.jpg/1280px-Hrad_Karlstejn_00.jpg",
      ),
    ).toBe(true);
  });

  it("odmítne Unsplash", () => {
    expect(
      isWikimediaUrl("https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200"),
    ).toBe(false);
  });
});

describe("dedupeImages", () => {
  it("odstraní stejnou fotku v různém rozlišení", () => {
    const images = dedupeImages([
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Stromovka_Park_Prague.jpg/640px-Stromovka_Park_Prague.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Stromovka_Park_Prague.jpg/1280px-Stromovka_Park_Prague.jpg",
    ]);

    expect(images).toHaveLength(1);
    expect(images[0]).toContain("1280px-");
  });

  it("ignoruje ne-Wikimedia URL", () => {
    const images = dedupeImages([
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Hrad_Karlstejn_00.jpg/1280px-Hrad_Karlstejn_00.jpg",
    ]);

    expect(images).toHaveLength(1);
    expect(images[0]).toContain("wikimedia");
  });
});

describe("buildPlaceMeta", () => {
  const activity: Activity = {
    id: "test-place",
    name: "Test",
    description: "Popis",
    region: { kraj: "Praha", okres: "Praha", mesto: "Praha" },
    tags: {
      type: ["park"],
      ageMin: 3,
      ageMax: 12,
      energyParent: ["low"],
      weather: ["any"],
      duration: "few_hours",
    },
    conflictResolvers: ["overlap"],
  };

  it("nepoužije Unsplash z places.json", () => {
    const place = buildPlaceMeta({
      ...activity,
      id: "praha-aquapalace",
    });

    if (place.image) {
      expect(place.image).toContain("wikimedia");
    }
  });

  it("vrátí prázdnou fotku když není Wikimedia zdroj", () => {
    const place = buildPlaceMeta({
      ...activity,
      id: "neexistujici-misto-bez-fotky-xyz",
    });

    expect(place.image).toBe("");
    expect(place.images).toEqual([]);
  });
});
