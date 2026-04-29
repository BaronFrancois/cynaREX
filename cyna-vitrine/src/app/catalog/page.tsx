"use client";

import { Button } from "@/components/ui/Button";
import AppSearch from "@/components/AppSearch";
import AppLayout from "@/layout/AppLayout";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState, Suspense } from "react";
import { cn } from "@/lib/utils";
import {
    catalogFallbackFromConstants,
    fetchProductSearch,
    pickMonthlyPrice,
    productCardImage,
    type ApiProductCard,
    type ProductSearchResponse,
} from "@/lib/vitrineCatalog";
import { useI18n } from "@/context/I18nContext";
import { interpolate } from "@/i18n/messages";
import { CatalogSuspenseFallback } from "@/components/CatalogSuspenseFallback";

const CATEGORIES = ["Tous", "EDR", "XDR", "SOC"] as const;

function categoryToSlug(cat: string): string | undefined {
    if (cat === "Tous") return undefined;
    return cat.toLowerCase();
}

function CatalogContent() {
    const { locale, t } = useI18n();
    const searchParams = useSearchParams();
    const router = useRouter();

    const categoryLabel = (cat: string) => (cat === "Tous" ? t("catalog.filter.all") : cat);

    const categoryFilter = searchParams.get("category") || "Tous";
    const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);

    const [activeFilter, setActiveFilter] = useState(categoryFilter);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<ProductSearchResponse | null>(null);

    useEffect(() => {
        setActiveFilter(categoryFilter);
    }, [categoryFilter]);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);
        const slug = categoryToSlug(categoryFilter);
        fetchProductSearch({
            categorySlugs: slug,
            page,
            pageSize: 9,
            sort: "priority",
            order: "asc",
        })
            .then((res) => {
                if (cancelled) return;
                if (res.items.length === 0) {
                    const fb = catalogFallbackFromConstants(categoryFilter);
                    setData({
                        items: fb,
                        total: fb.length,
                        page: 1,
                        pageSize: res.pageSize,
                        totalPages: 1,
                    });
                    setError(null);
                    return;
                }
                setData(res);
            })
            .catch(() => {
                if (!cancelled) {
                    setError(null);
                    const fb = catalogFallbackFromConstants(categoryFilter);
                    setData({
                        items: fb,
                        total: fb.length,
                        page: 1,
                        pageSize: 9,
                        totalPages: 1,
                    });
                }
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [categoryFilter, page]);

    const handleFilterChange = (cat: string) => {
        setActiveFilter(cat);
        const params = new URLSearchParams(searchParams.toString());
        params.delete("page");
        if (cat === "Tous") {
            params.delete("category");
        } else {
            params.set("category", cat);
        }
        router.push(`/catalog?${params.toString()}`);
    };

    const goPage = useCallback(
        (p: number) => {
            const params = new URLSearchParams(searchParams.toString());
            if (p <= 1) params.delete("page");
            else params.set("page", String(p));
            router.push(`/catalog?${params.toString()}`);
        },
        [router, searchParams]
    );

    return (
        <AppLayout>
            <div className="pt-10 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10 md:mb-12">
                    <h1 className="cyna-heading text-gray-100 mb-4">
                        {t("catalog.hero.title")}
                    </h1>
                    <p className="text-xl text-gray-400 mb-6 md:mb-8">
                        {t("catalog.hero.subtitle")}
                    </p>
                    <div className="mx-auto hidden max-w-2xl w-full fade-in md:block">
                        <AppSearch variant="catalogInline" />
                    </div>
                </div>

                <div className="sticky top-16 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800 mb-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 sm:pb-6">
                        <div className="sm:hidden">
                            <select
                                value={activeFilter}
                                onChange={(e) => handleFilterChange(e.target.value)}
                                className="w-full rounded-full border border-cyna-500/40 bg-zinc-900 px-4 py-3 text-sm text-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyna-500"
                                aria-label={t("common.filterCategory")}
                            >
                                {CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {categoryLabel(cat)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="hidden sm:flex flex-wrap gap-2 gap-y-3 pt-1 pb-1">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => handleFilterChange(cat)}
                                    className={cn(
                                        "nav-sku-raised nav-sku-header-login inline-flex items-center justify-center text-sm font-medium leading-none whitespace-nowrap transition-colors",
                                        activeFilter === cat && "nav-sku-header-active"
                                    )}
                                >
                                    {categoryLabel(cat)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {error && (
                        <p className="mb-6 text-center text-red-400 text-sm">{error}</p>
                    )}
                    {loading && (
                        <p className="text-center text-gray-500">{t("common.loadingCatalog")}</p>
                    )}
                    {!loading && data && (
                        <>
                            <p className="text-sm text-gray-500 mb-6 text-center md:text-left">
                                {data.total > 1
                                    ? interpolate(t("common.productsCountPlural"), { n: data.total })
                                    : interpolate(t("common.productsCount"), { n: data.total })}
                                {data.totalPages > 1
                                    ? ` — ${interpolate(t("common.page"), { current: data.page, total: data.totalPages })}`
                                    : ""}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                {data.items.map((product: ApiProductCard) => {
                                    const { display, billing } = pickMonthlyPrice(product, locale);
                                    const periodLabel =
                                        billing === "yearly" ? t("common.perYear") : t("common.perMonth");
                                    return (
                                        <div
                                            key={product.id}
                                            className={cn(
                                                "bg-zinc-900 rounded-3xl shadow-lg border border-zinc-800 overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col group",
                                                !product.isAvailable && "opacity-75"
                                            )}
                                        >
                                            <div className="h-64 overflow-hidden relative">
                                                <img
                                                    src={productCardImage(product)}
                                                    alt=""
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                                {product.isAvailable ? (
                                                    <span className="absolute top-4 right-4 bg-green-500/90 text-white text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-sm uppercase tracking-wide">
                                                        {t("common.available")}
                                                    </span>
                                                ) : (
                                                    <span className="absolute top-4 right-4 bg-zinc-600/90 text-white text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-sm uppercase tracking-wide">
                                                        {t("common.unavailable")}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="p-8 flex-grow flex flex-col">
                                                <div className="text-xs font-bold text-cyna-600 mb-2 uppercase tracking-wide">
                                                    {product.category?.name ?? "—"}
                                                </div>

                                                <h3 className="cyna-heading text-gray-100 mb-2">{product.name}</h3>

                                                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                                    {product.shortDescription}
                                                </p>

                                                <div className="mt-auto pt-6 border-t border-zinc-700 flex items-center justify-between">
                                                    <div>
                                                        <span className="text-lg font-semibold text-gray-100">
                                                            {display}€
                                                        </span>
                                                        <span className="text-gray-500 text-xs"> / {periodLabel}</span>
                                                    </div>

                                                    <Link href={`/product/${product.slug}`}>
                                                        <Button size="sm" variant="primary" className="px-5">
                                                            {t("common.buy")}
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {data.totalPages > 1 && (
                                <div className="mt-12 flex flex-wrap justify-center gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        disabled={page <= 1}
                                        onClick={() => goPage(page - 1)}
                                    >
                                        {t("common.prev")}
                                    </Button>
                                    <span className="flex items-center px-3 text-sm text-gray-400">
                                        {interpolate(t("common.page"), { current: page, total: data.totalPages })}
                                    </span>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        disabled={page >= data.totalPages}
                                        onClick={() => goPage(page + 1)}
                                    >
                                        {t("common.next")}
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

export default function Catalog() {
    return (
        <Suspense fallback={<CatalogSuspenseFallback />}>
            <CatalogContent />
        </Suspense>
    );
}
