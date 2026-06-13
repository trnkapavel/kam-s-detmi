"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { WeatherStep } from "@/components/check-in/WeatherStep";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { OptionButton } from "@/components/ui/OptionButton";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import {
  ACTIVITY_OPTIONS,
  ENERGY_OPTIONS,
  KRAJE,
  MAX_WANTS,
  MESTA,
  MOOD_OPTIONS,
  TIME_OPTIONS,
  WIZARD_STEPS,
} from "@/lib/constants";
import { saveCheckIn } from "@/lib/check-in-session";
import type {
  ActivityType,
  CheckIn,
  ChildInput,
  ChildMood,
  Kraj,
  ParentEnergy,
  TimeAvailable,
  WeatherCondition,
} from "@/types";

type ChildDraft = {
  age: string;
  wants: ActivityType[];
  mood: ChildMood | null;
};

const emptyChild = (): ChildDraft => ({ age: "", wants: [], mood: null });

export function CheckInWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [kraj, setKraj] = useState<Kraj>("Praha");
  const [mesto, setMesto] = useState("Praha");
  const [energy, setEnergy] = useState<ParentEnergy | null>(null);
  const [timeAvailable, setTimeAvailable] = useState<TimeAvailable | null>(null);
  const [child1, setChild1] = useState<ChildDraft>(emptyChild);
  const [child2, setChild2] = useState<ChildDraft>(emptyChild);
  const [weatherAuto, setWeatherAuto] = useState(true);
  const [weatherCondition, setWeatherCondition] = useState<WeatherCondition>("cloudy");
  const [weatherTemp, setWeatherTemp] = useState(15);
  const [weatherReady, setWeatherReady] = useState(false);
  const [weatherSource, setWeatherSource] = useState<"api" | "manual">("manual");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleWeatherReady = useCallback((ready: boolean, source: "api" | "manual") => {
    setWeatherReady(ready);
    setWeatherSource(source);
  }, []);

  function handleKrajChange(nextKraj: Kraj) {
    setKraj(nextKraj);
    setMesto(MESTA[nextKraj][0]);
  }

  function toggleWant(child: ChildDraft, setChild: (value: ChildDraft) => void, want: ActivityType) {
    const has = child.wants.includes(want);
    if (has) {
      setChild({ ...child, wants: child.wants.filter((item) => item !== want) });
      return;
    }
    if (child.wants.length >= MAX_WANTS) {
      return;
    }
    setChild({ ...child, wants: [...child.wants, want] });
  }

  function parseChild(draft: ChildDraft): ChildInput | null {
    const age = Number(draft.age);
    if (!age || age < 1 || age > 17 || draft.wants.length === 0 || !draft.mood) {
      return null;
    }
    return { age, wants: draft.wants, mood: draft.mood };
  }

  function canProceed(): boolean {
    switch (step) {
      case 0:
        return Boolean(kraj && mesto);
      case 1:
        return Boolean(energy && timeAvailable);
      case 2:
        return parseChild(child1) !== null;
      case 3:
        return parseChild(child2) !== null;
      case 4:
        return weatherReady;
      default:
        return false;
    }
  }

  function childrenAgree(): boolean {
    return child1.wants.some((want) => child2.wants.includes(want));
  }

  function handleSubmit() {
    setSubmitting(true);
    setError(null);

    const parsedChild1 = parseChild(child1);
    const parsedChild2 = parseChild(child2);
    if (!energy || !timeAvailable || !parsedChild1 || !parsedChild2 || !weatherReady) {
      setError("Doplň prosím všechna pole.");
      setSubmitting(false);
      return;
    }

    const checkIn: CheckIn = {
      location: { mesto, kraj },
      parent: { energy, timeAvailable },
      children: [parsedChild1, parsedChild2],
      weather: {
        condition: weatherCondition,
        temp: weatherTemp,
        source: weatherSource,
      },
    };

    saveCheckIn(checkIn);
    router.push("/vysledky");
  }

  function renderChildStep(
    label: string,
    child: ChildDraft,
    setChild: (value: ChildDraft) => void,
    showAgreement: boolean,
  ) {
    return (
      <div className="space-y-5">
        <h2 className="text-xl font-bold text-gray-900">{label}</h2>

        <div>
          <label htmlFor="age" className="mb-2 block text-sm font-medium text-gray-700">
            Věk (1–17)
          </label>
          <input
            id="age"
            type="number"
            min={1}
            max={17}
            inputMode="numeric"
            value={child.age}
            onChange={(event) => setChild({ ...child, age: event.target.value })}
            className="min-h-11 w-full rounded-xl border border-gray-300 px-4 text-base"
            placeholder="např. 5"
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-gray-700">
            Co dnes chce? (max {MAX_WANTS})
          </p>
          <div className="grid grid-cols-2 gap-2">
            {ACTIVITY_OPTIONS.map((option) => (
              <OptionButton
                key={option.value}
                selected={child.wants.includes(option.value)}
                onClick={() => toggleWant(child, setChild, option.value)}
              >
                {option.emoji} {option.label}
              </OptionButton>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-gray-700">Nálada</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {MOOD_OPTIONS.map((option) => (
              <OptionButton
                key={option.value}
                selected={child.mood === option.value}
                onClick={() => setChild({ ...child, mood: option.value })}
              >
                {option.emoji} {option.label}
              </OptionButton>
            ))}
          </div>
        </div>

        {showAgreement && childrenAgree() && (
          <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            Super, shodujete se! 🎉
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col">
      <div className="flex flex-1 flex-col gap-6 p-4 pb-6">
        <header>
          <h1 className="text-2xl font-bold text-gray-900">Kam s dětmi</h1>
          <p className="text-sm text-gray-500">Check-in trvá do 2 minut</p>
        </header>

        <ProgressBar step={step} />

        <div className="flex-1">{/* steps below */}
        {step === 0 && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-gray-900">Kde jsi?</h2>
            <div>
              <p className="mb-2 text-sm font-medium text-gray-700">Kraj</p>
              <div className="grid grid-cols-1 gap-2">
                {KRAJE.map((option) => (
                  <OptionButton
                    key={option.value}
                    selected={kraj === option.value}
                    onClick={() => handleKrajChange(option.value)}
                  >
                    {option.label}
                  </OptionButton>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray-700">Město</p>
              <div className="grid grid-cols-2 gap-2">
                {MESTA[kraj].map((city) => (
                  <OptionButton
                    key={city}
                    selected={mesto === city}
                    onClick={() => setMesto(city)}
                  >
                    {city}
                  </OptionButton>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-gray-900">Jak se dnes cítíš?</h2>
            <div>
              <p className="mb-2 text-sm font-medium text-gray-700">Energie</p>
              <div className="grid grid-cols-1 gap-2">
                {ENERGY_OPTIONS.map((option) => (
                  <OptionButton
                    key={option.value}
                    selected={energy === option.value}
                    onClick={() => setEnergy(option.value)}
                  >
                    {option.emoji} {option.label}
                  </OptionButton>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-gray-700">Kolik máš času?</p>
              <div className="grid grid-cols-1 gap-2">
                {TIME_OPTIONS.map((option) => (
                  <OptionButton
                    key={option.value}
                    selected={timeAvailable === option.value}
                    onClick={() => setTimeAvailable(option.value)}
                  >
                    {option.label}
                  </OptionButton>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && renderChildStep("První dítě", child1, setChild1, false)}
        {step === 3 && renderChildStep("Druhé dítě", child2, setChild2, true)}

        {step === 4 && (
          <WeatherStep
            mesto={mesto}
            weatherAuto={weatherAuto}
            onWeatherAutoChange={setWeatherAuto}
            weatherCondition={weatherCondition}
            onWeatherConditionChange={setWeatherCondition}
            weatherTemp={weatherTemp}
            onWeatherTempChange={setWeatherTemp}
            onWeatherReady={handleWeatherReady}
          />
        )}
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>
        )}
      </div>

      <div className="sticky bottom-0 border-t border-gray-200 bg-slate-50/95 px-4 pb-safe pt-3 backdrop-blur">
        <div className="flex gap-3">
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep((current) => current - 1)}
              disabled={submitting}
              className="min-h-11 flex-1 rounded-xl border border-gray-300 px-4 font-medium text-gray-700 disabled:opacity-50"
            >
              Zpět
            </button>
          )}

          {step < WIZARD_STEPS - 1 ? (
            <button
              type="button"
              disabled={!canProceed()}
              onClick={() => setStep((current) => current + 1)}
              className="min-h-11 flex-1 rounded-xl bg-sky-600 px-4 font-medium text-white disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              Pokračovat
            </button>
          ) : (
            <button
              type="button"
              disabled={submitting || !canProceed()}
              onClick={handleSubmit}
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 font-medium text-white disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {submitting && <LoadingSpinner size="sm" />}
              {submitting ? "Hledám tipy…" : "Najít tipy"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
