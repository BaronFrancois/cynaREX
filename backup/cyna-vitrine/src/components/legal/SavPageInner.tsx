"use client";

import Link from "next/link";
import { useI18n } from "@/context/I18nContext";

export default function SavPageInner() {
    const { locale } = useI18n();
    const en = locale === "en";

    if (en) {
        return (
            <>
                <p>
                    Our support team helps you with installation, configuration, and troubleshooting
                    for your Cyna cybersecurity services.
                </p>

                <h2>Support hours</h2>
                <ul>
                    <li>
                        <strong>Monday to Friday:</strong> 9:00 a.m. – 6:00 p.m. (Paris time)
                    </li>
                    <li>
                        <strong>Weekends and public holidays:</strong> limited assistance for critical
                        incidents for customers with a priority contract (per contractual terms).
                    </li>
                </ul>

                <h2>Open a request</h2>
                <p>
                    To open a ticket or track an existing request, use your{" "}
                    <Link href="/account" className="text-cyna-600 hover:underline">
                        customer area
                    </Link>{" "}
                    or write to us from the{" "}
                    <Link href="/support#contact" className="text-cyna-600 hover:underline">
                        Contact us
                    </Link>{" "}
                    page.
                </p>

                <h2>Online resources</h2>
                <p>
                    See the{" "}
                    <Link href="/support" className="text-cyna-600 hover:underline">
                        Support
                    </Link>{" "}
                    page for FAQ, documentation, and the conversational assistant.
                </p>

                <h2>Security emergency</h2>
                <p>
                    For a major security incident (suspected compromise, ransomware, etc.), state it
                    clearly in your message and include the word &quot;URGENCY&quot; in the subject.
                    Customers with a contractual on-call number should use it first.
                </p>

                <p className="text-xs text-gray-400 pt-8 border-t border-gray-100">
                    Phone numbers and detailed SLAs: to be completed according to your commercial
                    commitments.
                </p>
            </>
        );
    }

    return (
        <>
            <p>
                Notre équipe support vous accompagne pour l&apos;installation, la configuration et le
                dépannage de vos offres cybersécurité Cyna.
            </p>

            <h2>Horaires d&apos;assistance</h2>
            <ul>
                <li>
                    <strong>Lundi au vendredi :</strong> 9h00 – 18h00 (heure de Paris)
                </li>
                <li>
                    <strong>Week-end et jours fériés :</strong> assistance limitée aux incidents
                    critiques pour les clients sous contrat prioritaire (selon conditions contractuelles).
                </li>
            </ul>

            <h2>Créer une demande</h2>
            <p>
                Pour ouvrir un ticket ou suivre une demande en cours, utilisez votre{" "}
                <Link href="/account" className="text-cyna-600 hover:underline">
                    espace client
                </Link>{" "}
                ou écrivez-nous depuis la page{" "}
                <Link href="/support#contact" className="text-cyna-600 hover:underline">
                    Nous contacter
                </Link>
                .
            </p>

            <h2>Ressources en ligne</h2>
            <p>
                Consultez également la page{" "}
                <Link href="/support" className="text-cyna-600 hover:underline">
                    Support
                </Link>{" "}
                pour la FAQ, la documentation et l&apos;assistant conversationnel.
            </p>

            <h2>Urgence sécurité</h2>
            <p>
                En cas d&apos;incident de sécurité majeur (compromission suspectée, ransomware,
                etc.), indiquez-le en priorité dans votre message avec le mot &quot;URGENCE&quot;
                dans l&apos;objet. Les clients disposant d&apos;un numéro d&apos;astreinte
                contractuel doivent l&apos;utiliser en premier recours.
            </p>

            <p className="text-xs text-gray-400 pt-8 border-t border-gray-100">
                Coordonnées téléphoniques et SLA détaillés : à renseigner selon vos engagements
                commerciaux.
            </p>
        </>
    );
}
