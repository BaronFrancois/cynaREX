import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Carousel.tsx
// Single-file, production-ready React carousel component using Tailwind + Framer Motion.
// - Features: responsive slidesPerView, autoplay, infinite loop, arrows, dots, swipe, keyboard, lazy img
// - Usage example and API below

export type Slide = {
    key: string | number;
    content: React.ReactNode; // image element, markup, component...
};

export type CarouselProps = {
    slides: Slide[];
    slidesPerView?: number | { [breakpoint: number]: number };
    gap?: number; // px
    autoplay?: boolean;
    interval?: number; // ms
    loop?: boolean;
    showArrows?: boolean;
    showDots?: boolean;
    className?: string;
    initialIndex?: number;
    ariaLabel?: string;
};

function resolveSlidesPerView(
    slidesPerView: CarouselProps["slidesPerView"],
    width: number
) {
    if (typeof slidesPerView === "number" || !slidesPerView) return slidesPerView || 1;
    // slidesPerView is an object like { 0:1, 640:2, 1024:3 }
    const breakpoints = Object.keys(slidesPerView)
        .map((k) => Number(k))
        .sort((a, b) => a - b);
    let result = 1;
    for (const bp of breakpoints) {
        if (width >= bp) result = (slidesPerView as any)[bp];
    }
    return result;
}

const Carousel: React.FC<CarouselProps> = ({
    slides,
    slidesPerView = { 0: 1, 640: 2, 1024: 3 },
    gap = 12,
    autoplay = false,
    interval = 4000,
    loop = true,
    showArrows = true,
    showDots = true,
    className = "",
    initialIndex = 0,
    ariaLabel = "Carousel",
}) => {
    const [index, setIndex] = useState(initialIndex);
    const [containerWidth, setContainerWidth] = useState(0);
    const ref = useRef<HTMLDivElement | null>(null);
    const timer = useRef<number | null>(null);
    const isDragging = useRef(false);
    const touchStartX = useRef<number | null>(null);

    useEffect(() => {
        const handleResize = () => {
            if (!ref.current) return;
            setContainerWidth(ref.current.offsetWidth);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const spv = resolveSlidesPerView(
        slidesPerView,
        containerWidth || window.innerWidth
    );
    const maxIndex = Math.max(0, slides.length - spv);

    useEffect(() => {
        if (!autoplay) return;
        if (timer.current) window.clearInterval(timer.current);
        timer.current = window.setInterval(() => {
            setIndex((prev) => {
                const next = prev + 1;
                if (next > maxIndex) return loop ? 0 : maxIndex;
                return next;
            });
        }, interval);
        return () => {
            if (timer.current) window.clearInterval(timer.current);
        };
    }, [autoplay, interval, maxIndex, loop, spv]);

    useEffect(() => {
        // clamp index
        if (index > maxIndex) setIndex(maxIndex);
        if (index < 0) setIndex(loop ? maxIndex : 0);
    }, [maxIndex]);

    function goTo(i: number) {
        if (i < 0) return setIndex(loop ? maxIndex : 0);
        if (i > maxIndex) return setIndex(loop ? 0 : maxIndex);
        setIndex(i);
    }

    function next() {
        goTo(index + 1);
    }
    function prev() {
        goTo(index - 1);
    }

    // pointer / touch handlers for swipe
    function onPointerDown(e: React.PointerEvent) {
        isDragging.current = true;
        touchStartX.current = e.clientX;
        (e.target as Element).setPointerCapture(e.pointerId);
        if (timer.current) window.clearInterval(timer.current);
    }
    function onPointerUp(e: React.PointerEvent) {
        isDragging.current = false;
        const start = touchStartX.current ?? 0;
        const diff = e.clientX - start;
        const threshold = Math.max(20, containerWidth * 0.06);
        if (diff > threshold) prev();
        if (diff < -threshold) next();
        touchStartX.current = null;
    }
    function onPointerMove(e: React.PointerEvent) {
        // optional: live dragging effect
    }

    function onKeyDown(e: React.KeyboardEvent) {
        if (e.key === "ArrowLeft") prev();
        if (e.key === "ArrowRight") next();
    }

    const translateX = -(index * (containerWidth / spv + gap));

    return (
        <div
            className={`relative w-full ${className}`}
            aria-label={ariaLabel}
            tabIndex={0}
            onKeyDown={onKeyDown}
        >
            {/* Viewport */}
            <div className="overflow-hidden" ref={ref}>
                <motion.div
                    className="flex items-stretch"
                    style={{ gap }}
                    drag={false}
                    animate={{ x: translateX }}
                    transition={{ type: "spring", stiffness: 260, damping: 30 }}
                    onPointerDown={onPointerDown}
                    onPointerUp={onPointerUp}
                    onPointerMove={onPointerMove}
                >
                    {slides.map((s, i) => (
                        <div
                            key={s.key}
                            className="flex-shrink-0"
                            style={{
                                width: `calc(${100 / spv}% - ${
                                    (gap * (spv - 1)) / spv
                                }px)`,
                            }}
                        >
                            <div className="h-full w-full">{s.content}</div>
                        </div>
                    ))}
                </motion.div>
            </div>

            {showArrows && (
                <>
                    <button
                        aria-label="Previous slide"
                        onClick={prev}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/90 p-2 shadow-md hover:bg-white"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </button>

                    <button
                        aria-label="Next slide"
                        onClick={next}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/90 p-2 shadow-md hover:bg-white"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </button>
                </>
            )}

            {showDots && (
                <div className="mt-3 flex justify-center gap-2">
                    {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                        <button
                            key={i}
                            aria-label={`Go to slide ${i + 1}`}
                            onClick={() => goTo(i)}
                            className={`h-2 w-8 rounded-full transition-all ${
                                i === index
                                    ? "scale-100 bg-gray-800"
                                    : "bg-gray-300"
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Carousel;

/*
USAGE EXAMPLE

import Carousel from './Carousel';

const slides = [
  { key: 1, content: <img loading="lazy" src="/images/1.jpg" alt="1" className="object-cover w-full h-56 rounded-md"/> },
  { key: 2, content: <img loading="lazy" src="/images/2.jpg" alt="2" className="object-cover w-full h-56 rounded-md"/> },
  { key: 3, content: <img loading="lazy" src="/images/3.jpg" alt="3" className="object-cover w-full h-56 rounded-md"/> },
  // ...
];

<Carousel slides={slides} autoplay interval={3500} slidesPerView={{ 0:1, 640:2, 1024:3 }} gap={16} />


API
- slides: Slide[] (required) -> { key, content }
- slidesPerView: number | { [breakpointPx:number]: number } (default responsive object)
- gap: number px between slides
- autoplay: boolean
- interval: ms for autoplay
- loop: boolean
- showArrows, showDots: booleans
- className: tailwind classes added to root
- initialIndex: starting index
- ariaLabel: accessibility label

NOTES / NEXT STEPS
- Add virtualization for very large lists
- Add thumbnails / lazy prefetch strategy
- Hook into external controls (ref API) if you need programmatic control
- Consider adding reduced-motion support (prefers-reduced-motion) for users
*/
