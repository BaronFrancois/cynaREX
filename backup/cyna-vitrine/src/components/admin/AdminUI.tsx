"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

/** Carte sombre, look Cyna. */
export function Card({
    children,
    className,
    title,
    actions,
}: {
    children: ReactNode;
    className?: string;
    title?: ReactNode;
    actions?: ReactNode;
}) {
    return (
        <section
            className={cn(
                "overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-6 shadow-[0_20px_60px_-20px_rgba(96,11,209,0.25)]",
                className,
            )}
        >
            {(title || actions) && (
                <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    {title ? <h2 className="text-lg font-semibold text-white">{title}</h2> : <span />}
                    {actions}
                </header>
            )}
            {children}
        </section>
    );
}

/** KPI compact pour le dashboard. */
export function StatCard({
    label,
    value,
    hint,
    accent,
}: {
    label: string;
    value: ReactNode;
    hint?: string;
    accent?: "violet" | "green" | "amber" | "rose";
}) {
    const accentMap: Record<NonNullable<typeof accent>, string> = {
        violet: "from-[#600bd1]/40 to-[#600bd1]/0",
        green: "from-emerald-500/35 to-emerald-500/0",
        amber: "from-amber-500/35 to-amber-500/0",
        rose: "from-rose-500/35 to-rose-500/0",
    };
    return (
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div
                className={cn(
                    "absolute inset-x-0 top-0 h-20 bg-gradient-to-b",
                    accentMap[accent ?? "violet"],
                    "pointer-events-none opacity-80",
                )}
                aria-hidden
            />
            <div className="relative">
                <p className="text-xs font-medium uppercase tracking-wide text-white/60">{label}</p>
                <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
                {hint && <p className="mt-1 text-xs text-white/50">{hint}</p>}
            </div>
        </div>
    );
}

/** Badge coloré selon un statut (Order, Subscription, Contact, Chatbot). */
export function StatusBadge({ status }: { status: string }) {
    const color = STATUS_COLORS[status] ?? "bg-white/10 text-white/80 border-white/20";
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
                color,
            )}
        >
            {status}
        </span>
    );
}

const STATUS_COLORS: Record<string, string> = {
    // Orders
    PENDING: "bg-amber-500/15 text-amber-200 border-amber-500/40",
    PAID: "bg-emerald-500/15 text-emerald-200 border-emerald-500/40",
    ACTIVE: "bg-emerald-500/15 text-emerald-200 border-emerald-500/40",
    CANCELLED: "bg-rose-500/15 text-rose-200 border-rose-500/40",
    REFUNDED: "bg-sky-500/15 text-sky-200 border-sky-500/40",
    // Subscriptions
    EXPIRED: "bg-zinc-500/15 text-zinc-200 border-zinc-500/40",
    PAUSED: "bg-amber-500/15 text-amber-200 border-amber-500/40",
    // Contact
    NEW: "bg-cyan-500/15 text-cyan-200 border-cyan-500/40",
    READ: "bg-white/10 text-white/80 border-white/20",
    REPLIED: "bg-emerald-500/15 text-emerald-200 border-emerald-500/40",
    CLOSED: "bg-zinc-500/15 text-zinc-200 border-zinc-500/40",
    // Chatbot
    OPEN: "bg-emerald-500/15 text-emerald-200 border-emerald-500/40",
    ESCALATED: "bg-amber-500/15 text-amber-200 border-amber-500/40",
    // User role
    ADMIN: "bg-[#600bd1]/20 text-[#c9a8ff] border-[#600bd1]/50",
    USER: "bg-white/10 text-white/80 border-white/20",
};

/** Table sombre responsive avec en-tête fixe et ligne zébrée au survol.
 *  Force une largeur minimale (scroll horizontal sur mobile) pour éviter les colonnes écrasées.
 *  Override via `minWidth="min-w-[1200px]"` si besoin d'une table large.
 */
