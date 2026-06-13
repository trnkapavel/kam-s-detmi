"use client";

import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { WeatherScene } from "@/components/check-in/WeatherScene";
import { WEATHER_ICONS, MapPin } from "@/lib/icons";
import { weatherLabel } from "@/lib/labels";
import type { HourlyForecast } from "@/lib/weather";
import type { WeatherCondition } from "@/types";

type WeatherHeroCardProps = {
  condition: WeatherCondition;
  temp: number;
  mesto: string;
  isDay: boolean;
  hourly?: HourlyForecast[];
  loading?: boolean;
  showSource?: boolean;
  onEditManual?: () => void;
};

export function WeatherHeroCard({
  condition,
  temp,
  mesto,
  isDay,
  hourly = [],
  loading = false,
  showSource = false,
  onEditManual,
}: WeatherHeroCardProps) {
  const WeatherIcon = WEATHER_ICONS[condition];
  const timeLabel = isDay ? "Aktuální počasí" : "Noční počasí";

  if (loading) {
    return (
      <div className="weather-hero weather-hero--loading overflow-hidden rounded-2xl">
        <div className="relative z-10 flex min-h-[220px] items-center justify-center p-6">
          <LoadingSpinner label={`Načítám počasí pro ${mesto}…`} size="sm" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`weather-hero weather-hero--${condition} ${isDay ? "weather-hero--day" : "weather-hero--night"} overflow-hidden rounded-2xl`}
    >
      <WeatherScene condition={condition} isDay={isDay} />
      <div className="weather-hero-scrim" aria-hidden="true" />

      <div className="weather-hero-content relative z-10 p-5 text-white">
        <div className="flex items-start justify-between gap-3">
          <p className="flex items-center gap-1.5 text-[15px] font-medium text-white/95">
            <MapPin size={15} aria-hidden="true" />
            {mesto}
            {showSource ? " · Open-Meteo" : ""}
          </p>
          {onEditManual && (
            <Button
              variant="link"
              onClick={onEditManual}
              className="min-h-0 px-0 py-0 text-[14px] text-white/90 hover:text-white"
            >
              Upravit
            </Button>
          )}
        </div>

        <div className="mt-4 flex items-end gap-4">
          <p className="weather-hero-temp">{temp}°</p>
          <div className="mb-2 space-y-1">
            <div className="flex items-center gap-2">
              <WeatherIcon size={22} strokeWidth={2} aria-hidden="true" />
              <p className="text-lg font-semibold">{weatherLabel(condition)}</p>
            </div>
            <p className="text-[14px] text-white/90">{timeLabel}</p>
          </div>
        </div>

        {hourly.length > 0 && (
          <div className="weather-hourly mt-5">
            <p className="mb-2 px-1 text-[13px] font-semibold uppercase tracking-wide text-white/90">
              Předpověď
            </p>
            <div className="flex gap-2 overflow-x-auto pb-0.5">
              {hourly.map((slot) => {
                const SlotIcon = WEATHER_ICONS[slot.condition];
                return (
                  <div key={slot.label} className="weather-hourly-slot shrink-0">
                    <p className="text-[12px] font-medium text-white/90">{slot.label}</p>
                    <SlotIcon size={18} className="my-1.5 opacity-95" aria-hidden="true" />
                    <p className="text-[15px] font-bold">{slot.temp}°</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
