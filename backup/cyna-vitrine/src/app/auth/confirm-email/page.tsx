"use client";

import AppLayout from "@/layout/AppLayout";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Mail } from "lucide-react";
import { Suspense } from "react";

function ConfirmEmailInner() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "votre adresse email";

  return (
    <AppLayout>
      <div className="flex min-h-[calc(100vh-10rem)] w-full flex-col items-center justify-center bg-gradient-to-br from-[#0a0a23] via-[#1a1a40] to-[#2a2a60] py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-lg shadow-md p-8 text-center space-y-6">

          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-cyna-600/20 flex items-center justify-center">
              <Mail className="w-8 h-8 text-cyna-600" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="cyna-heading text-gray-100">Vérifiez votre email</h2>
            <p className="text-gray-400 text-sm">
              Un lien de confirmation a été envoyé à{" "}
              <span className="font-semibold text-gray-200">{email}</span>.
            </p>
          </div>

          <p className="text-gray-500 text-sm">
            Cliquez sur le lien dans l'email pour activer votre compte. Le lien
            est valable pendant <span className="text-gray-300 font-medium">24 heures</span>.
          </p>

          <div className="bg-zinc-800 rounded-lg p-4 text-left space-y-2 text-sm text-gray-400">
            <p className="font-medium text-gray-300">Vous n'avez pas reçu l'email ?</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Vérifiez votre dossier spam ou courrier indésirable</li>
              <li>Assurez-vous que l'adresse saisie est correcte</li>
              <li>Patientez quelques minutes — la réception peut prendre un peu de temps</li>
            </ul>
          </div>

          <div className="pt-2 space-y-3">
            <Link
              href="/auth/login"
              className="block w-full py-2 px-4 text-sm font-medium rounded-md text-white bg-cyna-600 hover:bg-cyna-700 transition-colors"
            >
              Aller à la page de connexion
            </Link>
            <Link
              href="/auth/register"
              className="block text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              Revenir à l'inscription
            </Link>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}

export default function ConfirmEmail() {
  return (
    <Suspense fallback={<div className="min-h-[40vh] p-8 text-gray-400 text-center">Chargement…</div>}>
      <ConfirmEmailInner />
    </Suspense>
  );
}
