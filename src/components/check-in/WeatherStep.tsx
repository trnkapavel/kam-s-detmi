"use client";

import { useEffect, useState } from "react";
import { OptionButton } from "@/components/ui/OptionButton";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { WEATHER_OPTIONS } from "@/lib/constants";
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

  const previewEmoji =
    WEATHER_OPTIONS.find((option) => option.value === weatherCondition)?.emoji ?? "🌡️";

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-gray-900">Jaké je počasí?</h2>

      {weatherAuto && !manualOverride && (
        <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4">
          {loading ? (
            <LoadingSpinner label={`Načítám počasí pro ${mesto}…`} size="sm" />
          ) : (
            <>
              <p className="text-lg font-semibold text-sky-900">
                {previewEmoji} {weatherLabel(weatherCondition)} · {weatherTemp} °C
              </p>
              <p className="mt-1 text-sm text-sky-700">
                Aktuální počasí pro {mesto}
                {loadedFor === mesto ? " · načteno z Open-Meteo" : ""}
              </p>
              <button
                type="button"
                onClick={handleManualOverride}
                className="mt-3 text-sm font-medium text-sky-800 underline"
              >
                Upravit ručně
              </button>
            </>
          )}
        </div>
      )}

      {(!weatherAuto || manualOverride) && (
        <>
          <p className="text-sm text-gray-600">Vyber počasí ručně.</p>
          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">Počasí</p>
            <div className="grid grid-cols-2 gap-2">
              {WEATHER_OPTIONS.map((option) => (
                <OptionButton
                  key={option.value}
                  selected={weatherCondition === option.value}
                  onClick={() => onWeatherConditionChange(option.value)}
                >
                  {option.emoji} {option.label}
                </OptionButton>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="temp" className="mb-2 block text-sm font-medium text-gray-700">
              Teplota (°C)
            </label>
            <input
              id="temp"
              type="number"
              value={weatherTemp}
              onChange={(event) => onWeatherTempChange(Number(event.target.value))}
              className="min-h-11 w-full rounded-xl border border-gray-300 px-4"
            />
          </div>
          <button
            type="button"
            onClick={handleEnableAuto}
            className="text-sm font-medium text-sky-700 underline"
          >
            Znovu načíst automaticky
          </button>
        </>
      )}

      {error && (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">{error}</p>
      )}
    </div>
  );
}
