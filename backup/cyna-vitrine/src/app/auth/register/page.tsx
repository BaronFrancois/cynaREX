"use client";

import api from "@/lib/api";
import AppLayout from "@/layout/AppLayout";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, ChangeEvent, FormEvent } from "react";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
  general?: string;
}

// ── Règles de validation ───────────────────────────────────────────────────────

/** Lettres (y compris accentuées), tirets et espaces — min 2 caractères */
const NAME_RE = /^[a-zA-ZÀ-ÿ '-]{2,50}$/;

/** Email RFC5322 simplifié */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validateName(value: string): string | undefined {
  if (!value.trim()) return "Ce champ est requis";
  if (!NAME_RE.test(value.trim())) return "Lettres, tirets et espaces uniquement (2–50 caractères)";
}

function validateEmail(value: string): string | undefined {
  if (!value) return "L'email est requis";
  if (!EMAIL_RE.test(value)) return "Format d'email invalide (ex : prenom@domaine.fr)";
}

interface PasswordCheck {
  isValid: boolean;
  hints: { label: string; ok: boolean }[];
}

function validatePassword(value: string): PasswordCheck {
  const hints = [
    { label: "Au moins 8 caractères",              ok: value.length >= 8 },
    { label: "Au moins une majuscule (A–Z)",        ok: /[A-Z]/.test(value) },
    { label: "Au moins un chiffre (0–9)",           ok: /[0-9]/.test(value) },
    { label: "Au moins un caractère spécial (!@#…)", ok: /[!@#$%^&*()\-_=+[\]{};:'",.<>?/\\|`~]/.test(value) },
  ];
  return { isValid: hints.every((h) => h.ok), hints };
}

// ── Composant ─────────────────────────────────────────────────────────────────

export default function Register() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordCheck = validatePassword(formData.password);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Effacer l'erreur au fur et à mesure que l'utilisateur corrige
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: FormErrors = {};

    const firstNameErr = validateName(formData.firstName);
    if (firstNameErr) newErrors.firstName = firstNameErr;

    const lastNameErr = validateName(formData.lastName);
    if (lastNameErr) newErrors.lastName = lastNameErr;

    const emailErr = validateEmail(formData.email);
    if (emailErr) newErrors.email = emailErr;

    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (!passwordCheck.isValid) {
      newErrors.password = "Le mot de passe ne respecte pas tous les critères";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    const termsCheckbox = e.currentTarget.elements.namedItem("terms") as HTMLInputElement;
    if (!termsCheckbox.checked) {
      newErrors.terms = "Vous devez accepter les conditions d'utilisation";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const email = formData.email.trim().toLowerCase();
      // On n'envoie que ce que l'API attend : firstName, lastName, email, password
      const res = await api().post<{ autoVerified?: boolean }>("/auth/register", {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email,
        password: formData.password,
      });

      // Si l'API indique autoVerified (aucun SMTP configuré côté serveur),
      // on court-circuite la page de confirmation et on envoie direct au login.
      if (res?.data?.autoVerified) {
        router.push(`/auth/login?email=${encodeURIComponent(email)}&registered=1`);
      } else {
        router.push(`/auth/confirm-email?email=${encodeURIComponent(email)}`);
      }
    } catch (error: unknown) {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message
        ?? "Une erreur est survenue lors de l'inscription. Veuillez réessayer.";
      setErrors({ general: Array.isArray(msg) ? msg.join(", ") : msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (field: keyof FormErrors) =>
    `w-full px-4 py-2 border ${
      errors[field] ? "border-red-500" : "border-zinc-600"
    } bg-zinc-800 text-gray-200 placeholder-gray-500 rounded-md focus:ring-2 focus:ring-cyna-600 focus:border-transparent`;

  return (
    <AppLayout>
      <div className="flex min-h-[calc(100vh-10rem)] w-full flex-col items-center justify-center bg-gradient-to-br from-[#0a0a23] via-[#1a1a40] to-[#2a2a60] py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-lg shadow-md p-8">
        <h2 className="cyna-heading cyna-heading--center text-gray-100 mb-6">
          Créez votre compte
        </h2>

        {/* Erreur générale (ex : email déjà utilisé) */}
        {errors.general && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <p className="text-sm text-red-700">{errors.general}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>

          {/* Prénom / Nom — côte à côte */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-1">
                Prénom
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                autoComplete="given-name"
                value={formData.firstName}
                onChange={handleChange}
                className={inputClass("firstName")}
                placeholder="Jean"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-1">
                Nom
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                autoComplete="family-name"
                value={formData.lastName}
                onChange={handleChange}
                className={inputClass("lastName")}
                placeholder="Dupont"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Adresse email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              className={inputClass("email")}
              placeholder="jean@entreprise.fr"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Mot de passe */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              name="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              className={inputClass("password")}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
            {/* Indicateurs de complexité — visibles dès que l'utilisateur tape */}
            {formData.password && (
              <ul className="mt-2 space-y-1">
                {passwordCheck.hints.map((h) => (
                  <li
                    key={h.label}
                    className={`text-xs flex items-center gap-1 ${
                      h.ok ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    <span>{h.ok ? "✓" : "○"}</span>
                    {h.label}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Confirmation du mot de passe */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={inputClass("confirmPassword")}
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>

          {/* CGU */}
          <div className="flex items-start gap-3">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              className="mt-0.5 h-4 w-4 text-cyna-600 focus:ring-cyna-600 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="text-sm text-gray-300">
              J'accepte les{" "}
              <a href="/cgu" className="text-cyna-600 hover:text-cyna-500 font-medium">
                conditions d'utilisation
              </a>{" "}
              et la{" "}
              <a href="/mentions-legales" className="text-cyna-600 hover:text-cyna-500 font-medium">
                politique de confidentialité
              </a>
            </label>
          </div>
          {errors.terms && (
            <p className="text-sm text-red-600 -mt-3">{errors.terms}</p>
          )}

          {/* Bouton */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-cyna-600 hover:bg-cyna-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyna-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Inscription en cours…" : "S'inscrire"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Déjà un compte ?{" "}
          <Link href="/auth/login" className="text-cyna-600 hover:text-cyna-500 font-medium">
            Connectez-vous
          </Link>
        </div>
      </div>
      </div>
    </AppLayout>
  );
}
