"use client";

import React, { useEffect, useMemo, useState } from "react";
import ProductImage from "@/components/ui/ProductImage";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PRODUCTS } from "@/constant";
import { Button } from "@/components/ui/Button";
import { publicFetch } from "@/lib/publicApi";
import { useI18n } from "@/context/I18nContext";
import useCart, { type CartItem } from "@/hooks/useCart";

type Plan = {
    label: string;
    billingCycle: string;
    price: string | number;
};

type FeaturedProduct = {
    id: number;
    slug: string;
    name: string;
    shortDescription?: string | null;
    images?: { imageUrl: string; altText?: string | null; displayOrder?: number }[];
    subscriptionPlans?: Plan[];
    category?: { name?: string; slug?: string } | null;
};

function categoryForCartItem(cat?: { name?: string; slug?: string } | null): string {
    const raw = `${cat?.slug ?? ""} ${cat?.name ?? ""}`.toUpperCase();
    if (raw.includes("EDR")) return "EDR";
    if (raw.includes("SOC")) return "SOC";
    if (raw.includes("XDR")) return "XDR";
    return "XDR";
}

function monthlyPlan(plans?: Plan[]): Plan | undefined {
    if (!plans?.length) return undefined;
    const m = plans.find((p) => p.billingCycle === "MONTHLY");
    return m ?? plans[0];
}

