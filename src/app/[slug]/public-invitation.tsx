"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Countdown } from "@/components/invitation/countdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { GalleryItem, Invitation, Wish } from "@/types/database";

export function PublicInvitation({
  invitation,
  guestName,
  wishes: initialWishes,
  gallery: initialGallery,
}: {
  invitation: Invitation;
  guestName: string | null;
  wishes: Wish[];
  gallery: GalleryItem[];
}) {
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [wishes, setWishes] = useState<Wish[]>(initialWishes);
  const [wishName, setWishName] = useState(guestName ?? "");
  const [wishMsg, setWishMsg] = useState("");
  const [rsvp, setRsvp] = useState<"hadir" | "tidak" | "ragu">("hadir");
  const [sending, setSending] = useState(false);

  const data = invitation.data ?? {};
  const events = (data.events ?? []) as Invitation["data"]["events"];
  const firstDate = events?.[0]?.date ? `${events[0].date}T${events[0].time || "08:00"}` : null;
  const bride = data.couple?.bride?.name ?? "Sari";
  const groom = data.couple?.groom?.name ?? "Andi";
  const together = `${groom} & ${bride}`;

  async function sendWish(e: React.FormEvent) {
    e.preventDefault();
    if (!wishName.trim() || !wishMsg.trim()) return;
    setSending(true);
    const supabase = createClient();
    const { data: row, error } = await supabase
      .from("wishes")
      .insert({
        invitation_id: invitation.id,
        guest_name: wishName.trim(),
        message: wishMsg.trim(),
        rsvp_status: rsvp,
      })
      .select("*")
      .single();
    setSending(false);
    if (!error && row) {
      setWishes((w) => [row as Wish, ...w]);
      setWishMsg("");
    }
  }

  function toggleMusic() {
    const el = audioRef.current;
    if (!el || !data.musicUrl) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      el.play().then(() => setPlaying(true)).catch(() => {});
    }
  }

  const displayGuest = guestName ?? "Tamu Undangan";

  if (!open) {
    return (
      <main className="flex min-h-svh flex-col items-center justify-center bg-muted/20 px-4 py-16">
        <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground">{invitation.title ?? together}</p>
        <h1 className="font-serif mt-6 text-center text-4xl">{together}</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">Kepada: {displayGuest}</p>
        <Button size="lg" className="mt-8 rounded-full px-10" onClick={() => setOpen(true)}>
          Buka Undangan
        </Button>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Musik &amp; halaman lengkap setelah membuka.
        </p>
      </main>
    );
  }

  return (
    <main className="bg-muted/20">
      {data.musicUrl && (
        <audio ref={audioRef} src={data.musicUrl} loop preload="none" className="hidden" />
      )}
      <div className="mx-auto max-w-md border-x border-border bg-background min-h-svh">
        {data.musicUrl && (
          <button
            onClick={toggleMusic}
            className="sticky top-2 z-20 ml-auto mr-2 mt-2 block rounded-full border border-border bg-card px-3 py-1 text-xs"
            type="button"
          >
            {playing ? "Pause musik" : "Play musik"}
          </button>
        )}

        <section className="px-6 py-12 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground">The Wedding of</p>
          <h1 className="font-serif mt-4 text-4xl">{together}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {events?.[0]?.date
              ? new Date(`${events[0].date}T12:00:00`).toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "Save The Date"}
          </p>
          <p className="mt-6 text-sm text-muted-foreground">Kepada: {displayGuest}</p>
        </section>

        {(data.quote || data.couple) && (
          <section id="couple" className="border-t border-border px-6 py-10 text-center">
            {data.quote && (
              <>
                <p className="italic text-sm text-muted-foreground">“{data.quote}”</p>
                {data.quoteSource && (
                  <p className="mt-1 text-xs text-muted-foreground">— {data.quoteSource}</p>
                )}
              </>
            )}
            {data.couple && (
              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <div>
                  <p className="font-serif text-lg">{data.couple.groom.fullName || data.couple.groom.name}</p>
                  <p className="text-xs text-muted-foreground">{data.couple.groom.parents}</p>
                </div>
                <div>
                  <p className="font-serif text-lg">{data.couple.bride.fullName || data.couple.bride.name}</p>
                  <p className="text-xs text-muted-foreground">{data.couple.bride.parents}</p>
                </div>
              </div>
            )}
          </section>
        )}

        {(firstDate || (events && events.length)) && (
          <section id="event" className="border-t border-border px-6 py-10">
            {firstDate && <Countdown targetIso={new Date(firstDate).toISOString()} />}
            {events?.length ? (
              <div className="mt-6 space-y-4">
                {events.map((ev, i) => (
                  <div key={i} className="rounded-2xl border border-border p-4">
                    <p className="font-medium">{ev.title || `Sesi ${i + 1}`}</p>
                    <p className="text-sm text-muted-foreground">
                      {ev.date}
                      {ev.time ? ` · ${ev.time}` : ""}
                    </p>
                    {ev.venue && <p className="mt-1 text-sm">{ev.venue}</p>}
                    {ev.address && <p className="text-xs text-muted-foreground">{ev.address}</p>}
                    {"mapsUrl" in ev && (ev as { mapsUrl?: string }).mapsUrl ? (
                      <a
                        href={(ev as { mapsUrl?: string }).mapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex rounded-full border border-border px-3 py-1 text-xs"
                      >
                        Buka Maps
                      </a>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}
            {data.liveStreamUrl && (
              <a
                href={data.liveStreamUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex rounded-full bg-primary px-4 py-1.5 text-sm text-primary-foreground"
              >
                Live streaming
              </a>
            )}
          </section>
        )}

        {initialGallery.length > 0 && (
          <section id="gallery" className="border-t border-border px-6 py-10">
            <h2 className="font-serif text-xl">Gallery</h2>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {initialGallery.map((it) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={it.id} src={it.url} alt={it.caption ?? ""} className="aspect-square rounded-xl object-cover" />
              ))}
            </div>
          </section>
        )}

        {events?.length || data.banks?.length ? (
          <section id="gift" className="border-t border-border px-6 py-10">
            <h2 className="font-serif text-xl">Amplop Digital</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Doa restu sudah cukup bermakna. Jika berkenan berbagi kasih, silakan pakai.
            </p>
            {data.banks?.length ? (
              <div className="mt-4 space-y-3">
                {data.banks.map((b, i) => (
                  <div key={i} className="rounded-2xl border border-border bg-card p-4">
                    <p className="text-sm font-medium">{b.bank}</p>
                    <p className="font-mono text-sm">{b.number}</p>
                    <p className="text-xs text-muted-foreground">a.n. {b.name}</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2"
                      onClick={() => navigator.clipboard.writeText(b.number)}
                    >
                      Salin
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">Rekening akan diisi di dashboard.</p>
            )}
          </section>
        ) : null}

        <section id="wish" className="border-t border-border px-6 py-10">
          <h2 className="font-serif text-xl">Ucapan &amp; RSVP</h2>
          <form onSubmit={sendWish} className="mt-4 space-y-3">
            <div>
              <Label>Nama</Label>
              <Input value={wishName} onChange={(e) => setWishName(e.target.value)} required />
            </div>
            <div>
              <Label>Kehadiran</Label>
              <div className="mt-1 flex gap-2 text-sm">
                {(["hadir", "tidak", "ragu"] as const).map((v) => (
                  <label key={v} className={`flex-1 cursor-pointer rounded-xl border px-3 py-2 text-center text-xs uppercase ${rsvp === v ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>
                    <input type="radio" className="hidden" checked={rsvp === v} onChange={() => setRsvp(v)} />
                    {v}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <Label>Pesan</Label>
              <Textarea rows={3} value={wishMsg} onChange={(e) => setWishMsg(e.target.value)} required />
            </div>
            <Button type="submit" disabled={sending} className="w-full">
              {sending ? "Mengirim…" : "Kirim ucapan"}
            </Button>
          </form>

          <div className="mt-6 space-y-3">
            {wishes.map((w) => (
              <div key={w.id} className="rounded-2xl border border-border p-3">
                <p className="text-sm font-medium">
                  {w.guest_name} <span className="ml-2 text-xs font-normal text-muted-foreground">{w.rsvp_status}</span>
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{w.message}</p>
              </div>
            ))}
            {!wishes.length && <p className="text-sm text-muted-foreground">Jadilah yang pertama mengucap.</p>}
          </div>
        </section>

        <div className="border-t border-border px-6 py-8 text-center text-xs text-muted-foreground">
          Terima kasih — {together}
        </div>
      </div>

      <nav className="mx-auto flex max-w-md gap-1 border-x border-t border-border bg-card px-2 py-2 text-xs">
        {[
          { id: "couple", label: "Couple" },
          { id: "event", label: "Event" },
          { id: "gallery", label: "Gallery" },
          { id: "wish", label: "Wishes" },
          { id: "gift", label: "Gift" },
        ].map((n) => (
          <a
            key={n.id}
            href={`#${n.id}`}
            className="flex-1 rounded-full px-2 py-2 text-center hover:bg-muted"
          >
            {n.label}
          </a>
        ))}
      </nav>
    </main>
  );
}
