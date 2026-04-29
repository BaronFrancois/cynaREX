"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    Package,
    Tags,
    ShoppingBag,
    Repeat,
    FileText,
    Images,
    Type,
    MessageSquare,
    Bot,
    ArrowLeftToLine,
    LogOut,
    X,
} from "lucide-react";
import { clearAuthToken } from "@/lib/authCookie";
import { useRouter } from "next/navigation";

type NavLink = {
    href: string;
    label: string;
    icon: typeof LayoutDashboard;
    exact?: boolean;
};

const LINKS: NavLink[] = [
    { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
    { href: "/admin/users", label: "Utilisateurs", icon: Users },
    { href: "/admin/products", label: "Produits", icon: Package },
    { href: "/admin/categories", label: "Catégories", icon: Tags },
    { href: "/admin/orders", label: "Commandes", icon: ShoppingBag },
    { href: "/admin/subscriptions", label: "Abonnements", icon: Repeat },
    { href: "/admin/invoices", label: "Factures", icon: FileText },
    { href: "/admin/carousel", label: "Carrousel", icon: Images },
    { href: "/admin/home-content", label: "Contenu d'accueil", icon: Type },
    { href: "/admin/contact", label: "Messages", icon: MessageSquare },
    { href: "/admin/chatbot", label: "Chatbot", icon: Bot },
];

export default function AdminSidebar({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) {
    const pathname = usePathname();
    const router = useRouter();

    function isActive(href: string, exact?: boolean) {
        if (exact) return pathname === href;
        return pathname === href || pathname.startsWith(href + "/");
    }

    function handleLogout() {
        clearAuthToken();
        router.replace("/auth/login");
    }

    return (
        <>
            {/* Overlay mobile */}
            {open && (
                <div
                    className="fixed inset-0 z-30 bg-black/60 lg:hidden"
                    onClick={onClose}
                    aria-hidden
                />
            )}

            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-white/10 bg-[#0d0118]/95 backdrop-blur",
                    "transition-transform duration-200 lg:translate-x-0 lg:static lg:z-0",
                    open ? "translate-x-0" : "-translate-x-full",
                )}
            >
                {/* Entête sidebar */}
                <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
                    <Link href="/admin" className="flex items-center gap-2" onClick={onClose}>
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#600bd1] to-[#8b5cf6] font-bold text-white shadow-lg">
                            C
                        </span>
                        <div>
                            <p className="text-sm font-semibold text-white">Cyna Admin</p>
                            <p className="text-[11px] text-white/50">Backoffice SaaS</p>
                        </div>
                    </Link>
                    <button
                        className="rounded-lg p-1 text-white/70 hover:bg-white/10 lg:hidden"
                        onClick={onClose}
                        aria-label="Fermer le menu"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto px-3 py-4">
                    <ul className="space-y-1">
                        {LINKS.map(({ href, label, icon: Icon, exact }) => {
                            const active = isActive(href, exact);
                            return (
                                <li key={href}>
                                    <Link
                                        href={href}
                                        onClick={onClose}
                                        className={cn(
                                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
                                            active
                                                ? "bg-[#600bd1]/25 text-white shadow-[inset_0_0_0_1px_rgba(139,92,246,0.35)]"
                                                : "text-white/70 hover:bg-white/5 hover:text-white",
                                        )}
                                    >
                                        <Icon className="h-4 w-4 shrink-0" />
                                        <span>{label}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Pied sidebar */}
                <div className="border-t border-white/10 px-3 py-3 space-y-1">
                    <Link
                        href="/"
                        onClick={onClose}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white"
                    >
                        <ArrowLeftToLine className="h-4 w-4" />
                        Retour au site
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-rose-300 hover:bg-rose-500/10 hover:text-rose-200"
                    >
                        <LogOut className="h-4 w-4" />
                        Déconnexion
                    </button>
                </div>
            </aside>
        </>
    );
}
