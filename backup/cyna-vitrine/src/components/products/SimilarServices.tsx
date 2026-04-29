"use client";

import React from "react";
import ProductImage from "@/components/ui/ProductImage";
import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { PRODUCTS } from "@/constant";
import { buttonClassName } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useI18n } from "@/context/I18nContext";
import { localizeProduct } from "@/i18n/productLabels";

interface SimilarServicesProps {
    currentProductId: string;
    currentCategory: string;
}

export default function SimilarServices({ currentProductId, currentCategory }: SimilarServicesProps) {
    const { locale, t } = useI18n();
    const otherProducts = PRODUCTS.filter((p) => p.id !== currentProductId && p.status === "available");

    const sortedProducts = [...otherProducts].sort((a, b) => {
        if (a.category === currentCategory && b.category !== currentCategory) return -1;
        if (a.category !== currentCategory && b.category === currentCategory) return 1;
        return 0;
    });

    const similarSelected = sortedProducts.slice(0, 6).map((p) => localizeProduct(p, locale));

    if (similarSelected.length === 0) return null;

    const priceLocale = locale === "en" ? "en-US" : "fr-FR";

    return (
        <section className="py-20 bg-black border-t border-zinc-900 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-10">
                    <h2 className="cyna-heading text-gray-100">
                        {t("similar.title")}
                    </h2>
                    <Link href="/catalog" className="text-sm font-medium text-cyna-500 hover:text-cyna-400 transition-colors flex items-center">
                        {t("similar.viewAll")} <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {similarSelected.map((product) => (
                        <Link
                            key={product.id}
                            href={`/product/${product.id}`}
                            className={cn(
                                "group flex flex-col bg-[var(--cyna-card-surface)] border border-zinc-800/80 rounded-3xl overflow-hidden hover:border-cyna-600/50 transition-all duration-300",
                                "shadow-[5px_4px_20px_rgba(0,0,0,0.85),0_25px_70px_-20px_rgba(96,11,209,0.45),inset_0_1px_0_0_rgba(255,255,255,0.08)]",
                                "hover:shadow-[5px_4px_24px_rgba(0,0,0,0.9),0_30px_80px_-15px_rgba(96,11,209,0.55),inset_0_1px_0_0_rgba(255,255,255,0.1)]"
                            )}
                        >
                            <div className="relative h-40 overflow-hidden bg-zinc-900">
                                <ProductImage
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                />
                                <div className="absolute top-3 left-3 flex gap-2">
                                    <span className="bg-black/80 backdrop-blur-sm text-gray-300 text-[10px] font-bold uppercase px-2 py-1 rounded-full border border-zinc-700">
                                        {product.category}
                                    </span>
                                </div>
                            </div>
                            {/* Bloc info — effet "creusé + highlight outset" pour séparer de l'image */}
                            <div className="relative p-5 flex flex-col flex-1 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),inset_0_2px_0_-1px_rgba(0,0,0,0.55)]">
                                <h3 className="text-lg font-bold text-gray-100 mb-2 group-hover:text-cyna-400 transition-colors">
                                    {product.name}
                                </h3>
                                <p className="text-sm text-gray-400 line-clamp-2 mb-4 flex-1">
                                    {product.shortDescription}
                                </p>
                                {/* Séparateur creusé (trait noir + highlight blanc dessous) */}
                                <div
                                    aria-hidden
                                    className="mt-auto mb-4 h-px bg-black/70 shadow-[0_1px_0_0_rgba(255,255,255,0.07)]"
                                />
                                <div className="flex items-end justify-between">
                                    <div>
                                        <p className="font-bold text-gray-100">
                                            {new Intl.NumberFormat(priceLocale, { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(product.price)}€
                                            <span className="text-xs text-gray-500 font-normal">
                                                {" "}/ {product.period === "monthly" ? t("common.perMonth") : t("common.perYear")}
                                            </span>
                                        </p>
                                    </div>
                                    <span
                                        className={cn(
                                            buttonClassName("outline", "sm"),
                                            "inline-flex h-9 w-9 min-h-9 min-w-9 shrink-0 !p-0 pointer-events-none"
                                        )}
                                        aria-hidden
                                    >
                                        <ShoppingBag className="w-3.5 h-3.5" />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
