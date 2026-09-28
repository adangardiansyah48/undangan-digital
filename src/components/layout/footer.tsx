import Link from "next/link";
import { APP_NAME, waLink } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:px-8 py-10 md:grid-cols-[1.4fr_0.8fr_0.8fr]">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="mstory.id" className="h-8 w-auto" />
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">Jasa pembuatan undangan digital. Bikin sendiri via editor atau order dibantu tim. Fresh, elegan, gampang untuk awam.</p>
          <p className="mt-4 text-xs text-muted-foreground">Butuh bantuan? <a href={waLink("Halo mstory, butuh bantuan undangan digital")} target="_blank" rel="noreferrer" className="font-medium text-foreground underline">Chat WA</a></p>
        </div>
        <div>
          <p className="text-sm font-semibold">Jelajah</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/katalog" className="hover:text-foreground">Katalog Desain</Link></li>
            <li><Link href="/register" className="hover:text-foreground">Editor Gratis</Link></li>
            <li><Link href="/#fitur" className="hover:text-foreground">Fitur</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold">Bantuan</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><a href={waLink(`Halo ${APP_NAME}, mau konsultasi`)} target="_blank" rel="noreferrer" className="hover:text-foreground">WhatsApp</a></li>
            <li><Link href="/login" className="hover:text-foreground">Masuk Dashboard</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t py-4 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} {APP_NAME} — undangan digital fresh & elegant.</div>
    </footer>
  );
}
