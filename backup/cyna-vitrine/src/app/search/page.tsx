"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AppLayout from "@/layout/AppLayout";
import { Button } from "@/components/ui/Button";
import {
    buildProductSearchParams,
    fetchProductSearch,
    pickMonthlyPrice,
    productCardImage,
    PRODUCT_PLACEHOLDER_IMAGE,
    type ProductSearchResponse,
    type ApiProductCard,
} from "@/lib/vitrineCatalog";
import { cn } from "@/lib/utils";
import { useI18n } from "@/context/I18nContext";
import { interpolate } from "@/i18n/messages";

const CATEGORY_OPTIONS = [
    { slug: "edr", label: "EDR" },
    { slug: "xdr", label: "XDR" },
    { slug: "soc", label: "SOC" },
    { slug: "cloud", label: "Cloud" },
    { slug: "network", label: "Network" },
];

function parseSearchParams(sp: URLSearchParams) {
    const rawCats = sp.get("categorySlugs");
    return {
        q: sp.get("q") ?? "",
        title: sp.get("title") ?? "",
        description: sp.get("description") ?? "",
        technical: sp.get("technical") ?? "",
        priceMin: sp.get("priceMin") ?? "",
        priceMax: sp.get("priceMax") ?? "",
        availableOnly: sp.get("availableOnly") === "true",
        sort: sp.get("sort") ?? "priority",
        order: sp.get("order") ?? "asc",
        page: Number(sp.get("page") ?? "1") || 1,
        selectedCats: new Set(
            (rawCats ?? "")
                .split(",")
                .map((s) => s.trim().toLowerCase())
                .filter(Boolean)
        ),
    };
}

