import { createClient } from "@/lib/supabase/server";
import { SettingsClient } from "./settings-client";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let gdriveConnected = false;
  if (user) {
    const { data } = await supabase
      .from("gdrive_tokens")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();
    gdriveConnected = !!data;
  }

  return <SettingsClient gdriveConnected={gdriveConnected} userEmail={user?.email ?? null} />;
}
