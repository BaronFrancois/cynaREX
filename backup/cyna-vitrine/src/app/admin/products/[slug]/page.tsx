"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { ErrorBanner, Loader } from "@/components/admin/AdminUI";
import { adminApi, type AdminProduct } from "@/lib/adminApi";
import { ArrowLeft, Trash2 } from "lucide-react";

export default function EditProductPage() {
    const params = useParams<{ slug: string }>();
    const router = useRouter();
    const [product, setProduct] = useState<AdminProduct | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        (async () => {
            try {
                const p = await adminApi.products.get(params.slug);
                setProduct(p);
            } catch (e) {
                setError((e as Error).message);
            } finally {
                setLoading(false);
            }
        })();
    }, [params.slug]);

    async function handleDelete() {
        if (!product) return;
        if (!confirm(`Supprimer "${product.name}" ? Irréversible.`)) return;
        try {
            await adminApi.products.remove(product.id);
            router.push("/admin/products");
        } catch (e) {
            setError((e as Error).message);
        }
    }

    if (loading) return <Loader />;
    if (!product) return <ErrorBanner message={error || "Produit introuvable."} />;

    return (
        <div className="space-y-6">
            <div>
                <Link
                    href="/admin/products"
                    className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white"
                >
                    <ArrowLeft className="h-4 w-4" /> Retour
                </Link>
            </div>
            <header className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-white">{product.name}</h1>
                    <p className="text-xs text-white/50 font-mono">{product.slug}</p>
                </div>
                <button
                    onClick={handleDelete}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm font-medium text-rose-200 hover:bg-rose-500/20"
                >
                    <Trash2 className="h-4 w-4" /> Supprimer le produit
                </button>
            </header>
            <ProductForm initial={product} onSaved={setProduct} />
        </div>
    );
}
