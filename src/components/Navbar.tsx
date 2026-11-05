"use client";

import Link from "next/link";
import { Sparkles, Menu, X } from "lucide-react";
import { useState } from "react";

const NAV_LINKS = [
  { label: "Beranda", href: "/" },
  { label: "Archon Quest", href: "/kategori/archon-quest" },
  { label: "Story Quest", href: "/kategori/story-quest" },
  { label: "World Lore", href: "/kategori/world-lore" },
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
        <nav className="hidden md:flex items-center gap-6">
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

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-parchment-dim hover:text-gold-300 transition-colors"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gold-300/10 bg-celestia-800/95 px-4 py-4 flex flex-col gap-4">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-parchment-dim hover:text-gold-300 transition-colors text-sm"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

