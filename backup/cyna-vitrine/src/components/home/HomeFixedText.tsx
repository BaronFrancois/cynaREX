"use client";

import React, { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { publicFetch } from "@/lib/publicApi";
import { useI18n } from "@/context/I18nContext";

type HomeTextBlock = { identifier: string; content: string };

function parseContent(raw: string, fallbackTitle: string, fallbackBody: string): { title: string; body: string } {
    try {
        const j = JSON.parse(raw) as { title?: string; body?: string };
        if (j.title && j.body) return { title: j.title, body: j.body };
    } catch {
        /* plain text = body only */
    }
    return { title: fallbackTitle, body: raw || fallbackBody };
}

export default function HomeFixedText() {
    const { locale, t } = useI18n();
    const [title, setTitle] = useState(() => t("home.intro.title"));
    const [body, setBody] = useState(() => t("home.intro.body"));

    useEffect(() => {
        if (locale === "en") {
            setTitle(t("home.intro.title"));
            setBody(t("home.intro.body"));
            return;
        }

        let cancelled = false;
        publicFetch<HomeTextBlock>("/home-text-blocks/home_intro")
            .then((block) => {
                if (cancelled) return;
                if (block?.content) {
                    const p = parseContent(block.content, t("home.intro.title"), t("home.intro.body"));
                    setTitle(p.title);
                    setBody(p.body);
                    return;
                }
                setTitle(t("home.intro.title"));
                setBody(t("home.intro.body"));
            })
            .catch(() => {
                if (!cancelled) {
                    setTitle(t("home.intro.title"));
                    setBody(t("home.intro.body"));
                }
            });
        return () => {
            cancelled = true;
        };
    }, [locale, t]);

    return (
        <section className="py-16 bg-[#09090f] border-b border-zinc-900">
            <div className="max-w-4xl mx-auto px-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-violet-950/50 mb-6 border border-violet-800/50">
                    <ShieldCheck className="w-6 h-6 text-cyna-500" />
                </div>
                <h2 className="cyna-heading text-gray-100 mb-4">{title}</h2>
                <p className="text-gray-400 text-lg leading-relaxed font-light">{body}</p>
            </div>
        </section>
    );
}
