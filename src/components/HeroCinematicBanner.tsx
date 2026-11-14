"use client";

import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  Film,
  ChevronLeft,
  ChevronRight,
  ChevronDown
} from "lucide-react";

interface Scene {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  videoSrc: string;
  poster: string;
  region: string;
}

const SCENES: Scene[] = [
  {
    id: "scene-1",
    tag: "Benua Teyvat: Natlan & Fontaine",
    region: "Perang & Keadilan",
    title: "Saksikan Kobaran Api Suci & Rahasia Air Primordial",
    subtitle:
      "Dari arena pertarungan suci pahlawan Natlan hingga misteri nubuatan kuno pengadilan Fontaine, takdir Sang Pengelana terus terukir di bawah langit berbintang.",
    videoSrc: "/media/teyvat-scene-1.webm",
    poster: "/media/teyvat-hero-poster.webp",
  },
  {
    id: "scene-2",
    tag: "Benua Teyvat: Liyue & Mondstadt",
    region: "Kontrak & Kebebasan",
    title: "Lentera Emas Pelabuhan Liyue & Angin Kebebasan",
    subtitle:
      "Ribuan lentera mengapung menghiasi malam Lantern Rite Liyue, sementara semilir angin Anemo Barbatos membimbing jiwa-jiwa pengembara menuju kebebasan sejati.",
    videoSrc: "/media/teyvat-scene-2.webm",
    poster: "/media/teyvat-hero-poster.webp",
  },
  {
    id: "scene-3",
    tag: "Benua Teyvat: Inazuma & Sumeru",
    region: "Keabadian & Kebijaksanaan",
    title: "Kilatan Petir Keabadian & Rahasia Pohon Irminsul",
    subtitle:
      "Menembus badai petir Tenshukaku Inazuma dan menjelajahi kedalaman gurun pasir King Deshret di Sumeru demi menyingkap tabir kebenaran tentang 'Langit Palsu'.",
    videoSrc: "/media/teyvat-scene-3.webm",
    poster: "/media/teyvat-hero-poster.webp",
  },
];

