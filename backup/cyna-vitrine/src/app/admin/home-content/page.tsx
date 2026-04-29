"use client";

import { useEffect, useState } from "react";
import {
    Card,
    ErrorBanner,
    Loader,
    formatDate,
    inputClass,
    labelClass,
} from "@/components/admin/AdminUI";
import { adminApi, type AdminHomeTextBlock } from "@/lib/adminApi";
import { Plus, Save, Trash2 } from "lucide-react";

/** Blocs conventionnels utilisés sur la home. Ajoutez-en librement. */
const DEFAULT_IDENTIFIERS = ["hero_headline", "hero_subline", "promo_banner", "mission_text"];

export default function AdminHomeContentPage() {
    const [blocks, setBlocks] = useState<AdminHomeTextBlock[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [drafts, setDrafts] = useState<Record<string, string>>({});
    const [newIdentifier, setNewIdentifier] = useState("");
    const [newContent, setNewContent] = useState("");

    useEffect(() => {
        refresh();
    }, []);

    async function refresh() {
        setLoading(true);
        try {
            const list = await adminApi.homeTextBlocks.list();
            setBlocks(list);
            setDrafts(Object.fromEntries(list.map((b) => [b.identifier, b.content])));
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setLoading(false);
        }
    }

    async function handleSave(identifier: string) {
        try {
            await adminApi.homeTextBlocks.upsert(identifier, drafts[identifier] ?? "");
            await refresh();
        } catch (e) {
            setError((e as Error).message);
        }
    }

    async function handleCreate() {
        if (!newIdentifier.trim()) return;
        try {
            await adminApi.homeTextBlocks.upsert(newIdentifier.trim(), newContent);
            setNewIdentifier("");
            setNewContent("");
            await refresh();
        } catch (e) {
            setError((e as Error).message);
        }
    }

    async function handleDelete(identifier: string) {
        if (!confirm(`Supprimer le bloc "${identifier}" ?`)) return;
        try {
            await adminApi.homeTextBlocks.remove(identifier);
            await refresh();
        } catch (e) {
            setError((e as Error).message);
        }
    }

    if (loading) return <Loader />;

    const existingIds = new Set(blocks.map((b) => b.identifier));
    const missingDefaults = DEFAULT_IDENTIFIERS.filter((id) => !existingIds.has(id));

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-2xl font-bold text-white">Contenu d&apos;accueil</h1>
                <p className="text-sm text-white/60">
                    Blocs de texte modifiables (titres, bannières promo, message d&apos;accueil…)
                </p>
            </header>

            {error && <ErrorBanner message={error} />}

            {missingDefaults.length > 0 && (
                <Card title="Blocs recommandés à créer">
                    <p className="text-sm text-white/70 mb-3">
                        Ces identifiants standards de la page d&apos;accueil ne sont pas encore définis :
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {missingDefaults.map((id) => (
                            <button
                                key={id}
                                onClick={() => adminApi.homeTextBlocks.upsert(id, "").then(refresh)}
                                className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white hover:bg-white/10"
                            >
                                + {id}
                            </button>
                        ))}
                    </div>
                </Card>
            )}

            <div className="space-y-4">
                {blocks.map((b) => (
                    <Card
                        key={b.identifier}
                        title={
                            <span className="font-mono text-sm text-[#c9a8ff]">{b.identifier}</span>
                        }
                        actions={
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-white/40">Maj : {formatDate(b.updatedAt, true)}</span>
                                <button
                                    onClick={() => handleSave(b.identifier)}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#600bd1] px-3 py-1.5 text-sm font-semibold text-white hover:bg-[#7a2de8]"
                                >
                                    <Save className="h-4 w-4" /> Enregistrer
                                </button>
                                <button
                                    onClick={() => handleDelete(b.identifier)}
                                    className="rounded p-1.5 text-rose-300 hover:bg-rose-500/10"
                                    aria-label="Supprimer"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        }
                    >
                        <textarea
                            rows={5}
                            className={inputClass}
                            value={drafts[b.identifier] ?? ""}
                            onChange={(e) =>
                                setDrafts((d) => ({ ...d, [b.identifier]: e.target.value }))
                            }
                        />
                    </Card>
                ))}
            </div>

            <Card title="Créer un nouveau bloc">
                <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                        <label className={labelClass}>Identifiant (slug)</label>
                        <input
                            className={inputClass}
                            placeholder="hero_cta_text"
                            value={newIdentifier}
                            onChange={(e) => setNewIdentifier(e.target.value)}
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <label className={labelClass}>Contenu</label>
                        <textarea
                            rows={3}
                            className={inputClass}
                            value={newContent}
                            onChange={(e) => setNewContent(e.target.value)}
                        />
                    </div>
                </div>
                <div className="mt-3 flex justify-end">
                    <button
                        onClick={handleCreate}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#600bd1] px-3 py-2 text-sm font-semibold text-white hover:bg-[#7a2de8]"
                    >
                        <Plus className="h-4 w-4" /> Créer
                    </button>
                </div>
            </Card>
        </div>
    );
}
