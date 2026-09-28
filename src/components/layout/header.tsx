"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_NAME, waLink } from "@/lib/constants";

const NAV = [
  { href: "/katalog", label: "Katalog" },
  { href: "/#fitur", label: "Fitur" },
  { href: "/#cara", label: "Cara Order" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-serif text-xl font-bold tracking-tight">mstory<span className="font-normal text-muted-foreground">.id</span></span>
          <span className="hidden rounded-full bg-foreground px-2.5 py-0.5 text-[10px] font-medium tracking-widest text-background sm:inline">ELEGANT</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-foreground/70 hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" size="sm" render={<Link href="/login" />}>Masuk</Button>
          <Button size="sm" className="rounded-full px-6" render={<a href={waLink("Halo mstory, mau dibuatkan undangan digital.")} target="_blank" rel="noreferrer" />}>Chat WA</Button>
          <Button size="sm" className="rounded-full" render={<Link href="/register" />}>Coba Editor</Button>
        </div>
        <button className="grid size-9 place-items-center rounded-full border md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Menu">
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
      {open && (
        <div className="border-t bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3 text-sm">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="py-2 font-medium">{item.label}</Link>
            ))}
            <a href={waLink("Halo mstory, mau konsultasi undangan")} target="_blank" rel="noreferrer" className="py-2 font-medium">Chat WA</a>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Button variant="outline" render={<Link href="/login" />}>Masuk</Button>
              <Button render={<Link href="/register" />}>Coba Editor</Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
