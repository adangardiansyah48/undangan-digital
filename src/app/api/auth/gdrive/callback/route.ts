import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { exchangeCode, saveTokens } from "@/lib/gdrive";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const origin = url.origin;

  if (!code) return NextResponse.redirect(`${origin}/dashboard/settings?error=gdrive`);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || (state && state !== user.id)) {
    return NextResponse.redirect(`${origin}/dashboard/settings?error=gdrive_state`);
  }

  try {
    const tokens = await exchangeCode(code);
    await saveTokens(user.id, tokens as never);
    return NextResponse.redirect(`${origin}/dashboard/settings?gdrive=connected`);
  } catch {
    return NextResponse.redirect(`${origin}/dashboard/settings?error=gdrive_exchange`);
  }
}
