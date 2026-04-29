const DEFAULT_API_URL =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:3001/api'
    : 'https://cyna-api.onrender.com/api';

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL).replace(/\/$/, '');

// ─── Helpers ────────────────────────────────────────────────────────────────

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? 'Erreur API');
  return data as T;
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export async function login(email: string, password: string): Promise<LoginResponse> {
  const data = await request<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  localStorage.setItem('token', data.accessToken);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data;
}

export async function register(
  firstName: string,
  lastName: string,
  email: string,
  password: string
): Promise<void> {
  await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ firstName, lastName, email, password }),
  });
}

export function logout(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function getCurrentUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('user');
  return raw ? (JSON.parse(raw) as AuthUser) : null;
}

export function isAdmin(): boolean {
  return getCurrentUser()?.role === 'ADMIN';
}

// ─── Checkout / Paiement ─────────────────────────────────────────────────────

export interface CheckoutPayload {
  userId: number;
  cartId: number;
  billingAddressId: number;
  paymentMethodId: string;
  saveCard?: boolean;
}

export interface CheckoutResponse {
  success?: boolean;
  orderId?: number;
  requiresAction?: boolean;
  clientSecret?: string;
}

export async function checkout(payload: CheckoutPayload): Promise<CheckoutResponse> {
  return request<CheckoutResponse>('/v1/payement/checkout', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function confirm3DS(paymentIntentId: string): Promise<{ success: boolean }> {
  return request('/v1/payement/confirm-3ds', {
    method: 'POST',
    body: JSON.stringify({ paymentIntentId }),
  });
}

// ─── Méthodes de paiement ────────────────────────────────────────────────────

export async function getPaymentMethods() {
  return request('/payment-methods');
}

// ─── Adresses ────────────────────────────────────────────────────────────────

export async function getAddresses() {
  return request('/addresses');
}

// ─── Commandes ───────────────────────────────────────────────────────────────

export async function getMyOrders() {
  return request('/orders');
}
