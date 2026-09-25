"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";

const NAV = [
  { href: "/#fitur", label: "Fitur" },
  { href: "/katalog", label: "Desain" },
  { href: "/#harga", label: "Harga" },
  { href: "/#cara", label: "Cara Order" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-4 md:h-[84px]">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground font-serif text-lg font-bold shadow-sm md:size-11 md:text-xl">
            M
          </span>
          <span className="font-serif text-xl font-semibold tracking-tight md:text-2xl">{APP_NAME}</span>
          <span className="hidden text-xs tracking-[0.2em] uppercase text-muted-foreground md:inline">Elegant</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[15px] font-medium tracking-wide text-foreground/70 transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" size="lg" render={<Link href="/login" />}>
            Masuk
          </Button>
          <Button size="lg" className="rounded-full px-6" render={<Link href="/register" />}>
            Mulai Gratis
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X /> : <Menu />}
        </Button>
      </div>

      {open && (
        <div className="border-t border-border px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3 text-sm">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-muted-foreground"
              >
                {item.label}
              </Link>
            ))}
            <Link href="/login" onClick={() => setOpen(false)}>
              Masuk
            </Link>
            <Button render={<Link href="/register" />} className="w-full">
              Mulai Gratis
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
