"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Pause, Play } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { publicFetch } from "@/lib/publicApi";
import { useI18n } from "@/context/I18nContext";

type CarouselApiItem = {
    id: number;
    imageUrl: string;
    title?: string | null;
    subtitle?: string | null;
    titleEn?: string | null;
    subtitleEn?: string | null;
    linkUrl?: string | null;
};

function pickLocalized(
    slide: CarouselApiItem,
    locale: "fr" | "en"
): { title: string | null; subtitle: string | null } {
    if (locale === "en") {
        const enTitle = slide.titleEn?.trim();
        const enSubtitle = slide.subtitleEn?.trim();
        return {
            title: enTitle && enTitle.length > 0 ? enTitle : slide.title ?? null,
            subtitle: enSubtitle && enSubtitle.length > 0 ? enSubtitle : slide.subtitle ?? null,
        };
    }
    return { title: slide.title ?? null, subtitle: slide.subtitle ?? null };
}

function useLocalizedFallbackSlides(): CarouselApiItem[] {
    const { t } = useI18n();
    return useMemo(
        () => [
            {
                id: 1,
                imageUrl:
                    "https://images.unsplash.com/photo-1544197150-b99a5802146f?auto=format&fit=crop&w=1920&q=85",
                title: t("carousel.fb1.title"),
                subtitle: t("carousel.fb1.subtitle"),
                linkUrl: "/catalog",
            },
            {
                id: 2,
                imageUrl:
                    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1920&q=85",
                title: t("carousel.fb2.title"),
                subtitle: t("carousel.fb2.subtitle"),
                linkUrl: "/product/cyna-soc-managed",
            },
            {
                id: 3,
                imageUrl:
                    "https://images.unsplash.com/photo-1563206767-5b18f218e8de?auto=format&fit=crop&w=1920&q=85",
                title: t("carousel.fb3.title"),
                subtitle: t("carousel.fb3.subtitle"),
                linkUrl: "/support#contact",
            },
        ],
        [t]
    );
}

