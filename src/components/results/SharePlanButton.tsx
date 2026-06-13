"use client";

import { useState } from "react";
import { buildPlanSharePayload, sharePlan } from "@/lib/plan-share";
import type { CheckIn, Recommendation } from "@/types";
import { Share } from "@/lib/icons";
import { Button } from "@/components/ui/Button";

type SharePlanButtonProps = {
  checkIn: CheckIn;
  recommendations: Recommendation[];
  variant?: "prominent" | "compact" | "card";
  className?: string;
};

export function SharePlanButton({
  checkIn,
  recommendations,
  variant = "prominent",
  className = "",
}: SharePlanButtonProps) {
  const [status, setStatus] = useState<string | null>(null);
  const [fallbackText, setFallbackText] = useState<string | null>(null);

  async function handleShare() {
    const payload = buildPlanSharePayload({
      checkIn,
      recommendations,
      origin: window.location.origin,
    });

    try {
      const result = await sharePlan(payload);
      if (result === "shared") {
        setStatus("Sdíleno");
      } else if (result === "copied") {
        setStatus("Zkopírováno — vlož kam potřebuješ");
      } else {
        return;
      }
    } catch {
      setFallbackText(payload.text);
      return;
    }

    window.setTimeout(() => setStatus(null), 2500);
  }

  return (
    <>
      <div className={className}>
        {variant === "prominent" ? (
          <div className="space-y-2">
            <Button fullWidth className="min-h-12 text-base" onClick={() => void handleShare()}>
              <Share size={20} aria-hidden="true" />
              Sdílet plán
            </Button>
            <p className="text-center text-[13px] text-steel">
              Pošli tipy partnerovi nebo do chatu jedním tapem
            </p>
            {status && <p className="text-center text-sm font-medium text-primary">{status}</p>}
          </div>
        ) : variant === "card" ? (
          <div className="flex flex-col items-end gap-1">
            <button
              type="button"
              onClick={() => void handleShare()}
              className="btn-glass inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-[14px] font-semibold text-primary shadow-sm"
            >
              <Share size={16} strokeWidth={2.25} aria-hidden="true" />
              Sdílet plán
            </button>
            {status && <span className="text-[11px] font-medium text-primary">{status}</span>}
          </div>
        ) : (
          <div className="flex flex-col items-end gap-1">
            <Button
              variant="secondary"
              className="min-h-10 shrink-0 px-4 text-sm"
              onClick={() => void handleShare()}
            >
              <Share size={16} aria-hidden="true" />
              Sdílet
            </Button>
            {status && <span className="text-xs text-steel">{status}</span>}
          </div>
        )}
      </div>

      {fallbackText && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/30 p-4 sm:items-center sm:justify-center">
          <div className="w-full max-w-md rounded-xl bg-white p-4 shadow-xl">
            <p className="mb-2 text-sm font-medium text-ink">Zkopíruj plán</p>
            <textarea
              readOnly
              className="h-40 w-full rounded-lg border border-hairline-strong p-3 text-sm text-charcoal"
              value={fallbackText}
            />
            <div className="mt-3 flex gap-2">
              <Button
                fullWidth
                onClick={() => void navigator.clipboard.writeText(fallbackText).then(() => setFallbackText(null))}
              >
                Kopírovat
              </Button>
              <Button variant="secondary" fullWidth onClick={() => setFallbackText(null)}>
                Zavřít
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
