import Link from "next/link";
import { Sparkles, BookOpen, Headphones, Globe, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang Teyvat Lore — Visi & Cara Penggunaan",
  description: "Mengenal proyek arsip ringkasan dan audio lore Genshin Impact berbahasa Indonesia.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 text-xs text-gold-300 tracking-[0.3em] uppercase bg-gold-300/10 border border-gold-300/20 px-3 py-1 rounded-full mb-4">
          <Sparkles size={12} />
          Tentang Proyek
        </div>
        <h1
          className="text-3xl sm:text-5xl font-bold text-gold-200 glow-gold-text mb-4"
          style={{ fontFamily: "Cinzel, Georgia, serif" }}
        >
          Teyvat Lore
        </h1>
        <p className="text-parchment-dim text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Platform arsip mandiri yang menghadirkan ringkasan cerita dan narasi audio
          Genshin Impact dalam Bahasa Indonesia.
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-8 text-parchment-dim text-sm sm:text-base leading-relaxed">
        {/* Latar Belakang */}
        <section className="bg-scroll-800 border border-gold-300/15 rounded-2xl p-6 sm:p-8 primogem-corner">
          <h2
            className="text-xl font-bold text-gold-200 mb-3"
            style={{ fontFamily: "Cinzel, Georgia, serif" }}
          >
            ✦ Mengapa Proyek Ini Lahir?
          </h2>
          <p className="mb-4">
            Dunia Teyvat memiliki sejarah ribuan tahun yang luar biasa kaya. Namun, naskah cerita di dalam game sering kali sangat panjang, tersebar di ratusan buku, deskripsi artefak, dan dialog berbelit-belit. Banyak pemain yang melewatkan intisari cerita karena keterbatasan waktu.
          </p>
          <p>
            Terinspirasi dari inisiatif komunitas seperti <em>Echoes of Solaris</em> di Wuthering Waves, kami membangun <strong>Teyvat Lore</strong> sebagai rumah bacaan ringkas (10–25 menit) yang menyajikan inti cerita tanpa menghilangkan bobot emosional dan kedalaman misteri Teyvat.
          </p>
        </section>

        {/* 3 Pilar Utama */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-celestia-800 border border-gold-300/15 rounded-xl p-5">
            <div className="w-9 h-9 rounded-full bg-gold-300/15 text-gold-300 flex items-center justify-center mb-3">
              <BookOpen size={18} />
            </div>
            <h3 className="text-gold-200 font-semibold mb-2 font-display">Mode Ringkas</h3>
            <p className="text-xs text-parchment-muted leading-relaxed">
              Dirangkum terstruktur dalam babak-babak utama, cocok untuk kilas balik sebelum update patch baru.
            </p>
          </div>

          <div className="bg-celestia-800 border border-gold-300/15 rounded-xl p-5">
            <div className="w-9 h-9 rounded-full bg-anemo/15 text-anemo flex items-center justify-center mb-3">
              <Headphones size={18} />
            </div>
            <h3 className="text-gold-200 font-semibold mb-2 font-display">Mode Audio AI</h3>
            <p className="text-xs text-parchment-muted leading-relaxed">
              Dengarkan narator berbicara seperti podcast via Google NotebookLM sambil bersantai atau di perjalanan.
            </p>
          </div>

          <div className="bg-celestia-800 border border-gold-300/15 rounded-xl p-5">
            <div className="w-9 h-9 rounded-full bg-hydro/15 text-hydro flex items-center justify-center mb-3">
              <Globe size={18} />
            </div>
            <h3 className="text-gold-200 font-semibold mb-2 font-display">Sumber EN & 中文</h3>
            <p className="text-xs text-parchment-muted leading-relaxed">
              Membandingkan teks asli bahasa Mandarin dengan Inggris agar makna dan nuansa filosofis tidak hilang.
            </p>
          </div>
        </div>

        {/* Cara Menambah Cerita Baru */}
        <section className="bg-celestia-800/60 border border-gold-300/15 rounded-2xl p-6 sm:p-8">
          <h2
            className="text-xl font-bold text-gold-200 mb-3"
            style={{ fontFamily: "Cinzel, Georgia, serif" }}
          >
            ✦ Cara Menambahkan Cerita Baru
          </h2>
          <p className="mb-3 text-parchment-dim text-sm">
            Semua artikel tersimpan dalam format file <code>.md</code> di folder <code>content/stories/</code>. Anda juga bisa menjalankan scraper otomatis untuk memperbarui data dari Fandom Wiki kapan saja:
          </p>
          <div className="bg-celestia-950 rounded-xl p-4 font-mono text-xs text-gold-300 overflow-x-auto">
            <code>node scripts/scrape-wiki.mjs --character "NamaKarakter"</code>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center pt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-500 to-gold-300 hover:from-gold-400 hover:to-gold-200 text-celestia-900 font-bold text-sm px-6 py-3 rounded-full transition-all"
          >
            Mulai Menjelajahi Arsip
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