function formatPrice(n: string | number, locale: "fr" | "en"): string {
    const x = typeof n === "string" ? parseFloat(n) : n;
    if (Number.isNaN(x)) return "—";
    const loc = locale === "en" ? "en-US" : "fr-FR";
    return new Intl.NumberFormat(loc, { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(x);
}

export default function TopProducts() {
    const { locale, t } = useI18n();
    const { addToCart } = useCart();
    const [apiProducts, setApiProducts] = useState<FeaturedProduct[] | null>(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const featured = await publicFetch<FeaturedProduct[]>("/products/featured");
                if (cancelled) return;
                if (Array.isArray(featured) && featured.length > 0) {
                    setApiProducts(featured);
                    return;
                }
                const all = await publicFetch<FeaturedProduct[]>("/products");
                if (cancelled) return;
                if (Array.isArray(all) && all.length > 0) {
                    setApiProducts(all.slice(0, 6));
                    return;
                }
                setApiProducts([]);
            } catch {
                if (!cancelled) setApiProducts([]);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    const topProducts = useMemo(() => {
        const defaultImg = "/product-placeholder.svg";
        if (apiProducts && apiProducts.length > 0) {
            return apiProducts.map((p) => {
                const plan = monthlyPlan(p.subscriptionPlans);
                const img = [...(p.images ?? [])].sort(
                    (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
                )[0]?.imageUrl?.trim();
                const imageUrl = img && img.length > 0 ? img : defaultImg;
                const priceNum =
                    plan != null
                        ? typeof plan.price === "string"
                            ? parseFloat(plan.price)
                            : plan.price
                        : NaN;
                const cartItem: CartItem | null =
                    plan != null && !Number.isNaN(priceNum)
                        ? {
                              id: p.slug,
                              name: p.name,
                              price: priceNum,
                              quantity: 1,
                              image: imageUrl,
                              category: categoryForCartItem(p.category),
                              period: plan.billingCycle === "YEARLY" ? "annual" : "monthly",
                              isAvailable: true,
                          }
                        : null;
                return {
                    key: String(p.id),
                    slug: p.slug,
                    name: p.name,
                    shortDescription: p.shortDescription ?? "",
                    image: imageUrl,
                    price: plan ? formatPrice(plan.price, locale) : "—",
                    period:
                        plan?.billingCycle === "YEARLY" ? t("common.perYear") : t("common.perMonth"),
                    cartItem,
                };
            });
        }
        const HOME_TOP3_IDS = ["cyna-edr-pro", "cyna-xdr-max", "cyna-soc-managed"];
        const fromConstants = PRODUCTS.filter((p) => HOME_TOP3_IDS.includes(p.id));
        const list = fromConstants.length > 0 ? fromConstants : PRODUCTS.filter((p) => p.status === "available").slice(0, 6);
        return list.map((p) => ({
            key: p.id,
            slug: p.id,
            name: p.name,
            shortDescription: p.shortDescription,
            image: p.image,
            price: String(p.price),
            period: p.period === "monthly" ? t("common.perMonth") : t("common.perYear"),
            cartItem: {
                id: p.id,
                name: p.name,
                price: p.price,
                quantity: 1,
                image: p.image,
                category: p.category,
                period: p.period === "monthly" ? "monthly" : "annual",
                isAvailable: p.status === "available",
            } satisfies CartItem,
        }));
    }, [apiProducts, locale, t]);

    return (
        <section className="py-20 bg-[#09090f]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <h2 className="cyna-heading text-gray-100">
                            {t("home.top.title")}
                        </h2>
                        <p className="text-gray-400 mt-3 text-lg">
                            {t("home.top.subtitle")}
                        </p>
                    </div>
                    <Link
                        href="/catalog"
                        className="hidden md:inline-flex shrink-0 items-center text-cyna-500 hover:text-cyna-400 font-medium transition-colors"
                    >
                        {t("home.top.viewAll")} <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {topProducts.map((product) => (
                        <div
                            key={product.key}
                            /* "outset" moderne : halo violet + halo noir dense + ombre directionnelle + highlight interne */
                            className="group flex flex-col bg-[var(--cyna-card-surface)] border border-zinc-800/80 rounded-3xl overflow-hidden hover:border-cyna-600/50 transition-all duration-300 shadow-[5px_4px_20px_rgba(0,0,0,0.85),0_25px_70px_-20px_rgba(96,11,209,0.45),inset_0_1px_0_0_rgba(255,255,255,0.08)] hover:shadow-[5px_4px_24px_rgba(0,0,0,0.9),0_30px_80px_-15px_rgba(96,11,209,0.55),inset_0_1px_0_0_rgba(255,255,255,0.1)]"
                        >
                            <Link href={`/product/${product.slug}`} className="block relative aspect-video overflow-hidden bg-zinc-900">
                                <ProductImage
                                    src={product.image}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="bg-[#600bd1] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-[0_4px_12px_rgba(96,11,209,0.55)] border border-white/20">
                                        {t("home.top.badge")}
                                    </span>
                                </div>
                            </Link>

                            {/* Bloc info — effet "creusé + highlight outset" pour séparer de l'image */}
                            <div className="relative flex flex-col flex-1 p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),inset_0_2px_0_-1px_rgba(0,0,0,0.55)]">
                                <Link
                                    href={`/product/${product.slug}`}
                                    className="block mb-2 group-hover:text-cyna-400 text-gray-100 transition-colors"
                                >
                                    <h3 className="text-xl font-bold line-clamp-1">{product.name}</h3>
                                </Link>
                                <p className="text-sm text-gray-400 line-clamp-2 mb-6 flex-1">{product.shortDescription}</p>

                                {/* Séparateur creusé (trait noir + highlight blanc dessous) */}
                                <div
                                    aria-hidden
                                    className="mb-6 h-px bg-black/70 shadow-[0_1px_0_0_rgba(255,255,255,0.07)]"
                                />

                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-2xl font-bold text-gray-100">{product.price}€</p>
                                        <p className="text-xs text-gray-500">/ {product.period}</p>
                                    </div>
                                    {product.cartItem ? (
                                        <Button
                                            type="button"
                                            variant="primary"
                                            size="sm"
                                            className="w-full shrink-0 sm:w-auto"
                                            disabled={product.cartItem.isAvailable === false}
                                            onClick={() => addToCart(product.cartItem!)}
                                        >
                                            {t("home.top.addToCart")}
                                        </Button>
                                    ) : (
                                        <Link href={`/product/${product.slug}`} className="w-full sm:w-auto">
                                            <Button variant="outline" size="sm" className="w-full sm:w-auto">
                                                {t("common.buy")}
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 text-center md:hidden">
                    <Link href="/catalog">
                        <Button variant="outline" className="w-full">
                            {t("home.top.mobileCta")}
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
