"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { WeatherStep } from "@/components/check-in/WeatherStep";
import { AnimatedStep } from "@/components/ui/AnimatedStep";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { OptionButton } from "@/components/ui/OptionButton";
import { TextInput } from "@/components/ui/TextInput";
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
import {
  ACTIVITY_ICONS,
  ENERGY_ICONS,
  MOOD_ICONS,
  Icon,
  ArrowRight,
  ChevronLeft,
  Compass,
  MapPin,
  PartyPopper,
  Sparkles,
  User,
  Users,
  CloudSun,
} from "@/lib/icons";
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

const STEP_META = [
  { title: "Kde jsi?", icon: MapPin },
  { title: "Jak se dnes cítíš?", icon: User },
  { title: "První dítě", icon: Users },
  { title: "Druhé dítě", icon: Users },
  { title: "Jaké je počasí?", icon: CloudSun },
];

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
    child: ChildDraft,
    setChild: (value: ChildDraft) => void,
    showAgreement: boolean,
  ) {
    return (
      <div className="space-y-6">
        <div>
          <p className="mb-2 text-[15px] font-medium text-slate">Věk (1–17)</p>
          <TextInput
            id="age"
            type="number"
            min={1}
            max={17}
            inputMode="numeric"
            value={child.age}
            onChange={(event) => setChild({ ...child, age: event.target.value })}
            placeholder="např. 5"
          />
        </div>

        <div>
          <p className="mb-3 text-[15px] font-medium text-slate">
            Co dnes chce? (max {MAX_WANTS})
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {ACTIVITY_OPTIONS.map((option) => (
              <OptionButton
                key={option.value}
                selected={child.wants.includes(option.value)}
                onClick={() => toggleWant(child, setChild, option.value)}
                icon={<Icon icon={ACTIVITY_ICONS[option.value]} size={18} />}
              >
                {option.label}
              </OptionButton>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-3 text-[15px] font-medium text-slate">Nálada</p>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            {MOOD_OPTIONS.map((option) => (
              <OptionButton
                key={option.value}
                selected={child.mood === option.value}
                onClick={() => setChild({ ...child, mood: option.value })}
                icon={<Icon icon={MOOD_ICONS[option.value]} size={18} />}
              >
                {option.label}
              </OptionButton>
            ))}
          </div>
        </div>

        {showAgreement && childrenAgree() && (
          <div className="flex items-center gap-2.5 rounded-xl bg-card-mint px-4 py-3.5 text-base font-semibold text-brand-green glass-tint animate-scale-in">
            <PartyPopper size={20} aria-hidden="true" />
            Super, shodujete se!
          </div>
        )}
      </div>
    );
  }

  const StepIcon = STEP_META[step]?.icon ?? Compass;

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col">
      <div className="flex flex-1 flex-col gap-6 p-4 pb-6">
        <header className="animate-in-up">
          <GlassCard className="p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Sparkles size={22} strokeWidth={2} aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-[26px] font-bold tracking-tight text-ink">Kam s dětmi</h1>
                <p className="mt-0.5 text-[15px] text-steel">Check-in trvá do 2 minut</p>
              </div>
            </div>
          </GlassCard>
        </header>

        <ProgressBar step={step} />

        <GlassCard className="flex-1 p-5">
          <div className="mb-5 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <StepIcon size={18} strokeWidth={2.5} aria-hidden="true" />
            </div>
            <h2 className="text-xl font-bold text-ink">{STEP_META[step]?.title}</h2>
          </div>

          <AnimatedStep stepKey={step}>
            {step === 0 && (
              <div className="space-y-6">
                <div>
                  <p className="mb-3 text-[15px] font-medium text-slate">Kraj</p>
                  <div className="grid grid-cols-1 gap-2.5">
                    {KRAJE.map((option) => (
                      <OptionButton
                        key={option.value}
                        selected={kraj === option.value}
                        onClick={() => handleKrajChange(option.value)}
                        icon={<Compass size={18} aria-hidden="true" />}
                      >
                        {option.label}
                      </OptionButton>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-3 text-[15px] font-medium text-slate">Město</p>
                  <div className="grid grid-cols-2 gap-2.5">
                    {MESTA[kraj].map((city) => (
                      <OptionButton
                        key={city}
                        selected={mesto === city}
                        onClick={() => setMesto(city)}
                        icon={<MapPin size={18} aria-hidden="true" />}
                      >
                        {city}
                      </OptionButton>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <p className="mb-3 text-[15px] font-medium text-slate">Energie</p>
                  <div className="grid grid-cols-1 gap-2.5">
                    {ENERGY_OPTIONS.map((option) => (
                      <OptionButton
                        key={option.value}
                        selected={energy === option.value}
                        onClick={() => setEnergy(option.value)}
                        icon={<Icon icon={ENERGY_ICONS[option.value]} size={18} />}
                      >
                        {option.label}
                      </OptionButton>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-3 text-[15px] font-medium text-slate">Kolik máš času?</p>
                  <div className="grid grid-cols-1 gap-2.5">
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

            {step === 2 && renderChildStep(child1, setChild1, false)}
            {step === 3 && renderChildStep(child2, setChild2, true)}

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
          </AnimatedStep>
        </GlassCard>

        {error && (
          <p className="animate-in rounded-xl bg-card-rose px-4 py-3.5 text-base text-semantic-error glass-tint">
            {error}
          </p>
        )}
      </div>

      <div className="glass-footer sticky bottom-0 px-4 pb-safe pt-4">
        <div className="flex gap-3">
          {step > 0 && (
            <Button
              variant="secondary"
              disabled={submitting}
              onClick={() => setStep((current) => current - 1)}
              className="flex-1"
            >
              <ChevronLeft size={20} aria-hidden="true" />
              Zpět
            </Button>
          )}

          {step < WIZARD_STEPS - 1 ? (
            <Button
              disabled={!canProceed()}
              onClick={() => setStep((current) => current + 1)}
              className="flex-1"
            >
              Pokračovat
              <ArrowRight size={20} aria-hidden="true" />
            </Button>
          ) : (
            <Button
              disabled={submitting || !canProceed()}
              onClick={handleSubmit}
              className="flex-1"
            >
              {submitting ? "Hledám tipy…" : "Najít tipy"}
              {!submitting && <Sparkles size={20} aria-hidden="true" />}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
