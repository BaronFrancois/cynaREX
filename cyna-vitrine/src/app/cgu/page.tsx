import type { Metadata } from "next";
import LegalPageShell from "@/components/LegalPageShell";
import CguInner from "@/components/legal/CguInner";

export const metadata: Metadata = {
    title: "Conditions générales d'utilisation | Cyna",
    description: "Conditions générales d'utilisation du site et des services Cyna.",
};

export default function CguPage() {
    return (
        <LegalPageShell
            titleFr="Conditions générales d'utilisation"
            titleEn="Terms of use"
        >
            <CguInner />
        </LegalPageShell>
    );
}
