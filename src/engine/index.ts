import type { Activity, CheckIn, Recommendation } from "@/types";
import { buildRecommendations, hasConflict } from "./conflict";
import { filterActivities } from "./filter";
import { scoreActivities } from "./score";

export type RecommendOptions = {
  activities: Activity[];
  checkIn: CheckIn;
};

export type RecommendResult = {
  recommendations: Recommendation[];
  conflict: boolean;
  filteredCount: number;
};

export function recommend(options: RecommendOptions): RecommendResult {
  const filtered = filterActivities(options.activities, options.checkIn);
  const scored = scoreActivities(filtered, options.checkIn);
  const recommendations = buildRecommendations(scored, options.checkIn);

  return {
    recommendations,
    conflict: hasConflict(options.checkIn),
    filteredCount: filtered.length,
  };
}

export { filterActivities } from "./filter";
export { scoreActivities, scoreActivity } from "./score";
export {
  buildRecommendations,
  hasConflict,
  resolveConflict,
} from "./conflict";
