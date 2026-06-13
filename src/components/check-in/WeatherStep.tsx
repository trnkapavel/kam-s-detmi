"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { OptionButton } from "@/components/ui/OptionButton";
import { TextInput } from "@/components/ui/TextInput";
import { WeatherHeroCard } from "@/components/check-in/WeatherHeroCard";
import { WEATHER_OPTIONS } from "@/lib/constants";
import { Icon, WEATHER_ICONS, Thermometer, RefreshCw } from "@/lib/icons";
import { fetchWeather, isCurrentlyDay, type HourlyForecast } from "@/lib/weather";
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
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecast[]>([]);
  const [isDay, setIsDay] = useState(true);

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
        setHourlyForecast(weather.hourly);
        setIsDay(weather.isDay);
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
        setHourlyForecast([]);
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
    setHourlyForecast([]);
    onWeatherReady(true, "manual");
  }

  const isAutoView = weatherAuto && !manualOverride;
  const displayIsDay = isAutoView ? isDay : isCurrentlyDay();

  return (
    <div className="space-y-6">
      <WeatherHeroCard
        condition={weatherCondition}
        temp={weatherTemp}
        mesto={mesto}
        isDay={displayIsDay}
        hourly={isAutoView ? hourlyForecast : []}
        loading={isAutoView && loading}
        showSource={isAutoView && loadedFor === mesto}
        onEditManual={isAutoView && !loading ? handleManualOverride : undefined}
      />

      {(!weatherAuto || manualOverride) && (
        <>
          <p className="text-base text-slate">Vyber počasí ručně — animace se přizpůsobí výběru.</p>
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
