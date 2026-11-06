import { getAllStories } from "@/lib/stories";
import StoryCatalog from "@/components/StoryCatalog";
import Starfield from "@/components/Starfield";
import { Sparkles, BookOpen, Headphones, Globe } from "lucide-react";

export default function HomePage() {
  const stories = getAllStories();

  return (
    <>
      {/* ── Hero Section ─────────────────────────────── */}
      <section className="relative overflow-hidden min-h-[70vh] flex items-center justify-center">
        {/* Starfield background */}
        <div className="absolute inset-0 bg-gradient-to-b from-celestia-950 via-celestia-900 to-celestia-800" />
        {/* Decorative radial glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full bg-gold-300/5 blur-3xl" />
        </div>
        {/* Decorative stars */}
        <Starfield />

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 py-20 max-w-4xl mx-auto">
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="gold-divider w-16" />
            <span className="text-gold-300 text-xs tracking-[0.4em] uppercase font-semibold flex items-center gap-1.5">
              <Sparkles size={12} />
              The Grand Archive of Teyvat
            </span>
            <div className="gold-divider w-16" />
          </div>

          {/* Title */}
          <h1
            className="text-4xl sm:text-6xl lg:text-7xl font-black text-transparent bg-clip-text mb-6"
            style={{
              fontFamily: "Cinzel Decorative, Cinzel, Georgia, serif",
              backgroundImage: "linear-gradient(135deg, #F3D797 0%, #E5BA69 40%, #D49A3C 100%)",
              textShadow: "none",
              filter: "drop-shadow(0 0 30px rgba(229,186,105,0.3))",
            }}
          >
            Teyvat Lore
          </h1>

          {/* Subtitle */}
          <p className="text-parchment-dim text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            The comprehensive archive and compendium of{" "}
            <span className="text-gold-300 font-semibold">Genshin Impact</span> lore,
            character backstories, Archon Quests, and deep community theories across the continent of{" "}
            <span className="text-parchment font-semibold">Teyvat</span>.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {[
              { icon: <BookOpen size={14} />, label: "Archon & Story Quests", color: "text-gold-300" },
              { icon: <Headphones size={14} />, label: "Audio Narration Mode", color: "text-anemo" },
              { icon: <Globe size={14} />, label: "Community Theories Hub", color: "text-parchment-dim" },
            ].map((f) => (
              <div
                key={f.label}
                className={`flex items-center gap-2 text-sm ${f.color} bg-celestia-700/60 border border-gold-300/15 px-4 py-2 rounded-full`}
              >
                {f.icon}
                {f.label}
              </div>
            ))}
          </div>

          {/* CTA */}
          <a
            href="#katalog"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-500 to-gold-300 hover:from-gold-400 hover:to-gold-200 text-celestia-900 font-bold text-sm px-8 py-3.5 rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            <BookOpen size={16} />
            Explore Archive
          </a>
        </div>
      </section>

      {/* Gold divider */}
      <div className="gold-divider" />

      {/* ── Catalog Section ───────────────────────────── */}
      <div id="katalog">
        <StoryCatalog stories={stories} />
      </div>

      {/* ── Footer ──────────────────────────────────────*/}
      <footer className="border-t border-gold-300/10 mt-8 py-8 text-center text-parchment-muted text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles size={14} className="text-gold-300" />
          <span
            className="text-gold-300 font-semibold tracking-widest text-xs"
            style={{ fontFamily: "Cinzel, Georgia, serif" }}
          >
            Teyvat Lore
          </span>
        </div>
        <p className="text-xs">
          Dibuat dengan ✦ oleh komunitas pecinta Genshin Impact Indonesia.
          <br />
          Teyvat Lore bukan afiliasi resmi dari HoYoverse.
        </p>
      </footer>
    </>
  );
}
