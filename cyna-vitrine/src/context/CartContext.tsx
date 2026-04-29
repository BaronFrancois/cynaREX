"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    category: string;
    period: "monthly" | "annual";
    /** Si false, le service est indisponible (SaaS en maintenance, etc.) */
    isAvailable?: boolean;
}

type CartContextValue = {
    items: CartItem[];
    isLoaded: boolean;
    itemCount: number;
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string) => void;
    updateCartItem: (id: string, updates: Partial<CartItem>) => void;
    clearCart: () => void;
    total: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        try {
            const stored = localStorage.getItem("cart");
            if (stored) {
                setItems(JSON.parse(stored) as CartItem[]);
            }
        } catch {
            /* ignore */
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (!isLoaded) return;
        localStorage.setItem("cart", JSON.stringify(items));
    }, [items, isLoaded]);

    const addToCart = useCallback((item: CartItem) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.id === item.id);
            if (existing) {
                return prev.map((i) =>
                    i.id === item.id
                        ? { ...i, quantity: i.quantity + item.quantity }
                        : i
                );
            }
            return [...prev, item];
        });
    }, []);

    const removeFromCart = useCallback((id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    }, []);

    const updateCartItem = useCallback((id: string, updates: Partial<CartItem>) => {
        setItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
        );
    }, []);

    const clearCart = useCallback(() => {
        setItems([]);
    }, []);

    const total = useMemo(
        () => items.reduce((acc, item) => acc + item.price * item.quantity, 0),
        [items]
    );

    const itemCount = useMemo(
        () => items.reduce((n, item) => n + item.quantity, 0),
        [items]
    );

    const value = useMemo(
        () => ({
            items,
            isLoaded,
            itemCount,
            addToCart,
            removeFromCart,
            updateCartItem,
            clearCart,
            total,
        }),
        [
            items,
            isLoaded,
            itemCount,
            addToCart,
            removeFromCart,
            updateCartItem,
            clearCart,
            total,
        ]
    );

    return (
        <CartContext.Provider value={value}>{children}</CartContext.Provider>
    );
}

export function useCart(): CartContextValue {
    const ctx = useContext(CartContext);
    if (!ctx) {
        throw new Error("useCart doit être utilisé dans un CartProvider");
    }
    return ctx;
}
