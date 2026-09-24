import Link from "next/link";
import { APP_NAME, waLink } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-semibold">{APP_NAME}</p>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Platform undangan digital hybrid. Bikin sendiri, atau dibuatkan tim
            desainer. Cepat, elegan, hemat.
          </p>
        </div>
        <div>
          <p className="text-sm font-medium">Produk</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/katalog">Katalog tema</Link>
            </li>
            <li>
              <Link href="/#harga">Harga</Link>
            </li>
            <li>
              <Link href="/register">Buat undangan</Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-medium">Bantuan</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <a href={waLink(`Halo, mau tanya tentang ${APP_NAME}`)}>WhatsApp</a>
            </li>
            <li>
              <Link href="/login">Masuk dashboard</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
      </div>
    </footer>
  );
}
