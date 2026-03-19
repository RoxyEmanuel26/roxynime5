/**
 * ═══════════════════════════════════════════════
 *   RoxyNime — Ad Network Configuration
 * ═══════════════════════════════════════════════
 *
 *  Supported Networks: Adsterra, ExoClick, PropellerAds, HilltopAds
 *
 *  HOW TO ADD YOUR AD CODES:
 *  1. Paste your ad code/key in the appropriate section below
 *  2. Set enabled: true for the network you want active
 *  3. Deploy — ads will auto-rotate between enabled networks
 *
 *  Each ad placement will randomly pick from ALL enabled networks
 *  for maximum revenue optimization.
 */

// ─── Types ───────────────────────────────────────────────

export type AdNetwork = "adsterra" | "exoclick" | "propellerads" | "hilltopads";

export interface AdUnit {
    /** Unique identifier for this ad unit */
    id: string;
    /** Which network this belongs to */
    network: AdNetwork;
    /** Ad format/size label */
    format: string;
    /** Width in pixels */
    width: number;
    /** Height in pixels */
    height: number;
    /** The ad key, zone ID, or placement ID from the network */
    key: string;
    /** Script URL (if the network uses a script tag) */
    scriptUrl?: string;
}

export interface NetworkConfig {
    /** Enable/disable this entire network */
    enabled: boolean;
    /** Display name */
    name: string;
    /** Banner ads (leaderboard, mobile banners, etc.) */
    banners: AdUnit[];
    /** Rectangle ads (300x250, in-feed) */
    rectangles: AdUnit[];
    /** Native/small ads (320x50, etc.) */
    natives: AdUnit[];
    /** Popunder script URL (if available) */
    popunder?: string | string[];
    /** Interstitial ad units */
    interstitials: AdUnit[];
}

// ─── CONFIGURATION ────────────────────────────────────────
//
//  ✏️  EDIT BELOW — Paste your ad codes from each network
//

/** 
 * Verification Meta Tags
 * Add tags here to verify your site ownership for ad networks (monetag, etc.) 
 */
export const VERIFICATION_META_TAGS: Array<{ name: string, content: string }> = [

];

export const ADS_CONFIG: Record<AdNetwork, NetworkConfig> = {
    adsterra: {
        enabled: true,
        name: "Adsterra",
        banners: [],
        rectangles: [],
        natives: [
            {
                id: "adsterra-native-1",
                network: "adsterra",
                format: "native",
                width: 320,
                height: 50,
                key: "",
                scriptUrl: "",
            }
        ],
        popunder: [
            "",
            ""
        ],
        interstitials: [],
    },
    exoclick: {
        enabled: false,
        name: "ExoClick",
        banners: [],
        rectangles: [],
        natives: [],
        popunder: "",
        interstitials: [],
    },
    propellerads: {
        enabled: true,
        name: "PropellerAds",
        banners: [],
        rectangles: [],
        natives: [],
        popunder: "",
        interstitials: [],
    },
    hilltopads: {
        enabled: false,
        name: "HilltopAds",
        banners: [],
        rectangles: [],
        natives: [],
        popunder: "",
        interstitials: [],
    },
};

// ─── Helper Functions ──────────────────────────────────────

/** Get all enabled networks */
export function getEnabledNetworks(): NetworkConfig[] {
    return Object.values(ADS_CONFIG).filter((n) => n.enabled);
}

/** Get all banner ad units from enabled networks */
export function getBannerAds(): AdUnit[] {
    return getEnabledNetworks().flatMap((n) => n.banners);
}

/** Get all rectangle ad units from enabled networks */
export function getRectangleAds(): AdUnit[] {
    return getEnabledNetworks().flatMap((n) => n.rectangles);
}

/** Get all native ad units from enabled networks */
export function getNativeAds(): AdUnit[] {
    return getEnabledNetworks().flatMap((n) => n.natives);
}

/** Get all interstitial ad units from enabled networks */
export function getInterstitialAds(): AdUnit[] {
    return getEnabledNetworks().flatMap((n) => n.interstitials);
}

