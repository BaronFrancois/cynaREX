import { cn } from "@/lib/utils";

/** Logo Cyna : C stylisé avec dégradé violet → magenta (charte proche du site officiel). */
export function CynaLogo({ className, size = 32 }: { className?: string; size?: number }) {
    const id = "cyna-logo-gradient";
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
                d="M24 8.5C21.2 5.8 17.7 4 14 4C8.5 4 4 8.5 4 14s4.5 10 10 10c3.7 0 7.2-1.8 9-4.5"
                stroke={`url(#${id})`}
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
        </svg>
    );
}
