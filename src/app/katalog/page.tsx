import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CATEGORIES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function KatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const { cat } = await searchParams;
  const active = cat ?? "all";
  const supabase = await createClient();
  let query = supabase.from("templates").select("*").eq("is_active", true).order("sort_order");
  if (active !== "all") query = query.eq("category", active);
  const { data: templates } = await query;
  const items = templates?.length ? templates : seedFallback(active);

  const sections: { cat: string; label: string; items: typeof items }[] =
    active === "all"
      ? (["wedding", "adat", "animasi", "non-wedding"] as const).map((c) => ({
          cat: c,
          label: CATEGORIES.find((x) => x.id === c)?.label ?? c,
          items: items.filter((t: (typeof items)[number]) => t.category === c),
        }))
      : [{ cat: active, label: CATEGORIES.find((x) => x.id === active)?.label ?? active, items }];

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl flex-1 px-4 py-8">
        <p className="text-center text-[11px] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
          Katalog Tema
        </p>
        <h1 className="mt-2 text-center text-2xl font-semibold tracking-tight md:text-3xl">Pilihan Tema</h1>
        <p className="mx-auto mt-2 max-w-xl text-center text-sm text-muted-foreground">
          Click untuk lihat design. Buka di browser mode terang untuk warna asli. Jangan pakai dark mode.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((c) => (
            <Button
              key={c.id}
              size="sm"
              variant={active === c.id ? "default" : "outline"}
              className="rounded-full px-5"
              render={<Link href={c.id === "all" ? "/katalog" : `/katalog?cat=${c.id}`} />}
            >
              {c.label}
            </Button>
          ))}
        </div>

        <div className="mt-8 space-y-10">
          {sections.map((sec) => (
            <section key={sec.cat}>
              <h2 className="border-l-4 border-primary pl-3 text-lg font-semibold capitalize">{sec.label}</h2>
              <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {sec.items.map((t, idx) => {
                  const font = fonts[idx % fonts.length];
                  const accent = accents[t.category as keyof typeof accents] ?? accents.wedding;
                  return (
                    <article
                      key={t.slug}
                      className="group overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:shadow-lg hover:-translate-y-0.5"
                      style={{ borderColor: accent.border }}
                    >
                      <div className="relative aspect-[3/4.2] overflow-hidden bg-muted">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={t.thumbnail_url || mockGradient(t.slug, t.category)}
                          alt={t.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
                        {t.is_new && (
                          <span className="absolute left-2 top-2 rounded-full bg-amber-500 px-2.5 py-1 text-[10px] font-bold text-white shadow">
                            NEW !!!
                          </span>
                        )}
                        {t.is_premium && (
                          <span className="absolute right-2 top-2 rounded-full px-2.5 py-1 text-[10px] font-bold text-white shadow" style={{ background: accent.badge }}>
                            Premium
                          </span>
                        )}
                      </div>
                      <div className="space-y-2 p-4 text-center">
                        <h3 className={`text-base font-semibold ${font}`}>{t.title}</h3>
                        {t.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1">{t.description}</p>
                        )}
                        <div className="flex justify-center gap-2 pt-2">
                          <Button size="sm" variant="outline" className="rounded-full px-4" render={<Link href={`/${t.slug}`} />}>
                            Lihat Contoh
                          </Button>
                          <Button size="sm" className="rounded-full px-4" style={{ background: accent.badge, color: "#fff", borderColor: accent.badge }} render={<Link href={`/register?template=${t.slug}`} />}>
                            Pakai tema
                          </Button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
              {sec.items.length === 0 && (
                <p className="mt-4 text-sm text-muted-foreground">Coming soon untuk kategori ini.</p>
              )}
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}

const fonts = ["font-playfair", "font-cormorant", "font-greatvibes", "font-cinzel", "font-dancing", "font-libre", "font-montserrat", "font-poppins"] as const;
const accents = {
  wedding: { border: "oklch(0.92 0.04 80)", badge: "oklch(0.35 0.05 45)" },
  adat: { border: "oklch(0.90 0.05 30)", badge: "oklch(0.45 0.12 25)" },
  animasi: { border: "oklch(0.90 0.04 260)", badge: "oklch(0.50 0.14 260)" },
  "non-wedding": { border: "oklch(0.92 0.04 150)", badge: "oklch(0.45 0.10 150)" },
} as const;

type SeedItem = {
  slug: string;
  category: string;
  title: string;
  description: string;
  is_premium: boolean;
  is_new?: boolean;
  thumbnail_url: string | null;
};

function mockGradient(slug: string, cat: string) {
  const h = hash(slug) % 360;
  const h2 = (h + 32) % 360;
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='800'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='hsl(${h} 60% 85%)'/><stop offset='100%' stop-color='hsl(${h2} 55% 88%)'/></linearGradient></defs><rect width='100%' height='100%' fill='url(#g)'/><text x='50%' y='46%' text-anchor='middle' font-family='serif' font-size='22' fill='hsl(${h} 30% 30%)'>${cat.toUpperCase()}</text><text x='50%' y='53%' text-anchor='middle' font-family='sans-serif' font-size='18' font-weight='700' fill='hsl(${h} 18% 22%)'>${slug}</text></svg>`
  )}`;
}

function hash(s: string) {
  let n = 0;
  for (let i = 0; i < s.length; i++) n = (n * 31 + s.charCodeAt(i)) >>> 0;
  return n;
}

function seedFallback(active: string): SeedItem[] {
  const all: SeedItem[] = [
    { slug: "noir-eternel", category: "wedding", title: "Noir Éternel", description: "Hitam gold, serif tajam", is_premium: true, is_new: true, thumbnail_url: null },
    { slug: "ivory-garden", category: "wedding", title: "Ivory Garden", description: "Blush + garden serif", is_premium: true, is_new: true, thumbnail_url: null },
    { slug: "celestial-vow", category: "wedding", title: "Celestial Vow", description: "Navy star, cinzel", is_premium: true, is_new: true, thumbnail_url: null },
    { slug: "lumiere", category: "wedding", title: "Lumière", description: "Champagne light, cormorant", is_premium: true, is_new: true, thumbnail_url: null },
    { slug: "heritage-silk", category: "wedding", title: "Heritage Silk", description: "Ivory gold arch", is_premium: true, thumbnail_url: null },
    { slug: "serene-arch", category: "wedding", title: "Serene Arch", description: "Minimal arch stone", is_premium: false, thumbnail_url: null },
    { slug: "blush-bloom", category: "wedding", title: "Blush Bloom", description: "Peony watercolor", is_premium: false, thumbnail_url: null },
    { slug: "modern-minimal", category: "wedding", title: "Modern Minimal", description: "Sans bold, clean", is_premium: false, thumbnail_url: null },
    { slug: "classic-ivory", category: "wedding", title: "Classic Ivory", description: "Playfair timeless", is_premium: false, thumbnail_url: null },
    { slug: "midnight-rose", category: "wedding", title: "Midnight Rose", description: "Burgundy rose", is_premium: true, thumbnail_url: null },
    { slug: "sage-ritual", category: "wedding", title: "Sage Ritual", description: "Sage & terracotta", is_premium: false, thumbnail_url: null },
    { slug: "velvet-noon", category: "wedding", title: "Velvet Noon", description: "Velvet script", is_premium: false, thumbnail_url: null },
    { slug: "adagio", category: "wedding", title: "Adagio", description: "Dancing script airy", is_premium: true, thumbnail_url: null },
    { slug: "solenne", category: "wedding", title: "Solenne", description: "Libre solemn", is_premium: true, thumbnail_url: null },
    { slug: "amandine", category: "wedding", title: "Amandine", description: "Great Vibes flourish", is_premium: false, thumbnail_url: null },
    { slug: "adat-jawa-ageng", category: "adat", title: "Jawa Ageng", description: "Gunungan gold", is_premium: true, is_new: true, thumbnail_url: null },
    { slug: "adat-sunda-kencana", category: "adat", title: "Sunda Kencana", description: "Panggih elegan", is_premium: true, is_new: true, thumbnail_url: null },
    { slug: "adat-minang-balairung", category: "adat", title: "Minang Balairung", description: "Songket rumang gadang", is_premium: true, thumbnail_url: null },
    { slug: "adat-batak-gorga", category: "adat", title: "Batak Gorga", description: "Ulos & gorga merah", is_premium: true, thumbnail_url: null },
    { slug: "adat-bali-prasada", category: "adat", title: "Bali Prasada", description: "Pura & canang", is_premium: true, thumbnail_url: null },
    { slug: "adat-melayu-seri", category: "adat", title: "Melayu Seri", description: "Songket kuning diraja", is_premium: true, thumbnail_url: null },
    { slug: "adat-betawi-sophi", category: "adat", title: "Betawi Sophi", description: "Ondel & lenong luxe", is_premium: true, thumbnail_url: null },
    { slug: "adat-jawa-prameswari", category: "adat", title: "Jawa Prameswari", description: "Keraton solo luxe", is_premium: true, thumbnail_url: null },
    { slug: "animasi-lune", category: "animasi", title: "Animasi Lune", description: "Fade + moon particle", is_premium: true, is_new: true, thumbnail_url: null },
    { slug: "animasi-aurelia", category: "animasi", title: "Animasi Aurelia", description: "Parallax petals", is_premium: true, is_new: true, thumbnail_url: null },
    { slug: "animasi-etincelle", category: "animasi", title: "Animasi Étincelle", description: "Confetti gold", is_premium: true, thumbnail_url: null },
    { slug: "animasi-velour", category: "animasi", title: "Animasi Velour", description: "Bloom soft enter", is_premium: true, thumbnail_url: null },
    { slug: "animasi-rivage", category: "animasi", title: "Animasi Rivage", description: "Lottie birds coast", is_premium: true, thumbnail_url: null },
    { slug: "animasi-nocturne", category: "animasi", title: "Animasi Nocturne", description: "Stars drift", is_premium: true, thumbnail_url: null },
    { slug: "khitan-arslan-elegant", category: "non-wedding", title: "Khitan Arslan", description: "Navy islami elegant", is_premium: false, thumbnail_url: null },
    { slug: "khitan-safir", category: "non-wedding", title: "Khitan Safir", description: "Biru safir ceria", is_premium: false, thumbnail_url: null },
    { slug: "khitan-amir", category: "non-wedding", title: "Khitan Amir", description: "Karton luxe anak", is_premium: false, thumbnail_url: null },
    { slug: "aqiqah-noura", category: "non-wedding", title: "Aqiqah Noura", description: "Pastel blush baby", is_premium: false, is_new: true, thumbnail_url: null },
    { slug: "aqiqah-izzah", category: "non-wedding", title: "Aqiqah Izzah", description: "Sage baby elegant", is_premium: false, thumbnail_url: null },
    { slug: "aqiqah-zayyan", category: "non-wedding", title: "Aqiqah Zayyan", description: "Ivory gold baby", is_premium: false, thumbnail_url: null },
    { slug: "birthday-liora", category: "non-wedding", title: "Birthday Liora", description: "Confetti luxe", is_premium: false, thumbnail_url: null },
    { slug: "birthday-elio", category: "non-wedding", title: "Birthday Elio", description: "Minimal kids elegant", is_premium: false, thumbnail_url: null },
    { slug: "tasmiyah-elegant", category: "non-wedding", title: "Tasmiyah Elegant", description: "Gold calligraphy", is_premium: false, thumbnail_url: null },
    { slug: "tedak-siten-prameswari", category: "non-wedding", title: "Tedak Siten", description: "Jawa baby ritual elegant", is_premium: false, thumbnail_url: null },
    { slug: "engagement-eternel", category: "wedding", title: "Engagement Éternel", description: "Lamaran gold elegant", is_premium: false, thumbnail_url: null },
    { slug: "eclat-noir", category: "wedding", title: "Éclat Noir", description: "Jet ink + foil", is_premium: true, is_new: true, thumbnail_url: null },
    { slug: "vermeil", category: "wedding", title: "Vermeil", description: "Crimson velvet", is_premium: true, thumbnail_url: null },
    { slug: "moire-sable", category: "wedding", title: "Moiré Sable", description: "Taupe moiré luxe", is_premium: false, thumbnail_url: null },
    { slug: "orangerie", category: "wedding", title: "Orangerie", description: "Citrus garden", is_premium: true, thumbnail_url: null },
    { slug: "pembayun-elegant", category: "adat", title: "Pembayun Elegant", description: "Putri solo halus", is_premium: true, is_new: true, thumbnail_url: null },
    { slug: "sangkala", category: "adat", title: "Sangkala", description: "Bali prasi elegant", is_premium: true, thumbnail_url: null },
    { slug: "animasi-celestine", category: "animasi", title: "Animasi Célestine", description: "Aurora shimmer", is_premium: true, is_new: true, thumbnail_url: null },
    { slug: "walimatul-khitan-elite", category: "non-wedding", title: "Walimatul Khitan Elite", description: "Gold navy islami", is_premium: false, thumbnail_url: null },
    { slug: "aqiqah-hana-prameswari", category: "non-wedding", title: "Aqiqah Hana", description: "Blush prameswari", is_premium: false, thumbnail_url: null },
    { slug: "ultah-aria", category: "non-wedding", title: "Ultah Aria", description: "Kids confetti elegant", is_premium: false, thumbnail_url: null },
  ];
  return active === "all" ? all : all.filter((t) => t.category === active);
}
