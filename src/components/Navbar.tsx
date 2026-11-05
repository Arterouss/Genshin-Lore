"use client";

import Link from "next/link";
import { Sparkles, Menu, X, PlusCircle } from "lucide-react";
import { useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";

const NAV_LINKS = [
  { label: "Beranda", href: "/" },
  { label: "Archon Quest", href: "/kategori/archon-quest" },
  { label: "Story Quest", href: "/kategori/story-quest" },
  { label: "World Lore", href: "/kategori/world-lore" },
  { label: "Komunitas", href: "/community" },
  { label: "Tentang", href: "/tentang" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
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
        <nav className="hidden md:flex items-center gap-5">
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

        {/* Desktop actions: Switcher & Buat Lore */}
        <div className="hidden md:flex items-center gap-3">
          <LanguageSwitcher />
          <Link
            href="/buat-lore"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gold-400 text-celestia-950 font-bold hover:bg-gold-300 transition-all text-xs shadow-md shadow-gold-400/20"
          >
            <PlusCircle size={14} />
            <span>+ Buat Lore</span>
          </Link>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher />
          <button
            className="text-parchment-dim hover:text-gold-300 transition-colors p-2"
            onClick={() => setOpen(!open)}
            aria-label="Toggle Menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gold-300/10 bg-celestia-900/98 px-4 py-4 flex flex-col gap-3 shadow-xl">
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
          <div className="pt-2 border-t border-gold-300/10">
            <Link
              href="/buat-lore"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gold-400 text-celestia-950 font-bold hover:bg-gold-300 transition-colors text-xs text-center shadow-md shadow-gold-400/20"
            >
              <PlusCircle size={15} />
              + Buat Postingan Lore Baru
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
