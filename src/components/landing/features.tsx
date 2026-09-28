import { FEATURES } from "@/lib/constants";

export function Features() {
  return (
    <section id="fitur" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground">FITUR LENGKAP</p>
          <h2 className="mt-2 font-serif text-3xl leading-tight sm:text-4xl">Semua yang kamu butuh,<br />dalam satu link.</h2>
        </div>
        <p className="max-w-md text-sm text-muted-foreground">Tamu buka di HP langsung cantik. Musik auto, maps klik, amplop salin — tidak perlu install.</p>
      </div>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <div key={f.title} className="rounded-2xl border bg-white p-5">
            <p className="text-[11px] font-semibold tracking-widest text-muted-foreground">{f.title.toUpperCase()}</p>
            <p className="mt-2 text-sm font-medium leading-snug">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
