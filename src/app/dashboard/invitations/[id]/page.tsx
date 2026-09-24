import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { InvitationEditor } from "./editor";

export default async function EditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: invitation, error } = await supabase
    .from("invitations")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !invitation) return notFound();

  const { data: guests } = await supabase
    .from("guests")
    .select("*")
    .eq("invitation_id", id)
    .order("created_at", { ascending: false })
    .limit(100);

  const { data: gallery } = await supabase
    .from("gallery_items")
    .select("*")
    .eq("invitation_id", id)
    .order("sort_order");

  return <InvitationEditor invitation={invitation} guests={guests ?? []} gallery={gallery ?? []} />;
}
