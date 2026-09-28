export function gdriveThumb(id, w = 800) {
    return `https://drive.google.com/thumbnail?id=${id}&sz=w${w}`;
}
export function gdriveView(id) {
    return `https://drive.google.com/uc?export=view&id=${id}`;
}
export const DEFAULT_DATA = {
    cover: gdriveThumb("1fTr-jc5mmiCQCTHsHA2uR2cVvBrDVoZG", 900),
    couple: { bride: "Vony", groom: "Kay", brideParents: "Bapak Putra & Ibu Putri", groomParents: "Bapak Putra & Ibu Putri" },
    heroDate: "Sabtu, 12 Desember 2025",
    heroLoc: "Cimalaka \u00b7 Sumedang",
    ayat: "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri supaya kamu merasa tenteram, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu terdapat tanda-tanda bagi orang yang berpikir.",
    ayatCite: "\u2014 Q.S. Ar-Rum: 21 \u2014",
    countdownText: "yang Insya Allah akan dilaksanakan pada",
    events: [
        { title: "Akad Nikah", date: "Sabtu, 12 Desember 2025", time: "Pukul 08.00 WIB", place: "Masjid Agung Cimalaka", loc: "Cimalaka \u00b7 Sumedang", maps: "https://maps.google.com/?q=Masjid+Agung+Cimalaka" },
        { title: "Acara Resepsi", date: "Sabtu, 12 Desember 2025", time: "Pukul 11.00 WIB s.d Selesai", place: "Rumah Mempelai Wanita", loc: "Cimalaka \u00b7 Sumedang", maps: "https://maps.google.com/?q=Cimalaka+Sumedang" },
    ],
    gallery: [
        gdriveThumb("1lWO7y0PF_idaALFsipeQhh5q6BVVnfgG", 600),
        gdriveThumb("1jsz_qKW3OmMLmkOPoCqpzJiDRfin7hH4", 600),
        gdriveThumb("1R51_kWb6mVhPA3UHi-8d3uI1jHvxWcZo", 600),
        gdriveThumb("1p7RzWiYLfjUWMQjMZ4fE6xAc8viBZWO5", 600),
        gdriveThumb("1FO8XvvfFL9AQD7rqY3VAwrac9OYycx9q", 600),
        gdriveThumb("1J1nbz7g7dq6I3wGMRAHnZ2bGJkl_22Kl", 600),
        gdriveThumb("1eDPVnIiF-OnDqT1h48jri21acxczPJKM", 600),
        gdriveThumb("1WU3YyvZkstQ0HYlp1i5IfZ-_FYjiwEyt", 600),
        gdriveThumb("15BQhxQp1q3aFMnpc1GaH-Csh_5j1G0o-", 600),
        gdriveThumb("1MWkgDvUTt-7IQkaGGzZrifU67JsFnlRM", 600),
    ],
    loveStory: "Kita dipertemukan bukan karena kebetulan, tetapi karena semesta merestui doa-doa yang kita panjatkan diam-diam. Sejak saat itu, aku tahu, kamu adalah bagian dari takdir yang telah lama kucari. Hari ini, kita menulis bab baru \u2014 kisah cinta yang tak lagi sekadar mimpi, tapi nyata dalam ikatan suci pernikahan.",
    gift: [{ bank: "BCA", name: "Vony", no: "7893230640213" }, { bank: "DANA", name: "Kay", no: "088998085431" }],
    closing: "Merupakan suatu kehormatan dan kebahagiaan bagi kami sekeluarga apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kedua mempelai.",
    music: "https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a73467.mp3?filename=wedding-piano-112193.mp3",
};
export function mergeData(raw) {
    const d = (raw ?? {});
    return {
        ...DEFAULT_DATA,
        ...d,
        couple: { ...DEFAULT_DATA.couple, ...(d.couple ?? {}) },
        events: Array.isArray(d.events) && d.events.length ? d.events : DEFAULT_DATA.events,
        gallery: Array.isArray(d.gallery) && d.gallery.length ? d.gallery : DEFAULT_DATA.gallery,
        gift: Array.isArray(d.gift) && d.gift.length ? d.gift : DEFAULT_DATA.gift,
    };
}
