"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/layout/AppLayout";
import { Button } from "@/components/ui/Button";
import api from "@/lib/api";
import { clearAuthToken } from "@/lib/authCookie";
import Link from "next/link";
import {
    Shield,
    CreditCard,
    Bell,
    ChevronRight,
    LogOut,
    Activity,
    Clock,
    CheckCircle,
    AlertTriangle,
    Zap,
    Lock,
    Settings,
    LifeBuoy,
    MapPin,
    Plus,
    Trash2,
    Pencil,
    Star,
    X,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface UserProfile {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    lastLoginAt: string | null;
    createdAt: string;
}

// ── Constantes UI ─────────────────────────────────────────────────────────────

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
    EDR: <Zap className="w-5 h-5" />,
    XDR: <Activity className="w-5 h-5" />,
    SOC: <Shield className="w-5 h-5" />,
};

const CATEGORY_COLORS: Record<string, string> = {
    EDR: "bg-violet-950/50 text-violet-300",
    XDR: "bg-fuchsia-950/50 text-fuchsia-300",
    SOC: "bg-purple-950/50 text-purple-300",
};

const MOCK_ACTIVITY = [
    { id: 1, label: "Connexion réussie", detail: "Paris, France — Chrome", time: "Il y a 2 minutes", type: "success" },
    { id: 2, label: "Rapport mensuel généré", detail: "EDR & Digital Workplace — Janvier 2026", time: "Il y a 3 jours", type: "info" },
    { id: 3, label: "Abonnement renouvelé", detail: "Détection étendue (XDR) — 199,99 €", time: "Il y a 7 jours", type: "success" },
    { id: 4, label: "Alerte de sécurité", detail: "Tentative de connexion inhabituelle bloquée", time: "Il y a 12 jours", type: "warning" },
    { id: 5, label: "Mise à jour du profil", detail: "Adresse email modifiée", time: "Il y a 20 jours", type: "info" },
];

type Tab = "overview" | "subscriptions" | "billing" | "addresses" | "settings";

/** Ligne affichée dans l’historique commandes / facturation */
export type BillingOrderRow = {
    id: number;
    service: string;
    category: string;
    period: string;
    date: string;
    amount: number;
    status: string;
    invoicePdfUrl?: string | null;
};

type ApiSubscriptionRow = {
    id: number;
    status: string;
    /** ISO dates from API (Prisma) */
    endDate?: string;
    nextRenewalDate?: string | null;
    autoRenew?: boolean;
    product: {
        name: string;
        slug: string;
        shortDescription?: string | null;
        category?: { name: string } | null;
    };
    subscriptionPlan: { price: string | number; billingCycle: string; label?: string };
};

/** Plus proche échéance parmi les abonnements actifs (renewal ou fin de période). */
function earliestRenewalTimestamp(subs: ApiSubscriptionRow[]): number | null {
    const times: number[] = [];
    for (const s of subs) {
        const raw = s.nextRenewalDate ?? s.endDate;
        if (!raw) continue;
        const t = new Date(raw).getTime();
        if (!Number.isNaN(t)) times.push(t);
    }
    if (times.length === 0) return null;
    return Math.min(...times);
}

