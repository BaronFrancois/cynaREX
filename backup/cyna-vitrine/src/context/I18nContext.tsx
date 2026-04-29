"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  type Locale,
  type MessageKey,
  messagesByLocale,
  interpolate,
} from "@/i18n/messages";

const STORAGE_KEY = "cyna-locale";

type I18nContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: MessageKey, vars?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function readStoredLocale(): Locale {
  if (typeof window === "undefined") return "fr";
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === "en" || raw === "fr") return raw;
  return "fr";
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("fr");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setLocaleState(readStoredLocale());
    setHydrated(true);
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.lang = locale === "en" ? "en" : "fr";
    document.documentElement.dir = "ltr";
  }, [locale, hydrated]);

  const t = useCallback(
    (key: MessageKey, vars?: Record<string, string | number>) => {
      const table = messagesByLocale[locale] ?? messagesByLocale.fr;
      const raw = table[key] ?? messagesByLocale.fr[key] ?? key;
      return vars ? interpolate(raw, vars) : raw;
    },
    [locale]
  );

  const value = useMemo(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
