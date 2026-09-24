import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CATEGORIES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
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
  let query = supabase
    .from("templates")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  if (active !== "all") query = query.eq("category", active);

  const { data: templates } = await query;

  // fallback seed when Supabase kosong / belum dikonfigurasi
  const items = templates?.length ? templates : seedFallback(active);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl flex-1 px-4 py-10">
        <h1 className="text-3xl font-semibold tracking-tight">Katalog tema</h1>
        <p className="mt-2 text-muted-foreground">
          Pilih wedding, adat, animasi, atau acara lain.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Button
              key={c.id}
              size="sm"
              variant={active === c.id ? "default" : "outline"}
              render={<Link href={c.id === "all" ? "/katalog" : `/katalog?cat=${c.id}`} />}
            >
              {c.label}
            </Button>
          ))}
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => (
            <Card key={t.slug} className="overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={t.thumbnail_url || "/templates-placeholder.svg"}
                alt={t.title}
                className="aspect-[4/3] w-full object-cover"
                loading="lazy"
              />
              <CardContent className="space-y-3 p-4">
                <div className="flex items-center gap-2">
                  {t.is_premium && <Badge variant="secondary">Premium</Badge>}
                  <Badge variant="outline">{t.category}</Badge>
                </div>
                <h3 className="font-medium">{t.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {t.description ?? ""}
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" render={<Link href={`/preview/${t.slug}`} />}>
                    Preview
                  </Button>
                  <Button size="sm" render={<Link href={`/register?template=${t.slug}`} />}>
                    Pakai tema
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}

function seedFallback(active: string) {
  const all = [
    { slug: "classic-ivory", category: "wedding", title: "Classic Ivory", description: "Ivory & gold", is_premium: false, thumbnail_url: null },
    { slug: "moder-minimal", category: "wedding", title: "Modern Minimal", description: "Tipografi modern", is_premium: false, thumbnail_url: null },
    { slug: "floral-blush", category: "wedding", title: "Floral Blush", description: "Bunga romantis", is_premium: true, thumbnail_url: null },
    { slug: "adat-jawa", category: "adat", title: "Adat Jawa", description: "Batik & gunungan", is_premium: true, thumbnail_url: null },
    { slug: "adat-sunda", category: "adat", title: "Adat Sunda", description: "Panggih sunda", is_premium: true, thumbnail_url: null },
    { slug: "animasi-1", category: "animasi", title: "Animasi Soft", description: "Particle halus", is_premium: true, thumbnail_url: null },
    { slug: "khitan-1", category: "non-wedding", title: "Khitanan Ceria", description: "Tema anak", is_premium: false, thumbnail_url: null },
    { slug: "aqiqah-1", category: "non-wedding", title: "Aqiqah Soft", description: "Pastel bayi", is_premium: false, thumbnail_url: null },
    { slug: "birthday-1", category: "non-wedding", title: "Ultah Anak", description: "Confetti ceria", is_premium: false, thumbnail_url: null },
  ];
  return active === "all" ? all : all.filter((t) => t.category === active);
}
