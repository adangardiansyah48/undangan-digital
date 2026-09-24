"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { slugify, waLink } from "@/lib/constants";
import { expiryFromEvent } from "@/lib/expiry";
import type { GalleryItem, Guest, Invitation } from "@/types/database";

export function InvitationEditor({
  invitation: initial,
  guests: initialGuests,
  gallery: initialGallery,
}: {
  invitation: Invitation;
  guests: Guest[];
  gallery: GalleryItem[];
}) {
  const [invitation, setInvitation] = useState<Invitation>(initial);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [guests, setGuests] = useState<Guest[]>(initialGuests);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [gallery, setGallery] = useState<GalleryItem[]>(initialGallery);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const data = invitation.data ?? {};

  function patchData(patch: Partial<Invitation["data"]>) {
    setInvitation((v) => ({ ...v, data: { ...v.data, ...patch } }));
  }

  async function save() {
    setSaving(true);
    setMsg(null);
    const supabase = createClient();
    let expiredAt = invitation.expired_at;
    const nextStatus = invitation.status;
    if (nextStatus === "published") {
      const ev = (invitation.data.events ?? [])[0]?.date ?? null;
      expiredAt = expiryFromEvent(ev, 10) ?? expiredAt;
    }
    const { error } = await supabase
      .from("invitations")
      .update({
        title: invitation.title,
        slug: slugify(invitation.slug),
        data: invitation.data,
        status: nextStatus,
        expired_at: expiredAt,
      })
      .eq("id", invitation.id);
    if (error) setMsg(error.message);
    else {
      setMsg("Tersimpan.");
      setInvitation((v) => ({ ...v, slug: slugify(v.slug) }));
    }
    setSaving(false);
  }

  const publicUrl = `/${invitation.slug}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{invitation.title ?? invitation.slug}</h1>
          <p className="text-sm text-muted-foreground">
            <Link href={publicUrl} className="underline" target="_blank">
              {publicUrl}?to=NamaTamu
            </Link>
            {" · "}
            {invitation.tier} · {invitation.status}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" render={<Link href={publicUrl} target="_blank" />}>
            Lihat public
          </Button>
          <Button onClick={save} disabled={saving}>
            {saving ? "Menyimpan…" : "Simpan"}
          </Button>
        </div>
      </div>

      {msg && <p className="text-sm text-muted-foreground">{msg}</p>}

      <Tabs defaultValue="mempelai">
        <TabsList className="flex w-full flex-wrap">
          <TabsTrigger value="mempelai">Mempelai</TabsTrigger>
          <TabsTrigger value="acara">Acara</TabsTrigger>
          <TabsTrigger value="galeri">Galeri (R2)</TabsTrigger>
          <TabsTrigger value="tamu">Tamu</TabsTrigger>
          <TabsTrigger value="amplop">Amplop</TabsTrigger>
          <TabsTrigger value="pengaturan">Pengaturan</TabsTrigger>
        </TabsList>

        <TabsContent value="mempelai" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pasangan</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <p className="text-sm font-medium">Mempelai Pria</p>
                <div className="space-y-1.5">
                  <Label>Nama panggilan</Label>
                  <Input
                    value={data.couple?.groom?.name ?? ""}
                    onChange={(e) =>
                      patchData({
                        couple: {
                          bride: data.couple?.bride ?? { name: "", fullName: "", parents: "" },
                          groom: { ...(data.couple?.groom ?? { name: "", fullName: "", parents: "" }), name: e.target.value },
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Nama lengkap & ortu</Label>
                  <Input
                    value={data.couple?.groom?.fullName ?? ""}
                    onChange={(e) =>
                      patchData({
                        couple: {
                          bride: data.couple?.bride ?? { name: "", fullName: "", parents: "" },
                          groom: { ...(data.couple?.groom ?? { name: "", fullName: "", parents: "" }), fullName: e.target.value },
                        },
                      })
                    }
                    placeholder="Andi Putra"
                  />
                  <Input
                    value={data.couple?.groom?.parents ?? ""}
                    onChange={(e) =>
                      patchData({
                        couple: {
                          bride: data.couple?.bride ?? { name: "", fullName: "", parents: "" },
                          groom: { ...(data.couple?.groom ?? { name: "", fullName: "", parents: "" }), parents: e.target.value },
                        },
                      })
                    }
                    placeholder="Putra dari Bpk… & Ibu…"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-sm font-medium">Mempelai Wanita</p>
                <div className="space-y-1.5">
                  <Label>Nama panggilan</Label>
                  <Input
                    value={data.couple?.bride?.name ?? ""}
                    onChange={(e) =>
                      patchData({
                        couple: {
                          groom: data.couple?.groom ?? { name: "", fullName: "", parents: "" },
                          bride: { ...(data.couple?.bride ?? { name: "", fullName: "", parents: "" }), name: e.target.value },
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Nama lengkap & ortu</Label>
                  <Input
                    value={data.couple?.bride?.fullName ?? ""}
                    onChange={(e) =>
                      patchData({
                        couple: {
                          groom: data.couple?.groom ?? { name: "", fullName: "", parents: "" },
                          bride: { ...(data.couple?.bride ?? { name: "", fullName: "", parents: "" }), fullName: e.target.value },
                        },
                      })
                    }
                    placeholder="Sari Amelia"
                  />
                  <Input
                    value={data.couple?.bride?.parents ?? ""}
                    onChange={(e) =>
                      patchData({
                        couple: {
                          groom: data.couple?.groom ?? { name: "", fullName: "", parents: "" },
                          bride: { ...(data.couple?.bride ?? { name: "", fullName: "", parents: "" }), parents: e.target.value },
                        },
                      })
                    }
                    placeholder="Putri dari Bpk… & Ibu…"
                  />
                </div>
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <Label>Quotes / kutipan nikah</Label>
                <Textarea
                  rows={3}
                  value={data.quote ?? ""}
                  onChange={(e) => patchData({ quote: e.target.value })}
                  placeholder="Dan di antara tanda-tanda…"
                />
                <Input
                  value={data.quoteSource ?? ""}
                  onChange={(e) => patchData({ quoteSource: e.target.value })}
                  placeholder="Q.S. Ar-Rum: 21"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="acara" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tanggal, tempat, musik</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(data.events ?? [{ title: "Akad Nikah", date: "", time: "", venue: "", address: "" }]).map(
                (ev, i) => (
                  <div key={i} className="rounded-xl border border-border p-3">
                    <div className="grid gap-2 md:grid-cols-3">
                      <Input
                        value={ev.title}
                        onChange={(e) => {
                          const next = [...(data.events ?? [])];
                          next[i] = { ...ev, title: e.target.value };
                          patchData({ events: next });
                        }}
                        placeholder="Judul sesi"
                      />
                      <Input
                        type="date"
                        value={ev.date}
                        onChange={(e) => {
                          const next = [...(data.events ?? [])];
                          next[i] = { ...ev, date: e.target.value };
                          patchData({ events: next });
                        }}
                      />
                      <Input
                        type="time"
                        value={ev.time}
                        onChange={(e) => {
                          const next = [...(data.events ?? [])];
                          next[i] = { ...ev, time: e.target.value };
                          patchData({ events: next });
                        }}
                      />
                    </div>
                    <Input
                      className="mt-2"
                      value={ev.venue}
                      onChange={(e) => {
                        const next = [...(data.events ?? [])];
                        next[i] = { ...ev, venue: e.target.value };
                        patchData({ events: next });
                      }}
                      placeholder="Venue / gedung"
                    />
                    <Input
                      className="mt-2"
                      value={ev.address}
                      onChange={(e) => {
                        const next = [...(data.events ?? [])];
                        next[i] = { ...ev, address: e.target.value };
                        patchData({ events: next });
                      }}
                      placeholder="Alamat lengkap"
                    />
                    <Input
                      className="mt-2"
                      value={ev.mapsUrl ?? ""}
                      onChange={(e) => {
                        const next = [...(data.events ?? [])];
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        next[i] = { ...ev, mapsUrl: e.target.value } as any;
                        patchData({ events: next });
                      }}
                      placeholder="Link Google Maps"
                    />
                  </div>
                )
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const list = [...(data.events ?? [])];
                  list.push({ title: "Resepsi", date: "", time: "", venue: "", address: "" });
                  patchData({ events: list });
                }}
              >
                + Sesi
              </Button>
              <div className="space-y-1.5 pt-3">
                <Label>Musik Latar URL (mp3)</Label>
                <Input
                  value={data.musicUrl ?? ""}
                  onChange={(e) => patchData({ musicUrl: e.target.value })}
                  placeholder="https://…/bgm.mp3"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Live stream URL</Label>
                <Input
                  value={data.liveStreamUrl ?? ""}
                  onChange={(e) => patchData({ liveStreamUrl: e.target.value })}
                  placeholder="https://youtube.com/…"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="galeri" className="mt-4 space-y-4">
          <GalleryPanel invitationId={invitation.id} items={gallery} onChanged={setGallery} />
        </TabsContent>

        <TabsContent value="tamu" className="mt-4 space-y-4">
          <GuestPanel invitationId={invitation.id} slug={invitation.slug} guests={guests} onChanged={setGuests} />
        </TabsContent>

        <TabsContent value="amplop" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Amplop digital & hadiah</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(data.banks ?? [{ bank: "", number: "", name: "" }]).map((b, i) => (
                <div key={i} className="grid gap-2 md:grid-cols-3">
                  <Input
                    value={b.bank}
                    onChange={(e) => {
                      const next = [...(data.banks ?? [])];
                      next[i] = { ...b, bank: e.target.value };
                      patchData({ banks: next });
                    }}
                    placeholder="BCA / BNI / OVO"
                  />
                  <Input
                    value={b.number}
                    onChange={(e) => {
                      const next = [...(data.banks ?? [])];
                      next[i] = { ...b, number: e.target.value };
                      patchData({ banks: next });
                    }}
                    placeholder="Nomor rekening"
                  />
                  <Input
                    value={b.name}
                    onChange={(e) => {
                      const next = [...(data.banks ?? [])];
                      next[i] = { ...b, name: e.target.value };
                      patchData({ banks: next });
                    }}
                    placeholder="Atas nama"
                  />
                </div>
              ))}
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => patchData({ banks: [...(data.banks ?? []), { bank: "", number: "", name: "" }] })}
                >
                  + Rekening
                </Button>
                <Button type="button" size="sm" variant="ghost" onClick={save}>
                  Simpan
                </Button>
              </div>
              <div className="space-y-1.5 border-t border-border pt-4">
                <Label>Kirim hadiah fisik (optional)</Label>
                <Input
                  value={data.giftAddress?.name ?? ""}
                  onChange={(e) => patchData({ giftAddress: { ...(data.giftAddress ?? { name: "", phone: "", address: "" }), name: e.target.value } })}
                  placeholder="Nama penerima"
                />
                <Input
                  value={data.giftAddress?.address ?? ""}
                  onChange={(e) => patchData({ giftAddress: { ...(data.giftAddress ?? { name: "", phone: "", address: "" }), address: e.target.value } })}
                  placeholder="Alamat lengkap"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pengaturan" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pengaturan slug & status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label>Judul</Label>
                <Input
                  value={invitation.title ?? ""}
                  onChange={(e) => setInvitation((v) => ({ ...v, title: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Slug (url)</Label>
                <Input
                  value={invitation.slug}
                  onChange={(e) => setInvitation((v) => ({ ...v, slug: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground">/{slugify(invitation.slug)}</p>
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <select
                  value={invitation.status}
                  onChange={(e) =>
                    setInvitation((v) => ({ ...v, status: e.target.value as Invitation["status"] }))
                  }
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published (tampak public)</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <Button onClick={save} disabled={saving} variant="outline">
                Simpan pengaturan
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function GalleryPanel({
  invitationId,
  items,
  onChanged,
}: {
  invitationId: string;
  items: GalleryItem[];
  onChanged: (next: GalleryItem[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMsg(null);
    try {
      const fd = new FormData();
      fd.set("file", file);
      const res = await fetch(`/api/invitations/${invitationId}/gallery`, {
        method: "POST",
        body: fd,
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Gagal upload");
      onChanged([body.item, ...items]);
      setMsg(`Upload R2 OK (${body.mime ?? "image"} ${(body.compressed ? Math.round(body.compressed / 1024) + "KB" : "")})`.trim());
    } catch (err) {
      setMsg(err instanceof Error ? err.message : String(err));
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Galeri — R2 terkompres (webp ≤1920px, ~78q). Hapus otomatis 10 hari setelah H.</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input type="file" accept="image/*,video/*" onChange={upload} disabled={uploading} />
        {msg && <p className="text-sm text-muted-foreground">{msg}</p>}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {items.map((it) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={it.id} src={it.url} alt={it.caption ?? ""} className="aspect-square rounded-xl object-cover" />
          ))}
        </div>
        {!items.length && <p className="text-sm text-muted-foreground">Belum ada foto.</p>}
      </CardContent>
    </Card>
  );
}

function GuestPanel({
  invitationId,
  slug,
  guests,
  onChanged,
}: {
  invitationId: string;
  slug: string;
  guests: Guest[];
  onChanged: (next: Guest[]) => void;
}) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  async function addGuest(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/invitations/${invitationId}/guests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Gagal");
      onChanged([body.guest, ...guests]);
      setName("");
    } catch (err) {
      setMsg(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Tamu & link personal</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Satu link diisi otomatis: <code>/{slug}?to=NamaTamu</code> — generate per tamu atau ketik manual via WA.
        </p>
        <form onSubmit={addGuest} className="flex gap-2">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama tamu" />
          <Button type="submit" disabled={loading}>
            Tambah
          </Button>
        </form>
        {msg && <p className="text-sm text-muted-foreground">{msg}</p>}
        <div className="max-h-64 space-y-2 overflow-auto pr-1">
          {guests.map((g) => {
            const link = `/${slug}?to=${encodeURIComponent(g.name)}`;
            const wa = waLink(`Halo ${g.name}, undangan kami: ${origin || ""}${link}`);
            return (
              <div key={g.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border px-3 py-2 text-sm">
                <span className="font-medium">{g.name}</span>
                <span className="flex items-center gap-1">
                  <Button size="sm" variant="ghost" render={<Link href={link} target="_blank" />}>
                    Lihat
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    render={<a href={wa} target="_blank" rel="noreferrer" />}
                  >
                    WA
                  </Button>
                </span>
              </div>
            );
          })}
        </div>
        {!guests.length && <p className="text-sm text-muted-foreground">Belum ada tamu terdaftar.</p>}
      </CardContent>
    </Card>
  );
}
