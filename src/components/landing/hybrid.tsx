import Link from "next/link";
import { Button } from "@/components/ui/button";
import { waLink } from "@/lib/constants";

export function Hybrid() {
  return (
    <section className="bg-muted/40 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold tracking-[0.2em] text-muted-foreground">DUA CARA MEMESAN</p>
        <h2 className="mt-2 text-center font-serif text-3xl sm:text-4xl">Pilih yang paling gampang</h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-sm text-muted-foreground">Untuk awam sekalipun. Tidak perlu install, tidak perlu desain skill.</p>
        <div className="mx-auto mt-8 grid max-w-5xl gap-4 md:grid-cols-2">
          <div className="rounded-[1.7rem] border bg-white p-7 sm:p-8">
            <span className="inline-flex rounded-full bg-foreground px-3 py-1 text-[10px] font-semibold tracking-widest text-background">01 · EDIT SENDIRI</span>
            <h3 className="mt-4 font-serif text-2xl">Bikin sendiri 5 menit</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Pilih template → isi nama, tanggal, alamat → upload foto → publish. Preview langsung, link siap share WA.</p>
            <ul className="mt-5 space-y-2 text-sm"><li>✓ Editor drag-free, klik-klik jadi</li><li>✓ Galeri Google Drive unlimited</li><li>✓ RSVP &amp; buku tamu otomatis</li></ul>
            <Button className="mt-6 w-full rounded-full" size="lg" render={<Link href="/register" />}>Coba Editor Gratis</Button>
            <p className="mt-2 text-center text-xs text-muted-foreground">Tanpa kartu kredit · publish 1 menit</p>
          </div>
          <div className="rounded-[1.7rem] bg-foreground p-7 text-background sm:p-8">
            <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-[10px] font-semibold tracking-widest">02 · DIBANTU TIM</span>
            <h3 className="mt-4 font-serif text-2xl">Dibuatkan tim 1–2 hari</h3>
            <p className="mt-2 text-sm leading-relaxed opacity-80">Kirim foto + brief via WA. Tim desain eksekusi, kamu tinggal approve. Revisi sampai H-hari.</p>
            <ul className="mt-5 space-y-2 text-sm opacity-90"><li>✓ Desainer handle foto &amp; layout</li><li>✓ Hasil premium, kamu approve</li><li>✓ Harga via chat, transparan</li></ul>
            <Button className="mt-6 w-full rounded-full" size="lg" variant="secondary" render={<a href={waLink("Halo mstory, mau dibuatkan undangan. Saya kirim foto & brief.")} target="_blank" rel="noreferrer" />}>Konsultasi WA Gratis</Button>
            <p className="mt-2 text-center text-xs opacity-60">Balas cepat · jam 08–21 WIB</p>
          </div>
        </div>
      </div>
    </section>
  );
}
