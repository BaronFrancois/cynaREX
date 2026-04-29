"use client";

import React from "react";
import AppLayout from "../layout/AppLayout";
import HomeCarousel from "../components/home/HomeCarousel";
import HomeFixedText from "../components/home/HomeFixedText";
import CategoryGrid from "../components/home/CategoryGrid";
import TopProducts from "../components/home/TopProducts";

export default function Home() {
    return (
        <AppLayout>
            <main className="w-full flex flex-col overflow-hidden bg-black">
                {/* 1. Carrousel en trois parties */}
                <HomeCarousel />

                {/* 2. Texte fixe */}
                <HomeFixedText />

                {/* 3. Grille de catégories */}
                <CategoryGrid />

                {/* 4. Top Produits du moment */}
                <TopProducts />
            </main>
        </AppLayout>
    );
}

