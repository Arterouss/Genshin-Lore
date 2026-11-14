"use client";

import { useState, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Sparkles, Film } from "lucide-react";

export default function HeroCinematicBanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="w-full max-w-5xl mx-auto mb-12 px-2 sm:px-4">
      {/* Decorative Outer Frame */}
      <div className="relative rounded-2xl overflow-hidden border border-gold-300/30 bg-celestia-950 shadow-[0_0_40px_rgba(229,186,105,0.15)] group">
        {/* Top Gold Trim Accent */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-gold-400 to-transparent opacity-80" />

        {/* Video Element with Poster Fallback */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden bg-black/40">
          <video
            ref={videoRef}
            src="/media/teyvat-hero.webm"
            poster="/media/teyvat-hero-poster.webp"
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
          />

          {/* Cinematic Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-celestia-950 via-transparent to-black/30 pointer-events-none" />

          {/* Badge Top Left */}
          <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-celestia-950/80 backdrop-blur-md border border-gold-300/25 text-gold-300 text-xs font-semibold shadow-lg">
            <Film size={13} className="text-gold-300 animate-pulse" />
            <span className="tracking-wider uppercase text-[11px]">Cinematic Teyvat Chronicle</span>
          </div>

          {/* Interactive Media Controls Bottom Right */}
          <div className="absolute bottom-4 right-4 flex items-center gap-2 z-20">
            <button
              onClick={togglePlay}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-celestia-900/85 hover:bg-celestia-800 text-parchment hover:text-gold-200 border border-gold-300/20 backdrop-blur-md text-xs font-semibold transition-all shadow-md hover:scale-105 active:scale-95"
              title={isPlaying ? "Jeda Video" : "Putar Video"}
              aria-label={isPlaying ? "Jeda Video" : "Putar Video"}
            >
              {isPlaying ? (
                <>
                  <Pause size={13} className="text-gold-300" />
                  <span>Jeda</span>
                </>
              ) : (
                <>
                  <Play size={13} className="text-gold-300 fill-gold-300" />
                  <span>Putar Video</span>
                </>
              )}
            </button>

            <button
              onClick={toggleMute}
              className="p-1.5 rounded-full bg-celestia-900/85 hover:bg-celestia-800 text-parchment hover:text-gold-200 border border-gold-300/20 backdrop-blur-md transition-all shadow-md hover:scale-105 active:scale-95"
              title={isMuted ? "Buka Suara" : "Bisukan"}
              aria-label={isMuted ? "Buka Suara" : "Bisukan"}
            >
              {isMuted ? (
                <VolumeX size={15} className="text-parchment-muted" />
              ) : (
                <Volume2 size={15} className="text-emerald-400" />
              )}
            </button>
          </div>

          {/* Floating Subtle Quote in Banner */}
          <div className="absolute bottom-4 left-4 hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-black/50 backdrop-blur-sm border border-white/10 text-parchment-dim text-xs italic">
            <Sparkles size={11} className="text-gold-300" />
            <span>&ldquo;Langit berbintang Teyvat selalu menyimpan takdir bagi mereka yang mencari.&rdquo;</span>
          </div>
        </div>

        {/* Bottom Gold Accent */}
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
      </div>
    </div>
  );
}
