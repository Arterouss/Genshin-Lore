import { getAllStories } from "@/lib/stories";
import StoryCatalog from "@/components/StoryCatalog";
import Link from "next/link";
import { ChevronLeft, Sparkles } from "lucide-react";
import type { Metadata } from "next";

const CATEGORY_NAMES: Record<string, { title: string; subtitle: string }> = {
  "archon-quest": {
    title: "Archon Quests",
    subtitle: "Rangkaian kisah utama perjalan Sang Pengembara melintasi 7 Bangsa Teyvat.",
  },
  "story-quest": {
    title: "Story Quests",
    subtitle: "Kisah mendalam yang mengungkap masa lalu dan rahasia para karakter.",
  },
  "character-backstory": {
    title: "Backstory Karakter",
    subtitle: "Catatan resmi Character Story 1–5, Vision, dan masa lalu tiap karakter.",
  },
  "world-lore": {
    title: "World Lore",
    subtitle: "Misteri kuno peradaban Teyvat, Celestia, Abyss, dan Khaenri'ah.",
  },
};

type Props = { params: Promise<{ category: string }> };

export function generateStaticParams() {
  return [
    { category: "archon-quest" },
    { category: "story-quest" },
    { category: "character-backstory" },
    { category: "world-lore" },
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const meta = CATEGORY_NAMES[category] || { title: "Kategori Lore" };
  return {
    title: `${meta.title} — Teyvat Lore`,
    description: `Arsip ${meta.title} Genshin Impact dalam bahasa Indonesia.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const allStories = getAllStories();
  const info = CATEGORY_NAMES[category] || {
    title: category.replace(/-/g, " ").toUpperCase(),
    subtitle: `Arsip kategori ${category}`,
  };

  const filtered = allStories.filter((s) => s.category === category);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-parchment-muted hover:text-gold-300 text-sm transition-colors mb-8"
      >
        <ChevronLeft size={16} />
        Kembali ke Beranda
      </Link>

      {/* Header Banner */}
      <div className="text-center mb-10 pb-8 border-b border-gold-300/10">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Sparkles size={14} className="text-gold-300" />
          <span className="text-xs text-gold-300 tracking-[0.3em] uppercase font-semibold">
            Kategori Arsip
          </span>
        </div>
        <h1
          className="text-3xl sm:text-5xl font-bold text-gold-200 glow-gold-text mb-3"
          style={{ fontFamily: "Cinzel, Georgia, serif" }}
        >
          {info.title}
        </h1>
        <p className="text-parchment-dim max-w-xl mx-auto text-sm sm:text-base">
          {info.subtitle}
        </p>
      </div>

      {/* Catalog */}
      <StoryCatalog stories={filtered} />
    </div>
  );
}
