"use client";

import { useEffect, useState } from "react";
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
    inlineInputClass,
    inputClass,
    labelClass,
} from "@/components/admin/AdminUI";
import { adminApi, type AdminCategory } from "@/lib/adminApi";
import { Plus, Save, Trash2 } from "lucide-react";

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<AdminCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editing, setEditing] = useState<Record<number, Partial<AdminCategory>>>({});
    const [creating, setCreating] = useState<Partial<AdminCategory> | null>(null);

    useEffect(() => {
        refresh();
    }, []);

    async function refresh() {
        setLoading(true);
        try {
            const list = await adminApi.categories.list();
            setCategories([...list].sort((a, b) => a.displayOrder - b.displayOrder));
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setLoading(false);
        }
    }

    async function handleSave(cat: AdminCategory) {
        const patch = editing[cat.id];
        if (!patch) return;
        try {
            await adminApi.categories.update(cat.id, patch);
            setEditing((prev) => {
                const next = { ...prev };
                delete next[cat.id];
                return next;
            });
            await refresh();
        } catch (e) {
            setError((e as Error).message);
        }
    }

    async function handleCreate() {
        if (!creating?.name) return;
        try {
            await adminApi.categories.create({
                name: creating.name,
                slug: creating.slug,
                description: creating.description,
                imageUrl: creating.imageUrl,
                displayOrder: Number(creating.displayOrder ?? 0),
                isActive: creating.isActive ?? true,
            });
            setCreating(null);
            await refresh();
        } catch (e) {
            setError((e as Error).message);
        }
    }

    async function handleDelete(id: number) {
        if (!confirm("Supprimer cette catégorie ? Les produits associés resteront mais sans catégorie.")) return;
        try {
            await adminApi.categories.remove(id);
            await refresh();
        } catch (e) {
            setError((e as Error).message);
        }
    }

    function patch(id: number, v: Partial<AdminCategory>) {
        setEditing((prev) => ({ ...prev, [id]: { ...(prev[id] ?? {}), ...v } }));
    }

    if (loading) return <Loader />;

    return (
        <div className="space-y-6">
            <header className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-white">Catégories</h1>
                    <p className="text-sm text-white/60">{categories.length} catégorie(s)</p>
                </div>
                <button
                    onClick={() =>
                        setCreating({ name: "", description: "", imageUrl: "", displayOrder: categories.length, isActive: true })
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#600bd1] px-3 py-2 text-sm font-semibold text-white hover:bg-[#7a2de8]"
                >
                    <Plus className="h-4 w-4" /> Nouvelle catégorie
                </button>
            </header>

            {error && <ErrorBanner message={error} />}

            {creating && (
                <Card title="Nouvelle catégorie">
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                            <label className={labelClass}>Nom</label>
                            <input
                                className={inputClass}
                                value={creating.name ?? ""}
                                onChange={(e) => setCreating({ ...creating, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Slug (optionnel)</label>
                            <input
                                className={inputClass}
                                value={creating.slug ?? ""}
                                onChange={(e) => setCreating({ ...creating, slug: e.target.value })}
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className={labelClass}>Description</label>
                            <textarea
                                rows={2}
                                className={inputClass}
                                value={creating.description ?? ""}
                                onChange={(e) => setCreating({ ...creating, description: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>URL image</label>
                            <input
                                className={inputClass}
                                value={creating.imageUrl ?? ""}
                                onChange={(e) => setCreating({ ...creating, imageUrl: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Ordre d&apos;affichage</label>
                            <input
                                type="number"
                                className={inputClass}
                                value={Number(creating.displayOrder ?? 0)}
                                onChange={(e) => setCreating({ ...creating, displayOrder: Number(e.target.value) })}
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                        <button
                            onClick={() => setCreating(null)}
                            className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white hover:bg-white/10"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={handleCreate}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#600bd1] px-3 py-2 text-sm font-semibold text-white hover:bg-[#7a2de8]"
                        >
                            <Save className="h-4 w-4" /> Créer
                        </button>
                    </div>
                </Card>
            )}

            <Card>
                <Table minWidth="min-w-[1100px]">
                    <THead>
                        <TR>
                            <TH>Ordre</TH>
                            <TH>Nom</TH>
                            <TH>Slug</TH>
                            <TH>Description</TH>
                            <TH>Actif</TH>
                            <TH>Produits</TH>
                            <TH>Actions</TH>
                        </TR>
                    </THead>
                    <TBody>
                        {categories.map((c) => {
                            const e = editing[c.id];
                            const isEditing = !!e;
                            return (
                                <TR key={c.id}>
                                    <TD>
                                        <input
                                            type="number"
                                            className={`${inlineInputClass} w-20`}
                                            value={Number(e?.displayOrder ?? c.displayOrder)}
                                            onChange={(ev) => patch(c.id, { displayOrder: Number(ev.target.value) })}
                                        />
                                    </TD>
                                    <TD>
                                        <input
                                            className={`${inlineInputClass} w-48`}
                                            value={e?.name ?? c.name}
                                            onChange={(ev) => patch(c.id, { name: ev.target.value })}
                                        />
                                    </TD>
                                    <TD className="font-mono text-xs">{c.slug}</TD>
                                    <TD>
                                        <input
                                            className={`${inlineInputClass} w-64`}
                                            value={e?.description ?? c.description ?? ""}
                                            onChange={(ev) => patch(c.id, { description: ev.target.value })}
                                        />
                                    </TD>
                                    <TD>
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 accent-[#600bd1]"
                                            checked={e?.isActive ?? c.isActive}
                                            onChange={(ev) => patch(c.id, { isActive: ev.target.checked })}
                                        />
                                    </TD>
                                    <TD className="text-white/70">{c.products?.length ?? 0}</TD>
                                    <TD>
                                        <div className="flex gap-2">
                                            {isEditing && (
                                                <button
                                                    onClick={() => handleSave(c)}
                                                    className="rounded p-1.5 text-emerald-300 hover:bg-emerald-500/10"
                                                    aria-label="Enregistrer"
                                                >
                                                    <Save className="h-4 w-4" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(c.id)}
                                                className="rounded p-1.5 text-rose-300 hover:bg-rose-500/10"
                                                aria-label="Supprimer"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </TD>
                                </TR>
                            );
                        })}
                    </TBody>
                </Table>
                {categories.length === 0 && <p className="py-8 text-center text-white/50">Aucune catégorie.</p>}
            </Card>
        </div>
    );
}
