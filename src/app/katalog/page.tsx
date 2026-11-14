import { getAllStories } from "@/lib/stories";
import StoryCatalog from "@/components/StoryCatalog";
import Link from "next/link";
import { ChevronLeft, Sparkles, BookOpen } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Katalog Cerita & Karakter — Teyvat Lore",
  description:
    "Jelajahi kumpulan naskah Archon Quest, Story Quest, World Lore, serta biografi dan rekaman suara karakter Genshin Impact bahasa Jepang.",
};

export default function KatalogPage() {
  const stories = getAllStories();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-parchment-dim hover:text-gold-300 transition-colors mb-6 group"
      >
        <ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
        Kembali ke Beranda
      </Link>

      {/* Header */}
      <header className="mb-6 text-center max-w-3xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="gold-divider w-12" />
          <span className="text-gold-300 text-xs tracking-widest uppercase font-semibold flex items-center gap-1.5">
            <BookOpen size={13} />
            Grand Compendium Archive
          </span>
          <div className="gold-divider w-12" />
        </div>

        <h1
          className="text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text mb-4"
          style={{
            fontFamily: "Cinzel Decorative, Cinzel, Georgia, serif",
            backgroundImage: "linear-gradient(135deg, #FFF1CE 0%, #E5BA69 50%, #C48E2E 100%)",
          }}
        >
          Katalog Arsip Cerita &amp; Karakter
        </h1>

        <p className="text-parchment-dim text-sm sm:text-base leading-relaxed">
          Arsip telah dipisahkan secara rapi: telusuri tab <strong className="text-gold-200">Alur Cerita &amp; Quest</strong> untuk
          kronik perjalanan 7 bangsa, atau beralih ke tab <strong className="text-emerald-300">Biografi &amp; Suara Karakter JP</strong> untuk
          mendengarkan rekaman suara resmi seiyuu dan membaca rahasia masa lalu tiap tokoh.
        </p>
      </header>

      {/* Catalog Grid with Search and Separated Story/Character Tabs */}
      <StoryCatalog stories={stories} defaultTab="stories" />
    </div>
  );
}
