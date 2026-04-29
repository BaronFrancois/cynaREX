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
    linkUrl?: string | null;
};

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
    const { t } = useI18n();
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
        const title = slide?.title ?? "Cyna";
        setLiveMsg(
            t("carousel.live", {
                current: index + 1,
                total: effectiveSlides.length,
                title,
            })
        );
    }, [index, effectiveSlides, t]);

    const slideKey = (s: CarouselApiItem, i: number) => (s.id != null ? s.id : i);

    return (
        <section
            className="relative w-full overflow-hidden bg-[#050508] pb-14 pt-10 md:pb-20 md:pt-12"
            role="region"
            aria-roledescription="carousel"
            aria-label={t("carousel.region")}
        >
            <p className="sr-only" aria-live="polite">
                {liveMsg}
            </p>

            <div className="relative z-10 mx-auto max-w-[1600px] px-5 md:px-10 lg:px-14">
                <h2 className="cyna-heading text-white">
                    {t("carousel.highlights")}
                </h2>
            </div>

            <div
                ref={scrollerRef}
                onScroll={onScroll}
                className={cn(
                    "no-scrollbar relative z-10 mt-8 flex w-full snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 md:gap-6 md:px-10 lg:px-14",
                    "scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                )}
            >
                {effectiveSlides.map((slide, i) => {
                    const title = slide.title ?? "Cyna";
                    const subtitle = slide.subtitle ?? "";
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
                                "shadow-[0_40px_120px_-30px_rgba(0,0,0,0.85)] ring-1 ring-white/10"
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
                                    className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/25"
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

                            <div className="relative z-10 flex min-h-[min(78vh,720px)] flex-col justify-end px-8 pb-14 pt-28 md:px-14 md:pb-20 md:pt-32">
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
                <div className="relative z-10 mt-8 flex items-center justify-center gap-3 md:mt-10">
                    <div
                        className="flex items-center gap-2 rounded-full bg-zinc-900/95 px-3 py-2 ring-1 ring-white/10 backdrop-blur-md"
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
                            "flex h-10 w-10 items-center justify-center rounded-full",
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
