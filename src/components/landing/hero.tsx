import Link from "next/link";
import { Button } from "@/components/ui/button";
import { waLink } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,oklch(0.97_0.02_85),transparent)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border bg-muted/60 px-3 py-1 text-xs font-medium">
              <span className="size-2 rounded-full bg-emerald-500" /> Undangan digital · Bisa edit sendiri atau dibantu tim
            </p>
            <h1 className="mt-6 font-serif text-4xl leading-[0.95] tracking-tight sm:text-5xl lg:text-[56px]">
              Undangan <span className="italic font-normal">cantik</span>,
              <br />jadi dalam menit.
            </h1>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
              Pilih desain fresh, isi data mempelai, upload foto, sebar satu link untuk semua tamu. Atau serahkan ke tim — kamu tinggal approve.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button size="lg" className="rounded-full px-7" render={<Link href="/katalog" />}>Lihat Katalog Desain</Button>
              <Button size="lg" variant="outline" className="rounded-full" render={<Link href="/register" />}>Bikin Sendiri Gratis</Button>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">Atau <a href={waLink("Halo, mau dibantu buatkan undangan digital")} target="_blank" rel="noreferrer" className="underline font-medium text-foreground">chat WA dibuatkan tim</a> — tanpa ribet.</p>
            <div className="mt-8 flex flex-wrap gap-6 border-t pt-6 text-sm">
              <span className="flex items-center gap-2"><span className="text-emerald-600">✓</span> 100+ desain fresh</span>
              <span className="flex items-center gap-2"><span className="text-emerald-600">✓</span> Edit mudah, no skill</span>
              <span className="flex items-center gap-2"><span className="text-emerald-600">✓</span> Link satu, sebar WA</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[380px] lg:ml-auto">
            <div className="absolute -inset-3 rounded-[2.2rem] bg-gradient-to-b from-muted to-transparent opacity-60" />
            <div className="relative overflow-hidden rounded-[2rem] border bg-white shadow-2xl shadow-foreground/10">
              <div className="h-1.5 w-full bg-gradient-to-r from-foreground via-foreground/60 to-foreground" />
              <div className="p-5 sm:p-6">
                <div className="flex items-center justify-between text-[10px] tracking-[0.2em] text-muted-foreground">
                  <span>THE WEDDING OF</span><span>12 · 12 · 2025</span>
                </div>
                <h2 className="mt-3 text-center font-serif text-3xl">Andi <span className="font-normal opacity-30">&</span> Sari</h2>
                <p className="mt-1 text-center text-xs text-muted-foreground">Gedung Serbaguna Cimalaka · 09.00 WIB</p>
                <div className="mt-5 overflow-hidden rounded-2xl bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://picsum.photos/seed/mstoryhero/640/420" alt="preview" className="h-44 w-full object-cover" />
                </div>
                <div className="mt-5 grid grid-cols-4 gap-2">
                  {[
                    { n: "12", l: "Hari" },
                    { n: "08", l: "Jam" },
                    { n: "24", l: "Menit" },
                    { n: "10", l: "Detik" },
                  ].map((c) => (
                    <div key={c.l} className="rounded-2xl border bg-muted/60 py-3 text-center">
                      <p className="text-lg font-semibold leading-none">{c.n}</p>
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{c.l}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-full bg-foreground py-3 text-center text-sm font-medium text-background">Buka Undangan</div>
                <p className="mt-2 text-center text-xs text-muted-foreground">Kepada: Adang &amp; Keluarga</p>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-2 hidden rounded-2xl border bg-white px-4 py-3 shadow-xl sm:flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-full bg-emerald-50 text-emerald-600">✓</span>
              <div className="text-xs leading-tight"><p className="font-semibold">RSVP Realtime</p><p className="text-muted-foreground">Tamu konfirmasi langsung</p></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
