"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import {
  ChildrenStep,
  emptyChild,
  parseAllChildren,
  type ChildDraft,
} from "@/components/check-in/ChildrenStep";
import type { IntentType } from "@/lib/intents";
import { WeatherStep } from "@/components/check-in/WeatherStep";
import { AnimatedStep } from "@/components/ui/AnimatedStep";
import { Button } from "@/components/ui/Button";
import { CardIllustration } from "@/components/ui/CardIllustration";
import { GlassCard } from "@/components/ui/GlassCard";
import { StepIllustrationSlot } from "@/components/illustrations/StepIllustration";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { OptionButton } from "@/components/ui/OptionButton";
import {
  ENERGY_OPTIONS,
  KRAJE,
  MESTA,
  TIME_OPTIONS,
  WIZARD_STEPS,
} from "@/lib/constants";
import { childrenShareWants } from "@/lib/children";
import {
  ACTIVITY_ICONS,
  ENERGY_ICONS,
  Icon,
  ArrowRight,
  ChevronLeft,
  Compass,
  MapPin,
  Sparkles,
  User,
  Users,
  CloudSun,
} from "@/lib/icons";
import { saveCheckIn } from "@/lib/check-in-session";
import type {
  CheckIn,
  Kraj,
  ParentEnergy,
  TimeAvailable,
  WeatherCondition,
} from "@/types";

const STEP_META = [
  { title: "Kde jsi?", icon: MapPin },
  { title: "Jak se dnes cítíš?", icon: User },
  { title: "Kdo jde s tebou?", icon: Users },
  { title: "Jaké je počasí?", icon: CloudSun },
];

export function CheckInWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [kraj, setKraj] = useState<Kraj>("Praha");
  const [mesto, setMesto] = useState("Praha");
  const [energy, setEnergy] = useState<ParentEnergy | null>(null);
  const [timeAvailable, setTimeAvailable] = useState<TimeAvailable | null>(null);
  const [children, setChildren] = useState<ChildDraft[]>([emptyChild(), emptyChild()]);
  const [familyIntents, setFamilyIntents] = useState<IntentType[]>([]);
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

  const parsedChildren = parseAllChildren(children, familyIntents);
  const allChildrenValid = parsedChildren !== null;
  const sharedWants = parsedChildren ? childrenShareWants(parsedChildren) : false;

  function canProceed(): boolean {
    switch (step) {
      case 0:
        return Boolean(kraj && mesto);
      case 1:
        return Boolean(energy && timeAvailable);
      case 2:
        return allChildrenValid;
      case 3:
        return weatherReady;
      default:
        return false;
    }
  }

  function handleSubmit() {
    setSubmitting(true);
    setError(null);

    if (!energy || !timeAvailable || !parsedChildren || !weatherReady) {
      setError("Doplň prosím všechna pole.");
      setSubmitting(false);
      return;
    }

    const checkIn: CheckIn = {
      location: { mesto, kraj },
      parent: { energy, timeAvailable },
      children: parsedChildren,
      weather: {
        condition: weatherCondition,
        temp: weatherTemp,
        source: weatherSource,
      },
    };

    saveCheckIn(checkIn);
    router.push("/vysledky");
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
          <div className="relative mb-5 min-h-[72px]">
            <CardIllustration position="top-right">
              <StepIllustrationSlot step={step} />
            </CardIllustration>
            <div className="relative z-10 flex max-w-[58%] items-center gap-2.5 sm:max-w-[65%]">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <StepIcon size={18} strokeWidth={2.5} aria-hidden="true" />
              </div>
              <h2 className="text-xl font-bold text-ink">{STEP_META[step]?.title}</h2>
            </div>
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

            {step === 2 && (
              <ChildrenStep
                children={children}
                familyIntents={familyIntents}
                onFamilyIntentsChange={setFamilyIntents}
                onChildrenChange={setChildren}
                showAgreement={children.length > 1 && sharedWants}
              />
            )}

            {step === 3 && (
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
