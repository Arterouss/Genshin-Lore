"use client";

import Link from "next/link";
import {
  Sparkles,
  Menu,
  X,
  PlusCircle,
  Heart,
  Home,
  Database,
  BookOpen,
  Users,
  Info,
  ChevronDown,
  Shield,
  Compass,
  Scroll,
  Headphones,
  UserCheck
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [storyDropdownOpen, setStoryDropdownOpen] = useState(false);
  const [charDropdownOpen, setCharDropdownOpen] = useState(false);
  const [showDonateModal, setShowDonateModal] = useState(false);
  
  const storyDropdownRef = useRef<HTMLDivElement>(null);
  const charDropdownRef = useRef<HTMLDivElement>(null);

  // Tautan donasi
  const donationUrl = process.env.NEXT_PUBLIC_DONATION_URL?.trim();

  const handleDonateClick = (e: React.MouseEvent) => {
    if (!donationUrl || donationUrl === "#") {
      e.preventDefault();
      setShowDonateModal(true);
    }
  };

  // Tutup dropdown ketika klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        storyDropdownRef.current &&
        !storyDropdownRef.current.contains(event.target as Node)
      ) {
        setStoryDropdownOpen(false);
      }
      if (
        charDropdownRef.current &&
        !charDropdownRef.current.contains(event.target as Node)
      ) {
        setCharDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-gold-300/15 bg-celestia-900/95 backdrop-blur-lg shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* ── Brand Logo ── */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-gold-400/20 to-gold-600/10 border border-gold-300/30 flex items-center justify-center group-hover:border-gold-300 transition-colors shadow-sm">
              <Sparkles className="text-gold-300 group-hover:text-gold-200 transition-colors group-hover:rotate-12" size={18} />
            </div>
            <div className="flex flex-col">
              <span
                className="font-display font-black text-lg tracking-wider text-transparent bg-clip-text glow-gold-text"
                style={{
                  fontFamily: "Cinzel, Georgia, serif",
                  backgroundImage: "linear-gradient(135deg, #FFF1CE 0%, #E5BA69 50%, #C48E2E 100%)",
                }}
              >
                Teyvat Lore
              </span>
              <span className="text-[10px] tracking-widest uppercase text-parchment-muted -mt-1 font-semibold hidden sm:inline">
                Grand Archive
              </span>
            </div>
          </Link>

          {/* ── Desktop Modern Navigation (Pemisahan Jelas Cerita vs Karakter) ── */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-celestia-950/60 p-1.5 rounded-full border border-gold-300/15 shadow-inner">
            {/* 1. Beranda */}
            <Link
              href="/"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-parchment-dim hover:text-gold-200 hover:bg-celestia-800/80 transition-all text-xs font-semibold tracking-wide"
            >
              <Home size={14} className="text-gold-300/80" />
              <span>Beranda</span>
            </Link>

            {/* 2. Dropdown Cerita & Quest (Murni Alur Cerita & Quest Dunia) */}
            <div className="relative" ref={storyDropdownRef}>
              <button
                onClick={() => {
                  setStoryDropdownOpen(!storyDropdownOpen);
                  setCharDropdownOpen(false);
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-parchment-dim hover:text-gold-200 hover:bg-celestia-800/80 transition-all text-xs font-semibold tracking-wide group"
              >
                <BookOpen size={14} className="text-gold-300/80 group-hover:scale-110 transition-transform" />
                <span>Cerita &amp; Quest</span>
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-200 ${
                    storyDropdownOpen ? "rotate-180 text-gold-300" : ""
                  }`}
                />
              </button>

              {storyDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-celestia-900 border border-gold-300/25 rounded-2xl shadow-2xl p-2 z-50 animate-fade-in backdrop-blur-xl">
                  <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-gold-300 font-bold border-b border-gold-300/10 mb-1 flex items-center justify-between">
                    <span>Arsip Alur Cerita Teyvat</span>
                    <Scroll size={12} />
                  </div>

                  <Link
                    href="/katalog"
                    onClick={() => setStoryDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-gold-300 bg-gold-400/10 hover:bg-gold-400/20 transition-colors mb-1"
                  >
                    <BookOpen size={14} className="text-gold-300" />
                    <div>
                      <p className="font-bold text-gold-200">Semua Cerita &amp; Quest</p>
                      <p className="text-[10px] text-parchment-muted">Katalog lengkap babak cerita</p>
                    </div>
                  </Link>

                  <Link
                    href="/kategori/archon-quest"
                    onClick={() => setStoryDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-parchment-dim hover:text-gold-200 hover:bg-celestia-800 transition-colors"
                  >
                    <Scroll size={14} className="text-cyan-300" />
                    <div>
                      <p className="font-semibold text-parchment">Archon Quest</p>
                      <p className="text-[10px] text-parchment-muted">Kisah 7 Bangsa &amp; Pengelana</p>
                    </div>
                  </Link>

                  <Link
                    href="/kategori/story-quest"
                    onClick={() => setStoryDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-parchment-dim hover:text-gold-200 hover:bg-celestia-800 transition-colors"
                  >
                    <Shield size={14} className="text-emerald-300" />
                    <div>
                      <p className="font-semibold text-parchment">Story Quest</p>
                      <p className="text-[10px] text-parchment-muted">Babak Petualangan Legenda</p>
                    </div>
                  </Link>

                  <Link
                    href="/kategori/world-lore"
                    onClick={() => setStoryDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-parchment-dim hover:text-gold-200 hover:bg-celestia-800 transition-colors"
                  >
                    <Compass size={14} className="text-purple-300" />
                    <div>
                      <p className="font-semibold text-parchment">World Lore</p>
                      <p className="text-[10px] text-parchment-muted">Khaenri&apos;ah &amp; Sejarah Kuno</p>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* 3. Dropdown Karakter & Database (Pusat Khusus Karakter) */}
            <div className="relative" ref={charDropdownRef}>
              <button
                onClick={() => {
                  setCharDropdownOpen(!charDropdownOpen);
                  setStoryDropdownOpen(false);
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-parchment-dim hover:text-gold-200 hover:bg-celestia-800/80 transition-all text-xs font-semibold tracking-wide group"
              >
                <Database size={14} className="text-anemo group-hover:scale-110 transition-transform" />
                <span>Karakter &amp; Data</span>
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-gold-400/20 text-gold-300 border border-gold-400/40">
                  126
                </span>
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-200 ${
                    charDropdownOpen ? "rotate-180 text-gold-300" : ""
                  }`}
                />
              </button>

              {charDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-celestia-900 border border-gold-300/25 rounded-2xl shadow-2xl p-2 z-50 animate-fade-in backdrop-blur-xl">
                  <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-gold-300 font-bold border-b border-gold-300/10 mb-1 flex items-center justify-between">
                    <span>Ensiklopedia Karakter</span>
                    <Sparkles size={12} />
                  </div>

                  <Link
                    href="/database"
                    onClick={() => setCharDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-parchment-dim hover:text-gold-200 hover:bg-celestia-800 transition-colors"
                  >
                    <Database size={14} className="text-anemo" />
                    <div>
                      <p className="font-semibold text-parchment">Database Ensiklopedia</p>
                      <p className="text-[10px] text-parchment-muted">126 Karakter &amp; 256 Senjata</p>
                    </div>
                  </Link>

                  <Link
                    href="/kategori/character-backstory"
                    onClick={() => setCharDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-parchment-dim hover:text-gold-200 hover:bg-celestia-800 transition-colors"
                  >
                    <UserCheck size={14} className="text-gold-300" />
                    <div>
                      <p className="font-semibold text-parchment">Biografi &amp; Backstory</p>
                      <p className="text-[10px] text-parchment-muted">Kisah profil Character Story 1–5</p>
                    </div>
                  </Link>

                  <Link
                    href="/kategori/character-backstory"
                    onClick={() => setCharDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-parchment-dim hover:text-gold-200 hover:bg-celestia-800 transition-colors"
                  >
                    <Headphones size={14} className="text-emerald-300" />
                    <div>
                      <p className="font-semibold text-parchment">Audio Suara Jepang (JP)</p>
                      <p className="text-[10px] text-parchment-muted">Rekaman suara resmi Seiyuu</p>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* 4. Komunitas */}
            <Link
              href="/community"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-parchment-dim hover:text-gold-200 hover:bg-celestia-800/80 transition-all text-xs font-semibold tracking-wide"
            >
              <Users size={14} className="text-gold-300/80" />
              <span>Komunitas</span>
            </Link>

            {/* 5. Tentang */}
            <Link
              href="/tentang"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-parchment-dim hover:text-gold-200 hover:bg-celestia-800/80 transition-all text-xs font-semibold tracking-wide"
            >
              <Info size={14} className="text-gold-300/80" />
              <span>Tentang</span>
            </Link>
          </nav>

          {/* ── Desktop Actions: Donate & Buat Lore ── */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={handleDonateClick}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 text-xs font-semibold transition-all hover:scale-105 active:scale-95 shadow-sm"
              title="Dukung pemeliharaan website Teyvat Lore"
            >
              <Heart size={14} className="text-rose-400 fill-rose-400/30" />
              <span>Donasi</span>
            </button>

            <Link
              href="/buat-lore"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-celestia-950 font-bold text-xs transition-all hover:scale-105 active:scale-95 shadow-md shadow-gold-400/20"
            >
              <PlusCircle size={14} />
              <span>+ Buat Lore</span>
            </Link>
          </div>

          {/* ── Mobile Hamburger Button ── */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 text-parchment-dim hover:text-gold-300 rounded-lg hover:bg-celestia-800 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* ── Mobile Drawer (Terpisah Rapi: Cerita vs Karakter) ── */}
        {open && (
          <div className="lg:hidden border-t border-gold-300/15 bg-celestia-900/98 px-4 pt-4 pb-6 space-y-4 animate-fade-in shadow-2xl backdrop-blur-xl">
            {/* Beranda */}
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 p-3 rounded-xl bg-celestia-950 border border-gold-300/10 text-xs font-semibold text-parchment hover:text-gold-200"
            >
              <Home size={16} className="text-gold-300" />
              <span>Beranda</span>
            </Link>

            {/* Block 1: Cerita & Quest */}
            <div className="p-3 bg-celestia-950/70 border border-gold-300/15 rounded-xl space-y-2">
              <div className="flex items-center justify-between pb-1 border-b border-gold-300/10">
                <p className="text-[10px] uppercase font-bold text-gold-300 tracking-wider flex items-center gap-1.5">
                  <Scroll size={13} />
                  Alur Cerita &amp; Quest
                </p>
                <Link
                  href="/katalog"
                  onClick={() => setOpen(false)}
                  className="text-[10px] text-gold-300 hover:underline font-bold"
                >
                  Buka Katalog →
                </Link>
              </div>

              <Link
                href="/kategori/archon-quest"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 text-xs text-parchment-dim hover:text-gold-200 py-1"
              >
                <Scroll size={14} className="text-cyan-300" />
                <span>Archon Quest (7 Bangsa)</span>
              </Link>
              <Link
                href="/kategori/story-quest"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 text-xs text-parchment-dim hover:text-gold-200 py-1"
              >
                <Shield size={14} className="text-emerald-300" />
                <span>Story Quest Karakter</span>
              </Link>
              <Link
                href="/kategori/world-lore"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 text-xs text-parchment-dim hover:text-gold-200 py-1"
              >
                <Compass size={14} className="text-purple-300" />
                <span>World Lore &amp; Rahasia Dunia</span>
              </Link>
            </div>

            {/* Block 2: Karakter & Database */}
            <div className="p-3 bg-celestia-950/70 border border-gold-300/15 rounded-xl space-y-2">
              <div className="flex items-center justify-between pb-1 border-b border-gold-300/10">
                <p className="text-[10px] uppercase font-bold text-gold-300 tracking-wider flex items-center gap-1.5">
                  <Database size={13} />
                  Karakter &amp; Database
                </p>
                <span className="text-[9px] font-bold text-gold-300 px-1.5 py-0.2 rounded-full bg-gold-400/20 border border-gold-400/40">
                  126 Char
                </span>
              </div>

              <Link
                href="/database"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between text-xs text-parchment-dim hover:text-gold-200 py-1"
              >
                <div className="flex items-center gap-2">
                  <Database size={14} className="text-anemo" />
                  <span>Database 126 Karakter &amp; 256 Senjata</span>
                </div>
                <span>→</span>
              </Link>
              <Link
                href="/kategori/character-backstory"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between text-xs text-parchment-dim hover:text-gold-200 py-1"
              >
                <div className="flex items-center gap-2">
                  <UserCheck size={14} className="text-gold-300" />
                  <span>Biografi &amp; Kisah Masa Lalu</span>
                </div>
                <span>→</span>
              </Link>
              <Link
                href="/kategori/character-backstory"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between text-xs text-parchment-dim hover:text-gold-200 py-1"
              >
                <div className="flex items-center gap-2">
                  <Headphones size={14} className="text-emerald-300" />
                  <span>Audio Suara Karakter (JP)</span>
                </div>
                <span>→</span>
              </Link>
            </div>

            {/* Komunitas & Tentang */}
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/community"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-celestia-950 border border-gold-300/10 text-xs font-semibold text-parchment-dim hover:text-gold-200"
              >
                <Users size={14} className="text-gold-300" />
                <span>Komunitas</span>
              </Link>
              <Link
                href="/tentang"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-celestia-950 border border-gold-300/10 text-xs font-semibold text-parchment-dim hover:text-gold-200"
              >
                <Info size={14} className="text-gold-300" />
                <span>Tentang Web</span>
              </Link>
            </div>

            {/* Actions: Donasi & Buat Lore */}
            <div className="pt-3 border-t border-gold-300/10 flex flex-col gap-2">
              <button
                onClick={(e) => {
                  setOpen(false);
                  handleDonateClick(e);
                }}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-bold text-xs transition-all shadow-sm"
              >
                <Heart size={15} className="text-rose-400 fill-rose-400/30" />
                <span>☕ Donasi / Dukung Server</span>
              </button>

              <Link
                href="/buat-lore"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 text-celestia-950 font-bold text-xs shadow-md shadow-gold-400/20"
              >
                <PlusCircle size={15} />
                <span>+ Buat Postingan Lore Baru</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Modal Donasi Placeholder */}
      {showDonateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-celestia-900 border border-gold-300/30 rounded-2xl max-w-md w-full p-6 text-center shadow-2xl relative">
            <button
              onClick={() => setShowDonateModal(false)}
              className="absolute top-4 right-4 text-parchment-muted hover:text-parchment p-1 rounded-lg"
            >
              <X size={20} />
            </button>
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-300">
              <Heart size={28} className="fill-rose-400" />
            </div>
            <h3
              className="text-xl font-bold text-gold-200 mb-2"
              style={{ fontFamily: "Cinzel, Georgia, serif" }}
            >
              Dukung Teyvat Lore
            </h3>
            <p className="text-xs text-parchment-dim leading-relaxed mb-6">
              Teyvat Lore adalah proyek arsip komunitas gratis tanpa iklan. Dukungan Anda membantu kami membiayai server, CDN, dan riset naskah lore Genshin Impact dalam bahasa Indonesia.
            </p>
            <div className="p-4 rounded-xl bg-celestia-950 border border-gold-300/20 mb-6 text-xs text-parchment space-y-2">
              <p className="text-gold-300 font-semibold">Tautan Donasi Resmi:</p>
              <p className="text-parchment-dim break-all">
                Saweria / Trakteer / KaryaKarsa dapat diatur melalui variabel lingkungan <code className="text-gold-200">NEXT_PUBLIC_DONATION_URL</code> di file <code className="text-gold-200">.env.local</code>.
              </p>
            </div>
            <button
              onClick={() => setShowDonateModal(false)}
              className="w-full py-2.5 rounded-xl bg-gold-400 hover:bg-gold-300 text-celestia-950 font-bold text-xs transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </>
  );
}
