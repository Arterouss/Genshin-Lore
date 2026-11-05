"use client";

import React, { createContext, useContext, useRef, useState, useCallback } from "react";

export interface AudioTrack {
  title: string;
  character?: string;
  region?: string;
  url: string;
  duration?: string;
}

interface AudioContextValue {
  track: AudioTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  volume: number;
  play: (track: AudioTrack) => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  setRate: (rate: number) => void;
  setVolume: (vol: number) => void;
  stop: () => void;
}

const AudioCtx = createContext<AudioContextValue | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [track, setTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRateState] = useState(1);
  const [volume, setVolumeState] = useState(1);

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

  const play = useCallback(
    (newTrack: AudioTrack) => {
      const audio = getAudio();
      if (track?.url !== newTrack.url) {
        audio.src = newTrack.url;
        setTrack(newTrack);
        setCurrentTime(0);
      }
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    },
    [track, getAudio]
  );

  const togglePlay = useCallback(() => {
    const audio = getAudio();
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [isPlaying, getAudio]);

  const seek = useCallback((time: number) => {
    const audio = getAudio();
    audio.currentTime = time;
    setCurrentTime(time);
  }, [getAudio]);

  const setRate = useCallback((rate: number) => {
    const audio = getAudio();
    audio.playbackRate = rate;
    setPlaybackRateState(rate);
  }, [getAudio]);

  const setVolume = useCallback((vol: number) => {
    const audio = getAudio();
    audio.volume = vol;
    setVolumeState(vol);
  }, [getAudio]);

  const stop = useCallback(() => {
    const audio = getAudio();
    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
    setTrack(null);
  }, [getAudio]);

  return (
    <AudioCtx.Provider
      value={{ track, isPlaying, currentTime, duration, playbackRate, volume, play, togglePlay, seek, setRate, setVolume, stop }}
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

