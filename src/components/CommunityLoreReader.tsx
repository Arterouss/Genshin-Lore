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
} from "lucide-react";
import { CommunityLore } from "@/types/community";
import { getLoreBySlug, likeLore } from "@/lib/community";

interface CommunityLoreReaderProps {
  slug: string;
  initialLore?: CommunityLore | null;
}

export default function CommunityLoreReader({ slug, initialLore }: CommunityLoreReaderProps) {
  const [lore, setLore] = useState<CommunityLore | null>(initialLore || null);
  const [loading, setLoading] = useState(!initialLore);
  const [isLiked, setIsLiked] = useState(false);
  const [copied, setCopied] = useState(false);

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
        Membuka Arsip Komunitas...
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

  // Hitung estimasi waktu baca (rata-rata 200 kata/menit)
  const wordCount = lore.content.split(/\s+/).length;
  const readingMinutes = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Navigasi Kembali */}
      <Link
        href="/community"
        className="inline-flex items-center gap-2 text-sm text-parchment-dim hover:text-gold-300 transition-colors mb-8"
      >
        <ArrowLeft size={16} /> Kembali ke Daftar Komunitas
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
          className="text-2xl sm:text-4xl font-bold text-parchment tracking-wide leading-tight"
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
              <div className="text-xs text-parchment-muted">Ditulis oleh:</div>
              <div className="text-sm font-semibold text-gold-200">{lore.authorName}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
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
        <div className="mb-10 p-6 rounded-2xl bg-celestia-900/60 border-l-4 border-gold-400 border border-gold-300/10">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gold-300 mb-2">
            Intisari Teori
          </h2>
          <p className="text-sm text-parchment-dim italic leading-relaxed">{lore.summary}</p>
        </div>
      )}

      {/* Naskah Cerita */}
      <div className="prose-teyvat text-parchment/90 leading-relaxed text-base whitespace-pre-wrap">
        {lore.content}
      </div>

      {/* Tagar */}
      {lore.tags && lore.tags.length > 0 && (
        <div className="mt-12 pt-6 border-t border-gold-300/10 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-parchment-muted">Topik Terkait:</span>
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

      {/* Footer Ajakan */}
      <div className="mt-16 p-8 rounded-3xl bg-celestia-900/80 border border-gold-300/20 text-center space-y-3">
        <Sparkles className="mx-auto text-gold-300" size={24} />
        <h3
          className="text-xl font-bold text-parchment"
          style={{ fontFamily: "Cinzel, Georgia, serif" }}
        >
          Punya Pandangan Lain Mengenai Teori Ini?
        </h3>
        <p className="text-xs text-parchment-dim max-w-md mx-auto">
          Tulis naskah tandinganmu atau buat arsip lore baru untuk memperkaya perpustakaan Teyvat!
        </p>
        <Link
          href="/buat-lore"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gold-400 text-celestia-950 font-bold hover:bg-gold-300 text-xs transition-colors shadow-lg shadow-gold-400/20"
        >
          Tulis Postingan Sekarang
        </Link>
      </div>
    </article>
  );
}

