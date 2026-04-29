"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/layout/AppLayout";

/** Ancienne URL /contact : renvoie vers la section formulaire sur /support */
export default function ContactRedirectPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/support#contact");
    }, [router]);

    return (
        <AppLayout>
            <div className="max-w-3xl mx-auto px-4 py-24 text-center text-gray-500 text-sm">
                Redirection vers le support…
            </div>
        </AppLayout>
    );
}
