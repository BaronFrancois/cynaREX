import { PRODUCTS } from "../../constants";
import type { Product } from "../types/produit";
import { publicFetchNullable } from "./publicApi";

export type ApiProductCard = {
    id: number;
    slug: string;
    name: string;
    shortDescription?: string | null;
    basePrice: string | number;
    isAvailable: boolean;
    images?: { imageUrl: string; displayOrder?: number }[];
    category?: { name: string; slug: string };
    subscriptionPlans?: { billingCycle: string; price: string | number; label?: string }[];
};

export type ProductSearchResponse = {
    items: ApiProductCard[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
};

export function buildProductSearchParams(p: {
    q?: string;
    title?: string;
    description?: string;
    technical?: string;
    priceMin?: string;
    priceMax?: string;
    categorySlugs?: string;
    availableOnly?: boolean;
    sort?: string;
    order?: string;
    page?: number;
    pageSize?: number;
}): string {
    const qs = new URLSearchParams();
    if (p.q?.trim()) qs.set("q", p.q.trim());
    if (p.title?.trim()) qs.set("title", p.title.trim());
    if (p.description?.trim()) qs.set("description", p.description.trim());
    if (p.technical?.trim()) qs.set("technical", p.technical.trim());
    if (p.priceMin !== undefined && p.priceMin !== "") qs.set("priceMin", String(p.priceMin));
    if (p.priceMax !== undefined && p.priceMax !== "") qs.set("priceMax", String(p.priceMax));
    if (p.categorySlugs?.trim()) qs.set("categorySlugs", p.categorySlugs.trim());
    if (p.availableOnly) qs.set("availableOnly", "true");
    if (p.sort) qs.set("sort", p.sort);
    if (p.order) qs.set("order", p.order);
    qs.set("page", String(p.page ?? 1));
    qs.set("pageSize", String(p.pageSize ?? 12));
    return qs.toString();
}

export async function fetchProductSearch(
    p: Parameters<typeof buildProductSearchParams>[0]
): Promise<ProductSearchResponse> {
    const q = buildProductSearchParams(p);
    const data = await publicFetchNullable<ProductSearchResponse>(`/products/search?${q}`);
    if (data) return data;
    return {
        items: [],
        total: 0,
        page: p.page ?? 1,
        pageSize: p.pageSize ?? 12,
        totalPages: 0,
    };
}

export type BillingPeriod = "monthly" | "yearly";

export function pickMonthlyPrice(
    product: ApiProductCard,
    locale: "fr" | "en" = "fr"
): { display: string; billing: BillingPeriod } {
    const loc = locale === "en" ? "en-US" : "fr-FR";
    const plans = product.subscriptionPlans ?? [];
    const monthly = plans.find((x) => x.billingCycle === "MONTHLY");
    const plan = monthly ?? plans[0];
    if (!plan) {
        const n = typeof product.basePrice === "string" ? parseFloat(product.basePrice) : product.basePrice;
        return {
            display: Number.isNaN(n) ? "—" : new Intl.NumberFormat(loc).format(n),
            billing: "monthly",
        };
    }
    const pr = typeof plan.price === "string" ? parseFloat(plan.price) : plan.price;
    return {
        display: new Intl.NumberFormat(loc, { maximumFractionDigits: 2 }).format(pr),
        billing: plan.billingCycle === "YEARLY" ? "yearly" : "monthly",
    };
}

export const PRODUCT_PLACEHOLDER_IMAGE = "/product-placeholder.svg";

export function productCardImage(product: ApiProductCard): string {
    const sorted = [...(product.images ?? [])].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
    const first = sorted[0]?.imageUrl?.trim();
    if (first && first.length > 0) return first;
    return PRODUCT_PLACEHOLDER_IMAGE;
}

function productMatchesCategoryFilter(p: Product, categoryLabel: string): boolean {
    if (categoryLabel === "Tous") return true;
    return p.category === categoryLabel;
}

/** Repli catalogue quand l’API ne renvoie aucun produit (base vide, API arrêtée, etc.). */
export function catalogFallbackFromConstants(categoryFilter: string): ApiProductCard[] {
    return PRODUCTS.filter((p) => p.status === "available" && productMatchesCategoryFilter(p, categoryFilter)).map(
        (p, i) => ({
            id: 10_000 + i,
            slug: p.id,
            name: p.name,
            shortDescription: p.shortDescription,
            basePrice: p.price,
            isAvailable: true,
            images: [{ imageUrl: p.image, displayOrder: 0 }],
            category: { name: p.category, slug: p.category.toLowerCase() },
            subscriptionPlans: [
                {
                    billingCycle: p.period === "monthly" ? "MONTHLY" : "YEARLY",
                    price: p.price,
                    label: "Standard",
                },
            ],
        })
    );
}
