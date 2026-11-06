"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Heart,
  PlusCircle,
  Search,
  BookOpen,
  ArrowRight,
  RefreshCw,
  Compass,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { getApprovedLores, likeLore } from "@/lib/community";
import { CommunityLore } from "@/types/community";
import communityTheories from "@/data/community-theories.json";

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<"theories" | "community">("theories");

  // State Karya Pengelana (Firestore / User Submissions)
  const [lores, setLores] = useState<CommunityLore[]>([]);
  const [loadingLores, setLoadingLores] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("Semua");
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  // State Teori Komunitas Global (JSON)
  const [theories] = useState<CommunityLore[]>(
    communityTheories.map((t, idx) => ({
      id: t.id,
      title: t.title,
      slug: t.slug,
      authorName: t.authorName,
      topic: t.topic,
      summary: t.summary,
      content: t.content,
      coverImageUrl: t.coverImageUrl,
      tags: t.tags,
      likesCount: t.likesCount,
      status: "approved" as const,
      createdAt: Date.now() - 86400000 * (idx + 1),
    }))
  );
  const [theorySearch, setTheorySearch] = useState("");
  const [theoryTopic, setTheoryTopic] = useState("Semua");

  // Load karya komunitas pengguna
  useEffect(() => {
    async function load() {
      try {
        const data = await getApprovedLores();
        setLores(data);
      } catch (err) {
        console.error("Gagal memuat lore komunitas:", err);
      } finally {
        setLoadingLores(false);
      }
    }
    load();

    // Load status like dari localStorage
    try {
      const savedLikes = localStorage.getItem("teyvat_liked_lores");
      if (savedLikes) {
        setLikedMap(JSON.parse(savedLikes));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleLike = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (likedMap[id]) return;

    setLores((prev) =>
      prev.map((item) => (item.id === id ? { ...item, likesCount: item.likesCount + 1 } : item))
    );

    const newLikedMap = { ...likedMap, [id]: true };
    setLikedMap(newLikedMap);
    localStorage.setItem("teyvat_liked_lores", JSON.stringify(newLikedMap));

    try {
      await likeLore(id);
    } catch (err) {
      console.error("Gagal update like di server:", err);
    }
  };

  // Topik unik karya lokal
  const localTopics = ["Semua", ...Array.from(new Set(lores.map((l) => l.topic).filter(Boolean)))];

  // Topik unik teori global
  const theoryTopics = ["Semua", ...Array.from(new Set(theories.map((t) => t.topic).filter(Boolean)))];

  // Filter karya komunitas lokal
  const filteredLores = lores.filter((item) => {
    const matchSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.topic.toLowerCase().includes(searchQuery.toLowerCase());

    const matchTopic = selectedTopic === "Semua" || item.topic === selectedTopic;
    return matchSearch && matchTopic;
  });

  // Filter teori komunitas global
  const filteredTheories = theories.filter((item) => {
    const matchSearch =
      item.title.toLowerCase().includes(theorySearch.toLowerCase()) ||
      item.summary.toLowerCase().includes(theorySearch.toLowerCase()) ||
      item.authorName.toLowerCase().includes(theorySearch.toLowerCase()) ||
      item.topic.toLowerCase().includes(theorySearch.toLowerCase()) ||
      (item.tags && item.tags.some((tag) => tag.toLowerCase().includes(theorySearch.toLowerCase())));

    const matchTopic = theoryTopic === "Semua" || item.topic === theoryTopic;
    return matchSearch && matchTopic;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Banner */}
      <div className="relative mb-10 p-8 sm:p-12 rounded-3xl bg-celestia-900/80 border border-gold-300/20 backdrop-blur-md overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-300/5 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-300/10 border border-gold-300/20 text-gold-300 text-xs font-semibold tracking-wider uppercase">
            <Users size={14} /> Komunitas & Arsip Teori Teyvat
          </div>
          <h1
            className="text-3xl sm:text-4xl font-bold text-parchment tracking-wide"
            style={{ fontFamily: "Cinzel, Georgia, serif" }}
          >
            Arsip Teori & Komunitas Teyvat
          </h1>
          <p className="text-sm text-parchment-dim leading-relaxed">
            Tempat berkumpulnya para pengelana untuk menyusun hipotesis, mengulik sejarah bangsa
            kuno yang tenggelam, serta membaca naskah analisis teori terlengkap dari komunitas.
          </p>
        </div>

        <Link
          href="/buat-lore"
          className="shrink-0 px-6 py-3.5 rounded-2xl bg-gold-400 text-celestia-950 font-bold hover:bg-gold-300 transition-all text-sm shadow-xl shadow-gold-400/20 flex items-center gap-2 group"
        >
          <PlusCircle size={18} className="group-hover:rotate-90 transition-transform duration-300" />
          <span>Tulis Lore Kamu</span>
        </Link>
      </div>

      {/* Navigasi Tab */}
      <div className="flex items-center justify-between border-b border-gold-300/15 mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab("theories")}
            className={`flex items-center gap-2 pb-3 px-2 text-sm font-semibold tracking-wide border-b-2 transition-all ${
              activeTab === "theories"
                ? "border-gold-300 text-gold-300"
                : "border-transparent text-parchment-dim hover:text-parchment"
            }`}
          >
            <Compass size={18} className="text-gold-300" />
            <span>Koleksi Teori Komunitas ({theories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("community")}
            className={`flex items-center gap-2 pb-3 px-2 text-sm font-semibold tracking-wide border-b-2 transition-all ${
              activeTab === "community"
                ? "border-gold-300 text-gold-300"
                : "border-transparent text-parchment-dim hover:text-parchment"
            }`}
          >
            <BookOpen size={18} />
            <span>Karya Pengelana Lokal ({lores.length})</span>
          </button>
        </div>

        {/* Kolom Pencarian */}
        <div className="relative w-full sm:w-64 pb-3">
          <Search
            size={15}
            className="absolute left-3 top-2.5 text-parchment-muted pointer-events-none"
          />
          <input
            type="text"
            value={activeTab === "theories" ? theorySearch : searchQuery}
            onChange={(e) =>
              activeTab === "theories" ? setTheorySearch(e.target.value) : setSearchQuery(e.target.value)
            }
            placeholder="Cari naskah atau topik..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-celestia-900 border border-gold-300/20 text-parchment text-xs placeholder-parchment-muted/50 focus:outline-none focus:border-gold-300"
          />
        </div>
      </div>

      {/* Konten Tab 1: Koleksi Teori Komunitas Global (Klik Menuju Naskah Penuh) */}
      {activeTab === "theories" && (
        <div className="space-y-6">
          {/* Filter Topik Teori */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <span className="text-xs text-parchment-muted shrink-0">Topik:</span>
            {theoryTopics.map((t) => (
              <button
                key={t}
                onClick={() => setTheoryTopic(t)}
                className={`px-3 py-1 rounded-full text-xs shrink-0 transition-colors border ${
                  theoryTopic === t
                    ? "bg-gold-300/20 text-gold-300 border-gold-300/40"
                    : "bg-celestia-900/60 text-parchment-dim border-gold-300/10 hover:text-parchment"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTheories.map((theory) => (
              <Link
                key={theory.slug}
                href={`/community/${theory.slug}`}
                className="group flex flex-col justify-between rounded-2xl bg-celestia-900/60 border border-gold-300/15 hover:border-gold-300/45 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-gold-300/10"
              >
                {/* Sampul Gambar */}
                {theory.coverImageUrl && (
                  <div className="relative h-48 w-full overflow-hidden bg-celestia-950">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={theory.coverImageUrl}
                      alt={theory.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-celestia-900 via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold bg-celestia-950/85 backdrop-blur-md text-gold-300 border border-gold-300/30 uppercase tracking-wider">
                      {theory.topic}
                    </span>
                  </div>
                )}

                {/* Konten Card */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h2
                      className="text-lg font-bold text-parchment group-hover:text-gold-200 transition-colors line-clamp-2 leading-snug"
                      style={{ fontFamily: "Cinzel, Georgia, serif" }}
                    >
                      {theory.title}
                    </h2>
                    <p className="text-xs text-parchment-dim line-clamp-3 leading-relaxed">
                      {theory.summary}
                    </p>
                  </div>

                  {/* Footer Card */}
                  <div className="pt-4 mt-5 border-t border-gold-300/10 flex items-center justify-between text-xs text-parchment-muted">
                    <div className="flex items-center gap-1.5">
                      <span className="text-parchment-muted">Penyusun:</span>
                      <span className="text-gold-300 font-medium truncate max-w-[110px]">
                        {theory.authorName}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-rose-300/90">
                        <Heart size={13} className="fill-rose-400/40" />
                        <span>{theory.likesCount}</span>
                      </span>
                      <span className="text-xs text-gold-300 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        Baca <ArrowRight size={13} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Konten Tab 2: Karya Pengelana Lokal */}
      {activeTab === "community" && (
        <div className="space-y-6">
          {/* Filter Topik */}
          {localTopics.length > 2 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <span className="text-xs text-parchment-muted shrink-0">Topik:</span>
              {localTopics.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTopic(t)}
                  className={`px-3 py-1 rounded-full text-xs shrink-0 transition-colors border ${
                    selectedTopic === t
                      ? "bg-gold-300/20 text-gold-300 border-gold-300/40"
                      : "bg-celestia-900/60 text-parchment-dim border-gold-300/10 hover:text-parchment"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}

          {loadingLores ? (
            <div className="text-center py-20 text-parchment-muted text-sm flex items-center justify-center gap-2">
              <RefreshCw size={18} className="animate-spin text-gold-300" />
              Menghubungkan ke Arsip Komunitas...
            </div>
          ) : filteredLores.length === 0 ? (
            <div className="text-center py-16 p-8 rounded-3xl bg-celestia-900/40 border border-gold-300/10 space-y-3">
              <p className="text-base text-parchment font-semibold">Belum Ada Lore Pengguna yang Diterbitkan</p>
              <p className="text-xs text-parchment-dim max-w-md mx-auto leading-relaxed">
                Jadilah pengelana pertama yang membagikan naskah atau teorimu ke dalam arsip Teyvat!
              </p>
              <Link
                href="/buat-lore"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gold-400 text-celestia-950 font-bold hover:bg-gold-300 text-xs transition-colors shadow-lg shadow-gold-400/20"
              >
                <PlusCircle size={15} /> Buat Lore Pertama
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLores.map((item) => {
                const isLiked = Boolean(likedMap[item.id!]);
                return (
                  <Link
                    key={item.id}
                    href={`/community/${item.slug}`}
                    className="group flex flex-col justify-between rounded-2xl bg-celestia-900/60 border border-gold-300/15 hover:border-gold-300/40 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-gold-300/5"
                  >
                    {item.coverImageUrl ? (
                      <div className="relative h-44 w-full overflow-hidden bg-celestia-950">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.coverImageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-celestia-900 via-transparent to-transparent" />
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold bg-celestia-950/85 backdrop-blur-md text-gold-300 border border-gold-300/30 uppercase tracking-wider">
                          {item.topic}
                        </span>
                      </div>
                    ) : (
                      <div className="p-5 pb-0">
                        <span className="inline-block px-2.5 py-1 rounded-md text-[10px] font-bold bg-gold-300/15 text-gold-300 border border-gold-300/30 uppercase tracking-wider">
                          {item.topic}
                        </span>
                      </div>
                    )}

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <h2
                          className="text-base font-bold text-parchment group-hover:text-gold-200 transition-colors line-clamp-2 leading-snug"
                          style={{ fontFamily: "Cinzel, Georgia, serif" }}
                        >
                          {item.title}
                        </h2>
                        <p className="text-xs text-parchment-dim line-clamp-3 leading-relaxed">
                          {item.summary}
                        </p>
                      </div>

                      <div className="pt-4 mt-4 border-t border-gold-300/10 flex items-center justify-between text-xs text-parchment-muted">
                        <div className="flex items-center gap-1.5">
                          <span className="text-parchment-dim">Oleh</span>
                          <span className="text-gold-300 font-medium truncate max-w-[100px]">
                            {item.authorName}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={(e) => handleLike(e, item.id!)}
                            className={`flex items-center gap-1 transition-colors ${
                              isLiked ? "text-rose-400 font-bold" : "hover:text-rose-400"
                            }`}
                            title="Suka tulisan ini"
                          >
                            <Heart size={14} className={isLiked ? "fill-rose-400" : ""} />
                            <span>{item.likesCount}</span>
                          </button>

                          <span className="text-gold-300 group-hover:translate-x-0.5 transition-transform">
                            <ArrowRight size={14} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
