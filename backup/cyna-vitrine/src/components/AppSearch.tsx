"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Search, X } from "lucide-react";
import Link from "next/link";
import { PRODUCTS } from "../../constants";
import { cn } from "@/lib/utils";
import { useI18n } from "@/context/I18nContext";

type AppSearchVariant = "header" | "catalogInline";

export default function AppSearch({ variant = "header" }: { variant?: AppSearchVariant }) {
    const { t } = useI18n();
    const isCatalogHero = variant === "catalogInline";
    const [open, setOpen] = useState(isCatalogHero);
    const [query, setQuery] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);

    const quickLinks = useMemo(
        () => [
            { label: t("nav.home"), href: "/" },
            { label: t("nav.catalog"), href: "/catalog" },
            { label: t("nav.search"), href: "/search" },
            { label: t("nav.support"), href: "/support" },
            { label: t("nav.cart"), href: "/cart" },
            { label: t("nav.account"), href: "/account" },
        ],
        [t]
    );

    const { navHits, productHits } = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return { navHits: [] as typeof quickLinks, productHits: [] as typeof PRODUCTS };
        const navHits = quickLinks.filter((l) => l.label.toLowerCase().includes(q));
        const productHits = PRODUCTS.filter(
            (p) =>
                p.name.toLowerCase().includes(q) ||
                p.shortDescription.toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q) ||
                p.id.toLowerCase().includes(q)
        );
        return { navHits, productHits };
    }, [query, quickLinks]);

    const hasResults = query.trim() && (navHits.length > 0 || productHits.length > 0);

    useEffect(() => {
        if (isCatalogHero) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false);
                setQuery("");
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isCatalogHero]);

    const onPick = () => {
        setQuery("");
        if (!isCatalogHero) setOpen(false);
    };

    const inputClasses = cn(
        "border border-zinc-700 bg-zinc-900 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyna-500",
        isCatalogHero
            ? "w-full rounded-full py-3.5 pl-12 pr-11 text-base shadow-sm"
            : "w-40 sm:w-64 rounded-lg p-2 pr-10"
    );

    return (
        <div className={cn("relative", isCatalogHero && "z-[45] w-full")}>
            <div ref={containerRef} className={cn("flex items-center", !isCatalogHero && "space-x-2")}>
                {!isCatalogHero && !open && (
                    <button
                        type="button"
                        className="inline-flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center bg-transparent p-0 text-white transition-colors hover:text-cyna-500 shadow-none"
                        onClick={() => setOpen(true)}
                        aria-label={t("search.open")}
                    >
                        <Search className="h-5 w-5" aria-hidden />
                    </button>
                )}

                {(open || isCatalogHero) && (
                    <div className={cn("relative", isCatalogHero ? "w-full" : "z-[60]")}>
                        {isCatalogHero && (
                            <Search
                                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                                aria-hidden
                            />
                        )}
                        <input
                            type="text"
                            inputMode="search"
                            autoComplete="off"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            autoFocus={!isCatalogHero}
                            placeholder={
                                isCatalogHero
                                    ? t("search.placeholderHero")
                                    : t("search.placeholderHeader")
                            }
                            className={inputClasses}
                            aria-label={t("search.label")}
                        />
                        {!isCatalogHero && (
                            <button
                                type="button"
                                className="absolute right-1 top-1.5 text-gray-500 hover:text-gray-200"
                                onClick={() => setQuery("")}
                                aria-label={t("search.clear")}
                            >
                                <X />
                            </button>
                        )}
                        {isCatalogHero && query.trim() !== "" && (
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                                onClick={() => setQuery("")}
                                aria-label={t("search.clearHero")}
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}

                        {query.trim() && (
                            <ul
                                className={cn(
                                    "absolute mt-2 max-h-72 overflow-y-auto rounded-xl border border-zinc-700 bg-zinc-900 text-left shadow-lg z-50",
                                    isCatalogHero
                                        ? "left-0 right-0 w-full"
                                        : "mt-1 w-[min(100vw-2rem,20rem)] sm:w-64"
                                )}
                            >
                                <li>
                                    <Link
                                        href={`/search?q=${encodeURIComponent(query.trim())}`}
                                        className="block cursor-pointer p-2.5 text-sm font-medium text-cyna-400 hover:bg-violet-950/50"
                                        onClick={onPick}
                                    >
                                        {t("search.advanced")}
                                    </Link>
                                </li>
                                {navHits.map((l) => (
                                    <li key={l.href}>
                                        <Link
                                            href={l.href}
                                            className="block cursor-pointer p-2.5 text-sm text-gray-200 hover:bg-violet-950/50"
                                            onClick={onPick}
                                        >
                                            {l.label}
                                            <span className="ml-1 text-xs text-gray-400">{t("search.pageBadge")}</span>
                                        </Link>
                                    </li>
                                ))}
                                {productHits.map((p) => (
                                    <li key={p.id}>
                                        <Link
                                            href={`/product/${p.id}`}
                                            className="block cursor-pointer p-2.5 text-sm hover:bg-violet-950/50"
                                            onClick={onPick}
                                        >
                                            <span className="font-medium text-gray-200">{p.name}</span>
                                            <span className="block truncate text-xs text-gray-500">
                                                {p.category}
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                                {!hasResults && (
                                    <li className="px-2.5 py-2 text-xs text-gray-500 border-t border-zinc-800">
                                        {t("search.noQuick")}
                                    </li>
                                )}
                            </ul>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
