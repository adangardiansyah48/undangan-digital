import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    await supabase.from("gdrive_tokens").delete().eq("user_id", user.id);
  }
  const { origin } = new URL(request.url);
  return NextResponse.redirect(`${origin}/dashboard/settings`, { status: 302 });
}