function formatRenewalDayMonth(ts: number): string {
    return new Date(ts).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function sumActiveSubscriptionPrices(subs: ApiSubscriptionRow[]): number {
    return subs.reduce((sum, s) => sum + Number(s.subscriptionPlan.price), 0);
}

function mapOrdersToBillingRows(data: unknown[]): BillingOrderRow[] {
    const statusMap: Record<string, string> = {
        PAID: "active",
        ACTIVE: "active",
        PENDING: "renewed",
        CANCELLED: "cancelled",
        REFUNDED: "cancelled",
    };
    return data.map((raw) => {
        const order = raw as {
            id: number;
            status: string;
            createdAt: string;
            totalAmount: string | number;
            orderNumber?: string;
            items?: {
                productName?: string;
                planLabel?: string;
                product?: { category?: { name?: string } | null };
            }[];
            invoice?: { pdfUrl?: string | null } | null;
        };
        const first = order.items?.[0];
        return {
            id: order.id,
            service: first?.productName ?? order.orderNumber ?? `Commande #${order.id}`,
            category: first?.product?.category?.name ?? "—",
            period: first?.planLabel ?? "—",
            date: String(order.createdAt).slice(0, 10),
            amount: Number(order.totalAmount),
            status: statusMap[order.status] ?? "active",
            invoicePdfUrl: order.invoice?.pdfUrl,
        };
    });
}

function subscriptionToUi(s: ApiSubscriptionRow) {
    const cat = s.product.category?.name ?? "EDR";
    const period =
        s.subscriptionPlan.billingCycle === "MONTHLY" || s.subscriptionPlan.billingCycle === "PER_USER"
            ? ("monthly" as const)
            : ("annual" as const);
    return {
        subscriptionId: s.id,
        id: s.product.slug,
        name: s.product.name,
        shortDescription: s.product.shortDescription ?? "",
        category: cat,
        price: Number(s.subscriptionPlan.price),
        period,
        status: s.status,
        planLabel: s.subscriptionPlan.label ?? "",
    };
}

// ── Types adresses / paiements ─────────────────────────────────────────────────

interface Address {
    id: number;
    firstName: string;
    lastName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    region?: string;
    postalCode: string;
    country: string;
    phone?: string;
    isDefault: boolean;
}

interface PaymentMethod {
    id: number;
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
    isDefault: boolean;
}

const BLANK_ADDRESS: Omit<Address, "id" | "isDefault"> = {
    firstName: "", lastName: "", addressLine1: "", addressLine2: "", city: "", region: "", postalCode: "", country: "France", phone: "",
};

// ── Données historique commandes ───────────────────────────────────────────────

const STATUS_LABEL: Record<string, string> = { active: "Active", cancelled: "Résiliée", renewed: "Renouvelée" };
const STATUS_CLASS: Record<string, string> = {
    active: "bg-green-950/40 text-green-400",
    cancelled: "bg-red-950/40 text-red-400",
    renewed: "bg-violet-950/40 text-violet-400",
};

function BillingTab({ orders, payments, setDefaultPayment, deletePayment, subsCount, nextRenewal }: {
    orders: BillingOrderRow[];
    payments: PaymentMethod[];
    setDefaultPayment: (id: number) => void;
    deletePayment: (id: number) => void;
    subsCount: number;
    /** null si aucun abonnement actif : pas de montant / date factice */
    nextRenewal: { amountLine: string; dateLine: string } | null;
}) {
    const [search, setSearch] = useState("");
    const [filterYear, setFilterYear] = useState<string>("all");
    const [filterCategory, setFilterCategory] = useState<string>("all");
    const [filterStatus, setFilterStatus] = useState<string>("all");

    const years = [...new Set(orders.map(o => o.date.slice(0, 4)))].sort((a, b) => Number(b) - Number(a));
    const categories = [...new Set(orders.map(o => o.category))];

    const filtered = orders.filter(o => {
        const matchYear = filterYear === "all" || o.date.startsWith(filterYear);
        const matchCat = filterCategory === "all" || o.category === filterCategory;
        const matchStatus = filterStatus === "all" || o.status === filterStatus;
        const matchSearch = !search || o.service.toLowerCase().includes(search.toLowerCase()) || o.date.includes(search);
        return matchYear && matchCat && matchStatus && matchSearch;
    });

    const byYear = years.reduce<Record<string, BillingOrderRow[]>>((acc, y) => {
        const rows = filtered.filter(o => o.date.startsWith(y));
        if (rows.length) acc[y] = rows;
        return acc;
    }, {});

    const selectClass = "px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyna-600";

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="cyna-heading text-gray-100">Facturation & Commandes</h2>
                    <p className="text-gray-400 text-sm mt-1">Historique de toutes vos commandes</p>
                </div>
            </div>

            {/* Filtres + recherche */}
            <div className="flex flex-wrap gap-3">
                <input
                    type="text"
                    placeholder="Rechercher par service ou date…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="flex-1 min-w-[200px] px-4 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyna-600"
                />
                <select value={filterYear} onChange={e => setFilterYear(e.target.value)} className={selectClass}>
                    <option value="all">Toutes les années</option>
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
                <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className={selectClass}>
                    <option value="all">Tous les services</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className={selectClass}>
                    <option value="all">Tous les statuts</option>
                    <option value="active">Active</option>
                    <option value="cancelled">Résiliée</option>
                    <option value="renewed">Renouvelée</option>
                </select>
            </div>

            {/* Commandes groupées par année */}
            {Object.keys(byYear).length === 0 ? (
                <div className="text-center py-12 text-gray-500 text-sm bg-zinc-900 rounded-3xl border border-zinc-700">
                    Aucune commande ne correspond à vos filtres.
                </div>
            ) : (
                Object.entries(byYear).map(([year, orders]) => (
                    <div key={year}>
                        <h3 className="text-lg font-bold text-gray-300 mb-3 flex items-center gap-2">
                            <span className="w-px h-5 bg-cyna-600 block" />{year}
                        </h3>
                        <div className="bg-zinc-900 rounded-3xl border border-zinc-700 overflow-hidden">
                            {orders.map((order, i) => (
                                <div key={order.id} className={`flex items-center justify-between p-4 hover:bg-zinc-800 transition-colors ${i !== 0 ? "border-t border-zinc-700/60" : ""}`}>
                                    <div className="flex items-center gap-4 min-w-0">
                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${CATEGORY_COLORS[order.category] ?? "bg-zinc-700 text-gray-300"}`}>
                                            {order.category}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-gray-200 truncate">{order.service}</p>
                                            <p className="text-xs text-gray-500">{order.date} · {order.period}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 flex-shrink-0">
                                        <span className="text-sm font-semibold text-gray-200">{order.amount.toFixed(2)} €</span>
                                        <span className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_CLASS[order.status] ?? STATUS_CLASS.active}`}>
                                            {STATUS_LABEL[order.status] ?? order.status}
                                        </span>
                                        {order.invoicePdfUrl ? (
                                            <a
                                                href={order.invoicePdfUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-cyna-600 hover:underline whitespace-nowrap"
                                            >
                                                Facture PDF
                                            </a>
                                        ) : (
                                            <span className="text-xs text-gray-600 whitespace-nowrap">Facture —</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}

            {/* Méthodes de paiement + prochaine échéance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="bg-zinc-900 rounded-3xl p-6 shadow-sm border border-zinc-700">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="font-bold text-gray-100">Méthodes de paiement</h3>
                        <button className="text-sm text-cyna-600 hover:underline flex items-center gap-1">
                            <Plus size={13} /> Ajouter
                        </button>
                    </div>
                    {payments.length === 0 && <p className="text-sm text-gray-500">Aucune carte enregistrée.</p>}
                    <div className="space-y-3">
                        {payments.map(pm => (
                            <div key={pm.id} className={`flex items-center justify-between p-3 rounded-2xl bg-zinc-800 ${pm.isDefault ? "ring-1 ring-cyna-600/50" : ""}`}>
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-7 bg-zinc-700 rounded-md flex items-center justify-center">
                                        <span className="text-white text-[10px] font-bold">{pm.brand}</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-200">•••• •••• •••• {pm.last4}</p>
                                        <p className="text-xs text-gray-500">Expire {String(pm.expMonth).padStart(2, "0")}/{pm.expYear}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {pm.isDefault ? (
                                        <span className="text-xs text-cyna-500 font-medium flex items-center gap-1"><Star size={10} /> Défaut</span>
                                    ) : (
                                        <button onClick={() => setDefaultPayment(pm.id)} className="text-xs text-gray-400 hover:text-gray-200 transition-colors">Définir par défaut</button>
                                    )}
                                    <button onClick={() => deletePayment(pm.id)} className="p-1.5 rounded-lg hover:bg-red-950/40 text-gray-400 hover:text-red-400 transition-colors">
                                        <Trash2 size={13} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-zinc-900 rounded-3xl p-6 shadow-sm border border-zinc-700">
                    <h3 className="font-bold text-gray-100 mb-3">Prochaine échéance</h3>
                    {nextRenewal ? (
                        <>
                            <p className="text-3xl font-bold text-gray-100">{nextRenewal.amountLine}</p>
                            <p className="text-sm text-gray-500 mt-1">{nextRenewal.dateLine}</p>
                            <div className="mt-4 pt-4 border-t border-zinc-700 text-xs text-gray-500">
                                Inclut {subsCount} abonnement{subsCount > 1 ? "s" : ""} actif{subsCount > 1 ? "s" : ""}
                            </div>
                        </>
                    ) : (
                        <>
                            <p className="text-3xl font-bold text-gray-100">—</p>
                            <p className="text-sm text-gray-500 mt-1">Aucun abonnement actif</p>
                            <div className="mt-4 pt-4 border-t border-zinc-700 text-xs text-gray-500">
                                Ajoutez une solution depuis le catalogue pour voir la prochaine facturation.
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── Composant ─────────────────────────────────────────────────────────────────

export default function AccountDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>("overview");

    // ── Profil utilisateur ──
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);

    // ── Formulaire informations personnelles ──
    const [settingsForm, setSettingsForm] = useState({ firstName: "", lastName: "", email: "" });
    const [settingsSaving, setSettingsSaving] = useState(false);
    const [settingsMsg, setSettingsMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

    // ── Données API (commandes, abonnements, …) ──
    const [billingOrders, setBillingOrders] = useState<BillingOrderRow[]>([]);
    const [apiSubscriptions, setApiSubscriptions] = useState<ApiSubscriptionRow[]>([]);

    // ── Adresses ──
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [addrForm, setAddrForm] = useState<Omit<Address, "id" | "isDefault">>(BLANK_ADDRESS);
    const [editingAddrId, setEditingAddrId] = useState<number | null>(null);
    const [addrFormOpen, setAddrFormOpen] = useState(false);

    // ── Méthodes de paiement ──
    const [payments, setPayments] = useState<PaymentMethod[]>([]);

    // ── Formulaire changement de mot de passe ──
    const [pwOpen, setPwOpen] = useState(false);
    const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
    const [pwSaving, setPwSaving] = useState(false);
    const [pwMsg, setPwMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

    // ── Chargement du profil au montage ──
    useEffect(() => {
        api()
            .get("/users/me")
            .then((res) => {
                const data: UserProfile = res.data;
                setUser(data);
                setSettingsForm({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                });
            })
            .catch(() => {
                // Token expiré ou invalide → retour connexion
                clearAuthToken();
                router.push("/auth/login");
            })
            .finally(() => setIsLoadingUser(false));
    }, [router]);

    useEffect(() => {
        if (!user) return;
        let cancelled = false;
        (async () => {
            try {
                const [or, sub, addr, pm] = await Promise.all([
                    api().get("/orders"),
                    api().get("/subscriptions"),
                    api().get("/addresses"),
                    api().get("/payment-methods"),
                ]);
                if (cancelled) return;
                setBillingOrders(mapOrdersToBillingRows(or.data ?? []));
                setApiSubscriptions((sub.data ?? []) as ApiSubscriptionRow[]);
                setAddresses(
                    (addr.data ?? []).map((a: Address) => ({
                        ...a,
                        country: a.country,
                    }))
                );
                setPayments(
                    (pm.data ?? []).map(
                        (x: {
                            id: number;
                            cardBrand: string;
                            last4Digits: string;
                            expMonth: number;
                            expYear: number;
                            isDefault: boolean;
                        }) => ({
                            id: x.id,
                            brand: (x.cardBrand ?? "CARD").toUpperCase(),
                            last4: x.last4Digits,
                            expMonth: x.expMonth,
                            expYear: x.expYear,
                            isDefault: x.isDefault,
                        })
                    )
                );
            } catch {
                /* données optionnelles */
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [user]);

    const activeSubscriptions = apiSubscriptions.filter((s) => s.status === "ACTIVE");
    const subsPreview = activeSubscriptions.slice(0, 2).map(subscriptionToUi);
    const subsAllUi = apiSubscriptions.map(subscriptionToUi);

    const renewalTs = earliestRenewalTimestamp(activeSubscriptions);
    const billingNextRenewal =
        activeSubscriptions.length === 0
            ? null
            : {
                  amountLine: new Intl.NumberFormat("fr-FR", {
                      style: "currency",
                      currency: "EUR",
                  }).format(sumActiveSubscriptionPrices(activeSubscriptions)),
                  dateLine:
                      renewalTs != null
                          ? `Le ${formatRenewalDayMonth(renewalTs)}`
                          : "Date de renouvellement à confirmer",
              };

    // ── Déconnexion ──
    const handleLogout = () => {
        clearAuthToken();
        try {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        } catch {
            /* ignore */
        }
        router.push("/auth/login");
    };

    // ── Sauvegarde du profil ──
    const handleSaveProfile = async () => {
        setSettingsSaving(true);
        setSettingsMsg(null);
        try {
            const res = await api().patch("/users/me", {
                firstName: settingsForm.firstName.trim(),
                lastName: settingsForm.lastName.trim(),
                email: settingsForm.email.trim().toLowerCase(),
            });
            setUser(res.data);
            setSettingsMsg({ type: "success", text: "Profil mis à jour avec succès." });
        } catch {
            setSettingsMsg({ type: "error", text: "Erreur lors de la mise à jour du profil." });
        } finally {
            setSettingsSaving(false);
        }
    };

    // ── Changement de mot de passe ──
    const handleChangePassword = async () => {
        if (pwForm.newPassword !== pwForm.confirmPassword) {
            setPwMsg({ type: "error", text: "Les nouveaux mots de passe ne correspondent pas." });
            return;
        }
        if (pwForm.newPassword.length < 8) {
            setPwMsg({ type: "error", text: "Le nouveau mot de passe doit contenir au moins 8 caractères." });
            return;
        }
        setPwSaving(true);
        setPwMsg(null);
        try {
            await api().post("/users/me/change-password", {
                currentPassword: pwForm.currentPassword,
                newPassword: pwForm.newPassword,
            });
            setPwMsg({ type: "success", text: "Mot de passe changé avec succès." });
            setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
            setTimeout(() => { setPwOpen(false); setPwMsg(null); }, 2000);
        } catch {
            setPwMsg({ type: "error", text: "Mot de passe actuel incorrect." });
        } finally {
            setPwSaving(false);
        }
    };

    // ── Adresses : helpers ──
    const openNewAddress = () => {
        setAddrForm(BLANK_ADDRESS);
        setEditingAddrId(null);
        setAddrFormOpen(true);
    };
    const openEditAddress = (addr: Address) => {
        const { id, isDefault, ...rest } = addr;
        setAddrForm(rest);
        setEditingAddrId(id);
        setAddrFormOpen(true);
    };
    const saveAddress = () => {
        if (!addrForm.firstName || !addrForm.lastName || !addrForm.addressLine1 || !addrForm.city || !addrForm.postalCode) return;
        if (editingAddrId !== null) {
            setAddresses(prev => prev.map(a => a.id === editingAddrId ? { ...a, ...addrForm } : a));
        } else {
            const newId = Date.now();
            const isFirst = addresses.length === 0;
            setAddresses(prev => [...prev, { id: newId, ...addrForm, isDefault: isFirst }]);
        }
        setAddrFormOpen(false);
    };
    const deleteAddress = (id: number) => setAddresses(prev => prev.filter(a => a.id !== id));
    const setDefaultAddress = (id: number) => setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));

    // ── Paiements : helpers ──
    const deletePayment = async (id: number) => {
        try {
            await api().delete(`/payment-methods/${id}`);
            setPayments((prev) => prev.filter((p) => p.id !== id));
        } catch {
            /* ignore */
        }
    };
    const setDefaultPayment = async (id: number) => {
        try {
            await api().patch(`/payment-methods/${id}/default`);
            setPayments((prev) => prev.map((p) => ({ ...p, isDefault: p.id === id })));
        } catch {
            /* ignore */
        }
    };

    const refreshSubscriptions = async () => {
        try {
            const sub = await api().get("/subscriptions");
            setApiSubscriptions((sub.data ?? []) as ApiSubscriptionRow[]);
        } catch {
            /* ignore */
        }
    };

    const cancelSubscription = async (subscriptionId: number) => {
        try {
            await api().post(`/subscriptions/${subscriptionId}/cancel`, { reason: "Demande utilisateur" });
            await refreshSubscriptions();
        } catch {
            /* ignore */
        }
    };

    // ── Dérivés ──
    const fullName = user ? `${user.firstName} ${user.lastName}` : "…";
    const initiale = user ? user.firstName.charAt(0).toUpperCase() : "…";

    const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
        { id: "overview", label: "Vue d'ensemble", icon: <Activity size={16} /> },
        { id: "subscriptions", label: "Abonnements", icon: <Shield size={16} /> },
        { id: "billing", label: "Facturation", icon: <CreditCard size={16} /> },
        { id: "addresses", label: "Adresses", icon: <MapPin size={16} /> },
        { id: "settings", label: "Paramètres", icon: <Settings size={16} /> },
    ];

    if (isLoadingUser) {
        return (
            <AppLayout>
                <div className="min-h-screen bg-[#09090f] flex items-center justify-center">
                    <div className="text-gray-500 text-sm">Chargement du profil…</div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            {/* Page Header */}
            <div className="bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 bg-cyna-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-violet-950/40 flex-shrink-0">
                                {initiale}
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm mb-0.5">Espace client</p>
                                <h1 className="cyna-heading text-gray-100">
                                    Bonjour, {user?.firstName ?? "…"} 👋
                                </h1>
                                <p className="text-gray-400 text-sm mt-0.5">
                                    {user?.email ?? ""}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link href="/support">
                                <Button variant="outline" size="sm" className="gap-0">
                                    <LifeBuoy size={15} className="mr-2" />
                                    Support
                                </Button>
                            </Link>
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-0"
                                onClick={handleLogout}
                            >
                                <LogOut size={15} className="mr-2" />
                                Déconnexion
                            </Button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex space-x-1 mt-8 border-b border-gray-700">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors -mb-px ${
                                    activeTab === tab.id
                                        ? "bg-zinc-800 text-gray-100"
                                        : "text-gray-400 hover:text-gray-200"
                                }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="bg-[#09090f] min-h-[60vh]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                    {/* ── TAB: VUE D'ENSEMBLE ── */}
                    {activeTab === "overview" && (
                        <div className="space-y-8">
                            {/* Stats row */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                <div className="bg-zinc-900 rounded-3xl p-6 shadow-sm border border-zinc-700">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm font-medium text-gray-500">Abonnements actifs</span>
                                        <div className="w-9 h-9 bg-violet-950/40 rounded-xl flex items-center justify-center">
                                            <Shield size={18} className="text-cyna-600" />
                                        </div>
                                    </div>
                                    <p className="text-4xl font-bold text-gray-100">{activeSubscriptions.length}</p>
                                    <p className="text-xs text-gray-400 mt-1">sur 5 solutions disponibles</p>
                                </div>

                                <div className="bg-zinc-900 rounded-3xl p-6 shadow-sm border border-zinc-700">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm font-medium text-gray-500">Prochaine facturation</span>
                                        <div className="w-9 h-9 bg-purple-950/40 rounded-xl flex items-center justify-center">
                                            <CreditCard size={18} className="text-purple-600" />
                                        </div>
                                    </div>
                                    {activeSubscriptions.length === 0 ? (
                                        <>
                                            <p className="text-4xl font-bold text-gray-100">—</p>
                                            <p className="text-xs text-gray-400 mt-1">Pas de renouvellement prévu</p>
                                        </>
                                    ) : renewalTs != null ? (
                                        <>
                                            <p className="text-4xl font-bold text-gray-100">
                                                {formatRenewalDayMonth(renewalTs)}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {activeSubscriptions.some((s) => s.autoRenew !== false)
                                                    ? "Renouvellement automatique"
                                                    : "Fin de période"}
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-4xl font-bold text-gray-100">—</p>
                                            <p className="text-xs text-gray-400 mt-1">Date à confirmer</p>
                                        </>
                                    )}
                                </div>

                                <div className="bg-black rounded-3xl p-6 shadow-sm text-white">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm font-medium text-gray-400">Score de sécurité</span>
                                        <div className="w-9 h-9 bg-cyna-600/20 rounded-xl flex items-center justify-center">
                                            <Lock size={18} className="text-cyna-500" />
                                        </div>
                                    </div>
                                    <p className="text-4xl font-bold">
                                        92<span className="text-xl text-gray-400 font-normal">/100</span>
                                    </p>
                                    <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
                                        <CheckCircle size={11} /> Excellent — Tous les systèmes opérationnels
                                    </p>
                                </div>
                            </div>

                            {/* Main grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Left: subscriptions + activity */}
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="bg-zinc-900 rounded-3xl p-6 shadow-sm border border-zinc-700">
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="cyna-heading text-gray-100">Mes abonnements</h2>
                                            <button
                                                onClick={() => setActiveTab("subscriptions")}
                                                className="text-sm text-cyna-600 hover:underline flex items-center gap-1"
                                            >
                                                Tout voir <ChevronRight size={14} />
                                            </button>
                                        </div>
                                        <div className="space-y-3">
                                            {subsPreview.map((p) => (
                                                <div key={p.subscriptionId} className="flex items-center justify-between p-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700 transition-colors">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${CATEGORY_COLORS[p.category] ?? "bg-zinc-700 text-gray-300"}`}>
                                                            {CATEGORY_ICONS[p.category] ?? <Shield className="w-5 h-5" />}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-100 text-sm">{p.name}</p>
                                                            <p className="text-xs text-gray-400 line-clamp-1">{p.shortDescription}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right flex-shrink-0">
                                                        <p className="font-semibold text-gray-100 text-sm">
                                                            {p.price}€<span className="text-gray-400 font-normal">/{p.period === "monthly" ? "mois" : "an"}</span>
                                                        </p>
                                                        <span className="inline-flex items-center gap-1 text-[11px] text-green-600 font-medium">
                                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />Actif
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                            {subsPreview.length === 0 && (
                                                <p className="text-sm text-gray-500 text-center py-6">Aucun abonnement actif pour le moment.</p>
                                            )}
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-zinc-700">
                                            <Link href="/catalog">
                                                <Button variant="outline" className="w-full text-sm">Ajouter une solution</Button>
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Activity feed */}
                                    <div className="bg-zinc-900 rounded-3xl p-6 shadow-sm border border-zinc-700">
                                        <h2 className="cyna-heading text-gray-100 mb-6">Activité récente</h2>
                                        <div className="space-y-4">
                                            {MOCK_ACTIVITY.map((event) => (
                                                <div key={event.id} className="flex items-start gap-4">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                                        event.type === "success" ? "bg-green-950/50" : event.type === "warning" ? "bg-yellow-950/50" : "bg-violet-950/50"
                                                    }`}>
                                                        {event.type === "success" ? (
                                                            <CheckCircle size={15} className="text-green-400" />
                                                        ) : event.type === "warning" ? (
                                                            <AlertTriangle size={15} className="text-yellow-400" />
                                                        ) : (
                                                            <Bell size={15} className="text-cyna-500" />
                                                        )}
                                                    </div>
                                                    <div className="flex-grow">
                                                        <p className="text-sm font-medium text-gray-200">{event.label}</p>
                                                        <p className="text-xs text-gray-400">{event.detail}</p>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0">
                                                        <Clock size={11} />{event.time}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Right: account info + quick actions */}
                                <div className="space-y-6">
                                    <div className="bg-zinc-900 rounded-3xl p-6 shadow-sm border border-zinc-700">
                                        <h2 className="cyna-heading text-gray-100 mb-5">Mon compte</h2>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-xs text-gray-500 mb-0.5">Prénom</p>
                                                <p className="text-sm font-medium text-gray-200">{user?.firstName ?? "—"}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-0.5">Nom</p>
                                                <p className="text-sm font-medium text-gray-200">{user?.lastName ?? "—"}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-0.5">Email</p>
                                                <p className="text-sm font-medium text-gray-200">{user?.email ?? "—"}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-0.5">Rôle</p>
                                                <p className="text-sm font-medium text-gray-200 capitalize">{user?.role?.toLowerCase() ?? "—"}</p>
                                            </div>
                                        </div>
                                        <div className="mt-5 pt-5 border-t border-zinc-700">
                                            <button
                                                onClick={() => setActiveTab("settings")}
                                                className="w-full flex items-center justify-between text-sm text-gray-400 hover:text-gray-200 transition-colors"
                                            >
                                                <span>Modifier le profil</span>
                                                <ChevronRight size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="bg-zinc-900 rounded-3xl p-6 shadow-sm border border-zinc-700">
                                        <h2 className="cyna-heading text-gray-100 mb-5">Actions rapides</h2>
                                        <div className="space-y-2">
                                            {[
                                                { icon: <Shield size={16} className="text-cyna-500" />, label: "Gérer mes abonnements", action: () => setActiveTab("subscriptions") },
                                                { icon: <CreditCard size={16} className="text-purple-400" />, label: "Historique de facturation", action: () => setActiveTab("billing") },
                                                { icon: <LifeBuoy size={16} className="text-green-400" />, label: "Contacter le support", href: "/support" },
                                                { icon: <Activity size={16} className="text-orange-400" />, label: "Explorer les solutions", href: "/catalog" },
                                            ].map((item, i) =>
                                                item.href ? (
                                                    <Link key={i} href={item.href} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-zinc-800 transition-colors group">
                                                        <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">{item.icon}</div>
                                                        <span className="text-sm text-gray-300 group-hover:text-gray-100 flex-grow">{item.label}</span>
                                                        <ChevronRight size={14} className="text-gray-500" />
                                                    </Link>
                                                ) : (
                                                    <button key={i} onClick={item.action} className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-zinc-800 transition-colors group">
                                                        <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">{item.icon}</div>
                                                        <span className="text-sm text-gray-300 group-hover:text-gray-100 flex-grow text-left">{item.label}</span>
                                                        <ChevronRight size={14} className="text-gray-500" />
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── TAB: ABONNEMENTS ── */}
                    {activeTab === "subscriptions" && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="cyna-heading text-gray-100">Mes abonnements</h2>
                                    <p className="text-gray-400 text-sm mt-1">{activeSubscriptions.length} abonnement(s) actif(s)</p>
                                </div>
                                <Link href="/catalog">
                                    <Button variant="primary">Ajouter une solution</Button>
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {subsAllUi.map((p) => (
                                    <div key={p.subscriptionId} className="bg-zinc-900 rounded-3xl p-6 shadow-sm border border-zinc-700 hover:shadow-lg transition-all duration-300">
                                        <div className="flex items-start justify-between mb-5">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${CATEGORY_COLORS[p.category] ?? "bg-zinc-700 text-gray-300"}`}>
                                                    {CATEGORY_ICONS[p.category] ?? <Shield className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-100">{p.name}</h3>
                                                    <span className="text-xs font-medium text-gray-400">{p.category} · {p.planLabel}</span>
                                                </div>
                                            </div>
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                p.status === "ACTIVE" ? "bg-green-950/40 text-green-400" : "bg-zinc-800 text-gray-400"
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${p.status === "ACTIVE" ? "bg-green-500" : "bg-gray-500"}`} />
                                                {p.status === "ACTIVE" ? "Actif" : p.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 mb-5 leading-relaxed">{p.shortDescription || "—"}</p>
                                        <div className="pt-5 border-t border-zinc-700 flex items-center justify-between gap-3 flex-wrap">
                                            <div>
                                                <span className="text-xl font-bold text-gray-100">{p.price}€</span>
                                                <span className="text-gray-500 text-sm"> / {p.period === "monthly" ? "mois" : "an"}</span>
                                            </div>
                                            {p.status === "ACTIVE" && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-xs"
                                                    type="button"
                                                    onClick={() => cancelSubscription(p.subscriptionId)}
                                                >
                                                    Résilier fin de période
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {subsAllUi.length === 0 && (
                                    <p className="text-gray-500 text-sm col-span-2 text-center py-12">Aucun abonnement.</p>
                                )}
                            </div>
                            <div className="bg-gradient-to-br from-violet-950/20 to-purple-950/20 rounded-3xl p-6 border border-violet-900/40">
                                <h3 className="font-bold text-gray-100 mb-1">Complétez votre protection</h3>
                                <p className="text-sm text-gray-400 mb-4">3 solutions supplémentaires sont disponibles pour renforcer votre sécurité.</p>
                                <Link href="/catalog">
                                    <Button variant="primary" size="sm">Explorer le catalogue</Button>
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* ── TAB: FACTURATION ── */}
                    {activeTab === "billing" && (
                        <BillingTab
                            orders={billingOrders}
                            payments={payments}
                            setDefaultPayment={setDefaultPayment}
                            deletePayment={deletePayment}
                            subsCount={activeSubscriptions.length}
                            nextRenewal={billingNextRenewal}
                        />
                    )}

                    {/* ── TAB: ADRESSES ── */}
                    {activeTab === "addresses" && (
                        <div className="max-w-2xl space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="cyna-heading text-gray-100">Carnet d'adresses</h2>
                                    <p className="text-gray-400 text-sm mt-1">Adresses de facturation enregistrées</p>
                                </div>
                                <Button variant="primary" onClick={openNewAddress} className="gap-2">
                                    <Plus size={15} /> Ajouter
                                </Button>
                            </div>

                            {/* Liste des adresses */}
                            <div className="space-y-4">
                                {addresses.length === 0 && (
                                    <div className="text-center py-12 text-gray-500 text-sm bg-zinc-900 rounded-3xl border border-zinc-700">
                                        Aucune adresse enregistrée.
                                    </div>
                                )}
                                {addresses.map(addr => (
                                    <div key={addr.id} className={`bg-zinc-900 rounded-3xl p-5 border ${addr.isDefault ? "border-cyna-600/60" : "border-zinc-700"}`}>
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-start gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-violet-950/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <MapPin size={16} className="text-cyna-500" />
                                                </div>
                                                <div className="text-sm text-gray-300 leading-relaxed">
                                                    <p className="font-semibold text-gray-100">{addr.firstName} {addr.lastName}</p>
                                                    <p>{addr.addressLine1}</p>
                                                    {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                                                    <p>{addr.postalCode} {addr.city}{addr.region ? `, ${addr.region}` : ""}</p>
                                                    <p>{addr.country}</p>
                                                    {addr.phone && <p className="text-gray-400">{addr.phone}</p>}
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                                {addr.isDefault && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyna-600/20 text-cyna-500 text-xs font-medium">
                                                        <Star size={10} /> Par défaut
                                                    </span>
                                                )}
                                                <div className="flex items-center gap-2 mt-1">
                                                    {!addr.isDefault && (
                                                        <button onClick={() => setDefaultAddress(addr.id)} className="text-xs text-gray-400 hover:text-gray-200 transition-colors">
                                                            Définir par défaut
                                                        </button>
                                                    )}
                                                    <button onClick={() => openEditAddress(addr)} className="p-1.5 rounded-lg hover:bg-zinc-700 text-gray-400 hover:text-gray-200 transition-colors">
                                                        <Pencil size={14} />
                                                    </button>
                                                    <button onClick={() => deleteAddress(addr.id)} className="p-1.5 rounded-lg hover:bg-red-950/40 text-gray-400 hover:text-red-400 transition-colors">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Formulaire ajout / édition */}
                            {addrFormOpen && (
                                <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-600 shadow-lg">
                                    <div className="flex items-center justify-between mb-5">
                                        <h3 className="font-bold text-gray-100">{editingAddrId ? "Modifier l'adresse" : "Nouvelle adresse"}</h3>
                                        <button onClick={() => setAddrFormOpen(false)} className="text-gray-400 hover:text-gray-200">
                                            <X size={18} />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        {([
                                            { key: "firstName", label: "Prénom", col: 1 },
                                            { key: "lastName", label: "Nom", col: 1 },
                                            { key: "addressLine1", label: "Adresse (rue, numéro)", col: 2 },
                                            { key: "addressLine2", label: "Complément (optionnel)", col: 2 },
                                            { key: "city", label: "Ville", col: 1 },
                                            { key: "postalCode", label: "Code postal", col: 1 },
                                            { key: "region", label: "Région / Département", col: 2 },
                                            { key: "country", label: "Pays", col: 2 },
                                            { key: "phone", label: "Téléphone mobile", col: 2 },
                                        ] as { key: keyof typeof addrForm; label: string; col: 1 | 2 }[]).map(({ key, label, col }) => (
                                            <div key={key} className={col === 2 ? "col-span-2" : ""}>
                                                <label className="block text-xs font-medium text-gray-400 mb-1">{label}</label>
                                                <input
                                                    type="text"
                                                    value={addrForm[key] ?? ""}
                                                    onChange={e => setAddrForm(p => ({ ...p, [key]: e.target.value }))}
                                                    className="w-full p-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyna-600"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex gap-3 mt-5">
                                        <Button variant="primary" onClick={saveAddress} className="gap-1">
                                            {editingAddrId ? "Enregistrer" : "Ajouter l'adresse"}
                                        </Button>
                                        <Button variant="outline" onClick={() => setAddrFormOpen(false)}>
                                            Annuler
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Méthodes de paiement */}
                            <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-700">
                                <div className="flex items-center justify-between mb-5">
                                    <h3 className="font-bold text-gray-100">Méthodes de paiement</h3>
                                    <button className="text-sm text-cyna-600 hover:underline flex items-center gap-1">
                                        <Plus size={14} /> Ajouter une carte
                                    </button>
                                </div>
                                {payments.length === 0 && (
                                    <p className="text-sm text-gray-500">Aucune méthode de paiement enregistrée.</p>
                                )}
                                <div className="space-y-3">
                                    {payments.map(pm => (
                                        <div key={pm.id} className={`flex items-center justify-between p-3 rounded-2xl bg-zinc-800 ${pm.isDefault ? "ring-1 ring-cyna-600/50" : ""}`}>
                                            <div className="flex items-center gap-3">
                                                <div className="w-11 h-7 bg-zinc-700 rounded-md flex items-center justify-center">
                                                    <span className="text-white text-[10px] font-bold">{pm.brand}</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-200">•••• •••• •••• {pm.last4}</p>
                                                    <p className="text-xs text-gray-500">Expire {String(pm.expMonth).padStart(2, "0")}/{pm.expYear}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {pm.isDefault ? (
                                                    <span className="text-xs text-cyna-500 font-medium flex items-center gap-1">
                                                        <Star size={10} /> Défaut
                                                    </span>
                                                ) : (
                                                    <button onClick={() => setDefaultPayment(pm.id)} className="text-xs text-gray-400 hover:text-gray-200 transition-colors">
                                                        Définir par défaut
                                                    </button>
                                                )}
                                                <button onClick={() => deletePayment(pm.id)} className="p-1.5 rounded-lg hover:bg-red-950/40 text-gray-400 hover:text-red-400 transition-colors">
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── TAB: PARAMÈTRES ── */}
                    {activeTab === "settings" && (
                        <div className="max-w-2xl space-y-6">
                            <div>
                                <h2 className="cyna-heading text-gray-100">Paramètres du compte</h2>
                                <p className="text-gray-400 text-sm mt-1">Gérez vos informations personnelles et préférences</p>
                            </div>

                            {/* Informations personnelles */}
                            <div className="bg-zinc-900 rounded-3xl p-6 shadow-sm border border-zinc-700">
                                <h3 className="font-bold text-gray-100 mb-5">Informations personnelles</h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1">Prénom</label>
                                            <input
                                                type="text"
                                                value={settingsForm.firstName}
                                                onChange={(e) => setSettingsForm((p) => ({ ...p, firstName: e.target.value }))}
                                                className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-700 text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyna-600 transition"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1">Nom</label>
                                            <input
                                                type="text"
                                                value={settingsForm.lastName}
                                                onChange={(e) => setSettingsForm((p) => ({ ...p, lastName: e.target.value }))}
                                                className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-700 text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyna-600 transition"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                                        <input
                                            type="email"
                                            value={settingsForm.email}
                                            onChange={(e) => setSettingsForm((p) => ({ ...p, email: e.target.value }))}
                                            className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-700 text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyna-600 transition"
                                        />
                                    </div>
                                </div>

                                {settingsMsg && (
                                    <div className={`mt-4 px-4 py-3 rounded-xl text-sm ${
                                        settingsMsg.type === "success"
                                            ? "bg-green-950/40 text-green-400 border border-green-800"
                                            : "bg-red-950/40 text-red-400 border border-red-800"
                                    }`}>
                                        {settingsMsg.text}
                                    </div>
                                )}

                                <div className="mt-5">
                                    <Button
                                        variant="primary"
                                        onClick={handleSaveProfile}
                                        disabled={settingsSaving}
                                    >
                                        {settingsSaving ? "Sauvegarde…" : "Sauvegarder les modifications"}
                                    </Button>
                                </div>
                            </div>

                            {/* Sécurité */}
                            <div className="bg-zinc-900 rounded-3xl p-6 shadow-sm border border-zinc-700">
                                <h3 className="font-bold text-gray-100 mb-5">Sécurité</h3>
                                <div className="space-y-3">
                                    {/* Changer le mot de passe — expandable */}
                                    <div className="rounded-2xl bg-zinc-800 overflow-hidden">
                                        <button
                                            onClick={() => { setPwOpen((v) => !v); setPwMsg(null); }}
                                            className="w-full flex items-center justify-between p-4 hover:bg-zinc-700 transition-colors text-left"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-zinc-700 rounded-lg flex items-center justify-center shadow-sm">
                                                    <Lock size={16} className="text-gray-500" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-200">Changer le mot de passe</p>
                                                    <p className="text-xs text-gray-400">Sécurisez votre compte avec un nouveau mot de passe</p>
                                                </div>
                                            </div>
                                            <ChevronRight size={16} className={`text-gray-400 transition-transform ${pwOpen ? "rotate-90" : ""}`} />
                                        </button>

                                        {pwOpen && (
                                            <div className="px-4 pb-4 space-y-3 border-t border-zinc-700 pt-4">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-400 mb-1">Mot de passe actuel</label>
                                                    <input
                                                        type="password"
                                                        value={pwForm.currentPassword}
                                                        onChange={(e) => setPwForm((p) => ({ ...p, currentPassword: e.target.value }))}
                                                        className="w-full p-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyna-600"
                                                        placeholder="••••••••"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-400 mb-1">Nouveau mot de passe</label>
                                                    <input
                                                        type="password"
                                                        value={pwForm.newPassword}
                                                        onChange={(e) => setPwForm((p) => ({ ...p, newPassword: e.target.value }))}
                                                        className="w-full p-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyna-600"
                                                        placeholder="Minimum 8 caractères"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-400 mb-1">Confirmer le nouveau mot de passe</label>
                                                    <input
                                                        type="password"
                                                        value={pwForm.confirmPassword}
                                                        onChange={(e) => setPwForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                                                        className="w-full p-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyna-600"
                                                        placeholder="••••••••"
                                                    />
                                                </div>
                                                {pwMsg && (
                                                    <div className={`px-3 py-2 rounded-lg text-xs ${
                                                        pwMsg.type === "success"
                                                            ? "bg-green-950/40 text-green-400"
                                                            : "bg-red-950/40 text-red-400"
                                                    }`}>
                                                        {pwMsg.text}
                                                    </div>
                                                )}
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    onClick={handleChangePassword}
                                                    disabled={pwSaving}
                                                >
                                                    {pwSaving ? "Modification…" : "Modifier le mot de passe"}
                                                </Button>
                                            </div>
                                        )}
                                    </div>

                                    <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700 transition-colors text-left">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-zinc-700 rounded-lg flex items-center justify-center shadow-sm">
                                                <Shield size={16} className="text-gray-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-200">Authentification à deux facteurs</p>
                                                <p className="text-xs text-gray-400">Non activée — recommandée</p>
                                            </div>
                                        </div>
                                        <ChevronRight size={16} className="text-gray-400" />
                                    </button>
                                    <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700 transition-colors text-left">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-zinc-700 rounded-lg flex items-center justify-center shadow-sm">
                                                <Activity size={16} className="text-gray-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-200">Sessions actives</p>
                                                <p className="text-xs text-gray-400">1 session active</p>
                                            </div>
                                        </div>
                                        <ChevronRight size={16} className="text-gray-400" />
                                    </button>
                                </div>
                            </div>

                            {/* Zone de danger */}
                            <div className="bg-zinc-900 rounded-3xl p-6 shadow-sm border border-red-900/50">
                                <h3 className="font-bold text-red-500 mb-2">Zone de danger</h3>
                                <p className="text-sm text-gray-400 mb-4">
                                    La suppression de votre compte est irréversible et annule tous vos abonnements.
                                </p>
                                <Button variant="outline" size="sm" className="text-red-500 border-red-800 hover:bg-red-950/40">
                                    Supprimer mon compte
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
