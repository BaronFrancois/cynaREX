'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Check, Lock, ShieldCheck, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import AppLayout from '@/layout/AppLayout';
import useCart from '@/hooks/useCart';
import api from '@/lib/api';
import { getAuthToken } from '@/lib/authCookie';
import { cn } from '@/lib/utils';
import { cartHasUnavailableItem } from '@/lib/cartAvailability';
import { useI18n } from '@/context/I18nContext';

const STRIPE_PUBLISHABLE_KEY =
    process.env.NEXT_PUBLIC_STRIPE_KEY ??
    'pk_test_51TEqsf6NG07rbbnhYwsILXh0ifO76MK7gULNhoeM5kQ3f0S03XvypIiSIHKGkmG6vwtPEhA3eF1RYtMUqZOzoa8O00KQUYsy7P';

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const COUNTRY_LABELS_FR: Record<string, string> = {
    FR: 'France',
    BE: 'Belgique',
    CH: 'Suisse',
    LU: 'Luxembourg',
};
const COUNTRY_LABELS_EN: Record<string, string> = {
    FR: 'France',
    BE: 'Belgium',
    CH: 'Switzerland',
    LU: 'Luxembourg',
};

// ─── Décodage JWT ────────────────────────────────────────────────────────────

function decodeToken(token: string): { sub: number; email: string; role: string } | null {
    try {
        const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
        return payload;
    } catch {
        return null;
    }
}

function getToken(): string | null {
    if (typeof document === 'undefined') return null;
    return getAuthToken() ?? null;
}

// ─── Indicateur d'étapes ─────────────────────────────────────────────────────

