"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  RecommendationCard,
  ResultsSummary,
  type RecommendResponse,
} from "@/components/ResultsView";
import { Button } from "@/components/ui/Button";
import { CardIllustration } from "@/components/ui/CardIllustration";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageShell } from "@/components/ui/PageShell";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ResultsJourneyIllustration } from "@/components/illustrations/ResultsJourneyIllustration";
import { clearCheckIn, loadCheckIn, saveCheckIn } from "@/lib/check-in-session";
import { decodeCheckInShare } from "@/lib/plan-share-link";
import { ArrowRight, RefreshCw, Sparkles } from "@/lib/icons";
import type { CheckIn } from "@/types";

function VysledkyContent() {
  const searchParams = useSearchParams();
  const [checkIn, setCheckIn] = useState<CheckIn | null>(null);
  const [result, setResult] = useState<RecommendResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareError, setShareError] = useState(false);
  const [isSharedPlan, setIsSharedPlan] = useState(false);

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
    const shareToken = searchParams.get("s");
    let stored: CheckIn | null = null;
    let fromShare = false;

    if (shareToken) {
      stored = decodeCheckInShare(shareToken);
      if (!stored) {
        setShareError(true);
        setLoading(false);
        return;
      }
      fromShare = true;
      saveCheckIn(stored);
    } else {
      stored = loadCheckIn();
    }

    if (!stored) {
      setLoading(false);
      return;
    }

    setCheckIn(stored);
    setIsSharedPlan(fromShare);
    void fetchRecommendations(stored);
  }, [fetchRecommendations, searchParams]);

  function handleNewCheckIn() {
    clearCheckIn();
  }

  if (loading) {
    return (
      <PageShell className="flex min-h-screen items-center justify-center p-4 lg:px-8">
        <GlassCard className="w-full max-w-md p-10 animate-scale-in lg:max-w-lg">
          <LoadingSpinner label="Hledám tipy…" />
        </GlassCard>
      </PageShell>
    );
  }

  if (shareError) {
    return (
      <PageShell className="flex min-h-screen flex-col items-center justify-center gap-6 p-4 text-center lg:px-8">
        <GlassCard className="w-full max-w-sm space-y-4 p-8 animate-in-up lg:max-w-md">
          <p className="text-lg text-charcoal">Sdílený odkaz je neplatný nebo poškozený.</p>
          <Link href="/" className="block">
            <Button fullWidth>
              Začít vlastní check-in
              <ArrowRight size={20} aria-hidden="true" />
            </Button>
          </Link>
        </GlassCard>
      </PageShell>
    );
  }

  if (!checkIn) {
    return (
      <PageShell className="flex min-h-screen flex-col items-center justify-center gap-6 p-4 text-center lg:px-8">
        <GlassCard className="w-full max-w-sm p-8 animate-in-up lg:max-w-md">
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
      </PageShell>
    );
  }

  return (
    <PageShell className="min-h-screen p-4 pb-safe lg:px-8">
      {isSharedPlan && (
        <GlassCard className="mb-4 bg-card-sky p-4 animate-in lg:mb-6" variant="tint">
          <p className="text-[15px] font-medium text-charcoal">
            Sdílený plán — tipy podle situace, kterou poslal někdo jiný.
          </p>
        </GlassCard>
      )}

      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(280px,320px)_minmax(0,1fr)] lg:items-start lg:gap-10">
        <aside className="space-y-6 lg:sticky lg:top-6">
          <header className="animate-in-up">
            <GlassCard className="p-5">
              <div className="relative min-h-[80px] lg:min-h-0">
                <div className="lg:hidden">
                  <CardIllustration position="top-right" size="lg">
                    <ResultsJourneyIllustration className="h-auto w-full" />
                  </CardIllustration>
                </div>
                <div className="relative z-10 flex min-w-0 items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <Sparkles size={22} aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <h1 className="text-[26px] font-bold tracking-tight text-ink lg:text-[28px]">
                      Tvoje tipy
                    </h1>
                    <p className="mt-0.5 text-[15px] text-steel">
                      {result?.recommendations.length ?? 0} tipů pro {checkIn.location.mesto}
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </header>

          <ResultsSummary checkIn={checkIn} conflict={result?.conflict ?? true} />

          <Link href="/" onClick={handleNewCheckIn} className="hidden animate-in-up lg:block">
            <Button fullWidth>
              Nový check-in
              <ArrowRight size={20} aria-hidden="true" />
            </Button>
          </Link>
        </aside>

        <div className="flex flex-col gap-6">
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
            <div className="flex flex-col gap-4">
              {result.recommendations.map((recommendation, index) => (
                <RecommendationCard
                  key={`${recommendation.type}-${index}`}
                  recommendation={recommendation}
                  index={index}
                  sharePlan={
                    index === 0
                      ? { checkIn, recommendations: result.recommendations }
                      : undefined
                  }
                />
              ))}
            </div>
          )}

          <p className="animate-in px-1 text-[15px] leading-relaxed text-steel">
            Tipy jsou orientační — fotky jsou z Wikimedia Commons, kde chybí zdroj, zobrazí se
            ilustrace. Ověř si aktuální otevírací dobu a ceny.
          </p>

          <Link href="/" onClick={handleNewCheckIn} className="block animate-in-up lg:hidden">
            <Button fullWidth>
              Nový check-in
              <ArrowRight size={20} aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </div>
    </PageShell>
  );
}

export default function VysledkyPage() {
  return (
    <Suspense
      fallback={
        <PageShell className="flex min-h-screen items-center justify-center p-4 lg:px-8">
          <GlassCard className="w-full max-w-md p-10 animate-scale-in lg:max-w-lg">
            <LoadingSpinner label="Načítám…" />
          </GlassCard>
        </PageShell>
      }
    >
      <VysledkyContent />
    </Suspense>
  );
}
