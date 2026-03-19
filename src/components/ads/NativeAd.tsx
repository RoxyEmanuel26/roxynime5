"use client";

import Script from "next/script";

interface NativeAdProps {
    /** "A" untuk Set A, "B" untuk Set B */
    set?: "A" | "B";
    className?: string;
}

/**
 * NativeAd
 */
export function NativeAd({ set = "A", className }: NativeAdProps) {
    return (
        <div className={className}>
            <Script 
                async 
                data-cfasync="false" 
                src="https://latherachelesscatastrophe.com/1f4b65a9571ac6e81d2a872dccf9691a/invoke.js"
                strategy="lazyOnload"
            />
            <div id="container-1f4b65a9571ac6e81d2a872dccf9691a"></div>
        </div>
    );
}
