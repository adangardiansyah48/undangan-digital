import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/constants";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { name } = await request.json().catch(() => ({ name: "" }));
  if (!name?.trim()) return NextResponse.json({ error: "Nama wajib" }, { status: 400 });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Auth" }, { status: 401 });

  const { data: inv } = await supabase
    .from("invitations")
    .select("id,user_id")
    .eq("id", id)
    .single();
  if (!inv || inv.user_id !== user.id)
    return NextResponse.json({ error: "Not found / owner only" }, { status: 404 });

  const guestSlug = slugify(name);

  const { data: guest, error } = await supabase
    .from("guests")
    .insert({ invitation_id: id, name: name.trim(), slug: guestSlug })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ guest });
}
