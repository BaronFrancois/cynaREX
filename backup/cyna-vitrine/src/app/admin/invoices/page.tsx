"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
    Card,
    ErrorBanner,
    Loader,
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
import { adminApi, type AdminInvoice } from "@/lib/adminApi";
import { Search } from "lucide-react";

export default function AdminInvoicesPage() {
    const [invoices, setInvoices] = useState<AdminInvoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    useEffect(() => {
        (async () => {
            try {
                const list = await adminApi.invoices.list();
                setInvoices(list);
            } catch (e) {
                setError((e as Error).message);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        let rows = invoices;
        if (q) {
            rows = rows.filter(
                (i) =>
                    i.invoiceNumber.toLowerCase().includes(q) ||
                    i.user?.email.toLowerCase().includes(q) ||
                    i.order?.orderNumber.toLowerCase().includes(q),
            );
        }
        return [...rows].sort((a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime());
    }, [invoices, search]);

    const total = useMemo(() => filtered.reduce((acc, i) => acc + Number(i.amount ?? 0), 0), [filtered]);

    if (loading) return <Loader />;

    return (
        <div className="space-y-6">
            <header className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-white">Factures</h1>
                    <p className="text-sm text-white/60">
                        {filtered.length} · total <span className="font-semibold text-white">{formatEUR(total)}</span>
                    </p>
                </div>
                <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="N°, email, commande…"
                        className={`${inputClass} pl-9 w-full sm:w-80`}
                    />
                </div>
            </header>

            {error && <ErrorBanner message={error} />}

            <Card>
                <Table>
                    <THead>
                        <TR>
                            <TH>N° facture</TH>
                            <TH>Client</TH>
                            <TH>Commande</TH>
                            <TH>Date</TH>
                            <TH>Montant</TH>
                            <TH>PDF</TH>
                        </TR>
                    </THead>
                    <TBody>
                        {filtered.map((inv) => (
                            <TR key={inv.id}>
                                <TD className="font-mono text-xs">{inv.invoiceNumber}</TD>
                                <TD>
                                    {inv.user ? (
                                        <Link
                                            href={`/admin/users/${inv.user.id}`}
                                            className="text-white hover:text-[#c9a8ff]"
                                        >
                                            {inv.user.firstName} {inv.user.lastName}
                                            <br />
                                            <span className="text-xs text-white/50">{inv.user.email}</span>
                                        </Link>
                                    ) : (
                                        <span className="text-white/50">—</span>
                                    )}
                                </TD>
                                <TD className="font-mono text-xs text-white/70">
                                    {inv.order?.orderNumber ?? `#${inv.orderId}`}
                                </TD>
                                <TD>{formatDate(inv.issuedAt)}</TD>
                                <TD className="font-semibold">{formatEUR(inv.amount)}</TD>
                                <TD>
                                    {inv.pdfUrl ? (
                                        <a
                                            href={inv.pdfUrl}
                                            target="_blank"
                                            className="text-[#c9a8ff] hover:underline"
                                        >
                                            Télécharger
                                        </a>
                                    ) : (
                                        <span className="text-white/40">Non généré</span>
                                    )}
                                </TD>
                            </TR>
                        ))}
                    </TBody>
                </Table>
                {filtered.length === 0 && <p className="py-8 text-center text-white/50">Aucune facture.</p>}
            </Card>
        </div>
    );
}
