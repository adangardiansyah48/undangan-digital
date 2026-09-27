export type InvData = {
  cover?: string;
  couple?: { bride: string; groom: string; brideParents?: string; groomParents?: string };
  heroDate?: string;
  heroLoc?: string;
  ayat?: string;
  ayatCite?: string;
  countdownText?: string;
  events?: { title: string; date: string; time: string; place: string; loc: string; maps?: string }[];
  gallery?: string[];
  loveStory?: string;
  gift?: { bank: string; name: string; no: string }[];
  closing?: string;
  music?: string;
};

export const DEFAULT_DATA: InvData = {
  cover: "/demo41/cover.jpg",
  couple: {
    bride: "Vony",
    groom: "Kay",
    brideParents: "Bapak Putra & Ibu Putri",
    groomParents: "Bapak Putra & Ibu Putri",
  },
  heroDate: "Sabtu, 12 Desember 2025",
  heroLoc: "Cimalaka · Sumedang",
  ayat:
    "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri supaya kamu merasa tenteram, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu terdapat tanda-tanda bagi orang yang berpikir.",
  ayatCite: "— Q.S. Ar-Rum: 21 —",
  countdownText: "yang Insya Allah akan dilaksanakan pada",
  events: [
    {
      title: "Akad Nikah",
      date: "Sabtu, 12 Desember 2025",
      time: "Pukul 08.00 WIB",
      place: "Masjid Agung Cimalaka",
      loc: "Cimalaka · Sumedang",
      maps: "https://maps.google.com/?q=Masjid+Agung+Cimalaka",
    },
    {
      title: "Acara Resepsi",
      date: "Sabtu, 12 Desember 2025",
      time: "Pukul 11.00 WIB s.d Selesai",
      place: "Rumah Mempelai Wanita",
      loc: "Cimalaka · Sumedang",
      maps: "https://maps.google.com/?q=Cimalaka+Sumedang",
    },
  ],
  gallery: [
    "/demo41/g5.jpg",
    "/demo41/g6.jpg",
    "/demo41/cover.jpg",
    "/demo41/g2.jpg",
    "/demo41/g3.jpg",
    "/demo41/g4.jpg",
    "/demo41/g7.jpg",
    "/demo41/g8.jpg",
    "/demo41/g9.jpg",
    "/demo41/g10.jpg",
    "/demo41/g11.jpg",
    "/demo41/g12.jpg",
  ],
  loveStory:
    "Kita dipertemukan bukan karena kebetulan, tetapi karena semesta merestui doa-doa yang kita panjatkan diam-diam. Sejak saat itu, aku tahu, kamu adalah bagian dari takdir yang telah lama kucari. Hari ini, kita menulis bab baru — kisah cinta yang tak lagi sekadar mimpi, tapi nyata dalam ikatan suci pernikahan.",
  gift: [
    { bank: "BCA", name: "Vony", no: "7893230640213" },
    { bank: "DANA", name: "Kay", no: "088998085431" },
  ],
  closing:
    "Merupakan suatu kehormatan dan kebahagiaan bagi kami sekeluarga apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kedua mempelai.",
  music: "https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a73467.mp3?filename=wedding-piano-112193.mp3",
};

export function mergeData(raw: unknown): InvData {
  const d = (raw ?? {}) as Partial<InvData>;
  return {
    ...DEFAULT_DATA,
    ...d,
    couple: { ...DEFAULT_DATA.couple!, ...(d.couple ?? {}) },
    events: Array.isArray(d.events) && d.events.length ? (d.events as InvData["events"]) : DEFAULT_DATA.events,
    gallery: Array.isArray(d.gallery) && d.gallery.length ? (d.gallery as string[]) : DEFAULT_DATA.gallery,
    gift: Array.isArray(d.gift) && d.gift.length ? (d.gift as InvData["gift"]) : DEFAULT_DATA.gift,
  };
}
