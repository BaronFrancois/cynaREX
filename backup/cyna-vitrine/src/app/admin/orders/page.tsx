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
import { adminApi, type AdminOrder, type OrderStatus } from "@/lib/adminApi";
import { Search } from "lucide-react";

const STATUSES: OrderStatus[] = ["PENDING", "PAID", "ACTIVE", "CANCELLED", "REFUNDED"];

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<AdminOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState<OrderStatus | "ALL">("ALL");

    useEffect(() => {
        refresh();
    }, []);

    async function refresh() {
        setLoading(true);
        try {
            const list = await adminApi.orders.list();
            setOrders(list);
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setLoading(false);
        }
    }

    const filtered = useMemo(() => {
        let rows = orders;
        if (filterStatus !== "ALL") rows = rows.filter((o) => o.status === filterStatus);
        const q = search.trim().toLowerCase();
        if (q) {
            rows = rows.filter(
                (o) =>
                    o.orderNumber.toLowerCase().includes(q) ||
                    o.user?.email.toLowerCase().includes(q) ||
                    `${o.user?.firstName} ${o.user?.lastName}`.toLowerCase().includes(q),
            );
        }
        return [...rows].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [orders, search, filterStatus]);

    async function handleChangeStatus(id: number, status: OrderStatus) {
        try {
            await adminApi.orders.updateStatus(id, status);
            await refresh();
        } catch (e) {
            setError((e as Error).message);
        }
    }

    if (loading) return <Loader />;

    return (
        <div className="space-y-6">
            <header className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-white">Commandes</h1>
                    <p className="text-sm text-white/60">{filtered.length} sur {orders.length}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <select
                        className={inputClass + " w-40"}
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as OrderStatus | "ALL")}
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
                            placeholder="N°, email, nom…"
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
                            <TH>N° commande</TH>
                            <TH>Client</TH>
                            <TH>Date</TH>
                            <TH>Produits</TH>
                            <TH>Montant</TH>
                            <TH>Paiement</TH>
                            <TH>Statut</TH>
                            <TH>Changer statut</TH>
                        </TR>
                    </THead>
                    <TBody>
                        {filtered.map((o) => (
                            <TR key={o.id}>
                                <TD className="font-mono text-xs">{o.orderNumber}</TD>
                                <TD>
                                    {o.user ? (
                                        <Link
                                            href={`/admin/users/${o.user.id}`}
                                            className="text-white hover:text-[#c9a8ff]"
                                        >
                                            {o.user.firstName} {o.user.lastName}
                                            <br />
                                            <span className="text-xs text-white/50">{o.user.email}</span>
                                        </Link>
                                    ) : (
                                        <span className="text-white/50">—</span>
                                    )}
                                </TD>
                                <TD>{formatDate(o.createdAt, true)}</TD>
                                <TD className="text-white/70">{o.items?.length ?? 0}</TD>
                                <TD className="font-semibold">{formatEUR(o.totalAmount)}</TD>
                                <TD className="text-white/70 capitalize">{o.paymentProvider ?? "—"}</TD>
                                <TD>
                                    <StatusBadge status={o.status} />
                                </TD>
                                <TD>
                                    <select
                                        className={`${inputClass} w-36 py-1`}
                                        value={o.status}
                                        onChange={(e) => handleChangeStatus(o.id, e.target.value as OrderStatus)}
                                    >
                                        {STATUSES.map((s) => (
                                            <option key={s} value={s}>
                                                {s}
                                            </option>
                                        ))}
                                    </select>
                                </TD>
                            </TR>
                        ))}
                    </TBody>
                </Table>
                {filtered.length === 0 && <p className="py-8 text-center text-white/50">Aucune commande.</p>}
            </Card>
        </div>
    );
}
