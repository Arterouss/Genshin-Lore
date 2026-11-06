"use client";

import { useState } from "react";
import type { StoryFull } from "@/types/story";
import ElementBadge from "@/components/ElementBadge";
import { useAudio } from "@/context/AudioContext";
import {
  Clock,
  Headphones,
  Pause,
  ChevronLeft,
  Zap,
  BookOpen,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

type Mode = "ringkas" | "narasi";

export default function StoryReader({ story }: { story: StoryFull }) {
  const [mode, setMode] = useState<Mode>("narasi");
  const { play, togglePlay, isPlaying, track } = useAudio();

  const isThisPlaying = isPlaying && track?.title === story.title;

  const handlePlayAudio = () => {
    if (track?.title === story.title) {
      togglePlay();
    } else {
      // Bersihkan teks HTML agar dibacakan dengan alami oleh Narator AI
      const cleanNarrative = story.contentHtml
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      const textToNarrate =
        mode === "ringkas"
          ? `${story.title}. Cerita wilayah ${story.region}. ${
              story.character ? `Membahas ${story.character}. ` : ""
            }Intisari: ${story.summary}`
          : `${story.title}. Kisah dari wilayah ${story.region}. ${
              story.character ? `Membahas karakter ${story.character}. ` : ""
            }${cleanNarrative}`;

      play({
        title: story.title,
        character: story.character,
        region: story.region,
        url: story.audioUrl || "",
        speechText: textToNarrate,
        duration: story.audioDuration || (mode === "ringkas" ? "Intisari AI" : "Narasi Penuh AI"),
        isAiVoice: !story.audioUrl,
      });
    }
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Tombol Navigasi Kembali */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-parchment-muted hover:text-gold-300 text-sm transition-colors mb-8"
      >
        <ChevronLeft size={16} />
        Kembali ke Arsip Teyvat
      </Link>

      {/* Header Cerita */}
      <header className="mb-10">
        <div className="flex flex-wrap gap-2 items-center mb-4">
          <span className="text-xs text-parchment-muted bg-celestia-700 border border-celestia-500 px-2.5 py-0.5 rounded-full">
            {story.region}
          </span>
          {story.element && story.element !== "none" && (
            <ElementBadge element={story.element} />
          )}
        </div>

        <h1
          className="text-2xl sm:text-4xl font-bold text-gold-200 leading-tight mb-4 glow-gold-text"
          style={{ fontFamily: "Cinzel, Georgia, serif" }}
        >
          {story.title}
        </h1>

        {story.character && (
          <p className="text-parchment-dim text-lg mb-4">{story.character}</p>
        )}

        {/* Kotak Ringkasan Intisari */}
        <div className="bg-scroll-800 border border-gold-300/15 rounded-xl p-5 mb-6 primogem-corner">
          <p className="text-xs text-gold-300/70 tracking-widest uppercase mb-2 font-bold flex items-center gap-1.5">
            <Sparkles size={12} className="text-gold-300" /> Intisari Singkat
          </p>
          <p className="text-parchment-dim leading-relaxed italic">{story.summary}</p>
        </div>

        {/* Bar Metadata & Tombol Audio AI Utama */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-gold-300/15">
          <div className="flex items-center gap-4 text-parchment-muted text-sm">
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {story.readingTime} baca
            </span>
            <span className="flex items-center gap-1.5 text-anemo" title="Mendukung Narator AI Suara">
              <Headphones size={14} />
              {story.audioDuration || "Audio Narator AI"}
            </span>
          </div>

          {/* Tombol Audio Narator AI - Selalu Tampil & Berfungsi */}
          <button
            onClick={handlePlayAudio}
            className={`flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full transition-all shadow-lg ${
              isThisPlaying
                ? "bg-gradient-to-r from-gold-400 to-gold-200 text-celestia-950 font-bold glow-gold animate-pulse"
                : "bg-gold-300/15 border border-gold-300/40 text-gold-300 hover:bg-gold-300/25 hover:border-gold-300/60"
            }`}
            title="Dengarkan Narator AI Suara membacakan kisah ini"
          >
            {isThisPlaying ? (
              <>
                <Pause size={15} className="text-celestia-950" />
                <span>Sedang Dinarasikan (Jeda)</span>
              </>
            ) : (
              <>
                <Headphones size={15} className="text-gold-300" />
                <span>Dengarkan Narator AI</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Pembatas Emas */}
      <div className="gold-divider mb-8" />

      {/* Mode Toggle & Tombol Narasi Suara Cepat */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <div className="flex gap-2 p-1 bg-celestia-800 rounded-xl w-fit border border-gold-300/15">
          {(["ringkas", "narasi"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg transition-all font-medium ${
                mode === m
                  ? "bg-gold-300/20 text-gold-200 border border-gold-300/40 shadow-sm"
                  : "text-parchment-muted hover:text-parchment"
              }`}
            >
              {m === "ringkas" ? <Zap size={14} /> : <BookOpen size={14} />}
              {m === "ringkas" ? "Mode Intisari" : "Mode Narasi Lengkap"}
            </button>
          ))}
        </div>

        <button
          onClick={handlePlayAudio}
          className={`flex items-center gap-2 text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl transition-all border ${
            isThisPlaying
              ? "bg-gold-400 text-celestia-950 border-gold-300 glow-gold"
              : "bg-celestia-800/90 hover:bg-celestia-700 text-gold-300 border-gold-300/30 hover:border-gold-300/50"
          }`}
          title="Putar naskah sesuai pilihan mode saat ini"
        >
          <Sparkles size={14} className={isThisPlaying ? "animate-spin text-celestia-950" : "text-gold-300"} />
          <span>
            {isThisPlaying
              ? "Jeda Narasi AI"
              : mode === "ringkas"
              ? "Dengarkan Intisari AI"
              : "Dengarkan Cerita Lengkap AI"}
          </span>
        </button>
      </div>

      {/* Callout Penjelasan Mode */}
      {mode === "ringkas" ? (
        <div className="bg-gold-300/5 border border-gold-300/20 rounded-xl p-4 mb-8 flex items-start gap-3">
          <Zap className="text-gold-300 shrink-0 mt-0.5" size={16} />
          <p className="text-parchment-dim text-sm">
            <span className="text-gold-300 font-semibold">Mode Intisari:</span> Poin-poin krusial
            untuk kilas balik cepat. Anda juga bisa menekan tombol audio di atas untuk mendengarkan rangkuman ini secara bersuara.
          </p>
        </div>
      ) : (
        <div className="bg-celestia-800/50 border border-gold-300/10 rounded-xl p-4 mb-8 flex items-start gap-3">
          <BookOpen className="text-gold-300 shrink-0 mt-0.5" size={16} />
          <p className="text-parchment-dim text-sm">
            <span className="text-gold-300 font-semibold">Mode Narasi Lengkap:</span> Menyajikan
            seluruh babak naskah Teyvat dari awal hingga akhir.
          </p>
        </div>
      )}

      {/* Konten Naskah Cerita */}
      <div
        className="prose-teyvat leading-relaxed"
        dangerouslySetInnerHTML={{ __html: story.contentHtml }}
      />

      {/* Tombol Kembali di Bagian Bawah */}
      <div className="mt-16 pt-8 border-t border-gold-300/10 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-parchment-muted hover:text-gold-300 text-sm transition-colors"
        >
          <ChevronLeft size={16} />
          Kembali ke Arsip Teyvat
        </Link>
      </div>
    </article>
  );
}
