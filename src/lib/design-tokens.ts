import type { RecommendationType } from "@/types";

export const RECOMMENDATION_CARD_STYLES: Record<
  RecommendationType,
  { bg: string; badgeBg: string; badgeText: string }
> = {
  single: {
    bg: "bg-card-cream",
    badgeBg: "bg-canvas",
    badgeText: "text-charcoal",
  },
  overlap: {
    bg: "bg-card-mint",
    badgeBg: "bg-card-mint",
    badgeText: "text-brand-green",
  },
  sequential: {
    bg: "bg-card-sky",
    badgeBg: "bg-card-sky",
    badgeText: "text-link",
  },
  compromise: {
    bg: "bg-card-peach",
    badgeBg: "bg-card-peach",
    badgeText: "text-brand-orange",
  },
  rotation: {
    bg: "bg-card-lavender",
    badgeBg: "bg-card-lavender",
    badgeText: "text-brand-purple",
  },
};
