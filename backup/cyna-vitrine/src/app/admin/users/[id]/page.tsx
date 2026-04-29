"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    Card,
    ErrorBanner,
    Loader,
    StatusBadge,
    TBody,
    TD,
    TH,
    THead,
    TR,
    Table,
    formatDate,
    formatEUR,
    inputClass,
    labelClass,
} from "@/components/admin/AdminUI";
import {
    adminApi,
    type AdminInvoice,
    type AdminOrder,
    type AdminSubscription,
    type AdminUser,
} from "@/lib/adminApi";
import { ArrowLeft, Save, Trash2 } from "lucide-react";

export default function AdminUserDetailPage() {
    const params = useParams<{ id: string }>();
    const userId = Number(params.id);
    const router = useRouter();

    const [user, setUser] = useState<AdminUser | null>(null);
    const [orders, setOrders] = useState<AdminOrder[]>([]);
    const [subs, setSubs] = useState<AdminSubscription[]>([]);
    const [invoices, setInvoices] = useState<AdminInvoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const [u, o, s, i] = await Promise.all([
                    adminApi.users.get(userId),
                    adminApi.orders.list(),
                    adminApi.subscriptions.list(),
                    adminApi.invoices.list(),
                ]);
                setUser(u);
                setOrders(o.filter((x) => x.userId === userId));
                setSubs(s.filter((x) => x.userId === userId));
                setInvoices(i.filter((x) => x.userId === userId));
            } catch (e) {
                setError((e as Error).message);
            } finally {
                setLoading(false);
            }
        })();
    }, [userId]);

    const stats = useMemo(() => {
        const totalSpent = orders
            .filter((o) => o.status === "PAID" || o.status === "ACTIVE")
            .reduce((acc, o) => acc + Number(o.totalAmount ?? 0), 0);
        return {
            totalSpent,
            activeSubs: subs.filter((s) => s.status === "ACTIVE").length,
        };
    }, [orders, subs]);

    async function handleSave() {
        if (!user) return;
        setSaving(true);
        setError("");
        try {
            const updated = await adminApi.users.update(user.id, {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            });
            setUser(updated);
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setSaving(false);
        }
    }

    async function handleToggleRole() {
        if (!user) return;
        const nextRole = user.role === "ADMIN" ? "USER" : "ADMIN";
        if (!confirm(`Passer cet utilisateur en ${nextRole} ?`)) return;
        try {
            const updated = await adminApi.users.update(user.id, { role: nextRole });
            setUser(updated);
        } catch (e) {
            setError((e as Error).message);
        }
    }

    async function handleDelete() {
        if (!user) return;
        if (!confirm(`Supprimer définitivement ${user.firstName} ${user.lastName} ? Cette action est irréversible.`)) return;
        try {
            await adminApi.users.remove(user.id);
            router.push("/admin/users");
        } catch (e) {
            setError((e as Error).message);
        }
    }

    if (loading) return <Loader />;
    if (!user) return <ErrorBanner message="Utilisateur introuvable." />;

    return (
        <div className="space-y-6">
            <div>
                <Link
                    href="/admin/users"
                    className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white"
                >
                    <ArrowLeft className="h-4 w-4" /> Retour
                </Link>
            </div>

            <header className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-white">
                        {user.firstName} {user.lastName}
                    </h1>
                    <p className="text-sm text-white/60">
                        {user.email} · <StatusBadge status={user.role} />
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleToggleRole}
                        className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-white hover:bg-white/10"
                    >
                        {user.role === "ADMIN" ? "Rétrograder en USER" : "Promouvoir ADMIN"}
                    </button>
                    <button
                        onClick={handleDelete}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm font-medium text-rose-200 hover:bg-rose-500/20"
                    >
                        <Trash2 className="h-4 w-4" /> Supprimer
                    </button>
                </div>
            </header>

            {error && <ErrorBanner message={error} />}

            {/* KPI user */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <InfoTile label="Total dépensé" value={formatEUR(stats.totalSpent)} />
                <InfoTile label="Abonnements actifs" value={stats.activeSubs} />
                <InfoTile label="Commandes" value={orders.length} />
                <InfoTile label="Factures" value={invoices.length} />
            </div>

            {/* Infos profil */}
            <Card title="Informations de compte">
                <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                        label="Prénom"
                        value={user.firstName}
                        onChange={(v) => setUser({ ...user, firstName: v })}
                    />
                    <Field
                        label="Nom"
                        value={user.lastName}
                        onChange={(v) => setUser({ ...user, lastName: v })}
                    />
                    <Field
                        label="Email"
                        value={user.email}
                        onChange={(v) => setUser({ ...user, email: v })}
                    />
                    <div>
                        <p className={labelClass}>Statut compte</p>
                        <div className="flex gap-2 items-center text-sm">
                            <span className="text-white/70">Email vérifié :</span>
                            <span className={user.emailVerified ? "text-emerald-300" : "text-amber-300"}>
                                {user.emailVerified ? "Oui" : "Non"}
                            </span>
                            <span className="mx-2 text-white/30">|</span>
                            <span className="text-white/70">2FA :</span>
                            <span className={user.twoFactorEnabled ? "text-emerald-300" : "text-white/50"}>
                                {user.twoFactorEnabled ? "Activée" : "Désactivée"}
                            </span>
                        </div>
                        <p className="mt-3 text-xs text-white/50">
                            Créé le {formatDate(user.createdAt, true)}
                        </p>
                    </div>
                </div>
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#600bd1] px-4 py-2 text-sm font-semibold text-white hover:bg-[#7a2de8] disabled:opacity-50"
                    >
                        <Save className="h-4 w-4" /> {saving ? "Enregistrement…" : "Enregistrer"}
                    </button>
                </div>
            </Card>

            {/* Abonnements */}
            <Card title="Abonnements">
                <Table>
                    <THead>
                        <TR>
                            <TH>#</TH>
                            <TH>Produit</TH>
                            <TH>Plan</TH>
                            <TH>Statut</TH>
                            <TH>Début</TH>
                            <TH>Fin</TH>
                            <TH>Prix</TH>
                        </TR>
                    </THead>
                    <TBody>
                        {subs.map((s) => (
                            <TR key={s.id}>
                                <TD>#{s.id}</TD>
                                <TD className="font-medium">{s.product?.name ?? `#${s.productId}`}</TD>
                                <TD>{s.subscriptionPlan?.label ?? "—"}</TD>
                                <TD>
                                    <StatusBadge status={s.status} />
                                </TD>
                                <TD>{formatDate(s.startDate)}</TD>
                                <TD>{formatDate(s.endDate)}</TD>
                                <TD>{formatEUR(s.subscriptionPlan?.price ?? 0)}</TD>
                            </TR>
                        ))}
                    </TBody>
                </Table>
                {subs.length === 0 && <p className="py-8 text-center text-white/50">Aucun abonnement.</p>}
            </Card>

            {/* Commandes */}
            <Card title="Commandes">
                <Table>
                    <THead>
                        <TR>
                            <TH>N°</TH>
                            <TH>Date</TH>
                            <TH>Statut</TH>
                            <TH>Produits</TH>
                            <TH>Montant</TH>
                        </TR>
                    </THead>
                    <TBody>
                        {orders.map((o) => (
                            <TR key={o.id}>
                                <TD className="font-mono text-xs text-white/80">{o.orderNumber}</TD>
                                <TD>{formatDate(o.createdAt, true)}</TD>
                                <TD>
                                    <StatusBadge status={o.status} />
                                </TD>
                                <TD className="text-white/70">
                                    {o.items?.length ?? 0} produit(s)
                                </TD>
                                <TD className="font-semibold">{formatEUR(o.totalAmount)}</TD>
                            </TR>
                        ))}
                    </TBody>
                </Table>
                {orders.length === 0 && <p className="py-8 text-center text-white/50">Aucune commande.</p>}
            </Card>

            {/* Factures */}
            <Card title="Factures">
                <Table>
                    <THead>
                        <TR>
                            <TH>N° facture</TH>
                            <TH>Commande</TH>
                            <TH>Date</TH>
                            <TH>Montant</TH>
                            <TH>PDF</TH>
                        </TR>
                    </THead>
                    <TBody>
                        {invoices.map((inv) => (
                            <TR key={inv.id}>
                                <TD className="font-mono text-xs">{inv.invoiceNumber}</TD>
                                <TD className="text-white/70 font-mono text-xs">
                                    {inv.order?.orderNumber ?? `#${inv.orderId}`}
                                </TD>
                                <TD>{formatDate(inv.issuedAt)}</TD>
                                <TD className="font-semibold">{formatEUR(inv.amount)}</TD>
                                <TD>
                                    {inv.pdfUrl ? (
                                        <a
                                            href={inv.pdfUrl}
                                            target="_blank"
                                            className="text-[#c9a8ff] hover:underline"
                                        >
                                            Télécharger
                                        </a>
                                    ) : (
                                        <span className="text-white/40">—</span>
                                    )}
                                </TD>
                            </TR>
                        ))}
                    </TBody>
                </Table>
                {invoices.length === 0 && <p className="py-8 text-center text-white/50">Aucune facture.</p>}
            </Card>
        </div>
    );
}

function InfoTile({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs uppercase tracking-wide text-white/60">{label}</p>
            <p className="mt-1 text-xl font-semibold text-white">{value}</p>
        </div>
    );
}

function Field({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
}) {
    return (
        <div>
            <label className={labelClass}>{label}</label>
            <input className={inputClass} value={value} onChange={(e) => onChange(e.target.value)} />
        </div>
    );
}
