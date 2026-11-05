"use client";

import { useState } from "react";
import type { StoryFull } from "@/types/story";
import ElementBadge from "@/components/ElementBadge";
import { useAudio } from "@/context/AudioContext";
import {
  Clock, Headphones, Play, ChevronLeft, Zap, BookOpen,
} from "lucide-react";
import Link from "next/link";

type Mode = "ringkas" | "narasi";

export default function StoryReader({ story }: { story: StoryFull }) {
  const [mode, setMode] = useState<Mode>("narasi");
  const { play, isPlaying, track } = useAudio();

  const isThisPlaying = isPlaying && track?.url === story.audioUrl;

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-parchment-muted hover:text-gold-300 text-sm transition-colors mb-8"
      >
        <ChevronLeft size={16} />
        Kembali ke Arsip
      </Link>

      {/* Header */}
      <header className="mb-10">
        <div className="flex flex-wrap gap-2 items-center mb-4">
          <span className="text-xs text-parchment-muted bg-celestia-700 border border-celestia-500 px-2 py-0.5 rounded-full">
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

        {/* Summary box */}
        <div className="bg-scroll-800 border border-gold-300/15 rounded-xl p-5 mb-6 primogem-corner">
          <p className="text-xs text-gold-300/70 tracking-widest uppercase mb-2">Intisari Singkat</p>
          <p className="text-parchment-dim leading-relaxed italic">{story.summary}</p>
        </div>

        {/* Meta & Audio */}
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1.5 text-parchment-muted text-sm">
            <Clock size={14} />
            {story.readingTime} baca
          </span>
          {story.audioDuration && (
            <span className="flex items-center gap-1.5 text-parchment-muted text-sm">
              <Headphones size={14} />
              {story.audioDuration} audio
            </span>
          )}

          {story.audioUrl && (
            <button
              onClick={() =>
                play({
                  title: story.title,
                  character: story.character,
                  region: story.region,
                  url: story.audioUrl!,
                  duration: story.audioDuration,
                })
              }
              className={`flex items-center gap-2 text-sm font-semibold px-5 py-2 rounded-full transition-all ${
                isThisPlaying
                  ? "bg-gold-300 text-celestia-900"
                  : "bg-gold-300/15 border border-gold-300/40 text-gold-300 hover:bg-gold-300/25"
              }`}
            >
              <Play size={14} />
              {isThisPlaying ? "Sedang Diputar" : "Putar Audio"}
            </button>
          )}
        </div>
      </header>

      {/* Gold divider */}
      <div className="gold-divider mb-8" />

      {/* Mode Toggle */}
      <div className="flex gap-2 mb-8 p-1 bg-celestia-800 rounded-xl w-fit">
        {(["ringkas", "narasi"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg transition-all font-medium ${
              mode === m
                ? "bg-gold-300/20 text-gold-200 border border-gold-300/40"
                : "text-parchment-muted hover:text-parchment"
            }`}
          >
            {m === "ringkas" ? <Zap size={14} /> : <BookOpen size={14} />}
            {m === "ringkas" ? "Mode Intisari" : "Mode Narasi Lengkap"}
          </button>
        ))}
      </div>

      {/* Reading Callout */}
      {mode === "ringkas" && (
        <div className="bg-gold-300/5 border border-gold-300/20 rounded-xl p-4 mb-8 flex items-start gap-3">
          <Zap className="text-gold-300 shrink-0 mt-0.5" size={16} />
          <p className="text-parchment-dim text-sm">
            <span className="text-gold-300 font-semibold">Mode Intisari:</span>{" "}
            Hanya poin-poin krusial untuk kilas balik cepat. Cocok jika sudah pernah membaca sebelumnya.
          </p>
        </div>
      )}

      {/* Content */}
      <div
        className="prose-teyvat"
        dangerouslySetInnerHTML={{ __html: story.contentHtml }}
      />

      {/* Back bottom */}
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

