"use client";

import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react";

export interface AudioTrack {
  title: string;
  character?: string;
  region?: string;
  url?: string;
  speechText?: string;
  duration?: string;
  isAiVoice?: boolean;
}

export type VoicePreset = "female" | "male" | "standard";

export interface VoiceOption {
  name: string;
  lang: string;
  voiceURI: string;
}

interface AudioContextValue {
  track: AudioTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  volume: number;
  isAiVoice: boolean;
  voicePreset: VoicePreset;
  availableVoices: VoiceOption[];
  selectedVoiceURI: string;
  play: (track: AudioTrack) => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  setRate: (rate: number) => void;
  setVolume: (vol: number) => void;
  setVoicePreset: (preset: VoicePreset) => void;
  setSelectedVoiceURI: (uri: string) => void;
  stop: () => void;
}

const AudioCtx = createContext<AudioContextValue | null>(null);

function chunkText(text: string, maxLen = 160): string[] {
  const clean = text
    .replace(/<[^>]+>/g, " ")
    .replace(/[*#_`]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!clean) return [];

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

  // Model & Preset Suara Narator AI
  const [voicePreset, setVoicePresetState] = useState<VoicePreset>("female");
  const [availableVoices, setAvailableVoices] = useState<VoiceOption[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURIState] = useState<string>("");

  // Refs
  const speechChunksRef = useRef<string[]>([]);
  const chunkIndexRef = useRef<number>(0);
  const isAiRef = useRef<boolean>(false);
  const rateRef = useRef<number>(1);
  const volRef = useRef<number>(1);
  const presetRef = useRef<VoicePreset>("female");
  const voiceUriRef = useRef<string>("");

  // Muat daftar suara peramban (Web Speech API)
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const updateVoices = () => {
      const vs = window.speechSynthesis.getVoices();
      const mapped: VoiceOption[] = vs.map((v) => ({
        name: v.name,
        lang: v.lang,
        voiceURI: v.voiceURI,
      }));
      setAvailableVoices(mapped);

      // Cari suara default: Utamakan Bahasa Indonesia wanita/natural
      if (!voiceUriRef.current && mapped.length > 0) {
        const idVoice = mapped.find(
          (v) =>
            v.lang.toLowerCase().startsWith("id") ||
            v.name.toLowerCase().includes("indonesia") ||
            v.name.toLowerCase().includes("gadis")
        );
        if (idVoice) {
          voiceUriRef.current = idVoice.voiceURI;
          setSelectedVoiceURIState(idVoice.voiceURI);
        }
      }
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
  }, []);

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

    // Terapkan pitch sesuai model preset suara
    if (presetRef.current === "female") {
      utterance.pitch = 1.15; // Suara wanita lebih cerah & jernih
    } else if (presetRef.current === "male") {
      utterance.pitch = 0.85; // Suara pria lebih berat & berwibawa
    } else {
      utterance.pitch = 1.0;
    }

    // Pilih suara
    const allVoices = window.speechSynthesis.getVoices();
    let pickedVoice: SpeechSynthesisVoice | undefined;

    if (voiceUriRef.current) {
      pickedVoice = allVoices.find((v) => v.voiceURI === voiceUriRef.current);
    }

    if (!pickedVoice) {
      // Prioritaskan ID
      pickedVoice =
        allVoices.find((v) => v.lang.toLowerCase().startsWith("id")) ||
        allVoices.find((v) => v.lang.toLowerCase().startsWith("en")) ||
        allVoices[0];
    }

    if (pickedVoice) {
      utterance.voice = pickedVoice;
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
        // Mode A: File Audio Resmi (Misal: Rekaman Suara Karakter JP)
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
        const rawText =
          newTrack.speechText ||
          `${newTrack.title}. ${newTrack.character ? `Kisah ${newTrack.character}.` : ""} ${
            newTrack.region ? `Wilayah ${newTrack.region}.` : ""
          }`;
        const chunks = chunkText(rawText);
        speechChunksRef.current = chunks;
        chunkIndexRef.current = 0;
        setDuration(chunks.length);
        setCurrentTime(0);
        setIsPlaying(true);

        if (typeof window !== "undefined" && "speechSynthesis" in window) {
          window.speechSynthesis.cancel();
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

  const setVoicePreset = useCallback(
    (preset: VoicePreset) => {
      presetRef.current = preset;
      setVoicePresetState(preset);

      // Jika sedang memutar suara AI, restart chunk aktif dengan pitch baru
      if (isAiRef.current && isPlaying && typeof window !== "undefined") {
        window.speechSynthesis.cancel();
        speakChunk(chunkIndexRef.current);
      }
    },
    [isPlaying, speakChunk]
  );

  const setSelectedVoiceURI = useCallback(
    (uri: string) => {
      voiceUriRef.current = uri;
      setSelectedVoiceURIState(uri);

      if (isAiRef.current && isPlaying && typeof window !== "undefined") {
        window.speechSynthesis.cancel();
        speakChunk(chunkIndexRef.current);
      }
    },
    [isPlaying, speakChunk]
  );

  const stop = useCallback(() => {
    stopAll();
    setTrack(null);
    setCurrentTime(0);
    setDuration(0);
  }, [stopAll]);

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
        voicePreset,
        availableVoices,
        selectedVoiceURI,
        play,
        togglePlay,
        seek,
        setRate,
        setVolume,
        setVoicePreset,
        setSelectedVoiceURI,
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
