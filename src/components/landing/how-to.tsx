import Link from "next/link";
import { STEPS } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export function HowTo() {
  return (
    <section id="cara" className="border-t bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground">CARA ORDER</p>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl">Empat langkah, jadi.</h2>
          <p className="mt-2 text-sm text-muted-foreground">Paling simpel untuk pemula. Ikuti urutan ini, link siap share ke grup WA.</p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.n} className="rounded-2xl border bg-muted/40 p-5">
              <span className="inline-flex size-9 place-items-center rounded-full bg-foreground text-sm font-bold text-background">{s.n}</span>
              <h3 className="mt-4 font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button size="lg" className="rounded-full" render={<Link href="/katalog" />}>Mulai Pilih Desain</Button>
          <Button size="lg" variant="outline" className="rounded-full" render={<Link href="/register" />}>Buka Editor</Button>
        </div>
      </div>
    </section>
  );
}
