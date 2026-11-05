"use client";

import { useAudio } from "@/context/AudioContext";
import {
  Play, Pause, Square, Volume2, VolumeX, ChevronDown, ChevronUp,
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
  const { track, isPlaying, currentTime, duration, playbackRate, volume, togglePlay, seek, setRate, setVolume, stop } =
    useAudio();
  const [minimized, setMinimized] = useState(false);
  const [muted, setMuted] = useState(false);

  if (!track) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const toggleMute = () => {
    setVolume(muted ? 1 : 0);
    setMuted(!muted);
  };

  if (minimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-scroll-800 border border-gold-300/30 rounded-full px-4 py-2 shadow-xl glow-gold audio-bar-enter">
        <button
          onClick={togglePlay}
          className="text-gold-300 hover:text-gold-200 transition-colors"
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <span className="text-parchment-dim text-xs max-w-[120px] truncate">{track.title}</span>
        <button
          onClick={() => setMinimized(false)}
          className="text-parchment-muted hover:text-gold-300 transition-colors"
        >
          <ChevronUp size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 audio-bar-enter">
      {/* Gold top border line */}
      <div className="gold-divider" />

      <div className="bg-celestia-800/95 backdrop-blur-md px-4 py-3">
        {/* Progress bar */}
        <div className="mb-2 flex items-center gap-2">
          <span className="text-parchment-muted text-xs w-10 text-right shrink-0">
            {formatTime(currentTime)}
          </span>
          <div
            className="relative flex-1 h-1 bg-celestia-500 rounded-full cursor-pointer group"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const ratio = (e.clientX - rect.left) / rect.width;
              seek(ratio * duration);
            }}
          >
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-gold-400 to-gold-200 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-gold-200 rounded-full border-2 border-celestia-800 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `calc(${progress}% - 6px)` }}
            />
          </div>
          <span className="text-parchment-muted text-xs w-10 shrink-0">
            {formatTime(duration)}
          </span>
        </div>

        {/* Controls row */}
        <div className="flex items-center gap-3">
          {/* Track info */}
          <div className="flex-1 min-w-0">
            <p className="text-gold-300 text-sm font-semibold truncate font-display">{track.title}</p>
            {track.character && (
              <p className="text-parchment-muted text-xs truncate">{track.character}</p>
            )}
          </div>

          {/* Play / Pause / Stop */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={stop}
              className="text-parchment-muted hover:text-gold-300 transition-colors"
            >
              <Square size={14} />
            </button>
            <button
              onClick={togglePlay}
              className="w-9 h-9 rounded-full bg-gold-300 hover:bg-gold-200 text-celestia-900 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
            </button>
          </div>

          {/* Playback rate */}
          <div className="flex items-center gap-1 shrink-0">
            {RATES.map((r) => (
              <button
                key={r}
                onClick={() => setRate(r)}
                className={`text-xs px-1.5 py-0.5 rounded transition-colors ${
                  playbackRate === r
                    ? "bg-gold-300/20 text-gold-300 font-semibold"
                    : "text-parchment-muted hover:text-parchment"
                }`}
              >
                {r}x
              </button>
            ))}
          </div>

          {/* Volume */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button onClick={toggleMute} className="text-parchment-muted hover:text-gold-300 transition-colors">
              {muted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={(e) => { setVolume(Number(e.target.value)); setMuted(false); }}
              className="w-16 accent-yellow-400 h-1"
            />
          </div>

          {/* Minimize */}
          <button
            onClick={() => setMinimized(true)}
            className="text-parchment-muted hover:text-gold-300 transition-colors shrink-0"
          >
            <ChevronDown size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

