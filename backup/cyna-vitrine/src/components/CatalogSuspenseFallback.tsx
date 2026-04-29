"use client";

import { useI18n } from "@/context/I18nContext";

export function CatalogSuspenseFallback() {
    const { t } = useI18n();
    return (
        <div className="min-h-[50vh] p-8 text-gray-400 text-center">{t("common.loading")}</div>
    );
}
