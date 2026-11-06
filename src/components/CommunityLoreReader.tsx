"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  Share2,
  Calendar,
  User,
  Sparkles,
  BookOpen,
  Check,
  Tag,
  Headphones,
  Pause,
} from "lucide-react";
import { CommunityLore } from "@/types/community";
import { getLoreBySlug, likeLore } from "@/lib/community";
import { useAudio } from "@/context/AudioContext";
import CommentSection from "@/components/CommentSection";

interface CommunityLoreReaderProps {
  slug: string;
  initialLore?: CommunityLore | null;
}

// Helper untuk format markdown teks lore menjadi HTML yang rapi & estetik
function renderFormattedContent(content: string) {
  // Pecah per baris / blok
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let currentParagraph: string[] = [];

  const flushParagraph = (key: string) => {
    if (currentParagraph.length > 0) {
      const text = currentParagraph.join(" ");
      elements.push(
        <p key={key} className="mb-5 leading-relaxed text-parchment/90 text-base sm:text-lg">
          {formatInline(text)}
        </p>
      );
      currentParagraph = [];
    }
  };

  const formatInline = (text: string): React.ReactNode => {
    // Format bold **text** dan italic *text*
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="text-gold-200 font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("*") && part.endsWith("*")) {
        return (
          <em key={i} className="text-gold-300/90 italic">
            {part.slice(1, -1)}
          </em>
        );
      }
      return part;
    });
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    if (trimmed.startsWith("### ")) {
      flushParagraph(`p-before-${idx}`);
      elements.push(
        <h3
          key={`h3-${idx}`}
          className="text-xl sm:text-2xl font-bold text-gold-300 mt-10 mb-4 pb-2 border-b border-gold-300/20 flex items-center gap-2"
          style={{ fontFamily: "Cinzel, Georgia, serif" }}
        >
          <span className="w-1.5 h-6 bg-gold-400 rounded-full" />
          {trimmed.replace(/^###\s+/, "")}
        </h3>
      );
    } else if (trimmed.startsWith("## ")) {
      flushParagraph(`p-before-${idx}`);
      elements.push(
        <h2
          key={`h2-${idx}`}
          className="text-2xl sm:text-3xl font-bold text-gold-200 mt-12 mb-5 glow-gold-text"
          style={{ fontFamily: "Cinzel, Georgia, serif" }}
        >
          {trimmed.replace(/^##\s+/, "")}
        </h2>
      );
    } else if (trimmed.startsWith("> ")) {
      flushParagraph(`p-before-${idx}`);
      elements.push(
        <blockquote
          key={`quote-${idx}`}
          className="border-l-4 border-gold-400 pl-4 py-3 my-6 italic text-parchment-dim bg-celestia-950/80 rounded-r-xl text-base shadow-inner"
        >
          {formatInline(trimmed.replace(/^>\s+/, ""))}
        </blockquote>
      );
    } else if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
      flushParagraph(`p-before-${idx}`);
      elements.push(
        <li key={`li-${idx}`} className="ml-6 list-disc text-parchment-dim mb-2 text-base leading-relaxed">
          {formatInline(trimmed.replace(/^[\*\-]\s+/, ""))}
        </li>
      );
    } else if (/^\d+\.\s+/.test(trimmed)) {
      flushParagraph(`p-before-${idx}`);
      elements.push(
        <li key={`ol-${idx}`} className="ml-6 list-decimal text-parchment-dim mb-2 text-base leading-relaxed">
          {formatInline(trimmed.replace(/^\d+\.\s+/, ""))}
        </li>
      );
    } else if (trimmed === "") {
      flushParagraph(`p-empty-${idx}`);
    } else {
      currentParagraph.push(trimmed);
    }
  });

  flushParagraph("p-last");
  return elements;
}

