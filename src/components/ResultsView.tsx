import type { RecommendResult } from "@/engine";
import type { CheckIn, Recommendation } from "@/types";
import { RECOMMENDATION_TYPE_LABELS } from "@/lib/constants";
import {
  energyLabel,
  moodLabel,
  timeLabel,
  wantsSummary,
  weatherLabel,
} from "@/lib/labels";

type ResultsSummaryProps = {
  checkIn: CheckIn;
  conflict: boolean;
};

export function ResultsSummary({ checkIn, conflict }: ResultsSummaryProps) {
  const [child1, child2] = checkIn.children;

  return (
    <section className="rounded-2xl bg-sky-50 p-4">
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-sky-800">
        Tvoje situace
      </h2>
      <p className="text-sm text-gray-700">
        📍 {checkIn.location.mesto} · {energyLabel(checkIn.parent.energy)} ·{" "}
        {weatherLabel(checkIn.weather.condition)} ({checkIn.weather.temp} °C)
      </p>
      <p className="mt-1 text-sm text-gray-700">
        👧 {child1.age} let: {wantsSummary(child1.wants)} ({moodLabel(child1.mood)})
      </p>
      <p className="text-sm text-gray-700">
        👦 {child2.age} let: {wantsSummary(child2.wants)} ({moodLabel(child2.mood)})
      </p>
      <p className="mt-1 text-xs text-gray-500">⏱ {timeLabel(checkIn.parent.timeAvailable)}</p>
      {!conflict && (
        <p className="mt-2 text-sm font-medium text-emerald-700">Super, shodujete se! 🎉</p>
      )}
    </section>
  );
}

type RecommendationCardProps = {
  recommendation: Recommendation;
};

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const typeLabel = RECOMMENDATION_TYPE_LABELS[recommendation.type] ?? recommendation.type;

  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-800">
          {typeLabel}
        </span>
      </div>

      <div className="space-y-3">
        {recommendation.activities.map((activity) => (
          <div key={activity.id}>
            <h3 className="text-lg font-semibold text-gray-900">{activity.name}</h3>
            <p className="mt-1 text-sm text-gray-600">{activity.description}</p>
            {activity.url && (
              <a
                href={activity.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-sm font-medium text-sky-700 underline"
              >
                Více informací
              </a>
            )}
          </div>
        ))}
      </div>

      <p className="mt-3 border-t border-gray-100 pt-3 text-sm text-gray-700">
        <span className="font-medium">Proč:</span> {recommendation.reason}
      </p>
    </article>
  );
}

export type RecommendResponse = RecommendResult;
