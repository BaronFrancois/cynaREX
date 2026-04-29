import { PRODUCTS } from "@/constant";
import type { CartItem } from "@/hooks/useCart";

export function cartLineIsAvailable(item: CartItem): boolean {
    if (item.isAvailable === false) return false;
    if (item.isAvailable === true) return true;
    const prod = PRODUCTS.find((p) => p.id === item.id);
    if (prod) return prod.status === "available";
    return true;
}

export function cartHasUnavailableItem(items: CartItem[]): boolean {
    return items.some((i) => !cartLineIsAvailable(i));
}
