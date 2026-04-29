"use client";

import Link from "next/link";
import { Linkedin } from "lucide-react";
import { useI18n } from "@/context/I18nContext";

const LINKEDIN_COMPANY = "https://www.linkedin.com/company/cyna-it/";

export default function AppFooter() {
    const { t } = useI18n();
    const links = [
        { href: "/cgu", labelKey: "footer.cgu" as const },
        { href: "/mentions-legales", labelKey: "footer.legal" as const },
        { href: "/sav", labelKey: "footer.sav" as const },
        { href: "/support#contact", labelKey: "footer.contact" as const },
    ];

    return (
        <footer className="hidden md:block bg-zinc-950 border-t border-zinc-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <nav
                    className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-center gap-x-8 gap-y-3 text-sm text-gray-400"
                    aria-label={t("footer.navAria")}
                >
                    {links.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="hover:text-cyna-600 transition-colors text-center sm:text-left"
                        >
                            {t(item.labelKey)}
                        </Link>
                    ))}
                </nav>

                <div className="flex justify-center items-center gap-6 mt-8">
                    <a
                        href={LINKEDIN_COMPANY}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-cyna-500 transition-colors"
                        aria-label="LinkedIn — Cyna"
                    >
                        <Linkedin className="w-5 h-5" aria-hidden />
                    </a>
                </div>
                <p className="text-center text-xs text-gray-600 mt-8">
                    {t("footer.rights", { year: new Date().getFullYear() })}
                </p>
            </div>
        </footer>
    );
}
