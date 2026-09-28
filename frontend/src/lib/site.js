import { useEffect, useState } from "react";
import { API } from "./api";
let cached = null;
let fetched = false;
export async function getLogoUrl() {
    if (cached)
        return cached;
    if (fetched)
        return "/logo.svg";
    fetched = true;
    try {
        const r = await fetch(`${API}/api/site-settings`);
        const j = await r.json().catch(() => ({}));
        if (j.logo_url) {
            cached = j.logo_url;
            return cached;
        }
    }
    catch { }
    return "/logo.svg";
}
export function useSiteLogo(fallback = "/logo.svg") {
    const [logo, setLogo] = useState(fallback);
    useEffect(() => { getLogoUrl().then(setLogo).catch(() => { }); }, []);
    return logo;
}
