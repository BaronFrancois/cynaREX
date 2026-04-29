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
import { adminApi, type AdminChatbotSession, type ChatbotSessionStatus } from "@/lib/adminApi";
import { Bot, Search, User } from "lucide-react";

const STATUSES: ChatbotSessionStatus[] = ["OPEN", "ESCALATED", "CLOSED"];

export default function AdminChatbotPage() {
    const [sessions, setSessions] = useState<AdminChatbotSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState<ChatbotSessionStatus | "ALL">("ALL");
    const [selected, setSelected] = useState<AdminChatbotSession | null>(null);

    useEffect(() => {
        refresh();
    }, []);

    async function refresh() {
        setLoading(true);
        try {
            const list = await adminApi.chatbot.list();
            setSessions(list);
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setLoading(false);
        }
    }

    const filtered = useMemo(() => {
        let rows = sessions;
        if (filterStatus !== "ALL") rows = rows.filter((s) => s.status === filterStatus);
        const q = search.trim().toLowerCase();
        if (q) {
            rows = rows.filter(
                (s) =>
                    s.user?.email.toLowerCase().includes(q) ||
                    `${s.user?.firstName} ${s.user?.lastName}`.toLowerCase().includes(q),
            );
        }
        return [...rows].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    }, [sessions, search, filterStatus]);

    async function handleChangeStatus(id: number, status: ChatbotSessionStatus) {
        try {
            await adminApi.chatbot.updateStatus(id, status);
            await refresh();
            if (selected?.id === id) setSelected({ ...selected, status });
        } catch (e) {
            setError((e as Error).message);
        }
    }

    if (loading) return <Loader />;

    return (
        <div className="space-y-6">
            <header className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-white">Sessions chatbot</h1>
                    <p className="text-sm text-white/60">
                        {filtered.length} sur {sessions.length} · {sessions.filter((s) => s.status === "ESCALATED").length} escaladées
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <select
                        className={inputClass + " w-40"}
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as ChatbotSessionStatus | "ALL")}
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
                <Card title="Sessions" className="lg:max-h-[75vh] lg:overflow-y-auto">
                    <Table>
                        <THead>
                            <TR>
                                <TH>#</TH>
                                <TH>Utilisateur</TH>
                                <TH>Mise à jour</TH>
                                <TH>Messages</TH>
                                <TH>Statut</TH>
                            </TR>
                        </THead>
                        <TBody>
                            {filtered.map((s) => (
                                <TR key={s.id} onClick={() => setSelected(s)}>
                                    <TD>#{s.id}</TD>
                                    <TD>
                                        {s.user ? (
                                            <>
                                                <p className="text-white">
                                                    {s.user.firstName} {s.user.lastName}
                                                </p>
                                                <p className="text-xs text-white/50">{s.user.email}</p>
                                            </>
                                        ) : (
                                            <span className="text-white/50">Invité</span>
                                        )}
                                    </TD>
                                    <TD className="text-xs text-white/60">{formatDate(s.updatedAt, true)}</TD>
                                    <TD className="text-white/70">{s.messages?.length ?? 0}</TD>
                                    <TD>
                                        <StatusBadge status={s.status} />
                                    </TD>
                                </TR>
                            ))}
                        </TBody>
                    </Table>
                    {filtered.length === 0 && <p className="py-8 text-center text-white/50">Aucune session.</p>}
                </Card>

                <Card
                    title={selected ? `Session #${selected.id}` : "Sélectionnez une session"}
                    actions={
                        selected ? (
                            <select
                                className={inputClass + " w-36"}
                                value={selected.status}
                                onChange={(e) => handleChangeStatus(selected.id, e.target.value as ChatbotSessionStatus)}
                            >
                                {STATUSES.map((s) => (
                                    <option key={s} value={s}>
                                        {s}
                                    </option>
                                ))}
                            </select>
                        ) : null
                    }
                >
                    {!selected ? (
                        <div className="py-20 text-center text-white/40">
                            <Bot className="mx-auto h-10 w-10 opacity-50" />
                            <p className="mt-3 text-sm">Cliquez sur une session pour voir l&apos;historique.</p>
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                            {(selected.messages ?? []).map((m) => {
                                const isBot = m.sender === "BOT";
                                const isAgent = m.sender === "AGENT";
                                return (
                                    <div
                                        key={m.id}
                                        className={`flex items-start gap-2 ${isBot || isAgent ? "" : "flex-row-reverse"}`}
                                    >
                                        <span
                                            className={`mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full ${
                                                isBot
                                                    ? "bg-[#600bd1]/30 text-[#c9a8ff]"
                                                    : isAgent
                                                      ? "bg-emerald-500/20 text-emerald-200"
                                                      : "bg-white/10 text-white/70"
                                            }`}
                                        >
                                            {isBot || isAgent ? <Bot className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-white/50">
                                                {m.sender} · {formatDate(m.sentAt, true)}
                                            </p>
                                            <div
                                                className={`mt-1 whitespace-pre-wrap rounded-lg px-3 py-2 text-sm ${
                                                    isBot || isAgent
                                                        ? "bg-[#600bd1]/10 text-white/90 border border-[#600bd1]/30"
                                                        : "bg-white/[0.04] text-white/90 border border-white/10"
                                                }`}
                                            >
                                                {m.content}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            {(!selected.messages || selected.messages.length === 0) && (
                                <p className="py-8 text-center text-white/50">Aucun message dans cette session.</p>
                            )}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
