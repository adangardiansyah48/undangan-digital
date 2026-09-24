import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: invitations } = user
    ? await supabase
        .from("invitations")
        .select("id,slug,title,tier,status,expired_at,view_count")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10)
    : { data: null };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Halo, {(user?.user_metadata as { full_name?: string })?.full_name ?? user?.email ?? "Kamu"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Kelola undanganmu. Hybrid: edit sendiri atau buat request dibuatkan tim.
          </p>
        </div>
        <div className="flex gap-2">
          <Button render={<Link href="/katalog" />} variant="outline">
            Cari tema
          </Button>
          <Button render={<Link href="/dashboard/new" />}>Buat undangan</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Undangan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{invitations?.length ?? 0}</p>
            <p className="text-xs text-muted-foreground">Total milikmu</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Mode toko</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Supabase perlu diisi di <code>.env.local</code>. Tanpa itu, data
            undangan disimulasikan.
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Storage GDrive</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Hubungkan di Pengaturan → Google Drive untuk kapasitas besar.
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Undangan terbaru</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {!invitations?.length ? (
            <p className="text-sm text-muted-foreground">
              Belum ada. <Link href="/dashboard/new" className="underline">Buat sekarang</Link>.
            </p>
          ) : (
            invitations.map((inv) => (
              <Link
                key={inv.id}
                href={`/dashboard/invitations/${inv.id}`}
                className="flex items-center justify-between rounded-xl border border-border px-4 py-3 hover:bg-muted/50"
              >
                <span className="font-medium">/{inv.slug}</span>
                <span className="text-sm text-muted-foreground">
                  {inv.tier} · {inv.status} · views {inv.view_count}
                </span>
              </Link>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
