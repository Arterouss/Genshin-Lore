"use client";

import { useState, useMemo } from "react";
import type { StoryMeta, Region } from "@/types/story";
import StoryCard from "./StoryCard";
import { Search, Sparkles, SlidersHorizontal, BookOpen, Scroll, Headphones, Database, ArrowRight } from "lucide-react";
import Link from "next/link";

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

const STORY_CATEGORIES: { id: string; label: string }[] = [
  { id: "all", label: "Semua Cerita & Quest" },
  { id: "archon-quest", label: "Archon Quest (Kisah Utama 7 Bangsa)" },
  { id: "story-quest", label: "Story Quest (Misi Legenda)" },
  { id: "world-lore", label: "World Lore (Sejarah Dunia & Khaenri'ah)" },
];

interface StoryCatalogProps {
  stories: StoryMeta[];
  defaultTab?: "stories" | "characters";
  hideTabs?: boolean;
}

export default function StoryCatalog({
  stories,
  defaultTab = "stories",
  hideTabs = false,
}: StoryCatalogProps) {
  // Tab utama: "stories" (Cerita & Quest) atau "characters" (Karakter & Suara JP)
  const [activeTab, setActiveTab] = useState<"stories" | "characters">(defaultTab);
  const [activeRegion, setActiveRegion] = useState<Region>("Semua");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedRarity, setSelectedRarity] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Pisahkan kumpulan data cerita murni dan data karakter murni
  const pureStories = useMemo(
    () => stories.filter((s) => s.category !== "character-backstory"),
    [stories]
  );
  const characterStories = useMemo(
    () => stories.filter((s) => s.category === "character-backstory"),
    [stories]
  );

  // Ambil dataset sesuai tab aktif
  const currentDataset = useMemo(() => {
    if (hideTabs) return stories;
    return activeTab === "stories" ? pureStories : characterStories;
  }, [activeTab, hideTabs, stories, pureStories, characterStories]);

  // Filter dataset aktif
  const filtered = useMemo(() => {
    return currentDataset.filter((s) => {
      // Filter wilayah
      if (activeRegion !== "Semua" && s.region !== activeRegion) return false;

      // Filter kategori (khusus tab cerita)
      if (activeTab === "stories" && activeCategory !== "all" && s.category !== activeCategory) {
        return false;
      }

      // Filter rarity (khusus tab karakter)
      if (activeTab === "characters" && selectedRarity !== "all" && s.rarity?.toString() !== selectedRarity) {
        return false;
      }

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
  }, [currentDataset, activeRegion, activeCategory, selectedRarity, searchQuery, activeTab]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ── 1. Tab Pemisah Utama (Cerita vs Karakter) ── */}
      {!hideTabs && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
          <button
            onClick={() => {
              setActiveTab("stories");
              setActiveCategory("all");
              setSelectedRarity("all");
            }}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 shadow-md ${
              activeTab === "stories"
                ? "bg-gradient-to-r from-gold-500 to-gold-400 text-celestia-950 border border-gold-300 shadow-gold-500/20 scale-105"
                : "bg-celestia-900/80 hover:bg-celestia-850 text-parchment-dim hover:text-gold-200 border border-gold-300/20"
            }`}
          >
            <Scroll size={17} />
            <span>Alur Cerita &amp; Quest</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                activeTab === "stories"
                  ? "bg-celestia-950/20 text-celestia-950 font-black"
                  : "bg-gold-400/10 text-gold-300 border border-gold-400/20"
              }`}
            >
              {pureStories.length} Naskah
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab("characters");
              setActiveCategory("all");
              setSelectedRarity("all");
            }}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 shadow-md ${
              activeTab === "characters"
                ? "bg-gradient-to-r from-gold-500 to-gold-400 text-celestia-950 border border-gold-300 shadow-gold-500/20 scale-105"
                : "bg-celestia-900/80 hover:bg-celestia-850 text-parchment-dim hover:text-gold-200 border border-gold-300/20"
            }`}
          >
            <Headphones size={17} />
            <span>Biografi &amp; Suara Karakter JP</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                activeTab === "characters"
                  ? "bg-celestia-950/20 text-celestia-950 font-black"
                  : "bg-gold-400/10 text-gold-300 border border-gold-400/20"
              }`}
            >
              {characterStories.length} Karakter
            </span>
          </button>
        </div>
      )}

      {/* ── Banner Callout Database ketika berada di Tab Karakter ── */}
      {!hideTabs && activeTab === "characters" && (
        <div className="mb-8 p-4 rounded-xl bg-celestia-950/80 border border-gold-300/25 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gold-400/15 border border-gold-400/30 flex items-center justify-center text-gold-300 shrink-0">
              <Database size={20} />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-parchment">
                Mencari seluruh 126 karakter playable dengan senjata, konstelasi, dan material asensi?
              </p>
              <p className="text-[11px] text-parchment-dim">
                Buka Ensiklopedia Database Teyvat untuk eksplorasi statistik karakter dan senjata secara mendalam.
              </p>
            </div>
          </div>
          <Link
            href="/database"
            className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gold-400/20 hover:bg-gold-400/30 border border-gold-400/40 text-gold-200 text-xs font-bold transition-colors"
          >
            <span>Buka Database (126 Char)</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      )}

      {/* ── 2. Search & Filter Bar ── */}
      <div className="max-w-3xl mx-auto mb-6 flex flex-col sm:flex-row gap-3">
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
            placeholder={
              activeTab === "characters"
                ? "Cari nama karakter, elemen, atau kata kunci..."
                : "Cari babak quest, nama kisah, atau kata kunci..."
            }
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

        {/* Filter Khusus Tab Cerita: Kategori Quest */}
        {activeTab === "stories" && !hideTabs && (
          <div className="relative shrink-0">
            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="w-full sm:w-auto bg-scroll-800 border border-gold-300/20 focus:border-gold-300/60 rounded-xl px-4 py-2.5 text-sm text-gold-300 outline-none cursor-pointer appearance-none pr-8"
            >
              {STORY_CATEGORIES.map((c) => (
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
        )}

        {/* Filter Khusus Tab Karakter: Rarity Bintang 5★ / 4★ */}
        {activeTab === "characters" && (
          <div className="flex items-center gap-1.5 bg-scroll-800 border border-gold-300/20 p-1 rounded-xl">
            {["all", "5", "4"].map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRarity(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedRarity === r
                    ? r === "5"
                      ? "bg-amber-500/30 text-gold-300 border border-gold-400/60 shadow-sm"
                      : r === "4"
                      ? "bg-purple-500/30 text-purple-200 border border-purple-400/60 shadow-sm"
                      : "bg-celestia-700 text-gold-200 border border-gold-300/30"
                    : "text-parchment-muted hover:text-parchment"
                }`}
              >
                {r === "all" ? "Semua Bintang" : `${r}★`}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── 3. Region Filter Tabs ── */}
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

      {/* ── 4. Result Counter & Reset Filter ── */}
      <div className="flex items-center justify-between text-xs text-parchment-muted mb-6 pb-2 border-b border-gold-300/10">
        <span className="flex items-center gap-1.5">
          <BookOpen size={13} className="text-gold-300" />
          Menampilkan <span className="text-gold-200 font-semibold">{filtered.length}</span> naskah{" "}
          {activeTab === "characters" ? "biografi karakter" : "alur cerita & quest"}
        </span>
        {(activeRegion !== "Semua" || activeCategory !== "all" || selectedRarity !== "all" || searchQuery) && (
          <button
            onClick={() => {
              setActiveRegion("Semua");
              setActiveCategory("all");
              setSelectedRarity("all");
              setSearchQuery("");
            }}
            className="text-gold-300 hover:text-gold-200 hover:underline text-xs"
          >
            Reset Filter
          </button>
        )}
      </div>

      {/* ── 5. Story Cards Grid ── */}
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
