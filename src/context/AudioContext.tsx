"use client";

import React, { createContext, useContext, useRef, useState, useCallback, useEffect } from "react";

export interface AudioTrack {
  title: string;
  character?: string;
  region?: string;
  url?: string;
  speechText?: string;
  duration?: string;
  isAiVoice?: boolean;
}

interface AudioContextValue {
  track: AudioTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  volume: number;
  isAiVoice: boolean;
  play: (track: AudioTrack) => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  setRate: (rate: number) => void;
  setVolume: (vol: number) => void;
  stop: () => void;
}

const AudioCtx = createContext<AudioContextValue | null>(null);

function chunkText(text: string, maxLen = 160): string[] {
  // Bersihkan tag HTML atau format markdown jika ada
  const clean = text
    .replace(/<[^>]+>/g, " ")
    .replace(/[*#_`]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!clean) return [];

  // Pecah per tanda baca kalimat (. ! ? \n)
  const sentences = clean.match(/[^.!?\n]+[.!?\n]*/g) || [clean];
  const chunks: string[] = [];
  let current = "";

  for (const s of sentences) {
    const trimmed = s.trim();
    if (!trimmed) continue;
    if ((current + " " + trimmed).length > maxLen) {
      if (current.trim()) chunks.push(current.trim());
      current = trimmed;
    } else {
      current = current ? current + " " + trimmed : trimmed;
    }
  }

  if (current.trim()) chunks.push(current.trim());
  return chunks.length > 0 ? chunks : [clean];
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [track, setTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRateState] = useState(1);
  const [volume, setVolumeState] = useState(1);

  // AI Speech Synthesis refs
  const speechChunksRef = useRef<string[]>([]);
  const chunkIndexRef = useRef<number>(0);
  const isAiRef = useRef<boolean>(false);
  const rateRef = useRef<number>(1);
  const volRef = useRef<number>(1);

  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.ontimeupdate = () =>
        setCurrentTime(audioRef.current?.currentTime ?? 0);
      audioRef.current.ondurationchange = () =>
        setDuration(audioRef.current?.duration ?? 0);
      audioRef.current.onended = () => setIsPlaying(false);
    }
    return audioRef.current;
  }, []);

  // Hentikan semua audio (HTML5 & Speech)
  const stopAll = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  }, []);

  // Jalankan narasi segmen kalimat SpeechSynthesis
  const speakChunk = useCallback((index: number) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const chunks = speechChunksRef.current;
    if (index >= chunks.length) {
      setIsPlaying(false);
      setCurrentTime(chunks.length);
      return;
    }

    chunkIndexRef.current = index;
    setCurrentTime(index);

    const utterance = new SpeechSynthesisUtterance(chunks[index]);
    utterance.rate = rateRef.current;
    utterance.volume = volRef.current;

    // Pilih suara: prioritaskan Bahasa Indonesia, jika tidak ada cari English
    const voices = window.speechSynthesis.getVoices();
    const idVoice = voices.find((v) => v.lang.toLowerCase().startsWith("id"));
    const enVoice = voices.find((v) => v.lang.toLowerCase().startsWith("en"));
    if (idVoice) {
      utterance.voice = idVoice;
    } else if (enVoice) {
      utterance.voice = enVoice;
    }

    utterance.onend = () => {
      if (isAiRef.current) {
        speakChunk(index + 1);
      }
    };

    utterance.onerror = (e) => {
      if (e.error !== "canceled" && e.error !== "interrupted") {
        console.warn("SpeechSynthesis error:", e);
        setIsPlaying(false);
      }
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  const play = useCallback(
    (newTrack: AudioTrack) => {
      stopAll();

      const hasUrl = Boolean(newTrack.url && newTrack.url.trim().length > 0);
      const useAi = newTrack.isAiVoice || !hasUrl;

      isAiRef.current = useAi;
      setTrack({ ...newTrack, isAiVoice: useAi });

      if (!useAi && newTrack.url) {
        // Mode A: File Audio Asli (MP3 / Podcast)
        const audio = getAudio();
        audio.src = newTrack.url;
        audio.playbackRate = rateRef.current;
        audio.volume = volRef.current;
        setCurrentTime(0);
        audio
          .play()
          .then(() => setIsPlaying(true))
          .catch((err) => console.warn("Audio play blocked/failed:", err));
      } else {
        // Mode B: Narator AI (Web Speech Synthesis)
        const rawText = newTrack.speechText || `${newTrack.title}. ${newTrack.character ? `Kisah ${newTrack.character}.` : ""} ${newTrack.region ? `Wilayah ${newTrack.region}.` : ""}`;
        const chunks = chunkText(rawText);
        speechChunksRef.current = chunks;
        chunkIndexRef.current = 0;
        setDuration(chunks.length);
        setCurrentTime(0);
        setIsPlaying(true);

        if (typeof window !== "undefined" && "speechSynthesis" in window) {
          window.speechSynthesis.cancel();
          // Delay tipis agar speech queue browser siap
          setTimeout(() => {
            speakChunk(0);
          }, 60);
        }
      }
    },
    [stopAll, getAudio, speakChunk]
  );

  const togglePlay = useCallback(() => {
    if (!track) return;

    if (isAiRef.current) {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
      if (isPlaying) {
        window.speechSynthesis.pause();
        setIsPlaying(false);
      } else {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
          setIsPlaying(true);
        } else {
          speakChunk(chunkIndexRef.current);
          setIsPlaying(true);
        }
      }
    } else {
      const audio = getAudio();
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  }, [track, isPlaying, getAudio, speakChunk]);

  const seek = useCallback(
    (target: number) => {
      if (isAiRef.current) {
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
          window.speechSynthesis.cancel();
          const targetIndex = Math.min(
            Math.max(0, Math.floor(target)),
            Math.max(0, speechChunksRef.current.length - 1)
          );
          chunkIndexRef.current = targetIndex;
          setCurrentTime(targetIndex);
          if (isPlaying) {
            speakChunk(targetIndex);
          }
        }
      } else {
        const audio = getAudio();
        audio.currentTime = target;
        setCurrentTime(target);
      }
    },
    [isPlaying, getAudio, speakChunk]
  );

  const setRate = useCallback(
    (rate: number) => {
      rateRef.current = rate;
      setPlaybackRateState(rate);

      if (isAiRef.current) {
        if (typeof window !== "undefined" && "speechSynthesis" in window && isPlaying) {
          window.speechSynthesis.cancel();
          speakChunk(chunkIndexRef.current);
        }
      } else {
        const audio = getAudio();
        audio.playbackRate = rate;
      }
    },
    [isPlaying, getAudio, speakChunk]
  );

  const setVolume = useCallback(
    (vol: number) => {
      volRef.current = vol;
      setVolumeState(vol);

      if (!isAiRef.current) {
        const audio = getAudio();
        audio.volume = vol;
      }
    },
    [getAudio]
  );

  const stop = useCallback(() => {
    stopAll();
    setTrack(null);
    setCurrentTime(0);
    setDuration(0);
  }, [stopAll]);

  // Cleanup saat unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <AudioCtx.Provider
      value={{
        track,
        isPlaying,
        currentTime,
        duration,
        playbackRate,
        volume,
        isAiVoice: Boolean(track?.isAiVoice),
        play,
        togglePlay,
        seek,
        setRate,
        setVolume,
        stop,
      }}
    >
      {children}
    </AudioCtx.Provider>
  );
}

export function useAudio() {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error("useAudio must be used inside AudioProvider");
  return ctx;
}
