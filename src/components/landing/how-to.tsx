import { STEPS } from "@/lib/constants";

export function HowTo() {
  return (
    <section id="cara" className="mx-auto max-w-6xl px-4 py-20">
      <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
        Cara order
      </p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight">Empat langkah</h2>
      <div className="mt-10 grid gap-6 md:grid-cols-4">
        {STEPS.map((s) => (
          <div key={s.n}>
            <p className="font-serif text-3xl text-muted-foreground">{s.n}</p>
            <h3 className="mt-3 font-medium">{s.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
