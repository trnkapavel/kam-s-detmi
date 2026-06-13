"use client";

import { useEffect, useState } from "react";
import { CheckInWizard } from "@/components/CheckInWizard";
import { SplashScreen } from "@/components/SplashScreen";
import { hasSeenSplash } from "@/lib/splash-session";

export function HomeFlow() {
  const [ready, setReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    setShowSplash(!hasSeenSplash());
    setReady(true);
  }, []);

  if (!ready) {
    return null;
  }

  if (showSplash) {
    return <SplashScreen onStart={() => setShowSplash(false)} />;
  }

  return <CheckInWizard />;
}
