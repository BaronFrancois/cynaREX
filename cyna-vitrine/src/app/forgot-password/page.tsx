"use client";

import React, { useState } from 'react';
import api from '@/lib/api';
import AppLayout from '@/layout/AppLayout';

type Step = 'email' | 'code' | 'success';

interface FormErrors {
  email?: string;
  code?: string;
  newPassword?: string;
  confirmPassword?: string;
  general?: string;
}

export default function ForgotPassword() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  // ── Étape 1 : envoi du code ────────────────────────────────────────────────
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: FormErrors = {};
    if (!email) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Format d'email invalide";
    }
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});
    try {
      await api().post('/auth/forgot-password', { email });
      setStep('code');
    } catch {
      setErrors({ general: "Impossible d'envoyer le code. Vérifiez l'adresse email saisie." });
    } finally {
      setIsLoading(false);
    }
  };

  // ── Étape 2 : réinitialisation avec le code ────────────────────────────────
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: FormErrors = {};
    if (!code || code.length !== 6) {
      newErrors.code = 'Le code doit contenir exactement 6 chiffres';
    }
    if (!newPassword || newPassword.length < 6) {
      newErrors.newPassword = 'Le mot de passe doit contenir au moins 6 caractères';
    }
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});
    try {
      await api().post('/auth/forgot-password/code', { email, code, newPassword });
      setStep('success');
    } catch {
      setErrors({ general: 'Code invalide ou expiré. Vérifiez le code reçu par email ou demandez-en un nouveau.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
    <div className="flex min-h-[calc(100vh-10rem)] w-full flex-col items-center justify-center bg-gradient-to-br from-[#0a0a23] via-[#1a1a40] to-[#2a2a60] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-zinc-900 border border-zinc-700 p-8 rounded-lg shadow-md">

        {/* ── Étape 1 : saisie de l'email ── */}
        {step === 'email' && (
          <>
            <div>
              <h2 className="cyna-heading cyna-heading--center mt-6 text-gray-100">
                Mot de passe oublié
              </h2>
              <p className="mt-2 text-center text-sm text-gray-400">
                Saisissez votre adresse email. Vous recevrez un code à 6 chiffres.
              </p>
            </div>

            {errors.general && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <p className="text-sm text-red-700">{errors.general}</p>
              </div>
            )}

            <form className="mt-8 space-y-6" onSubmit={handleEmailSubmit} suppressHydrationWarning>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email
                </label>
                <input
                  suppressHydrationWarning
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.email ? 'border-red-500' : 'border-zinc-600'
                  } rounded-md shadow-sm bg-zinc-800 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-cyna-600 focus:border-cyna-600`}
                  placeholder="Entrez votre adresse email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <button
                  suppressHydrationWarning
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-cyna-600 hover:bg-cyna-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyna-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Envoi en cours…' : 'Recevoir le code'}
                </button>
              </div>
            </form>

            <div className="text-center text-sm">
              <a href="/auth/login" className="font-medium text-cyna-600 hover:text-cyna-500">
                ← Retour à la connexion
              </a>
            </div>
          </>
        )}

        {/* ── Étape 2 : code + nouveau mot de passe ── */}
        {step === 'code' && (
          <>
            <div>
              <h2 className="cyna-heading cyna-heading--center mt-6 text-gray-900">
                Nouveau mot de passe
              </h2>
              <p className="mt-2 text-center text-sm text-gray-400">
                Un code à 6 chiffres a été envoyé à{' '}
                <span className="font-medium text-gray-900">{email}</span>.
              </p>
            </div>

            {errors.general && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <p className="text-sm text-red-700">{errors.general}</p>
              </div>
            )}

            <form className="mt-8 space-y-4" onSubmit={handleResetSubmit}>
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-300">
                  Code de vérification
                </label>
                <input
                  id="code"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value.replace(/\D/g, ''));
                    setErrors((prev) => ({ ...prev, code: undefined }));
                  }}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.code ? 'border-red-500' : 'border-zinc-600'
                  } rounded-md shadow-sm bg-zinc-800 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-cyna-600 focus:border-cyna-600 text-center text-xl tracking-widest font-mono`}
                  placeholder="123456"
                />
                {errors.code && (
                  <p className="mt-1 text-sm text-red-600">{errors.code}</p>
                )}
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300">
                  Nouveau mot de passe
                </label>
                <input
                  id="newPassword"
                  type="password"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, newPassword: undefined }));
                  }}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.newPassword ? 'border-red-500' : 'border-zinc-600'
                  } rounded-md shadow-sm bg-zinc-800 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-cyna-600 focus:border-cyna-600`}
                  placeholder="Minimum 6 caractères"
                />
                {errors.newPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                  Confirmer le mot de passe
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                  }}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.confirmPassword ? 'border-red-500' : 'border-zinc-600'
                  } rounded-md shadow-sm bg-zinc-800 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-cyna-600 focus:border-cyna-600`}
                  placeholder="Retapez votre mot de passe"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>

              <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-cyna-600 hover:bg-cyna-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyna-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Réinitialisation…' : 'Réinitialiser mon mot de passe'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep('email');
                    setCode('');
                    setNewPassword('');
                    setConfirmPassword('');
                    setErrors({});
                  }}
                  className="w-full flex justify-center py-2 px-4 border border-zinc-600 text-sm font-medium rounded-md text-gray-300 bg-zinc-800 hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyna-600"
                >
                  ← Renvoyer un code
                </button>
              </div>
            </form>
          </>
        )}

        {/* ── Étape 3 : succès ── */}
        {step === 'success' && (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-950/40 mb-4">
              <svg
                className="h-8 w-8 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="cyna-heading text-gray-100 mb-2">
              Mot de passe réinitialisé
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              Votre mot de passe a été mis à jour avec succès.
              <br />
              Vous pouvez maintenant vous reconnecter.
            </p>
            <a
              href="/auth/login"
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-cyna-600 hover:bg-cyna-700"
            >
              Se connecter
            </a>
          </div>
        )}
      </div>
    </div>
    </AppLayout>
  );
}
