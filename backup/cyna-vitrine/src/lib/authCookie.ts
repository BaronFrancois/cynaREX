import Cookies from "js-cookie";

const AUTH_KEY = "auth_token";

/**
 * Lit le jeton d’auth sans tronquer les JWT (les `=` de padding cassent un simple split sur "=").
 */
export function getAuthToken(): string | undefined {
    if (typeof document === "undefined") return undefined;
    const v = Cookies.get(AUTH_KEY);
    return v && v.length > 0 ? v : undefined;
}

export function setAuthToken(token: string, maxAgeSeconds: number): void {
    const days = maxAgeSeconds / (24 * 3600);
    Cookies.set(AUTH_KEY, token, {
        path: "/",
        expires: days,
        sameSite: "lax",
        secure: typeof window !== "undefined" && window.location.protocol === "https:",
    });
}

export function clearAuthToken(): void {
    Cookies.remove(AUTH_KEY, { path: "/" });
}
