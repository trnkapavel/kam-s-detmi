"use client";

import Image from "next/image";
import { useState } from "react";
import type { Activity, ActivityPlace } from "@/types";
import { ACTIVITY_HERO_BACKGROUNDS, primaryActivityType } from "@/lib/activity-type";
import { mapsLinkForActivity } from "@/lib/maps-links";
import {
  ageRangeLabel,
  activityLabel,
  durationLabel,
  weatherFitLabel,
} from "@/lib/labels";
import { ActivityTypeIllustration } from "@/components/illustrations/ActivityTypeIllustration";
import { MetaChip } from "@/components/ui/MetaChip";
import { StarRating } from "@/components/ui/StarRating";
import { Button } from "@/components/ui/Button";
import {
  Baby,
  Clock,
  Coins,
  ExternalLink,
  MapPin,
  Navigation,
} from "@/lib/icons";

type ActivityPreviewProps = {
  activity: Activity;
};

export function ActivityPreview({ activity }: ActivityPreviewProps) {
  const place = activity.place;
  if (!place) {
    return <ActivityPreviewFallback activity={activity} />;
  }

  return <ActivityPreviewContent activity={activity} place={place} />;
}

function ActivityPreviewFallback({ activity }: { activity: Activity }) {
  return (
    <div className="overflow-hidden rounded-xl border border-hairline/80 bg-white/55">
      <ActivityHero activity={activity} />
      <ActivityDetails activity={activity} place={null} />
    </div>
  );
}

function ActivityPreviewContent({
  activity,
  place,
}: {
  activity: Activity;
  place: ActivityPlace;
}) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const galleryImages = place.images.length > 1 ? place.images : [];
  const activeImage = place.images[photoIndex] ?? place.image;
  const hasPhoto = Boolean(place.image);
  const showPhoto = hasPhoto && !imageError;

  return (
    <div className="overflow-hidden rounded-xl border border-hairline/80 bg-white/55">
      <div className="relative">
        {showPhoto ? (
          <div className="relative aspect-[16/10] w-full bg-card-lavender lg:aspect-[21/9]">
            <Image
              src={activeImage}
              alt={activity.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 900px"
              onError={() => {
                if (photoIndex < place.images.length - 1) {
                  setPhotoIndex((index) => index + 1);
                  return;
                }
                setImageError(true);
              }}
            />
            <div className="activity-hero-scrim" aria-hidden="true" />
            <div className="absolute bottom-3 left-3 z-10">
              <StarRating rating={place.rating} reviewCount={place.reviewCount} />
            </div>
          </div>
        ) : (
          <ActivityHero activity={activity} showIllustrationBadge />
        )}
      </div>

      {showPhoto && galleryImages.length > 0 && (
        <div className="flex gap-2 overflow-x-auto px-3 py-3">
          {galleryImages.map((image) => (
            <button
              key={image}
              type="button"
              onClick={() => {
                const index = place.images.indexOf(image);
                setPhotoIndex(index >= 0 ? index : 0);
                setImageError(false);
              }}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                activeImage === image ? "border-primary" : "border-transparent"
              }`}
            >
              <Image src={image} alt="" fill className="object-cover" sizes="96px" />
            </button>
          ))}
        </div>
      )}

      <ActivityDetails activity={activity} place={place} />
    </div>
  );
}

function ActivityHero({
  activity,
  showIllustrationBadge = true,
}: {
  activity: Activity;
  showIllustrationBadge?: boolean;
}) {
  const type = primaryActivityType(activity);
  const heroBg = ACTIVITY_HERO_BACKGROUNDS[type];

  return (
    <div className={`relative aspect-[16/10] w-full lg:aspect-[21/9] ${heroBg}`}>
      <div className="absolute inset-0 flex items-center justify-center px-10 py-6">
        <ActivityTypeIllustration type={type} className="h-full max-h-[150px] w-full" />
      </div>
      <div className="activity-hero-scrim" aria-hidden="true" />
      <div className="absolute top-3 left-3 z-10">
        <span className="inline-flex rounded-lg bg-white/85 px-2.5 py-1 text-sm font-semibold text-primary shadow-sm backdrop-blur-sm">
          {activityLabel(type)}
        </span>
      </div>
      {showIllustrationBadge && (
        <div className="absolute top-3 right-3 z-10">
          <span className="rounded-lg bg-white/70 px-2 py-1 text-[12px] font-medium text-steel backdrop-blur-sm">
            Ilustrace
          </span>
        </div>
      )}
    </div>
  );
}

function ActivityDetails({
  activity,
  place,
}: {
  activity: Activity;
  place: ActivityPlace | null;
}) {
  return (
    <div className="space-y-3 px-4 pb-4 lg:px-5 lg:pb-5">
      <div>
        <h3 className="text-xl font-bold text-ink lg:text-[22px]">{activity.name}</h3>
        {place && (
          <p className="mt-1 flex items-start gap-1.5 text-sm text-slate">
            <MapPin size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
            {place.address}
          </p>
        )}
      </div>

      {place && (
        <>
          <div className="flex flex-wrap gap-2">
            <MetaChip icon={<Baby size={14} aria-hidden="true" />}>
              {ageRangeLabel(activity.tags.ageMin, activity.tags.ageMax)}
            </MetaChip>
            <MetaChip icon={<Clock size={14} aria-hidden="true" />}>
              {durationLabel(activity.tags.duration)}
            </MetaChip>
            <MetaChip icon={<Coins size={14} aria-hidden="true" />}>
              {place.priceHint}
            </MetaChip>
            <MetaChip>{weatherFitLabel(activity.tags.weather)}</MetaChip>
          </div>

          <p className="text-[13px] text-steel">
            <span className="font-medium text-slate">Otevírací doba:</span> {place.openingHours}
          </p>
        </>
      )}

      <p className="text-base leading-relaxed text-charcoal">{activity.description}</p>

      {place && place.highlights.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {place.highlights.map((item) => (
            <span
              key={item}
              className="rounded-md bg-card-mint px-2.5 py-1 text-[13px] font-medium text-brand-green"
            >
              {item}
            </span>
          ))}
        </div>
      )}

      {place && (
        <div className="flex flex-wrap gap-2 pt-1">
          <a href={mapsLinkForActivity(activity, place.mapsUrl)} target="_blank" rel="noopener noreferrer">
            <Button variant="secondary" className="min-h-10 px-4 text-sm">
              <Navigation size={16} aria-hidden="true" />
              Mapy
            </Button>
          </a>
          {activity.url && (
            <a href={activity.url} target="_blank" rel="noopener noreferrer">
              <Button className="min-h-10 px-4 text-sm">
                Web
                <ExternalLink size={16} aria-hidden="true" />
              </Button>
            </a>
          )}
        </div>
      )}
    </div>
  );
}
