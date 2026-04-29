"use client";

import React, { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { setAuthToken } from '@/lib/authCookie';
import AppLayout from '@/layout/AppLayout';
import Link from 'next/link';
import { useI18n } from '@/context/I18nContext';

interface FormData {
    email: string;
    password: string;
}

interface FormErrors {
    email?: string;
    password?: string;
    general?: string;
}

type ErrorKind = 'wrong_password' | 'unconfirmed' | 'generic';

function classifyError(error: unknown): ErrorKind {
    const status = (error as { response?: { status?: number } })?.response?.status;
    const msg: string =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ?? '';

    if (status === 403 || msg.toLowerCase().includes('confirm') || msg.toLowerCase().includes('validé')) {
        return 'unconfirmed';
    }
    if (status === 401) return 'wrong_password';
    return 'generic';
}

function LoginInner() {
    const { t } = useI18n();
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirect') ?? '/dashboard';
    const prefilledEmail = searchParams.get('email') ?? '';
    const justRegistered = searchParams.get('registered') === '1';

    const [formData, setFormData] = useState<FormData>({ email: prefilledEmail, password: '' });
    const [errors, setErrors] = useState<FormErrors>({});
    const [errorKind, setErrorKind] = useState<ErrorKind | null>(null);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        if (!formData.email) {
            newErrors.email = t('auth.login.err.emailRequired');
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = t('auth.login.err.emailInvalid');
        }
        if (!formData.password) {
            newErrors.password = t('auth.login.err.passwordRequired');
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        setErrors({});
        setErrorKind(null);

        try {
            const res = await api().post('/auth/login', {
                email: formData.email,
                password: formData.password,
            });

            const token: string =
                res.data?.accessToken ?? res.data?.access_token ?? res.data?.token ?? '';
            const maxAge = rememberMe ? 30 * 24 * 3600 : 7 * 24 * 3600;
            if (token) {
                setAuthToken(token, maxAge);
                localStorage.setItem('token', token);
            }

            router.push(redirectTo);
        } catch (error) {
            const kind = classifyError(error);
            setErrorKind(kind);

            if (kind === 'wrong_password') {
                setErrors({ general: t('auth.login.err.wrong') });
            } else if (kind === 'unconfirmed') {
                setErrors({ general: t('auth.login.err.unconfirmed') });
            } else {
                setErrors({ general: t('auth.login.err.generic') });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AppLayout>
            <div className="flex min-h-[calc(100vh-10rem)] w-full flex-col items-center justify-center bg-gradient-to-br from-[#0a0a23] via-[#1a1a40] to-[#2a2a60] py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 bg-zinc-900 border border-zinc-700 p-8 rounded-lg shadow-md">
                    <div>
                        <h2 className="cyna-heading cyna-heading--center mt-6 text-gray-100">
                            {t('auth.login.heading')}
                        </h2>
                    </div>

                    {/* Inscription réussie (compte auto-activé, pas d'email requis) */}
                    {justRegistered && !errors.general && (
                        <div className="bg-green-950/40 border-l-4 border-green-500 p-4 rounded-r-lg">
                            <p className="text-sm text-green-300">
                                Votre compte a été créé avec succès. Connectez-vous pour accéder à votre espace.
                            </p>
                        </div>
                    )}

                    {/* Erreur générale */}
                    {errors.general && (
                        <div className="bg-red-950/40 border-l-4 border-red-500 p-4 rounded-r-lg">
                            <p className="text-sm text-red-400">{errors.general}</p>
                            {errorKind === 'wrong_password' && (
                                <p className="mt-1 text-sm text-red-400">
                                    <Link href="/forgot-password" className="font-medium underline hover:text-red-300">
                                        {t('auth.login.forgot')}
                                    </Link>
                                </p>
                            )}
                            {errorKind === 'unconfirmed' && (
                                <p className="mt-1 text-sm text-red-400">
                                    {t("auth.login.unconfirmedBefore")}
                                    <Link href="/support#contact" className="font-medium underline hover:text-red-300">
                                        {t("auth.login.contactSupport")}
                                    </Link>
                                    {t("auth.login.unconfirmedAfter")}
                                </p>
                            )}
                        </div>
                    )}

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="rounded-md shadow-sm space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                                    {t("auth.login.email")}
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-zinc-600'} bg-zinc-800 text-gray-100 placeholder-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-cyna-600 focus:border-cyna-600`}
                                    placeholder={t("auth.login.emailPh")}
                                />
                                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                                    {t("auth.login.password")}
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-zinc-600'} bg-zinc-800 text-gray-100 placeholder-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-cyna-600 focus:border-cyna-600`}
                                    placeholder={t("auth.login.passwordPh")}
                                />
                                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                            </div>
                        </div>

                        {/* Se souvenir de moi + Mot de passe oublié */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={e => setRememberMe(e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300 text-cyna-600 focus:ring-cyna-600"
                                />
                                <span className="text-sm text-gray-400">{t("auth.login.remember")}</span>
                            </label>
                            <Link href="/forgot-password" className="text-sm font-medium text-cyna-600 hover:text-cyna-500">
                                {t("auth.login.forgot")}
                            </Link>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-cyna-600 hover:bg-cyna-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyna-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isLoading ? t("auth.login.submitting") : t("auth.login.submit")}
                            </button>
                        </div>
                    </form>

                    <div className="relative flex items-center">
                        <div className="flex-grow border-t border-zinc-700"></div>
                        <span className="mx-3 text-sm text-gray-500">{t("auth.login.or")}</span>
                        <div className="flex-grow border-t border-zinc-700"></div>
                    </div>

                    <div className="text-center text-sm text-gray-400">
                        {t("auth.login.noAccount")}{" "}
                        <Link href="/auth/register" className="font-medium text-cyna-600 hover:text-cyna-500">
                            {t("auth.login.register")}
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

export default function Login() {
    return (
        <Suspense fallback={<div className="min-h-[40vh] p-8 text-gray-400 text-center">Chargement…</div>}>
            <LoginInner />
        </Suspense>
    );
}
