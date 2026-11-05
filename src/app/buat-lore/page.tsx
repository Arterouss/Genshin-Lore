"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Send,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  Eye,
  PenLine,
  ArrowLeft,
  Upload,
} from "lucide-react";
import { createCommunityLore, uploadCoverImage } from "@/lib/community";

// Rekomendasi topik populer (hanya saran, pengguna bebas mengetik apa saja!)
const SUGGESTED_TOPICS = [
  "Lore Naga Purba",
  "Celestia & Primordial One",
  "Misteri Khaenri'ah",
  "Fatui & Tsaritsa",
  "Kembaran Abyss",
  "Irminsul & Pohon Dunia",
  "Seelie & Bangsa Kuno",
  "Dewa-Dewa Perang Archon",
];

export default function BuatLorePage() {
  const [title, setTitle] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [topic, setTopic] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [previewCover, setPreviewCover] = useState<string>("");

  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Handle upload file gambar
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      setErrorMsg("Ukuran gambar terlalu besar! Maksimal 3 MB.");
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      setErrorMsg("Format gambar harus JPG, PNG, atau WEBP.");
      return;
    }

    setErrorMsg("");
    setCoverFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewCover(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Sanitasi teks naskah untuk mencegah XSS
  const sanitizeInput = (text: string): string => {
    return text
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/on\w+="[^"]*"/gi, "")
      .replace(/javascript:[^"']*/gi, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Validasi Form
    if (title.trim().length < 10) {
      setErrorMsg("Judul minimal 10 karakter.");
      return;
    }
    if (authorName.trim().length < 2) {
      setErrorMsg("Nama penulis minimal 2 karakter.");
      return;
    }
    if (!topic.trim()) {
      setErrorMsg("Topik teori/lore wajib diisi (bebas, misal: 'Lore Naga Purba').");
      return;
    }
    if (content.trim().length < 150) {
      setErrorMsg("Isi naskah minimal 150 karakter agar cerita bermakna dan lengkap.");
      return;
    }

    // Rate-limit anti-spam sederhana (cooldown 60 detik)
    const lastSubmit = localStorage.getItem("teyvat_last_submit_time");
    if (lastSubmit) {
      const diff = Date.now() - parseInt(lastSubmit, 10);
      if (diff < 60000) {
        const remaining = Math.ceil((60000 - diff) / 1000);
        setErrorMsg(`Tunggu ${remaining} detik lagi sebelum mengirim postingan berikutnya (Anti-Spam).`);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      let finalCover = coverUrl.trim();

      // Upload file jika user memilih unggah foto
      if (coverFile) {
        finalCover = await uploadCoverImage(coverFile);
      }

      // Olah tags
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim().replace(/^#/, ""))
        .filter(Boolean);

      const cleanedContent = sanitizeInput(content);
      const cleanedTitle = sanitizeInput(title);
      const cleanedAuthor = sanitizeInput(authorName);
      const cleanedTopic = sanitizeInput(topic);
      const cleanedSummary = summary.trim()
        ? sanitizeInput(summary)
        : cleanedContent.slice(0, 180) + "...";

      await createCommunityLore({
        title: cleanedTitle,
        slug: "", // akan di-generate oleh createCommunityLore
        authorName: cleanedAuthor,
        topic: cleanedTopic,
        summary: cleanedSummary,
        content: cleanedContent,
        coverImageUrl: finalCover || undefined,
        tags: tags.length > 0 ? tags : [cleanedTopic],
      });

      localStorage.setItem("teyvat_last_submit_time", Date.now().toString());
      setIsSuccess(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan";
      setErrorMsg("Gagal mengirim postingan: " + message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Tombol Kembali */}
      <Link
        href="/community"
        className="inline-flex items-center gap-2 text-sm text-parchment-dim hover:text-gold-300 transition-colors mb-6"
      >
        <ArrowLeft size={16} /> Kembali ke Community Lore
      </Link>

      {/* Header Form */}
      <div className="relative mb-8 p-6 sm:p-8 rounded-2xl bg-celestia-900/60 border border-gold-300/20 backdrop-blur-sm overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-300/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="text-gold-300" size={18} />
          <span className="text-xs uppercase tracking-widest text-gold-300 font-semibold">
            Laboratorium Teori Teyvat
          </span>
        </div>
        <h1
          className="text-2xl sm:text-3xl font-bold text-parchment tracking-wide mb-2"
          style={{ fontFamily: "Cinzel, Georgia, serif" }}
        >
          Tulis & Bagikan Lore Komunitas
        </h1>
        <p className="text-sm text-parchment-dim max-w-2xl leading-relaxed">
          Punya teori tentang Naga Purba, rahasia Celestia, atau sejarah masa lalu suatu karakter?
          Tulis naskahmu di sini. Setiap naskah akan diverifikasi oleh Admin demi menjaga kualitas
          arsip sebelum dipublikasikan untuk dibaca seluruh pengelana!
        </p>
      </div>

      {/* Pesan Sukses */}
      {isSuccess ? (
        <div className="p-8 rounded-2xl bg-celestia-900/80 border border-emerald-500/30 text-center animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 size={36} />
          </div>
          <h2
            className="text-2xl font-bold text-parchment mb-2"
            style={{ fontFamily: "Cinzel, Georgia, serif" }}
          >
            Naskah Berhasil Dikirim!
          </h2>
          <p className="text-sm text-parchment-dim max-w-lg mx-auto mb-6 leading-relaxed">
            Terima kasih atas kontribusi pengetahuanmu! Naskah telah masuk ke antrean verifikasi
            moderator. Setelah disetujui, ceritamu akan langsung tayang di etalase{" "}
            <span className="text-gold-300">Community Lore</span>.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/community"
              className="px-6 py-2.5 rounded-xl bg-gold-400 text-celestia-950 font-semibold hover:bg-gold-300 transition-colors shadow-lg shadow-gold-400/20 text-sm"
            >
              Lihat Halaman Komunitas
            </Link>
            <button
              onClick={() => {
                setIsSuccess(false);
                setTitle("");
                setTopic("");
                setContent("");
                setSummary("");
                setTagsInput("");
                setCoverFile(null);
                setPreviewCover("");
                setCoverUrl("");
              }}
              className="px-5 py-2.5 rounded-xl bg-celestia-800 text-parchment border border-gold-300/20 hover:border-gold-300/40 text-sm transition-colors"
            >
              Tulis Cerita Lainnya
            </button>
          </div>
        </div>
      ) : (
        /* Form Input */
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-3">
              <AlertTriangle size={18} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Tab Edit / Preview */}
          <div className="flex items-center justify-between border-b border-gold-300/10 pb-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("edit")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "edit"
                    ? "bg-gold-300/15 text-gold-300 border border-gold-300/30"
                    : "text-parchment-dim hover:text-parchment"
                }`}
              >
                <PenLine size={16} /> Mode Tulis
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("preview")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "preview"
                    ? "bg-gold-300/15 text-gold-300 border border-gold-300/30"
                    : "text-parchment-dim hover:text-parchment"
                }`}
              >
                <Eye size={16} /> Pratinjau Tampilan
              </button>
            </div>
            <span className="text-xs text-parchment-muted hidden sm:inline">
              Mendukung format Markdown (*miring*, **tebal**, # judul)
            </span>
          </div>

          {activeTab === "edit" ? (
            <>
              {/* Judul & Penulis */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-parchment-dim">
                    Judul Naskah / Teori <span className="text-gold-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Misteri Asal-Usul Naga Hydro dan Tahta Celestia"
                    className="w-full px-4 py-3 rounded-xl bg-celestia-900/80 border border-gold-300/20 text-parchment placeholder-parchment-muted/50 focus:outline-none focus:border-gold-300 transition-colors text-sm"
                  />
                  <div className="flex justify-between text-[11px] text-parchment-muted">
                    <span>Buat judul yang menarik rasa ingin tahu</span>
                    <span>{title.length}/120</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-parchment-dim">
                    Nama / Nickname <span className="text-gold-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Misal: Traveler_07"
                    className="w-full px-4 py-3 rounded-xl bg-celestia-900/80 border border-gold-300/20 text-parchment placeholder-parchment-muted/50 focus:outline-none focus:border-gold-300 transition-colors text-sm"
                  />
                </div>
              </div>

              {/* Topik Lore (Ditulis Bebas) */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-parchment-dim flex items-center justify-between">
                  <span>
                    Topik / Kategori Teori (Ditulis Bebas) <span className="text-gold-400">*</span>
                  </span>
                  <span className="text-[11px] text-parchment-muted font-normal">
                    Ketik bebas apa saja sesuai tema
                  </span>
                </label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Contoh: Lore Naga Purba, Teori Celestia, Sejarah Khaenri'ah..."
                  className="w-full px-4 py-3 rounded-xl bg-celestia-900/80 border border-gold-300/20 text-parchment placeholder-parchment-muted/50 focus:outline-none focus:border-gold-300 transition-colors text-sm"
                />

                {/* Chip Rekomendasi Topik Cepat */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[11px] text-parchment-muted">Saran Cepat:</span>
                  {SUGGESTED_TOPICS.map((suggested) => (
                    <button
                      key={suggested}
                      type="button"
                      onClick={() => setTopic(suggested)}
                      className={`text-[11px] px-2.5 py-1 rounded-full transition-colors border ${
                        topic === suggested
                          ? "bg-gold-300/20 text-gold-300 border-gold-300/50"
                          : "bg-celestia-800/80 text-parchment-dim border-gold-300/10 hover:border-gold-300/30 hover:text-parchment"
                      }`}
                    >
                      +{suggested}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gambar Sampul (Upload atau URL) */}
              <div className="space-y-3 p-4 rounded-xl bg-celestia-900/40 border border-gold-300/10">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-parchment-dim flex items-center gap-1.5">
                    <ImageIcon size={14} className="text-gold-300" />
                    Gambar Sampul (Opsional)
                  </label>
                  <span className="text-[11px] text-parchment-muted">Maksimal 3 MB</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Pilihan 1: Upload File */}
                  <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gold-300/20 hover:border-gold-300/40 rounded-xl cursor-pointer bg-celestia-850/40 transition-colors group">
                    <Upload
                      size={24}
                      className="text-gold-300/60 group-hover:text-gold-300 transition-colors mb-1"
                    />
                    <span className="text-xs text-parchment group-hover:text-gold-200">
                      {coverFile ? coverFile.name : "Pilih Berkas Gambar"}
                    </span>
                    <span className="text-[10px] text-parchment-muted mt-0.5">
                      JPG, PNG, atau WEBP
                    </span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>

                  {/* Pilihan 2: Paste URL */}
                  <div className="flex flex-col justify-center space-y-1.5">
                    <span className="text-[11px] text-parchment-muted">Atau masukkan URL gambar:</span>
                    <input
                      type="url"
                      value={coverUrl}
                      onChange={(e) => {
                        setCoverUrl(e.target.value);
                        setPreviewCover(e.target.value);
                      }}
                      placeholder="https://..."
                      className="w-full px-3 py-2 rounded-lg bg-celestia-900 border border-gold-300/20 text-parchment text-xs placeholder-parchment-muted/40 focus:outline-none focus:border-gold-300"
                    />
                  </div>
                </div>

                {previewCover && (
                  <div className="relative mt-2 rounded-lg overflow-hidden h-36 border border-gold-300/20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewCover}
                      alt="Pratinjau Sampul"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setCoverFile(null);
                        setPreviewCover("");
                        setCoverUrl("");
                      }}
                      className="absolute top-2 right-2 px-2 py-1 bg-celestia-950/80 rounded text-[10px] text-rose-300 hover:text-rose-100"
                    >
                      Hapus
                    </button>
                  </div>
                )}
              </div>

              {/* Ringkasan Singkat */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-parchment-dim flex items-center justify-between">
                  <span>Intisari / Sinopsis Singkat (Opsional)</span>
                  <span className="text-[11px] text-parchment-muted font-normal">
                    Ditampilkan di kartu preview
                  </span>
                </label>
                <input
                  type="text"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Ringkasan 1-2 kalimat dari teori atau ceritamu..."
                  className="w-full px-4 py-3 rounded-xl bg-celestia-900/80 border border-gold-300/20 text-parchment placeholder-parchment-muted/50 focus:outline-none focus:border-gold-300 transition-colors text-sm"
                />
              </div>

              {/* Tagar */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-parchment-dim">
                  Tagar (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Contoh: Naga Purba, Neuvillette, Fontaine, Celestia"
                  className="w-full px-4 py-3 rounded-xl bg-celestia-900/80 border border-gold-300/20 text-parchment placeholder-parchment-muted/50 focus:outline-none focus:border-gold-300 transition-colors text-sm"
                />
              </div>

              {/* Isi Naskah Markdown */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-parchment-dim">
                    Naskah Lengkap / Deskripsi Lore <span className="text-gold-400">*</span>
                  </label>
                  <span
                    className={`text-xs ${
                      content.length >= 150 ? "text-emerald-400" : "text-amber-400"
                    }`}
                  >
                    {content.length} karakter (Min. 150)
                  </span>
                </div>
                <textarea
                  required
                  rows={14}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tuliskan ceritamu di sini secara runut...&#10;&#10;Contoh format Markdown:&#10;### Bagian 1: Asal-Usul Permulaan&#10;Ceritakan awal mula peristiwa...&#10;&#10;> Kutipan penting dalam game&#10;&#10;### Bagian 2: Teori & Bukti Dalam Game&#10;Paparkan dialog item atau buku Teyvat..."
                  className="w-full px-4 py-3 rounded-xl bg-celestia-900/80 border border-gold-300/20 text-parchment placeholder-parchment-muted/40 focus:outline-none focus:border-gold-300 transition-colors text-sm font-mono leading-relaxed"
                />
              </div>

              {/* Tombol Kirim */}
              <div className="pt-4 border-t border-gold-300/10 flex items-center justify-between flex-wrap gap-4">
                <p className="text-xs text-parchment-muted">
                  🛡️ Dilindungi verifikasi moderator untuk menjaga komunitas tetap sehat & bebas spam.
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 rounded-xl bg-gold-400 text-celestia-950 font-bold hover:bg-gold-300 transition-all shadow-lg shadow-gold-400/20 flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={16} />
                  {isSubmitting ? "Mengirim Naskah..." : "Kirim Naskah untuk Ditinjau"}
                </button>
              </div>
            </>
          ) : (
            /* Tab Pratinjau */
            <div className="p-6 sm:p-8 rounded-2xl bg-celestia-900/60 border border-gold-300/20 space-y-6">
              {previewCover && (
                <div className="w-full h-64 rounded-xl overflow-hidden border border-gold-300/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewCover}
                    alt="Pratinjau Sampul"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gold-300/15 text-gold-300 border border-gold-300/30 uppercase tracking-wider mb-3">
                  {topic || "Topik Teori"}
                </span>
                <h1
                  className="text-2xl sm:text-3xl font-bold text-parchment mb-2"
                  style={{ fontFamily: "Cinzel, Georgia, serif" }}
                >
                  {title || "Judul Naskah Belum Diisi"}
                </h1>
                <p className="text-xs text-parchment-dim">
                  Ditulis oleh:{" "}
                  <span className="text-gold-300 font-semibold">{authorName || "Pengelana"}</span>
                </p>
              </div>

              <div className="gold-divider" />

              {/* Render naskah */}
              <div className="prose-teyvat text-parchment/90 whitespace-pre-wrap leading-relaxed text-sm">
                {content || "Isi naskah masih kosong. Silakan tulis di Mode Tulis."}
              </div>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
