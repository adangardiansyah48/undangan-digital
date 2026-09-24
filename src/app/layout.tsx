import type { Metadata } from "next";
import "./globals.css";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} — Undangan Digital Elegant`,
    template: `%s · ${APP_NAME}`,
  },
  description:
    "Bikin undangan digital sendiri, atau dibuatkan tim. Template elegan, custom nama tamu, RSVP, amplop digital.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
