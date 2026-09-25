import type { Metadata } from "next";
import { Playfair_Display, Cormorant_Garamond, Great_Vibes, Montserrat, Cinzel, Dancing_Script, Poppins, Libre_Baskerville } from "next/font/google";
import "./globals.css";
import { APP_NAME } from "@/lib/constants";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-cormorant", display: "swap" });
const greatVibes = Great_Vibes({ subsets: ["latin"], weight: "400", variable: "--font-greatvibes", display: "swap" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", display: "swap" });
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel", display: "swap" });
const dancing = Dancing_Script({ subsets: ["latin"], variable: "--font-dancing", display: "swap" });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-poppins", display: "swap" });
const libre = Libre_Baskerville({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-libre", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} — Undangan Digital Elegant`,
    template: `%s · ${APP_NAME}`,
  },
  description:
    "Bikin undangan digital sendiri, atau dibuatkan tim. Template elegan, custom nama tamu, RSVP, amplop digital.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`h-full antialiased ${playfair.variable} ${cormorant.variable} ${greatVibes.variable} ${montserrat.variable} ${cinzel.variable} ${dancing.variable} ${poppins.variable} ${libre.variable}`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
