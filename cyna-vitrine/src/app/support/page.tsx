"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { MessageSquare, Send, X, Bot } from "lucide-react";
import { Button } from "@/components/ui/Button";
import api from "@/lib/api";
import { chatWithCyna } from "@/services/geminiService";
import AppLayout from "@/layout/AppLayout";
import { matchPredefinedAnswer, supportFaqForLocale } from "@/lib/supportFaq";
import { useI18n } from "@/context/I18nContext";
import { supportPageUi } from "@/i18n/supportPageUi";

interface ContactForm {
    email: string;
    subject: string;
    message: string;
}

interface ContactErrors {
    email?: string;
    subject?: string;
    message?: string;
}

export default function SupportPage() {
    const { locale } = useI18n();
    const ui = supportPageUi(locale);
    const faqItems = supportFaqForLocale(locale);
    const pathname = usePathname();
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [input, setInput] = useState("");
    const [history, setHistory] = useState<
        { role: "user" | "model"; parts: { text: string }[] }[]
    >([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // ── Formulaire de contact ──
    const [contact, setContact] = useState<ContactForm>({ email: "", subject: "", message: "" });
    const [contactErrors, setContactErrors] = useState<ContactErrors>({});
    const [contactSending, setContactSending] = useState(false);
    const [contactSent, setContactSent] = useState(false);

    useEffect(() => {
        const first = supportPageUi(locale).subjectOptions[0] ?? "";
        setContact((c) => ({ ...c, subject: first }));
    }, [locale]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [history, isChatOpen]);

    /** Défilement vers #contact (lien footer « Nous contacter », même page, navigation initiale) */
    useEffect(() => {
        if (pathname !== "/support") return;

        const scrollToContact = () => {
            if (window.location.hash !== "#contact") return;
            const el = document.getElementById("contact");
            if (el) {
                requestAnimationFrame(() => {
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                });
            }
        };

        scrollToContact();
        const t = setTimeout(scrollToContact, 150);
        window.addEventListener("hashchange", scrollToContact);
        return () => {
            clearTimeout(t);
            window.removeEventListener("hashchange", scrollToContact);
        };
    }, [pathname]);

    // ── Soumission du formulaire contact ──
    const handleContactSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errs: ContactErrors = {};
        if (!contact.email || !/\S+@\S+\.\S+/.test(contact.email)) errs.email = ui.emailInvalid;
        if (!contact.subject) errs.subject = ui.subjectRequired;
        if (!contact.message.trim() || contact.message.trim().length < 10) errs.message = ui.messageShort;
        setContactErrors(errs);
        if (Object.keys(errs).length > 0) return;

        setContactSending(true);
        try {
            await api().post("/contact", {
                email: contact.email,
                subject: contact.subject,
                message: contact.message.trim(),
            });
        } catch {
            // mock : on considère l'envoi comme réussi même si l'API échoue
        } finally {
            setContactSending(false);
            setContactSent(true);
            setContact({
                email: "",
                subject: supportPageUi(locale).subjectOptions[0] ?? "",
                message: "",
            });
        }
    };

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setInput("");
        const newHistory = [
            ...history,
            { role: "user" as const, parts: [{ text: userMsg }] },
        ];
        setHistory(newHistory);
        setIsLoading(true);

        const predefined = matchPredefinedAnswer(userMsg, locale);
        if (predefined) {
            setHistory([
                ...newHistory,
                { role: "model" as const, parts: [{ text: predefined }] },
            ]);
            setIsLoading(false);
            return;
        }

        const responseText = await chatWithCyna(userMsg, history);

        setHistory([
            ...newHistory,
            { role: "model" as const, parts: [{ text: responseText }] },
        ]);
        setIsLoading(false);
    };

    return (
        <AppLayout> {/* className="min-h-screen bg-white" */}
            {/* Support Hero */}
            <div className="bg-zinc-950 py-20 text-center px-4">
                <h1 className="cyna-heading cyna-heading--center text-gray-100 mb-6">
                    {ui.heroTitle}
                </h1>
                <div className="max-w-xl mx-auto">
                    <input
                        type="text"
                        placeholder={ui.heroSearchPlaceholder}
                        className="w-full p-4 rounded-full border border-zinc-700 bg-zinc-900 text-gray-200 placeholder-gray-500 shadow-sm focus:ring-2 focus:ring-cyna-500 focus:outline-none"
                    />
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-12">
                <h2 className="cyna-heading text-gray-100 mb-4">
                    {ui.faqTitle}
                </h2>
                <div className="space-y-3 mb-16">
                    {faqItems.map((item) => (
                        <details
                            key={item.id}
                            className="group rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 open:shadow-sm"
                        >
                            <summary className="cursor-pointer font-medium text-gray-200 list-none flex justify-between items-center gap-2">
                                {item.question}
                                <span className="text-cyna-500 text-sm group-open:rotate-180 transition-transform">
                                    ▼
                                </span>
                            </summary>
                            <p className="mt-3 text-sm text-gray-400 leading-relaxed border-t border-zinc-700 pt-3">
                                {item.answer}
                            </p>
                        </details>
                    ))}
                </div>
            </div>

            <section
                id="contact"
                className="scroll-mt-28 max-w-4xl mx-auto px-4 pb-20 grid grid-cols-1 md:grid-cols-2 gap-12"
                aria-labelledby="contact-heading"
            >
                {/* Contact Form */}
                <div>
                    <h2 id="contact-heading" className="cyna-heading text-gray-100 mb-6">
                        {ui.contactHeading}
                    </h2>

                    {contactSent ? (
                        <div className="bg-green-950/40 border border-green-800 rounded-2xl p-6 text-center space-y-2">
                            <p className="text-green-400 font-semibold text-lg">{ui.contactSentTitle}</p>
                            <p className="text-gray-400 text-sm">{ui.contactSentBody}</p>
                            <button
                                onClick={() => setContactSent(false)}
                                className="mt-2 text-sm text-cyna-500 hover:underline"
                            >
                                {ui.contactSentAgain}
                            </button>
                        </div>
                    ) : (
                        <form className="space-y-4" onSubmit={handleContactSubmit} noValidate>
                            <div>
                                <label htmlFor="contact-email" className="block text-sm font-medium text-gray-300 mb-1">
                                    {ui.emailLabel} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="contact-email"
                                    type="email"
                                    autoComplete="email"
                                    value={contact.email}
                                    onChange={e => { setContact(p => ({ ...p, email: e.target.value })); setContactErrors(p => ({ ...p, email: undefined })); }}
                                    className={`w-full p-3 rounded-lg bg-zinc-800 border ${contactErrors.email ? "border-red-500" : "border-zinc-700"} text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyna-500`}
                                    placeholder={ui.emailPh}
                                    aria-invalid={!!contactErrors.email}
                                    aria-describedby={contactErrors.email ? "contact-email-error" : undefined}
                                />
                                {contactErrors.email && (
                                    <p id="contact-email-error" className="mt-1 text-xs text-red-500" role="alert">
                                        {contactErrors.email}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="contact-subject" className="block text-sm font-medium text-gray-300 mb-1">
                                    {ui.subjectLabel} <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="contact-subject"
                                    value={contact.subject}
                                    onChange={e => setContact(p => ({ ...p, subject: e.target.value }))}
                                    className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyna-500"
                                >
                                    {ui.subjectOptions.map((opt) => (
                                        <option key={opt} value={opt}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="contact-message" className="block text-sm font-medium text-gray-300 mb-1">
                                    {ui.messageLabel} <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="contact-message"
                                    rows={5}
                                    value={contact.message}
                                    onChange={e => { setContact(p => ({ ...p, message: e.target.value })); setContactErrors(p => ({ ...p, message: undefined })); }}
                                    className={`w-full p-3 rounded-lg bg-zinc-800 border ${contactErrors.message ? "border-red-500" : "border-zinc-700"} text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyna-500`}
                                    placeholder={ui.messagePh}
                                    aria-invalid={!!contactErrors.message}
                                    aria-describedby={contactErrors.message ? "contact-message-error" : undefined}
                                />
                                {contactErrors.message && (
                                    <p id="contact-message-error" className="mt-1 text-xs text-red-500" role="alert">
                                        {contactErrors.message}
                                    </p>
                                )}
                            </div>
                            <Button type="submit" variant="primary" className="w-full" disabled={contactSending}>
                                {contactSending ? ui.sending : ui.sendBtn}
                            </Button>
                        </form>
                    )}
                </div>

                {/* Chatbot CTA */}
                <div className="flex flex-col justify-center items-center bg-violet-950/30 rounded-3xl p-10 text-center border border-violet-800">
                    <div className="w-16 h-16 bg-cyna-600 rounded-full flex items-center justify-center text-white mb-6 shadow-lg shadow-violet-900">
                        <MessageSquare size={32} />
                    </div>
                    <h2 className="cyna-heading cyna-heading--center text-gray-100 mb-2">
                        {ui.assistantTitle}
                    </h2>
                    <p className="text-gray-400 mb-8">
                        {ui.assistantBody}
                    </p>
                    <Button variant="primary" onClick={() => setIsChatOpen(true)}>
                        {ui.startChat}
                    </Button>
                </div>
            </section>

            {/* Chat Modal */}
            {isChatOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4"
                    role="presentation"
                >
                    <div
                        className="bg-zinc-900 w-full max-w-md h-[600px] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300 border border-zinc-700"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="chat-dialog-title"
                    >
                        {/* Chat Header */}
                        <div className="bg-zinc-800 p-4 flex justify-between items-center border-b border-zinc-700">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-green-500" aria-hidden />
                                <span id="chat-dialog-title" className="font-semibold text-gray-200">
                                    {ui.chatTitle}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsChatOpen(false)}
                                className="text-gray-400 hover:text-gray-200 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-cyna-500"
                                aria-label={ui.closeChatAria}
                            >
                                <X size={20} aria-hidden />
                            </button>
                        </div>

                        {/* Chat Body */}
                        <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-zinc-900">
                            {history.length === 0 && (
                                <div className="text-center text-gray-500 mt-10">
                                    <Bot
                                        size={48}
                                        className="mx-auto mb-4 opacity-20"
                                    />
                                    <p>{ui.chatEmpty}</p>
                                </div>
                            )}
                            {history.map((msg, i) => (
                                <div
                                    key={i}
                                    className={`flex ${
                                        msg.role === "user"
                                            ? "justify-end"
                                            : "justify-start"
                                    }`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                                            msg.role === "user"
                                                ? "bg-cyna-600 text-white rounded-br-none"
                                                : "bg-zinc-800 text-gray-200 rounded-bl-none"
                                        }`}
                                    >
                                        {msg.parts[0].text}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-zinc-800 p-3 rounded-2xl rounded-bl-none flex space-x-1 items-center h-10">
                                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Chat Input */}
                        <div className="p-4 border-t border-zinc-700 bg-zinc-900">
                            <div className="relative">
                                <input
                                    type="text"
                                    className="w-full pl-4 pr-12 py-3 bg-zinc-800 text-gray-200 placeholder-gray-500 rounded-full focus:outline-none focus:ring-2 focus:ring-cyna-500"
                                    placeholder={ui.chatInputPh}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) =>
                                        e.key === "Enter" && handleSendMessage()
                                    }
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
                </div>
            )}
        </AppLayout>
    );
}
