"use client";

import Link from "next/link";
import { Sparkles, Menu, X, PlusCircle, Heart } from "lucide-react";
import { useState } from "react";

const NAV_LINKS = [
  { label: "Beranda", href: "/" },
  { label: "Database", href: "/database" },
  { label: "Archon Quest", href: "/kategori/archon-quest" },
  { label: "Story Quest", href: "/kategori/story-quest" },
  { label: "World Lore", href: "/kategori/world-lore" },
  { label: "Komunitas", href: "/community" },
  { label: "Tentang", href: "/tentang" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [showDonateModal, setShowDonateModal] = useState(false);

  // Tautan donasi (dapat diset lewat environment variable atau langsung diisi link yang dikirim pengguna)
  const donationUrl = process.env.NEXT_PUBLIC_DONATION_URL?.trim();

  const handleDonateClick = (e: React.MouseEvent) => {
    if (!donationUrl || donationUrl === "#") {
      e.preventDefault();
      setShowDonateModal(true);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-gold-300/10 bg-celestia-900/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-7 h-7 flex items-center justify-center">
              <Sparkles className="text-gold-300 group-hover:text-gold-200 transition-colors" size={22} />
            </div>
            <span
              className="font-display font-bold text-lg tracking-widest text-gold-300 group-hover:text-gold-200 transition-colors glow-gold-text"
              style={{ fontFamily: "Cinzel, Georgia, serif" }}
            >
              Teyvat Lore
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-5">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-parchment-dim hover:text-gold-300 transition-colors text-sm tracking-wide font-medium"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Desktop actions: Donate & Buat Lore */}
          <div className="hidden md:flex items-center gap-2.5">
            <a
              href={donationUrl || "#"}
              onClick={handleDonateClick}
              target={donationUrl && donationUrl !== "#" ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition-all text-xs font-semibold shadow-sm hover:scale-105 active:scale-95"
              title="Dukung pemeliharaan arsip Teyvat Lore"
            >
              <Heart size={14} className="text-rose-400 fill-rose-400/20 animate-pulse" />
              <span>Donasi</span>
            </a>

            <Link
              href="/buat-lore"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gold-400 text-celestia-950 font-bold hover:bg-gold-300 transition-all text-xs shadow-md shadow-gold-400/20 hover:scale-105 active:scale-95"
            >
              <PlusCircle size={14} />
              <span>+ Buat Lore</span>
            </Link>
          </div>

          {/* Mobile controls */}
          <button
            className="lg:hidden text-parchment-dim hover:text-gold-300 transition-colors p-2"
            onClick={() => setOpen(!open)}
            aria-label="Toggle Menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden border-t border-gold-300/10 bg-celestia-900/98 px-4 py-4 flex flex-col gap-3 shadow-xl">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-parchment-dim hover:text-gold-300 transition-colors text-sm py-1 font-medium"
              >
                {l.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-gold-300/10 flex flex-col gap-2">
              <a
                href={donationUrl || "#"}
                onClick={(e) => {
                  setOpen(false);
                  handleDonateClick(e);
                }}
                target={donationUrl && donationUrl !== "#" ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-semibold text-xs text-center transition-all"
              >
                <Heart size={15} className="text-rose-400 fill-rose-400/20" />
                <span>☕ Dukung / Donasi</span>
              </a>

              <Link
                href="/buat-lore"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gold-400 text-celestia-950 font-bold hover:bg-gold-300 transition-colors text-xs text-center shadow-md shadow-gold-400/20"
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
