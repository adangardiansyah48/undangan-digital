"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Countdown } from "@/components/invitation/countdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { GalleryItem, Invitation, Wish } from "@/types/database";
import { getTheme } from "@/components/invitation/themes";

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
  const [copied, setCopied] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [wishes, setWishes] = useState<Wish[]>(initialWishes);
  const [wishName, setWishName] = useState(guestName ?? "");
  const [wishMsg, setWishMsg] = useState("");
  const [rsvp, setRsvp] = useState<"hadir" | "tidak" | "ragu">("hadir");
  const [sending, setSending] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const data = invitation.data ?? {};
  const events = (data.events ?? []) as NonNullable<Invitation["data"]["events"]>;
  const firstDate = events?.[0]?.date ? `${events[0].date}T${events[0].time || "08:00"}` : null;
  const bride = data.couple?.bride?.name ?? "Sari";
  const groom = data.couple?.groom?.name ?? "Andi";
  const together = `${groom} & ${bride}`;
  const theme = getTheme(invitation.slug);

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

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 1400);
    });
  }

  function toggleMusic() {
    const el = audioRef.current;
    if (!el || !data.musicUrl) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      el.play()
        .then(() => setPlaying(true))
        .catch(() => {});
    }
  }

  useEffect(() => {
    if (!open || !data.musicUrl || playing) return;
    const t = setTimeout(() => audioRef.current?.play().then(() => setPlaying(true)).catch(() => {}), 800);
    return () => clearTimeout(t);
  }, [open, data.musicUrl, playing]);

  useEffect(() => {
    if (!open) return;
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("is-visible")), { threshold: 0.15 });
    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [open]);

  const displayGuest = guestName ?? "Tamu Undangan";
  const coverPhoto = data.coverPhoto ?? data.couple?.bride?.photo ?? data.couple?.groom?.photo ?? null;
  const timeline = (data.storyTimeline ?? []) as { date: string; title: string; desc: string }[];
  const closingTitle = data.closingTitle ?? `Terima kasih — ${together}`;
  const closingMessage = data.closingMessage ?? "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu. Sampai jumpa di hari bahagia kami.";

  if (!open) {
    return (
      <main className={`relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-4 py-16 ${theme.cover}`}>
        {coverPhoto && <div className="pointer-events-none absolute inset-0 opacity-20" style={{ backgroundImage: `url(${coverPhoto})`, backgroundSize: "cover", backgroundPosition: "center" }} />}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        <div className="relative text-center">
          <p className={`text-xs tracking-[0.3em] uppercase opacity-80 ${theme.fontBody}`}>{data.coverTitle ?? invitation.title ?? "The Wedding of"}</p>
          <p className="mt-2 text-[11px] tracking-[0.2em] uppercase opacity-60">The Wedding Of</p>
          <h1 className={`mt-3 text-center text-5xl text-white ${theme.fontTitle}`}>
            {groom} <span className="text-2xl opacity-60">&amp;</span> {bride}
          </h1>
          {firstDate && <p className="mt-2 text-sm text-white/70">{new Date(firstDate).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} · {events[0]?.venue ?? ""}</p>}
          <div className="mx-auto mt-8 max-w-[320px] rounded-2xl border border-white/20 bg-white/10 px-6 py-5 backdrop-blur">
            <p className="text-xs text-white/70">Kepada Yth.</p>
            <p className="mt-1 font-serif text-xl text-white">{displayGuest}</p>
            <p className="mt-1 text-[10px] text-white/40">Tanpa mengurangi rasa hormat</p>
          </div>
          <Button size="lg" className={`mt-8 rounded-full px-10 ${theme.accent}`} onClick={() => setOpen(true)}>
            Buka Undangan
          </Button>
          <p className="mt-3 text-xs text-white/40">* Musik otomatis setelah membuka</p>
        </div>
      </main>
    );
  }

  return (
    <main className={`${theme.bg} ${theme.text}`}>
      <style>{`[data-reveal]{opacity:0;transform:translateY(16px);transition:600ms ease}[data-reveal].is-visible{opacity:1;transform:none}`}</style>
      {data.musicUrl && <audio ref={audioRef} src={data.musicUrl} loop preload="none" className="hidden" />}
      <div className={`mx-auto max-w-md border-x ${theme.divider} bg-background min-h-svh`}>
        {data.musicUrl && (
          <button onClick={toggleMusic} className="sticky top-2 z-20 ml-auto mr-2 mt-2 block rounded-full border border-border bg-card px-3 py-1 text-xs" type="button">
            {playing ? "⏸ Pause" : "♪ Play musik"}
          </button>
        )}

        <section data-reveal className="px-6 py-12 text-center">
          <p className="text-xs tracking-[0.3em] uppercase opacity-60">{data.coverTitle ?? "The Wedding of"}</p>
          <h1 className={`mt-4 text-4xl ${theme.fontTitle}`}>{together}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {events?.[0]?.date
              ? new Date(`${events[0].date}T12:00:00`).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
              : "Save The Date"}
          </p>
          {events?.[0]?.venue && <p className="mt-1 text-xs text-muted-foreground">{events[0].venue} · {events[0].time ?? ""}</p>}
          <p className="mt-6 rounded-full border border-border bg-muted/40 px-4 py-2 text-sm">Kepada: {displayGuest}</p>
          {firstDate && <div className="mt-6"><Countdown targetIso={new Date(firstDate).toISOString()} /></div>}
        </section>

        {(data.quote || data.couple) && (
          <section data-reveal id="couple" className="border-t border-border px-6 py-10 text-center">
            {data.quote && (
              <>
                <p className="italic text-sm leading-relaxed text-muted-foreground">“{data.quote}”</p>
                {data.quoteSource && <p className="mt-1 text-xs text-muted-foreground">— {data.quoteSource}</p>}
              </>
            )}
            {data.couple && (
              <div className={`mt-8 grid gap-6 ${theme.coupleLayout === "side" ? "md:grid-cols-[1fr_auto_1fr] items-center" : ""}`}>
                <div className="text-center">
                  <div className={`mx-auto overflow-hidden bg-muted ${theme.coupleLayout === "arch" ? "size-32 rounded-t-[100px] rounded-b-2xl border-4" : "size-24 rounded-full border-4"} ${theme.divider}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {data.couple.bride.photo ? <img src={data.couple.bride.photo} alt={data.couple.bride.name} className="h-full w-full object-cover" /> : <span className={`grid h-full place-items-center text-2xl ${theme.fontTitle}`}>{data.couple.bride.name[0]}</span>}
                  </div>
                  <p className={`${theme.fontTitle} mt-3 text-lg`}>{data.couple.bride.fullName || data.couple.bride.name}</p>
                  <p className="text-xs opacity-60">{data.couple.bride.parents}</p>
                  {data.couple.bride.instagram && <a href={`https://instagram.com/${data.couple.bride.instagram.replace(/^@/, "")}`} target="_blank" rel="noreferrer" className="text-xs text-primary underline">@{data.couple.bride.instagram.replace(/^@/, "")}</a>}
                </div>
                <p className={`text-center text-2xl ${theme.fontTitle}`}>{theme.coupleLayout === "side" ? "•" : "&"}</p>
                <div className="text-center">
                  <div className={`mx-auto overflow-hidden bg-muted ${theme.coupleLayout === "arch" ? "size-32 rounded-t-[100px] rounded-b-2xl border-4" : "size-24 rounded-full border-4"} ${theme.divider}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {data.couple.groom.photo ? <img src={data.couple.groom.photo} alt={data.couple.groom.name} className="h-full w-full object-cover" /> : <span className={`grid h-full place-items-center text-2xl ${theme.fontTitle}`}>{data.couple.groom.name[0]}</span>}
                  </div>
                  <p className={`${theme.fontTitle} mt-3 text-lg`}>{data.couple.groom.fullName || data.couple.groom.name}</p>
                  <p className="text-xs opacity-60">{data.couple.groom.parents}</p>
                  {data.couple.groom.instagram && <a href={`https://instagram.com/${data.couple.groom.instagram.replace(/^@/, "")}`} target="_blank" rel="noreferrer" className="text-xs text-primary underline">@{data.couple.groom.instagram.replace(/^@/, "")}</a>}
                </div>
              </div>
            )}
            {data.story && <p className="mt-8 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">{data.story}</p>}
            {timeline.length > 0 && (
              <div className="mt-8 border-l border-border ml-4 pl-6 space-y-6 text-left">
                {timeline.map((s, i) => (
                  <div key={i} className="relative">
                    <span className="absolute -left-[29px] top-1 size-3 rounded-full bg-primary" />
                    <p className="text-xs text-primary">{s.date}</p>
                    <p className="text-sm font-medium">{s.title}</p>
                    <p className="text-xs text-muted-foreground">{s.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {(firstDate || (events && events.length)) && (
          <section data-reveal id="event" className={`border-t px-6 py-10 ${theme.divider}`}>
            <h2 className="text-center font-serif text-lg">Waktu &amp; Tempat</h2>
            {events?.length ? (
              <div className="mt-6 space-y-4">
                {events.map((ev, i) => (
                  <div key={i} className="rounded-2xl border border-border bg-card p-4 text-center">
                    <p className="text-xs tracking-[0.15em] text-muted-foreground">{ev.title || `Sesi ${i + 1}`}</p>
                    <p className="mt-1 font-serif">{ev.date ? new Date(`${ev.date}T12:00:00`).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : ev.date}</p>
                    <p className="text-xs text-muted-foreground">{ev.time ? `${ev.time} WIB` : ""}</p>
                    {ev.venue && <p className="mt-2 text-sm font-medium">{ev.venue}</p>}
                    {ev.address && <p className="text-xs text-muted-foreground">{ev.address}</p>}
                    {"mapsUrl" in ev && (ev as { mapsUrl?: string }).mapsUrl ? (
                      <a href={(ev as { mapsUrl?: string }).mapsUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex rounded-full bg-primary px-4 py-1.5 text-xs text-primary-foreground">Buka Maps →</a>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}
            {data.liveStreamUrl && (
              <a href={data.liveStreamUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex w-full justify-center rounded-full bg-foreground px-4 py-2 text-sm text-background">🎥 Live Streaming</a>
            )}
          </section>
        )}

        {initialGallery.length > 0 && (
          <section data-reveal id="gallery" className={`border-t px-6 py-10 ${theme.divider}`}>
            <h2 className="font-serif text-xl">Galeri</h2>
            <p className="text-xs text-muted-foreground">Foto &amp; video momen bahagia</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {initialGallery.map((it) => (
                it.type === "video" ? (
                  <video key={it.id} src={it.url} controls playsInline className="aspect-square w-full rounded-xl object-cover" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={it.id} src={it.url} alt={it.caption ?? ""} className="aspect-square cursor-zoom-in rounded-xl object-cover" onClick={() => setLightbox(it.url)} />
                )
              ))}
            </div>
            {lightbox && (
              <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4" onClick={() => setLightbox(null)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={lightbox} alt="" className="max-h-[85vh] max-w-full rounded-xl object-contain" />
              </div>
            )}
          </section>
        )}

        <section data-reveal id="wish" className={`border-t px-6 py-10 ${theme.divider}`}>
          <h2 className="font-serif text-xl">Ucapan &amp; RSVP</h2>
          <p className="text-xs text-muted-foreground">Konfirmasi kehadiran &amp; beri doa restu</p>
          <form onSubmit={sendWish} className="mt-4 space-y-3 rounded-2xl border border-border bg-card p-4">
            <div>
              <Label>Nama</Label>
              <Input value={wishName} onChange={(e) => setWishName(e.target.value)} placeholder="Nama kamu" required />
            </div>
            <div>
              <Label>Kehadiran</Label>
              <div className="mt-1 flex gap-2 text-sm">
                {(["hadir", "tidak", "ragu"] as const).map((v) => (
                  <label key={v} className={`flex-1 cursor-pointer rounded-xl border px-3 py-2 text-center text-xs uppercase ${rsvp === v ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>
                    <input type="radio" className="hidden" checked={rsvp === v} onChange={() => setRsvp(v)} />
                    {v === "hadir" ? "Hadir" : v === "tidak" ? "Tidak" : "Ragu"}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <Label>Ucapan / Doa</Label>
              <Textarea rows={3} value={wishMsg} onChange={(e) => setWishMsg(e.target.value)} placeholder="Selamat menempuh hidup baru..." required />
            </div>
            <Button type="submit" disabled={sending} className="w-full">
              {sending ? "Mengirim…" : "Kirim ucapan"}
            </Button>
          </form>
          <div className="mt-6 space-y-3">
            {wishes.map((w) => (
              <div key={w.id} className="rounded-2xl border border-border bg-card p-3">
                <p className="text-sm font-medium">{w.guest_name} <span className={`ml-2 rounded-full px-2 py-0.5 text-[10px] ${w.rsvp_status === "hadir" ? "bg-green-100 text-green-700" : w.rsvp_status === "tidak" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>{w.rsvp_status}</span></p>
                <p className="mt-1 text-sm text-muted-foreground whitespace-pre-wrap">{w.message}</p>
                <p className="mt-1 text-[10px] text-muted-foreground">{new Date(w.created_at).toLocaleString("id-ID")}</p>
              </div>
            ))}
            {!wishes.length && <p className="text-sm text-muted-foreground">Jadilah yang pertama mengucap.</p>}
          </div>
        </section>

        <section data-reveal id="gift" className={`border-t px-6 py-10 ${theme.divider}`}>
          <h2 className="font-serif text-xl">Amplop Digital</h2>
          <p className="mt-1 text-sm text-muted-foreground">{data.giftMessage ?? data.giftNote ?? "Doa restu Anda sangat berarti. Jika berkenan berbagi kasih, silakan pakai amplop digital di bawah ini."}</p>
          {data.banks?.length ? (
            <div className="mt-4 space-y-3">
              {data.banks.map((b, i) => (
                <div key={i} className="rounded-2xl border border-border bg-card p-4">
                  <p className="text-xs tracking-wide text-muted-foreground">{b.bank}</p>
                  <p className="font-mono text-sm font-medium">{b.number}</p>
                  <p className="text-xs text-muted-foreground">a.n. {b.name}</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {b.qrUrl && <img src={b.qrUrl} alt={`QR ${b.bank}`} className="mt-3 h-32 w-32 rounded-xl border object-contain" />}
                  <Button size="sm" variant="outline" className="mt-2" onClick={() => copy(b.number, `bank-${i}`)}>{copied === `bank-${i}` ? "Tersalin ✓" : "Salin nomor"}</Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">Rekening akan diisi di dashboard.</p>
          )}
          {data.giftAddress?.address && (
            <div className="mt-4 rounded-2xl border border-dashed p-4">
              <p className="text-xs font-medium">Kirim hadiah fisik</p>
              <p className="text-sm">{data.giftAddress.name}</p>
              <p className="text-xs text-muted-foreground whitespace-pre-wrap">{data.giftAddress.address}</p>
              {data.giftAddress.phone && <p className="text-xs text-muted-foreground">{data.giftAddress.phone}</p>}
            </div>
          )}
        </section>

        <section data-reveal id="closing" className={`border-t px-6 py-12 text-center ${theme.divider}`}>
          {data.closingPhoto && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.closingPhoto} alt="closing" className="mx-auto mb-4 size-20 rounded-full object-cover border-4 border-border" />
          )}
          <h3 className={`text-xl ${theme.fontTitle}`}>{closingTitle}</h3>
          <p className="mx-auto mt-3 max-w-[32ch] text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">{closingMessage}</p>
          <p className={`mt-6 text-lg ${theme.fontTitle}`}>{together}</p>
          <p className="mt-1 text-xs text-muted-foreground">{invitation.title ?? ""}</p>
        </section>

        {data.healthProtocols && (
          <section className="border-t border-border px-6 py-8 text-center">
            <h3 className="font-serif">Health Protocols</h3>
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-muted-foreground">
              {["Pakai Masker", "Tidak Berjabat Tangan", "Jaga Jarak", "Handsantizer"].map((h) => (
                <div key={h} className="rounded-xl border border-border bg-muted/30 py-3">{h}</div>
              ))}
            </div>
          </section>
        )}
        <div className="border-t border-border px-6 py-6 text-center text-xs text-muted-foreground">
          <p>mstory.id — Undangan Digital</p>
          <p className="mt-1 opacity-60">/{invitation.slug} · share via WA ?to=NamaTamu</p>
        </div>
      </div>

      <nav className="mx-auto flex max-w-md gap-1 border-x border-t border-border bg-card px-2 py-2 text-xs sticky bottom-0">
        {[
          { id: "couple", label: "Couple" },
          { id: "event", label: "Event" },
          { id: "gallery", label: "Gallery" },
          { id: "wish", label: "Ucapan" },
          { id: "gift", label: "Amplop" },
          { id: "closing", label: "Thanks" },
        ].map((n) => (
          <a key={n.id} href={`#${n.id}`} className="flex-1 rounded-full px-2 py-2 text-center hover:bg-muted">{n.label}</a>
        ))}
      </nav>
    </main>
  );
}
