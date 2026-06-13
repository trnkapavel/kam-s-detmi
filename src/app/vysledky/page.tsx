"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  RecommendationCard,
  ResultsSummary,
  type RecommendResponse,
} from "@/components/ResultsView";
import { Button } from "@/components/ui/Button";
import { CardIllustration } from "@/components/ui/CardIllustration";
import { GlassCard } from "@/components/ui/GlassCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ResultsJourneyIllustration } from "@/components/illustrations/ResultsJourneyIllustration";
import { clearCheckIn, loadCheckIn } from "@/lib/check-in-session";
import { ArrowRight, RefreshCw, Sparkles } from "@/lib/icons";
import type { CheckIn } from "@/types";

export default function VysledkyPage() {
  const [checkIn, setCheckIn] = useState<CheckIn | null>(null);
  const [result, setResult] = useState<RecommendResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = useCallback(async (stored: CheckIn) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stored),
      });

      if (!response.ok) {
        throw new Error("API error");
      }

      const data = (await response.json()) as RecommendResponse;
      setResult(data);
    } catch {
      setError("Nepodařilo se načíst tipy. Zkus to znovu.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const stored = loadCheckIn();
    if (!stored) {
      setLoading(false);
      return;
    }

    setCheckIn(stored);
    void fetchRecommendations(stored);
  }, [fetchRecommendations]);

  function handleNewCheckIn() {
    clearCheckIn();
  }

  if (loading) {
    return (
      <main className="mx-auto flex min-h-screen max-w-lg items-center justify-center p-4">
        <GlassCard className="p-10 animate-scale-in">
          <LoadingSpinner label="Hledám tipy…" />
        </GlassCard>
      </main>
    );
  }

  if (!checkIn) {
    return (
      <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-6 p-4 text-center">
        <GlassCard className="w-full max-w-sm p-8 animate-in-up">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <Sparkles size={28} aria-hidden="true" />
          </div>
          <p className="text-lg text-charcoal">Nejdřív projdi check-in.</p>
          <Link href="/" className="mt-6 block">
            <Button fullWidth>
              Začít check-in
              <ArrowRight size={20} aria-hidden="true" />
            </Button>
          </Link>
        </GlassCard>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col gap-6 p-4 pb-safe">
      <header className="animate-in-up">
        <GlassCard className="p-5">
          <div className="relative min-h-[80px]">
            <CardIllustration position="top-right" size="lg">
              <ResultsJourneyIllustration className="h-auto w-full" />
            </CardIllustration>
            <div className="relative z-10 flex max-w-[62%] items-center gap-3 sm:max-w-[68%]">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Sparkles size={22} aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-[26px] font-bold tracking-tight text-ink">Tvoje tipy</h1>
                <p className="mt-0.5 text-[15px] text-steel">
                  {result?.recommendations.length ?? 0} tipů pro {checkIn.location.mesto}
                </p>
              </div>
            </div>
          </div>
        </GlassCard>
      </header>

      <ResultsSummary checkIn={checkIn} conflict={result?.conflict ?? true} />

      {error && (
        <GlassCard className="space-y-4 bg-card-rose p-5 animate-in" variant="tint">
          <p className="text-base text-semantic-error">{error}</p>
          <Button variant="secondary" onClick={() => void fetchRecommendations(checkIn)}>
            <RefreshCw size={18} aria-hidden="true" />
            Zkusit znovu
          </Button>
        </GlassCard>
      )}

      {!error && result && result.filteredCount === 0 && (
        <GlassCard className="p-5 animate-in">
          <p className="text-base text-charcoal">
            V tvém okolí zatím nemáme tipy. Zkus jiné město nebo kraj.
          </p>
        </GlassCard>
      )}

      {!error && result && result.recommendations.length > 0 && (
        <div className="space-y-4">
          {result.recommendations.map((recommendation, index) => (
            <RecommendationCard
              key={`${recommendation.type}-${index}`}
              recommendation={recommendation}
              index={index}
            />
          ))}
        </div>
      )}

      <p className="animate-in px-1 text-[15px] leading-relaxed text-steel">
        Tipy jsou orientační — fotky jsou z Wikimedia Commons, kde chybí zdroj, zobrazí se ilustrace. Ověř si aktuální otevírací dobu a ceny.
      </p>

      <Link href="/" onClick={handleNewCheckIn} className="block animate-in-up">
        <Button fullWidth>
          Nový check-in
          <ArrowRight size={20} aria-hidden="true" />
        </Button>
      </Link>
    </main>
  );
}
