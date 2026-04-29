"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
    Card,
    ErrorBanner,
    Loader,
    StatusBadge,
    TBody,
    TD,
    TH,
    THead,
    TR,
    Table,
    formatDate,
    formatEUR,
    inputClass,
} from "@/components/admin/AdminUI";
import { adminApi, type AdminSubscription, type SubscriptionStatus } from "@/lib/adminApi";
import { Search } from "lucide-react";

const STATUSES: SubscriptionStatus[] = ["ACTIVE", "CANCELLED", "EXPIRED", "PAUSED"];

export default function AdminSubscriptionsPage() {
    const [subs, setSubs] = useState<AdminSubscription[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState<SubscriptionStatus | "ALL">("ALL");

    useEffect(() => {
        (async () => {
            try {
                const list = await adminApi.subscriptions.list();
                setSubs(list);
            } catch (e) {
                setError((e as Error).message);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const filtered = useMemo(() => {
        let rows = subs;
        if (filterStatus !== "ALL") rows = rows.filter((s) => s.status === filterStatus);
        const q = search.trim().toLowerCase();
        if (q) {
            rows = rows.filter(
                (s) =>
                    s.user?.email.toLowerCase().includes(q) ||
                    `${s.user?.firstName} ${s.user?.lastName}`.toLowerCase().includes(q) ||
                    s.product?.name.toLowerCase().includes(q),
            );
        }
        return [...rows].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [subs, search, filterStatus]);

    if (loading) return <Loader />;

    return (
        <div className="space-y-6">
            <header className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-white">Abonnements</h1>
                    <p className="text-sm text-white/60">
                        {filtered.length} sur {subs.length} · {subs.filter((s) => s.status === "ACTIVE").length} actifs
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <select
                        className={inputClass + " w-40"}
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as SubscriptionStatus | "ALL")}
                    >
                        <option value="ALL">Tous les statuts</option>
                        {STATUSES.map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Client, produit…"
                            className={`${inputClass} pl-9 w-full sm:w-72`}
                        />
                    </div>
                </div>
            </header>

            {error && <ErrorBanner message={error} />}

            <Card>
                <Table>
                    <THead>
                        <TR>
                            <TH>#</TH>
                            <TH>Client</TH>
                            <TH>Produit</TH>
                            <TH>Plan</TH>
                            <TH>Statut</TH>
                            <TH>Début</TH>
                            <TH>Fin</TH>
                            <TH>Renouvellement</TH>
                            <TH>Prix</TH>
                        </TR>
                    </THead>
                    <TBody>
                        {filtered.map((s) => (
                            <TR key={s.id}>
                                <TD>#{s.id}</TD>
                                <TD>
                                    {s.user ? (
                                        <Link
                                            href={`/admin/users/${s.user.id}`}
                                            className="text-white hover:text-[#c9a8ff]"
                                        >
                                            {s.user.firstName} {s.user.lastName}
                                            <br />
                                            <span className="text-xs text-white/50">{s.user.email}</span>
                                        </Link>
                                    ) : (
                                        <span className="text-white/50">—</span>
                                    )}
                                </TD>
                                <TD className="font-medium">{s.product?.name ?? `#${s.productId}`}</TD>
                                <TD className="text-white/80">{s.subscriptionPlan?.label ?? "—"}</TD>
                                <TD>
                                    <StatusBadge status={s.status} />
                                </TD>
                                <TD>{formatDate(s.startDate)}</TD>
                                <TD>{formatDate(s.endDate)}</TD>
                                <TD>
                                    {s.autoRenew ? (
                                        <span className="text-emerald-300">Auto · {formatDate(s.nextRenewalDate ?? null)}</span>
                                    ) : (
                                        <span className="text-white/50">Manuel</span>
                                    )}
                                </TD>
                                <TD className="font-semibold">{formatEUR(s.subscriptionPlan?.price ?? 0)}</TD>
                            </TR>
                        ))}
                    </TBody>
                </Table>
                {filtered.length === 0 && <p className="py-8 text-center text-white/50">Aucun abonnement.</p>}
            </Card>
        </div>
    );
}
