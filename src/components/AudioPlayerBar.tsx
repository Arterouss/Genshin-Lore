"use client";

import { useAudio, VoicePreset } from "@/context/AudioContext";
import {
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Headphones,
  Settings2,
  User,
  Sliders,
} from "lucide-react";
import { useState } from "react";

function formatTime(secs: number): string {
  if (!secs || isNaN(secs)) return "0:00";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const RATES = [0.75, 1, 1.25, 1.5, 2];

export default function AudioPlayerBar() {
  const {
    track,
    isPlaying,
    currentTime,
    duration,
    playbackRate,
    volume,
    isAiVoice,
    voicePreset,
    availableVoices,
    selectedVoiceURI,
    togglePlay,
    seek,
    setRate,
    setVolume,
    setVoicePreset,
    setSelectedVoiceURI,
    stop,
  } = useAudio();

  const [minimized, setMinimized] = useState(false);
  const [muted, setMuted] = useState(false);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);

  if (!track) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const toggleMute = () => {
    setVolume(muted ? 1 : 0);
    setMuted(!muted);
  };

  // Minimized Widget Floating di kanan bawah
  if (minimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-scroll-800/95 backdrop-blur-md border border-gold-300/40 rounded-full px-4 py-2 shadow-2xl glow-gold audio-bar-enter">
        <button
          onClick={togglePlay}
          className="text-gold-300 hover:text-gold-200 transition-colors"
          title={isPlaying ? "Jeda" : "Putar"}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <div className="flex items-center gap-1.5 max-w-[150px] truncate">
          {isAiVoice && <Sparkles size={12} className="text-gold-300 shrink-0 animate-spin" />}
          <span className="text-parchment-dim text-xs truncate">{track.title}</span>
        </div>
        <button
          onClick={() => setMinimized(false)}
          className="text-parchment-muted hover:text-gold-300 transition-colors ml-1"
          title="Buka Pemutar Lengkap"
        >
          <ChevronUp size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 audio-bar-enter shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.6)]">
      {/* Panel Pengaturan Model Suara Narator AI (Slide Up) */}
      {showVoiceSettings && isAiVoice && (
        <div className="bg-celestia-950/98 border-t border-gold-300/30 px-4 sm:px-6 py-4 shadow-2xl backdrop-blur-xl animate-fade-in">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-gold-300 text-xs font-bold uppercase tracking-wider mb-1">
                <Settings2 size={14} />
                Pilihan Model Suara Narator AI
              </div>
              <p className="text-[11px] text-parchment-muted">
                Pilih karakter nada suara atau pilih model suara yang terpasang di perangkatmu.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Preset Model: Wanita vs Pria vs Standar */}
              <div className="flex items-center gap-1 bg-celestia-900 p-1 rounded-xl border border-gold-300/20">
                {[
                  { id: "female", label: "🌸 Wanita (Jernih)" },
                  { id: "male", label: "🛡️ Pria (Kharismatik)" },
                  { id: "standard", label: "⚡ Standar" },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setVoicePreset(p.id as VoicePreset)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                      voicePreset === p.id
                        ? "bg-gradient-to-r from-gold-400 to-gold-200 text-celestia-950 font-bold shadow-sm"
                        : "text-parchment-muted hover:text-parchment"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Dropdown Spesifik Engine Suara */}
              {availableVoices.length > 0 && (
                <div className="flex items-center gap-1.5 bg-celestia-900 px-3 py-1.5 rounded-xl border border-gold-300/20">
                  <User size={13} className="text-gold-300" />
                  <select
                    value={selectedVoiceURI}
                    onChange={(e) => setSelectedVoiceURI(e.target.value)}
                    className="bg-transparent text-xs text-parchment outline-none cursor-pointer max-w-[200px] truncate"
                  >
                    <option value="" className="bg-celestia-900 text-parchment">
                      Auto (Default Sistem)
                    </option>
                    {availableVoices.map((v) => (
                      <option
                        key={v.voiceURI}
                        value={v.voiceURI}
                        className="bg-celestia-900 text-parchment text-xs"
                      >
                        {v.name} ({v.lang})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                onClick={() => setShowVoiceSettings(false)}
                className="text-xs text-parchment-muted hover:text-gold-300 px-2.5 py-1 rounded-lg border border-gold-300/20"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Garis Aksen Emas Khas Genshin */}
      <div className="gold-divider" />

      <div className="bg-celestia-900/95 backdrop-blur-lg px-4 sm:px-6 py-3 border-t border-gold-300/20">
        {/* Progress bar */}
        <div className="mb-2 flex items-center gap-2 max-w-5xl mx-auto">
          <span className="text-parchment-muted text-[11px] w-12 text-right shrink-0 font-mono">
            {isAiVoice ? `P-${Math.min(currentTime + 1, Math.max(1, duration))}` : formatTime(currentTime)}
          </span>

          <div
            className="relative flex-1 h-1.5 bg-celestia-600 rounded-full cursor-pointer group"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
              seek(ratio * duration);
            }}
          >
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-gold-500 via-gold-300 to-gold-200 rounded-full transition-all duration-150"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-gold-200 rounded-full border-2 border-celestia-900 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
              style={{ left: `calc(${Math.min(100, Math.max(0, progress))}% - 7px)` }}
            />
          </div>

          <span className="text-parchment-muted text-[11px] w-14 shrink-0 font-mono">
            {isAiVoice ? `Total ${duration}` : formatTime(duration)}
          </span>
        </div>

        {/* Controls row */}
        <div className="flex items-center justify-between gap-3 max-w-5xl mx-auto">
          {/* Info Judul & Mode */}
          <div className="flex items-center gap-3 min-w-0 max-w-[40%] sm:max-w-[45%]">
            <div className="w-9 h-9 rounded-lg bg-gold-400/15 border border-gold-400/30 flex items-center justify-center text-gold-300 shrink-0">
              {isAiVoice ? <Headphones size={18} /> : <Sparkles size={18} />}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                {isAiVoice ? (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-gold-300/20 text-gold-300 border border-gold-300/30 flex items-center gap-1">
                    <Sparkles size={10} /> Narator AI
                  </span>
                ) : (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    🎙️ Suara Karakter (JP)
                  </span>
                )}
                {isPlaying && (
                  <span className="flex gap-0.5 items-end h-3">
                    <span className="w-0.5 h-3 bg-gold-300 animate-pulse" />
                    <span className="w-0.5 h-2 bg-gold-300 animate-pulse delay-75" />
                    <span className="w-0.5 h-3.5 bg-gold-300 animate-pulse delay-150" />
                  </span>
                )}
              </div>
              <p
                className="text-gold-200 text-sm font-semibold truncate"
                style={{ fontFamily: "Cinzel, Georgia, serif" }}
              >
                {track.title}
              </p>
              {track.character && (
                <p className="text-parchment-muted text-xs truncate">
                  {track.character} {track.region ? `• ${track.region}` : ""}
                </p>
              )}
            </div>
          </div>

          {/* Tombol Play / Pause / Stop */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={stop}
              className="p-1.5 text-parchment-muted hover:text-rose-400 transition-colors"
              title="Berhenti & Tutup Pemutar"
            >
              <Square size={16} />
            </button>

            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-gold-400 to-gold-200 hover:from-gold-300 hover:to-gold-100 text-celestia-950 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-lg shadow-gold-400/20"
              title={isPlaying ? "Jeda Narasi" : "Lanjutkan Narasi"}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
            </button>
          </div>

          {/* Kontrol Model Suara, Kecepatan & Volume */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Tombol Pengaturan Model Suara Narator AI */}
            {isAiVoice && (
              <button
                onClick={() => setShowVoiceSettings(!showVoiceSettings)}
                className={`p-1.5 rounded-lg border transition-all ${
                  showVoiceSettings
                    ? "bg-gold-400 text-celestia-950 border-gold-300 shadow-sm"
                    : "bg-celestia-800/80 text-gold-300 border-gold-300/20 hover:border-gold-300/50"
                }`}
                title="Pilih Model Suara Narator AI (Wanita / Pria / Engine)"
              >
                <Settings2 size={16} />
              </button>
            )}

            {/* Speed Rate */}
            <div className="hidden sm:flex items-center gap-1 bg-celestia-800/80 p-0.5 rounded-lg border border-gold-300/15">
              {RATES.map((r) => (
                <button
                  key={r}
                  onClick={() => setRate(r)}
                  className={`text-[11px] px-1.5 py-0.5 rounded font-mono transition-colors ${
                    playbackRate === r
                      ? "bg-gold-300 text-celestia-950 font-bold"
                      : "text-parchment-muted hover:text-parchment"
                  }`}
                  title={`Kecepatan ${r}x`}
                >
                  {r}x
                </button>
              ))}
            </div>

            {/* Volume */}
            <div className="hidden md:flex items-center gap-1.5">
              <button
                onClick={toggleMute}
                className="text-parchment-muted hover:text-gold-300 transition-colors p-1"
                title={muted ? "Nyalakan Suara" : "Senyapkan"}
              >
                {muted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={muted ? 0 : volume}
                onChange={(e) => {
                  setVolume(Number(e.target.value));
                  setMuted(false);
                }}
                className="w-16 accent-amber-400 h-1 cursor-pointer"
                title="Volume"
              />
            </div>

            {/* Minimize */}
            <button
              onClick={() => setMinimized(true)}
              className="text-parchment-muted hover:text-gold-300 transition-colors p-1"
              title="Kecilkan ke Sudut Layar"
            >
              <ChevronDown size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
