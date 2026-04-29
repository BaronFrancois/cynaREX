import React from "react";
import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { PRODUCTS } from "@/constant";
import { buttonClassName } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface SimilarServicesProps {
    currentProductId: string;
    currentCategory: string;
}

export default function SimilarServices({ currentProductId, currentCategory }: SimilarServicesProps) {
    // Filtrage: exclure le produit actuel, prioritiser la même catégorie, sinon prendre d'autres produits aléatoirement (ou simplement par l'ordre défini)
    const otherProducts = PRODUCTS.filter((p) => p.id !== currentProductId && p.status === "available");
    
    // On trie grossièrement pour mettre ceux de la même catégorie en premier
    const sortedProducts = [...otherProducts].sort((a, b) => {
        if (a.category === currentCategory && b.category !== currentCategory) return -1;
        if (a.category !== currentCategory && b.category === currentCategory) return 1;
        return 0;
    });

    const similarSelected = sortedProducts.slice(0, 6);

    if (similarSelected.length === 0) return null;

    return (
        <section className="py-20 bg-black border-t border-zinc-900 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-10">
                    <h2 className="cyna-heading text-gray-100">
                        Services Similaires
                    </h2>
                    <Link href="/catalog" className="text-sm font-medium text-cyna-500 hover:text-cyna-400 transition-colors flex items-center">
                        Voir tout <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {similarSelected.map((product) => (
                        <Link 
                            key={product.id} 
                            href={`/product/${product.id}`}
                            className="group flex flex-col bg-[var(--cyna-card-surface)] border border-zinc-800/60 rounded-2xl overflow-hidden hover:border-cyna-600/40 transition-all duration-300"
                        >
                            <div className="relative h-40 overflow-hidden bg-zinc-900">
                                <img 
                                    src={product.image} 
                                    alt={product.name} 
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                />
                                <div className="absolute top-3 left-3 flex gap-2">
                                    <span className="bg-black/80 backdrop-blur-sm text-gray-300 text-[10px] font-bold uppercase px-2 py-1 rounded-full border border-zinc-700">
                                        {product.category}
                                    </span>
                                </div>
                            </div>
                            <div className="p-5 flex flex-col flex-1">
                                <h3 className="text-lg font-bold text-gray-100 mb-2 group-hover:text-cyna-400 transition-colors">
                                    {product.name}
                                </h3>
                                <p className="text-sm text-gray-400 line-clamp-2 mb-4 flex-1">
                                    {product.shortDescription}
                                </p>
                                <div className="flex items-end justify-between border-t border-zinc-800/80 pt-4 mt-auto">
                                    <div>
                                        <p className="font-bold text-gray-100">{product.price}€<span className="text-xs text-gray-500 font-normal"> / {product.period === "monthly" ? "mois" : "an"}</span></p>
                                    </div>
                                    <span
                                        className={cn(
                                            buttonClassName("outline", "sm"),
                                            "inline-flex h-9 w-9 min-h-9 min-w-9 shrink-0 !p-0 pointer-events-none"
                                        )}
                                        aria-hidden
                                    >
                                        <ShoppingBag className="w-3.5 h-3.5" />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
