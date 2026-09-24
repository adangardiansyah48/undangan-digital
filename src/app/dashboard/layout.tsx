import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-svh bg-muted/20">
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background px-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <span className="grid size-7 place-items-center rounded-full bg-primary text-xs text-primary-foreground">
            I
          </span>
          {APP_NAME}
          <span className="text-xs font-normal text-muted-foreground">Dashboard</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Button variant="ghost" size="sm" render={<Link href="/katalog" />}>
            Katalog
          </Button>
          <Button variant="ghost" size="sm" render={<Link href="/dashboard/settings" />}>
            Akun
          </Button>
          <form action="/api/auth/signout" method="post">
            <Button type="submit" variant="outline" size="sm">
              Keluar
            </Button>
          </form>
        </nav>
      </header>
      <div className="mx-auto flex max-w-6xl">
        <aside className="hidden w-56 shrink-0 border-r border-border/60 p-4 md:block">
          <nav className="space-y-1 text-sm">
            <Link className="block rounded-lg px-3 py-2 hover:bg-muted" href="/dashboard">
              Ringkasan
            </Link>
            <Link className="block rounded-lg px-3 py-2 hover:bg-muted" href="/dashboard/invitations">
              Undangan saya
            </Link>
            <Link className="block rounded-lg px-3 py-2 hover:bg-muted" href="/dashboard/new">
              + Buat baru
            </Link>
            <Link className="block rounded-lg px-3 py-2 hover:bg-muted" href="/dashboard/settings">
              Pengaturan
            </Link>
          </nav>
        </aside>
        <main className="min-w-0 flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
