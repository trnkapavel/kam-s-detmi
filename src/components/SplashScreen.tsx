"use client";

import Image from "next/image";
import { useState } from "react";
import { markSplashSeen } from "@/lib/splash-session";
import { pickSplashHero, SPLASH_CHIPS } from "@/lib/splash-content";
import { ArrowRight, Sparkles } from "@/lib/icons";

type SplashScreenProps = {
  onStart: () => void;
};

export function SplashScreen({ onStart }: SplashScreenProps) {
  const [hero] = useState(() => pickSplashHero());

  function handleStart() {
    markSplashSeen();
    onStart();
  }

  return (
    <div className="fixed inset-0 z-30 mx-auto max-w-lg overflow-hidden bg-ink">
      <div className="relative h-dvh w-full">
        <Image
          src={hero.image}
          alt={hero.alt}
          fill
          priority
          className="splash-hero-image object-cover"
          style={{ objectPosition: hero.objectPosition ?? "center" }}
          sizes="(max-width: 512px) 100vw, 512px"
        />

        <div className="splash-overlay absolute inset-0" aria-hidden="true" />

        <div className="relative flex h-full flex-col justify-between px-6 pb-safe pt-[max(1.25rem,env(safe-area-inset-top))]">
          <div className="animate-in pt-1">
            <span className="splash-brand">
              <Sparkles size={13} strokeWidth={2.5} aria-hidden="true" />
              Kam s dětmi
            </span>
          </div>

          <div className="animate-in-up space-y-5 pb-5">
            <div className="space-y-3">
              <p className="splash-eyebrow">{hero.label} · Praha · Střední Čechy · Jihočeský</p>
              <h1 className="splash-title">
                Kam dnes
                <br />
                <span className="splash-title-accent">vyrazit?</span>
              </h1>
              <p className="splash-lead">Pár otázek a máš tipy na výlet podle vašeho dne.</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {SPLASH_CHIPS.map((chip, index) => {
                const Icon = chip.icon;
                return (
                  <span
                    key={chip.label}
                    className="splash-chip inline-flex items-center gap-1.5 animate-in-up"
                    style={{ animationDelay: `${0.08 * (index + 1)}s` }}
                  >
                    <Icon size={14} strokeWidth={2.25} aria-hidden="true" />
                    {chip.label}
                  </span>
                );
              })}
            </div>

            <button type="button" onClick={handleStart} className="btn-splash inline-flex w-full items-center justify-center gap-2.5">
              Začít
              <ArrowRight size={20} strokeWidth={2.5} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