export function Table({
    children,
    className,
    minWidth = "min-w-[900px]",
}: {
    children: ReactNode;
    className?: string;
    minWidth?: string;
}) {
    return (
        <div
            className={cn(
                "-mx-4 sm:mx-0 overflow-x-auto rounded-none sm:rounded-xl border-y sm:border border-white/10",
                className,
            )}
        >
            <table className={cn("w-full divide-y divide-white/10 text-sm", minWidth)}>{children}</table>
        </div>
    );
}
export function THead({ children }: { children: ReactNode }) {
    return (
        <thead className="bg-white/[0.05] text-left text-xs font-semibold uppercase tracking-wide text-white/60">
            {children}
        </thead>
    );
}
export function TBody({ children }: { children: ReactNode }) {
    return <tbody className="divide-y divide-white/5 bg-white/[0.01]">{children}</tbody>;
}
export function TR({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
    return (
        <tr
            onClick={onClick}
            className={cn(
                "transition-colors",
                onClick ? "cursor-pointer hover:bg-[#600bd1]/10" : "hover:bg-white/[0.03]",
            )}
        >
            {children}
        </tr>
    );
}
export function TH({ children, className }: { children: ReactNode; className?: string }) {
    return <th className={cn("px-4 py-3 whitespace-nowrap", className)}>{children}</th>;
}
export function TD({
    children,
    className,
    onClick,
}: {
    children: ReactNode;
    className?: string;
    onClick?: React.MouseEventHandler<HTMLTableCellElement>;
}) {
    return (
        <td onClick={onClick} className={cn("px-4 py-3 whitespace-nowrap text-white/90", className)}>
            {children}
        </td>
    );
}

/** Input/Select sombres cohérents. */
export const inputClass =
    "w-full rounded-lg border border-white/15 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#600bd1] focus:outline-none focus:ring-1 focus:ring-[#600bd1]";

/** Variante sans `w-full` pour les inputs inline en table (où on fixe la largeur via w-44, w-20, etc.). */
export const inlineInputClass =
    "rounded-lg border border-white/15 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#600bd1] focus:outline-none focus:ring-1 focus:ring-[#600bd1]";

/** Bouton toggle on/off cohérent avec le design system (utilisé pour TOP, Disponibilité, Actif…). */
export function ToggleButton({
    active,
    onClick,
    labelOn,
    labelOff,
    icon,
    title,
}: {
    active: boolean;
    onClick: () => void;
    labelOn: string;
    labelOff?: string;
    icon?: ReactNode;
    title?: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={title}
            className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition",
                active
                    ? "border-amber-500/40 bg-amber-500/15 text-amber-200 hover:bg-amber-500/25"
                    : "border-white/15 bg-white/[0.03] text-white/50 hover:border-white/30 hover:text-white/80",
            )}
        >
            {icon}
            <span>{active ? labelOn : (labelOff ?? labelOn)}</span>
        </button>
    );
}

export const labelClass = "mb-1 block text-xs font-semibold uppercase tracking-wide text-white/60";

/** Message d'erreur minimal. */
export function ErrorBanner({ message }: { message: string }) {
    if (!message) return null;
    return (
        <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {message}
        </div>
    );
}

/** Loader centré. */
export function Loader({ label = "Chargement..." }: { label?: string }) {
    return (
        <div className="flex items-center justify-center gap-3 py-12 text-white/60">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            {label}
        </div>
    );
}

/** Empty state. */
export function EmptyState({ title, hint }: { title: string; hint?: string }) {
    return (
        <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-10 text-center">
            <p className="text-base font-medium text-white/80">{title}</p>
            {hint && <p className="mt-1 text-sm text-white/50">{hint}</p>}
        </div>
    );
}

/** Format utile pour les montants EUR. */
export function formatEUR(v: string | number | null | undefined): string {
    if (v === null || v === undefined) return "—";
    const n = typeof v === "string" ? parseFloat(v) : v;
    if (Number.isNaN(n)) return "—";
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);
}

/** Format date court français. */
export function formatDate(v: string | null | undefined, withTime = false): string {
    if (!v) return "—";
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
    });
}
