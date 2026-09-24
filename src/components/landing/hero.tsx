import Link from "next/link";
import { Button } from "@/components/ui/button";
import { APP_NAME, waLink } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_oklch(0.95_0.03_80),_transparent_60%)]" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 md:grid-cols-2 md:py-28">
        <div>
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground">
            Undangan digital hybrid
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
            Bikin sendiri, atau{" "}
            <span className="italic">dibuatkan</span> tim kami.
          </h1>
          <p className="mt-5 max-w-md text-muted-foreground leading-relaxed">
            {APP_NAME} — template elegan, fast loading, custom nama tamu, RSVP,
            amplop digital. Satu link, sebar tanpa batas.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" render={<Link href="/katalog" />}>
              Lihat tema
            </Button>
            <Button
              size="lg"
              variant="outline"
              render={
                <a
                  href={waLink("Halo, mau dibuatkan undangan digital.")}
                  target="_blank"
                  rel="noreferrer"
                />
              }
            >
              Minta dibuatkan
            </Button>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            Paket Bronze gratis 2 hari · Tamu unlimited · Revisi sampai H-day
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-sm">
          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-xl">
            <p className="text-center text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
              The Wedding of
            </p>
            <h2 className="mt-4 text-center font-serif text-3xl">Andi &amp; Sari</h2>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Sabtu, 12 Desember 2026
            </p>
            <div className="mt-6 grid grid-cols-4 gap-2 text-center">
              {["Hari", "Jam", "Menit", "Detik"].map((l) => (
                <div key={l} className="rounded-xl bg-muted py-3">
                  <p className="text-lg font-semibold">00</p>
                  <p className="text-[10px] text-muted-foreground">{l}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-full bg-primary py-2 text-center text-sm text-primary-foreground">
              Buka Undangan
            </div>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Kepada: Yoga Riza Perdana
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
