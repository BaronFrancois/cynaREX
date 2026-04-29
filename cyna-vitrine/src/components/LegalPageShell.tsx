"use client";

import AppLayout from "@/layout/AppLayout";
import { useI18n } from "@/context/I18nContext";

export default function LegalPageShell({
    titleFr,
    titleEn,
    children,
}: {
    titleFr: string;
    titleEn: string;
    children: React.ReactNode;
}) {
    const { locale } = useI18n();
    const title = locale === "en" ? titleEn : titleFr;

    return (
        <AppLayout>
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
                <h1 className="cyna-heading text-gray-100 mb-10">{title}</h1>
                <div className="cyna-legal-body text-gray-400 text-sm md:text-base leading-relaxed space-y-6 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">
                    {children}
                </div>
            </div>
        </AppLayout>
    );
}
