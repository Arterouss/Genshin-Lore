import Link from "next/link";
import { Sparkles, BookOpen, Headphones, Globe, ArrowRight, Heart, Users, Database } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang Teyvat Lore — Visi & Komunitas Pengelana",
  description: "Mengenal proyek arsip ensiklopedia, naskah cerita, dan suara karakter Genshin Impact untuk komunitas pengelana Indonesia.",
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
          Platform ensiklopedia dan arsip mandiri yang didedikasikan untuk membantu komunitas
          pengelana Genshin Impact Indonesia menikmati kekayaan kisah dunia Teyvat.
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
            Dunia Teyvat memiliki sejarah ribuan tahun yang luar biasa kaya dan mendalam. Namun, naskah kisah di dalam game sering kali sangat panjang, tersebar di ratusan buku, deskripsi artefak, material senjata, dan dialog quest yang berbelit-belit. Banyak pemain di Indonesia yang kesulitan mengikuti intisari cerita karena keterbatasan waktu bermain.
          </p>
          <p className="mb-4">
            Didorong oleh kecintaan mendalam terhadap dunia Genshin Impact dan komitmen tulus untuk <strong>membantu komunitas pengelana Indonesia</strong>, kami membangun <strong>Teyvat Lore</strong>. Platform ini dirancang sebagai rumah bacaan terstruktur yang merangkum babak-babak penting Archon Quest, biografi karakter, dan ensiklopedia peninggalan kuno tanpa menghilangkan keindahan emosional maupun misteri filosofisnya.
          </p>
          <p>
            Dengan memisahkan alur cerita petualangan dan database karakter secara rapi, kami berharap setiap pengelana—baik pemain baru maupun veteran teoretikus—dapat dengan mudah memahami jalan cerita dan menemukan jawaban atas misteri besar Teyvat.
          </p>
        </section>

        {/* 3 Pilar Utama */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-celestia-800 border border-gold-300/15 rounded-xl p-5">
            <div className="w-9 h-9 rounded-full bg-gold-300/15 text-gold-300 flex items-center justify-center mb-3">
              <BookOpen size={18} />
            </div>
            <h3 className="text-gold-200 font-semibold mb-2 font-display">Arsip Terstruktur</h3>
            <p className="text-xs text-parchment-muted leading-relaxed">
              Alur cerita dirangkum babak per babak secara kronologis, memudahkan Anda menyegarkan ingatan sebelum update patch terbaru tiba.
            </p>
          </div>

          <div className="bg-celestia-800 border border-gold-300/15 rounded-xl p-5">
            <div className="w-9 h-9 rounded-full bg-emerald-400/15 text-emerald-300 flex items-center justify-center mb-3">
              <Headphones size={18} />
            </div>
            <h3 className="text-gold-200 font-semibold mb-2 font-display">Audio Karakter &amp; AI</h3>
            <p className="text-xs text-parchment-muted leading-relaxed">
              Dengarkan rekaman suara resmi seiyuu Jepang dari para karakter serta narator suara AI otomatis untuk menemani saat santai.
            </p>
          </div>

          <div className="bg-celestia-800 border border-gold-300/15 rounded-xl p-5">
            <div className="w-9 h-9 rounded-full bg-anemo/15 text-anemo flex items-center justify-center mb-3">
              <Database size={18} />
            </div>
            <h3 className="text-gold-200 font-semibold mb-2 font-display">Database 126 Karakter</h3>
            <p className="text-xs text-parchment-muted leading-relaxed">
              Ensiklopedia lengkap seluruh karakter playable 5★ &amp; 4★, senjata, dan material dengan sistem multi-filter dan pencarian instan.
            </p>
          </div>
        </div>

        {/* Kontribusi Komunitas */}
        <section className="bg-celestia-800/60 border border-gold-300/15 rounded-2xl p-6 sm:p-8">
          <h2
            className="text-xl font-bold text-gold-200 mb-3"
            style={{ fontFamily: "Cinzel, Georgia, serif" }}
          >
            ✦ Kolaborasi Bersama Komunitas
          </h2>
          <p className="mb-4 text-parchment-dim text-sm leading-relaxed">
            Teyvat Lore adalah arsip yang tumbuh bersama komunitas pecinta Genshin Impact Indonesia. Kami mengundang setiap pengelana untuk berdiskusi di forum, menguji teori konspirasi baru tentang Langit Palsu atau Khaenri&apos;ah, serta mengirimkan analisis mendalam melalui fitur postingan komunitas.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/buat-lore"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gold-400/20 hover:bg-gold-400/30 border border-gold-400/40 text-gold-200 text-xs font-bold transition-colors"
            >
              <Sparkles size={14} />
              <span>+ Tulis Postingan Teori Baru</span>
            </Link>
            <Link
              href="/community"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-celestia-700 hover:bg-celestia-600 text-parchment text-xs font-semibold transition-colors"
            >
              <Users size={14} />
              <span>Masuk Forum Komunitas</span>
            </Link>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center pt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-500 to-gold-300 hover:from-gold-400 hover:to-gold-200 text-celestia-900 font-bold text-sm px-6 py-3 rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            Mulai Menjelajahi Arsip
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
