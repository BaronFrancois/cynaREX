"use client";

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
    inputClass,
} from "@/components/admin/AdminUI";
import { adminApi, type AdminContactMessage, type ContactStatus } from "@/lib/adminApi";
import { Mail, Search, Trash2 } from "lucide-react";

const STATUSES: ContactStatus[] = ["NEW", "READ", "REPLIED", "CLOSED"];

export default function AdminContactPage() {
    const [items, setItems] = useState<AdminContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState<ContactStatus | "ALL">("ALL");
    const [selected, setSelected] = useState<AdminContactMessage | null>(null);

    useEffect(() => {
        refresh();
    }, []);

    async function refresh() {
        setLoading(true);
        try {
            const list = await adminApi.contact.list();
            setItems(list);
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setLoading(false);
        }
    }

    const filtered = useMemo(() => {
        let rows = items;
        if (filterStatus !== "ALL") rows = rows.filter((m) => m.status === filterStatus);
        const q = search.trim().toLowerCase();
        if (q) {
            rows = rows.filter(
                (m) =>
                    m.email.toLowerCase().includes(q) ||
                    m.subject.toLowerCase().includes(q) ||
                    m.message.toLowerCase().includes(q),
            );
        }
        return [...rows].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [items, search, filterStatus]);

    async function handleChangeStatus(id: number, status: ContactStatus) {
        try {
            await adminApi.contact.updateStatus(id, status);
            await refresh();
            if (selected?.id === id) setSelected({ ...selected, status });
        } catch (e) {
            setError((e as Error).message);
        }
    }

    async function handleDelete(id: number) {
        if (!confirm("Supprimer ce message ?")) return;
        try {
            await adminApi.contact.remove(id);
            if (selected?.id === id) setSelected(null);
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
                    <h1 className="text-2xl font-bold text-white">Messages de support</h1>
                    <p className="text-sm text-white/60">
                        {filtered.length} sur {items.length} · {items.filter((i) => i.status === "NEW").length} nouveaux
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <select
                        className={inputClass + " w-40"}
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as ContactStatus | "ALL")}
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
                            placeholder="Rechercher…"
                            className={`${inputClass} pl-9 w-full sm:w-72`}
                        />
                    </div>
                </div>
            </header>

            {error && <ErrorBanner message={error} />}

            <div className="grid gap-4 lg:grid-cols-2">
                <Card title="Messages" className="lg:max-h-[75vh] lg:overflow-y-auto">
                    <Table>
                        <THead>
                            <TR>
                                <TH>Date</TH>
                                <TH>Email / Sujet</TH>
                                <TH>Statut</TH>
                                <TH>Source</TH>
                            </TR>
                        </THead>
                        <TBody>
                            {filtered.map((m) => (
                                <TR key={m.id} onClick={() => setSelected(m)}>
                                    <TD className="text-white/70 text-xs">{formatDate(m.createdAt, true)}</TD>
                                    <TD>
                                        <p className="font-medium">{m.subject}</p>
                                        <p className="text-xs text-white/50">{m.email}</p>
                                    </TD>
                                    <TD>
                                        <StatusBadge status={m.status} />
                                    </TD>
                                    <TD className="text-xs text-white/60">{m.source}</TD>
                                </TR>
                            ))}
                        </TBody>
                    </Table>
                    {filtered.length === 0 && <p className="py-8 text-center text-white/50">Aucun message.</p>}
                </Card>

                <Card title={selected ? `Message #${selected.id}` : "Sélectionnez un message"}>
                    {!selected ? (
                        <div className="py-20 text-center text-white/40">
                            <Mail className="mx-auto h-10 w-10 opacity-50" />
                            <p className="mt-3 text-sm">Cliquez sur un message à gauche pour le consulter.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-white/50">De</p>
                                    <p className="text-white">{selected.email}</p>
                                    {selected.user && (
                                        <p className="text-xs text-white/50">
                                            (utilisateur {selected.user.firstName} {selected.user.lastName})
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-white/50">Reçu le</p>
                                    <p className="text-white">{formatDate(selected.createdAt, true)}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-xs uppercase tracking-wide text-white/50">Sujet</p>
                                    <p className="text-white font-medium">{selected.subject}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wide text-white/50 mb-1">Message</p>
                                <div className="whitespace-pre-wrap rounded-lg border border-white/10 bg-white/[0.02] p-4 text-sm text-white/90">
                                    {selected.message}
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <label className="text-xs uppercase tracking-wide text-white/50">Statut</label>
                                <select
                                    className={inputClass + " w-40"}
                                    value={selected.status}
                                    onChange={(e) => handleChangeStatus(selected.id, e.target.value as ContactStatus)}
                                >
                                    {STATUSES.map((s) => (
                                        <option key={s} value={s}>
                                            {s}
                                        </option>
                                    ))}
                                </select>
                                <a
                                    href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                                    className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white hover:bg-white/10"
                                >
                                    Répondre par mail
                                </a>
                                <button
                                    onClick={() => handleDelete(selected.id)}
                                    className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm font-medium text-rose-200 hover:bg-rose-500/20"
                                >
                                    <Trash2 className="h-4 w-4" /> Supprimer
                                </button>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
