import { FEATURES } from "@/lib/constants";

export function Features() {
  return (
    <section id="fitur" className="mx-auto max-w-6xl px-4 py-20">
      <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">Fitur</p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight">
        Semua yang kamu butuhkan
      </h2>
      <p className="mt-2 max-w-xl text-muted-foreground">
        Satu halaman undangan, tampil baik di semua perangkat.
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="rounded-2xl border border-border bg-card p-5 transition-colors hover:bg-muted/40"
          >
            <h3 className="font-medium">{f.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
