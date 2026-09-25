export type Theme = {
  cover: string;
  bg: string;
  text: string;
  accent: string;
  divider: string;
  fontTitle: string;
  fontBody: string;
  coupleLayout: "stack" | "side" | "arch";
};

export const themeBySlug: Record<string, Theme> = {};

function put(slugs: string[], t: Theme) {
  for (const s of slugs) themeBySlug[s] = t;
}

put(["noir-eternel","eclat-noir","vermeil","velours-nuit","jardin-noir","divine-ivory","classic-ivory","midnight-rose"], {
  cover: "bg-zinc-950 text-zinc-100",
  bg: "bg-zinc-950",
  text: "text-zinc-100",
  accent: "bg-amber-400 text-zinc-950",
  divider: "border-zinc-800",
  fontTitle: "font-cinzel",
  fontBody: "font-libre",
  coupleLayout: "arch",
});

put(["ivory-garden","blush-bloom","floral-blush","opaline","atelier-blush","maison-lace","chantelle","seraphine","brume"], {
  cover: "bg-[#fdf6f0] text-stone-700",
  bg: "bg-[#fdf6f0]",
  text: "text-stone-700",
  accent: "bg-rose-400 text-white",
  divider: "border-rose-100",
  fontTitle: "font-greatvibes",
  fontBody: "font-cormorant",
  coupleLayout: "stack",
});

put(["adat-jawa-ageng","adat-jawa","adat-jawa-prameswari","adat-sunda-kencana","adat-sunda","adat-minang-balairung","adat-minang","adat-batak-gorga","adat-batak","adat-bali-prasada","adat-bali","adat-melayu-seri","adat-melayu","adat-betawi-sophi","pembayun-elegant","sangkala"], {
  cover: "bg-amber-950 text-amber-50",
  bg: "bg-stone-50",
  text: "text-stone-800",
  accent: "bg-amber-700 text-amber-50",
  divider: "border-amber-200",
  fontTitle: "font-playfair",
  fontBody: "font-libre",
  coupleLayout: "side",
});

put(["animasi-lune","animasi-aurelia","animasi-etincelle","animasi-velour","animasi-rivage","animasi-nocturne","animasi-celestine","animasi-1","celestial-vow","lumiere","heritage-silk"], {
  cover: "bg-indigo-950 text-indigo-50",
  bg: "bg-indigo-50/50",
  text: "text-indigo-950",
  accent: "bg-indigo-600 text-white",
  divider: "border-indigo-200",
  fontTitle: "font-montserrat",
  fontBody: "font-poppins",
  coupleLayout: "arch",
});

put(["khitan-arslan-elegant","khitan-safir","khitan-amir","khitan-1","aqiqah-noura","aqiqah-izzah","aqiqah-zayyan","aqiqah-1","aqiqah-hana-prameswari","birthday-liora","birthday-elio","birthday-1","tasmiyah-elegant","tedak-siten-prameswari","walimatul-khitan-elite","ultah-aria","serene-arch","sage-ritual","velvet-noon","adagio","solenne","amandine","engagement-eternel","moire-sable","orangerie","aureline"], {
  cover: "bg-sky-50 text-sky-950",
  bg: "bg-white",
  text: "text-sky-950",
  accent: "bg-sky-600 text-white",
  divider: "border-sky-100",
  fontTitle: "font-dancing",
  fontBody: "font-poppins",
  coupleLayout: "stack",
});

export function getTheme(slug: string): Theme {
  return themeBySlug[slug] ?? {
    cover: "bg-muted/20 text-foreground",
    bg: "bg-muted/20",
    text: "text-foreground",
    accent: "bg-primary text-primary-foreground",
    divider: "border-border",
    fontTitle: "font-serif",
    fontBody: "font-sans",
    coupleLayout: "stack",
  };
}
