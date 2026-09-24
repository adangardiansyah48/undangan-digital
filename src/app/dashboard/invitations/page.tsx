import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function InvitationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data } = user
    ? await supabase
        .from("invitations")
        .select("id,slug,title,tier,status,expired_at,view_count,created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
    : { data: null };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Undangan saya</h1>
        <Button render={<Link href="/dashboard/new" />}>+ Buat baru</Button>
      </div>

      {!data?.length ? (
        <p className="text-sm text-muted-foreground">
          Belum ada undangan.{" "}
          <Link href="/dashboard/new" className="underline">
            Buat sekarang
          </Link>
          .
        </p>
      ) : (
        <div className="grid gap-3">
          {data.map((inv) => (
            <Card key={inv.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <Link
                    href={`/dashboard/invitations/${inv.id}`}
                    className="font-medium hover:underline"
                  >
                    {inv.title ?? inv.slug} · /{inv.slug}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {inv.status} · {inv.tier} · view {inv.view_count}
                    {inv.expired_at ? ` · expired ${new Date(inv.expired_at).toLocaleDateString("id-ID")}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{inv.status}</Badge>
                  <Button size="sm" variant="outline" render={<Link href={`/${inv.slug}?to=CobaTamu`} />}>
                    Lihat public
                  </Button>
                  <Button size="sm" render={<Link href={`/dashboard/invitations/${inv.id}`} />}>
                    Editor
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
