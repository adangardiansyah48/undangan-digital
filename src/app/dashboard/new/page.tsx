"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { slugify } from "@/lib/constants";
import type { Track } from "@/types/database";

export default function NewInvitationPage() {
  const router = useRouter();
  const params = useSearchParams();
  const presetTemplate = params.get("template") ?? undefined;

  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [track, setTrack] = useState<Track>("self");
  const [brief, setBrief] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const slugValue = slugify(slug || title || "undangan-kami");
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Harus login dulu");

      let templateId: string | null = null;
      let cloneData: Record<string, unknown> = {};
      if (presetTemplate) {
        const { data: tmpl } = await supabase.from("templates").select("id").eq("slug", presetTemplate).maybeSingle();
        templateId = tmpl?.id ?? null;
        const { data: demo } = await supabase.from("invitations").select("data").eq("slug", presetTemplate).eq("status", "published").maybeSingle();
        if (demo?.data && typeof demo.data === "object") cloneData = demo.data as Record<string, unknown>;
      }

      const { data: invitation, error: invErr } = await supabase
        .from("invitations")
        .insert({
          user_id: user.id,
          template_id: templateId,
          slug: slugValue,
          title: title || slugValue,
          track,
          expired_at: null,
          data: cloneData,
          status: "draft",
        })
        .select("id")
        .single();

      if (invErr) throw invErr;

      if (track === "assisted") {
        const { data: order, error: orderErr } = await supabase
          .from("orders")
          .insert({
            user_id: user.id,
            invitation_id: invitation.id,
            track: "assisted",
            payment_status: "pending",
          })
          .select("id")
          .single();
        if (orderErr) throw orderErr;
        const { error: assistErr } = await supabase.from("assistance_requests").insert({
          user_id: user.id,
          order_id: order.id,
          invitation_id: invitation.id,
          template_id: templateId,
          brief: brief || null,
        });
        if (assistErr) throw assistErr;
      }

      router.push(`/dashboard/invitations/${invitation.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-semibold tracking-tight">Buat undangan</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Pilih jalur hybrid. Isi slug = link undanganmu: <code>/{slugify(slug || title || "nama-kami")}</code>
      </p>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Info dasar</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            {presetTemplate && (
              <p className="text-sm text-muted-foreground">
                Tema: <strong className="text-foreground">{presetTemplate}</strong> ·{" "}
                <Link href="/katalog" className="underline">
                  Ganti
                </Link>
              </p>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="title">Judul tampil</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Andi & Sari"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="slug">Slug link</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="andi-sari"
                />
                <p className="text-xs text-muted-foreground">Hasil: /{slugify(slug || title || "slug-link")}</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Jalur</Label>
              <Select value={track} onValueChange={(v) => setTrack(v as Track)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="self">Saya edit sendiri</SelectItem>
                  <SelectItem value="assisted">Dibuatkan tim</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {track === "assisted" && (
              <div className="space-y-1.5">
                <Label>Brief untuk desainer</Label>
                <textarea
                  value={brief}
                  onChange={(e) => setBrief(e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Warna, foto, alamat akad & resepsi, request khusus…"
                />
              </div>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Memproses…" : track === "assisted" ? "Buat & ajukan ke tim" : "Buat undangan"}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Selanjutnya kamu akan diarahkan ke editor.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


