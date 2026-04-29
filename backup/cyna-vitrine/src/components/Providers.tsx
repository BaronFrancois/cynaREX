"use client";

import { CartProvider } from "@/context/CartContext";
import { I18nProvider } from "@/context/I18nContext";
import { ThemeProvider } from "next-themes";
import FloatingChatBot from "@/components/support/FloatingChatBot";

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
                <CartProvider>
                    {children}
                    <FloatingChatBot />
                </CartProvider>
            </I18nProvider>
        </ThemeProvider>
    );
}
