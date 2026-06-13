"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { OptionButton } from "@/components/ui/OptionButton";
import { TextInput } from "@/components/ui/TextInput";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { WEATHER_OPTIONS } from "@/lib/constants";
import { Icon, WEATHER_ICONS, MapPin, Thermometer, RefreshCw } from "@/lib/icons";
import { weatherLabel } from "@/lib/labels";
import { fetchWeather } from "@/lib/weather";
import type { WeatherCondition } from "@/types";

type WeatherStepProps = {
  mesto: string;
  weatherAuto: boolean;
  onWeatherAutoChange: (value: boolean) => void;
  weatherCondition: WeatherCondition;
  onWeatherConditionChange: (value: WeatherCondition) => void;
  weatherTemp: number;
  onWeatherTempChange: (value: number) => void;
  onWeatherReady: (ready: boolean, source: "api" | "manual") => void;
};

export function WeatherStep({
  mesto,
  weatherAuto,
  onWeatherAutoChange,
  weatherCondition,
  onWeatherConditionChange,
  weatherTemp,
  onWeatherTempChange,
  onWeatherReady,
}: WeatherStepProps) {
  const [manualOverride, setManualOverride] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadedFor, setLoadedFor] = useState<string | null>(null);

  useEffect(() => {
    if (!weatherAuto || manualOverride) {
      onWeatherReady(true, "manual");
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    onWeatherReady(false, "api");

    fetchWeather(mesto)
      .then((weather) => {
        if (cancelled) {
          return;
        }
        onWeatherConditionChange(weather.condition);
        onWeatherTempChange(weather.temp);
        setLoadedFor(mesto);
        onWeatherReady(true, "api");
      })
      .catch(() => {
        if (cancelled) {
          return;
        }
        setError("Počasí se nepodařilo načíst — přepni na ruční výběr.");
        onWeatherAutoChange(false);
        setManualOverride(true);
        onWeatherReady(true, "manual");
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [
    mesto,
    weatherAuto,
    manualOverride,
    onWeatherAutoChange,
    onWeatherConditionChange,
    onWeatherTempChange,
    onWeatherReady,
  ]);

  function handleEnableAuto() {
    setManualOverride(false);
    onWeatherAutoChange(true);
  }

  function handleManualOverride() {
    setManualOverride(true);
    onWeatherAutoChange(false);
    onWeatherReady(true, "manual");
  }

  const WeatherIcon = WEATHER_ICONS[weatherCondition];

  return (
    <div className="space-y-6">
      {weatherAuto && !manualOverride && (
        <GlassCard className="bg-card-sky p-5" variant="tint">
          {loading ? (
            <LoadingSpinner label={`Načítám počasí pro ${mesto}…`} size="sm" />
          ) : (
            <>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/60 text-link">
                  <WeatherIcon size={26} strokeWidth={2} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xl font-bold text-ink">
                    {weatherLabel(weatherCondition)} · {weatherTemp} °C
                  </p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-[15px] text-slate">
                    <MapPin size={14} aria-hidden="true" />
                    {mesto}
                    {loadedFor === mesto ? " · Open-Meteo" : ""}
                  </p>
                </div>
              </div>
              <Button variant="link" onClick={handleManualOverride} className="mt-4">
                Upravit ručně
              </Button>
            </>
          )}
        </GlassCard>
      )}

      {(!weatherAuto || manualOverride) && (
        <>
          <p className="text-base text-slate">Vyber počasí ručně.</p>
          <div>
            <p className="mb-3 text-[15px] font-medium text-slate">Počasí</p>
            <div className="grid grid-cols-2 gap-2.5">
              {WEATHER_OPTIONS.map((option) => (
                <OptionButton
                  key={option.value}
                  selected={weatherCondition === option.value}
                  onClick={() => onWeatherConditionChange(option.value)}
                  icon={<Icon icon={WEATHER_ICONS[option.value]} size={18} />}
                >
                  {option.label}
                </OptionButton>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="temp" className="mb-2 flex items-center gap-1.5 text-[15px] font-medium text-slate">
              <Thermometer size={16} aria-hidden="true" />
              Teplota (°C)
            </label>
            <TextInput
              id="temp"
              type="number"
              value={weatherTemp}
              onChange={(event) => onWeatherTempChange(Number(event.target.value))}
            />
          </div>
          <Button variant="link" onClick={handleEnableAuto} className="flex items-center gap-1.5">
            <RefreshCw size={16} aria-hidden="true" />
            Znovu načíst automaticky
          </Button>
        </>
      )}

      {error && (
        <p className="rounded-xl bg-card-peach px-4 py-3.5 text-base text-brand-orange glass-tint animate-in">
          {error}
        </p>
      )}
    </div>
  );
}
