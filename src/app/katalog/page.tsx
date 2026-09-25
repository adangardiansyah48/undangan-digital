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
                {sec.items.map((t) => (
                  <article
                    key={t.slug}
                    className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:shadow-md"
                  >
                    <div className="relative aspect-[3/4.2] overflow-hidden bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={t.thumbnail_url || mockGradient(t.slug, t.category)}
                        alt={t.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                      {t.is_new && (
                        <span className="absolute left-2 top-2 rounded-full bg-amber-500 px-2.5 py-1 text-[10px] font-bold text-white shadow">
                          NEW !!!
                        </span>
                      )}
                      {t.is_premium && (
                        <span className="absolute right-2 top-2 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold text-primary-foreground">
                          Premium
                        </span>
                      )}
                    </div>
                    <div className="space-y-2 p-4">
                      <h3 className="text-center text-sm font-semibold uppercase tracking-wide">{t.title}</h3>
                      {t.description && (
                        <p className="text-center text-xs text-muted-foreground line-clamp-1">{t.description}</p>
                      )}
                      <div className="flex justify-center gap-2 pt-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full px-4"
                          render={<Link href={`/preview/${t.slug}`} />}
                        >
                          Lihat Contoh
                        </Button>
                        <Button size="sm" className="rounded-full px-4" render={<Link href={`/register?template=${t.slug}`} />}>
                          Pakai tema
                        </Button>
                      </div>
                    </div>
                  </article>
                ))}
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
    { slug: "demo-42", category: "wedding", title: "Demo 42", description: "Elegant ivory", is_premium: true, is_new: true, thumbnail_url: null },
    { slug: "demo-41", category: "wedding", title: "Demo 41", description: "Modern minimal", is_premium: true, is_new: true, thumbnail_url: null },
    { slug: "demo-40", category: "wedding", title: "Demo 40", description: "Eva & Max", is_premium: false, thumbnail_url: null },
    { slug: "demo-39", category: "wedding", title: "Demo 39", description: "Soft floral", is_premium: false, thumbnail_url: null },
    { slug: "demo-38", category: "wedding", title: "Demo 38", description: "Classic serif", is_premium: false, thumbnail_url: null },
    { slug: "demo-37", category: "wedding", title: "Demo 37", description: "Garden romance", is_premium: false, thumbnail_url: null },
    { slug: "demo-36", category: "wedding", title: "Demo 36", description: "Minimal line", is_premium: false, thumbnail_url: null },
    { slug: "demo-35", category: "wedding", title: "Demo 35", description: "Rustic kraft", is_premium: false, thumbnail_url: null },
    { slug: "demo-34", category: "wedding", title: "Demo 34", description: "Blush bloom", is_premium: false, thumbnail_url: null },
    { slug: "demo-33", category: "wedding", title: "Demo 33", description: "Ivory gold", is_premium: false, thumbnail_url: null },
    { slug: "demo-32", category: "wedding", title: "Demo 32", description: "Pastel day", is_premium: false, thumbnail_url: null },
    { slug: "demo-31", category: "wedding", title: "Demo 31", description: "Dark elegant", is_premium: false, thumbnail_url: null },
    { slug: "demo-30", category: "wedding", title: "Demo 30", description: "Serene arch", is_premium: false, thumbnail_url: null },
    { slug: "demo-29", category: "wedding", title: "Demo 29", description: "Peony soft", is_premium: false, thumbnail_url: null },
    { slug: "demo-28", category: "wedding", title: "Demo 28", description: "Line art", is_premium: false, thumbnail_url: null },
    { slug: "demo-27", category: "wedding", title: "Demo 27", description: "Greenery", is_premium: false, thumbnail_url: null },
    { slug: "demo-26", category: "wedding", title: "Demo 26", description: "Terracotta", is_premium: false, thumbnail_url: null },
    { slug: "demo-25", category: "wedding", title: "Demo 25", description: "Sage mood", is_premium: false, thumbnail_url: null },
    { slug: "adat-melayu", category: "adat", title: "Adat Melayu", description: "Songket melayu", is_premium: true, is_new: true, thumbnail_url: null },
    { slug: "adat-java-3", category: "adat", title: "Adat Jawa 3", description: "Joglo modern", is_premium: true, is_new: true, thumbnail_url: null },
    { slug: "adat-sunda", category: "adat", title: "Adat Sunda", description: "Panggih sunda", is_premium: true, thumbnail_url: null },
    { slug: "adat-java-2", category: "adat", title: "Adat Jawa 2", description: "Batik klasik", is_premium: true, thumbnail_url: null },
    { slug: "adat-betawi", category: "adat", title: "Adat Betawi", description: "Ondel & lenong", is_premium: true, thumbnail_url: null },
    { slug: "adat-java-1", category: "adat", title: "Adat Jawa 1", description: "Gunungan jawa", is_premium: true, thumbnail_url: null },
    { slug: "adat-batak", category: "adat", title: "Adat Batak", description: "Ulos batak", is_premium: true, thumbnail_url: null },
    { slug: "adat-minang", category: "adat", title: "Adat Minang", description: "Rumah gadang", is_premium: true, thumbnail_url: null },
    { slug: "adat-bali", category: "adat", title: "Adat Bali", description: "Gapura bali", is_premium: true, thumbnail_url: null },
    { slug: "adat-jawa", category: "adat", title: "Adat Jawa", description: "Batik & gunungan", is_premium: false, thumbnail_url: null },
    { slug: "animasi-1", category: "animasi", title: "Animasi 1", description: "Particle halus", is_premium: true, thumbnail_url: null },
    { slug: "animasi-2", category: "animasi", title: "Animasi 2", description: "Lottie birds", is_premium: true, thumbnail_url: null },
    { slug: "animasi-3", category: "animasi", title: "Animasi 3", description: "Confetti soft", is_premium: true, thumbnail_url: null },
    { slug: "animasi-4", category: "animasi", title: "Animasi 4", description: "Fade parallax", is_premium: true, thumbnail_url: null },
    { slug: "animasi-5", category: "animasi", title: "Animasi 5", description: "Bloom enter", is_premium: true, thumbnail_url: null },
    { slug: "animasi-6", category: "animasi", title: "Animasi 6", description: "Petals fall", is_premium: true, thumbnail_url: null },
    { slug: "khitan-1", category: "non-wedding", title: "Khitan 1", description: "Tema anak ceria", is_premium: false, thumbnail_url: null },
    { slug: "khitan-2", category: "non-wedding", title: "Khitan 2", description: "Biru navy", is_premium: false, thumbnail_url: null },
    { slug: "khitan-3", category: "non-wedding", title: "Khitan 3", description: "Motif islami", is_premium: false, thumbnail_url: null },
    { slug: "khitan-4", category: "non-wedding", title: "Khitan 4", description: "Karton lucu", is_premium: false, thumbnail_url: null },
    { slug: "aqiqah-1", category: "non-wedding", title: "Aqiqah 1", description: "Pastel bayi", is_premium: false, thumbnail_url: null },
    { slug: "birthday-1", category: "non-wedding", title: "Birthday 1", description: "Confetti ceria", is_premium: false, thumbnail_url: null },
  ];
  return active === "all" ? all : all.filter((t) => t.category === active);
}
