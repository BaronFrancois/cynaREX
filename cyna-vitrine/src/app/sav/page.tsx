import type { Metadata } from "next";
import LegalPageShell from "@/components/LegalPageShell";
import SavPageInner from "@/components/legal/SavPageInner";

export const metadata: Metadata = {
    title: "Service après-vente (SAV) | Cyna",
    description: "Assistance technique et SAV pour vos solutions Cyna.",
};

export default function SavPage() {
    return (
        <LegalPageShell
            titleFr="Service après-vente (SAV)"
            titleEn="Support & returns"
        >
            <SavPageInner />
        </LegalPageShell>
    );
}
