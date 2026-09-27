import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { API } from "../lib/api";
import Template41 from "../components/Template41";
import { mergeData } from "../lib/invitation";

export default function PublicInvitation({ preview }: { preview?: boolean }) {
  const { slug } = useParams();
  const [sp] = useSearchParams();
  const guest = sp.get("to") ?? undefined;
  const [data, setData] = useState<{ invitation: { slug: string; title: string; status: string; data: Record<string, unknown>; expired_at?: string | null }; wishes: { guest_name: string; message: string }[]; gallery: { url: string }[] } | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const path = preview ? `/preview/${slug}` : `/api/invitations/by-slug/${slug}`;
    fetch(`${API}${path}${guest ? `?to=${encodeURIComponent(guest)}` : ""}`)
      .then(async (r) => {
        if (!r.ok) throw new Error(await r.text());
        return r.json();
      })
      .then(setData)
      .catch((e) => setErr(e.message));
  }, [slug, guest, preview]);

  if (err) return <main style={{ padding: 24 }}>Error: {err.slice(0, 400)}</main>;
  if (!data) return <main style={{ padding: 24 }}>Loading {slug}…</main>;

  const raw = data.invitation.data ?? {};
  const wishes = data.wishes.map((w) => ({ n: w.guest_name, m: w.message }));
  const targetMs = data.invitation.expired_at ? new Date(data.invitation.expired_at).getTime() : undefined;
  const merged = mergeData(raw);

  // if gallery from DB exists, prefer it (api already return gallery_items urls)
  if (data.gallery?.length) {
    merged.gallery = data.gallery.map((g) => g.url);
  }

  return (
    <Template41
      raw={merged}
      targetMs={targetMs}
      wishes={wishes}
      onWish={async (name, msg) => {
        try {
          await fetch(`${API}/api/invitations/${data.invitation.slug}/wishes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ guest_name: name, message: msg }),
          });
          setData((d) => (d ? { ...d, wishes: [{ guest_name: name, message: msg }, ...d.wishes] } : d));
        } catch {}
      }}
    />
  );
}
