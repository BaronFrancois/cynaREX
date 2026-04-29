import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?:
        | "primary"
        | "secondary"
        | "ghost"
        | "outline"
        | "accent"
        | "surface"
        | "ghostInverse"
        | "dark";
    size?: "sm" | "md" | "lg";
    isActive?: boolean;
}

/** Anneau focus homogène (fond page = variable thème) */
const FOCUS_OFFSET = "focus:ring-offset-2 focus:ring-offset-[var(--background)]";

/** CTA principal — violet CDC (.btn-sku-primary) */
const VARIANT_PRIMARY = `bg-cyna-600 text-white hover:bg-cyna-700 focus:ring-cyna-600 ${FOCUS_OFFSET}`;

/** Secondaire — même relief .btn-sku, bordure & survol violets CDC */
const VARIANT_OUTLINE = `border-2 border-cyna-500/80 text-gray-100 bg-transparent hover:bg-cyna-600/14 hover:border-cyna-400 focus:ring-cyna-500 ${FOCUS_OFFSET}`;

/** Sur bandeau dégradé marque (texte clair sur violet) */
const VARIANT_INVERSE = `border-2 border-white/45 text-white bg-white/10 hover:bg-white/18 hover:border-white/70 focus:ring-white/55 focus:ring-offset-2 focus:ring-offset-transparent`;

const SKU_CLASS: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary: "btn-sku-primary",
    secondary: "btn-sku",
    outline: "btn-sku",
    ghost: "btn-sku",
    accent: "btn-sku-primary",
    surface: "btn-sku",
    ghostInverse: "btn-sku-inv",
    dark: "btn-sku-primary",
};

const VARIANT_CLASS: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary: VARIANT_PRIMARY,
    accent: VARIANT_PRIMARY,
    dark: VARIANT_PRIMARY,
    secondary: VARIANT_OUTLINE,
    outline: VARIANT_OUTLINE,
    ghost: VARIANT_OUTLINE,
    surface: VARIANT_OUTLINE,
    ghostInverse: VARIANT_INVERSE,
};

const SIZE_CLASS: Record<NonNullable<ButtonProps["size"]>, string> = {
    sm: "px-4 py-1.5 text-sm",
    md: "px-8 py-3.5 text-lg",
    lg: "px-10 py-4 text-xl",
};

/** Base commune : forme, focus clavier, disabled, alignement (charte vitrine). */
const BASE =
    "cursor-pointer flex items-center justify-center rounded-full font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

/** Mêmes classes qu’un `<Button>` pour un `<Link>` (évite bouton dans lien). */
export function buttonClassName(
    variant: NonNullable<ButtonProps["variant"]> = "primary",
    size: NonNullable<ButtonProps["size"]> = "md",
    className?: string
) {
    return cn(
        BASE,
        VARIANT_CLASS[variant],
        SIZE_CLASS[size],
        SKU_CLASS[variant],
        className
    );
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = "primary",
    size = "md",
    isActive = false,
    className = "",
    ...props
}) => {
    return (
        <button
            className={buttonClassName(variant, size, className)}
            data-active={isActive ? "true" : undefined}
            {...props}
        >
            {children}
        </button>
    );
};