export default function HomeCarousel() {
    const { t, locale } = useI18n();
    const fallbackSlides = useLocalizedFallbackSlides();
    const [slides, setSlides] = useState<CarouselApiItem[] | null>(null);
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const [liveMsg, setLiveMsg] = useState("");
    const scrollerRef = useRef<HTMLDivElement>(null);
    const slideRefs = useRef<(HTMLElement | null)[]>([]);
    const skipScrollSync = useRef(false);

    useEffect(() => {
        let cancelled = false;
        publicFetch<CarouselApiItem[]>("/carousel")
            .then((data) => {
                if (!cancelled && Array.isArray(data) && data.length > 0) {
                    setSlides(data);
                }
            })
            .catch(() => {
                if (!cancelled) setSlides([]);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    const effectiveSlides = useMemo(() => {
        if (slides && slides.length > 0) return slides;
        return fallbackSlides;
    }, [slides, fallbackSlides]);

    useEffect(() => {
        if (index >= effectiveSlides.length) setIndex(0);
    }, [effectiveSlides.length, index]);

    const scrollToSlide = useCallback((i: number, behavior: ScrollBehavior = "smooth") => {
        const root = scrollerRef.current;
        const el = slideRefs.current[i];
        if (!root || !el) return;
        skipScrollSync.current = true;
        const target = el.offsetLeft - (root.clientWidth - el.offsetWidth) / 2;
        const max = Math.max(0, root.scrollWidth - root.clientWidth);
        const left = Math.max(0, Math.min(target, max));
        root.scrollTo({ left, behavior });
        setIndex(i);
        window.setTimeout(() => {
            skipScrollSync.current = false;
        }, 550);
    }, []);

    useEffect(() => {
        if (paused || effectiveSlides.length <= 1) return;
        const tmr = window.setInterval(() => {
            setIndex((prev) => {
                const next = (prev + 1) % effectiveSlides.length;
                const root = scrollerRef.current;
                const el = slideRefs.current[next];
                if (root && el) {
                    skipScrollSync.current = true;
                    const target = el.offsetLeft - (root.clientWidth - el.offsetWidth) / 2;
                    const max = Math.max(0, root.scrollWidth - root.clientWidth);
                    const left = Math.max(0, Math.min(target, max));
                    root.scrollTo({ left, behavior: "smooth" });
                    window.setTimeout(() => {
                        skipScrollSync.current = false;
                    }, 550);
                }
                return next;
            });
        }, 6500);
        return () => clearInterval(tmr);
    }, [paused, effectiveSlides.length]);

    const onScroll = useCallback(() => {
        if (skipScrollSync.current) return;
        const root = scrollerRef.current;
        if (!root) return;
        const mid = root.scrollLeft + root.clientWidth / 2;
        let best = 0;
        let bestDist = Infinity;
        slideRefs.current.forEach((el, i) => {
            if (!el) return;
            const c = el.offsetLeft + el.offsetWidth / 2;
            const d = Math.abs(c - mid);
            if (d < bestDist) {
                bestDist = d;
                best = i;
            }
        });
        setIndex((prev) => (prev === best ? prev : best));
    }, []);

    useEffect(() => {
        const slide = effectiveSlides[index];
        const title = slide ? pickLocalized(slide, locale).title ?? "Cyna" : "Cyna";
        setLiveMsg(
            t("carousel.live", {
                current: index + 1,
                total: effectiveSlides.length,
                title,
            })
        );
    }, [index, effectiveSlides, t, locale]);

    const slideKey = (s: CarouselApiItem, i: number) => (s.id != null ? s.id : i);

    return (
        <section
            className="relative w-full overflow-hidden bg-[#050508] py-14 md:py-20"
            role="region"
            aria-roledescription="carousel"
            aria-label={t("carousel.region")}
        >
            <p className="sr-only" aria-live="polite">
                {liveMsg}
            </p>

            <div className="max-w-7xl mx-auto px-5 md:px-10 lg:px-14 mb-8 md:mb-10">
                <h2 className="cyna-heading text-gray-100">
                    {t("carousel.highlights")}
                </h2>
            </div>

            <div
                ref={scrollerRef}
                onScroll={onScroll}
                className={cn(
                    "no-scrollbar relative z-10 flex w-full snap-x snap-mandatory gap-4 overflow-x-auto px-5 pt-4 pb-2 md:gap-6 md:px-10 lg:px-14",
                    "scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                )}
            >
                {effectiveSlides.map((slide, i) => {
                    const localized = pickLocalized(slide, locale);
                    const title = localized.title ?? "Cyna";
                    const subtitle = localized.subtitle ?? "";
                    const href =
                        slide.linkUrl && slide.linkUrl.length > 0 ? slide.linkUrl : "/catalog";
                    return (
                        <article
                            key={slideKey(slide, i)}
                            ref={(el) => {
                                slideRefs.current[i] = el;
                            }}
                            aria-hidden={i !== index}
                            className={cn(
                                "relative min-h-[min(78vh,720px)] w-[min(94vw,1120px)] flex-shrink-0 snap-center snap-always overflow-hidden rounded-[32px]",
                                // Halo violet diffus + léger halo noir dense, pour adoucir la transition avec le fond #15012b de la page
                                "shadow-[0_40px_120px_-20px_rgba(96,11,209,0.35),0_20px_60px_-10px_rgba(21,1,43,0.9)] ring-1 ring-white/10"
                            )}
                        >
                            <div className="absolute inset-0">
                                <img
                                    src={slide.imageUrl}
                                    alt=""
                                    decoding="async"
                                    className="h-full w-full scale-105 object-cover"
                                />
                                <div
                                    className="absolute inset-0 bg-gradient-to-t from-[#15012b] via-[#15012b]/75 to-[#15012b]/20"
                                    aria-hidden
                                />
                                <div
                                    className="absolute inset-0 bg-gradient-to-r from-black/55 via-transparent to-black/20"
                                    aria-hidden
                                />
                                {i === 0 ? (
                                    <div
                                        className="pointer-events-none absolute inset-0 z-[1] flex items-start justify-end overflow-hidden pt-6 pr-2 md:pt-10 md:pr-8"
                                        aria-hidden
                                    >
                                        <span
                                            className="select-none bg-gradient-to-br from-white/[0.14] to-white/[0.02] bg-clip-text font-extralight leading-none tracking-[-0.07em] text-transparent [font-feature-settings:'tnum']"
                                            style={{
                                                fontFamily:
                                                    'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif',
                                                fontSize: "clamp(4.5rem, 22vw, 16rem)",
                                            }}
                                        >
                                            2026
                                        </span>
                                    </div>
                                ) : null}
                            </div>

                            <div className="relative z-10 flex min-h-[min(78vh,720px)] flex-col justify-center px-8 py-20 md:px-14 md:py-24">
                                <h3 className="cyna-heading max-w-3xl text-balance text-white">
                                    {title}
                                </h3>
                                {subtitle ? (
                                    <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-white/88 md:text-xl">
                                        {subtitle}
                                    </p>
                                ) : null}
                                <div className="mt-10">
                                    <Link
                                        href={href}
                                        className="inline-flex items-center text-sm font-semibold text-white underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-white"
                                    >
                                        {t("carousel.learnMore")} →
                                    </Link>
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>

            {effectiveSlides.length > 1 ? (
                <div className="pointer-events-none absolute inset-x-0 bottom-2 z-20 flex items-center justify-center gap-3 md:bottom-4">
                    <div
                        className="pointer-events-auto flex items-center gap-2 rounded-full bg-zinc-900/95 px-3 py-2 ring-1 ring-white/10 backdrop-blur-md"
                        role="group"
                        aria-label={t("carousel.dots")}
                    >
                        {effectiveSlides.map((_, idx) => (
                            <button
                                key={idx}
                                type="button"
                                aria-current={index === idx ? "true" : undefined}
                                onClick={() => scrollToSlide(idx)}
                                className={cn(
                                    "h-2 rounded-full transition-all duration-300 ease-out",
                                    index === idx
                                        ? "w-8 bg-zinc-100"
                                        : "w-2 bg-zinc-500 hover:bg-zinc-400"
                                )}
                                aria-label={t("carousel.goTo", { n: idx + 1 })}
                            />
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={() => setPaused((p) => !p)}
                        className={cn(
                            "pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full",
                            "bg-zinc-900/95 text-zinc-200 ring-1 ring-white/10 backdrop-blur-md transition-colors",
                            "hover:bg-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyna-500"
                        )}
                        aria-label={paused ? t("carousel.play") : t("carousel.pause")}
                    >
                        {paused ? <Play className="h-4 w-4" aria-hidden /> : <Pause className="h-4 w-4" aria-hidden />}
                    </button>
                </div>
            ) : null}
        </section>
    );
}