function SearchPageInner() {
    const { locale, t } = useI18n();
    const router = useRouter();
    const sp = useSearchParams();
    const spKey = sp.toString();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<ProductSearchResponse | null>(null);

    const [q, setQ] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [technical, setTechnical] = useState("");
    const [priceMin, setPriceMin] = useState("");
    const [priceMax, setPriceMax] = useState("");
    const [availableOnly, setAvailableOnly] = useState(false);
    const [sort, setSort] = useState("priority");
    const [order, setOrder] = useState("asc");
    const [page, setPage] = useState(1);
    const [selectedCats, setSelectedCats] = useState<Set<string>>(new Set());

    useEffect(() => {
        const p = parseSearchParams(sp);
        setQ(p.q);
        setTitle(p.title);
        setDescription(p.description);
        setTechnical(p.technical);
        setPriceMin(p.priceMin);
        setPriceMax(p.priceMax);
        setAvailableOnly(p.availableOnly);
        setSort(p.sort);
        setOrder(p.order);
        setPage(p.page);
        setSelectedCats(p.selectedCats);
    }, [spKey, sp]);

    useEffect(() => {
        const p = parseSearchParams(sp);
        const categorySlugs = [...p.selectedCats].sort().join(",");
        let cancelled = false;
        setLoading(true);
        setError(null);
        fetchProductSearch({
            q: p.q || undefined,
            title: p.title || undefined,
            description: p.description || undefined,
            technical: p.technical || undefined,
            priceMin: p.priceMin || undefined,
            priceMax: p.priceMax || undefined,
            categorySlugs: categorySlugs || undefined,
            availableOnly: p.availableOnly || undefined,
            sort: p.sort,
            order: p.order,
            page: p.page,
            pageSize: 12,
        })
            .then((res) => {
                if (!cancelled) setData(res);
            })
            .catch((e) => {
                if (!cancelled) {
                    setError(e instanceof Error ? e.message : "Erreur de recherche");
                    setData(null);
                }
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [spKey, sp]);

    const pushUrl = useCallback(
        (overrides: Partial<{ page: number }> = {}) => {
            const categorySlugs = [...selectedCats].sort().join(",");
            const p = overrides.page ?? page;
            const qs = buildProductSearchParams({
                q: q || undefined,
                title: title || undefined,
                description: description || undefined,
                technical: technical || undefined,
                priceMin: priceMin || undefined,
                priceMax: priceMax || undefined,
                categorySlugs: categorySlugs || undefined,
                availableOnly: availableOnly || undefined,
                sort,
                order,
                page: p,
                pageSize: 12,
            });
            router.push(`/search?${qs}`);
        },
        [router, selectedCats, q, title, description, technical, priceMin, priceMax, availableOnly, sort, order, page]
    );

    const onSubmitFilters = (e: React.FormEvent) => {
        e.preventDefault();
        const categorySlugs = [...selectedCats].sort().join(",");
        const qs = buildProductSearchParams({
            q: q || undefined,
            title: title || undefined,
            description: description || undefined,
            technical: technical || undefined,
            priceMin: priceMin || undefined,
            priceMax: priceMax || undefined,
            categorySlugs: categorySlugs || undefined,
            availableOnly: availableOnly || undefined,
            sort,
            order,
            page: 1,
            pageSize: 12,
        });
        router.push(`/search?${qs}`);
    };

    const toggleCat = (slug: string) => {
        setSelectedCats((prev) => {
            const n = new Set(prev);
            if (n.has(slug)) n.delete(slug);
            else n.add(slug);
            return n;
        });
    };

    return (
        <AppLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20">
                <h1 className="cyna-heading text-gray-100 mb-2">{t("searchPage.title")}</h1>
                <p className="text-gray-400 mb-8">{t("searchPage.subtitle")}</p>

                <form
                    onSubmit={onSubmitFilters}
                    className="grid gap-6 lg:grid-cols-[minmax(0,280px)_1fr] mb-10"
                >
                    <aside className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 h-fit">
                        <label className="block text-sm text-gray-400">
                            {t("searchPage.freeText")}
                            <input
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-gray-200"
                                placeholder={t("searchPage.freeTextPh")}
                            />
                        </label>
                        <label className="block text-sm text-gray-400">
                            {t("searchPage.titleContains")}
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-gray-200"
                            />
                        </label>
                        <label className="block text-sm text-gray-400">
                            {t("searchPage.descContains")}
                            <input
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-gray-200"
                            />
                        </label>
                        <label className="block text-sm text-gray-400">
                            {t("searchPage.techSpecs")}
                            <input
                                value={technical}
                                onChange={(e) => setTechnical(e.target.value)}
                                className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-gray-200"
                            />
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            <label className="block text-sm text-gray-400">
                                Prix min
                                <input
                                    type="number"
                                    min={0}
                                    step="0.01"
                                    value={priceMin}
                                    onChange={(e) => setPriceMin(e.target.value)}
                                    className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-gray-200"
                                />
                            </label>
                            <label className="block text-sm text-gray-400">
                                {t("searchPage.priceMax")}
                                <input
                                    type="number"
                                    min={0}
                                    step="0.01"
                                    value={priceMax}
                                    onChange={(e) => setPriceMax(e.target.value)}
                                    className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-gray-200"
                                />
                            </label>
                        </div>
                        <fieldset>
                            <legend className="text-sm text-gray-400 mb-2">{t("searchPage.categories")}</legend>
                            <div className="flex flex-wrap gap-2">
                                {CATEGORY_OPTIONS.map((c) => (
                                    <button
                                        key={c.slug}
                                        type="button"
                                        onClick={() => toggleCat(c.slug)}
                                        className={cn(
                                            "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                                            selectedCats.has(c.slug)
                                                ? "border-cyna-500 bg-cyna-950/50 text-cyna-300"
                                                : "border-zinc-700 text-gray-400 hover:border-zinc-500"
                                        )}
                                    >
                                        {c.label}
                                    </button>
                                ))}
                            </div>
                        </fieldset>
                        <label className="flex items-center gap-2 text-sm text-gray-300">
                            <input
                                type="checkbox"
                                checked={availableOnly}
                                onChange={(e) => setAvailableOnly(e.target.checked)}
                            />
                            {t("searchPage.availableOnly")}
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            <label className="block text-sm text-gray-400">
                                {t("searchPage.sort")}
                                <select
                                    value={sort}
                                    onChange={(e) => setSort(e.target.value)}
                                    className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-gray-200"
                                >
                                    <option value="priority">{t("searchPage.sortPriority")}</option>
                                    <option value="price">{t("searchPage.sortPrice")}</option>
                                    <option value="new">{t("searchPage.sortNew")}</option>
                                    <option value="availability">{t("searchPage.sortAvailability")}</option>
                                </select>
                            </label>
                            <label className="block text-sm text-gray-400">
                                {t("searchPage.order")}
                                <select
                                    value={order}
                                    onChange={(e) => setOrder(e.target.value)}
                                    className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-gray-200"
                                >
                                    <option value="asc">{t("searchPage.orderAsc")}</option>
                                    <option value="desc">{t("searchPage.orderDesc")}</option>
                                </select>
                            </label>
                        </div>
                        <Button type="submit" variant="primary" className="w-full">
                            {t("searchPage.apply")}
                        </Button>
                    </aside>

                    <div>
                        {error && (
                            <p className="mb-4 rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-200">
                                {error}
                            </p>
                        )}
                        {loading && <p className="text-gray-500">{t("common.loading")}</p>}
                        {!loading && data && (
                            <>
                                <p className="text-sm text-gray-500 mb-4">
                                    {data.total > 1
                                        ? interpolate(t("common.resultsCountPlural"), { n: data.total })
                                        : interpolate(t("common.resultsCount"), { n: data.total })}{" "}
                                    {interpolate(t("searchPage.pageLine"), {
                                        page: data.page,
                                        totalPages: data.totalPages,
                                    })}
                                </p>
                                {data.items.length === 0 && (
                                    <p className="text-gray-500 py-8">{t("searchPage.noResults")}</p>
                                )}
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {data.items.map((product: ApiProductCard) => {
                                        const { display, billing } = pickMonthlyPrice(product, locale);
                                        const periodLabel =
                                            billing === "yearly" ? t("common.perYear") : t("common.perMonth");
                                        return (
                                            <li
                                                key={product.id}
                                                className={cn(
                                                    "group flex flex-col bg-[var(--cyna-card-surface)] border border-zinc-800/80 rounded-3xl overflow-hidden hover:border-cyna-600/50 transition-all duration-300",
                                                    "shadow-[5px_4px_20px_rgba(0,0,0,0.85),0_25px_70px_-20px_rgba(96,11,209,0.45),inset_0_1px_0_0_rgba(255,255,255,0.08)]",
                                                    "hover:shadow-[5px_4px_24px_rgba(0,0,0,0.9),0_30px_80px_-15px_rgba(96,11,209,0.55),inset_0_1px_0_0_rgba(255,255,255,0.1)]",
                                                    !product.isAvailable && "opacity-70"
                                                )}
                                            >
                                                <Link href={`/product/${product.slug}`} className="block h-44 overflow-hidden bg-zinc-900">
                                                    <img
                                                        src={productCardImage(product)}
                                                        alt=""
                                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                        onError={(e) => {
                                                            const img = e.currentTarget;
                                                            if (img.src.endsWith(PRODUCT_PLACEHOLDER_IMAGE)) return;
                                                            img.src = PRODUCT_PLACEHOLDER_IMAGE;
                                                        }}
                                                    />
                                                </Link>
                                                {/* Bloc info — effet "creusé + highlight outset" pour séparer de l'image */}
                                                <div className="relative p-5 flex flex-col flex-1 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),inset_0_2px_0_-1px_rgba(0,0,0,0.55)]">
                                                    <span className="text-xs font-semibold uppercase text-cyna-500">
                                                        {product.category?.name ?? "—"}
                                                    </span>
                                                    <Link
                                                        href={`/product/${product.slug}`}
                                                        className="mt-1 text-lg font-bold text-gray-100 hover:text-cyna-400"
                                                    >
                                                        {product.name}
                                                    </Link>
                                                    <p className="mt-2 text-sm text-gray-400 line-clamp-2 flex-1">
                                                        {product.shortDescription}
                                                    </p>
                                                    {/* Séparateur creusé (trait noir + highlight blanc dessous) */}
                                                    <div
                                                        aria-hidden
                                                        className="mt-4 mb-4 h-px bg-black/70 shadow-[0_1px_0_0_rgba(255,255,255,0.07)]"
                                                    />
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-gray-200 font-semibold">
                                                            {display}€{" "}
                                                            <span className="text-xs text-gray-500">/ {periodLabel}</span>
                                                        </span>
                                                        {!product.isAvailable ? (
                                                            <span className="text-xs text-amber-400">
                                                                {t("common.unavailable")}
                                                            </span>
                                                        ) : (
                                                            <Link href={`/product/${product.slug}`}>
                                                                <Button size="sm" variant="primary">
                                                                    {t("searchPage.view")}
                                                                </Button>
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                                {data.totalPages > 1 && (
                                    <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            disabled={page <= 1}
                                            onClick={() => pushUrl({ page: page - 1 })}
                                        >
                                            {t("common.prev")}
                                        </Button>
                                        {Array.from({ length: data.totalPages }, (_, i) => i + 1)
                                            .filter(
                                                (p) =>
                                                    p === 1 ||
                                                    p === data.totalPages ||
                                                    Math.abs(p - page) <= 1
                                            )
                                            .map((p, i, arr) => (
                                                <span key={p} className="flex items-center gap-2">
                                                    {i > 0 && arr[i - 1] !== p - 1 && (
                                                        <span className="text-gray-600">…</span>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => pushUrl({ page: p })}
                                                        className={cn(
                                                            "min-w-9 rounded-lg px-3 py-1 text-sm",
                                                            page === p
                                                                ? "bg-cyna-600 text-white"
                                                                : "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
                                                        )}
                                                    >
                                                        {p}
                                                    </button>
                                                </span>
                                            ))}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            disabled={page >= data.totalPages}
                                            onClick={() => pushUrl({ page: page + 1 })}
                                        >
                                            {t("common.next")}
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="min-h-[40vh] p-8 text-gray-400">Chargement…</div>}>
            <SearchPageInner />
        </Suspense>
    );
}
