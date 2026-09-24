import Link from "next/link";
import { Button } from "@/components/ui/button";
import { waLink } from "@/lib/constants";

export function Hybrid() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-border bg-card p-8">
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
            Track A
          </p>
          <h3 className="mt-2 text-2xl font-semibold">Bikin sendiri</h3>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Pilih tema, isi data mempelai, unggah galeri, publish. Editor
            dashboard, preview realtime, sebar link kapan saja.
          </p>
          <Button className="mt-6" render={<Link href="/register" />}>
            Mulai editor
          </Button>
        </div>
        <div className="rounded-3xl bg-foreground p-8 text-background">
          <p className="text-xs tracking-[0.2em] uppercase opacity-70">Track B</p>
          <h3 className="mt-2 text-2xl font-semibold">Dibuatkan tim</h3>
          <p className="mt-3 text-sm leading-relaxed opacity-80">
            Kirim brief + foto. Tim desain kerjakan 1–2 hari. Revisi sampai
            hari-H. Kamu tinggal sebar link.
          </p>
          <Button
            className="mt-6"
            variant="secondary"
            render={
              <a
                href={waLink("Halo, mau dibuatkan undangan. Saya kirim brief.")}
                target="_blank"
                rel="noreferrer"
              />
            }
          >
            Konsultasi WA
          </Button>
        </div>
      </div>
    </section>
  );
}
