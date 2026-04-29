"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import api from "@/lib/api";
import Link from "next/link";
import { ArrowLeftToLine, Menu } from "lucide-react";
import type { AdminUser } from "@/lib/adminApi";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [me, setMe] = useState<AdminUser | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const res = await api().get<AdminUser>("/users/me");
                if (!mounted) return;
                if (res.data.role !== "ADMIN") {
                    router.replace("/");
                    return;
                }
                setMe(res.data);
            } catch {
                if (!mounted) return;
                router.replace("/auth/login?redirect=/admin");
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, [router]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#0a0115] text-white/70">
                <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                <span className="ml-3 text-sm">Vérification des droits…</span>
            </div>
        );
    }

    if (!me) return null;

    return (
        <div className="flex min-h-screen bg-[#0a0115] text-white">
            <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex min-h-screen min-w-0 flex-1 flex-col overflow-x-hidden lg:pl-0">
                {/* Barre supérieure */}
                <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-white/10 bg-[#0a0115]/80 px-4 backdrop-blur lg:px-6">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="rounded-lg p-2 text-white/70 hover:bg-white/10 lg:hidden"
                            aria-label="Ouvrir le menu"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                        <p className="text-sm text-white/60">
                            Connecté en tant que{" "}
                            <span className="font-medium text-white">
                                {me.firstName} {me.lastName}
                            </span>
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="hidden rounded-full border border-[#600bd1]/50 bg-[#600bd1]/20 px-3 py-1 text-xs font-medium text-[#c9a8ff] md:inline">
                            Administrateur
                        </span>
                        <Link
                            href="/"
                            title="Quitter l'administration (sans se déconnecter)"
                            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-[#600bd1] px-3 py-1.5 text-sm font-semibold text-white shadow-md shadow-[#600bd1]/30 transition hover:bg-[#7a2de8]"
                        >
                            <ArrowLeftToLine className="h-4 w-4 shrink-0" />
                            <span className="hidden sm:inline">Retour au site</span>
                            <span className="sm:hidden">Site</span>
                        </Link>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
            </div>
        </div>
    );
}
