"use client";

import Link from "next/link";
import { useI18n } from "@/context/I18nContext";

export default function CguInner() {
    const { locale } = useI18n();
    const en = locale === "en";

    if (en) {
        return (
            <>
                <p>
                    These terms of use govern access to and use of the showcase website and services
                    offered by Cyna. By browsing this site or placing an order, you accept these terms
                    without reservation.
                </p>

                <h2>1. Publisher</h2>
                <p>
                    The site is published by Cyna. Legal information (company form, address, contact)
                    is available in the{" "}
                    <Link href="/mentions-legales" className="text-cyna-600 hover:underline">
                        legal notice
                    </Link>
                    .
                </p>

                <h2>2. Purpose</h2>
                <p>
                    These terms define the rules for using online content (text, visuals, documentation)
                    and access to related services (customer account, orders, support).
                </p>

                <h2>3. User account</h2>
                <p>
                    Where account creation is offered, the user undertakes to provide accurate
                    information and keep credentials confidential. Activity performed from the account
                    is deemed to be carried out by the user.
                </p>

                <h2>4. Intellectual property</h2>
                <p>
                    All elements of the site (brands, logos, text, layouts) are protected. Any
                    reproduction or use without authorisation is prohibited.
                </p>

                <h2>5. Liability</h2>
                <p>
                    Cyna strives to keep information accurate. The site may nevertheless contain errors
                    or be temporarily unavailable; the publisher shall not be liable for indirect damage
                    arising from use of the site.
                </p>

                <h2>6. Changes to these terms</h2>
                <p>
                    Cyna may amend these terms at any time. The online version prevails; users should
                    review this page regularly.
                </p>

                <h2>7. Applicable law</h2>
                <p>
                    These terms are governed by French law. Any dispute shall fall under the courts of
                    the publisher&apos;s registered office, subject to any mandatory legal provision to
                    the contrary.
                </p>

                <p className="text-xs text-gray-400 pt-8 border-t border-gray-100">
                    Informational document — have it reviewed by counsel before final publication.
                </p>
            </>
        );
    }

    return (
        <>
            <p>
                Les présentes conditions générales d&apos;utilisation (CGU) encadrent l&apos;accès et
                l&apos;utilisation du site vitrine et des services proposés par Cyna. En naviguant sur
                ce site ou en passant commande, vous acceptez sans réserve les présentes CGU.
            </p>

            <h2>1. Éditeur du site</h2>
            <p>
                Le site est édité par Cyna. Les informations relatives à l&apos;éditeur (forme
                juridique, siège, contact) figurent dans les{" "}
                <Link href="/mentions-legales" className="text-cyna-600 hover:underline">
                    mentions légales
                </Link>
                .
            </p>

            <h2>2. Objet</h2>
            <p>
                Les CGU définissent les règles d&apos;usage des contenus disponibles en ligne
                (textes, visuels, documentation) ainsi que les modalités d&apos;accès aux services
                associés (compte client, commandes, support).
            </p>

            <h2>3. Compte utilisateur</h2>
            <p>
                Lorsque la création d&apos;un compte est proposée, l&apos;utilisateur s&apos;engage à
                fournir des informations exactes et à préserver la confidentialité de ses
                identifiants. Toute activité réalisée depuis son compte est réputée effectuée par
                l&apos;utilisateur.
            </p>

            <h2>4. Propriété intellectuelle</h2>
            <p>
                L&apos;ensemble des éléments du site (marques, logos, textes, mises en page) sont
                protégés. Toute reproduction ou exploitation non autorisée est interdite.
            </p>

            <h2>5. Responsabilité</h2>
            <p>
                Cyna s&apos;efforce d&apos;assurer l&apos;exactitude des informations affichées. Le
                site peut toutefois contenir des inexactitudes ou être temporairement indisponible ;
                l&apos;éditeur ne saurait être tenu responsable des dommages indirects liés à
                l&apos;usage du site.
            </p>

            <h2>6. Modification des CGU</h2>
            <p>
                Cyna se réserve le droit de modifier les présentes CGU à tout moment. La version en
                ligne fait foi ; il appartient à l&apos;utilisateur de consulter régulièrement cette
                page.
            </p>

            <h2>7. Droit applicable</h2>
            <p>
                Les présentes CGU sont soumises au droit français. En cas de litige, les tribunaux
                compétents seront ceux du ressort du siège social de l&apos;éditeur, sous réserve
                d&apos;une attribution légale impérative différente.
            </p>

            <p className="text-xs text-gray-400 pt-8 border-t border-gray-100">
                Document fourni à titre informatif — modèle à adapter par votre conseil avant
                publication définitive.
            </p>
        </>
    );
}
