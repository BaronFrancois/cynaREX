"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { publicFetch } from "@/lib/publicApi";
import { useI18n } from "@/context/I18nContext";
import type { MessageKey } from "@/i18n/messages";

const CATEGORY_HOVER: Record<string, MessageKey> = {
    edr: "home.categories.hover.edr",
    xdr: "home.categories.hover.xdr",
    soc: "home.categories.hover.soc",
};

type CategoryApi = {
    id: number;
    name: string;
    slug: string;
    imageUrl?: string | null;
    displayOrder?: number;
};

const HOME_SLUGS = new Set(["edr", "xdr", "soc"]);

const colorForSlug = (slug: string) => {
    if (slug === "edr")
        return "group-hover:text-cyna-400 group-focus-within:text-cyna-400";
    if (slug === "xdr")
        return "group-hover:text-fuchsia-400 group-focus-within:text-fuchsia-400";
    if (slug === "soc")
        return "group-hover:text-violet-400 group-focus-within:text-violet-400";
    return "group-hover:text-cyna-400 group-focus-within:text-cyna-400";
};

export default function CategoryGrid() {
    const { t } = useI18n();
    const [categories, setCategories] = useState<CategoryApi[] | null>(null);

    const FALLBACK = useMemo(
        () => [
            {
                slug: "edr",
                name: t("home.categories.fallback.edr"),
                imageUrl:
                    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
                color: "group-hover:text-cyna-400 group-focus-within:text-cyna-400",
            },
            {
                slug: "xdr",
                name: t("home.categories.fallback.xdr"),
                imageUrl:
                    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
                color: "group-hover:text-fuchsia-400 group-focus-within:text-fuchsia-400",
            },
            {
                slug: "soc",
                name: t("home.categories.fallback.soc"),
                imageUrl:
                    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
                color: "group-hover:text-violet-400 group-focus-within:text-violet-400",
            },
        ],
        [t]
    );

    useEffect(() => {
        let cancelled = false;
        publicFetch<CategoryApi[]>("/categories")
            .then((data) => {
                if (!cancelled && Array.isArray(data)) setCategories(data);
            })
            .catch(() => {
                if (!cancelled) setCategories([]);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    const items = useMemo(() => {
        if (categories && categories.length > 0) {
            const filtered = categories
                .filter((c) => HOME_SLUGS.has(c.slug.toLowerCase()))
                .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
            if (filtered.length > 0) {
                return filtered.map((c) => ({
                    key: c.slug,
                    slugLower: c.slug.toLowerCase(),
                    name: c.name,
                    href: `/catalog?category=${encodeURIComponent(c.name)}`,
                    imageUrl:
                        c.imageUrl ??
                        FALLBACK.find((f) => f.slug === c.slug)?.imageUrl ??
                        FALLBACK[0].imageUrl,
                    color: colorForSlug(c.slug.toLowerCase()),
                }));
            }
        }
        return FALLBACK.map((c) => ({
            key: c.slug,
            slugLower: c.slug,
            name: c.name,
            href: `/catalog?category=${c.slug.toUpperCase()}`,
            imageUrl: c.imageUrl,
            color: c.color,
        }));
    }, [categories, FALLBACK]);

    return (
        <section className="py-20 bg-[var(--cyna-section-solutions-bg)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="cyna-heading text-gray-100">
                        {t("home.categories.title")}
                    </h2>
                    <div className="w-16 h-1 bg-cyna-600 mx-auto mt-4 rounded-full" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-10">
                    {items.map((category) => {
                        const hoverKey = CATEGORY_HOVER[category.slugLower];
                        const explainerId = hoverKey
                            ? `category-explainer-${category.key.replace(/[^a-zA-Z0-9_-]/g, "")}`
                            : undefined;
                        return (
                        <Link
                            key={category.key}
                            href={category.href}
                            aria-describedby={explainerId}
                            className={[
                                "group block relative overflow-hidden rounded-3xl aspect-[4/5] sm:aspect-square bg-zinc-900 shadow-xl",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyna-400 focus-visible:ring-offset-2",
                                "focus-visible:ring-offset-[var(--cyna-section-solutions-bg,#09090b)]",
                            ].join(" ")}
                        >
                            {hoverKey ? (
                                <span id={explainerId} className="sr-only">
                                    {t(hoverKey)}
                                </span>
                            ) : null}
                            <img
                                src={category.imageUrl}
                                alt=""
                                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-focus-within:scale-110 opacity-70 group-hover:opacity-100 group-focus-within:opacity-100"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                            {hoverKey ? (
                                <div
                                    className="absolute inset-0 z-[5] flex flex-col justify-start bg-black/0 px-6 pb-6 pt-10 opacity-0 transition-all duration-300 ease-out group-hover:bg-black/65 group-hover:opacity-100 group-focus-within:bg-black/65 group-focus-within:opacity-100 md:px-7 md:pb-8 md:pt-14"
                                    aria-hidden
                                >
                                    <p className="max-w-[95%] text-sm leading-relaxed text-white/92 md:max-w-[22rem] md:text-[0.9375rem]">
                                        {t(hoverKey)}
                                    </p>
                                </div>
                            ) : null}

                            <div className="absolute bottom-6 left-6 right-6 z-[6]">
                                <h3
                                    className={`cyna-heading mb-2 text-white transition-colors duration-300 ${category.color}`}
                                >
                                    {category.name}
                                </h3>
                                <div className="flex items-center text-sm font-medium text-gray-300 group-hover:text-white group-focus-within:text-white transition-colors duration-300">
                                    {t("home.categories.cta")}{" "}
                                    <ArrowRight className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-focus-within:opacity-100 group-focus-within:translate-x-0 transition-all duration-300" />
                                </div>
                            </div>
                        </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
