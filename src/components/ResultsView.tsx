"use client";

import type { RecommendResult } from "@/engine";
import type { CheckIn, Recommendation } from "@/types";
import { RECOMMENDATION_TYPE_LABELS } from "@/lib/constants";
import { RECOMMENDATION_CARD_STYLES } from "@/lib/design-tokens";
import {
  Icon,
  RECOMMENDATION_ICONS,
  WEATHER_ICONS,
  ENERGY_ICONS,
  MapPin,
  Clock,
  Baby,
  PartyPopper,
} from "@/lib/icons";
import {
  energyLabel,
  moodLabel,
  timeLabel,
  wantsSummary,
  weatherLabel,
} from "@/lib/labels";
import { ActivityPreview } from "@/components/results/ActivityPreview";
import { SharePlanButton } from "@/components/results/SharePlanButton";
import { GlassCard } from "@/components/ui/GlassCard";

type ResultsSummaryProps = {
  checkIn: CheckIn;
  conflict: boolean;
};

export function ResultsSummary({ checkIn, conflict }: ResultsSummaryProps) {
  const WeatherIcon = WEATHER_ICONS[checkIn.weather.condition];
  const EnergyIcon = ENERGY_ICONS[checkIn.parent.energy];

  return (
    <GlassCard className="p-5" animate delay={1}>
      <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-slate">
        <MapPin size={18} strokeWidth={2} className="text-primary" aria-hidden="true" />
        Tvoje situace
      </h2>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-base text-charcoal">
        <span className="inline-flex items-center gap-1.5 font-medium">
          <MapPin size={16} className="text-primary" aria-hidden="true" />
          {checkIn.location.mesto}
        </span>
        <span className="text-steel">·</span>
        <span className="inline-flex items-center gap-1.5">
          <EnergyIcon size={16} className="text-primary" aria-hidden="true" />
          {energyLabel(checkIn.parent.energy)}
        </span>
        <span className="text-steel">·</span>
        <span className="inline-flex items-center gap-1.5">
          <WeatherIcon size={16} className="text-link" aria-hidden="true" />
          {weatherLabel(checkIn.weather.condition)} ({checkIn.weather.temp} °C)
        </span>
      </div>
      <div className="mt-3 space-y-1.5 text-base text-charcoal">
        {checkIn.children.map((child, index) => (
          <p key={index} className="flex items-start gap-2">
            <Baby size={18} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
            <span>
              {checkIn.children.length === 1 ? "" : `Dítě ${index + 1}: `}
              {child.age} let: {wantsSummary(child.wants)} ({moodLabel(child.mood)})
            </span>
          </p>
        ))}
      </div>
      <p className="mt-2 flex items-center gap-1.5 text-[15px] text-steel">
        <Clock size={15} aria-hidden="true" />
        {timeLabel(checkIn.parent.timeAvailable)}
      </p>
      {!conflict && checkIn.children.length > 1 && (
        <p className="mt-3 flex items-center gap-2 rounded-lg bg-card-mint px-3 py-2.5 text-base font-semibold text-brand-green glass-tint">
          <PartyPopper size={18} aria-hidden="true" />
          Super, shodujete se!
        </p>
      )}
    </GlassCard>
  );
}

type RecommendationCardProps = {
  recommendation: Recommendation;
  index: number;
  sharePlan?: {
    checkIn: CheckIn;
    recommendations: Recommendation[];
  };
};

export function RecommendationCard({ recommendation, index, sharePlan }: RecommendationCardProps) {
  const typeLabel = RECOMMENDATION_TYPE_LABELS[recommendation.type] ?? recommendation.type;
  const styles = RECOMMENDATION_CARD_STYLES[recommendation.type];
  const TypeIcon = RECOMMENDATION_ICONS[recommendation.type];

  return (
    <article
      className={`glass-tint rounded-xl p-6 ${styles.bg} animate-in-up`}
      style={{ animationDelay: `${0.08 * (index + 2)}s` }}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <span
          className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-[15px] font-semibold ${styles.badgeText}`}
        >
          <Icon icon={TypeIcon} size={16} strokeWidth={2.5} />
          {typeLabel}
        </span>
        {sharePlan && (
          <SharePlanButton
            checkIn={sharePlan.checkIn}
            recommendations={sharePlan.recommendations}
            variant="card"
          />
        )}
      </div>

      <div className="space-y-6">
        {recommendation.activities.map((activity) => (
          <ActivityPreview key={activity.id} activity={activity} />
        ))}
      </div>

      <p className="mt-5 border-t border-white/50 pt-4 text-base text-charcoal">
        <span className="font-semibold text-ink">Proč:</span> {recommendation.reason}
      </p>
    </article>
  );
}

export type RecommendResponse = RecommendResult;
