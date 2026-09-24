import type { TemplateCategory, Tier } from "@/types/database";

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "mstory.id";
export const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER ?? "6281234567890";

export const TIERS: Record<
  Tier,
  { label: string; price: number; days: number | null; highlight?: boolean }
> = {
  bronze: { label: "Bronze", price: 0, days: 2 },
  silver: { label: "Silver", price: 35000, days: 10 },
  gold: { label: "Gold", price: 65000, days: 30, highlight: true },
  platinum: { label: "Platinum", price: 97000, days: null },
};

export const TIER_FEATURES = [
  "Semua fitur undangan",
  "Jumlah tamu tidak terbatas",
  "Amplop digital",
  "Custom nama tamu",
  "RSVP & buku tamu",
];

export const CATEGORIES: { id: TemplateCategory | "all"; label: string }[] = [
  { id: "all", label: "Semua" },
  { id: "wedding", label: "Wedding" },
  { id: "adat", label: "Adat" },
  { id: "animasi", label: "Animasi" },
  { id: "non-wedding", label: "Non Wedding" },
];

export const FEATURES = [
  {
    title: "Responsive Mobile Friendly",
    desc: "Tampil rapi di HP, tablet, dan desktop.",
  },
  {
    title: "Custom Nama Tamu",
    desc: "Satu link, nama personal via ?to=NamaTamu.",
  },
  {
    title: "Countdown Acara",
    desc: "Hitung mundur sampai hari H.",
  },
  {
    title: "Navigasi Peta",
    desc: "Google Maps langsung dari undangan.",
  },
  {
    title: "RSVP & Ucapan",
    desc: "Konfirmasi hadir + buku tamu realtime.",
  },
  {
    title: "Amplop Digital",
    desc: "Rekening & e-wallet, tombol salin.",
  },
  {
    title: "Galeri Foto & Video",
    desc: "Simpan ke Google Drive, storage besar.",
  },
  {
    title: "Musik Latar",
    desc: "Autoplay backsound romantis.",
  },
  {
    title: "Love Story Timeline",
    desc: "Cerita cinta sampai pelaminan.",
  },
  {
    title: "Quotes & Doa",
    desc: "Ayat, kutipan, atau doa pilihan.",
  },
  {
    title: "Hybrid Service",
    desc: "Bikin sendiri atau dibuatkan tim.",
  },
  {
    title: "Sender Tools",
    desc: "Generate link WA per tamu, unlimited.",
  },
];

export const STEPS = [
  { n: "01", title: "Pilih tema", desc: "Wedding, adat, animasi, atau acara lain." },
  { n: "02", title: "Pilih jalur", desc: "Edit sendiri, atau minta tim kerjakan." },
  { n: "03", title: "Bayar & aktifkan", desc: "Paket 2 hari sampai selamanya." },
  { n: "04", title: "Sebar link", desc: "Kirim ?to=Nama ke tiap tamu via WA." },
];

export function formatIDR(n: number) {
  if (n === 0) return "GRATIS";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function waLink(text: string) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
}
