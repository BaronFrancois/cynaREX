"use client";

import { useI18n } from "@/context/I18nContext";
import type { Locale } from "@/i18n/messages";
import { cn } from "@/lib/utils";

const LOCALES: Locale[] = ["fr", "en"];

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();

  return (
    <div
      className="flex items-center gap-0.5 rounded-lg border border-white/10 bg-zinc-900/60 p-0.5"
      role="group"
      aria-label={t("header.chooseLang")}
    >
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLocale(l)}
          className={cn(
            "min-w-[2rem] rounded-md px-1.5 py-1 text-[11px] font-semibold transition-colors",
            locale === l
              ? "bg-cyna-600 text-white"
              : "text-gray-400 hover:text-gray-200"
          )}
        >
          {l === "fr" ? t("lang.fr") : t("lang.en")}
        </button>
      ))}
    </div>
  );
}
