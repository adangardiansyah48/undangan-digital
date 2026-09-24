import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TIERS, TIER_FEATURES, formatIDR } from "@/lib/constants";
import type { Tier } from "@/types/database";

const ORDER: Tier[] = ["bronze", "silver", "gold", "platinum"];

export function Pricing() {
  return (
    <section id="harga" className="mx-auto max-w-6xl px-4 py-20">
      <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">Harga</p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight">
        Satu harga, semua fitur
      </h2>
      <p className="mt-2 text-muted-foreground">
        Bedanya hanya masa aktif. Tamu tidak terbatas.
      </p>
      <div className="mt-10 grid gap-4 md:grid-cols-4">
        {ORDER.map((key) => {
          const t = TIERS[key];
          return (
            <div
              key={key}
              className={`rounded-2xl border p-6 ${
                t.highlight
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card"
              }`}
            >
              <p className="text-sm font-medium">{t.label}</p>
              <p className="mt-3 text-2xl font-semibold">{formatIDR(t.price)}</p>
              <p
                className={`mt-1 text-sm ${t.highlight ? "opacity-80" : "text-muted-foreground"}`}
              >
                {t.days ? `Aktif ${t.days} hari` : "Aktif selamanya"}
              </p>
              <ul className="mt-6 space-y-2 text-sm">
                {TIER_FEATURES.map((f) => (
                  <li key={f}>· {f}</li>
                ))}
              </ul>
              <Button
                className="mt-6 w-full"
                variant={t.highlight ? "secondary" : "default"}
                render={<Link href={`/register?tier=${key}`} />}
              >
                Pilih paket
              </Button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
