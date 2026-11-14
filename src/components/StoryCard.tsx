"use client";

import Link from "next/link";
import { Clock, Headphones, BookOpen, Pause, Volume2, Scroll, Compass } from "lucide-react";
import type { StoryMeta } from "@/types/story";
import ElementBadge from "./ElementBadge";
import { useAudio } from "@/context/AudioContext";

const CATEGORY_LABEL: Record<string, string> = {
  "archon-quest": "Archon Quest",
  "story-quest": "Story Quest",
  "world-lore": "World Lore",
  "character-backstory": "Biografi Karakter",
};

export default function StoryCard({ story }: { story: StoryMeta }) {
  const { track, isPlaying, play, togglePlay } = useAudio();
  const isThisPlaying =
    isPlaying &&
    (Boolean(story.audioUrl && track?.url === story.audioUrl) ||
      Boolean(track?.title?.includes(story.title)));

  const handleAudioClick = () => {
    if (isThisPlaying) {
      togglePlay();
    } else if (story.audioUrl) {
      // Putar rekaman suara resmi karakter
      play({
        title: `${story.character || story.title} (Suara Karakter)`,
        character: story.character,
        region: story.region,
        url: story.audioUrl,
        duration: "Voice Line",
        isAiVoice: false,
      });
    } else {
      // Putar Narator AI
      play({
        title: `${story.title} (Narasi AI)`,
        character: story.character,
        region: story.region,
        speechText: `${story.title}. Wilayah ${story.region}. ${
          story.character ? `Kisah ${story.character}. ` : ""
        }${story.summary}`,
        duration: "Narasi AI",
        isAiVoice: true,
      });
    }
  };

  const isCharacterStory = story.category === "character-backstory";

  return (
    <article className="primogem-corner group relative flex flex-col bg-scroll-800 border border-gold-300/15 rounded-xl overflow-hidden hover:border-gold-300/40 transition-all duration-300 hover:glow-gold">
      {/* ── Visual Header: Karakter Photo vs. Quest Chronicle Header ── */}
      {story.coverImage ? (
        <div className="relative w-full aspect-[16/10] overflow-hidden bg-celestia-950/90 border-b border-gold-300/15">
          <img
            src={story.coverImage}
            alt={story.character || story.title}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {/* Bottom gradient fade into card body */}
          <div className="absolute inset-0 bg-gradient-to-t from-scroll-800 via-transparent to-black/40 pointer-events-none" />

          {/* ⭐ Star Rarity Badge in the TOP-LEFT of the character photo */}
          {story.rarity && (
            <div className="absolute top-2.5 left-2.5 z-10">
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-black px-2.5 py-1 rounded-lg border shadow-xl backdrop-blur-md transition-transform group-hover:scale-105 ${
                  story.rarity === 5
                    ? "bg-amber-950/90 text-gold-300 border-gold-400/80 shadow-[0_0_12px_rgba(229,186,105,0.4)]"
                    : "bg-purple-950/90 text-purple-200 border-purple-400/80 shadow-[0_0_12px_rgba(198,123,242,0.4)]"
                }`}
                title={`Karakter Bintang ${story.rarity} (${story.rarity}★)`}
              >
                <span className="text-[10px] tracking-tight text-gold-300">
                  {story.rarity === 5 ? "★★★★★" : "★★★★"}
                </span>
                <span className="font-extrabold">{story.rarity}★</span>
              </span>
            </div>
          )}

          {/* Element Badge in the TOP-RIGHT of the character photo */}
          {story.element && story.element !== "none" && (
            <div className="absolute top-2.5 right-2.5 z-10 drop-shadow-md">
              <ElementBadge element={story.element} />
            </div>
          )}
        </div>
      ) : (
        /* Quest Chronicle Decorative Header Banner (Untuk Archon Quest, Story Quest, World Lore) */
        <div className="relative w-full h-24 overflow-hidden bg-gradient-to-br from-celestia-950 via-celestia-900 to-scroll-800 border-b border-gold-300/15 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 z-10">
            <div className="w-10 h-10 rounded-xl bg-gold-400/10 border border-gold-300/30 flex items-center justify-center text-gold-300 shadow-inner group-hover:scale-110 group-hover:border-gold-300 transition-transform">
              {story.category === "archon-quest" ? (
                <Scroll size={20} className="text-gold-300" />
              ) : (
                <Compass size={20} className="text-cyan-300" />
              )}
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-gold-300/90 block">
                {CATEGORY_LABEL[story.category] ?? story.category}
              </span>
              <span className="text-xs font-semibold text-parchment">
                Wilayah {story.region}
              </span>
            </div>
          </div>
          <div className="text-gold-300/10 text-5xl font-display font-black select-none pointer-events-none pr-2">
            ✦
          </div>
        </div>
      )}

      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* Category & Region badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-parchment-muted bg-celestia-700/80 px-2.5 py-0.5 rounded-full border border-celestia-500">
            {CATEGORY_LABEL[story.category] ?? story.category}
          </span>
          <span className="text-xs text-parchment-muted">{story.region}</span>
          {!story.coverImage && story.element && story.element !== "none" && (
            <ElementBadge element={story.element} />
          )}
        </div>

        {/* Title */}
        <h3
          className="text-parchment font-bold text-base leading-snug group-hover:text-gold-200 transition-colors"
          style={{ fontFamily: "Cinzel, Georgia, serif" }}
        >
          {story.title}
        </h3>

        {/* Character (if present) */}
        {story.character && (
          <p className="text-gold-300/80 text-xs font-semibold -mt-1">
            Tokoh: <span className="text-parchment-dim">{story.character}</span>
          </p>
        )}

        {/* Summary */}
        <p className="text-parchment-muted text-xs leading-relaxed line-clamp-3 flex-1">
          {story.summary}
        </p>

        {/* Meta: time & audio */}
        <div className="flex items-center gap-3 text-parchment-muted text-xs pt-1">
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {story.readingTime}
          </span>
          {story.audioUrl ? (
            <span className="flex items-center gap-1 text-emerald-300" title="Tersedia rekaman suara resmi karakter bahasa Jepang">
              <Volume2 size={12} />
              Suara Karakter (JP)
            </span>
          ) : (
            <span className="flex items-center gap-1 text-anemo" title="Tersedia Mode Narator Suara AI">
              <Headphones size={12} />
              Audio Narator AI
            </span>
          )}
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
            <span>{isCharacterStory ? "Baca Biografi" : "Baca Kisah"}</span>
          </Link>

          {/* Tombol Audio */}
          <button
            onClick={handleAudioClick}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all border ${
              isThisPlaying
                ? "bg-gold-400 text-celestia-950 border-gold-300 shadow-md glow-gold font-bold"
                : story.audioUrl
                ? "bg-emerald-500/15 hover:bg-emerald-500/25 border-emerald-500/30 hover:border-emerald-500/50 text-emerald-300 hover:text-emerald-200"
                : "bg-celestia-700/80 hover:bg-celestia-600 border-gold-300/25 hover:border-gold-300/50 text-gold-300 hover:text-gold-200"
            }`}
            title={story.audioUrl ? "Dengarkan suara resmi karakter (JP)" : "Dengarkan Narator AI Teyvat"}
          >
            {isThisPlaying ? (
              <>
                <Pause size={13} className="text-celestia-950" />
                <span>Memutar</span>
              </>
            ) : story.audioUrl ? (
              <>
                <Volume2 size={13} className="text-emerald-300" />
                <span>Suara JP</span>
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
