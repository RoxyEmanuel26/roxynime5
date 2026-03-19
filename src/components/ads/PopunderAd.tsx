"use client";

import Script from "next/script";
import { getPopunderScripts } from "@/config/ads.config";

/**
 * PopunderAd — Global popunder + social bar scripts.
 * Loaded ONCE in layout.tsx via next/script with afterInteractive strategy.
 */
export function PopunderAd() {
    const scripts = getPopunderScripts();

    if (scripts.length === 0) return null;

    return (
        <>
            {scripts.map((src, idx) => (
                <Script
                    key={idx}
                    src={src}
                    strategy="afterInteractive"
                    data-cfasync="false"
                />
            ))}
        </>
    );
}
