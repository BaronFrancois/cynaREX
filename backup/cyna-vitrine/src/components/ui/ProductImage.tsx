"use client";

import { useState } from "react";

export const PRODUCT_PLACEHOLDER = "/product-placeholder.svg";

interface ProductImageProps {
    src: string;
    alt?: string;
    className?: string;
}

export default function ProductImage({ src, alt = "", className }: ProductImageProps) {
    const [failed, setFailed] = useState(false);
    const resolved = !src || src.trim() === "" || failed ? PRODUCT_PLACEHOLDER : src;

    return (
        <img
            src={resolved}
            alt={alt}
            className={className}
            onError={() => {
                if (!failed) setFailed(true);
            }}
        />
    );
}
