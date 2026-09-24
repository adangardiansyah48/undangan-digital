import Link from "next/link";
import { Button } from "@/components/ui/button";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ to?: string }>;
};

export default async function PreviewPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { to } = await searchParams;
  const guest = to ? decodeURIComponent(to) : "Tamu Undangan";

  return (
    <main className="min-h-svh bg-muted/20">
      <div className="mx-auto max-w-md border-x border-border bg-background min-h-svh">
        <div className="flex min-h-[50svh] flex-col items-center justify-center px-6 py-16 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground">
            Preview · {slug}
          </p>
          <h1 className="font-serif mt-6 text-4xl">Dewi &amp; Reza</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sabtu, 12 Desember 2026</p>
          <p className="mt-8 text-sm text-muted-foreground">
            Kepada
            <br />
            <span className="font-medium text-foreground">{guest}</span>
          </p>
          <Button className="mt-8 rounded-full px-10" size="lg">
            Buka Undangan
          </Button>
          <p className="mt-6 text-xs text-muted-foreground">
            Nama tamu dari query: <code>?to=NamaTamu</code>
          </p>
        </div>

        <section className="border-t border-border px-6 py-10 text-center">
          <p className="text-sm italic text-muted-foreground">
            “Dan di antara tanda-tanda kebesaran-Nya diciptakan pasangan untukmu.”
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Q.S. Ar-Rum: 21</p>
          <p className="mt-8 text-xs tracking-[0.2em] uppercase text-muted-foreground">
            Count The Date
          </p>
          <div className="mt-4 grid grid-cols-4 gap-2 text-center">
            {["Hari", "Jam", "Menit", "Detik"].map((l) => (
              <div key={l} className="rounded-xl bg-muted py-3">
                <p className="font-semibold">00</p>
                <p className="text-[10px] text-muted-foreground">{l}</p>
              </div>
            ))}
          </div>
          <Button variant="outline" className="mt-6 w-full" render={<Link href={`/register?template=${slug}`} />}>
            Pakai tema ini
          </Button>
        </section>
      </div>
    </main>
  );
}
