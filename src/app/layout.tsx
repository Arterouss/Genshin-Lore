import type { Metadata } from "next";
import { Cinzel } from "next/font/google";
import "./globals.css";
import { AudioProvider } from "@/context/AudioContext";
import AudioPlayerBar from "@/components/AudioPlayerBar";
import Navbar from "@/components/Navbar";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "600", "700", "900"],
});

export const metadata: Metadata = {
  title: "Teyvat Lore — Arsip & Audio Ringkasan Lore Genshin Impact Bahasa Indonesia",
  description:
    "Baca dan dengarkan ringkasan lore Genshin Impact dalam Bahasa Indonesia. Nikmati cerita backstory karakter, Archon Quest, World Quest, dan lebih banyak dalam 10–25 menit.",
  keywords: ["Genshin Impact", "Lore", "Bahasa Indonesia", "Teyvat", "Ringkasan Cerita", "Audio"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${cinzel.variable} h-full`}>
      <body className="min-h-full flex flex-col pb-20">
        <AudioProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <AudioPlayerBar />
        </AudioProvider>
      </body>
    </html>
  );
}