export default function HeroCinematicBanner() {
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const scene = SCENES[currentSceneIdx];

  // Ganti video source ketika scene berubah
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      }
    }
  }, [currentSceneIdx]);

  // Otomatis berpindah scene setiap 12 detik jika sedang play
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentSceneIdx((prev) => (prev + 1) % SCENES.length);
    }, 12000);
    return () => clearInterval(interval);
  }, [isPlaying]);

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

  const prevScene = () => {
    setCurrentSceneIdx((prev) => (prev - 1 + SCENES.length) % SCENES.length);
  };

  const nextScene = () => {
    setCurrentSceneIdx((prev) => (prev + 1) % SCENES.length);
  };

  const scrollToContent = () => {
    const el = document.getElementById("arsip-konten");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full min-h-[92vh] sm:min-h-screen flex flex-col justify-between overflow-hidden border-b border-gold-300/20 bg-celestia-950">
      {/* ── Background Video Container (Full Selayar) ── */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          ref={videoRef}
          src={scene.videoSrc}
          poster={scene.poster}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="w-full h-full object-cover object-center filter brightness-90 contrast-[1.05] transition-opacity duration-1000"
        />

        {/* Cinematic Multi-layered Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-celestia-950 via-celestia-950/40 to-black/60 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/70 pointer-events-none" />
      </div>

      {/* ── Top Header Strip / Scene Badge ── */}
      <div className="relative z-20 px-4 sm:px-8 pt-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-celestia-950/80 backdrop-blur-md border border-gold-300/30 text-gold-300 text-xs font-semibold shadow-xl">
          <Film size={13} className="text-gold-300 animate-pulse" />
          <span className="tracking-widest uppercase text-[11px] font-bold">
            {scene.tag}
          </span>
          <span className="text-parchment-muted">•</span>
          <span className="text-parchment-dim">{scene.region}</span>
        </div>

        {/* Controls: Play & Sound Toggle */}
        <div className="flex items-center gap-2 bg-celestia-950/80 backdrop-blur-md p-1 rounded-full border border-gold-300/25 shadow-xl">
          <button
            onClick={togglePlay}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-celestia-800 text-parchment hover:text-gold-200 text-xs font-semibold transition-all"
            title={isPlaying ? "Jeda Video" : "Putar Video"}
          >
            {isPlaying ? (
              <>
                <Pause size={13} className="text-gold-300" />
                <span className="hidden sm:inline">Jeda</span>
              </>
            ) : (
              <>
                <Play size={13} className="text-gold-300 fill-gold-300" />
                <span className="hidden sm:inline">Putar</span>
              </>
            )}
          </button>

          <button
            onClick={toggleMute}
            className="p-1.5 rounded-full hover:bg-celestia-800 text-parchment hover:text-gold-200 transition-all"
            title={isMuted ? "Buka Suara" : "Bisukan"}
          >
            {isMuted ? (
              <VolumeX size={15} className="text-parchment-muted" />
            ) : (
              <Volume2 size={15} className="text-emerald-400" />
            )}
          </button>
        </div>
      </div>

      {/* ── Navigation Arrows (Kiri & Kanan Layar) ── */}
      <button
        onClick={prevScene}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-celestia-950/70 hover:bg-celestia-800 text-parchment hover:text-gold-300 border border-gold-300/20 backdrop-blur-md transition-all shadow-xl hover:scale-110 active:scale-95"
        aria-label="Scene Sebelumnya"
        title="Scene Sebelumnya"
      >
        <ChevronLeft size={22} />
      </button>

      <button
        onClick={nextScene}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-celestia-950/70 hover:bg-celestia-800 text-parchment hover:text-gold-300 border border-gold-300/20 backdrop-blur-md transition-all shadow-xl hover:scale-110 active:scale-95"
        aria-label="Scene Berikutnya"
        title="Scene Berikutnya"
      >
        <ChevronRight size={22} />
      </button>

      {/* ── Bottom Content: Title, Subtitle, Scene Indicator, & Scroll Prompt ── */}
      <div className="relative z-20 px-4 sm:px-12 pb-8 max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Decorative divider */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="gold-divider w-12" />
          <span className="text-gold-300 text-xs tracking-[0.3em] uppercase font-bold flex items-center gap-1.5">
            <Sparkles size={12} />
            Benua Teyvat Terbuka
          </span>
          <div className="gold-divider w-12" />
        </div>

        {/* Scene Title */}
        <h2
          className="text-2xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text mb-4 leading-tight glow-gold-text"
          style={{
            fontFamily: "Cinzel, Georgia, serif",
            backgroundImage: "linear-gradient(135deg, #FFF1CE 0%, #E5BA69 50%, #C48E2E 100%)",
          }}
        >
          {scene.title}
        </h2>

        {/* Scene Subtitle */}
        <p className="text-parchment-dim text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-6 drop-shadow-md">
          {scene.subtitle}
        </p>

        {/* Scene Selector Dots */}
        <div className="flex items-center gap-2.5 mb-8 bg-celestia-950/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-gold-300/20">
          {SCENES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentSceneIdx(idx)}
              className={`transition-all rounded-full ${
                currentSceneIdx === idx
                  ? "w-8 h-2.5 bg-gradient-to-r from-gold-400 to-gold-200 shadow-[0_0_10px_rgba(229,186,105,0.6)]"
                  : "w-2.5 h-2.5 bg-celestia-600 hover:bg-gold-400/60"
              }`}
              title={`Pindah ke Scene ${idx + 1}: ${s.region}`}
              aria-label={`Scene ${idx + 1}`}
            />
          ))}
        </div>

        {/* Smooth Scroll Down Indicator */}
        <button
          onClick={scrollToContent}
          className="group flex flex-col items-center gap-1 text-gold-300 hover:text-gold-200 transition-all cursor-pointer"
        >
          <span className="text-xs uppercase tracking-widest font-bold group-hover:tracking-[0.2em] transition-all">
            Gulir ke Bawah untuk Membaca Arsip
          </span>
          <div className="w-8 h-8 rounded-full border border-gold-300/30 flex items-center justify-center bg-celestia-950/60 backdrop-blur-sm group-hover:border-gold-300 animate-bounce">
            <ChevronDown size={18} />
          </div>
        </button>
      </div>
    </div>
  );
}
