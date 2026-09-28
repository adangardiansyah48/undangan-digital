import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { DEFAULT_DATA, mergeData } from "../lib/invitation";
import { gdriveThumb } from "../lib/invitation";
const SLIDES = [
    gdriveThumb("1fTr-jc5mmiCQCTHsHA2uR2cVvBrDVoZG", 800),
    gdriveThumb("1jsz_qKW3OmMLmkOPoCqpzJiDRfin7hH4", 800),
    gdriveThumb("1R51_kWb6mVhPA3UHi-8d3uI1jHvxWcZo", 800),
    gdriveThumb("1FO8XvvfFL9AQD7rqY3VAwrac9OYycx9q", 800),
    gdriveThumb("1eDPVnIiF-OnDqT1h48jri21acxczPJKM", 800),
];
const BRIDE = gdriveThumb("1fTr-jc5mmiCQCTHsHA2uR2cVvBrDVoZG", 400);
const GROOM = gdriveThumb("1jsz_qKW3OmMLmkOPoCqpzJiDRfin7hH4", 400);
function useReveal(once = true) {
    const ref = useRef(null);
    const [on, setOn] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el)
            return;
        const io = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) {
                setOn(true);
                if (once)
                    io.unobserve(e.target);
            }
            else if (!once)
                setOn(false);
        }, { threshold: 0.12, rootMargin: "0px 0px -32px 0px" });
        io.observe(el);
        return () => io.disconnect();
    }, [once]);
    return { ref, on };
}
function useCountdown(ts) {
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
function pad(n) {
    return String(n).padStart(2, "0");
}
function copy(text) {
    navigator.clipboard?.writeText(text).catch(() => { });
}
function Fade({ children, delay = 0 }) {
    const { ref, on } = useReveal();
    return (_jsx("div", { ref: ref, className: `iv-fade ${on ? "on" : ""}`, style: delay ? { transitionDelay: `${delay}ms` } : undefined, children: children }));
}
export default function Template41({ raw, targetMs = new Date("2025-12-12T08:00:00+07:00").getTime(), wishes, onWish, }) {
    const [sp] = useSearchParams();
    const guest = sp.get("to") || "Tamu Undangan";
    const d = mergeData(raw);
    const [opened, setOpened] = useState(false);
    const [slide, setSlide] = useState(0);
    const [lb, setLb] = useState(null);
    const [giftOpen, setGiftOpen] = useState(false);
    const [copied, setCopied] = useState(null);
    const [rsvp, setRsvp] = useState("");
    const [qty, setQty] = useState(1);
    const [form, setForm] = useState({ name: guest === "Tamu Undangan" ? "" : guest, msg: "" });
    const [tab, setTab] = useState("home");
    const audioRef = useRef(null);
    const lbRef = useRef(null);
    const touchX = useRef(null);
    const cd = useCountdown(targetMs);
    const gallery = d.gallery ?? DEFAULT_DATA.gallery;
    const events = d.events ?? DEFAULT_DATA.events;
    useEffect(() => {
        if (!opened)
            return;
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
        if (!a)
            return;
        a.volume = 0.5;
        a.play().catch(() => { });
    }, []);
    const openInvite = () => {
        setOpened(true);
        playMusic();
    };
    const go = (id) => {
        setTab(id);
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    const submitWish = (e) => {
        e.preventDefault();
        if (!form.name.trim() || !form.msg.trim())
            return;
        if (onWish)
            onWish(form.name.trim(), form.msg.trim());
        setForm({ name: "", msg: "" });
    };
    const doCopy = (no) => {
        copy(no);
        setCopied(no);
        setTimeout(() => setCopied(null), 1600);
    };
    useEffect(() => {
        if (lb !== null)
            lbRef.current?.focus();
    }, [lb]);
    const names = `${d.couple?.groom ?? "Kay"} & ${d.couple?.bride ?? "Vony"}`;
    return (_jsxs("div", { className: "iv", children: [_jsx("style", { children: CSS }), _jsx("audio", { ref: audioRef, src: d.music ?? DEFAULT_DATA.music, loop: true, preload: "none" }), _jsxs("div", { className: `iv-cover ${opened ? "is-out" : ""}`, "aria-hidden": opened, children: [_jsx("img", { src: d.cover ?? DEFAULT_DATA.cover, alt: "", className: "iv-cover-bg" }), _jsx("div", { className: "iv-cover-veil" }), _jsxs("div", { className: "iv-cover-body", children: [_jsx("p", { className: "iv-kicker", children: "The Wedding Of" }), _jsx("h1", { className: "iv-names", children: names }), _jsx("p", { className: "iv-date", children: d.heroDate }), _jsx("div", { className: "iv-line" }), _jsx("p", { className: "iv-dear", children: "Kepada Yth. Bpk/Ibu/Saudara/i" }), _jsx("p", { className: "iv-guest", children: guest }), _jsx("p", { className: "iv-apologize", children: "Mohon maaf apabila salah dalam penulisan nama atau gelar" }), _jsx("p", { className: "iv-invite-txt", children: "Tanpa mengurangi rasa hormat, kami mengundang Anda untuk hadir di acara pernikahan kami." }), _jsxs("button", { className: "iv-btn", onClick: openInvite, children: [_jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", children: _jsx("path", { d: "M4 8l8 5 8-5M4 8v10h16V8M4 8l8-4 8 4", strokeLinecap: "round", strokeLinejoin: "round" }) }), "Buka Undangan"] })] })] }), _jsxs("main", { className: `iv-page ${opened ? "is-on" : ""}`, children: [_jsxs("section", { id: "home", className: "iv-hero", children: [SLIDES.map((src, i) => (_jsx("img", { src: src, alt: "", className: `iv-hero-img ${i === slide ? "is-on" : ""}`, decoding: "async" }, src))), _jsx("div", { className: "iv-hero-veil" }), _jsxs("div", { className: "iv-hero-copy", children: [_jsx("p", { className: "iv-kicker light iv-hero-a", style: { animationDelay: ".6s" }, children: "Wedding Invitation" }), _jsx("h2", { className: "iv-names light iv-hero-a", style: { animationDelay: ".82s" }, children: names }), _jsx("p", { className: "iv-sub light iv-hero-a", style: { animationDelay: "1.05s" }, children: "Let's Join Our Wedding Day" }), _jsx("p", { className: "iv-date light iv-hero-a", style: { animationDelay: "1.28s" }, children: d.heroDate }), _jsx("p", { className: "iv-loc light iv-hero-a", style: { animationDelay: "1.5s" }, children: d.heroLoc })] }), _jsx("svg", { className: "iv-wave", viewBox: "0 0 1440 80", preserveAspectRatio: "none", "aria-hidden": true, children: _jsx("path", { fill: "#f4f1ea", d: "M0,48 C240,80 480,8 720,32 C960,56 1200,8 1440,40 L1440,80 L0,80 Z" }) })] }), _jsxs("section", { className: "iv-sec iv-ayat", children: [_jsx(Fade, { children: _jsxs("p", { className: "iv-quote", children: ["\u201C", d.ayat, "\u201D"] }) }), _jsx(Fade, { delay: 140, children: _jsx("p", { className: "iv-cite", children: d.ayatCite }) })] }), _jsxs("section", { className: "iv-sec", children: [_jsx(Fade, { children: _jsx("p", { className: "iv-kicker navy", children: d.countdownText }) }), _jsx(Fade, { delay: 90, children: _jsx("div", { className: "iv-cd", children: [
                                        [cd.d, "Hari"],
                                        [cd.h, "Jam"],
                                        [cd.m, "Menit"],
                                        [cd.s, "Detik"],
                                    ].map(([v, l]) => (_jsxs("div", { className: "iv-cd-box", children: [_jsx("b", { children: pad(v) }), _jsx("span", { children: l })] }, String(l)))) }) }), _jsx(Fade, { delay: 170, children: _jsx("p", { className: "iv-date navy", style: { marginTop: 18 }, children: d.heroDate }) })] }), _jsxs("section", { id: "couple", className: "iv-sec", children: [_jsx(Fade, { children: _jsx("p", { className: "iv-kicker navy", children: "The Bride & Groom" }) }), _jsx(Fade, { delay: 90, children: _jsxs("article", { className: "iv-person", children: [_jsx("img", { src: BRIDE, alt: d.couple?.bride ?? "Bride" }), _jsx("h3", { children: d.couple?.bride ?? "Vony" }), _jsx("div", { className: "iv-mini-line" }), _jsxs("p", { children: ["Putri dari", _jsx("br", {}), d.couple?.brideParents ?? "Bapak Putra & Ibu Putri"] })] }) }), _jsx(Fade, { delay: 80, children: _jsx("p", { className: "iv-amp", children: "&" }) }), _jsx(Fade, { delay: 140, children: _jsxs("article", { className: "iv-person", children: [_jsx("img", { src: GROOM, alt: d.couple?.groom ?? "Groom" }), _jsx("h3", { children: d.couple?.groom ?? "Kay" }), _jsx("div", { className: "iv-mini-line" }), _jsxs("p", { children: ["Putra dari", _jsx("br", {}), d.couple?.groomParents ?? "Bapak Putra & Ibu Putri"] })] }) })] }), _jsxs("section", { id: "event", className: "iv-sec", children: [_jsx(Fade, { children: _jsx("p", { className: "iv-kicker navy", children: "Let's Celebrate Our Love" }) }), _jsx(Fade, { delay: 90, children: _jsx("p", { className: "iv-lead", children: "Bergabunglah bersama kami menyaksikan sekaligus merayakan terbentuknya ikatan suci ini." }) }), events.map((e, i) => (_jsx(Fade, { delay: 170 + i * 90, children: _jsxs("article", { className: "iv-card", children: [_jsx("h3", { children: e.title }), _jsx("p", { className: "iv-card-date", children: e.date }), _jsx("p", { children: e.time }), _jsx("p", { className: "iv-card-place", children: e.place }), _jsx("p", { className: "iv-muted", children: e.loc }), _jsx("a", { className: "iv-btn ghost", href: e.maps, target: "_blank", rel: "noreferrer", children: "Kunjungi Lokasi" })] }) }, e.title)))] }), _jsxs("section", { id: "galeri", className: "iv-sec", children: [_jsx(Fade, { children: _jsx("p", { className: "iv-kicker navy", children: "Our Moment" }) }), _jsx(Fade, { delay: 90, children: _jsx("h2", { className: "iv-h2", children: "Wedding Gallery" }) }), _jsx("div", { className: "iv-grid", children: gallery.map((src, i) => (_jsx(Fade, { delay: Math.min(i * 55, 360), children: _jsx("button", { className: "iv-thumb", onClick: () => setLb(i), "aria-label": `Foto ${i + 1}`, children: _jsx("img", { src: src, alt: "", loading: "lazy", decoding: "async" }) }) }, `${src}-${i}`))) })] }), _jsxs("section", { className: "iv-sec", children: [_jsx(Fade, { children: _jsx("p", { className: "iv-kicker navy", children: "Love Story" }) }), _jsx(Fade, { delay: 90, children: _jsx("p", { className: "iv-quote tight", children: d.loveStory }) })] }), _jsxs("section", { className: "iv-sec", children: [_jsx(Fade, { children: _jsx("p", { className: "iv-kicker navy", children: "Konfirmasi" }) }), _jsx(Fade, { delay: 90, children: _jsxs("form", { className: "iv-form", onSubmit: (e) => e.preventDefault(), children: [_jsxs("label", { children: ["Nama Lengkap", _jsx("input", { value: form.name, onChange: (e) => setForm({ ...form, name: e.target.value }), placeholder: "Nama Anda" })] }), _jsx("p", { className: "iv-lbl", children: "Konfirmasi Kehadiran" }), _jsxs("div", { className: "iv-pills", children: [_jsx("button", { type: "button", className: rsvp === "hadir" ? "on" : "", onClick: () => setRsvp("hadir"), children: "Ya, Saya Akan Hadir" }), _jsx("button", { type: "button", className: rsvp === "tidak" ? "on" : "", onClick: () => setRsvp("tidak"), children: "Saya Tidak Akan Hadir" })] }), rsvp === "hadir" && (_jsxs("label", { children: ["Jumlah", _jsx("select", { value: qty, onChange: (e) => setQty(Number(e.target.value)), children: [1, 2, 3, 4, 5].map((n) => (_jsxs("option", { value: n, children: [n, " Orang"] }, n))) })] }))] }) })] }), _jsxs("section", { id: "wish", className: "iv-sec", children: [_jsx(Fade, { children: _jsx("p", { className: "iv-kicker navy", children: "Wishes" }) }), _jsx(Fade, { delay: 90, children: _jsxs("form", { className: "iv-form", onSubmit: submitWish, children: [_jsxs("label", { children: ["Nama", _jsx("input", { value: form.name, onChange: (e) => setForm({ ...form, name: e.target.value }), placeholder: "Nama Anda" })] }), _jsxs("label", { children: ["Pesan", _jsx("textarea", { rows: 3, value: form.msg, onChange: (e) => setForm({ ...form, msg: e.target.value }), placeholder: "Tulis doa & ucapan\u2026" })] }), _jsx("button", { className: "iv-btn full", type: "submit", children: "Kirimkan Ucapan" })] }) }), wishes && (_jsx("div", { className: "iv-wishes", children: wishes.map((w, i) => (_jsx(Fade, { delay: Math.min(i * 60, 300), children: _jsxs("article", { className: "iv-wish", children: [_jsx("span", { className: "iv-ava", children: w.n.slice(0, 1).toUpperCase() }), _jsxs("div", { children: [_jsx("b", { children: w.n }), _jsx("p", { children: w.m })] })] }) }, `${w.n}-${i}`))) }))] }), _jsxs("section", { className: "iv-sec", children: [_jsx(Fade, { children: _jsx("p", { className: "iv-kicker navy", children: "Hadiah" }) }), _jsx(Fade, { delay: 90, children: _jsx("p", { className: "iv-lead", children: "Kehadiran Anda adalah doa bagi kami. Jika berkenan memberi kado secara cashless, kami akan senang hati menerimanya." }) }), _jsx(Fade, { delay: 150, children: _jsx("button", { className: "iv-btn", onClick: () => setGiftOpen((v) => !v), children: giftOpen ? "Sembunyikan Rekening" : "Lihat Rekening" }) }), giftOpen && (_jsx("div", { className: "iv-banks", children: (d.gift ?? []).map((a) => (_jsxs("div", { className: "iv-bank", children: [_jsx("b", { children: a.bank }), _jsxs("p", { children: ["a.n ", a.name, _jsx("br", {}), a.no] }), _jsx("button", { className: "iv-btn ghost sm", onClick: () => doCopy(a.no), children: copied === a.no ? "Tersalin" : "Salin Rekening" })] }, a.no))) }))] }), _jsxs("section", { className: "iv-sec iv-end", children: [_jsx(Fade, { children: _jsx("p", { className: "iv-kicker navy", children: "Terima Kasih" }) }), _jsx(Fade, { delay: 90, children: _jsx("p", { className: "iv-lead", children: "Atas kehadiran & doa restunya" }) }), _jsx(Fade, { delay: 150, children: _jsx("p", { className: "iv-quote tight", children: d.closing }) }), _jsx(Fade, { delay: 230, children: _jsx("p", { className: "iv-cite", children: "Sampai jumpa di hari bahagia kami," }) }), _jsx(Fade, { delay: 310, children: _jsx("h2", { className: "iv-names navy", style: { fontSize: 42, marginTop: 8 }, children: names }) })] }), _jsx(Fade, { children: _jsx("footer", { className: "iv-foot", children: _jsxs("p", { children: ["Dibuat dengan \u2665 oleh ", _jsx("a", { href: "/", children: "mstory.id" })] }) }) })] }), opened && (_jsx("nav", { className: "iv-nav iv-nav-in", children: [
                    ["home", "Home", "M12 3L3 9.2V20a1 1 0 001 1h4v-6h8v6h4a1 1 0 001-1V9.2z"],
                    ["couple", "Couple", "M12 12a3 3 0 100-6 3 3 0 000 6zM5 20a7 7 0 0114 0"],
                    ["event", "Event", "M7 3v3M17 3v3M4 8h16M8 13h4M9 16h6M5 5h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z"],
                    ["galeri", "Gallery", "M4 16l4-5 4 3 3-4 3 6M4 5a1 1 0 011-1h14a1 1 0 011 1v12a1 1 0 01-1 1H5a1 1 0 01-1-1z"],
                    ["wish", "Wishes", "M21 12c0 3.5-3.6 6.5-9 6.5-.9 0-1.8-.1-2.6-.3L6 21l1.2-3A7.2 7.2 0 013 12a7.8 7.8 0 018-7.5A7.9 7.9 0 0121 12z"],
                ].map(([id, l, d2]) => (_jsxs("button", { className: tab === id ? "on" : "", onClick: () => go(id), children: [_jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.6", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true, children: [_jsx("path", { d: d2 }), id === "wish" && _jsx("path", { d: "M8 11h8M8 15h5" })] }), _jsx("span", { children: l })] }, id))) })), lb !== null && (_jsxs("div", { ref: lbRef, className: "iv-lb", onClick: () => setLb(null), onKeyDown: (e) => {
                    if (e.key === "Escape")
                        setLb(null);
                    if (e.key === "ArrowRight")
                        setLb((i) => ((i ?? 0) + 1) % gallery.length);
                    if (e.key === "ArrowLeft")
                        setLb((i) => ((i ?? 0) - 1 + gallery.length) % gallery.length);
                }, onTouchStart: (e) => {
                    touchX.current = e.changedTouches[0].clientX;
                }, onTouchEnd: (e) => {
                    const x = touchX.current;
                    if (x == null)
                        return;
                    const dx = e.changedTouches[0].clientX - x;
                    if (dx < -40)
                        setLb((i) => ((i ?? 0) + 1) % gallery.length);
                    if (dx > 40)
                        setLb((i) => ((i ?? 0) - 1 + gallery.length) % gallery.length);
                    touchX.current = null;
                }, tabIndex: 0, role: "dialog", children: [_jsx("img", { src: gallery[lb], alt: "", onClick: (e) => e.stopPropagation() }), _jsx("button", { className: "iv-lb-x", onClick: () => setLb(null), "aria-label": "Tutup", children: "\u00D7" }), _jsx("button", { className: "iv-lb-n prev", onClick: (e) => {
                            e.stopPropagation();
                            setLb((i) => ((i ?? 0) - 1 + gallery.length) % gallery.length);
                        }, "aria-label": "Sebelumnya", children: "\u2039" }), _jsx("button", { className: "iv-lb-n next", onClick: (e) => {
                            e.stopPropagation();
                            setLb((i) => ((i ?? 0) + 1) % gallery.length);
                        }, "aria-label": "Berikutnya", children: "\u203A" })] }))] }));
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
