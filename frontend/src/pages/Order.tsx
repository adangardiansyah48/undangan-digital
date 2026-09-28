import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { API } from "../lib/api";
import { CATALOG } from "../lib/catalog";
export default function Order() {
  const [sp] = useSearchParams();
  const tema = sp.get("tema") ?? "";
  const item = CATALOG.find((x) => x.slug === tema);
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null); setOk(null); setLoading(true);
    const fd = new FormData(e.currentTarget);
    if (!fd.get("template_slug")) fd.set("template_slug", tema || String(fd.get("tema") ?? ""));
    try {
      const res = await fetch(`${API}/api/guest-orders`, { method: "POST", body: fd });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error ?? "Gagal kirim");
      setOk(j.id ?? "Terkirim");
      (e.target as HTMLFormElement).reset();
    } catch (e2) { setErr((e2 as Error).message); } finally { setLoading(false); }
  }

  const input: React.CSSProperties = { width: "100%", padding: "11px 12px", borderRadius: 10, border: "1px solid #ddd", fontSize: 14 };
  const label: React.CSSProperties = { display: "block", fontSize: 12, fontWeight: 600, color: "#1c3147", marginBottom: 6 };
  const fs: React.CSSProperties = { border: "1px solid #e8e8e8", borderRadius: 14, padding: 16, background: "#fff" };
  const h3: React.CSSProperties = { margin: "0 0 12px", fontSize: 15, color: "#1c3147" };

  return (
    <main style={{ maxWidth: 840, margin: "0 auto", padding: "18px 16px 40px", fontFamily: "Outfit,system-ui,sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&family=Outfit:wght@400;600&display=swap');`}</style>
      <Link to="/" style={{ color: "#1c3147", textDecoration: "none", fontSize: 13 }}>← Kembali Katalog</Link>
      <h1 style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 30, margin: "10px 0 4px", color: "#1c3147" }}>Form Pemesanan</h1>
      <p style={{ margin: 0, color: "#6b7280", fontSize: 13 }}>
        Tema: <b style={{ color: "#1c3147" }}>{item ? `${item.title} (${tema})` : (tema || "— pilih di katalog")}</b>
        <span style={{ color: "#9aa" }}> — Tema tidak dapat diubah/diganti. </span>
        <a href="https://invitos.id/katalog-2/" target="_blank" rel="noreferrer" style={{ color: "#c4a574" }}>Ref invitos.id/katalog-2 →</a>
      </p>
      <p style={{ fontSize: 12, color: "#6b7280", marginTop: 8 }}>Pengiriman Foto via WhatsApp/Google Drive — setelah submit kami hubungi via WA. Tanda ❌ untuk bagian yang dikosongkan.</p>

      <form onSubmit={submit} style={{ display: "grid", gap: 14, marginTop: 16 }}>
        <input type="hidden" name="template_slug" value={tema} />
        <fieldset style={fs}>
          <h3 style={h3}>Kontak Pemesan</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12 }}>
            <label><span style={label}>Nama kontak *</span><input name="contact_name" required style={input} placeholder="Nama" /></label>
            <label><span style={label}>No. WA *</span><input name="contact_wa" required style={input} placeholder="62812xxxx" /></label>
            <label><span style={label}>Email</span><input name="contact_email" style={input} placeholder="email (opsional)" /></label>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
            <label><span style={label}>Nama awal mempelai</span><select name="first_name_order" style={input} defaultValue=""><option value="">Pilih</option><option value="pria">Pria dulu</option><option value="wanita">Wanita dulu</option></select></label>
            <label><span style={label}>Muslim / Non Muslim</span><select name="religion" style={input} defaultValue=""><option value="">Pilih</option><option value="muslim">Muslim</option><option value="non_muslim">Non Muslim</option></select></label>
          </div>
        </fieldset>

        <fieldset style={fs}>
          <h3 style={h3}>Data Mempelai Pria</h3>
          <div style={{ display: "grid", gap: 10 }}>
            <label><span style={label}>Nama Panggilan</span><input name="groom_nick" style={input} /></label>
            <label><span style={label}>Nama Lengkap</span><input name="groom_full" style={input} /></label>
            <label><span style={label}>Nama Orang Tua — Bapak</span><input name="groom_father" style={input} /></label>
            <label><span style={label}>Nama Orang Tua — Ibu</span><input name="groom_mother" style={input} /></label>
            <label><span style={label}>Alamat</span><input name="groom_address" style={input} /></label>
            <label><span style={label}>Akun Instagram</span><input name="groom_ig" style={input} placeholder="@username" /></label>
          </div>
        </fieldset>

        <fieldset style={fs}>
          <h3 style={h3}>Data Mempelai Wanita</h3>
          <div style={{ display: "grid", gap: 10 }}>
            <label><span style={label}>Nama Panggilan</span><input name="bride_nick" style={input} /></label>
            <label><span style={label}>Nama Lengkap</span><input name="bride_full" style={input} /></label>
            <label><span style={label}>Nama Orang Tua — Bapak</span><input name="bride_father" style={input} /></label>
            <label><span style={label}>Nama Orang Tua — Ibu</span><input name="bride_mother" style={input} /></label>
            <label><span style={label}>Alamat</span><input name="bride_address" style={input} /></label>
            <label><span style={label}>Akun Instagram</span><input name="bride_ig" style={input} placeholder="@username" /></label>
          </div>
        </fieldset>

        <fieldset style={fs}>
          <h3 style={h3}>Jam, Tanggal & Tempat Acara — Akad</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 10 }}>
            <label><span style={label}>Jam (WITA/WIB/WIT)</span><input name="akad_time" style={input} placeholder="08.00 WIB" /></label>
            <label><span style={label}>Hari, Tanggal</span><input name="akad_date" type="date" style={input} /></label>
            <label><span style={label}>Lokasi</span><input name="akad_venue" style={input} /></label>
            <label><span style={label}>Link lokasi / Shareloc</span><input name="akad_maps" style={input} placeholder="https://maps.google.com/..." /></label>
          </div>
          <h3 style={{ ...h3, marginTop: 16 }}>Resepsi</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 10 }}>
            <label><span style={label}>Jam (WITA/WIB/WIT)</span><input name="resepsi_time" style={input} placeholder="11.00 WIB" /></label>
            <label><span style={label}>Hari, Tanggal</span><input name="resepsi_date" type="date" style={input} /></label>
            <label><span style={label}>Lokasi</span><input name="resepsi_venue" style={input} /></label>
            <label><span style={label}>Link lokasi / Shareloc</span><input name="resepsi_maps" style={input} placeholder="https://maps.google.com/..." /></label>
          </div>
        </fieldset>

        <fieldset style={fs}>
          <h3 style={h3}>Foto & Video — 14 foto Album + 2 foto tiap mempelai + 1 Video (bila ada)</h3>
          <p style={{ fontSize: 12, color: "#6b7280", marginTop: -6 }}>Upload langsung atau kirim via WA/GDrive setelah order. Max per file 20MB.</p>
          <div style={{ display: "grid", gap: 10 }}>
            <label><span style={label}>Album (14 foto) — pilih banyak</span><input type="file" name="album" multiple accept="image/*" /></label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <label><span style={label}>Foto Pria (2 foto)</span><input type="file" name="bride_groom" multiple accept="image/*" /></label>
              <label><span style={label}>Foto Wanita (2 foto)</span><input type="file" name="bride_groom2" multiple accept="image/*" /></label>
            </div>
            <label><span style={label}>Video Dokumenter Pasangan (bila ada)</span><input type="file" name="video" accept="video/*" /></label>
            <label><span style={label}>Link GDrive (alternatif)</span><input name="gdrive_link" style={input} placeholder="https://drive.google.com/..." /></label>
          </div>
        </fieldset>

        <fieldset style={fs}>
          <h3 style={h3}>Request Musik</h3>
          <label><span style={label}>Judul / Link musik</span><input name="music_req" style={input} placeholder="Judul lagu atau link" /></label>
        </fieldset>

        <fieldset style={fs}>
          <h3 style={h3}>Fitur Angpao — Max 2 rekening</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 10 }}>
            <label><span style={label}>Bank 1</span><input name="bank1_name" style={input} placeholder="BCA / Mandiri" /></label>
            <label><span style={label}>No. Rek 1</span><input name="bank1_no" style={input} /></label>
            <label><span style={label}>Atas Nama 1</span><input name="bank1_holder" style={input} /></label>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 10, marginTop: 10 }}>
            <label><span style={label}>Bank 2</span><input name="bank2_name" style={input} /></label>
            <label><span style={label}>No. Rek 2</span><input name="bank2_no" style={input} /></label>
            <label><span style={label}>Atas Nama 2</span><input name="bank2_holder" style={input} /></label>
          </div>
        </fieldset>

        <fieldset style={fs}>
          <h3 style={h3}>Fitur Kado</h3>
          <div style={{ display: "grid", gap: 10 }}>
            <label><span style={label}>Alamat</span><input name="gift_address" style={input} /></label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <label><span style={label}>Penerima</span><input name="gift_receiver" style={input} /></label>
              <label><span style={label}>No. Whatsapp penerima</span><input name="gift_wa" style={input} /></label>
            </div>
          </div>
        </fieldset>

        <fieldset style={fs}>
          <h3 style={h3}>Link IG / Zoom (Fitur Live)</h3>
          <label><span style={label}>Link Live</span><input name="live_link" style={input} placeholder="https://..." /></label>
          <h3 style={{ ...h3, marginTop: 16 }}>RSVP — 1 Nomor Whatsapp</h3>
          <label><span style={label}>No. WA RSVP</span><input name="rsvp_wa" style={input} placeholder="62812..." /></label>
          <h3 style={{ ...h3, marginTop: 16 }}>Story Of Love</h3>
          <label><span style={label}>Cerita</span><textarea name="story" rows={4} style={{ ...input, minHeight: 90 }} placeholder="Cerita perjalanan..." /></label>
        </fieldset>

        <label style={{ fontSize: 12, color: "#6b7280", display: "flex", gap: 8, alignItems: "flex-start" }}>
          <input type="checkbox" required /> Saya setuju data benar, undangan diproses setelah semua data diisi (kecuali ada konfirmasi kosong ❌). Terimakasih 🙏
        </label>

        <button type="submit" disabled={loading} style={{ padding: "14px", borderRadius: 999, border: 0, background: "#1c3147", color: "#fff", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1 }}>
          {loading ? "Mengirim…" : "Kirim Pesanan — Tim akan hubungi WA"}
        </button>
        {ok && <p style={{ color: "#0a7", fontWeight: 600 }}>Pesanan terkirim! ID: {ok} — Tim akan hubungi WA kamu segera. Simpan ID ini. <Link to="/">Kembali katalog</Link></p>}
        {err && <p style={{ color: "crimson" }}>{err}</p>}
      </form>
    </main>
  );
}
