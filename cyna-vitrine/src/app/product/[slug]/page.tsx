"use client";

import { useEffect, useState } from "react";
import { PRODUCTS } from "@/constant";
import AppLayout from "@/layout/AppLayout";
import { Button } from "@/components/ui/Button";
import useCart, { type CartItem } from "@/hooks/useCart";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use } from "react";
import { notFound } from "next/navigation";
import EdrProDetail from "@/components/products/EdrProDetail";
import XdrMaxDetail from "@/components/products/XdrMaxDetail";
import SocManagedDetail from "@/components/products/SocManagedDetail";
import ProductCarousel from "@/components/products/ProductCarousel";
import SimilarServices from "@/components/products/SimilarServices";
const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    EDR: { bg: "bg-violet-950/50", text: "text-violet-300", border: "border-violet-800" },
    XDR: { bg: "bg-fuchsia-950/50", text: "text-fuchsia-300", border: "border-fuchsia-800" },
    SOC: { bg: "bg-purple-950/50", text: "text-purple-300", border: "border-purple-800" },
};

const PRODUCT_DETAIL_COMPONENTS: Record<string, React.FC> = {
    "cyna-edr-pro": EdrProDetail,
    "cyna-xdr-max": XdrMaxDetail,
    "cyna-soc-managed": SocManagedDetail,
};

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const product = PRODUCTS.find((p) => p.id === slug);

    if (!product) notFound();

    const router = useRouter();
    const { addToCart } = useCart();
    const [justAdded, setJustAdded] = useState(false);

    useEffect(() => {
        if (!justAdded) return;
        const t = window.setTimeout(() => setJustAdded(false), 6000);
        return () => window.clearTimeout(t);
    }, [justAdded]);
    const colors = CATEGORY_COLORS[product.category] ?? {
        bg: "bg-gray-100",
        text: "text-gray-700",
        border: "border-gray-200",
    };

    const DetailComponent = PRODUCT_DETAIL_COMPONENTS[product.id];

    const buildCartItem = (): CartItem => ({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
        category: product.category,
        period: product.period === "monthly" ? "monthly" : "annual",
        isAvailable: product.status === "available",
    });

    const handleAddToCart = () => {
        addToCart(buildCartItem());
        setJustAdded(true);
    };

    const handleBuyNow = () => {
        addToCart(buildCartItem());
        setJustAdded(true);
        router.push("/checkout");
    };

    return (
        <AppLayout>
            <div className="pt-10 pb-24">
                {justAdded && (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
                        <div
                            role="status"
                            className="flex flex-col gap-3 rounded-2xl border border-green-800 bg-green-950/40 px-4 py-3 text-sm text-green-300 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <span>
                                <strong>{product.name}</strong> a été ajouté à votre panier.
                            </span>
                            <Link
                                href="/cart"
                                className="font-semibold text-cyna-700 underline underline-offset-2 hover:text-cyna-900 shrink-0"
                            >
                                Voir le panier
                            </Link>
                        </div>
                    </div>
                )}

                {/* Breadcrumb */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
                    <nav className="flex items-center gap-2 text-sm text-gray-500">
                        <Link href="/" className="hover:text-gray-300 transition-colors">Accueil</Link>
                        <span>/</span>
                        <Link href="/catalog" className="hover:text-gray-300 transition-colors">Catalogue</Link>
                        <span>/</span>
                        <span className="text-gray-200 font-medium">{product.name}</span>
                    </nav>
                </div>

                {/* Hero */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-28">

                        {/* Left: Info */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${colors.bg} ${colors.text} ${colors.border} uppercase tracking-wider`}>
                                    {product.category}
                                </span>
                                {product.status === "available" && (
                                    <span className="text-xs font-semibold text-green-400 bg-green-950/40 border border-green-800 px-3 py-1 rounded-full">
                                        ● Disponible immédiatement
                                    </span>
                                )}
                                {(product.status === "maintenance" || product.status === "coming_soon") && (
                                    <span className="text-xs font-semibold text-yellow-400 bg-yellow-950/40 border border-yellow-800 px-3 py-1 rounded-full">
                                        ● Service momentanément indisponible
                                    </span>
                                )}
                            </div>

                            <h1 className="cyna-heading text-gray-100 mb-5">
                                {product.name}
                            </h1>

                            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                                {product.fullDescription}
                            </p>

                            {/* Features */}
                            <ul className="grid grid-cols-2 gap-3 mb-10">
                                {product.features.map((f) => (
                                    <li key={f} className="flex items-center gap-2.5 text-gray-300 text-sm font-medium">
                                        <span className="w-5 h-5 rounded-full bg-violet-950/60 text-cyna-500 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                                            ✓
                                        </span>
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            {/* Pricing */}
                            <div className="mb-6">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold text-gray-100">{product.price}€</span>
                                    <span className="text-gray-500 text-sm ml-1">
                                        / {product.period === "monthly" ? "mois" : "an"}
                                    </span>
                                </div>
                                {product.period === "monthly" && (
                                    <p className="text-xs text-gray-500 mt-1">Facturation mensuelle · Résiliation à tout moment.</p>
                                )}
                            </div>

                            {/* CTA */}
                            <div className="flex gap-3">
                                {product.status === "available" ? (
                                    <Button size="lg" variant="primary" onClick={handleBuyNow} className="font-bold tracking-wide w-full sm:w-auto px-8">
                                        S'ABONNER MAINTENANT
                                    </Button>
                                ) : (
                                    <Button size="lg" variant="outline" disabled className="font-bold tracking-wide w-full sm:w-auto px-8 opacity-70">
                                        SERVICE INDISPONIBLE
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Right: Image */}
                        <div className="relative">
                            <ProductCarousel mainImage={product.image} productName={product.name} />
                            <div className="absolute -bottom-5 -left-5 bg-zinc-900 rounded-2xl shadow-xl p-4 border border-zinc-700">
                                <p className="text-xs text-gray-500 font-medium">À partir de</p>
                                <p className="text-xl font-bold text-gray-100">
                                    {product.price}€
                                    <span className="text-sm font-normal text-gray-500">
                                        /{product.period === "monthly" ? "mois" : "an"}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-zinc-800 mb-20" />

                    {/* Product-specific section */}
                    {DetailComponent && <DetailComponent />}

                    {/* Bottom CTA */}
                    <div className="mt-20 bg-gradient-to-br from-cyna-600 to-[#4c1d95] rounded-3xl p-12 text-center text-white">
                        <h2 className="cyna-heading cyna-heading--center text-white mb-3">Prêt à sécuriser votre organisation ?</h2>
                        <p className="text-violet-200 mb-8 text-lg">
                            Commencez dès aujourd'hui avec {product.name}.
                        </p>
                        <div className="flex justify-center gap-4">
                            {product.status === "available" ? (
                                <>
                                    <Button size="lg" variant="ghostInverse" onClick={handleAddToCart}>
                                        Démarrer maintenant
                                    </Button>
                                    <Link href="/support#contact">
                                        <Button size="lg" variant="ghostInverse">
                                            Parler à un expert
                                        </Button>
                                    </Link>
                                </>
                            ) : (
                                <Link href="/support#contact">
                                    <Button size="lg" variant="ghostInverse">
                                        Nous contacter
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* 7. Services similaires */}
                <SimilarServices currentProductId={product.id} currentCategory={product.category} />
            </div>
        </AppLayout>
    );
}