/** Get all popunder scripts from enabled networks */
export function getPopunderScripts(): string[] {
    return getEnabledNetworks()
        .flatMap((n) => Array.isArray(n.popunder) ? n.popunder : (n.popunder ? [n.popunder] : []))
        .filter((s): s is string => !!s);
}

/**
 * Pick a random ad unit from a list.
 * Uses a slot string for deterministic (but distributed) selection.
 */
export function pickAd(ads: AdUnit[], slot: string = "default"): AdUnit | null {
    if (ads.length === 0) return null;
    const hash = slot.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    return ads[hash % ads.length];
}

/**
 * Pick a random ad unit of any type from enabled networks.
 * Falls back through: preferred → banners → any.
 */
export function pickAdForSlot(
    type: "banner" | "rectangle" | "native" | "interstitial",
    slot: string = "default"
): AdUnit | null {
    const getters: Record<string, () => AdUnit[]> = {
        banner: getBannerAds,
        rectangle: getRectangleAds,
        native: getNativeAds,
        interstitial: getInterstitialAds,
    };

    // FIXED: Hanya return ad dari tipe yang diminta, TIDAK fallback ke tipe lain
    // Fallback ke banner/any menyebabkan NativeAd/InFeedAd render iframe ukuran salah → kotak putih
    const ads = getters[type]();
    if (ads.length > 0) return pickAd(ads, slot);

    // Tidak ada ad untuk tipe ini → return null → komponen tidak render apa-apa
    return null;
}

// ─── Script Generators (per network) ────────────────────────

/**
 * Generate the iframe srcDoc for a given ad unit.
 * Each network has its own script injection pattern.
 */
export function generateAdSrcDoc(ad: AdUnit, overrideW?: number, overrideH?: number): string {
    const w = overrideW || ad.width;
    const h = overrideH || ad.height;

    switch (ad.network) {
        case "adsterra":
            if (ad.format === "native") {
                return `<html><head></head><body style="margin:0;padding:0;background:transparent;">
                    <script async="async" data-cfasync="false" src="${ad.scriptUrl || `https://latherachelesscatastrophe.com/${ad.key}/invoke.js`}"></script>
                    <div id="container-${ad.key}"></div>
                </body></html>`;
            }
            return `<html><body style="margin:0;padding:0;display:flex;justify-content:center;align-items:center;min-height:${h}px;overflow:hidden;background:transparent;">
                <script type="text/javascript">
                    atOptions = { 'key':'${ad.key}', 'format':'iframe', 'height':${h}, 'width':${w}, 'params':{} };
                </script>
                <script type="text/javascript" src="https://www.highperformanceformat.com/${ad.key}/invoke.js"></script>
            </body></html>`;

        case "exoclick":
            return `<html><head>
                <script type="text/javascript" src="${ad.scriptUrl || 'https://a.magsrv.com/ad-provider.js'}" async></script>
            </head><body style="margin:0;padding:0;display:flex;justify-content:center;align-items:center;min-height:${h}px;overflow:hidden;background:transparent;">
                <ins class="eas6a97888e" data-zoneid="${ad.key}"></ins>
                <script>(AdProvider = window.AdProvider || []).push({"serve": {}});</script>
            </body></html>`;

        case "propellerads":
            return `<html><body style="margin:0;padding:0;display:flex;justify-content:center;align-items:center;min-height:${h}px;overflow:hidden;background:transparent;">
                <script type="text/javascript" src="${ad.scriptUrl}" async></script>
            </body></html>`;

        case "hilltopads":
            // HilltopAds uses iframe embed or script
            const htaUrl = `${ad.scriptUrl || 'https://www.hilltopads.net/hta/afu.php'}?zoneid=${ad.key}&var=${w}x${h}`;
            return `<html><body style="margin:0;padding:0;display:flex;justify-content:center;align-items:center;min-height:${h}px;overflow:hidden;background:transparent;">
                <iframe src="${htaUrl}" width="${w}" height="${h}" frameborder="0" scrolling="no" style="border:none;"></iframe>
            </body></html>`;

        default:
            return `<html><body style="margin:0;padding:0;display:flex;justify-content:center;align-items:center;min-height:${h}px;background:transparent;">
                <div style="width:${w}px;height:${h}px;background:#1a1a2e;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#666;font-size:11px;">Ad</div>
            </body></html>`;
    }
}
