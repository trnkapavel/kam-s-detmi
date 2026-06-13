import { Star } from "lucide-react";
import { formatReviewCount } from "@/lib/labels";

type StarRatingProps = {
  rating: number;
  reviewCount: number;
  className?: string;
};

export function StarRating({ rating, reviewCount, className = "" }: StarRatingProps) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-lg bg-white/85 px-2.5 py-1.5 text-sm font-semibold text-ink shadow-sm backdrop-blur-sm ${className}`}
    >
      <Star size={15} className="fill-amber-400 text-amber-400" aria-hidden="true" />
      <span>{rating.toFixed(1)}</span>
      <span className="font-normal text-steel">({formatReviewCount(reviewCount)})</span>
    </div>
  );
}
