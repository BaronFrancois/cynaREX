/**
 * Base URL de l’API Nest (préfixe global `/api`).
 * Accepte `http://localhost:3001` ou `http://localhost:3001/api`.
 * Défaut `3001` : port courant du backend dans ce dépôt (Next vitrine = 3000).
 */
const DEFAULT_API_URL =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:3001/api"
    : "https://cyna-api.onrender.com/api";

export function getApiBase(): string {
  const raw = (process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL).trim();
  let base = raw.replace(/\/$/, "");
  if (!/\/api$/i.test(base)) {
    base = `${base}/api`;
  }
  return base;
}

export async function publicFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const base = getApiBase();
  const url = path.startsWith("http") ? path : `${base}${path.startsWith("/") ? "" : "/"}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    next: init?.next,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

/** Comme `publicFetch`, mais **404 → null** (pas d’exception, ressource optionnelle). */
export async function publicFetchNullable<T>(path: string, init?: RequestInit): Promise<T | null> {
  const base = getApiBase();
  const url = path.startsWith("http") ? path : `${base}${path.startsWith("/") ? "" : "/"}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    next: init?.next,
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}
