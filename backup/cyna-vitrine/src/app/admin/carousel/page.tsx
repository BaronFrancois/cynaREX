"use client";

import { useEffect, useState } from "react";
import {
    Card,
    ErrorBanner,
    Loader,
    inputClass,
    labelClass,
} from "@/components/admin/AdminUI";
import { adminApi, type AdminCarouselItem } from "@/lib/adminApi";
import { ArrowDown, ArrowUp, Plus, Save, Trash2 } from "lucide-react";

export default function AdminCarouselPage() {
    const [items, setItems] = useState<AdminCarouselItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [creating, setCreating] = useState<Partial<AdminCarouselItem> | null>(null);

    useEffect(() => {
        refresh();
    }, []);

    async function refresh() {
        setLoading(true);
        try {
            const list = await adminApi.carousel.list();
            setItems([...list].sort((a, b) => a.displayOrder - b.displayOrder));
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setLoading(false);
        }
    }

    async function handleUpdate(id: number, patch: Partial<AdminCarouselItem>) {
        try {
            await adminApi.carousel.update(id, patch);
            await refresh();
        } catch (e) {
            setError((e as Error).message);
        }
    }

    async function handleMove(item: AdminCarouselItem, dir: "up" | "down") {
        const idx = items.findIndex((i) => i.id === item.id);
        const nbrIdx = dir === "up" ? idx - 1 : idx + 1;
        if (nbrIdx < 0 || nbrIdx >= items.length) return;
        const neighbor = items[nbrIdx];
        try {
            await Promise.all([
                adminApi.carousel.update(item.id, { displayOrder: neighbor.displayOrder }),
                adminApi.carousel.update(neighbor.id, { displayOrder: item.displayOrder }),
            ]);
            await refresh();
        } catch (e) {
            setError((e as Error).message);
        }
    }

    async function handleDelete(id: number) {
        if (!confirm("Supprimer cette slide ?")) return;
        try {
            await adminApi.carousel.remove(id);
            await refresh();
        } catch (e) {
            setError((e as Error).message);
        }
    }

    async function handleCreate() {
        if (!creating?.imageUrl) return;
        try {
            await adminApi.carousel.create({
                imageUrl: creating.imageUrl,
                title: creating.title ?? null,
                subtitle: creating.subtitle ?? null,
                titleEn: creating.titleEn ?? null,
                subtitleEn: creating.subtitleEn ?? null,
                linkUrl: creating.linkUrl ?? null,
                displayOrder: Number(creating.displayOrder ?? items.length),
                isActive: creating.isActive ?? true,
            });
            setCreating(null);
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
                    <h1 className="text-2xl font-bold text-white">Carrousel d&apos;accueil</h1>
                    <p className="text-sm text-white/60">{items.length} slide(s)</p>
                </div>
                <button
                    onClick={() =>
                        setCreating({
                            imageUrl: "",
                            title: "",
                            subtitle: "",
                            titleEn: "",
                            subtitleEn: "",
                            linkUrl: "",
                            displayOrder: items.length,
                            isActive: true,
                        })
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#600bd1] px-3 py-2 text-sm font-semibold text-white hover:bg-[#7a2de8]"
                >
                    <Plus className="h-4 w-4" /> Nouvelle slide
                </button>
            </header>

            {error && <ErrorBanner message={error} />}

            {creating && (
                <Card title="Nouvelle slide">
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <label className={labelClass}>URL image</label>
                            <input
                                className={inputClass}
                                value={creating.imageUrl ?? ""}
                                onChange={(e) => setCreating({ ...creating, imageUrl: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Titre (FR)</label>
                            <input
                                className={inputClass}
                                value={creating.title ?? ""}
                                onChange={(e) => setCreating({ ...creating, title: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Sous-titre (FR)</label>
                            <input
                                className={inputClass}
                                value={creating.subtitle ?? ""}
                                onChange={(e) => setCreating({ ...creating, subtitle: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Title (EN) <span className="text-white/40">— optionnel, repli sur FR</span></label>
                            <input
                                className={inputClass}
                                value={creating.titleEn ?? ""}
                                onChange={(e) => setCreating({ ...creating, titleEn: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Subtitle (EN) <span className="text-white/40">— optionnel, repli sur FR</span></label>
                            <input
                                className={inputClass}
                                value={creating.subtitleEn ?? ""}
                                onChange={(e) => setCreating({ ...creating, subtitleEn: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Lien (optionnel)</label>
                            <input
                                className={inputClass}
                                value={creating.linkUrl ?? ""}
                                onChange={(e) => setCreating({ ...creating, linkUrl: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Ordre</label>
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

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {items.map((item, idx) => (
                    <Card key={item.id}>
                        <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-black/40">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.imageUrl} alt={item.title ?? ""} className="h-full w-full object-cover" />
                            {!item.isActive && (
                                <span className="absolute right-2 top-2 rounded-full bg-rose-500/80 px-2 py-0.5 text-xs font-medium text-white">
                                    Inactive
                                </span>
                            )}
                        </div>
                        <div className="mt-3 grid gap-2">
                            <input
                                className={inputClass}
                                value={item.title ?? ""}
                                placeholder="Titre (FR)"
                                onChange={(e) => handleUpdate(item.id, { title: e.target.value })}
                            />
                            <input
                                className={inputClass}
                                value={item.subtitle ?? ""}
                                placeholder="Sous-titre (FR)"
                                onChange={(e) => handleUpdate(item.id, { subtitle: e.target.value })}
                            />
                            <input
                                className={inputClass}
                                value={item.titleEn ?? ""}
                                placeholder="Title (EN) — repli sur FR si vide"
                                onChange={(e) => handleUpdate(item.id, { titleEn: e.target.value })}
                            />
                            <input
                                className={inputClass}
                                value={item.subtitleEn ?? ""}
                                placeholder="Subtitle (EN) — repli sur FR si vide"
                                onChange={(e) => handleUpdate(item.id, { subtitleEn: e.target.value })}
                            />
                            <input
                                className={inputClass}
                                value={item.linkUrl ?? ""}
                                placeholder="Lien (optionnel)"
                                onChange={(e) => handleUpdate(item.id, { linkUrl: e.target.value })}
                            />
                            <input
                                className={inputClass}
                                value={item.imageUrl}
                                placeholder="URL image"
                                onChange={(e) => handleUpdate(item.id, { imageUrl: e.target.value })}
                            />
                            <label className="inline-flex items-center gap-2 text-sm text-white/80">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 accent-[#600bd1]"
                                    checked={item.isActive}
                                    onChange={(e) => handleUpdate(item.id, { isActive: e.target.checked })}
                                />
                                Active
                            </label>
                            <div className="flex items-center justify-between">
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => handleMove(item, "up")}
                                        disabled={idx === 0}
                                        className="rounded p-1.5 text-white/70 hover:bg-white/10 disabled:opacity-30"
                                        aria-label="Monter"
                                    >
                                        <ArrowUp className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleMove(item, "down")}
                                        disabled={idx === items.length - 1}
                                        className="rounded p-1.5 text-white/70 hover:bg-white/10 disabled:opacity-30"
                                        aria-label="Descendre"
                                    >
                                        <ArrowDown className="h-4 w-4" />
                                    </button>
                                    <span className="ml-2 text-xs text-white/50 self-center">ordre {item.displayOrder}</span>
                                </div>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="rounded p-1.5 text-rose-300 hover:bg-rose-500/10"
                                    aria-label="Supprimer"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {items.length === 0 && <p className="py-8 text-center text-white/50">Aucune slide.</p>}
        </div>
    );
}
