'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Check, AlertTriangle, ChevronRight } from 'lucide-react';
import AppLayout from '@/layout/AppLayout';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';
import useCart from '@/hooks/useCart';

// Page de retour après redirection Stripe (PayPal, 3DS, etc.)
// Stripe ajoute automatiquement ?payment_intent=pi_...&payment_intent_client_secret=..._secret_...&redirect_status=succeeded
// à la return_url qu'on lui a passée. On récupère le PaymentIntent pour confirmer
// le statut et afficher le bon écran à l'utilisateur.

const STRIPE_PUBLISHABLE_KEY =
    process.env.NEXT_PUBLIC_STRIPE_KEY ??
    'pk_test_51TEqsf6NG07rbbnhYwsILXh0ifO76MK7gULNhoeM5kQ3f0S03XvypIiSIHKGkmG6vwtPEhA3eF1RYtMUqZOzoa8O00KQUYsy7P';

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

type Status = 'loading' | 'succeeded' | 'processing' | 'requires_payment_method' | 'failed';

function Inner() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { clearCart } = useCart();

    const [status, setStatus] = useState<Status>('loading');
    const [orderId, setOrderId] = useState<string | null>(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const urlOrderId = searchParams.get('orderId');
        if (urlOrderId) setOrderId(urlOrderId);

        const clientSecret = searchParams.get('payment_intent_client_secret');
        // Si pas de client_secret (ex : l'utilisateur arrive directement sur /return)
        // on regarde simplement redirect_status pour décider
        if (!clientSecret) {
            const redirectStatus = searchParams.get('redirect_status');
            if (redirectStatus === 'succeeded') {
                setStatus('succeeded');
                clearCart();
                api().delete('/cart').catch(() => {});
            } else {
                setStatus('failed');
                setMessage('Aucun paiement associé à cette page.');
            }
            return;
        }

        (async () => {
            const stripe = await stripePromise;
            if (!stripe) {
                setStatus('failed');
                setMessage('Stripe non initialisé.');
                return;
            }

            const { paymentIntent, error } = await stripe.retrievePaymentIntent(clientSecret);
            if (error || !paymentIntent) {
                setStatus('failed');
                setMessage(error?.message ?? 'Impossible de récupérer le paiement.');
                return;
            }

            switch (paymentIntent.status) {
                case 'succeeded':
                    setStatus('succeeded');
                    clearCart();
                    api().delete('/cart').catch(() => {});
                    break;
                case 'processing':
                    setStatus('processing');
                    setMessage('Le paiement est en cours de traitement. Vous recevrez un e-mail de confirmation.');
                    break;
                case 'requires_payment_method':
                    setStatus('requires_payment_method');
                    setMessage('Le paiement a échoué, veuillez réessayer avec un autre moyen.');
                    break;
                default:
                    setStatus('failed');
                    setMessage(`Statut du paiement : ${paymentIntent.status}`);
            }
        })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    if (status === 'loading') {
        return (
            <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
                <div className="mb-6 h-10 w-10 animate-spin rounded-full border-2 border-zinc-700 border-t-cyna-500" />
                <p className="text-sm text-gray-400">Vérification du paiement…</p>
            </div>
        );
    }

    if (status === 'succeeded') {
        return (
            <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-950/40">
                    <Check className="h-10 w-10 text-green-400" />
                </div>
                <h1 className="cyna-heading cyna-heading--center mb-3 w-full text-center text-gray-100">
                    Paiement confirmé !
                </h1>
                {orderId && (
                    <p className="mb-2 w-full text-center text-gray-400">
                        Commande n° <span className="font-semibold text-gray-200">#{orderId}</span>
                    </p>
                )}
                <p className="mb-10 w-full max-w-md text-center text-sm text-gray-500">
                    Vous recevrez une confirmation par email. Vos abonnements sont maintenant actifs.
                </p>
                <Button
                    variant="primary"
                    onClick={() => router.push('/account')}
                    className="gap-1 shrink-0"
                >
                    Accéder à mon espace client <ChevronRight size={16} className="ml-1" />
                </Button>
            </div>
        );
    }

    if (status === 'processing') {
        return (
            <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-950/40">
                    <div className="h-10 w-10 animate-spin rounded-full border-2 border-amber-700 border-t-amber-400" />
                </div>
                <h1 className="cyna-heading cyna-heading--center mb-3 w-full text-center text-gray-100">
                    Paiement en cours
                </h1>
                <p className="mb-10 w-full max-w-md text-center text-sm text-gray-400">{message}</p>
                <Button
                    variant="primary"
                    onClick={() => router.push('/account')}
                    className="gap-1 shrink-0"
                >
                    Accéder à mon espace client <ChevronRight size={16} className="ml-1" />
                </Button>
            </div>
        );
    }

    return (
        <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-950/40">
                <AlertTriangle className="h-10 w-10 text-red-400" />
            </div>
            <h1 className="cyna-heading cyna-heading--center mb-3 w-full text-center text-gray-100">
                Paiement non finalisé
            </h1>
            <p className="mb-10 w-full max-w-md text-center text-sm text-gray-400">
                {message || 'Une erreur est survenue pendant le paiement.'}
            </p>
            <div className="flex w-full max-w-md flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
                <Button
                    variant="primary"
                    onClick={() => router.push('/checkout')}
                    className="w-full sm:w-auto"
                >
                    Reprendre la commande
                </Button>
                <Button
                    variant="outline"
                    onClick={() => router.push('/cart')}
                    className="w-full sm:w-auto"
                >
                    Retour au panier
                </Button>
            </div>
        </div>
    );
}

export default function CheckoutReturnPage() {
    return (
        <AppLayout>
            <Suspense fallback={
                <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-sm text-gray-500">
                    Chargement…
                </div>
            }>
                <Inner />
            </Suspense>
        </AppLayout>
    );
}
