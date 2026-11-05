"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Users,
  MessageSquare,
  Heart,
  ExternalLink,
  PlusCircle,
  Search,
  Flame,
  BookOpen,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { getApprovedLores, likeLore } from "@/lib/community";
import { CommunityLore, RedditPost } from "@/types/community";

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<"community" | "reddit">("community");

  // State Karya Komunitas
  const [lores, setLores] = useState<CommunityLore[]>([]);
  const [loadingLores, setLoadingLores] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("Semua");
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  // State Reddit Tren
  const [redditPosts, setRedditPosts] = useState<RedditPost[]>([]);
  const [loadingReddit, setLoadingReddit] = useState(false);
  const [redditError, setRedditError] = useState("");

  // Load karya komunitas
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

  // Fetch Reddit ketika tab Reddit dipilih
  useEffect(() => {
    if (activeTab === "reddit" && redditPosts.length === 0) {
      fetchReddit();
    }
  }, [activeTab]);

  const fetchReddit = async () => {
    setLoadingReddit(true);
    setRedditError("");
    try {
      const res = await fetch("https://www.reddit.com/r/Genshin_Lore/hot.json?limit=25");
      if (!res.ok) throw new Error("Gagal mengambil data dari Reddit");
      const json = await res.json();
      const posts: RedditPost[] = json.data.children
        .filter((child: { data: { stickied: boolean } }) => !child.data.stickied)
        .map((child: { data: RedditPost }) => child.data);
      setRedditPosts(posts);
    } catch (err) {
      console.error(err);
      setRedditError(
        "Koneksi ke Reddit r/Genshin_Lore terhambat. Pastikan jaringan internet Anda stabil atau tidak terblokir firewall."
      );
    } finally {
      setLoadingReddit(false);
    }
  };

  const handleLike = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (likedMap[id]) return; // Sudah like

    // Optimistic update
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

  // Dapatkan daftar topik unik
  const topics = ["Semua", ...Array.from(new Set(lores.map((l) => l.topic).filter(Boolean)))];

  // Filter karya komunitas
  const filteredLores = lores.filter((item) => {
    const matchSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.topic.toLowerCase().includes(searchQuery.toLowerCase());

    const matchTopic = selectedTopic === "Semua" || item.topic === selectedTopic;
    return matchSearch && matchTopic;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Banner */}
      <div className="relative mb-10 p-8 sm:p-12 rounded-3xl bg-celestia-900/80 border border-gold-300/20 backdrop-blur-md overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-300/5 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-300/10 border border-gold-300/20 text-gold-300 text-xs font-semibold tracking-wider uppercase">
            <Users size={14} /> Komunitas & Diskusi Teori
          </div>
          <h1
            className="text-3xl sm:text-4xl font-bold text-parchment tracking-wide"
            style={{ fontFamily: "Cinzel, Georgia, serif" }}
          >
            Arsip Teori & Komunitas Teyvat
          </h1>
          <p className="text-sm text-parchment-dim leading-relaxed">
            Tempat berkumpulnya para pengelana untuk menyusun hipotesis, mengulik sejarah bangsa
            kuno yang tenggelam, hingga menyimak obrolan teori paling hangat di komunitas global.
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
            onClick={() => setActiveTab("community")}
            className={`flex items-center gap-2 pb-3 px-2 text-sm font-semibold tracking-wide border-b-2 transition-all ${
              activeTab === "community"
                ? "border-gold-300 text-gold-300"
                : "border-transparent text-parchment-dim hover:text-parchment"
            }`}
          >
            <BookOpen size={18} />
            <span>Karya Pengelana ({lores.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("reddit")}
            className={`flex items-center gap-2 pb-3 px-2 text-sm font-semibold tracking-wide border-b-2 transition-all ${
              activeTab === "reddit"
                ? "border-gold-300 text-gold-300"
                : "border-transparent text-parchment-dim hover:text-parchment"
            }`}
          >
            <Flame size={18} className="text-orange-400" />
            <span>Tren Global (r/Genshin_Lore)</span>
          </button>
        </div>

        {activeTab === "community" && (
          <div className="relative w-full sm:w-64 pb-3">
            <Search
              size={15}
              className="absolute left-3 top-2.5 text-parchment-muted pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari naskah atau topik..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-celestia-900 border border-gold-300/20 text-parchment text-xs placeholder-parchment-muted/50 focus:outline-none focus:border-gold-300"
            />
          </div>
        )}
      </div>

      {/* Konten Tab 1: Karya Komunitas */}
      {activeTab === "community" && (
        <div className="space-y-6">
          {/* Filter Topik */}
          {topics.length > 2 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <span className="text-xs text-parchment-muted shrink-0">Topik:</span>
              {topics.map((t) => (
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
              <p className="text-base text-parchment font-semibold">Belum Ada Lore yang Ditemukan</p>
              <p className="text-xs text-parchment-dim max-w-md mx-auto">
                Jadilah pengelana pertama yang membagikan teori atau ceritamu kepada komunitas!
              </p>
              <Link
                href="/buat-lore"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gold-400 text-celestia-950 font-bold hover:bg-gold-300 text-xs transition-colors"
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
                    className="group flex flex-col justify-between rounded-2xl bg-celestia-900/60 border border-gold-300/15 hover:border-gold-300/40 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-gold-300/5"
                  >
                    {/* Sampul Gambar jika ada */}
                    {item.coverImageUrl ? (
                      <div className="relative h-44 w-full overflow-hidden bg-celestia-950">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.coverImageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-celestia-900 via-transparent to-transparent" />
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold bg-celestia-950/80 backdrop-blur-md text-gold-300 border border-gold-300/30 uppercase tracking-wider">
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

                    {/* Konten Card */}
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

                      {/* Footer Card */}
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

      {/* Konten Tab 2: Tren Reddit r/Genshin_Lore */}
      {activeTab === "reddit" && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-orange-950/20 border border-orange-500/20 text-xs text-orange-200/90 flex items-center justify-between flex-wrap gap-2">
            <span>
              🔥 Diambil langsung dari komunitas teori terbesar di dunia:{" "}
              <strong className="text-orange-400">r/Genshin_Lore</strong> (Reddit).
            </span>
            <button
              onClick={fetchReddit}
              disabled={loadingReddit}
              className="flex items-center gap-1 px-3 py-1 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/30 transition-colors"
            >
              <RefreshCw size={12} className={loadingReddit ? "animate-spin" : ""} />
              Segarkan Feed
            </button>
          </div>

          {loadingReddit ? (
            <div className="text-center py-20 text-parchment-muted text-sm flex items-center justify-center gap-2">
              <RefreshCw size={18} className="animate-spin text-orange-400" />
              Menghubungkan ke Reddit r/Genshin_Lore...
            </div>
          ) : redditError ? (
            <div className="text-center py-16 p-8 rounded-3xl bg-celestia-900/40 border border-rose-500/20 text-rose-300 text-xs space-y-3">
              <p>{redditError}</p>
              <button
                onClick={fetchReddit}
                className="px-4 py-2 rounded-xl bg-celestia-800 text-parchment border border-gold-300/20 hover:border-gold-300/40"
              >
                Coba Lagi
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {redditPosts.map((post) => (
                <a
                  key={post.id}
                  href={`https://reddit.com${post.permalink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-5 sm:p-6 rounded-2xl bg-celestia-900/60 border border-gold-300/10 hover:border-orange-500/40 transition-all hover:-translate-y-0.5 group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {post.link_flair_text && (
                          <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold bg-orange-500/15 text-orange-300 border border-orange-500/30">
                            {post.link_flair_text}
                          </span>
                        )}
                        <span className="text-xs text-parchment-muted">
                          Diposting oleh u/{post.author}
                        </span>
                      </div>

                      <h2 className="text-base font-semibold text-parchment group-hover:text-orange-300 transition-colors leading-snug">
                        {post.title}
                      </h2>

                      {post.selftext && (
                        <p className="text-xs text-parchment-dim line-clamp-2 leading-relaxed">
                          {post.selftext}
                        </p>
                      )}
                    </div>

                    <div className="shrink-0 p-2 text-parchment-muted group-hover:text-orange-400 transition-colors">
                      <ExternalLink size={18} />
                    </div>
                  </div>

                  {/* Footer Metrics */}
                  <div className="mt-4 pt-3 border-t border-gold-300/10 flex items-center gap-4 text-xs text-parchment-muted">
                    <span className="flex items-center gap-1.5 text-orange-400 font-semibold">
                      ▲ {post.ups.toLocaleString()} Upvotes
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MessageSquare size={13} /> {post.num_comments} Komentar
                    </span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
