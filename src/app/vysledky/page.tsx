"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  RecommendationCard,
  ResultsSummary,
  type RecommendResponse,
} from "@/components/ResultsView";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { clearCheckIn, loadCheckIn } from "@/lib/check-in-session";
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
        <LoadingSpinner label="Hledám tipy…" />
      </main>
    );
  }

  if (!checkIn) {
    return (
      <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-4 p-4 text-center">
        <p className="text-gray-700">Nejdřív projdi check-in.</p>
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded-xl bg-sky-600 px-6 py-3 font-medium text-white"
        >
          Začít check-in
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col gap-5 p-4 pb-safe">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Tvoje tipy</h1>
        <p className="text-sm text-gray-500">
          {result?.recommendations.length ?? 0} tipů pro {checkIn.location.mesto}
        </p>
      </header>

      <ResultsSummary checkIn={checkIn} conflict={result?.conflict ?? true} />

      {error && (
        <div className="space-y-3 rounded-xl bg-red-50 px-4 py-3">
          <p className="text-sm text-red-800">{error}</p>
          <button
            type="button"
            onClick={() => void fetchRecommendations(checkIn)}
            className="min-h-11 rounded-lg bg-red-100 px-4 text-sm font-medium text-red-900"
          >
            Zkusit znovu
          </button>
        </div>
      )}

      {!error && result && result.filteredCount === 0 && (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
          V tvém okolí zatím nemáme tipy. Zkus jiné město nebo kraj.
        </p>
      )}

      {!error && result && result.recommendations.length > 0 && (
        <div className="space-y-4">
          {result.recommendations.map((recommendation, index) => (
            <RecommendationCard
              key={`${recommendation.type}-${index}`}
              recommendation={recommendation}
            />
          ))}
        </div>
      )}

      <p className="text-xs leading-relaxed text-gray-500">
        Tipy jsou orientační — ověř si aktuální otevírací dobu a ceny.
      </p>

      <Link
        href="/"
        onClick={handleNewCheckIn}
        className="inline-flex min-h-11 items-center justify-center rounded-xl bg-sky-600 px-4 py-3 text-center font-medium text-white"
      >
        Nový check-in
      </Link>
    </main>
  );
}
