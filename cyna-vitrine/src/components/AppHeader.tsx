"use client"

import { useState, useEffect } from "react";
import {
    ShoppingBag,
    Menu,
    X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AppSearch from "./AppSearch";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import useCart from "@/hooks/useCart";
import { useI18n } from "@/context/I18nContext";
import { LanguageSwitcher } from "./LanguageSwitcher";

export default function AppHeader() {
    const { t } = useI18n();
    const pathname = usePathname();
    const { itemCount } = useCart();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    /** Sur le catalogue en desktop, la recherche est dans le hero — masquer la loupe du header */
    const catalogDesktopHidesHeaderSearch =
        pathname.startsWith("/catalog");

    const isNavActive = (path: string) =>
        path === "/"
            ? pathname === "/"
            : pathname === path || pathname.startsWith(path + "/");

    const navClass = (path: string) =>
        cn(
            "nav-sku-raised nav-sku-header-login inline-flex items-center justify-center gap-1.5 text-sm font-medium leading-none whitespace-nowrap transition-colors",
            isNavActive(path) && "nav-sku-header-active"
        );

    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const hasCookie = document.cookie.includes("auth_token=");
        if (token || hasCookie) {
            setIsAuthenticated(true);
        }
    }, []);

    return (
        <>
        <nav
            className={cn(
                "sticky top-0 z-[60] w-full border-b border-white/10",
                /* Mobile : moins de blur (backdrop-filter + sticky = saccades iOS/Android) */
                "bg-zinc-950/92 backdrop-blur-sm backdrop-saturate-150 supports-[backdrop-filter]:bg-zinc-950/88",
                "md:bg-zinc-950/70 md:backdrop-blur-xl md:supports-[backdrop-filter]:bg-zinc-950/60",
                /* Compositing GPU — évite le « tremblement » au scroll */
                "isolate [transform:translateZ(0)] [-webkit-backface-visibility:hidden]"
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-transparent">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-4 md:space-x-8">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <Link
                                href="/"
                                className="flex flex-shrink-0 cursor-pointer items-center gap-2 py-1 font-semibold tracking-tight transition-opacity hover:opacity-85"
                                aria-label={t("header.logoAria")}
                            >
                                <img 
                                    src="/logo-cyna-white.svg" 
                                    alt="Cyna" 
                                    className="h-7 min-[400px]:h-8 w-auto mt-0.5" 
                                />
                            </Link>
                        </div>
                        <div className="hidden md:flex items-center space-x-1 overflow-visible py-0.5">
                            <Link href="/catalog" className={navClass("/catalog")}>
                                {t("header.solutions")}
                            </Link>
                            <Link href="/support" className={navClass("/support")}>
                                {t("header.support")}
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6">
                        <div
                            className={cn(
                                "flex items-center",
                                catalogDesktopHidesHeaderSearch && "md:hidden"
                            )}
                        >
                            <AppSearch />
                        </div>
                        <LanguageSwitcher />
                        <Link
                            href="/cart"
                            className="relative inline-flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center text-slate-200 transition-colors hover:text-cyna-500"
                            aria-label={
                                itemCount > 0
                                    ? itemCount > 1
                                        ? t("header.cartWithCountPlural", { count: itemCount })
                                        : t("header.cartWithCount", { count: itemCount })
                                    : t("header.cart")
                            }
                        >
                            <ShoppingBag size={20} />
                            {itemCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-cyna-600 px-1 text-[10px] font-bold text-white">
                                    {itemCount > 99 ? "99+" : itemCount}
                                </span>
                            )}
                        </Link>
                        {isAuthenticated ? (
                            <Link
                                href="/account"
                                className={cn(
                                    "hidden sm:inline-flex nav-sku-raised nav-sku-header-login items-center justify-center text-sm font-medium leading-none transition-colors",
                                    pathname === "/account" && "nav-sku-header-active"
                                )}
                            >
                                {t("header.account")}
                            </Link>
                        ) : (
                            <Link
                                href="/auth/login"
                                className={cn(
                                    "hidden sm:inline-flex nav-sku-raised nav-sku-header-login items-center justify-center text-sm font-medium leading-none transition-colors",
                                    pathname === "/auth/login" && "nav-sku-header-active"
                                )}
                            >
                                {t("header.login")}
                            </Link>
                        )}
                        <div className="flex items-center md:hidden">
                            <Popover open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                                <PopoverTrigger asChild>
                                    <button
                                        type="button"
                                        className={cn(
                                            "relative inline-flex shrink-0 cursor-pointer items-center justify-center p-0 transition-all duration-300",
                                            "w-9 h-9 rounded-full text-slate-200 hover:text-cyna-500",
                                            mobileMenuOpen ? "nav-sku-raised nav-sku-header-login nav-sku-header-active border-0" : ""
                                        )}
                                        aria-expanded={mobileMenuOpen}
                                        aria-label={
                                            mobileMenuOpen ? t("header.menuClose") : t("header.menuOpen")
                                        }
                                    >
                                        <Menu
                                            className={cn(
                                                "absolute h-5 w-5 transition-all duration-300 ease-out",
                                                mobileMenuOpen
                                                    ? "scale-0 rotate-90 opacity-0"
                                                    : "scale-100 rotate-0 opacity-100"
                                            )}
                                            strokeWidth={2}
                                            aria-hidden
                                        />
                                        <X
                                            className={cn(
                                                "absolute h-5 w-5 transition-all duration-300 ease-out",
                                                mobileMenuOpen
                                                    ? "scale-100 rotate-0 opacity-100"
                                                    : "scale-0 -rotate-90 opacity-0"
                                            )}
                                            strokeWidth={2}
                                            aria-hidden
                                        />
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent
                                    align="end"
                                    sideOffset={14}
                                    collisionPadding={{ right: 0, left: 8 }}
                                    className={cn(
                                        "z-[70] w-56 border-0 p-0 shadow-lg -mr-4 sm:-mr-6 rounded-none rounded-b-2xl",
                                        "duration-300 ease-out",
                                        "data-[state=open]:animate-in data-[state=closed]:animate-out",
                                        "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
                                        "data-[side=bottom]:slide-in-from-top-10 data-[side=bottom]:slide-out-to-top-6"
                                    )}
                                >
                                    <div 
                                        className="flex flex-col gap-1.5 p-3 rounded-none rounded-b-2xl border border-black/60 shadow-2xl relative z-[70] border-t-0"
                                        style={{ background: 'linear-gradient(rgb(2, 0, 8) 0%, rgb(22, 11, 48) 100%)', boxShadow: 'rgba(0, 0, 0, 0.6) 0px 5px 11px 6px, rgba(131, 109, 203, 0.42) 0px -1px 0px 0px inset' }}
                                    >
                                        <Link
                                            href="/catalog"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={cn(
                                                "flex w-full min-h-9 items-center justify-center nav-sku-raised nav-sku-header-login text-center text-sm font-medium",
                                                pathname.startsWith("/catalog") && "nav-sku-header-active"
                                            )}
                                        >
                                            {t("header.solutions")}
                                        </Link>
                                        <Link
                                            href="/support"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={cn(
                                                "flex w-full min-h-9 items-center justify-center nav-sku-raised nav-sku-header-login text-center text-sm font-medium",
                                                pathname.startsWith("/support") && "nav-sku-header-active"
                                            )}
                                        >
                                            {t("header.support")}
                                        </Link>

                                        <div className="my-1.5 h-px bg-zinc-700/50" />

                                        <Link
                                            href="/cart"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={cn(
                                                "flex w-full min-h-9 nav-sku-raised nav-sku-header-login items-center justify-center gap-2 text-sm font-medium",
                                                pathname === "/cart" && "nav-sku-header-active"
                                            )}
                                        >
                                            <span>{t("header.cart")}</span>
                                            {itemCount > 0 && (
                                                <span className="rounded-full bg-cyna-500 shadow-inner px-2 py-0.5 text-[11px] font-bold text-white">
                                                    {itemCount > 99 ? "99+" : itemCount}
                                                </span>
                                            )}
                                        </Link>
                                        {isAuthenticated ? (
                                            <Link
                                                href="/account"
                                                onClick={() => setMobileMenuOpen(false)}
                                                className={cn(
                                                    "flex w-full min-h-9 items-center justify-center nav-sku-raised nav-sku-header-login text-center text-sm font-medium",
                                                    pathname === "/account" && "nav-sku-header-active"
                                                )}
                                            >
                                                {t("header.accountShort")}
                                            </Link>
                                        ) : (
                                            <Link
                                                href="/auth/login"
                                                onClick={() => setMobileMenuOpen(false)}
                                                className={cn(
                                                    "flex w-full min-h-9 items-center justify-center nav-sku-raised nav-sku-header-login text-center text-sm font-medium",
                                                    pathname === "/auth/login" && "nav-sku-header-active"
                                                )}
                                            >
                                                {t("header.login")}
                                            </Link>
                                        )}

                                        <div className="mt-2 mb-1 h-px bg-zinc-800/80" />
                                        
                                        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 px-1 py-1 text-[11px] text-gray-400">
                                            <Link href="/cgu" onClick={() => setMobileMenuOpen(false)} className="hover:text-cyna-500 transition-colors">{t("footer.cgu")}</Link>
                                            <Link href="/mentions-legales" onClick={() => setMobileMenuOpen(false)} className="hover:text-cyna-500 transition-colors">{t("footer.legal")}</Link>
                                            <Link href="/sav" onClick={() => setMobileMenuOpen(false)} className="hover:text-cyna-500 transition-colors">{t("footer.sav")}</Link>
                                            <Link href="/support#contact" onClick={() => setMobileMenuOpen(false)} className="hover:text-cyna-500 transition-colors">{t("footer.contact")}</Link>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
        {/* Backdrop for mobile menu */}
        {mobileMenuOpen && (
            <div 
                className="fixed inset-0 top-16 z-[55] bg-black/50 backdrop-blur-md transition-all duration-300"
                aria-hidden="true"
                onClick={() => setMobileMenuOpen(false)}
            />
        )}
        </>
    );
}
