"use client";

import { useState, useEffect } from "react";
import useCart from "@/hooks/useCart";
import { cartLineIsAvailable } from "@/lib/cartAvailability";
import AppLayout from "@/layout/AppLayout";
import Link from "next/link";
import { PRODUCTS } from "@/constant";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, LogIn, UserPlus, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonClassName } from "@/components/ui/Button";
import { useI18n } from "@/context/I18nContext";
import { interpolate } from "@/i18n/messages";

const TVA_RATE = 0.20;

// ── Quantity stepper ──────────────────────────────────────────────────────────
function QuantityStepper({
    value,
    onChange,
    disabled,
}: {
    value: number;
    onChange: (v: number) => void;
    disabled?: boolean;
}) {
    const { t } = useI18n();
    return (
        <div className="flex items-center gap-1">
            <button
                onClick={() => onChange(Math.max(1, value - 1))}
                disabled={disabled || value <= 1}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-zinc-800 border border-zinc-700 text-gray-300 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label={t("cart.decreaseQty")}
            >
                <Minus className="w-3 h-3" />
            </button>
            <span className="w-8 text-center text-sm font-semibold text-gray-100 tabular-nums">
                {value}
            </span>
            <button
                onClick={() => onChange(Math.min(99, value + 1))}
                disabled={disabled || value >= 99}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-zinc-800 border border-zinc-700 text-gray-300 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label={t("cart.increaseQty")}
            >
                <Plus className="w-3 h-3" />
            </button>
        </div>
    );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyCart({ isAuthenticated }: { isAuthenticated: boolean }) {
    const { t } = useI18n();
    return (
        <AppLayout>
            <div className="mx-auto flex min-h-[min(60vh,720px)] w-full max-w-2xl flex-col items-center justify-center px-4 py-16 text-center sm:py-24">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-800 border border-zinc-700">
                    <ShoppingBag className="w-9 h-9 text-gray-400" />
                </div>
                <h2 className="cyna-heading text-gray-100 mb-3">
                    {t("cart.empty.title")}
                </h2>
                <p className="mb-8 max-w-md text-gray-400">
                    {t("cart.empty.subtitle")}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    {!isAuthenticated && (
                        <Link
                            href="/auth/login"
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-zinc-600 text-gray-300 hover:border-zinc-400 hover:text-gray-100 text-sm font-medium transition-colors"
                        >
                            <LogIn className="w-4 h-4" />
                            {t("header.login")}
                        </Link>
                    )}
                    <Link
                        href="/catalog"
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-cyna-600 hover:bg-cyna-700 text-white text-sm font-semibold transition-colors"
                    >
                        {t("cart.empty.discover")}
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Cart() {
    const { t } = useI18n();
    const { items, total, removeFromCart, updateCartItem } = useCart();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const hasCookie = document.cookie.includes("auth_token=");
        setIsAuthenticated(!!(token || hasCookie));
    }, []);

    if (items.length === 0) {
        return <EmptyCart isAuthenticated={isAuthenticated} />;
    }

    // Availability
    const isCartAvailable = items.every((item) => cartLineIsAvailable(item));

    // Totaux
    const subtotalHT = total;
    const tva = subtotalHT * TVA_RATE;
    const totalTTC = subtotalHT + tva;

    const handlePeriodChange = (
        itemId: string,
        newPeriod: "monthly" | "annual"
    ) => {
        const item = items.find((i) => i.id === itemId);
        if (!item || item.period === newPeriod) return;
        const product = PRODUCTS.find((p) => p.id === itemId);
        const basePrice = product?.price ?? item.price;
        const isBaseMonthly = product?.period === "monthly";
        let newPrice = basePrice;
        if (isBaseMonthly && newPeriod === "annual") newPrice = basePrice * 10;
        if (!isBaseMonthly && newPeriod === "monthly") newPrice = basePrice / 10;
        updateCartItem(itemId, { period: newPeriod, price: newPrice });
    };

    return (
        <AppLayout>
            <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:py-20">

                {/* ── En-tête ── */}
                <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <h1 className="cyna-heading text-gray-100">
                        {t("cart.title")}
                        <span className="ml-3 text-lg font-normal text-gray-500">
                            {items.reduce((n, i) => n + i.quantity, 0) > 1
                                ? interpolate(t("cart.itemsCountPlural"), {
                                      n: items.reduce((n, i) => n + i.quantity, 0),
                                  })
                                : interpolate(t("cart.itemsCount"), {
                                      n: items.reduce((n, i) => n + i.quantity, 0),
                                  })}
                        </span>
                    </h1>
                    <Link
                        href="/catalog"
                        className="inline-flex items-center gap-1.5 text-sm text-cyna-500 hover:text-cyna-400 font-medium transition-colors"
                    >
                        ← {t("cart.continue")}
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 items-start">

                    {/* ── Liste des articles ── */}
                    <div className="space-y-0 divide-y divide-zinc-800 rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden">
                        {items.map((item) => {
                            const product = PRODUCTS.find((p) => p.id === item.id);
                            const isAvailable = cartLineIsAvailable(item);
                            const lineTotal = item.price * item.quantity;

                            return (
                                <div
                                    key={item.id}
                                    className={cn(
                                        "flex flex-col sm:flex-row gap-5 p-6 transition-opacity",
                                        !isAvailable && "opacity-60"
                                    )}
                                >
                                    {/* Miniature */}
                                    <div className="relative w-full sm:w-28 h-28 rounded-xl overflow-hidden bg-zinc-800 flex-shrink-0">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                        {!isAvailable && (
                                            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                                                <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">
                                                    {t("common.unavailable")}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Détails */}
                                    <div className="flex flex-1 flex-col gap-3 min-w-0">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                                                    <h3 className="text-base font-semibold text-gray-100 truncate">
                                                        {item.name}
                                                    </h3>
                                                    {!isAvailable ? (
                                                        <span className="shrink-0 text-[10px] font-bold text-yellow-400 bg-yellow-950/50 border border-yellow-800/60 px-2 py-0.5 rounded-full uppercase tracking-wide">
                                                            {t("common.unavailable")}
                                                        </span>
                                                    ) : (
                                                        <span className="shrink-0 text-[10px] font-bold text-green-400 bg-green-950/50 border border-green-800/60 px-2 py-0.5 rounded-full uppercase tracking-wide">
                                                            {t("common.available")}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-500">
                                                    {t("common.category")} {item.category}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="shrink-0 p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-950/30 transition-colors"
                                                aria-label={t("cart.removeLine")}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* Période + quantité + prix */}
                                        <div className="flex flex-wrap items-center gap-4">
                                            {/* Durée d'abonnement */}
                                            <select
                                                value={item.period}
                                                onChange={(e) =>
                                                    handlePeriodChange(
                                                        item.id,
                                                        e.target.value as "monthly" | "annual"
                                                    )
                                                }
                                                disabled={!isAvailable}
                                                className="bg-zinc-800 border border-zinc-700 text-gray-300 text-xs rounded-lg focus:ring-cyna-500 focus:border-cyna-500 px-2.5 py-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                                            >
                                                <option value="monthly">{t("common.monthly")}</option>
                                                <option value="annual">{t("common.yearly")}</option>
                                            </select>

                                            {/* Quantité */}
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-gray-500">{t("common.qty")}</span>
                                                <QuantityStepper
                                                    value={item.quantity}
                                                    onChange={(v) => updateCartItem(item.id, { quantity: v })}
                                                    disabled={!isAvailable}
                                                />
                                            </div>

                                            {/* Prix unitaire × quantité */}
                                            <div className="ml-auto text-right">
                                                <p className="text-lg font-bold text-gray-100 tabular-nums">
                                                    {lineTotal.toFixed(2)}€
                                                </p>
                                                {item.quantity > 1 && (
                                                    <p className="text-xs text-gray-500 tabular-nums">
                                                        {item.price.toFixed(2)}€ × {item.quantity}
                                                    </p>
                                                )}
                                                <p className="text-xs text-gray-600 mt-0.5">
                                                    / {item.period === "monthly" ? t("common.perMonth") : t("common.perYear")}{" "}
                                                    {t("common.ht")}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* ── Récapitulatif ── */}
                    <aside className="space-y-4">

                        {/* Résumé financier */}
                        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 space-y-4">
                            <h2 className="cyna-heading text-gray-100 mb-2">
                                {t("cart.summary")}
                            </h2>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between text-gray-400">
                                    <span>{t("cart.subtotal")}</span>
                                    <span className="text-gray-200 tabular-nums">
                                        {subtotalHT.toFixed(2)}€
                                    </span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>{t("cart.vat")}</span>
                                    <span className="text-gray-200 tabular-nums">
                                        {tva.toFixed(2)}€
                                    </span>
                                </div>
                            </div>
                            <div className="border-t border-zinc-700 pt-4 flex justify-between">
                                <span className="font-bold text-gray-100">{t("cart.totalTtc")}</span>
                                <span className="font-bold text-xl text-gray-100 tabular-nums">
                                    {totalTTC.toFixed(2)}€
                                </span>
                            </div>

                            {/* Alerte article indisponible */}
                            {!isCartAvailable && (
                                <div className="flex items-start gap-2 bg-yellow-950/40 border border-yellow-800/50 rounded-xl p-3 text-xs text-yellow-300">
                                    <Info className="w-4 h-4 shrink-0 mt-0.5" />
                                    <span>{t("cart.unavailableBanner")}</span>
                                </div>
                            )}

                            {/* CTA selon état auth */}
                            {isAuthenticated ? (
                                <Link
                                    href={isCartAvailable ? "/checkout" : "#"}
                                    className={cn(
                                        buttonClassName("primary", "md"),
                                        "w-full gap-2 text-sm font-semibold !py-3",
                                        !isCartAvailable && "pointer-events-none opacity-50"
                                    )}
                                    aria-disabled={!isCartAvailable}
                                >
                                    {t("cart.checkout")}
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            ) : (
                                <Link
                                    href={isCartAvailable ? "/checkout?guest=true" : "#"}
                                    className={cn(
                                        buttonClassName("outline", "md"),
                                        "w-full gap-2 text-sm font-semibold !py-3",
                                        !isCartAvailable && "pointer-events-none opacity-50"
                                    )}
                                    aria-disabled={!isCartAvailable}
                                >
                                    {t("cart.guestCheckout")}
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            )}
                        </div>

                        {/* Rappel connexion (non-connectés uniquement) */}
                        {!isAuthenticated && (
                            <div className="rounded-2xl border border-cyna-600/30 bg-cyna-600/5 p-5 space-y-3">
                                <div className="flex items-start gap-2">
                                    <Info className="w-4 h-4 text-cyna-400 shrink-0 mt-0.5" />
                                    <p className="text-xs text-gray-400 leading-relaxed">
                                        {t("cart.loginHint")}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Link
                                        href="/auth/login"
                                        className={cn(
                                            buttonClassName("primary", "sm"),
                                            "w-full gap-2 text-sm font-semibold"
                                        )}
                                    >
                                        <LogIn className="w-4 h-4" />
                                        {t("header.login")}
                                    </Link>
                                    <Link
                                        href="/auth/register"
                                        className={cn(
                                            buttonClassName("outline", "sm"),
                                            "w-full gap-2 text-sm font-semibold"
                                        )}
                                    >
                                        <UserPlus className="w-4 h-4" />
                                        {t("auth.login.register")}
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Mentions rassurantes */}
                        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 space-y-2 text-xs text-gray-500">
                            <p className="flex items-center gap-2">
                                <span className="text-green-500">✓</span>
                                {t("cart.secureStripe")}
                            </p>
                            <p className="flex items-center gap-2">
                                <span className="text-green-500">✓</span>
                                {t("cart.cancelAnytime")}
                            </p>
                            <p className="flex items-center gap-2">
                                <span className="text-green-500">✓</span>
                                {t("cart.support247")}
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </AppLayout>
    );
}
