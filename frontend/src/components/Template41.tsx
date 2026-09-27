import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { DEFAULT_DATA, type InvData, mergeData } from "../lib/invitation";

const SLIDES = [
  "/demo41/cover.jpg",
  "/demo41/g2.jpg",
  "/demo41/g3.jpg",
  "/demo41/g4.jpg",
  "/demo41/g8.jpg",
  "/demo41/g10.jpg",
  "/demo41/g11.jpg",
  "/demo41/g12.jpg",
];
const BRIDE = "/demo41/bride.jpg";
const GROOM = "/demo41/groom.jpg";

function useReveal<T extends HTMLElement>(once = true) {
  const ref = useRef<T | null>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          if (once) io.unobserve(e.target);
        } else if (!once) setOn(false);
      },
      { threshold: 0.12, rootMargin: "0px 0px -32px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);
  return { ref, on };
}
function useCountdown(ts: number) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const d = Math.max(0, ts - Date.now());
      setT({
        d: Math.floor(d / 864e5),
        h: Math.floor((d / 36e5) % 24),
        m: Math.floor((d / 6e4) % 60),
        s: Math.floor((d / 1e3) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [ts]);
  return t;
}
function pad(n: number) {
  return String(n).padStart(2, "0");
}
function copy(text: string) {
  navigator.clipboard?.writeText(text).catch(() => {});
}
function Fade({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, on } = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={`iv-fade ${on ? "on" : ""}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </div>
  );
}

export default function Template41({
  raw,
  targetMs = new Date("2025-12-12T08:00:00+07:00").getTime(),
  wishes,
  onWish,
}: {
  raw?: unknown;
  targetMs?: number;
  wishes?: { n: string; m: string }[];
  onWish?: (name: string, msg: string) => void;
}) {
  const [sp] = useSearchParams();
  const guest = sp.get("to") || "Tamu Undangan";
  const d: InvData = mergeData(raw);
  const [opened, setOpened] = useState(false);
  const [slide, setSlide] = useState(0);
  const [lb, setLb] = useState<number | null>(null);
  const [giftOpen, setGiftOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [rsvp, setRsvp] = useState<"hadir" | "tidak" | "">("");
  const [qty, setQty] = useState(1);
  const [form, setForm] = useState({ name: guest === "Tamu Undangan" ? "" : guest, msg: "" });
  const [tab, setTab] = useState<"home" | "couple" | "event" | "galeri" | "wish">("home");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lbRef = useRef<HTMLDivElement | null>(null);
  const touchX = useRef<number | null>(null);
  const cd = useCountdown(targetMs);
  const gallery = d.gallery ?? DEFAULT_DATA.gallery!;
  const events = d.events ?? DEFAULT_DATA.events!;

  useEffect(() => {
    if (!opened) return;
    const id = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 4200);
    return () => clearInterval(id);
  }, [opened]);
  useEffect(() => {
    document.body.style.overflow = opened ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [opened]);
  const playMusic = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = 0.5;
    a.play().catch(() => {});
  }, []);
  const openInvite = () => {
    setOpened(true);
    playMusic();
  };
  const go = (id: "home" | "couple" | "event" | "galeri" | "wish") => {
    setTab(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const submitWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.msg.trim()) return;
    if (onWish) onWish(form.name.trim(), form.msg.trim());
    setForm({ name: "", msg: "" });
  };
  const doCopy = (no: string) => {
    copy(no);
    setCopied(no);
    setTimeout(() => setCopied(null), 1600);
  };
  useEffect(() => {
    if (lb !== null) lbRef.current?.focus();
  }, [lb]);

  const names = `${d.couple?.groom ?? "Kay"} & ${d.couple?.bride ?? "Vony"}`;

  return (
    <div className="iv">
      <style>{CSS}</style>
      <audio ref={audioRef} src={d.music ?? DEFAULT_DATA.music} loop preload="none" />

      <div className={`iv-cover ${opened ? "is-out" : ""}`} aria-hidden={opened}>
        <img src={d.cover ?? DEFAULT_DATA.cover} alt="" className="iv-cover-bg" />
        <div className="iv-cover-veil" />
        <div className="iv-cover-body">
          <p className="iv-kicker">The Wedding Of</p>
          <h1 className="iv-names">{names}</h1>
          <p className="iv-date">{d.heroDate}</p>
          <div className="iv-line" />
          <p className="iv-dear">Kepada Yth. Bpk/Ibu/Saudara/i</p>
          <p className="iv-guest">{guest}</p>
          <p className="iv-apologize">Mohon maaf apabila salah dalam penulisan nama atau gelar</p>
          <p className="iv-invite-txt">Tanpa mengurangi rasa hormat, kami mengundang Anda untuk hadir di acara pernikahan kami.</p>
          <button className="iv-btn" onClick={openInvite}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 8l8 5 8-5M4 8v10h16V8M4 8l8-4 8 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Buka Undangan
          </button>
        </div>
      </div>

      <main className={`iv-page ${opened ? "is-on" : ""}`}>
        <section id="home" className="iv-hero">
          {SLIDES.map((src, i) => (
            <img key={src} src={src} alt="" className={`iv-hero-img ${i === slide ? "is-on" : ""}`} decoding="async" />
          ))}
          <div className="iv-hero-veil" />
          <div className="iv-hero-copy">
            <p className="iv-kicker light iv-hero-a" style={{ animationDelay: ".6s" }}>
              Wedding Invitation
            </p>
            <h2 className="iv-names light iv-hero-a" style={{ animationDelay: ".82s" }}>
              {names}
            </h2>
            <p className="iv-sub light iv-hero-a" style={{ animationDelay: "1.05s" }}>
              Let&apos;s Join Our Wedding Day
            </p>
            <p className="iv-date light iv-hero-a" style={{ animationDelay: "1.28s" }}>
              {d.heroDate}
            </p>
            <p className="iv-loc light iv-hero-a" style={{ animationDelay: "1.5s" }}>
              {d.heroLoc}
            </p>
          </div>
          <svg className="iv-wave" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden>
            <path fill="#f4f1ea" d="M0,48 C240,80 480,8 720,32 C960,56 1200,8 1440,40 L1440,80 L0,80 Z" />
          </svg>
        </section>

        <section className="iv-sec iv-ayat">
          <Fade>
            <p className="iv-quote">&ldquo;{d.ayat}&rdquo;</p>
          </Fade>
          <Fade delay={140}>
            <p className="iv-cite">{d.ayatCite}</p>
          </Fade>
        </section>

        <section className="iv-sec">
          <Fade>
            <p className="iv-kicker navy">{d.countdownText}</p>
          </Fade>
          <Fade delay={90}>
            <div className="iv-cd">
              {[
                [cd.d, "Hari"],
                [cd.h, "Jam"],
                [cd.m, "Menit"],
                [cd.s, "Detik"],
              ].map(([v, l]) => (
                <div key={String(l)} className="iv-cd-box">
                  <b>{pad(v as number)}</b>
                  <span>{l}</span>
                </div>
              ))}
            </div>
          </Fade>
          <Fade delay={170}>
            <p className="iv-date navy" style={{ marginTop: 18 }}>
              {d.heroDate}
            </p>
          </Fade>
        </section>

        <section id="couple" className="iv-sec">
          <Fade>
            <p className="iv-kicker navy">The Bride &amp; Groom</p>
          </Fade>
          <Fade delay={90}>
            <article className="iv-person">
              <img src={BRIDE} alt={d.couple?.bride ?? "Bride"} />
              <h3>{d.couple?.bride ?? "Vony"}</h3>
              <div className="iv-mini-line" />
              <p>
                Putri dari
                <br />
                {d.couple?.brideParents ?? "Bapak Putra & Ibu Putri"}
              </p>
            </article>
          </Fade>
          <Fade delay={80}>
            <p className="iv-amp">&amp;</p>
          </Fade>
          <Fade delay={140}>
            <article className="iv-person">
              <img src={GROOM} alt={d.couple?.groom ?? "Groom"} />
              <h3>{d.couple?.groom ?? "Kay"}</h3>
              <div className="iv-mini-line" />
              <p>
                Putra dari
                <br />
                {d.couple?.groomParents ?? "Bapak Putra & Ibu Putri"}
              </p>
            </article>
          </Fade>
        </section>

        <section id="event" className="iv-sec">
          <Fade>
            <p className="iv-kicker navy">Let&apos;s Celebrate Our Love</p>
          </Fade>
          <Fade delay={90}>
            <p className="iv-lead">Bergabunglah bersama kami menyaksikan sekaligus merayakan terbentuknya ikatan suci ini.</p>
          </Fade>
          {events.map((e, i) => (
            <Fade key={e.title} delay={170 + i * 90}>
              <article className="iv-card">
                <h3>{e.title}</h3>
                <p className="iv-card-date">{e.date}</p>
                <p>{e.time}</p>
                <p className="iv-card-place">{e.place}</p>
                <p className="iv-muted">{e.loc}</p>
                <a className="iv-btn ghost" href={e.maps} target="_blank" rel="noreferrer">
                  Kunjungi Lokasi
                </a>
              </article>
            </Fade>
          ))}
        </section>

        <section id="galeri" className="iv-sec">
          <Fade>
            <p className="iv-kicker navy">Our Moment</p>
          </Fade>
          <Fade delay={90}>
            <h2 className="iv-h2">Wedding Gallery</h2>
          </Fade>
          <div className="iv-grid">
            {gallery.map((src, i) => (
              <Fade key={`${src}-${i}`} delay={Math.min(i * 55, 360)}>
                <button className="iv-thumb" onClick={() => setLb(i)} aria-label={`Foto ${i + 1}`}>
                  <img src={src} alt="" loading="lazy" decoding="async" />
                </button>
              </Fade>
            ))}
          </div>
        </section>

        <section className="iv-sec">
          <Fade>
            <p className="iv-kicker navy">Love Story</p>
          </Fade>
          <Fade delay={90}>
            <p className="iv-quote tight">{d.loveStory}</p>
          </Fade>
        </section>

        <section className="iv-sec">
          <Fade>
            <p className="iv-kicker navy">Konfirmasi</p>
          </Fade>
          <Fade delay={90}>
            <form className="iv-form" onSubmit={(e) => e.preventDefault()}>
              <label>
                Nama Lengkap
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nama Anda" />
              </label>
              <p className="iv-lbl">Konfirmasi Kehadiran</p>
              <div className="iv-pills">
                <button type="button" className={rsvp === "hadir" ? "on" : ""} onClick={() => setRsvp("hadir")}>
                  Ya, Saya Akan Hadir
                </button>
                <button type="button" className={rsvp === "tidak" ? "on" : ""} onClick={() => setRsvp("tidak")}>
                  Saya Tidak Akan Hadir
                </button>
              </div>
              {rsvp === "hadir" && (
                <label>
                  Jumlah
                  <select value={qty} onChange={(e) => setQty(Number(e.target.value))}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n} Orang
                      </option>
                    ))}
                  </select>
                </label>
              )}
            </form>
          </Fade>
        </section>

        <section id="wish" className="iv-sec">
          <Fade>
            <p className="iv-kicker navy">Wishes</p>
          </Fade>
          <Fade delay={90}>
            <form className="iv-form" onSubmit={submitWish}>
              <label>
                Nama
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nama Anda" />
              </label>
              <label>
                Pesan
                <textarea rows={3} value={form.msg} onChange={(e) => setForm({ ...form, msg: e.target.value })} placeholder="Tulis doa & ucapan…" />
              </label>
              <button className="iv-btn full" type="submit">
                Kirimkan Ucapan
              </button>
            </form>
          </Fade>
          {wishes && (
            <div className="iv-wishes">
              {wishes.map((w, i) => (
                <Fade key={`${w.n}-${i}`} delay={Math.min(i * 60, 300)}>
                  <article className="iv-wish">
                    <span className="iv-ava">{w.n.slice(0, 1).toUpperCase()}</span>
                    <div>
                      <b>{w.n}</b>
                      <p>{w.m}</p>
                    </div>
                  </article>
                </Fade>
              ))}
            </div>
          )}
        </section>

        <section className="iv-sec">
          <Fade>
            <p className="iv-kicker navy">Hadiah</p>
          </Fade>
          <Fade delay={90}>
            <p className="iv-lead">Kehadiran Anda adalah doa bagi kami. Jika berkenan memberi kado secara cashless, kami akan senang hati menerimanya.</p>
          </Fade>
          <Fade delay={150}>
            <button className="iv-btn" onClick={() => setGiftOpen((v) => !v)}>
              {giftOpen ? "Sembunyikan Rekening" : "Lihat Rekening"}
            </button>
          </Fade>
          {giftOpen && (
            <div className="iv-banks">
              {(d.gift ?? []).map((a) => (
                <div key={a.no} className="iv-bank">
                  <b>{a.bank}</b>
                  <p>
                    a.n {a.name}
                    <br />
                    {a.no}
                  </p>
                  <button className="iv-btn ghost sm" onClick={() => doCopy(a.no)}>
                    {copied === a.no ? "Tersalin" : "Salin Rekening"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="iv-sec iv-end">
          <Fade>
            <p className="iv-kicker navy">Terima Kasih</p>
          </Fade>
          <Fade delay={90}>
            <p className="iv-lead">Atas kehadiran &amp; doa restunya</p>
          </Fade>
          <Fade delay={150}>
            <p className="iv-quote tight">{d.closing}</p>
          </Fade>
          <Fade delay={230}>
            <p className="iv-cite">Sampai jumpa di hari bahagia kami,</p>
          </Fade>
          <Fade delay={310}>
            <h2 className="iv-names navy" style={{ fontSize: 42, marginTop: 8 }}>
              {names}
            </h2>
          </Fade>
        </section>

        <Fade>
          <footer className="iv-foot">
            <p>
              Dibuat dengan ♥ oleh <a href="/">mstory.id</a>
            </p>
          </footer>
        </Fade>
      </main>

      {opened && (
        <nav className="iv-nav iv-nav-in">
          {(
            [
              ["home", "Home", "M12 3L3 9.2V20a1 1 0 001 1h4v-6h8v6h4a1 1 0 001-1V9.2z"],
              ["couple", "Couple", "M12 12a3 3 0 100-6 3 3 0 000 6zM5 20a7 7 0 0114 0"],
              ["event", "Event", "M7 3v3M17 3v3M4 8h16M8 13h4M9 16h6M5 5h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z"],
              ["galeri", "Gallery", "M4 16l4-5 4 3 3-4 3 6M4 5a1 1 0 011-1h14a1 1 0 011 1v12a1 1 0 01-1 1H5a1 1 0 01-1-1z"],
              ["wish", "Wishes", "M21 12c0 3.5-3.6 6.5-9 6.5-.9 0-1.8-.1-2.6-.3L6 21l1.2-3A7.2 7.2 0 013 12a7.8 7.8 0 018-7.5A7.9 7.9 0 0121 12z"],
            ] as const
          ).map(([id, l, d2]) => (
            <button key={id} className={tab === id ? "on" : ""} onClick={() => go(id)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d={d2} />
                {id === "wish" && <path d="M8 11h8M8 15h5" />}
              </svg>
              <span>{l}</span>
            </button>
          ))}
        </nav>
      )}

      {lb !== null && (
        <div
          ref={lbRef}
          className="iv-lb"
          onClick={() => setLb(null)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setLb(null);
            if (e.key === "ArrowRight") setLb((i) => ((i ?? 0) + 1) % gallery.length);
            if (e.key === "ArrowLeft") setLb((i) => ((i ?? 0) - 1 + gallery.length) % gallery.length);
          }}
          onTouchStart={(e) => {
            touchX.current = e.changedTouches[0].clientX;
          }}
          onTouchEnd={(e) => {
            const x = touchX.current;
            if (x == null) return;
            const dx = e.changedTouches[0].clientX - x;
            if (dx < -40) setLb((i) => ((i ?? 0) + 1) % gallery.length);
            if (dx > 40) setLb((i) => ((i ?? 0) - 1 + gallery.length) % gallery.length);
            touchX.current = null;
          }}
          tabIndex={0}
          role="dialog"
        >
          <img src={gallery[lb]} alt="" onClick={(e) => e.stopPropagation()} />
          <button className="iv-lb-x" onClick={() => setLb(null)} aria-label="Tutup">
            ×
          </button>
          <button
            className="iv-lb-n prev"
            onClick={(e) => {
              e.stopPropagation();
              setLb((i) => ((i ?? 0) - 1 + gallery.length) % gallery.length);
            }}
            aria-label="Sebelumnya"
          >
            ‹
          </button>
          <button
            className="iv-lb-n next"
            onClick={(e) => {
              e.stopPropagation();
              setLb((i) => ((i ?? 0) + 1) % gallery.length);
            }}
            aria-label="Berikutnya"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Great+Vibes&family=Outfit:wght@300;400;500&display=swap');
.iv{--navy:#1c3147;--teal:#4e6d7a;--gold:#c4a574;--batik:#7a4a28;--ivory:#f4f1ea;--ink:#2a241c;--paper:#faf7f1;
  max-width:480px;margin:0 auto;min-height:100svh;background:var(--ivory);color:var(--ink);
  font-family:'Outfit',system-ui,sans-serif;position:relative;overflow-x:hidden}
.iv *{box-sizing:border-box}
.iv img{max-width:100%;display:block}
.iv button,.iv a,.iv input,.iv textarea,.iv select{font-family:inherit}
.iv-cover{position:fixed;inset:0;z-index:80;display:grid;place-items:center;
  transition:opacity .7s ease,transform .9s cubic-bezier(.22,1,.36,1);max-width:480px;margin:0 auto}
.iv-cover.is-out{opacity:0;transform:translateY(-8%);pointer-events:none}
.iv-cover-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 35%;
  animation:ivKen 18s ease-in-out infinite alternate}
.iv-cover-veil{position:absolute;inset:0;background:
  radial-gradient(120% 75% at 50% 48%, rgba(8,14,26,.78) 0%, rgba(8,14,26,.55) 45%, rgba(8,14,26,.22) 75%, rgba(8,14,26,.06) 100%)}
.iv-cover-body{position:relative;z-index:2;width:100%;max-width:380px;margin:0 auto;text-align:center;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding:24px 28px;min-height:0}
.iv-kicker{font-size:11px;letter-spacing:.42em;text-transform:uppercase;margin:0 0 8px;color:#e8c88a;text-shadow:0 1px 10px rgba(0,0,0,.5)}
.iv-kicker.light{color:rgba(247,241,230,.85)}
.iv-kicker.navy{color:var(--teal);text-shadow:none}
.iv-names{font-family:'Great Vibes',cursive;font-weight:400;font-size:52px;line-height:1.05;margin:0 0 10px;color:#fffef9;text-shadow:0 2px 18px rgba(0,0,0,.65),0 0 1px rgba(0,0,0,.6)}
.iv-names.light{color:#fff;text-shadow:0 6px 24px rgba(0,0,0,.45)}
.iv-names.navy{color:var(--navy);text-shadow:none}
.iv-date{font-family:'Cormorant Garamond',serif;font-size:16px;letter-spacing:.08em;margin:0;color:#fff6e8;text-shadow:0 1px 10px rgba(0,0,0,.55)}
.iv-date.light,.iv-sub.light,.iv-loc.light{color:rgba(247,241,230,.92)}
.iv-date.navy{color:var(--navy);text-shadow:none}
.iv-line{width:48px;height:1px;background:linear-gradient(90deg,transparent,#e8c88a,transparent);margin:16px auto;box-shadow:0 0 8px rgba(232,200,138,.4)}
.iv-dear{font-family:'Cormorant Garamond',serif;font-size:15px;letter-spacing:.06em;text-transform:none;margin:18px 0 4px;color:#f0e6d3;text-shadow:0 1px 8px rgba(0,0,0,.6);font-style:italic}
.iv-guest{font-family:'Cormorant Garamond',serif;font-size:34px;font-weight:700;line-height:1.15;margin:0 0 6px;color:#fff;text-shadow:0 2px 12px rgba(0,0,0,.6)}
.iv-apologize{font-size:9px;letter-spacing:.05em;color:#f0e6d3;text-shadow:0 1px 8px rgba(0,0,0,.55);margin:0 0 12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.iv-invite-txt{font-size:13px;line-height:1.7;max-width:280px;margin:0 auto 22px;color:#f0e6d3;text-shadow:0 1px 8px rgba(0,0,0,.55)}
.iv-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border:0;cursor:pointer;
  background:linear-gradient(145deg,#c4a574,#a8834a);color:#fffaf0;padding:13px 22px;border-radius:999px;
  font-size:13px;letter-spacing:.12em;text-transform:uppercase;box-shadow:0 10px 24px rgba(168,131,74,.35);
  text-decoration:none;transition:transform .2s ease,filter .2s}
.iv-btn:active{transform:scale(.96)}
.iv-btn.ghost{background:transparent;color:var(--navy);border:1px solid rgba(28,49,71,.25);box-shadow:none;margin-top:12px}
.iv-btn.full{width:100%}
.iv-btn.sm{padding:8px 14px;font-size:11px;margin-top:8px}
.iv-page{opacity:0;pointer-events:none;padding-bottom:88px}
.iv-page.is-on{opacity:1;pointer-events:auto}
.iv-cover-body .iv-kicker,.iv-cover-body .iv-names,.iv-cover-body .iv-date,.iv-cover-body .iv-dear,.iv-cover-body .iv-guest,.iv-cover-body .iv-invite-txt{position:relative}
.iv-hero{position:relative;height:100svh;min-height:560px;overflow:hidden;display:grid;place-items:center}
.iv-hero-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 22%;
  opacity:0;transform:scale(1.08);transition:opacity 1.6s ease,transform 6s ease}
.iv-hero-img.is-on{opacity:1;transform:scale(1.18)}
.iv-hero-veil{position:absolute;inset:0;background:
  radial-gradient(120% 75% at 50% 50%, rgba(8,14,26,.58) 0%, rgba(8,14,26,.38) 42%, rgba(8,14,26,.12) 72%, transparent 100%)}
.iv-hero-copy{position:relative;z-index:2;text-align:center;padding:0 24px 5vh;
  display:flex;flex-direction:column;align-items:center;gap:0;transform:translateY(-3.5vh)}
.iv-hero-copy .iv-kicker{order:1}
.iv-hero-copy .iv-names{order:2}
.iv-hero-copy .iv-sub{order:3}
.iv-hero-copy .iv-date{order:4}
.iv-hero-copy .iv-loc{order:5}
.iv-sub{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:15px;margin:4px 0 10px}
.iv-loc{font-size:13px;letter-spacing:.16em;text-transform:uppercase;margin:6px 0 0}
.iv-wave{position:absolute;left:0;right:0;bottom:-1px;width:100%;height:56px;display:block}
.iv-sec{padding:36px 22px 8px;text-align:center}
.iv-ayat{padding-top:28px}
.iv-quote{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:16.5px;line-height:1.85;color:#3d4a55;margin:0 auto;max-width:380px}
.iv-quote.tight{font-size:15.5px}
.iv-cite{font-size:12px;letter-spacing:.14em;color:var(--teal);margin:14px 0 0}
.iv-lead{font-size:13.5px;line-height:1.75;color:#5a6570;max-width:340px;margin:8px auto 18px}
.iv-h2{font-family:'Cormorant Garamond',serif;font-size:28px;color:var(--navy);margin:4px 0 18px;font-weight:500}
.iv-amp{font-family:'Great Vibes',cursive;font-size:36px;color:var(--gold);margin:6px 0}
.iv-cd{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:16px}
.iv-cd-box{background:#fff;border:1px solid rgba(196,165,116,.35);border-radius:14px;padding:14px 4px;box-shadow:0 8px 20px rgba(28,49,71,.06)}
.iv-cd-box b{display:block;font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:600;color:var(--navy);line-height:1}
.iv-cd-box span{display:block;font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--teal);margin-top:6px}
.iv-person{background:#fff;border:1px solid rgba(196,165,116,.28);border-radius:20px;padding:18px 16px 22px;box-shadow:0 12px 32px rgba(28,49,71,.07);margin-top:16px}
.iv-person img{width:78%;max-width:220px;aspect-ratio:1;object-fit:cover;border-radius:50%;margin:0 auto 14px;border:3px solid rgba(196,165,116,.45);box-shadow:0 8px 24px rgba(28,49,71,.12)}
.iv-person h3{font-family:'Great Vibes',cursive;font-size:36px;color:var(--navy);margin:0 0 6px;font-weight:400}
.iv-person p{font-size:13px;line-height:1.7;color:#5a6570;margin:0}
.iv-mini-line{width:36px;height:1px;background:var(--gold);margin:8px auto 10px}
.iv-card{background:#fff;border:1px solid rgba(196,165,116,.28);border-radius:18px;padding:22px 18px;box-shadow:0 10px 28px rgba(28,49,71,.07);margin:14px 0}
.iv-card h3{font-family:'Cormorant Garamond',serif;font-size:24px;color:var(--navy);margin:0 0 6px;font-weight:600}
.iv-card-date{font-size:13px;color:var(--teal);margin:0 0 4px}
.iv-card-place{font-weight:500;margin:8px 0 2px;color:var(--navy)}
.iv-muted{font-size:12px;color:#7a8690;margin:0}
.iv-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:8px}
.iv-thumb{padding:0;border:0;background:none;cursor:pointer;overflow:hidden;border-radius:8px;aspect-ratio:1}
.iv-thumb img{width:100%;height:100%;object-fit:cover;transition:transform .5s ease}
.iv-thumb:active img{transform:scale(1.06)}
.iv-form{text-align:left;background:#fff;border:1px solid rgba(196,165,116,.28);border-radius:18px;padding:18px;box-shadow:0 10px 24px rgba(28,49,71,.06);margin-top:12px}
.iv-form label{display:block;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--teal);margin-bottom:12px}
.iv-form input,.iv-form textarea,.iv-form select{width:100%;margin-top:6px;padding:11px 12px;border-radius:10px;border:1px solid rgba(28,49,71,.15);background:var(--paper);font-size:15px;color:var(--ink);outline:none}
.iv-form textarea{resize:vertical;min-height:72px}
.iv-lbl{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--teal);margin:4px 0 8px;text-align:left}
.iv-pills{display:grid;gap:8px;margin-bottom:12px}
.iv-pills button{padding:10px 12px;border-radius:999px;border:1px solid rgba(196,165,116,.4);background:transparent;color:var(--navy);font-size:13px;cursor:pointer}
.iv-pills button.on{background:linear-gradient(145deg,#1c3147,#4e6d7a);color:#f7f1e6;border-color:transparent}
.iv-wishes{display:grid;gap:10px;margin-top:16px;text-align:left}
.iv-wish{display:flex;gap:10px;background:#fff;border:1px solid rgba(196,165,116,.22);border-radius:14px;padding:12px 14px}
.iv-ava{width:32px;height:32px;border-radius:50%;flex-shrink:0;display:grid;place-items:center;background:linear-gradient(145deg,#c4a574,#7a4a28);color:#fff;font-size:13px;font-weight:500}
.iv-wish b{display:block;font-size:13.5px;color:var(--navy);margin-bottom:2px}
.iv-wish p{margin:0;font-size:13px;line-height:1.6;color:#5a6570}
.iv-banks{display:grid;gap:10px;margin-top:14px}
.iv-bank{background:#fff;border:1px solid rgba(196,165,116,.28);border-radius:14px;padding:16px}
.iv-bank b{display:block;font-size:13px;letter-spacing:.16em;color:var(--teal);margin-bottom:6px}
.iv-bank p{margin:0;font-size:15px;color:var(--navy);line-height:1.6}
.iv-end{padding-bottom:28px}
.iv-foot{text-align:center;padding:8px 16px 24px;font-size:12px;color:#8a929a}
.iv-foot a{color:var(--navy);text-decoration:none}
.iv-fade{opacity:0;transform:translateY(18px) scale(.94);will-change:transform,opacity;transition:opacity 1.6s cubic-bezier(.22,1,.36,1),transform 1.6s cubic-bezier(.22,1,.36,1)}
.iv-fade.on{opacity:1;transform:none}
.iv-stag{opacity:0;transform:translateY(18px) scale(.94);animation:ivStag 1.6s cubic-bezier(.22,1,.36,1) forwards}
@keyframes ivStag{to{opacity:1;transform:none}}
.iv-hero-a{opacity:0;transform:translateY(18px) scale(.94);animation:ivStagSlow 1.6s cubic-bezier(.22,1,.36,1) forwards;animation-play-state:paused}
.iv-page.is-on .iv-hero-a{animation-play-state:running}
@keyframes ivStagSlow{to{opacity:1;transform:none}}
.iv-nav-in{animation:ivSlideUp .6s cubic-bezier(.22,1,.36,1) both}
@keyframes ivSlideUp{from{transform:translateX(-50%) translateY(18px);opacity:0}to{transform:translateX(-50%) translateY(0);opacity:1}}
.iv-lb{position:fixed;inset:0;z-index:90;background:rgba(8,12,18,.92);display:flex;align-items:center;justify-content:center;padding:16px}
.iv-lb img{max-width:100%;max-height:88svh;object-fit:contain;border-radius:8px}
.iv-lb-x,.iv-lb-n{position:absolute;background:rgba(255,255,255,.12);color:#fff;border:0;cursor:pointer;border-radius:50%;width:40px;height:40px;font-size:22px;display:grid;place-items:center}
.iv-lb-x{top:16px;right:16px}
.iv-lb-n.prev{left:8px}
.iv-lb-n.next{right:8px}
@keyframes ivKen{from{transform:scale(1.05)}to{transform:scale(1.18)}}
@media (prefers-reduced-motion:reduce){.iv-cover-bg,.iv-hero-img{animation:none;transition:none}.iv-fade{opacity:1;transform:none}}
`;
