"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  CheckCircle,
  XCircle,
  Trash2,
  RefreshCw,
  Eye,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import {
  getAllLoresForAdmin,
  updateLoreStatus,
  deleteLore,
} from "@/lib/community";
import { CommunityLore } from "@/types/community";

const DEFAULT_PIN = process.env.NEXT_PUBLIC_ADMIN_PIN || "teyvat2026";

export default function AdminModerationPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [loginError, setLoginError] = useState("");

  const [lores, setLores] = useState<CommunityLore[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"pending" | "approved">("pending");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string>("");

  // Cek apakah sudah pernah login di sesi ini
  useEffect(() => {
    const sessionAuth = sessionStorage.getItem("teyvat_admin_auth");
    if (sessionAuth === "true") {
      setIsAuthenticated(true);
      fetchLores();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === DEFAULT_PIN) {
      setIsAuthenticated(true);
      sessionStorage.setItem("teyvat_admin_auth", "true");
      setLoginError("");
      fetchLores();
    } else {
      setLoginError("PIN Admin salah! Silakan coba lagi.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("teyvat_admin_auth");
    setIsAuthenticated(false);
    setPinInput("");
  };

  const fetchLores = async () => {
    setLoading(true);
    try {
      const data = await getAllLoresForAdmin();
      setLores(data);
    } catch (e) {
      console.error("Gagal mengambil data:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string, title: string) => {
    if (!confirm(`Setujui naskah "${title}" untuk dipublikasikan ke publik?`)) return;
    try {
      await updateLoreStatus(id, "approved");
      setActionMessage(`Naskah "${title}" berhasil disetujui!`);
      setTimeout(() => setActionMessage(""), 4000);
      fetchLores();
    } catch (e) {
      console.error(e);
      alert("Gagal menyetujui naskah.");
    }
  };

  const handleReject = async (id: string, title: string) => {
    if (!confirm(`Hapus/tolak naskah "${title}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    try {
      await deleteLore(id);
      setActionMessage(`Naskah "${title}" telah dihapus.`);
      setTimeout(() => setActionMessage(""), 4000);
      fetchLores();
    } catch (e) {
      console.error(e);
      alert("Gagal menghapus naskah.");
    }
  };

  const pendingList = lores.filter((item) => item.status === "pending");
  const approvedList = lores.filter((item) => item.status === "approved");

  // Jika belum login, tampilkan layar PIN
  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md p-8 rounded-2xl bg-celestia-900/90 border border-gold-300/30 backdrop-blur-md shadow-2xl relative">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gold-400/10 border border-gold-400/30 flex items-center justify-center text-gold-300">
            <Lock size={28} />
          </div>

          <h1
            className="text-xl font-bold text-center text-parchment mb-1"
            style={{ fontFamily: "Cinzel, Georgia, serif" }}
          >
            Portal Moderasi Teyvat
          </h1>
          <p className="text-xs text-center text-parchment-dim mb-6">
            Masukkan PIN Admin untuk meninjau dan mempublikasikan karya lore komunitas.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="p-3 rounded-lg bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs text-center">
                {loginError}
              </div>
            )}

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-parchment-dim block mb-1.5">
                PIN Rahasia Admin
              </label>
              <input
                type="password"
                required
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-celestia-950 border border-gold-300/30 text-parchment text-center text-base tracking-widest focus:outline-none focus:border-gold-300"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gold-400 text-celestia-950 font-bold hover:bg-gold-300 transition-colors text-sm shadow-lg shadow-gold-400/20"
            >
              Masuk ke Ruang Moderasi
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-parchment-muted hover:text-gold-300 transition-colors"
            >
              <ArrowLeft size={14} /> Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard Moderasi Admin
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Header Admin */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8 pb-6 border-b border-gold-300/15">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="text-emerald-400" size={20} />
            <span className="text-xs uppercase tracking-widest text-gold-300 font-semibold">
              Panel Verifikasi Pengawas Irminsul
            </span>
          </div>
          <h1
            className="text-2xl sm:text-3xl font-bold text-parchment"
            style={{ fontFamily: "Cinzel, Georgia, serif" }}
          >
            Moderasi Konten Komunitas
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchLores}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-celestia-800 text-parchment border border-gold-300/20 hover:border-gold-300/40 text-xs transition-colors"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Segarkan
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-rose-950/40 text-rose-300 border border-rose-500/30 hover:bg-rose-900/60 text-xs transition-colors"
          >
            Keluar (Logout)
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-2 animate-fade-in">
          <CheckCircle size={18} />
          {actionMessage}
        </div>
      )}

      {/* Statistik Ringkas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-celestia-900/60 border border-amber-500/20">
          <div className="text-xs text-amber-300/80 uppercase font-semibold tracking-wider mb-1">
            Menunggu Persetujuan
          </div>
          <div className="text-3xl font-bold text-amber-400">{pendingList.length}</div>
        </div>
        <div className="p-5 rounded-2xl bg-celestia-900/60 border border-emerald-500/20">
          <div className="text-xs text-emerald-300/80 uppercase font-semibold tracking-wider mb-1">
            Sudah Terbit (Publik)
          </div>
          <div className="text-3xl font-bold text-emerald-400">{approvedList.length}</div>
        </div>
        <div className="p-5 rounded-2xl bg-celestia-900/60 border border-gold-300/20 col-span-2 sm:col-span-1">
          <div className="text-xs text-gold-300/80 uppercase font-semibold tracking-wider mb-1">
            Total Semua Kiriman
          </div>
          <div className="text-3xl font-bold text-gold-300">{lores.length}</div>
        </div>
      </div>

      {/* Tabs Pending vs Approved */}
      <div className="flex items-center gap-2 mb-6 border-b border-gold-300/10 pb-3">
        <button
          onClick={() => setActiveTab("pending")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
            activeTab === "pending"
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
              : "text-parchment-dim hover:text-parchment"
          }`}
        >
          <span>Antrean Pending</span>
          <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs">
            {pendingList.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("approved")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
            activeTab === "approved"
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
              : "text-parchment-dim hover:text-parchment"
          }`}
        >
          <span>Sudah Tayang</span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-xs">
            {approvedList.length}
          </span>
        </button>
      </div>

      {/* Konten Tab */}
      {loading ? (
        <div className="text-center py-16 text-parchment-muted text-sm flex items-center justify-center gap-2">
          <RefreshCw size={18} className="animate-spin text-gold-300" />
          Memuat data naskah...
        </div>
      ) : activeTab === "pending" ? (
        pendingList.length === 0 ? (
          <div className="text-center py-16 p-8 rounded-2xl bg-celestia-900/40 border border-gold-300/10">
            <CheckCircle size={40} className="mx-auto mb-3 text-emerald-400/70" />
            <p className="text-base font-semibold text-parchment mb-1">
              Antrean Bersih! Tidak Ada Naskah Pending
            </p>
            <p className="text-xs text-parchment-dim">
              Semua naskah kiriman pengguna telah ditinjau atau belum ada kiriman baru.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingList.map((item) => {
              const isExpanded = expandedId === item.id;
              return (
                <div
                  key={item.id}
                  className="p-6 rounded-2xl bg-celestia-900/70 border border-amber-500/30 space-y-4"
                >
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/15 text-amber-300 border border-amber-400/30 uppercase tracking-wider">
                          {item.topic}
                        </span>
                        <span className="text-xs text-parchment-muted">
                          {new Date(item.createdAt).toLocaleString("id-ID")}
                        </span>
                      </div>
                      <h3
                        className="text-lg font-bold text-parchment"
                        style={{ fontFamily: "Cinzel, Georgia, serif" }}
                      >
                        {item.title}
                      </h3>
                      <p className="text-xs text-parchment-dim">
                        Penulis: <span className="text-gold-300 font-semibold">{item.authorName}</span>
                      </p>
                    </div>

                    {/* Tombol Aksi */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApprove(item.id!, item.title)}
                        className="px-4 py-2 rounded-xl bg-emerald-500 text-celestia-950 font-bold hover:bg-emerald-400 text-xs flex items-center gap-1.5 transition-colors shadow-lg shadow-emerald-500/20"
                      >
                        <CheckCircle size={15} /> Setujui (Tayang)
                      </button>
                      <button
                        onClick={() => handleReject(item.id!, item.title)}
                        className="px-3.5 py-2 rounded-xl bg-rose-950/60 text-rose-300 border border-rose-500/40 hover:bg-rose-900 text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <Trash2 size={15} /> Tolak & Hapus
                      </button>
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : item.id!)}
                        className="p-2 rounded-xl bg-celestia-800 text-parchment-dim hover:text-gold-300 border border-gold-300/10 text-xs transition-colors"
                        title="Lihat isi lengkap"
                      >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Ringkasan */}
                  <p className="text-xs text-parchment-dim bg-celestia-950/60 p-3 rounded-xl border border-gold-300/10">
                    <strong className="text-parchment">Sinopsis:</strong> {item.summary}
                  </p>

                  {/* Isi Lengkap jika Di-expand */}
                  {isExpanded && (
                    <div className="pt-4 border-t border-gold-300/10 space-y-4">
                      {item.coverImageUrl && (
                        <div className="h-48 rounded-xl overflow-hidden border border-gold-300/20">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.coverImageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="p-4 rounded-xl bg-celestia-950 border border-gold-300/10 font-mono text-xs whitespace-pre-wrap leading-relaxed text-parchment">
                        {item.content}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )
      ) : approvedList.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-2xl bg-celestia-900/40 border border-gold-300/10">
          <p className="text-sm text-parchment-dim">Belum ada naskah yang diterbitkan.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {approvedList.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-celestia-900/60 border border-emerald-500/20 flex items-center justify-between flex-wrap gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gold-300/15 text-gold-300">
                    {item.topic}
                  </span>
                  <span className="text-xs text-emerald-400 font-medium">✓ Aktif di Publik</span>
                  <span className="text-xs text-parchment-muted">• {item.likesCount} Suka</span>
                </div>
                <h3
                  className="text-base font-bold text-parchment"
                  style={{ fontFamily: "Cinzel, Georgia, serif" }}
                >
                  {item.title}
                </h3>
                <p className="text-xs text-parchment-dim">Oleh: {item.authorName}</p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/community/${item.slug}`}
                  target="_blank"
                  className="px-3 py-1.5 rounded-lg bg-celestia-800 text-parchment hover:text-gold-300 border border-gold-300/20 text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Eye size={14} /> Lihat Halaman
                </Link>
                <button
                  onClick={() => handleReject(item.id!, item.title)}
                  className="px-3 py-1.5 rounded-lg bg-rose-950/40 text-rose-300 border border-rose-500/30 hover:bg-rose-900/60 text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 size={14} /> Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

