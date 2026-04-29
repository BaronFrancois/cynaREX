import type { Metadata } from "next";
import LegalPageShell from "@/components/LegalPageShell";
import MentionsLegalesInner from "@/components/legal/MentionsLegalesInner";

export const metadata: Metadata = {
    title: "Mentions légales | Cyna",
    description: "Mentions légales du site Cyna — éditeur, hébergement, propriété intellectuelle.",
};

export default function MentionsLegalesPage() {
    return (
        <LegalPageShell titleFr="Mentions légales" titleEn="Legal notice">
            <MentionsLegalesInner />
        </LegalPageShell>
    );
}
