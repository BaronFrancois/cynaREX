import { cn } from "@/lib/utils";

type CynaLogoVariant = "gradient" | "white";

/** Logo Cyna : C stylisé avec dégradé violet → magenta, ou trait blanc (ex. bouton flottant). */
export function CynaLogo({
    className,
    size = 32,
    variant = "gradient",
}: {
    className?: string;
    size?: number;
    variant?: CynaLogoVariant;
}) {
    const id = "cyna-logo-gradient";
    const pathD =
        "M24 8.5C21.2 5.8 17.7 4 14 4C8.5 4 4 8.5 4 14s4.5 10 10 10c3.7 0 7.2-1.8 9-4.5";

    if (variant === "white") {
        return (
            <svg
                width={size}
                height={size}
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={cn("shrink-0", className)}
                aria-hidden
            >
                <path
                    d={pathD}
                    stroke="#ffffff"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                />
            </svg>
        );
    }

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn("shrink-0", className)}
            aria-hidden
        >
            <defs>
                <linearGradient id={id} x1="4" y1="28" x2="28" y2="4" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#4c1d95" />
                    <stop offset="0.45" stopColor="#7c3aed" />
                    <stop offset="1" stopColor="#d946ef" />
                </linearGradient>
            </defs>
            <path
                d={pathD}
                stroke={`url(#${id})`}
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
        </svg>
    );
}
