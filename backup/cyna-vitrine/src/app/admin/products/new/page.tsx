"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { ArrowLeft } from "lucide-react";

export default function NewProductPage() {
    const router = useRouter();
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
            <h1 className="text-2xl font-bold text-white">Nouveau produit</h1>
            <ProductForm onSaved={(p) => router.replace(`/admin/products/${p.slug}`)} />
        </div>
    );
}
