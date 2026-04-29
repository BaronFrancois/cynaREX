"use client";

import { CartProvider } from "@/context/CartContext";
import { I18nProvider } from "@/context/I18nContext";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            forcedTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
        >
            <I18nProvider>
                <CartProvider>{children}</CartProvider>
            </I18nProvider>
        </ThemeProvider>
    );
}
