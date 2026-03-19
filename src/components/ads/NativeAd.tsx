"use client";

import { pickAdForSlot, generateAdSrcDoc } from "@/config/ads.config";
import { useEffect, useState } from "react";

interface NativeAdProps {
    set?: "A" | "B";
    className?: string;
}

export function NativeAd({ set = "A", className }: NativeAdProps) {
    const [srcDoc, setSrcDoc] = useState("");
    const [adConfig, setAdConfig] = useState<any>(null);

    useEffect(() => {
        const ad = pickAdForSlot("native");
        if (ad) {
            setAdConfig(ad);
            setSrcDoc(generateAdSrcDoc(ad));
        }
    }, []);

    if (!adConfig) return null;

    return (
        <div className={`w-full flex justify-center overflow-hidden my-4 min-h-[50px] ${className || ""}`}>
            <iframe
                srcDoc={srcDoc}
                width={adConfig.width || 320}
                height={adConfig.height || 50}
                style={{ border: "none", overflow: "hidden", background: "transparent" }}
                scrolling="no"
                sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-same-origin"
            />
        </div>
    );
}
