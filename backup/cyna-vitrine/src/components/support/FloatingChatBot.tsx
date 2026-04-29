"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Bot, Send, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CynaLogo } from "@/components/CynaLogo";
import { useI18n } from "@/context/I18nContext";
import { supportPageUi } from "@/i18n/supportPageUi";
import { chatWithCyna } from "@/services/geminiService";
import { matchPredefinedAnswer } from "@/lib/supportFaq";

type ChatMessage = { role: "user" | "model"; parts: { text: string }[] };

const STORAGE_KEY = "cyna-fab-chat-history";
const NOTIFICATION_DISMISSED_KEY = "cyna-fab-notification-dismissed";
const MAX_STORED_MESSAGES = 50;

// Routes où le FAB ne s'affiche pas
// - /support : il y a déjà un CTA dédié + la modale interne
// - /admin : interface de back-office
// - /checkout : on évite de distraire au moment du paiement
const HIDDEN_PREFIXES = ["/support", "/admin", "/checkout"];

function shouldHide(pathname: string | null): boolean {
    if (!pathname) return false;
    return HIDDEN_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export default function FloatingChatBot() {
    const pathname = usePathname();
    const { locale } = useI18n();
    const ui = supportPageUi(locale);

    const [open, setOpen] = useState(false);
    const [input, setInput] = useState("");
    const [history, setHistory] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    /** Pastille « nouveau » sur le FAB : disparaît au premier clic, mémorisée en localStorage */
    const [showFabNotification, setShowFabNotification] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        try {
            if (localStorage.getItem(NOTIFICATION_DISMISSED_KEY) !== "1") {
                setShowFabNotification(true);
            }
        } catch {
            setShowFabNotification(true);
        }
    }, []);

    // Restauration de l'historique depuis localStorage
    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw) as ChatMessage[];
                if (Array.isArray(parsed)) setHistory(parsed);
            }
        } catch {
            // localStorage indisponible / JSON corrompu : on ignore
        }
    }, []);

    // Persistance des messages (tronqués)
    useEffect(() => {
        try {
            const toStore = history.slice(-MAX_STORED_MESSAGES);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
        } catch {
            // Quota dépassé : on ignore, le chat fonctionne toujours en mémoire
        }
    }, [history]);

    useEffect(() => {
        if (open) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [history, open]);

    useEffect(() => {
        if (open) {
            const t = setTimeout(() => inputRef.current?.focus(), 100);
            return () => clearTimeout(t);
        }
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    const handleFabClick = () => {
        if (showFabNotification) {
            try {
                localStorage.setItem(NOTIFICATION_DISMISSED_KEY, "1");
            } catch {
                // ignore
            }
            setShowFabNotification(false);
        }
        setOpen((v) => !v);
    };

    const handleSendMessage = useCallback(async () => {
        const userMsg = input.trim();
        if (!userMsg || isLoading) return;

        setInput("");
        const newHistory: ChatMessage[] = [
            ...history,
            { role: "user", parts: [{ text: userMsg }] },
        ];
        setHistory(newHistory);
        setIsLoading(true);

        const predefined = matchPredefinedAnswer(userMsg, locale);
        if (predefined) {
            setHistory([...newHistory, { role: "model", parts: [{ text: predefined }] }]);
            setIsLoading(false);
            return;
        }

        const responseText = await chatWithCyna(userMsg, history, locale);
        setHistory([...newHistory, { role: "model", parts: [{ text: responseText }] }]);
        setIsLoading(false);
    }, [history, input, isLoading, locale]);

    if (shouldHide(pathname)) return null;

    return (
        <>
            {/* Backdrop flouté */}
            <div
                aria-hidden
                onClick={() => setOpen(false)}
                className={cn(
                    "fixed inset-0 z-40 bg-black/40 backdrop-blur-md transition-opacity duration-300",
                    open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
            />

            {/* Modale chat */}
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="fab-chat-title"
                aria-hidden={!open}
                className={cn(
                    "fixed z-50 flex flex-col overflow-hidden rounded-3xl border border-zinc-700 bg-zinc-900 shadow-2xl",
                    "transition-all duration-300 ease-out",
                    // Position : ancrée près du FAB en bas à droite sur desktop,
                    // full-width avec marge sur mobile.
                    "bottom-24 right-4 sm:right-6 left-4 sm:left-auto",
                    "sm:w-[380px] max-w-[calc(100vw-2rem)]",
                    "h-[min(560px,calc(100dvh-7rem))]",
                    open
                        ? "opacity-100 translate-y-0 pointer-events-auto scale-100"
                        : "opacity-0 translate-y-4 pointer-events-none scale-95"
                )}
            >
                {/* Header */}
                <div className="bg-zinc-800 p-4 flex justify-between items-center border-b border-zinc-700">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" aria-hidden />
                        <span id="fab-chat-title" className="font-semibold text-gray-200">
                            {ui.chatTitle}
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="text-gray-400 hover:text-gray-200 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-cyna-500"
                        aria-label={ui.closeChatAria}
                    >
                        <X size={20} aria-hidden />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-zinc-900">
                    {history.length === 0 && (
                        <div className="text-center text-gray-500 mt-10">
                            <Bot size={48} className="mx-auto mb-4 opacity-20" aria-hidden />
                            <p>{ui.chatEmpty}</p>
                        </div>
                    )}
                    {history.map((msg, i) => (
                        <div
                            key={i}
                            className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}
                        >
                            <div
                                className={cn(
                                    "max-w-[80%] p-3 rounded-2xl text-sm",
                                    msg.role === "user"
                                        ? "bg-cyna-600 text-white rounded-br-none"
                                        : "bg-zinc-800 text-gray-200 rounded-bl-none"
                                )}
                            >
                                {msg.parts[0].text}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-zinc-800 p-3 rounded-2xl rounded-bl-none flex space-x-1 items-center h-10">
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100" />
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200" />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-zinc-700 bg-zinc-900">
                    <div className="relative">
                        <input
                            ref={inputRef}
                            type="text"
                            className="w-full pl-4 pr-12 py-3 bg-zinc-800 text-gray-200 placeholder-gray-500 rounded-full focus:outline-none focus:ring-2 focus:ring-cyna-500"
                            placeholder={ui.chatInputPh}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                            aria-label={ui.chatInputAria}
                        />
                        <button
                            type="button"
                            onClick={handleSendMessage}
                            disabled={isLoading || !input.trim()}
                            className="absolute right-2 top-2 p-1.5 bg-cyna-600 text-white rounded-full hover:bg-cyna-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            aria-label={ui.sendMessageAria}
                        >
                            <Send size={16} aria-hidden />
                        </button>
                    </div>
                </div>
            </div>

            {/* Bouton flottant : C blanc, design skeumorphique violet */}
            <button
                type="button"
                onClick={handleFabClick}
                aria-label={open ? ui.fabCloseAria : ui.fabOpenAria}
                aria-expanded={open}
                aria-controls="fab-chat-title"
                className={cn(
                    "fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50",
                    "flex h-14 w-14 items-center justify-center rounded-full",
                    "bg-cyna-600 text-white",
                    "transition-transform duration-200 ease-out",
                    "hover:bg-cyna-700 hover:-translate-y-0.5 active:translate-y-0 active:scale-95",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-cyna-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#15012b]",
                    // Effet skeumorphique cohérent avec les autres CTAs primaires
                    "[box-shadow:0_6px_9px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.04)_inset]",
                    "[border:outset_1px_#b8b8b8]",
                    open &&
                        "ring-2 ring-offset-2 ring-offset-[#15012b] ring-cyna-300/70"
                )}
            >
                {showFabNotification ? (
                    <>
                        <span className="sr-only">{ui.fabNotificationSr}</span>
                        <span
                            className="pointer-events-none absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center"
                            aria-hidden
                        >
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-fuchsia-400 opacity-60" />
                            <span className="relative h-2.5 w-2.5 rounded-full bg-fuchsia-400 shadow-sm ring-2 ring-cyna-600" />
                        </span>
                    </>
                ) : null}
                <CynaLogo
                    variant="white"
                    size={30}
                    className="drop-shadow-[0_2px_3px_rgba(0,0,0,0.45)]"
                />
            </button>
        </>
    );
}