function StepIndicator({ num, title, current }: { num: number; title: string; current: number }) {
    const done = current > num;
    const active = current === num;
    return (
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${active ? 'bg-zinc-100 text-zinc-900' : done ? 'bg-green-950/40 text-green-400' : 'text-gray-500'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${active ? 'bg-zinc-900 text-white border-zinc-700' : done ? 'bg-green-500 border-green-500 text-white' : 'border-zinc-600'}`}>
                {done ? <Check size={12} /> : num}
            </div>
            <span className={`text-sm ${active ? 'font-bold' : 'font-medium'}`}>{title}</span>
        </div>
    );
}

// ─── Récapitulatif panier ────────────────────────────────────────────────────

function CartSummary() {
    const { t } = useI18n();
    const { items, total } = useCart();
    if (items.length === 0) return null;
    return (
        <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-700">
            <h3 className="font-semibold text-gray-200 mb-4 text-sm">{t('checkout.summary.title')}</h3>
            <div className="space-y-3">
                {items.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                        <div>
                            <p className="font-medium text-gray-200">{item.name}</p>
                            <p className="text-xs text-gray-500">
                                {item.period === 'monthly' ? t('checkout.summary.monthly') : t('checkout.summary.yearly')} × {item.quantity}
                            </p>
                        </div>
                        <span className="font-semibold text-gray-200">{(item.price * item.quantity).toFixed(2)} €</span>
                    </div>
                ))}
            </div>
            <div className="mt-4 pt-4 border-t border-zinc-700 space-y-1">
                <div className="flex justify-between text-sm text-gray-400">
                    <span>{t('checkout.summary.subtotal')}</span><span>{total.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                    <span>{t('checkout.summary.vat')}</span><span>{(total * 0.2).toFixed(2)} €</span>
                </div>
                <div className="flex justify-between font-bold text-gray-100 text-base pt-2">
                    <span>{t('checkout.summary.total')}</span><span>{(total * 1.2).toFixed(2)} €</span>
                </div>
            </div>
        </div>
    );
}

// ─── Formulaire Stripe (PaymentElement : Carte + PayPal + autres) ────────────

function PaymentForm({
    orderId,
    onSuccess,
}: {
    orderId: number;
    onSuccess: (orderId: number) => void;
}) {
    const { t } = useI18n();
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { clearCart } = useCart();

    const handlePay = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);
        setError('');

        try {
            // Confirme le PaymentIntent directement depuis le front — Stripe gère ici
            // CB, PayPal (redirection), 3D Secure, etc. de manière unifiée.
            const returnUrl = `${window.location.origin}/checkout/return?orderId=${orderId}`;
            const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: returnUrl,
                },
                redirect: 'if_required',
            });

            if (stripeError) {
                setError(stripeError.message ?? 'Erreur lors du paiement');
                setLoading(false);
                return;
            }

            // Pas de redirection nécessaire (CB sans 3DS) → succès immédiat
            if (paymentIntent?.status === 'succeeded') {
                onSuccess(orderId);
                await api().delete('/cart').catch(() => {});
                clearCart();
                return;
            }

            // Autres statuts (processing, requires_action résolu, etc.) → on laisse
            // le webhook finaliser et on redirige l'utilisateur vers la page de retour
            window.location.href = returnUrl;
        } catch (err: any) {
            setError(err.message ?? 'Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handlePay} className="space-y-6">
            <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-700">
                <PaymentElement
                    options={{
                        layout: 'tabs',
                        wallets: { googlePay: 'never', applePay: 'never' },
                    }}
                />
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">{error}</div>
            )}

            <Button
                type="submit"
                variant="primary"
                disabled={loading || !stripe || !elements}
                className="w-full gap-2"
            >
                <Lock size={16} />
                {loading ? t('checkout.pay.processing') : t('checkout.pay.now')}
            </Button>

            <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1.5">
                <ShieldCheck size={13} /> {t('checkout.pay.stripeNote')}
            </p>
        </form>
    );
}

// Wrapper : monte <Elements> avec le clientSecret reçu du backend
function PaymentFormWithElements({
    clientSecret,
    orderId,
    onSuccess,
}: {
    clientSecret: string;
    orderId: number;
    onSuccess: (orderId: number) => void;
}) {
    return (
        <Elements
            stripe={stripePromise}
            options={{
                clientSecret,
                appearance: {
                    theme: 'night',
                    variables: {
                        colorPrimary: '#7c3aed',
                        colorBackground: '#18181b',
                        colorText: '#f0f0f8',
                        colorTextPlaceholder: '#6b7280',
                        colorDanger: '#ef4444',
                        fontFamily: 'inherit',
                        borderRadius: '12px',
                    },
                    rules: {
                        '.Tab': { backgroundColor: '#27272a', borderColor: '#3f3f46' },
                        '.Tab--selected': { borderColor: '#7c3aed' },
                        '.Input': { backgroundColor: '#27272a', borderColor: '#3f3f46' },
                    },
                },
            }}
        >
            <PaymentForm orderId={orderId} onSuccess={onSuccess} />
        </Elements>
    );
}

// ─── Page principale ──────────────────────────────────────────────────────────

function CheckoutInner() {
    const { t, locale } = useI18n();
    const countryLabels = locale === 'en' ? COUNTRY_LABELS_EN : COUNTRY_LABELS_FR;
    const router = useRouter();
    const searchParams = useSearchParams();
    const isGuest = searchParams.get('guest') === 'true';
    const { items, isLoaded } = useCart();
    const showCartRecap = items.length > 0;

    // Invités : démarrer directement à l'étape facturation
    const [step, setStep] = useState(isGuest ? 2 : 1);
    const [userId, setUserId] = useState<number | null>(null);
    const [cartId, setCartId] = useState<number | null>(null);
    const [addressId, setAddressId] = useState<number | null>(null);
    const [orderDone, setOrderDone] = useState<number | null>(null);

    // Flow PaymentElement : clientSecret + orderId créés à l'étape 3
    // Cette case sert aux deux usages : marquer l'adresse comme adresse par défaut
    // du compte ET autoriser Stripe à mémoriser le moyen de paiement.
    const [saveForNextTime, setSaveForNextTime] = useState(true);
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [serverOrderId, setServerOrderId] = useState<number | null>(null);
    const [paymentIntentLoading, setPaymentIntentLoading] = useState(false);
    const [paymentIntentError, setPaymentIntentError] = useState('');

    const [billing, setBilling] = useState({
        firstName: '', lastName: '', addressLine1: '', addressLine2: '', city: '', region: '', postalCode: '', country: 'FR', phone: '',
    });
    const [billingError, setBillingError] = useState('');

    // Adresse par défaut du compte (pour la case à cocher "Utiliser mon adresse")
    const [savedAddress, setSavedAddress] = useState<{
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
    } | null>(null);
    const [useSavedAddress, setUseSavedAddress] = useState(false);

    /** Panier vide : pas de tunnel de commande (sauf écran de confirmation déjà affiché) */
    useEffect(() => {
        if (!isLoaded) return;
        if (orderDone != null) return;
        if (items.length === 0) {
            router.replace('/cart');
            return;
        }
        if (cartHasUnavailableItem(items)) {
            router.replace('/cart');
        }
    }, [isLoaded, items, router, orderDone]);

    // ─── Initialisation : token + pré-remplissage + sync panier ─────────────
    useEffect(() => {
        if (!isLoaded) return;

        const token = getToken();
        if (!token) return;

        const payload = decodeToken(token);
        if (!payload) return;

        setUserId(payload.sub);
        setStep(2);

        (async () => {
            try {
                // 1. Récupérer l'adresse par défaut (sans pré-remplir : on la stocke juste pour
                //    proposer à l'utilisateur de la réutiliser via une case à cocher)
                const addrRes = await api().get('/addresses').catch(() => ({ data: [] }));
                const addrList = Array.isArray(addrRes.data) ? addrRes.data : [];
                const defaultAddr = addrList.find((a: any) => a.isDefault) ?? addrList[0];

                if (defaultAddr?.id) {
                    setSavedAddress({
                        id: defaultAddr.id,
                        firstName: defaultAddr.firstName ?? '',
                        lastName: defaultAddr.lastName ?? '',
                        addressLine1: defaultAddr.addressLine1 ?? '',
                        addressLine2: defaultAddr.addressLine2 ?? '',
                        city: defaultAddr.city ?? '',
                        region: defaultAddr.region ?? '',
                        postalCode: defaultAddr.postalCode ?? '',
                        country: defaultAddr.country ?? 'FR',
                        phone: defaultAddr.phone ?? '',
                    });
                }

                // 2. Synchroniser le panier localStorage → serveur
                //    (2a) vider le cart serveur pour éviter les doublons
                await api().delete('/cart').catch(() => {});

                //    (2b) récupérer le mapping slug → productId + plans
                const prodRes = await api().get('/products').catch(() => ({ data: [] }));
                const products = Array.isArray(prodRes.data) ? prodRes.data : [];
                const bySlug: Record<string, { id: number; plans: any[] }> = Object.fromEntries(
                    products.map((p: any) => [p.slug, { id: p.id, plans: p.subscriptionPlans ?? [] }])
                );

                //    (2c) poster chaque item local vers le serveur
                for (const item of items) {
                    const entry = bySlug[item.id];
                    if (!entry) continue; // slug inconnu côté serveur
                    const cycle = item.period === 'monthly' ? 'MONTHLY' : 'YEARLY';
                    const plan = entry.plans.find((p: any) => p.billingCycle === cycle);
                    if (!plan) continue;
                    await api().post('/cart/items', {
                        productId: entry.id,
                        subscriptionPlanId: plan.id,
                        quantity: item.quantity,
                    }).catch(() => {});
                }

                //    (2d) lire le cart synchronisé pour récupérer le cartId réel
                const syncedRes = await api().get('/cart').catch(() => ({ data: null }));
                if (syncedRes.data?.id) setCartId(syncedRes.data.id);
            } catch (err) {
                console.warn('[checkout] synchronisation initiale incomplète', err);
            }
        })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoaded]);

    const handleBillingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setBillingError('');

        // Cas 1 : l'utilisateur a coché "Utiliser mon adresse enregistrée"
        // → on réutilise l'addressId existant sans créer de nouvelle entité.
        if (useSavedAddress && savedAddress) {
            setAddressId(savedAddress.id);
            setStep(3);
            return;
        }

        const required = ['firstName', 'lastName', 'addressLine1', 'city', 'postalCode'] as const;
        if (required.some(f => !billing[f])) {
            setBillingError(t('checkout.billing.required'));
            return;
        }

        try {
            // Cas 2 : saisie manuelle → on crée une nouvelle adresse côté API.
            const res = await api().post('/addresses', {
                firstName: billing.firstName,
                lastName: billing.lastName,
                addressLine1: billing.addressLine1,
                addressLine2: billing.addressLine2 || undefined,
                city: billing.city,
                region: billing.region || undefined,
                postalCode: billing.postalCode,
                country: billing.country,
                phone: billing.phone || undefined,
            });
            if (res.data?.id) {
                setAddressId(res.data.id);
                setStep(3);
            } else {
                setBillingError(t('checkout.billing.saveError'));
            }
        } catch (err: any) {
            setBillingError(err.response?.data?.message ?? t('checkout.billing.saveError'));
        }
    };

    const goToBillingStep = () => {
        if (!userId) {
            router.replace('/checkout?guest=true');
        }
        setStep(2);
    };
    const goToAccountStep = () => setStep(1);
    const goToVerificationStep = () => setStep(3);

    // Clic sur "Passer au paiement" à l'étape 3 → créer le PaymentIntent côté backend,
    // stocker le clientSecret pour monter <Elements> à l'étape 4.
    const goToPaymentStep = async () => {
        if (!userId || !cartId || !addressId) return;
        setPaymentIntentError('');
        setPaymentIntentLoading(true);
        try {
            if (saveForNextTime) {
                await api()
                    .patch(`/addresses/${addressId}/default`)
                    .catch(() => null);
            }
            const res = await api().post('/v1/payement/create-intent', {
                userId,
                cartId,
                billingAddressId: addressId,
                saveCard: saveForNextTime,
            });
            if (res.data?.clientSecret && res.data?.orderId) {
                setClientSecret(res.data.clientSecret);
                setServerOrderId(res.data.orderId);
                setStep(4);
            } else {
                setPaymentIntentError('Impossible d\'initier le paiement. Réessayez.');
            }
        } catch (err: any) {
            setPaymentIntentError(err.response?.data?.message ?? err.message ?? 'Erreur lors de l\'initialisation du paiement');
        } finally {
            setPaymentIntentLoading(false);
        }
    };

    if (!isLoaded) {
        return (
            <AppLayout>
                <div className="mx-auto max-w-md px-4 py-24 text-center text-sm text-gray-500">
                    {t('checkout.loadingCart')}
                </div>
            </AppLayout>
        );
    }

    if (orderDone) {
        return (
            <AppLayout>
                <div className="max-w-lg mx-auto px-4 py-24 text-center">
                    <div className="w-20 h-20 bg-green-950/40 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="w-10 h-10 text-green-400" />
                    </div>
                    <h1 className="cyna-heading cyna-heading--center text-gray-100 mb-3">{t('checkout.success.title')}</h1>
                    <p className="text-gray-400 mb-2">
                        {t('checkout.success.order')} <span className="font-semibold text-gray-200">#{orderDone}</span>
                    </p>
                    <p className="text-gray-500 text-sm mb-10">{t('checkout.success.body')}</p>
                    <Button variant="primary" onClick={() => router.push("/dashboard")} className="gap-1">
                        {t('checkout.success.dashboard')} <ChevronRight size={16} className="ml-1" />
                    </Button>
                </div>
            </AppLayout>
        );
    }

    if (items.length === 0) {
        return null;
    }

    return (
        <AppLayout>
            <div className="mx-auto flex w-full max-w-5xl flex-col items-center px-4 py-16">
                {/* Étapes */}
                <div className="mb-12 flex w-full flex-wrap justify-center gap-2 border-b border-zinc-800 pb-8 sm:gap-3">
                    <StepIndicator num={1} title={t('checkout.step.account')} current={step} />
                    <StepIndicator num={2} title={t('checkout.step.billing')} current={step} />
                    <StepIndicator num={3} title={t('checkout.step.review')} current={step} />
                    <StepIndicator num={4} title={t('checkout.step.payment')} current={step} />
                </div>

                <div
                    className={cn(
                        'flex w-full flex-col items-center gap-10',
                        showCartRecap && 'lg:flex-row lg:items-start lg:justify-center'
                    )}
                >
                    {/* Formulaire — seul bloc centré si pas de récap (colonne vide supprimée) */}
                    <div
                        className={cn(
                            'w-full max-w-md',
                            showCartRecap ? 'lg:max-w-[28rem] lg:shrink-0' : 'mx-auto'
                        )}
                    >

                        {/* ── ÉTAPE 1 : Compte ── */}
                        {step === 1 && (
                            <div className="fade-in mx-auto w-full max-w-md space-y-6 text-center sm:text-left">
                                <h2 className="cyna-heading text-gray-100">
                                    {userId ? t('checkout.account.titleUser') : t('checkout.account.titleGuest')}
                                </h2>
                                {userId ? (
                                    <p className="text-sm text-gray-600">
                                        {t('checkout.account.connectedHint')}
                                    </p>
                                ) : null}
                                <div className="space-y-3">
                                    {!userId && (
                                        <>
                                            <input type="email" placeholder={t('auth.login.emailPh')}
                                                className="w-full rounded-xl border border-zinc-700 bg-zinc-800 text-gray-200 placeholder-gray-500 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-cyna-600" />
                                            <input type="password" placeholder={t('auth.login.passwordPh')}
                                                className="w-full rounded-xl border border-zinc-700 bg-zinc-800 text-gray-200 placeholder-gray-500 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-cyna-600" />
                                            <Button variant="primary" className="w-full" onClick={() => router.push('/auth/login?redirect=/checkout')}>
                                                {t('auth.login.submit')}
                                            </Button>
                                        </>
                                    )}
                                    <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-center">
                                        {userId && (
                                            <Button type="button" variant="primary" className="w-full gap-2 sm:w-auto" onClick={goToBillingStep}>
                                                {t('checkout.next')} <ChevronRight size={16} />
                                            </Button>
                                        )}
                                        {!userId && (
                                            <>
                                                <Button type="button" variant="outline" className="w-full gap-2 sm:w-auto" onClick={goToBillingStep}>
                                                    {t('checkout.continueGuest')} <ChevronRight size={16} />
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── ÉTAPE 2 : Facturation ── */}
                        {step === 2 && (
                            <form onSubmit={handleBillingSubmit} className="fade-in w-full space-y-6">
                                <h2 className="cyna-heading text-gray-100">{t('checkout.billing.title')}</h2>

                                {/* Case à cocher : réutiliser l'adresse du compte (seulement si l'utilisateur en a une) */}
                                {savedAddress && (
                                    <div className="rounded-2xl border border-zinc-700 bg-zinc-900/60 p-4">
                                        <label className="flex items-start gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={useSavedAddress}
                                                onChange={(e) => {
                                                    const checked = e.target.checked;
                                                    setUseSavedAddress(checked);
                                                    if (checked) {
                                                        // Miroir des champs pour que l'étape 3 (récap) affiche les valeurs
                                                        setBilling({
                                                            firstName: savedAddress.firstName,
                                                            lastName: savedAddress.lastName,
                                                            addressLine1: savedAddress.addressLine1,
                                                            addressLine2: savedAddress.addressLine2 ?? '',
                                                            city: savedAddress.city,
                                                            region: savedAddress.region ?? '',
                                                            postalCode: savedAddress.postalCode,
                                                            country: savedAddress.country || 'FR',
                                                            phone: savedAddress.phone ?? '',
                                                        });
                                                    } else {
                                                        setBilling({
                                                            firstName: '', lastName: '', addressLine1: '', addressLine2: '',
                                                            city: '', region: '', postalCode: '', country: 'FR', phone: '',
                                                        });
                                                    }
                                                }}
                                                className="mt-0.5 h-4 w-4 rounded border-gray-500 text-cyna-600 focus:ring-cyna-600"
                                            />
                                            <div className="flex-1">
                                                <span className="text-sm font-medium text-gray-100">
                                                    Utiliser l'adresse enregistrée dans mon compte
                                                </span>
                                                <p className="mt-2 text-xs text-gray-400 leading-relaxed">
                                                    {savedAddress.firstName} {savedAddress.lastName}
                                                    <br />
                                                    {savedAddress.addressLine1}
                                                    {savedAddress.addressLine2 && <><br />{savedAddress.addressLine2}</>}
                                                    <br />
                                                    {savedAddress.postalCode} {savedAddress.city}
                                                    {savedAddress.region && <>, {savedAddress.region}</>}
                                                    <br />
                                                    {countryLabels[savedAddress.country] ?? savedAddress.country}
                                                </p>
                                            </div>
                                        </label>
                                    </div>
                                )}

                                {/* Formulaire manuel — masqué si l'utilisateur a coché la case */}
                                {!useSavedAddress && (
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { field: 'firstName' as const, placeholder: t('checkout.ph.firstName'), col: 1 as const },
                                            { field: 'lastName' as const, placeholder: t('checkout.ph.lastName'), col: 1 as const },
                                            { field: 'addressLine1' as const, placeholder: t('checkout.ph.address1'), col: 2 as const },
                                            { field: 'addressLine2' as const, placeholder: t('checkout.ph.address2'), col: 2 as const },
                                            { field: 'city' as const, placeholder: t('checkout.ph.city'), col: 1 as const },
                                            { field: 'postalCode' as const, placeholder: t('checkout.ph.postal'), col: 1 as const },
                                            { field: 'region' as const, placeholder: t('checkout.ph.region'), col: 2 as const },
                                        ].map(({ field, placeholder, col }) => (
                                            <input key={field}
                                                type="text"
                                                placeholder={placeholder}
                                                value={billing[field as keyof typeof billing]}
                                                onChange={e => setBilling(prev => ({ ...prev, [field]: e.target.value }))}
                                                className={`${col === 2 ? 'col-span-2' : ''} rounded-xl border border-zinc-700 bg-zinc-800 text-gray-200 placeholder-gray-500 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-cyna-600`}
                                            />
                                        ))}
                                        <select value={billing.country} onChange={e => setBilling(prev => ({ ...prev, country: e.target.value }))}
                                            className="col-span-2 rounded-xl border border-zinc-700 bg-zinc-800 text-gray-200 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-cyna-600">
                                            <option value="FR">France</option>
                                            <option value="BE">Belgique</option>
                                            <option value="CH">Suisse</option>
                                            <option value="LU">Luxembourg</option>
                                        </select>
                                        <input
                                            type="tel"
                                            placeholder={t('checkout.ph.phone')}
                                            value={billing.phone}
                                            onChange={e => setBilling(prev => ({ ...prev, phone: e.target.value }))}
                                            className="col-span-2 rounded-xl border border-zinc-700 bg-zinc-800 text-gray-200 placeholder-gray-500 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-cyna-600"
                                        />
                                    </div>
                                )}
                                {billingError && (
                                    <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{billingError}</p>
                                )}
                                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between sm:gap-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full gap-2 sm:w-auto"
                                        onClick={goToAccountStep}
                                    >
                                        <ChevronLeft size={16} /> {t('common.prev')}
                                    </Button>
                                    <Button type="submit" variant="primary" className="w-full gap-2 sm:w-auto">
                                        {t('checkout.next')} <ChevronRight size={16} />
                                    </Button>
                                </div>
                            </form>
                        )}

                        {/* ── ÉTAPE 3 : Vérification (avant Stripe) ── */}
                        {step === 3 && (
                            <div className="fade-in w-full space-y-6">
                                <h2 className="cyna-heading text-gray-100">
                                    {t('checkout.verify.title')}
                                </h2>
                                <p className="text-center text-sm text-gray-400">
                                    {t('checkout.verify.subtitle')}
                                </p>
                                <div className="space-y-4 rounded-2xl border border-zinc-700 bg-zinc-900 p-5 text-sm">
                                    <h3 className="font-semibold text-gray-200">{t('checkout.verify.billingBlock')}</h3>
                                    <p className="text-gray-300">
                                        {billing.firstName} {billing.lastName}
                                        <br />
                                        {billing.addressLine1}
                                        {billing.addressLine2 && <><br />{billing.addressLine2}</>}
                                        <br />
                                        {billing.postalCode} {billing.city}
                                        {billing.region && <><br />{billing.region}</>}
                                        <br />
                                        {countryLabels[billing.country] ?? billing.country}
                                        {billing.phone && <><br />{t('checkout.telPrefix')} {billing.phone}</>}
                                    </p>
                                </div>

                                {/* Option : mémoriser l'adresse (par défaut) + autoriser Stripe à sauvegarder la carte */}
                                <label className="flex items-center gap-3 cursor-pointer rounded-2xl border border-zinc-700 bg-zinc-900/60 p-4">
                                    <input
                                        type="checkbox"
                                        checked={saveForNextTime}
                                        onChange={(e) => setSaveForNextTime(e.target.checked)}
                                        className="w-4 h-4 rounded border-gray-500 text-cyna-600"
                                    />
                                    <span className="text-sm text-gray-300">{t('checkout.pay.saveForNextTime')}</span>
                                </label>

                                {paymentIntentError && (
                                    <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{paymentIntentError}</p>
                                )}

                                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between sm:gap-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full gap-2 sm:w-auto"
                                        onClick={goToBillingStep}
                                        disabled={paymentIntentLoading}
                                    >
                                        <ChevronLeft size={16} /> {t('common.prev')}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="primary"
                                        className="w-full gap-2 sm:w-auto"
                                        onClick={goToPaymentStep}
                                        disabled={!userId || !cartId || !addressId || paymentIntentLoading}
                                    >
                                        {paymentIntentLoading ? t('checkout.pay.processing') : t('checkout.payProceed')} <ChevronRight size={16} />
                                    </Button>
                                </div>
                                {(!userId || !cartId || !addressId) && (
                                    <p className="text-center text-xs text-amber-700">
                                        {t('checkout.syncWarning')}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* ── ÉTAPE 4 : Paiement Stripe (PaymentElement — CB + PayPal) ── */}
                        {step === 4 && clientSecret && serverOrderId && (
                            <div className="fade-in w-full space-y-6">
                                <h2 className="cyna-heading text-gray-100">{t('checkout.payment.title')}</h2>
                                <div className="mx-auto w-full max-w-md px-0 sm:px-0">
                                    <PaymentFormWithElements
                                        clientSecret={clientSecret}
                                        orderId={serverOrderId}
                                        onSuccess={setOrderDone}
                                    />
                                </div>
                                <div className="flex justify-center pt-2">
                                    <Button type="button" variant="outline" className="gap-2" onClick={goToVerificationStep}>
                                        <ChevronLeft size={16} /> {t('checkout.payment.back')}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {step === 4 && (!clientSecret || !serverOrderId) && (
                            <div className="fade-in mx-auto max-w-md py-12 text-center">
                                <p className="text-sm text-gray-500">{t('checkout.loading')}</p>
                            </div>
                        )}
                    </div>

                    {/* Récapitulatif — décalé sous le niveau du titre du formulaire (comme un titre invisible à gauche) */}
                    {showCartRecap && (
                        <div
                            className={cn(
                                'w-full max-w-sm shrink-0 lg:max-w-xs',
                                /* ~ h2 (text-2xl) + gap space-y-6 avant le premier bloc utile */
                                step === 2 && 'lg:mt-[3.5rem]',
                                step === 3 && 'lg:mt-[4.75rem]',
                                step === 4 && 'lg:mt-[3.5rem]',
                                step === 1 && 'lg:mt-[3.5rem]'
                            )}
                        >
                            <CartSummary />
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

export default function Checkout() {
    return (
        <Suspense fallback={<div className="min-h-[40vh] p-8 text-gray-400 text-center">Chargement…</div>}>
            <CheckoutInner />
        </Suspense>
    );
}
