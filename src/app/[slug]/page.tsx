import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { PublicInvitation } from "./public-invitation";

const RESERVED = new Set([
  "api",
  "auth",
  "dashboard",
  "katalog",
  "login",
  "register",
  "preview",
  "_next",
]);

export default async function PublicInvitationPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ to?: string }>;
}) {
  const { slug } = await params;
  if (RESERVED.has(slug)) return notFound();

  const { to } = await searchParams;
  const guestName = to ? decodeURIComponent(to) : null;

  const supabase = await createClient();
  const { data: invitation, error } = await supabase
    .from("invitations")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !invitation) return notFound();
  if (invitation.expired_at && new Date(invitation.expired_at).getTime() <= Date.now()) {
    return (
      <main className="flex min-h-svh flex-col items-center justify-center gap-2 px-4">
        <p className="text-sm font-medium">Undangan sudah berakhir.</p>
        <p className="text-xs text-muted-foreground">Konten dan foto otomatis terhapus setelah masa aktif habis.</p>
      </main>
    );
  }
  if (invitation.status !== "published") {
    return (
      <main className="flex min-h-svh items-center justify-center px-4">
        <p className="text-sm text-muted-foreground">Undangan belum dipublish.</p>
      </main>
    );
  }

  const [{ data: wishes }, { data: gallery }] = await Promise.all([
    supabase
      .from("wishes")
      .select("*")
      .eq("invitation_id", invitation.id)
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("gallery_items")
      .select("*")
      .eq("invitation_id", invitation.id)
      .order("sort_order"),
  ]);

  void supabase.from("analytics").insert({
    invitation_id: invitation.id,
    guest_slug: guestName ?? null,
    user_agent: null,
    referrer: null,
  });

  await supabase
    .from("invitations")
    .update({ view_count: (invitation.view_count ?? 0) + 1 })
    .eq("id", invitation.id);

  return (
    <PublicInvitation
      invitation={invitation}
      guestName={guestName}
      wishes={wishes ?? []}
      gallery={gallery ?? []}
    />
  );
}
