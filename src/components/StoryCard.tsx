"use client";

import Link from "next/link";
import { Clock, Headphones, BookOpen, Play, Pause } from "lucide-react";
import type { StoryMeta } from "@/types/story";
import ElementBadge from "./ElementBadge";
import { useAudio } from "@/context/AudioContext";

const CATEGORY_LABEL: Record<string, string> = {
  "archon-quest": "Archon Quest",
  "story-quest": "Story Quest",
  "world-lore": "World Lore",
  "character-backstory": "Backstory",
};

export default function StoryCard({ story }: { story: StoryMeta }) {
  const { track, isPlaying, play, togglePlay } = useAudio();
  const isThisPlaying = track?.title === story.title && isPlaying;

  const handleAudioClick = () => {
    if (track?.title === story.title) {
      togglePlay();
    } else {
      play({
        title: story.title,
        character: story.character,
        region: story.region,
        url: story.audioUrl || "",
        speechText: `${story.title}. Wilayah ${story.region}. ${
          story.character ? `Kisah ${story.character}. ` : ""
        }${story.summary}`,
        duration: story.audioDuration || "Narasi AI",
        isAiVoice: !story.audioUrl,
      });
    }
  };

  return (
    <article className="primogem-corner group relative flex flex-col bg-scroll-800 border border-gold-300/15 rounded-xl overflow-hidden hover:border-gold-300/40 transition-all duration-300 hover:glow-gold">
      {/* Top accent line colored by element */}
      <div
        className={`h-0.5 w-full ${
          story.element && story.element !== "none"
            ? `bg-${story.element === "anemo" ? "[#72E2C4]" : story.element === "geo" ? "[#E3B342]" : story.element === "electro" ? "[#C67BF2]" : story.element === "dendro" ? "[#8FD843]" : story.element === "hydro" ? "[#4CC2F8]" : story.element === "pyro" ? "[#EF7845]" : "[#9CE8FF]"}`
            : "bg-gradient-to-r from-gold-500 via-gold-300 to-gold-500"
        }`}
        style={{
          background:
            story.element === "anemo" ? "#72E2C4" :
            story.element === "geo" ? "#E3B342" :
            story.element === "electro" ? "#C67BF2" :
            story.element === "dendro" ? "#8FD843" :
            story.element === "hydro" ? "#4CC2F8" :
            story.element === "pyro" ? "#EF7845" :
            story.element === "cryo" ? "#9CE8FF" :
            "linear-gradient(to right, #B87A1E, #E5BA69, #B87A1E)",
        }}
      />

      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* Category & Region */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-parchment-muted bg-celestia-700 px-2 py-0.5 rounded-full border border-celestia-500">
            {CATEGORY_LABEL[story.category] ?? story.category}
          </span>
          <span className="text-xs text-parchment-muted">{story.region}</span>
          {story.element && story.element !== "none" && (
            <ElementBadge element={story.element} />
          )}
        </div>

        {/* Title */}
        <h3
          className="text-parchment font-semibold text-base leading-snug group-hover:text-gold-200 transition-colors"
          style={{ fontFamily: "Cinzel, Georgia, serif" }}
        >
          {story.title}
        </h3>

        {/* Character */}
        {story.character && (
          <p className="text-parchment-dim text-sm">{story.character}</p>
        )}

        {/* Summary */}
        <p className="text-parchment-muted text-sm leading-relaxed line-clamp-3 flex-1">
          {story.summary}
        </p>

        {/* Meta: time & audio */}
        <div className="flex items-center gap-3 text-parchment-muted text-xs">
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {story.readingTime}
          </span>
          <span className="flex items-center gap-1 text-anemo" title="Tersedia Mode Narator Suara AI">
            <Headphones size={12} />
            {story.audioDuration || "Audio AI"}
          </span>
        </div>

        {/* Gold divider */}
        <div className="gold-divider" />

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Link
            href={`/lore/${story.slug}`}
            className="flex-1 flex items-center justify-center gap-1.5 bg-gold-300/10 hover:bg-gold-300/20 border border-gold-300/30 hover:border-gold-300/60 text-gold-300 hover:text-gold-200 text-xs font-semibold py-2 px-3 rounded-lg transition-all"
          >
            <BookOpen size={13} />
            Baca Ringkasan
          </Link>

          {/* Tombol Audio Narator AI - Selalu Aktif */}
          <button
            onClick={handleAudioClick}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all border ${
              isThisPlaying
                ? "bg-gold-400 text-celestia-950 border-gold-300 shadow-md glow-gold font-bold"
                : "bg-celestia-700/80 hover:bg-celestia-600 border-gold-300/25 hover:border-gold-300/50 text-gold-300 hover:text-gold-200"
            }`}
            title="Dengarkan Narator AI Teyvat"
          >
            {isThisPlaying ? (
              <>
                <Pause size={13} className="text-celestia-950" />
                <span>Memutar</span>
              </>
            ) : (
              <>
                <Headphones size={13} className="text-gold-300" />
                <span>Audio AI</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
