"use client";

import { useEffect, useState } from "react";
import { Card, ErrorBanner, inputClass, labelClass, formatEUR } from "@/components/admin/AdminUI";
import {
    adminApi,
    type AdminCategory,
    type AdminProduct,
    type AdminProductImage,
    type AdminSubscriptionPlan,
    type BillingCycle,
} from "@/lib/adminApi";
import { Plus, Save, Trash2 } from "lucide-react";

type Draft = Partial<AdminProduct> & { slug?: string };

export default function ProductForm({
    initial,
    onSaved,
}: {
    initial?: AdminProduct;
    onSaved?: (p: AdminProduct) => void;
}) {
    const isEdit = !!initial?.id;

    const [draft, setDraft] = useState<Draft>(
        initial ?? {
            name: "",
            slug: "",
            shortDescription: "",
            description: "",
            technicalSpecs: "",
            basePrice: 0,
            isAvailable: true,
            isFeatured: false,
            priorityOrder: 0,
        },
    );
    const [categories, setCategories] = useState<AdminCategory[]>([]);
    const [images, setImages] = useState<AdminProductImage[]>(initial?.images ?? []);
    const [plans, setPlans] = useState<AdminSubscriptionPlan[]>(initial?.subscriptionPlans ?? []);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        adminApi.categories.list().then(setCategories).catch((e: Error) => setError(e.message));
    }, []);

    function setField<K extends keyof Draft>(k: K, v: Draft[K]) {
        setDraft((d) => ({ ...d, [k]: v }));
    }

    async function handleSave() {
        setSaving(true);
        setError("");
        try {
            const payload = {
                categoryId: draft.categoryId ? Number(draft.categoryId) : undefined,
                name: draft.name,
                slug: draft.slug || undefined,
                shortDescription: draft.shortDescription ?? null,
                description: draft.description ?? null,
                technicalSpecs: draft.technicalSpecs ?? null,
                basePrice: Number(draft.basePrice),
                isAvailable: !!draft.isAvailable,
                isFeatured: !!draft.isFeatured,
                priorityOrder: Number(draft.priorityOrder ?? 0),
            };
            const saved = isEdit
                ? await adminApi.products.update(initial!.id, payload)
                : await adminApi.products.create(payload);
            onSaved?.(saved);
            setDraft(saved);
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setSaving(false);
        }
    }

    // ─── Images ───────────────────────────────────────────────
    async function handleAddImage() {
        if (!isEdit || !initial) return;
        const url = prompt("URL de l'image (https://...)");
        if (!url) return;
        const alt = prompt("Texte alternatif (accessibilité)") ?? "";
        try {
            const img = await adminApi.products.addImage(initial.id, {
                imageUrl: url,
                altText: alt,
                displayOrder: images.length,
            });
            setImages([...images, img]);
        } catch (e) {
            setError((e as Error).message);
        }
    }

    async function handleRemoveImage(imageId: number) {
        if (!isEdit || !initial) return;
        if (!confirm("Supprimer cette image ?")) return;
        try {
            await adminApi.products.removeImage(initial.id, imageId);
            setImages(images.filter((i) => i.id !== imageId));
        } catch (e) {
            setError((e as Error).message);
        }
    }

    // ─── Plans ─────────────────────────────────────────────────
    async function handleAddPlan() {
        if (!isEdit || !initial) return;
        const label = prompt("Libellé du plan (ex : Mensuel, Annuel)");
        if (!label) return;
        const cycle = prompt("Cycle (MONTHLY, YEARLY, PER_USER, PER_DEVICE)", "MONTHLY") as BillingCycle;
        const priceStr = prompt("Prix (€)");
        if (!priceStr) return;
        try {
            const plan = await adminApi.plans.create({
                productId: initial.id,
                label,
                billingCycle: cycle,
                price: Number(priceStr),
                isActive: true,
            });
            setPlans([...plans, plan]);
        } catch (e) {
            setError((e as Error).message);
        }
    }

    async function handleUpdatePlan(plan: AdminSubscriptionPlan, patch: Partial<AdminSubscriptionPlan>) {
        try {
            const updated = await adminApi.plans.update(plan.id, patch);
            setPlans(plans.map((p) => (p.id === plan.id ? updated : p)));
        } catch (e) {
            setError((e as Error).message);
        }
    }

    async function handleRemovePlan(id: number) {
        if (!confirm("Supprimer ce plan ?")) return;
        try {
            await adminApi.plans.remove(id);
            setPlans(plans.filter((p) => p.id !== id));
        } catch (e) {
            setError((e as Error).message);
        }
    }

    return (
        <div className="space-y-6">
            {error && <ErrorBanner message={error} />}

            <Card title="Informations produit">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        <label className={labelClass}>Nom</label>
                        <input
                            className={inputClass}
                            value={draft.name ?? ""}
                            onChange={(e) => setField("name", e.target.value)}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Slug (optionnel — auto-généré)</label>
                        <input
                            className={inputClass}
                            value={draft.slug ?? ""}
                            onChange={(e) => setField("slug", e.target.value)}
                            placeholder="cyna-edr-pro"
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Catégorie</label>
                        <select
                            className={inputClass}
                            value={draft.categoryId ?? ""}
                            onChange={(e) => setField("categoryId", Number(e.target.value))}
                        >
                            <option value="">— Sélectionner —</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className={labelClass}>Prix de base (€)</label>
                        <input
                            type="number"
                            step="0.01"
                            className={inputClass}
                            value={String(draft.basePrice ?? 0)}
                            onChange={(e) => setField("basePrice", e.target.value as unknown as number)}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Ordre de priorité</label>
                        <input
                            type="number"
                            className={inputClass}
                            value={Number(draft.priorityOrder ?? 0)}
                            onChange={(e) => setField("priorityOrder", Number(e.target.value))}
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <label className={labelClass}>Description courte (résumé catalogue)</label>
                        <input
                            className={inputClass}
                            value={draft.shortDescription ?? ""}
                            onChange={(e) => setField("shortDescription", e.target.value)}
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <label className={labelClass}>Description complète</label>
                        <textarea
                            rows={5}
                            className={inputClass}
                            value={draft.description ?? ""}
                            onChange={(e) => setField("description", e.target.value)}
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <label className={labelClass}>Caractéristiques techniques</label>
                        <textarea
                            rows={4}
                            className={inputClass}
                            value={draft.technicalSpecs ?? ""}
                            onChange={(e) => setField("technicalSpecs", e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-6 sm:col-span-2">
                        <label className="inline-flex items-center gap-2 text-sm text-white/80">
                            <input
                                type="checkbox"
                                className="h-4 w-4 accent-[#600bd1]"
                                checked={!!draft.isAvailable}
                                onChange={(e) => setField("isAvailable", e.target.checked)}
                            />
                            Disponible
                        </label>
                        <label className="inline-flex items-center gap-2 text-sm text-white/80">
                            <input
                                type="checkbox"
                                className="h-4 w-4 accent-[#600bd1]"
                                checked={!!draft.isFeatured}
                                onChange={(e) => setField("isFeatured", e.target.checked)}
                            />
                            Produit vedette (Top du moment)
                        </label>
                    </div>
                </div>

                <div className="mt-5 flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#600bd1] px-4 py-2 text-sm font-semibold text-white hover:bg-[#7a2de8] disabled:opacity-50"
                    >
                        <Save className="h-4 w-4" /> {saving ? "Enregistrement…" : "Enregistrer"}
                    </button>
                </div>
            </Card>

            {/* Images */}
            <Card
                title="Images"
                actions={
                    isEdit ? (
                        <button
                            onClick={handleAddImage}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-white hover:bg-white/10"
                        >
                            <Plus className="h-4 w-4" /> Ajouter
                        </button>
                    ) : null
                }
            >
                {!isEdit && (
                    <p className="text-sm text-white/50">Enregistrez le produit pour pouvoir ajouter des images.</p>
                )}
                {isEdit && images.length === 0 && (
                    <p className="text-sm text-white/50">Aucune image pour l&apos;instant.</p>
                )}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {images.map((img) => (
                        <div
                            key={img.id}
                            className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]"
                        >
                            <div className="relative aspect-square">
                                {/* Image URL potentially arbitrary: use <img> to avoid needing domain config */}
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={img.imageUrl}
                                    alt={img.altText ?? ""}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="p-2">
                                <p className="truncate text-xs text-white/70">{img.altText || "(sans alt)"}</p>
                                <div className="mt-1 flex items-center justify-between">
                                    <span className="text-[11px] text-white/40">ordre {img.displayOrder}</span>
                                    <button
                                        onClick={() => handleRemoveImage(img.id)}
                                        className="rounded p-1 text-rose-300 hover:bg-rose-500/10"
                                        aria-label="Supprimer l'image"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Plans d'abonnement */}
            <Card
                title="Plans d'abonnement"
                actions={
                    isEdit ? (
                        <button
                            onClick={handleAddPlan}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-white hover:bg-white/10"
                        >
                            <Plus className="h-4 w-4" /> Ajouter un plan
                        </button>
                    ) : null
                }
            >
                {!isEdit && (
                    <p className="text-sm text-white/50">Enregistrez le produit pour configurer ses plans.</p>
                )}
                {isEdit && plans.length === 0 && (
                    <p className="text-sm text-white/50">Aucun plan — ajoutez-en au moins un pour qu&apos;il soit achetable.</p>
                )}
                <div className="space-y-3">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className="flex flex-wrap items-center gap-3 rounded-lg border border-white/10 bg-white/[0.02] p-3"
                        >
                            <div className="flex-1 min-w-[160px]">
                                <p className="font-medium text-white">{plan.label}</p>
                                <p className="text-xs text-white/50">{plan.billingCycle}</p>
                            </div>
                            <p className="font-semibold text-white">{formatEUR(plan.price)}</p>
                            <label className="inline-flex items-center gap-2 text-xs text-white/70">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 accent-[#600bd1]"
                                    checked={plan.isActive}
                                    onChange={(e) => handleUpdatePlan(plan, { isActive: e.target.checked })}
                                />
                                Actif
                            </label>
                            <button
                                onClick={() => handleRemovePlan(plan.id)}
                                className="rounded p-1 text-rose-300 hover:bg-rose-500/10"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