export default function CommunityLoreReader({ slug, initialLore }: CommunityLoreReaderProps) {
  const [lore, setLore] = useState<CommunityLore | null>(initialLore || null);
  const [loading, setLoading] = useState(!initialLore);
  const [isLiked, setIsLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const { play, togglePlay, isPlaying, track } = useAudio();

  const isThisPlaying = Boolean(isPlaying && track?.title === lore?.title);

  const handleAudioNarration = () => {
    if (!lore) return;
    if (track?.title === lore.title) {
      togglePlay();
    } else {
      play({
        title: lore.title,
        character: lore.authorName,
        region: lore.topic,
        speechText: `${lore.title}. Topik ${lore.topic}. Disusun oleh ${lore.authorName}. ${lore.content}`,
        duration: "Narasi AI",
        isAiVoice: true,
      });
    }
  };

  useEffect(() => {
    async function load() {
      try {
        const data = await getLoreBySlug(slug);
        if (data) setLore(data);
      } catch (e) {
        console.error("Gagal load detail lore:", e);
      } finally {
        setLoading(false);
      }
    }
    load();

    // Cek status liked
    try {
      const savedLikes = localStorage.getItem("teyvat_liked_lores");
      if (savedLikes) {
        const parsed = JSON.parse(savedLikes);
        if (lore?.id && parsed[lore.id]) {
          setIsLiked(true);
        }
      }
    } catch {
      // ignore
    }
  }, [slug, lore?.id]);

  const handleLike = async () => {
    if (!lore?.id || isLiked) return;

    setIsLiked(true);
    setLore((prev) => (prev ? { ...prev, likesCount: prev.likesCount + 1 } : null));

    try {
      const savedLikes = localStorage.getItem("teyvat_liked_lores") || "{}";
      const parsed = JSON.parse(savedLikes);
      parsed[lore.id] = true;
      localStorage.setItem("teyvat_liked_lores", JSON.stringify(parsed));
      await likeLore(lore.id);
    } catch (e) {
      console.error(e);
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-parchment-muted text-sm">
        <Sparkles size={20} className="animate-spin text-gold-300 mr-2" />
        Membuka Arsip Naskah Komunitas...
      </div>
    );
  }

  if (!lore) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h1
          className="text-2xl font-bold text-parchment"
          style={{ fontFamily: "Cinzel, Georgia, serif" }}
        >
          Naskah Tidak Ditemukan
        </h1>
        <p className="text-xs text-parchment-dim">
          Naskah mungkin masih dalam antrean moderasi Admin atau tautan yang Anda buka tidak valid.
        </p>
        <Link
          href="/community"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-400 text-celestia-950 font-bold hover:bg-gold-300 text-xs transition-colors"
        >
          <ArrowLeft size={14} /> Kembali ke Community Lore
        </Link>
      </div>
    );
  }

  const wordCount = lore.content.split(/\s+/).length;
  const readingMinutes = Math.max(1, Math.ceil(wordCount / 180));

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Navigasi Kembali */}
      <Link
        href="/community"
        className="inline-flex items-center gap-2 text-sm text-parchment-dim hover:text-gold-300 transition-colors mb-8"
      >
        <ArrowLeft size={16} /> Kembali ke Koleksi Komunitas
      </Link>

      {/* Hero Header Artikel */}
      <header className="space-y-6 mb-10">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-gold-300/15 text-gold-300 border border-gold-300/30 uppercase tracking-wider">
            {lore.topic}
          </span>
          <span className="text-xs text-parchment-muted flex items-center gap-1">
            <BookOpen size={13} /> {readingMinutes} Menit Baca
          </span>
          <span className="text-xs text-parchment-muted flex items-center gap-1">
            <Calendar size={13} /> {new Date(lore.createdAt).toLocaleDateString("id-ID")}
          </span>
        </div>

        <h1
          className="text-2xl sm:text-4xl font-bold text-parchment tracking-wide leading-tight glow-gold-text"
          style={{ fontFamily: "Cinzel, Georgia, serif" }}
        >
          {lore.title}
        </h1>

        {/* Info Penulis & Tombol Aksi */}
        <div className="flex items-center justify-between flex-wrap gap-4 py-4 border-y border-gold-300/15">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold-400/15 border border-gold-400/30 flex items-center justify-center text-gold-300">
              <User size={20} />
            </div>
            <div>
              <div className="text-xs text-parchment-muted">Penyusun / Penulis:</div>
              <div className="text-sm font-semibold text-gold-200">{lore.authorName}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Tombol Audio Narator AI */}
            <button
              onClick={handleAudioNarration}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                isThisPlaying
                  ? "bg-gold-400 text-celestia-950 border-gold-300 shadow-md glow-gold font-bold animate-pulse"
                  : "bg-celestia-900/80 hover:bg-celestia-800 text-gold-300 hover:text-gold-200 border-gold-300/25 hover:border-gold-300/50"
              }`}
              title="Dengarkan Narator AI membaca naskah teori ini"
            >
              {isThisPlaying ? (
                <>
                  <Pause size={15} className="text-celestia-950" />
                  <span>Jeda Narasi</span>
                </>
              ) : (
                <>
                  <Headphones size={15} className="text-gold-300" />
                  <span>Dengarkan Narator AI</span>
                </>
              )}
            </button>

            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
                isLiked
                  ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                  : "bg-celestia-900/80 text-parchment hover:text-rose-300 border-gold-300/20 hover:border-rose-400/30"
              }`}
            >
              <Heart size={16} className={isLiked ? "fill-rose-400 text-rose-400" : ""} />
              <span>{lore.likesCount} Suka</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-celestia-900/80 text-parchment hover:text-gold-300 border border-gold-300/20 text-xs transition-colors"
            >
              {copied ? <Check size={16} className="text-emerald-400" /> : <Share2 size={16} />}
              <span>{copied ? "Tautan Tersalin!" : "Bagikan"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Gambar Sampul jika ada */}
      {lore.coverImageUrl && (
        <div className="mb-10 rounded-2xl overflow-hidden border border-gold-300/20 shadow-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lore.coverImageUrl}
            alt={lore.title}
            className="w-full max-h-[480px] object-cover"
          />
        </div>
      )}

      {/* Ringkasan Intisari */}
      {lore.summary && (
        <div className="mb-10 p-6 rounded-2xl bg-celestia-900/80 border-l-4 border-gold-400 border border-gold-300/15 shadow-lg">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gold-300 mb-2 flex items-center gap-1.5">
            <Sparkles size={14} /> Intisari & Hipotesis Utama
          </h2>
          <p className="text-sm text-parchment-dim italic leading-relaxed">{lore.summary}</p>
        </div>
      )}

      {/* Naskah Cerita Lengkap Berformat */}
      <div className="prose-teyvat text-parchment/90 leading-relaxed text-base">
        {renderFormattedContent(lore.content)}
      </div>

      {/* Tagar */}
      {lore.tags && lore.tags.length > 0 && (
        <div className="mt-12 pt-6 border-t border-gold-300/10 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-parchment-muted flex items-center gap-1">
            <Tag size={13} className="text-gold-300" /> Topik Terkait:
          </span>
          {lore.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-3 py-1 rounded-full bg-celestia-900 border border-gold-300/15 text-parchment-dim"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer Ajakan Berdiskusi */}
      <div className="mt-16 p-8 rounded-3xl bg-celestia-900/80 border border-gold-300/20 text-center space-y-4">
        <Sparkles className="mx-auto text-gold-300" size={24} />
        <h3
          className="text-xl font-bold text-parchment"
          style={{ fontFamily: "Cinzel, Georgia, serif" }}
        >
          Punya Bukti atau Teori Tambahan?
        </h3>
        <p className="text-xs text-parchment-dim max-w-md mx-auto leading-relaxed">
          Tuliskan analisis, sanggahan, atau temuan barumu dari eksplorasi Teyvat ke dalam arsip komunitas!
        </p>
        <Link
          href="/buat-lore"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gold-400 text-celestia-950 font-bold hover:bg-gold-300 text-xs transition-colors shadow-lg shadow-gold-400/20"
        >
          Tulis Naskah Teori Baru
        </Link>
      </div>

      {/* Kolom Komentar & Diskusi Komunitas */}
      <CommentSection storySlug={slug} storyTitle={lore.title} />
    </article>
  );
}
