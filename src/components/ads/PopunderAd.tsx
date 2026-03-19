"use client";

import Script from "next/script";

/**
 * PopunderAd
 */
export function PopunderAd() {
    return (
        <>
            <Script 
                id="adsterra-popunder"
                src="https://latherachelesscatastrophe.com/e3/1f/e8/e31fe856a5b9370cdb4ff4add6a448a8.js" 
                strategy="lazyOnload"
            />
            <Script 
                id="monetag-popunder"
                src="https://5gvci.com/act/files/tag.min.js?z=10749108"
                data-cfasync="false"
                strategy="lazyOnload"
                async
            />
        </>
    );
}
