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
    formatEUR,
    inputClass,
} from "@/components/admin/AdminUI";
import { adminApi, type AdminProduct } from "@/lib/adminApi";
import { Check, Plus, Search, Star, Trash2, X as XIcon } from "lucide-react";

type SortKey = "id" | "name" | "price" | "category" | "priority" | "availability";

export default function AdminProductsPage() {
    const [products, setProducts] = useState<AdminProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [sortKey, setSortKey] = useState<SortKey>("priority");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
    const [selected, setSelected] = useState<Set<number>>(new Set());

    useEffect(() => {
        refresh();
    }, []);

    async function refresh() {
        setLoading(true);
        try {
            const list = await adminApi.products.list();
            setProducts(list);
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setLoading(false);
        }
    }

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        let rows = products;
        if (q) rows = rows.filter((p) => p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q));
        return [...rows].sort((a, b) => cmp(a, b, sortKey) * (sortDir === "asc" ? 1 : -1));
    }, [products, search, sortKey, sortDir]);

    function toggleSort(k: SortKey) {
        if (sortKey === k) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        else {
            setSortKey(k);
            setSortDir("asc");
        }
    }

    function toggleOne(id: number) {
        const next = new Set(selected);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelected(next);
    }

    function toggleAll() {
        if (selected.size === filtered.length) setSelected(new Set());
        else setSelected(new Set(filtered.map((p) => p.id)));
    }

    async function handleDeleteSelection() {
        if (selected.size === 0) return;
        if (!confirm(`Supprimer ${selected.size} produit(s) ? Irréversible.`)) return;
        try {
            await Promise.all(Array.from(selected).map((id) => adminApi.products.remove(id)));
            setSelected(new Set());
            await refresh();
        } catch (e) {
            setError((e as Error).message);
        }
    }

    async function handleToggle(p: AdminProduct, field: "isFeatured" | "isAvailable") {
        const next = !p[field];
        setProducts((list) => list.map((x) => (x.id === p.id ? { ...x, [field]: next } : x)));
        try {
            await adminApi.products.update(p.id, { [field]: next });
        } catch (e) {
            setError((e as Error).message);
            setProducts((list) => list.map((x) => (x.id === p.id ? { ...x, [field]: !next } : x)));
        }
    }

    if (loading) return <Loader />;

    return (
        <div className="space-y-6">
            <header className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-white">Produits</h1>
                    <p className="text-sm text-white/60">{filtered.length} produit(s)</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Rechercher un produit"
                            className={`${inputClass} pl-9 w-full sm:w-72`}
                        />
                    </div>
                    {selected.size > 0 && (
                        <button
                            onClick={handleDeleteSelection}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm font-medium text-rose-200 hover:bg-rose-500/20"
                        >
                            <Trash2 className="h-4 w-4" /> Supprimer ({selected.size})
                        </button>
                    )}
                    <Link
                        href="/admin/products/new"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#600bd1] px-3 py-2 text-sm font-semibold text-white hover:bg-[#7a2de8]"
                    >
                        <Plus className="h-4 w-4" /> Nouveau produit
                    </Link>
                </div>
            </header>

            {error && <ErrorBanner message={error} />}

            <Card>
                <Table>
                    <THead>
                        <TR>
                            <TH>
                                <input
                                    type="checkbox"
                                    checked={selected.size > 0 && selected.size === filtered.length}
                                    onChange={toggleAll}
                                    aria-label="Tout sélectionner"
                                    className="h-4 w-4 accent-[#600bd1]"
                                />
                            </TH>
                            <SortableTh label="Nom" active={sortKey === "name"} dir={sortDir} onClick={() => toggleSort("name")} />
                            <SortableTh label="Catégorie" active={sortKey === "category"} dir={sortDir} onClick={() => toggleSort("category")} />
                            <SortableTh label="Prix de base" active={sortKey === "price"} dir={sortDir} onClick={() => toggleSort("price")} />
                            <SortableTh label="Priorité" active={sortKey === "priority"} dir={sortDir} onClick={() => toggleSort("priority")} />
                            <TH>Top</TH>
                            <SortableTh label="Disponibilité" active={sortKey === "availability"} dir={sortDir} onClick={() => toggleSort("availability")} />
                            <TH>Plans</TH>
                            <TH>Images</TH>
                        </TR>
                    </THead>
                    <TBody>
                        {filtered.map((p) => (
                            <TR key={p.id}>
                                <TD onClick={undefined}>
                                    <input
                                        type="checkbox"
                                        checked={selected.has(p.id)}
                                        onChange={() => toggleOne(p.id)}
                                        onClick={(e) => e.stopPropagation()}
                                        className="h-4 w-4 accent-[#600bd1]"
                                    />
                                </TD>
                                <TD>
                                    <Link
                                        href={`/admin/products/${p.slug}`}
                                        className="font-medium text-white hover:text-[#c9a8ff]"
                                    >
                                        {p.name}
                                    </Link>
                                    <p className="text-xs text-white/50 font-mono">{p.slug}</p>
                                </TD>
                                <TD className="text-white/80">{p.category?.name ?? "—"}</TD>
                                <TD className="font-semibold">{formatEUR(p.basePrice)}</TD>
                                <TD>{p.priorityOrder}</TD>
                                <TD>
                                    <button
                                        type="button"
                                        onClick={() => handleToggle(p, "isFeatured")}
                                        title={p.isFeatured ? "Retirer de la vedette" : "Mettre en vedette"}
                                        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase transition ${
                                            p.isFeatured
                                                ? "border-amber-500/40 bg-amber-500/15 text-amber-200 hover:bg-amber-500/25"
                                                : "border-white/15 bg-white/[0.03] text-white/40 hover:border-white/30 hover:text-white/80"
                                        }`}
                                    >
                                        <Star className={`h-3 w-3 ${p.isFeatured ? "fill-current" : ""}`} />
                                        Top
                                    </button>
                                </TD>
                                <TD>
                                    <button
                                        type="button"
                                        onClick={() => handleToggle(p, "isAvailable")}
                                        title={p.isAvailable ? "Désactiver le produit" : "Activer le produit"}
                                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition ${
                                            p.isAvailable
                                                ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-200 hover:bg-emerald-500/25"
                                                : "border-rose-500/40 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20"
                                        }`}
                                    >
                                        {p.isAvailable ? <Check className="h-3 w-3" /> : <XIcon className="h-3 w-3" />}
                                        {p.isAvailable ? "Actif" : "Inactif"}
                                    </button>
                                </TD>
                                <TD className="text-white/70">{p.subscriptionPlans?.length ?? 0}</TD>
                                <TD className="text-white/70">{p.images?.length ?? 0}</TD>
                            </TR>
                        ))}
                    </TBody>
                </Table>
                {filtered.length === 0 && <p className="py-8 text-center text-white/50">Aucun produit.</p>}
            </Card>
        </div>
    );
}

function SortableTh({ label, active, dir, onClick }: { label: string; active: boolean; dir: "asc" | "desc"; onClick: () => void }) {
    return (
        <TH>
            <button type="button" onClick={onClick} className="flex items-center gap-1 hover:text-white transition">
                {label}
                {active && <span>{dir === "asc" ? "↑" : "↓"}</span>}
            </button>
        </TH>
    );
}

function cmp(a: AdminProduct, b: AdminProduct, k: SortKey): number {
    switch (k) {
        case "id":
            return a.id - b.id;
        case "name":
            return a.name.localeCompare(b.name);
        case "price":
            return Number(a.basePrice) - Number(b.basePrice);
        case "category":
            return (a.category?.name ?? "").localeCompare(b.category?.name ?? "");
        case "priority":
            return a.priorityOrder - b.priorityOrder;
        case "availability":
            return Number(b.isAvailable) - Number(a.isAvailable);
    }
}
