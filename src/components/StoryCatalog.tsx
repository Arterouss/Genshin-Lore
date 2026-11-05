"use client";

import { useState, useMemo } from "react";
import type { StoryMeta, Region, Category } from "@/types/story";
import StoryCard from "./StoryCard";
import { Search, Sparkles, SlidersHorizontal, BookOpen } from "lucide-react";

const REGIONS: Region[] = [
  "Semua",
  "Mondstadt",
  "Liyue",
  "Inazuma",
  "Sumeru",
  "Fontaine",
  "Natlan",
  "Snezhnaya",
  "Khaenri'ah",
];

const REGION_EMOJI: Record<Region, string> = {
  Semua: "✦",
  Mondstadt: "💨",
  Liyue: "🪨",
  Inazuma: "⚡",
  Sumeru: "🌿",
  Fontaine: "💧",
  Natlan: "🔥",
  Snezhnaya: "❄️",
  "Khaenri'ah": "⬛",
};

const CATEGORIES: { id: string; label: string }[] = [
  { id: "all", label: "Semua Kategori" },
  { id: "archon-quest", label: "Archon Quest" },
  { id: "character-backstory", label: "Backstory Karakter" },
  { id: "story-quest", label: "Story Quest" },
  { id: "world-lore", label: "World Lore" },
];

export default function StoryCatalog({ stories }: { stories: StoryMeta[] }) {
  const [activeRegion, setActiveRegion] = useState<Region>("Semua");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filtered = useMemo(() => {
    return stories.filter((s) => {
      // Filter wilayah
      if (activeRegion !== "Semua" && s.region !== activeRegion) return false;

      // Filter kategori
      if (activeCategory !== "all" && s.category !== activeCategory) return false;

      // Filter pencarian
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = s.title?.toLowerCase().includes(q);
        const matchChar = s.character?.toLowerCase().includes(q);
        const matchSummary = s.summary?.toLowerCase().includes(q);
        const matchTags = s.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchChar && !matchSummary && !matchTags) return false;
      }

      return true;
    });
  }, [stories, activeRegion, activeCategory, searchQuery]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Section header */}
      <div className="mb-8 text-center">
        <p className="text-parchment-muted text-xs tracking-[0.3em] uppercase mb-2 flex items-center justify-center gap-1.5">
          <Sparkles size={12} className="text-gold-300" />
          Pustaka Arsip Irminsul
        </p>
        <h2
          className="text-2xl sm:text-3xl font-bold text-gold-200 glow-gold-text"
          style={{ fontFamily: "Cinzel, Georgia, serif" }}
        >
          Katalog Lore Teyvat
        </h2>
        <div className="gold-divider max-w-xs mx-auto mt-3" />
      </div>

      {/* Search & Category Filter Bar */}
      <div className="max-w-2xl mx-auto mb-8 flex flex-col sm:flex-row gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-parchment-muted pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari karakter, quest, atau kata kunci..."
            className="w-full bg-scroll-800 border border-gold-300/20 focus:border-gold-300/60 rounded-xl pl-10 pr-4 py-2.5 text-sm text-parchment placeholder-parchment-muted outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-parchment-muted hover:text-parchment px-1.5 py-0.5 rounded bg-celestia-600"
            >
              Hapus
            </button>
          )}
        </div>

        {/* Category dropdown/selector */}
        <div className="relative shrink-0">
          <select
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            className="w-full sm:w-auto bg-scroll-800 border border-gold-300/20 focus:border-gold-300/60 rounded-xl px-4 py-2.5 text-sm text-gold-300 outline-none cursor-pointer appearance-none pr-8"
          >
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id} className="bg-celestia-800 text-parchment">
                {c.label}
              </option>
            ))}
          </select>
          <SlidersHorizontal
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-parchment-muted pointer-events-none"
          />
        </div>
      </div>

      {/* Region filter tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {REGIONS.map((r) => (
          <button
            key={r}
            onClick={() => setActiveRegion(r)}
            className={`flex items-center gap-1.5 text-xs sm:text-sm px-3.5 py-1.5 rounded-full border transition-all duration-200 ${
              activeRegion === r
                ? "bg-gold-300/20 border-gold-300/60 text-gold-200 font-semibold shadow-sm"
                : "border-celestia-500 bg-celestia-800/40 text-parchment-muted hover:border-gold-300/30 hover:text-parchment"
            }`}
          >
            <span>{REGION_EMOJI[r]}</span>
            <span>{r}</span>
          </button>
        ))}
      </div>

      {/* Result counter */}
      <div className="flex items-center justify-between text-xs text-parchment-muted mb-6 pb-2 border-b border-gold-300/10">
        <span className="flex items-center gap-1.5">
          <BookOpen size={13} className="text-gold-300" />
          Menampilkan <span className="text-gold-200 font-semibold">{filtered.length}</span> dari {stories.length} arsip
        </span>
        {(activeRegion !== "Semua" || activeCategory !== "all" || searchQuery) && (
          <button
            onClick={() => {
              setActiveRegion("Semua");
              setActiveCategory("all");
              setSearchQuery("");
            }}
            className="text-gold-300 hover:text-gold-200 hover:underline text-xs"
          >
            Reset Filter
          </button>
        )}
      </div>

      {/* Story grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-parchment-muted bg-scroll-800/40 border border-gold-300/10 rounded-2xl p-8">
          <p className="text-4xl mb-3">📜</p>
          <p className="font-display text-lg text-parchment-dim">Tidak ada arsip yang cocok dengan pencarian.</p>
          <p className="text-xs text-parchment-muted mt-2">Coba ubah kata kunci atau pilih wilayah lain.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((s) => (
            <StoryCard key={s.slug} story={s} />
          ))}
        </div>
      )}
    </section>
  );
}
