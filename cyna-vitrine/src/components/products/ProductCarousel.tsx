import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductCarouselProps {
    mainImage: string;
    productName: string;
}

export default function ProductCarousel({ mainImage, productName }: ProductCarouselProps) {
    // Construction d'un tableau d'illustrations simulé pour l'interface SaaS
    // L'image principale, suivie de deux images génériques de Dashboard / UI
    const images = [
        mainImage,
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=800&q=80"
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    const goPrev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    const goNext = () => setCurrentIndex((prev) => (prev + 1) % images.length);

    return (
        <div className="relative group rounded-3xl overflow-hidden shadow-2xl bg-zinc-900 border border-zinc-800">
            {/* Aspect ratio container */}
            <div className="aspect-[4/3] sm:aspect-video relative overflow-hidden">
                <div 
                    className="flex w-full h-full transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {images.map((src, i) => (
                        <div key={i} className="flex-shrink-0 w-full h-full relative">
                            <img 
                                src={src} 
                                alt={`${productName} - Vue ${i + 1}`} 
                                className="w-full h-full object-cover"
                            />
                            {/* Inner shadow overlay for depth */}
                            <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.6)] pointer-events-none" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Buttons */}
            <button 
                onClick={goPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm border border-white/20 hover:bg-black/80"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
                onClick={goNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm border border-white/20 hover:bg-black/80"
            >
                <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {images.map((_, i) => (
                    <button 
                        key={i}
                        onClick={() => setCurrentIndex(i)}
                        className={`w-2 h-2 rounded-full transition-all ${
                            currentIndex === i ? "bg-cyna-500 scale-125 shadow-[0_0_8px_rgba(62,0,255,0.8)]" : "bg-white/50 hover:bg-white/80"
                        }`}
                        aria-label={`Vue ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
