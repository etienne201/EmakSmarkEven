"use client";

import { useEffect } from "react";
import { useLocalStorage } from "@frontend/hooks/useLocalStorage";
import { EventConfig, DEFAULT_EVENT_CONFIG } from "@backend/eventConfig";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [eventConfig] = useLocalStorage<EventConfig | null>("event-config", null);

  useEffect(() => {
    const config = eventConfig || DEFAULT_EVENT_CONFIG;
    const palette = config.palette || DEFAULT_EVENT_CONFIG.palette;

    const root = document.documentElement;
    root.style.setProperty("--gold", palette.primary);
    root.style.setProperty("--gold-light", palette.primaryLight);
    root.style.setProperty("--emerald", palette.secondary);
    root.style.setProperty("--emerald-dark", palette.secondaryDark);
    root.style.setProperty("--background", palette.background);
  }, [eventConfig]);

  return <>{children}</>;
}
