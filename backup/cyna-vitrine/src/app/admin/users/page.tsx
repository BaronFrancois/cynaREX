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
    inputClass,
} from "@/components/admin/AdminUI";
import { adminApi, type AdminUser } from "@/lib/adminApi";
import { Search } from "lucide-react";

type SortKey = "id" | "name" | "email" | "role" | "createdAt" | "lastLoginAt";
type SortDir = "asc" | "desc";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [sortKey, setSortKey] = useState<SortKey>("createdAt");
    const [sortDir, setSortDir] = useState<SortDir>("desc");

    useEffect(() => {
        (async () => {
            try {
                const u = await adminApi.users.list();
                setUsers(u);
            } catch (e) {
                setError((e as Error).message);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        let rows = users;
        if (q) {
            rows = rows.filter(
                (u) =>
                    u.email.toLowerCase().includes(q) ||
                    u.firstName.toLowerCase().includes(q) ||
                    u.lastName.toLowerCase().includes(q),
            );
        }
        return [...rows].sort((a, b) => cmp(a, b, sortKey) * (sortDir === "asc" ? 1 : -1));
    }, [users, search, sortKey, sortDir]);

    function toggleSort(k: SortKey) {
        if (sortKey === k) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        else {
            setSortKey(k);
            setSortDir("asc");
        }
    }

    if (loading) return <Loader />;
    if (error) return <ErrorBanner message={error} />;

    return (
        <div className="space-y-6">
            <header className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-white">Utilisateurs</h1>
                    <p className="text-sm text-white/60">{filtered.length} compte(s)</p>
                </div>
                <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Rechercher par nom ou email"
                        className={`${inputClass} pl-9 w-full sm:w-80`}
                    />
                </div>
            </header>

            <Card>
                <Table>
                    <THead>
                        <TR>
                            <SortableTh label="#" active={sortKey === "id"} dir={sortDir} onClick={() => toggleSort("id")} />
                            <SortableTh label="Nom" active={sortKey === "name"} dir={sortDir} onClick={() => toggleSort("name")} />
                            <SortableTh label="Email" active={sortKey === "email"} dir={sortDir} onClick={() => toggleSort("email")} />
                            <SortableTh label="Rôle" active={sortKey === "role"} dir={sortDir} onClick={() => toggleSort("role")} />
                            <TH>Vérifié</TH>
                            <SortableTh label="Créé le" active={sortKey === "createdAt"} dir={sortDir} onClick={() => toggleSort("createdAt")} />
                            <SortableTh
                                label="Dernière connexion"
                                active={sortKey === "lastLoginAt"}
                                dir={sortDir}
                                onClick={() => toggleSort("lastLoginAt")}
                            />
                        </TR>
                    </THead>
                    <TBody>
                        {filtered.map((u) => (
                            <TR key={u.id}>
                                <TD>
                                    <Link href={`/admin/users/${u.id}`} className="text-white/70 hover:text-[#c9a8ff]">
                                        #{u.id}
                                    </Link>
                                </TD>
                                <TD>
                                    <Link
                                        href={`/admin/users/${u.id}`}
                                        className="font-medium text-white hover:text-[#c9a8ff]"
                                    >
                                        {u.firstName} {u.lastName}
                                    </Link>
                                </TD>
                                <TD className="text-white/80">{u.email}</TD>
                                <TD>
                                    <StatusBadge status={u.role} />
                                </TD>
                                <TD>
                                    {u.emailVerified ? (
                                        <span className="text-emerald-300">Oui</span>
                                    ) : (
                                        <span className="text-amber-300">Non</span>
                                    )}
                                </TD>
                                <TD className="text-white/70">{formatDate(u.createdAt)}</TD>
                                <TD className="text-white/70">{formatDate(u.lastLoginAt ?? null, true)}</TD>
                            </TR>
                        ))}
                    </TBody>
                </Table>
                {filtered.length === 0 && <p className="py-8 text-center text-white/50">Aucun utilisateur.</p>}
            </Card>
        </div>
    );
}

function SortableTh({
    label,
    active,
    dir,
    onClick,
}: {
    label: string;
    active: boolean;
    dir: SortDir;
    onClick: () => void;
}) {
    return (
        <TH>
            <button
                type="button"
                onClick={onClick}
                className="flex items-center gap-1 hover:text-white transition"
            >
                {label}
                {active && <span>{dir === "asc" ? "↑" : "↓"}</span>}
            </button>
        </TH>
    );
}

function cmp(a: AdminUser, b: AdminUser, k: SortKey): number {
    switch (k) {
        case "id":
            return a.id - b.id;
        case "name":
            return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        case "email":
            return a.email.localeCompare(b.email);
        case "role":
            return a.role.localeCompare(b.role);
        case "createdAt":
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "lastLoginAt":
            return new Date(a.lastLoginAt ?? 0).getTime() - new Date(b.lastLoginAt ?? 0).getTime();
    }
}
