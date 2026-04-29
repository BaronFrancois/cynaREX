"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { Card, ErrorBanner, Loader, StatCard, formatEUR } from "@/components/admin/AdminUI";
import { adminApi, type AdminOrder, type AdminSubscription, type AdminUser } from "@/lib/adminApi";
import { format, startOfDay, subDays, subWeeks, startOfWeek, isAfter } from "date-fns";
import { fr } from "date-fns/locale";

type Period = "7d" | "5w";

export default function AdminDashboardPage() {
    const [period, setPeriod] = useState<Period>("7d");
    const [orders, setOrders] = useState<AdminOrder[]>([]);
    const [subs, setSubs] = useState<AdminSubscription[]>([]);
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        (async () => {
            try {
                const [o, s, u] = await Promise.all([
                    adminApi.orders.list(),
                    adminApi.subscriptions.list(),
                    adminApi.users.list(),
                ]);
                setOrders(o);
                setSubs(s);
                setUsers(u);
            } catch (e) {
                setError((e as Error).message || "Erreur de chargement");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // ─── KPIs ────────────────────────────────────────────────────
    const paidOrders = useMemo(() => orders.filter((o) => o.status === "PAID" || o.status === "ACTIVE"), [orders]);
    const totalRevenue = useMemo(
        () => paidOrders.reduce((acc, o) => acc + Number(o.totalAmount ?? 0), 0),
        [paidOrders],
    );
    const activeSubs = useMemo(() => subs.filter((s) => s.status === "ACTIVE").length, [subs]);
    const totalUsers = users.length;

    // ─── Séries temporelles ──────────────────────────────────────
    const salesData = useMemo(() => buildSalesSeries(paidOrders, period), [paidOrders, period]);
    const stackedData = useMemo(() => buildStackedByCategory(paidOrders, period), [paidOrders, period]);
    const pieData = useMemo(() => buildPieByCategory(paidOrders, period), [paidOrders, period]);

    if (loading) return <Loader label="Chargement du tableau de bord…" />;
    if (error) return <ErrorBanner message={error} />;

    return (
        <div className="space-y-6">
            <header className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-white">Tableau de bord</h1>
                    <p className="text-sm text-white/60">Vue d&apos;ensemble des ventes SaaS</p>
                </div>
                <PeriodSwitcher value={period} onChange={setPeriod} />
            </header>

            {/* KPIs */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                <StatCard label="Revenus cumulés" value={formatEUR(totalRevenue)} hint="Commandes payées" accent="violet" />
                <StatCard label="Commandes payées" value={paidOrders.length} hint={`${orders.length} au total`} accent="green" />
                <StatCard label="Abonnements actifs" value={activeSubs} hint={`${subs.length} au total`} accent="amber" />
                <StatCard label="Utilisateurs" value={totalUsers} hint="Comptes enregistrés" accent="rose" />
            </div>

            {/* Graphique 1 : histogramme ventes par jour/semaine */}
            <Card title={period === "7d" ? "Ventes des 7 derniers jours" : "Ventes des 5 dernières semaines"}>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={salesData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                            <XAxis dataKey="label" stroke="#ffffff80" fontSize={12} />
                            <YAxis stroke="#ffffff80" fontSize={12} tickFormatter={(v) => `${v} €`} />
                            <Tooltip content={<DarkTooltip unit="€" />} />
                            <Bar dataKey="total" name="Total" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            {/* Graphique 2 : multi-couches par catégorie */}
            <Card title="Panier moyen par catégorie">
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stackedData.data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                            <XAxis dataKey="label" stroke="#ffffff80" fontSize={12} />
                            <YAxis stroke="#ffffff80" fontSize={12} tickFormatter={(v) => `${v} €`} />
                            <Tooltip content={<DarkTooltip unit="€" />} />
                            <Legend wrapperStyle={{ fontSize: 12, color: "#ffffffb0" }} />
                            {stackedData.categories.map((cat, i) => (
                                <Bar
                                    key={cat}
                                    dataKey={cat}
                                    stackId="a"
                                    fill={PALETTE[i % PALETTE.length]}
                                    radius={i === stackedData.categories.length - 1 ? [6, 6, 0, 0] : undefined}
                                />
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                {stackedData.data.length === 0 && (
                    <p className="text-center text-sm text-white/50 py-4">Aucune vente sur la période sélectionnée.</p>
                )}
            </Card>

            {/* Graphique 3 : camembert ventes par catégorie */}
            <Card title="Répartition des ventes par catégorie">
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={110}
                                innerRadius={60}
                                paddingAngle={2}
                                label={(entry) => `${entry.name} (${entry.value.toFixed(0)} €)`}
                            >
                                {pieData.map((_, i) => (
                                    <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<DarkTooltip unit="€" />} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                {pieData.length === 0 && (
                    <p className="text-center text-sm text-white/50 py-4">Aucune vente sur la période sélectionnée.</p>
                )}
            </Card>
        </div>
    );
}

const PALETTE = ["#8b5cf6", "#ec4899", "#06b6d4", "#22c55e", "#f59e0b", "#ef4444", "#3b82f6", "#a855f7"];

function PeriodSwitcher({ value, onChange }: { value: Period; onChange: (v: Period) => void }) {
    return (
        <div className="inline-flex rounded-lg border border-white/15 bg-white/[0.03] p-1 text-xs">
            {(["7d", "5w"] as const).map((p) => (
                <button
                    key={p}
                    onClick={() => onChange(p)}
                    className={
                        value === p
                            ? "rounded-md bg-[#600bd1] px-3 py-1.5 font-semibold text-white"
                            : "rounded-md px-3 py-1.5 text-white/60 hover:text-white"
                    }
                >
                    {p === "7d" ? "7 jours" : "5 semaines"}
                </button>
            ))}
        </div>
    );
}

type TooltipPayload = {
    dataKey?: string | number;
    name?: string;
    value?: number | string;
    color?: string;
};

function DarkTooltip({
    active,
    payload,
    label,
    unit,
}: {
    active?: boolean;
    payload?: TooltipPayload[];
    label?: string | number;
    unit: string;
}) {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-lg border border-white/15 bg-[#15012b]/95 px-3 py-2 text-xs shadow-xl backdrop-blur">
            <p className="font-semibold text-white">{label}</p>
            {payload.map((p, idx) => (
                <p key={`${p.dataKey ?? idx}`} className="text-white/80">
                    <span className="inline-block h-2 w-2 rounded-full mr-1.5" style={{ backgroundColor: p.color }} />
                    {p.name}:{" "}
                    <span className="font-semibold text-white">
                        {Number(p.value ?? 0).toFixed(2)} {unit}
                    </span>
                </p>
            ))}
        </div>
    );
}

// ─── Helpers de série ───────────────────────────────────────────

function buildSalesSeries(orders: AdminOrder[], period: Period) {
    const now = new Date();
    if (period === "7d") {
        const buckets = Array.from({ length: 7 }, (_, i) => {
            const d = startOfDay(subDays(now, 6 - i));
            return { label: format(d, "EEE dd", { locale: fr }), date: d, total: 0 };
        });
        for (const o of orders) {
            const at = new Date(o.paidAt ?? o.createdAt);
            const bucket = buckets.find((b) => sameDay(b.date, at));
            if (bucket) bucket.total += Number(o.totalAmount ?? 0);
        }
        return buckets.map(({ label, total }) => ({ label, total }));
    }
    const buckets = Array.from({ length: 5 }, (_, i) => {
        const d = startOfWeek(subWeeks(now, 4 - i), { locale: fr, weekStartsOn: 1 });
        return { label: `S${format(d, "ww", { locale: fr })}`, date: d, total: 0 };
    });
    for (const o of orders) {
        const at = new Date(o.paidAt ?? o.createdAt);
        const bucket = findWeekBucket(buckets, at);
        if (bucket) bucket.total += Number(o.totalAmount ?? 0);
    }
    return buckets.map(({ label, total }) => ({ label, total }));
}

function buildStackedByCategory(orders: AdminOrder[], period: Period) {
    const now = new Date();
    const buckets =
        period === "7d"
            ? Array.from({ length: 7 }, (_, i) => {
                  const d = startOfDay(subDays(now, 6 - i));
                  return { label: format(d, "EEE dd", { locale: fr }), date: d, byCat: new Map<string, number>() };
              })
            : Array.from({ length: 5 }, (_, i) => {
                  const d = startOfWeek(subWeeks(now, 4 - i), { locale: fr, weekStartsOn: 1 });
                  return { label: `S${format(d, "ww", { locale: fr })}`, date: d, byCat: new Map<string, number>() };
              });

    const categories = new Set<string>();

    for (const o of orders) {
        const at = new Date(o.paidAt ?? o.createdAt);
        const bucket = period === "7d" ? buckets.find((b) => sameDay(b.date, at)) : findWeekBucket(buckets, at);
        if (!bucket) continue;
        for (const item of o.items ?? []) {
            const cat = deriveCategoryFromName(item.productName);
            categories.add(cat);
            bucket.byCat.set(cat, (bucket.byCat.get(cat) ?? 0) + Number(item.totalPrice ?? 0));
        }
    }

    const cats = Array.from(categories);
    const data = buckets.map((b) => {
        const row: Record<string, string | number> = { label: b.label };
        cats.forEach((c) => (row[c] = Number((b.byCat.get(c) ?? 0).toFixed(2))));
        return row;
    });

    return { data, categories: cats };
}

function buildPieByCategory(orders: AdminOrder[], period: Period) {
    const now = new Date();
    const cutoff = period === "7d" ? subDays(now, 7) : subWeeks(now, 5);
    const totals = new Map<string, number>();
    for (const o of orders) {
        const at = new Date(o.paidAt ?? o.createdAt);
        if (!isAfter(at, cutoff)) continue;
        for (const item of o.items ?? []) {
            const cat = deriveCategoryFromName(item.productName);
            totals.set(cat, (totals.get(cat) ?? 0) + Number(item.totalPrice ?? 0));
        }
    }
    return Array.from(totals.entries()).map(([name, value]) => ({ name, value: Number(value.toFixed(2)) }));
}

function sameDay(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function findWeekBucket<T extends { date: Date }>(buckets: T[], at: Date): T | undefined {
    for (let i = buckets.length - 1; i >= 0; i--) {
        if (at >= buckets[i].date) return buckets[i];
    }
    return undefined;
}

/** À défaut d'avoir la catégorie en snapshot, on dérive du nom produit (EDR, XDR, SOC…). */
function deriveCategoryFromName(name: string): string {
    const up = name.toUpperCase();
    if (up.includes("XDR")) return "XDR";
    if (up.includes("EDR")) return "EDR";
    if (up.includes("SOC")) return "SOC";
    return "Autres";
}
