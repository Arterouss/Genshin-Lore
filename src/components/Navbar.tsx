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
  Scroll
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
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

          {/* ── Desktop Modern Navigation ── */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-celestia-950/60 p-1.5 rounded-full border border-gold-300/15 shadow-inner">
            {/* Beranda */}
            <Link
              href="/"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-parchment-dim hover:text-gold-200 hover:bg-celestia-800/80 transition-all text-xs font-semibold tracking-wide"
            >
              <Home size={14} className="text-gold-300/80" />
              <span>Beranda</span>
            </Link>

            {/* Database with 126 Characters Badge */}
            <Link
              href="/database"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-parchment-dim hover:text-gold-200 hover:bg-celestia-800/80 transition-all text-xs font-semibold tracking-wide group"
            >
              <Database size={14} className="text-anemo group-hover:scale-110 transition-transform" />
              <span>Database</span>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-gold-400/20 text-gold-300 border border-gold-400/40">
                126 Char
              </span>
            </Link>

            {/* Dropdown Kategori Cerita */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-parchment-dim hover:text-gold-200 hover:bg-celestia-800/80 transition-all text-xs font-semibold tracking-wide"
              >
                <BookOpen size={14} className="text-gold-300/80" />
                <span>Katalog Cerita</span>
                <ChevronDown size={12} className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180 text-gold-300" : ""}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-celestia-900 border border-gold-300/25 rounded-2xl shadow-2xl p-2 z-50 animate-fade-in backdrop-blur-xl">
                  <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-gold-300 font-bold border-b border-gold-300/10 mb-1">
                    Arsip Naskah Teyvat
                  </div>
                  <Link
                    href="/kategori/archon-quest"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-parchment-dim hover:text-gold-200 hover:bg-celestia-800 transition-colors"
                  >
                    <Scroll size={14} className="text-gold-300" />
                    <div>
                      <p className="font-semibold text-parchment">Archon Quest</p>
                      <p className="text-[10px] text-parchment-muted">Kisah 7 Bangsa & Takdir Dunia</p>
                    </div>
                  </Link>
                  <Link
                    href="/kategori/story-quest"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-parchment-dim hover:text-gold-200 hover:bg-celestia-800 transition-colors"
                  >
                    <Shield size={14} className="text-emerald-300" />
                    <div>
                      <p className="font-semibold text-parchment">Story Quest</p>
                      <p className="text-[10px] text-parchment-muted">Kisah Personal Tokoh Utama</p>
                    </div>
                  </Link>
                  <Link
                    href="/kategori/character-backstory"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-parchment-dim hover:text-gold-200 hover:bg-celestia-800 transition-colors"
                  >
                    <Sparkles size={14} className="text-anemo" />
                    <div>
                      <p className="font-semibold text-parchment">Character Backstory</p>
                      <p className="text-[10px] text-parchment-muted">Biografi & Rahasia Vision</p>
                    </div>
                  </Link>
                  <Link
                    href="/kategori/world-lore"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-parchment-dim hover:text-gold-200 hover:bg-celestia-800 transition-colors"
                  >
                    <Compass size={14} className="text-purple-300" />
                    <div>
                      <p className="font-semibold text-parchment">World Lore</p>
                      <p className="text-[10px] text-parchment-muted">Khaenri&apos;ah & Reruntuhan Kuno</p>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Komunitas */}
            <Link
              href="/community"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-parchment-dim hover:text-gold-200 hover:bg-celestia-800/80 transition-all text-xs font-semibold tracking-wide"
            >
              <Users size={14} className="text-gold-300/80" />
              <span>Komunitas</span>
            </Link>

            {/* Tentang */}
            <Link
              href="/tentang"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-parchment-dim hover:text-gold-200 hover:bg-celestia-800/80 transition-all text-xs font-semibold tracking-wide"
            >
              <Info size={14} className="text-gold-300/80" />
              <span>Tentang</span>
            </Link>
          </nav>

          {/* ── Desktop Actions: Donate & Buat Lore ── */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={donationUrl || "#"}
              onClick={handleDonateClick}
              target={donationUrl && donationUrl !== "#" ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition-all text-xs font-bold shadow-sm hover:scale-105 active:scale-95"
              title="Dukung pemeliharaan website Teyvat Lore"
            >
              <Heart size={14} className="text-rose-400 fill-rose-400/30 animate-pulse" />
              <span>Donasi</span>
            </a>

            <Link
              href="/buat-lore"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-celestia-950 font-bold transition-all text-xs shadow-md shadow-gold-400/20 hover:scale-105 active:scale-95"
            >
              <PlusCircle size={15} />
              <span>+ Buat Lore</span>
            </Link>
          </div>

          {/* ── Mobile Hamburger Button ── */}
          <button
            className="lg:hidden text-parchment-dim hover:text-gold-300 transition-colors p-2 rounded-xl hover:bg-celestia-800"
            onClick={() => setOpen(!open)}
            aria-label="Buka Menu Navigasi"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* ── Mobile Navigation Drawer ── */}
        {open && (
          <div className="lg:hidden border-t border-gold-300/15 bg-celestia-900/98 px-4 py-5 flex flex-col gap-3 shadow-2xl backdrop-blur-xl animate-fade-in">
            <div className="grid grid-cols-2 gap-2 mb-2">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 p-3 rounded-xl bg-celestia-950 border border-gold-300/10 text-xs font-semibold text-parchment hover:text-gold-200"
              >
                <Home size={15} className="text-gold-300" />
                <span>Beranda</span>
              </Link>
              <Link
                href="/database"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl bg-celestia-950 border border-gold-300/10 text-xs font-semibold text-parchment hover:text-gold-200"
              >
                <div className="flex items-center gap-2">
                  <Database size={15} className="text-anemo" />
                  <span>Database</span>
                </div>
                <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-gold-400/20 text-gold-300 border border-gold-400/30">
                  126
                </span>
              </Link>
            </div>

            <div className="p-3 bg-celestia-950/70 border border-gold-300/10 rounded-xl space-y-2">
              <p className="text-[10px] uppercase font-bold text-gold-300 tracking-wider">Kategori Cerita</p>
              <Link
                href="/kategori/archon-quest"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 text-xs text-parchment-dim hover:text-gold-200 py-1"
              >
                <Scroll size={14} className="text-gold-300" />
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
                href="/kategori/character-backstory"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 text-xs text-parchment-dim hover:text-gold-200 py-1"
              >
                <Sparkles size={14} className="text-anemo" />
                <span>Character Backstory</span>
              </Link>
              <Link
                href="/kategori/world-lore"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 text-xs text-parchment-dim hover:text-gold-200 py-1"
              >
                <Compass size={14} className="text-purple-300" />
                <span>World Lore & Rahasia Dunia</span>
              </Link>
            </div>

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

            <div className="pt-3 border-t border-gold-300/10 flex flex-col gap-2">
              <a
                href={donationUrl || "#"}
                onClick={(e) => {
                  setOpen(false);
                  handleDonateClick(e);
                }}
                target={donationUrl && donationUrl !== "#" ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-bold text-xs transition-all shadow-sm"
              >
                <Heart size={15} className="text-rose-400 fill-rose-400/30" />
                <span>☕ Donasi / Dukung Kami</span>
              </a>

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
            <p className="text-parchment-dim text-sm leading-relaxed mb-6">
              Terima kasih yang sebesar-besarnya atas niat baik dan apresiasi Anda! Tautan donasi resmi (Saweria / Trakteer / QRIS) sedang disiapkan oleh pengelola website.
            </p>
            <div className="p-3 bg-celestia-800/80 rounded-xl border border-gold-300/15 mb-6 text-xs text-gold-300/80">
              ✨ Setiap dukungan Anda sangat berarti untuk membiayai pemeliharaan arsip naskah, audio, dan pengembangan fitur baru.
            </div>
            <button
              onClick={() => setShowDonateModal(false)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-300 text-celestia-950 font-bold text-sm hover:from-gold-400 hover:to-gold-200 transition-all shadow-md"
            >
              Tutup & Lanjutkan Membaca
            </button>
          </div>
        </div>
      )}
    </>
  );
}
