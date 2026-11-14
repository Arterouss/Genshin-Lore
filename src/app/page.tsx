import { getAllStories } from "@/lib/stories";
import StoryCard from "@/components/StoryCard";
import Starfield from "@/components/Starfield";
import HeroCinematicBanner from "@/components/HeroCinematicBanner";
import communityTheories from "@/data/community-theories.json";
import {
  Sparkles,
  BookOpen,
  Headphones,
  Globe,
  Database,
  Scroll,
  Shield,
  MessageSquare,
  ArrowRight,
  Flame,
  Wind,
  Mountain,
  Zap,
  Droplets,
  Leaf,
  Clock,
  Heart,
  Compass,
  Users,
  ChevronRight,
  FileText
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const allStories = getAllStories();

  // Ambil 4 cerita unggulan utama (Archon Quest dan kisah epik), BUKAN menumpuk seluruh katalog karakter di beranda
  const featuredStories = allStories
    .filter((s) => s.category === "archon-quest")
    .slice(0, 4);

  // Jika archon quest kurang dari 4, fallback ke cerita pertama
  const displayStories = featuredStories.length >= 4 ? featuredStories : allStories.slice(0, 4);

  // Ambil 3 teori komunitas teratas
  const featuredTheories = communityTheories.slice(0, 3);

  // Daftar 7 Bangsa Teyvat
  const nations = [
    {
      name: "Mondstadt",
      archon: "Barbatos (Venti)",
      element: "Anemo",
      color: "text-anemo border-anemo/30 bg-anemo/5 hover:border-anemo/60",
      icon: <Wind size={20} className="text-anemo" />,
      tagline: "Kota Kebebasan dan Nyanyian Angin",
      desc: "Negeri padang rumput hijau yang dilindungi oleh Empat Angin di bawah bimbingan Sang Dewa Kebebasan.",
    },
    {
      name: "Liyue",
      archon: "Morax (Zhongli)",
      element: "Geo",
      color: "text-geo border-geo/30 bg-geo/5 hover:border-geo/60",
      icon: <Mountain size={20} className="text-geo" />,
      tagline: "Pelabuhan Kontrak & Kemakmuran Batu",
      desc: "Pusat perdagangan terkaya di Teyvat tempat perjanjian suci diukir dalam keabadian bebatuan purba.",
    },
    {
      name: "Inazuma",
      archon: "Beelzebul (Raiden Ei)",
      element: "Electro",
      color: "text-electro border-electro/30 bg-electro/5 hover:border-electro/60",
      icon: <Zap size={20} className="text-electro" />,
      tagline: "Negeri Badai & Keabadian Transenden",
      desc: "Kepulauan terisolasi yang diselimuti petir abadi demi mengejar ketenangan abadi tanpa perubahan.",
    },
    {
      name: "Sumeru",
      archon: "Buer (Nahida)",
      element: "Dendro",
      color: "text-dendro border-dendro/30 bg-dendro/5 hover:border-dendro/60",
      icon: <Leaf size={20} className="text-dendro" />,
      tagline: "Pusat Kebijaksanaan & Hutan Irminsul",
      desc: "Hutan hujan lebat dan padang pasir misterius tempat kebijaksanaan suci dijaga oleh Sang Dewi Kerdil.",
    },
    {
      name: "Fontaine",
      archon: "Focalors / Neuvillette",
      element: "Hydro",
      color: "text-hydro border-hydro/30 bg-hydro/5 hover:border-hydro/60",
      icon: <Droplets size={20} className="text-hydro" />,
      tagline: "Panggung Keadilan & Pengadilan Air Mata",
      desc: "Pusat peradaban teknologi dan hukum di mana drama keadilan berlangsung di bawah opera megah.",
    },
    {
      name: "Natlan",
      archon: "Habrotept (Mavuika)",
      element: "Pyro",
      color: "text-pyro border-pyro/30 bg-pyro/5 hover:border-pyro/60",
      icon: <Flame size={20} className="text-pyro" />,
      tagline: "Negeri Perang & Semangat Bara Kuno",
      desc: "Tanah vulkanik tempat enam suku pejuang hidup berdampingan dengan para Saurian purba.",
    },
  ];

  return (
    <>
      {/* ── 1. Full-Screen Cinematic Rotating Video Banner (Full Selayar) ── */}
      <HeroCinematicBanner />

      {/* ── 2. Hero Content Section & Pintu Masuk Fitur (Beranda Utama) ── */}
      <section id="arsip-konten" className="relative overflow-hidden py-16 sm:py-20 flex flex-col items-center justify-center">
        {/* Starfield background */}
        <div className="absolute inset-0 bg-gradient-to-b from-celestia-950 via-celestia-900 to-celestia-950" />
        {/* Decorative radial glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[800px] h-[800px] rounded-full bg-gold-300/5 blur-3xl" />
        </div>
        <Starfield />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto w-full">
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="gold-divider w-16" />
            <span className="text-gold-300 text-xs tracking-[0.35em] uppercase font-semibold flex items-center gap-1.5">
              <Sparkles size={13} />
              The Grand Compendium & Archive of Teyvat
            </span>
            <div className="gold-divider w-16" />
          </div>

          {/* Title */}
          <h1
            className="text-4xl sm:text-6xl lg:text-7xl font-black text-transparent bg-clip-text mb-6"
            style={{
              fontFamily: "Cinzel Decorative, Cinzel, Georgia, serif",
              backgroundImage: "linear-gradient(135deg, #FFF1CE 0%, #E5BA69 45%, #C48E2E 100%)",
              filter: "drop-shadow(0 0 25px rgba(229,186,105,0.25))",
            }}
          >
            Teyvat Lore
          </h1>

          {/* Subtitle */}
          <p className="text-parchment-dim text-base sm:text-xl max-w-3xl mx-auto leading-relaxed mb-10">
            Pusat ensiklopedia resmi dan arsip naskah sejarah dunia{" "}
            <span className="text-gold-300 font-semibold">Genshin Impact</span>: telusuri rahasia kejatuhan Khaenri&apos;ah,
            kronik epik Archon Quest, biografi dan suara karakter dalam bahasa Jepang, hingga ensiklopedia 126 karakter terlengkap.
          </p>

          {/* CTA Actions Utama */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
            <Link
              href="/database"
              className="inline-flex items-center gap-2.5 bg-gradient-to-r from-gold-500 to-gold-300 hover:from-gold-400 hover:to-gold-200 text-celestia-900 font-bold text-sm sm:text-base px-8 py-3.5 rounded-full transition-all hover:scale-105 active:scale-95 shadow-xl shadow-gold-500/10 group"
            >
              <Database size={18} className="group-hover:rotate-6 transition-transform" />
              Buka Database 126 Karakter
            </Link>

            <Link
              href="/katalog"
              className="inline-flex items-center gap-2.5 bg-celestia-800/90 hover:bg-celestia-700 text-gold-300 border border-gold-300/30 font-bold text-sm sm:text-base px-8 py-3.5 rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg group"
            >
              <BookOpen size={18} className="group-hover:scale-110 transition-transform" />
              Jelajahi Katalog Cerita
            </Link>
          </div>

          {/* ── 3. Pintu Masuk Eksplorasi (Feature Hub Grid - 4 Portal Utama) ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 text-left mb-16">
            {/* Card 1: Database Ensiklopedia */}
            <Link
              href="/database"
              className="group relative bg-celestia-900/80 hover:bg-celestia-850 border border-gold-300/20 hover:border-gold-300/50 p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-gold-400/10 border border-gold-300/30 flex items-center justify-center text-gold-300 mb-4 group-hover:scale-110 group-hover:border-gold-300 transition-all">
                  <Database size={22} />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gold-300 px-2 py-0.5 rounded-full bg-gold-400/10 border border-gold-300/20">
                    126 Karakter
                  </span>
                </div>
                <h3 className="text-lg font-bold text-parchment group-hover:text-gold-200 transition-colors mb-2">
                  Ensiklopedia Database
                </h3>
                <p className="text-xs text-parchment-dim leading-relaxed">
                  Daftar lengkap 126 karakter bintang 5 &amp; 4, senjata, material asensi, dan artefak peninggalan kuno Teyvat.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-gold-300/10 flex items-center justify-between text-xs font-semibold text-gold-300 group-hover:text-gold-200">
                <span>Eksplorasi Data</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 2: Archon Quests */}
            <Link
              href="/kategori/archon-quest"
              className="group relative bg-celestia-900/80 hover:bg-celestia-850 border border-gold-300/20 hover:border-gold-300/50 p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-cyan-300 mb-4 group-hover:scale-110 group-hover:border-cyan-300 transition-all">
                  <Scroll size={22} />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 px-2 py-0.5 rounded-full bg-cyan-400/10 border border-cyan-400/20">
                    Kisah Utama
                  </span>
                </div>
                <h3 className="text-lg font-bold text-parchment group-hover:text-gold-200 transition-colors mb-2">
                  Kronik Archon Quest
                </h3>
                <p className="text-xs text-parchment-dim leading-relaxed">
                  Transkrip dan kronik perjalanan Sang Pengelana mengungkap rahasia tatanan ilahi para Archon dari Mondstadt sampai Natlan.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-gold-300/10 flex items-center justify-between text-xs font-semibold text-cyan-300 group-hover:text-cyan-200">
                <span>Baca Kronik</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 3: Backstory & Japanese Audio */}
            <Link
              href="/kategori/character-backstory"
              className="group relative bg-celestia-900/80 hover:bg-celestia-850 border border-gold-300/20 hover:border-gold-300/50 p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center text-emerald-300 mb-4 group-hover:scale-110 group-hover:border-emerald-300 transition-all">
                  <Headphones size={22} />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 px-2 py-0.5 rounded-full bg-emerald-400/10 border border-emerald-400/20">
                    Audio Suara JP
                  </span>
                </div>
                <h3 className="text-lg font-bold text-parchment group-hover:text-gold-200 transition-colors mb-2">
                  Kisah &amp; Audio Karakter
                </h3>
                <p className="text-xs text-parchment-dim leading-relaxed">
                  Putar rekaman suara resmi pengisi suara (CV) Jepang dan dengarkan narasi otomatis tentang masa lalu tiap karakter.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-gold-300/10 flex items-center justify-between text-xs font-semibold text-emerald-300 group-hover:text-emerald-200">
                <span>Dengar Audio</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 4: Community & Theories */}
            <Link
              href="/community"
              className="group relative bg-celestia-900/80 hover:bg-celestia-850 border border-gold-300/20 hover:border-gold-300/50 p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-400/10 border border-purple-400/30 flex items-center justify-center text-purple-300 mb-4 group-hover:scale-110 group-hover:border-purple-300 transition-all">
                  <Globe size={22} />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 px-2 py-0.5 rounded-full bg-purple-400/10 border border-purple-400/20">
                    Forum Pengelana
                  </span>
                </div>
                <h3 className="text-lg font-bold text-parchment group-hover:text-gold-200 transition-colors mb-2">
                  Teori &amp; Komunitas
                </h3>
                <p className="text-xs text-parchment-dim leading-relaxed">
                  Diskusi mendalam mengenai misteri Langit Palsu Celestia, Tujuh Naga Penguasa, serta para Pendosa Khaenri&apos;ah.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-gold-300/10 flex items-center justify-between text-xs font-semibold text-purple-300 group-hover:text-purple-200">
                <span>Buka Forum</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>

          {/* ── 4. Statistik Ringkas Arsip Teyvat ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-2xl bg-celestia-950/70 border border-gold-300/15 backdrop-blur-md">
            <div className="text-center">
              <p className="text-2xl sm:text-4xl font-black text-gold-300 font-display">126</p>
              <p className="text-xs text-parchment-dim mt-1 font-medium">Karakter Playable (5★ &amp; 4★)</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-4xl font-black text-cyan-300 font-display">7</p>
              <p className="text-xs text-parchment-dim mt-1 font-medium">Bangsa Wilayah Teyvat</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-4xl font-black text-emerald-300 font-display">60+</p>
              <p className="text-xs text-parchment-dim mt-1 font-medium">Naskah Dokumen &amp; Kisah</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-4xl font-black text-purple-300 font-display">100%</p>
              <p className="text-xs text-parchment-dim mt-1 font-medium">Audio Jepang &amp; Narator AI</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gold Divider */}
      <div className="gold-divider" />

      {/* ── 5. Jelajahi 7 Bangsa Teyvat (The Seven Nations Showcase) ── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Compass size={14} className="text-gold-300" />
            <span className="text-gold-300 text-xs tracking-widest uppercase font-semibold">
              Eksplorasi Wilayah Teyvat
            </span>
          </div>
          <h2
            className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text mb-3"
            style={{
              fontFamily: "Cinzel, Georgia, serif",
              backgroundImage: "linear-gradient(135deg, #FFF1CE 0%, #E5BA69 50%, #C48E2E 100%)",
            }}
          >
            Tujuh Bangsa di Bawah Langit Teyvat
          </h2>
          <p className="text-parchment-dim text-sm sm:text-base">
            Setiap bangsa dipandu oleh filosofi ketuhanan yang berbeda, menyimpan peninggalan sakral dan naskah sejarah masing-masing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nations.map((nation) => (
            <div
              key={nation.name}
              className={`p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between ${nation.color}`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-celestia-900/60 border border-current/20">
                      {nation.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-parchment">{nation.name}</h3>
                      <p className="text-[11px] font-semibold text-gold-300/90">{nation.archon}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-celestia-900/80 border border-current/30">
                    {nation.element}
                  </span>
                </div>
                <p className="text-xs font-semibold text-parchment mb-2 italic">&ldquo;{nation.tagline}&rdquo;</p>
                <p className="text-xs text-parchment-dim leading-relaxed">{nation.desc}</p>
              </div>

              <div className="mt-5 pt-4 border-t border-current/10 flex items-center justify-between text-xs font-semibold">
                <Link
                  href="/kategori/archon-quest"
                  className="inline-flex items-center gap-1.5 hover:underline"
                >
                  <span>Lihat Naskah {nation.name}</span>
                  <ChevronRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Gold Divider */}
      <div className="gold-divider" />

      {/* ── 6. Sorotan Kisah Pilihan Editor (Hanya 4 Kisah, Bukan Seluruh Roster) ── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Scroll size={14} className="text-gold-300" />
              <span className="text-gold-300 text-xs tracking-widest uppercase font-semibold">
                Kurasi Cerita Unggulan
              </span>
            </div>
            <h2
              className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text"
              style={{
                fontFamily: "Cinzel, Georgia, serif",
                backgroundImage: "linear-gradient(135deg, #FFF1CE 0%, #E5BA69 50%, #C48E2E 100%)",
              }}
            >
              Sorotan Archon Quest &amp; Kronik Utama
            </h2>
            <p className="text-parchment-dim text-xs sm:text-sm mt-1">
              Pilihan babak paling menentukan yang mengubah takdir sejarah benua Teyvat.
            </p>
          </div>

          <Link
            href="/katalog"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-gold-300 hover:text-gold-200 transition-colors py-2 px-4 rounded-xl bg-celestia-800/80 hover:bg-celestia-750 border border-gold-300/30 group self-start sm:self-auto"
          >
            <span>Buka Semua Katalog (60+ Kisah)</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 4 Featured Story Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayStories.map((story) => (
            <StoryCard key={story.slug} story={story} />
          ))}
        </div>

        {/* Prominent CTA Box to Explore Full Catalog */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-celestia-900 via-celestia-850 to-celestia-900 border border-gold-300/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-gold-400/10 border border-gold-300/40 items-center justify-center text-gold-300 shrink-0">
              <FileText size={28} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-parchment mb-1">
                Mencari biografi dan suara dari 126 karakter atau misteri bangsa lainnya?
              </h3>
              <p className="text-xs text-parchment-dim">
                Seluruh naskah Story Quest, biografi Character Story 1–5, dan World Lore telah diarsipkan rapi dengan fitur pencarian dan filter wilayah.
              </p>
            </div>
          </div>

          <Link
            href="/katalog"
            className="shrink-0 inline-flex items-center gap-2.5 bg-gradient-to-r from-gold-500 to-gold-300 hover:from-gold-400 hover:to-gold-200 text-celestia-900 font-bold text-sm px-6 py-3 rounded-full transition-all hover:scale-105 active:scale-95 shadow-md"
          >
            <BookOpen size={16} />
            <span>Buka Seluruh Katalog Cerita →</span>
          </Link>
        </div>
      </section>

      {/* Gold Divider */}
      <div className="gold-divider" />

      {/* ── 7. Sorotan Teori Komunitas Terpanas ── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare size={14} className="text-purple-300" />
              <span className="text-purple-300 text-xs tracking-widest uppercase font-semibold">
                Ruang Teori &amp; Diskusi Pengelana
              </span>
            </div>
            <h2
              className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text"
              style={{
                fontFamily: "Cinzel, Georgia, serif",
                backgroundImage: "linear-gradient(135deg, #FFF1CE 0%, #E5BA69 50%, #C48E2E 100%)",
              }}
            >
              Teori Terpopuler Komunitas
            </h2>
            <p className="text-parchment-dim text-xs sm:text-sm mt-1">
              Analisis konspirasi mendalam yang sedang hangat diperdebatkan oleh para teoretikus Teyvat.
            </p>
          </div>

          <Link
            href="/community"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-purple-300 hover:text-purple-200 transition-colors py-2 px-4 rounded-xl bg-celestia-800/80 hover:bg-celestia-750 border border-purple-400/30 group self-start sm:self-auto"
          >
            <span>Masuk Forum Komunitas</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 3 Featured Theories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredTheories.map((theory) => (
            <Link
              key={theory.id}
              href={`/community`}
              className="group bg-celestia-900/90 hover:bg-celestia-850 border border-gold-300/15 hover:border-gold-300/40 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/9] overflow-hidden bg-celestia-950">
                  <img
                    src={theory.coverImageUrl}
                    alt={theory.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-celestia-950/80 backdrop-blur-md border border-gold-300/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-gold-300">
                    {theory.topic}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-3 text-[11px] text-parchment-muted mb-2.5">
                    <span>Oleh {theory.authorName}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {theory.readingTime}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm sm:text-base text-parchment group-hover:text-gold-200 transition-colors line-clamp-2 mb-2 leading-snug">
                    {theory.title}
                  </h3>

                  <p className="text-xs text-parchment-dim line-clamp-3 leading-relaxed">
                    {theory.summary}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-3 border-t border-gold-300/10 flex items-center justify-between text-xs text-parchment-muted">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-gold-300/80">
                    <Heart size={12} />
                    {theory.likesCount}
                  </span>
                  <span className="flex items-center gap-1 text-parchment-muted">
                    <MessageSquare size={12} />
                    {theory.commentsCount}
                  </span>
                </div>
                <span className="text-gold-300 font-semibold group-hover:underline flex items-center gap-1">
                  Baca Teori →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Gold Divider */}
      <div className="gold-divider" />

      {/* ── 8. Banner Kontribusi & Dukungan Komunitas ── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12 border border-gold-300/25 bg-gradient-to-br from-celestia-900 via-celestia-850 to-celestia-950 shadow-2xl">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-gold-400/5 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={16} className="text-gold-300" />
              <span className="text-gold-300 text-xs tracking-widest uppercase font-semibold">
                Kontribusi Terbuka
              </span>
            </div>

            <h2
              className="text-2xl sm:text-4xl font-bold text-transparent bg-clip-text mb-4"
              style={{
                fontFamily: "Cinzel, Georgia, serif",
                backgroundImage: "linear-gradient(135deg, #FFF1CE 0%, #E5BA69 50%, #C48E2E 100%)",
              }}
            >
              Punya Analisis atau Teori Lore Sendiri?
            </h2>

            <p className="text-parchment-dim text-sm sm:text-base leading-relaxed mb-8">
              Teyvat Lore adalah arsip yang tumbuh bersama komunitas pecinta Genshin Impact Indonesia.
              Kirimkan catatan riset, teori konspirasi, atau analisis mendalam Anda untuk ditampilkan di portal ini.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/buat-lore"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-500 to-gold-300 hover:from-gold-400 hover:to-gold-200 text-celestia-900 font-bold text-sm px-6 py-3 rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg"
              >
                <Sparkles size={15} />
                + Tulis Teori Baru
              </Link>

              <Link
                href="/tentang"
                className="inline-flex items-center gap-2 bg-celestia-800 hover:bg-celestia-750 text-gold-300 border border-gold-300/30 font-bold text-sm px-6 py-3 rounded-full transition-all hover:scale-105 active:scale-95"
              >
                <Users size={15} />
                Tentang Teyvat Lore
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. Footer ── */}
      <footer className="border-t border-gold-300/10 py-10 text-center text-parchment-muted text-sm bg-celestia-950">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles size={15} className="text-gold-300" />
            <span
              className="text-gold-300 font-bold tracking-widest text-sm"
              style={{ fontFamily: "Cinzel, Georgia, serif" }}
            >
              Teyvat Lore
            </span>
          </div>

          <p className="text-xs text-parchment-dim max-w-md mx-auto mb-4">
            Arsip independen naskah cerita, database karakter 5★ &amp; 4★, suara karakter Jepang, dan forum teori Genshin Impact.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-xs text-parchment-muted mb-6">
            <Link href="/" className="hover:text-gold-300 transition-colors">Beranda</Link>
            <Link href="/database" className="hover:text-gold-300 transition-colors">Database (126 Char)</Link>
            <Link href="/katalog" className="hover:text-gold-300 transition-colors">Katalog Cerita</Link>
            <Link href="/community" className="hover:text-gold-300 transition-colors">Komunitas</Link>
            <Link href="/tentang" className="hover:text-gold-300 transition-colors">Tentang Proyek</Link>
          </div>

          <p className="text-[11px] text-parchment-muted/60">
            Dibuat dengan ✦ oleh komunitas pengelana Teyvat Indonesia. Genshin Impact dan seluruh materi hak cipta milik HoYoverse.
          </p>
        </div>
      </footer>
    </>
  );
}
