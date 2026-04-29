import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Nous contacter | Cyna",
    description: "Formulaire de contact sur la page Support.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return children;
}
