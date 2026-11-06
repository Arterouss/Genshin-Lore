"use client";

import { useEffect, useState } from "react";
import {
  MessageSquare,
  Heart,
  Send,
  Reply,
  Sparkles,
  User,
  Clock,
  CheckCircle,
} from "lucide-react";
import { CommentItem, VisionElement } from "@/types/comment";
import { getCommentsBySlug, postComment, postReply, likeCommentItem } from "@/lib/comments";

const ELEMENT_CONFIG: Record<
  VisionElement,
  { label: string; color: string; bg: string; border: string; glow: string }
> = {
  anemo: {
    label: "Anemo",
    color: "text-[#72E2C4]",
    bg: "bg-[#72E2C4]/15",
    border: "border-[#72E2C4]/40",
    glow: "shadow-[#72E2C4]/20",
  },
  geo: {
    label: "Geo",
    color: "text-[#E3B342]",
    bg: "bg-[#E3B342]/15",
    border: "border-[#E3B342]/40",
    glow: "shadow-[#E3B342]/20",
  },
  electro: {
    label: "Electro",
    color: "text-[#C67BF2]",
    bg: "bg-[#C67BF2]/15",
    border: "border-[#C67BF2]/40",
    glow: "shadow-[#C67BF2]/20",
  },
  dendro: {
    label: "Dendro",
    color: "text-[#8FD843]",
    bg: "bg-[#8FD843]/15",
    border: "border-[#8FD843]/40",
    glow: "shadow-[#8FD843]/20",
  },
  hydro: {
    label: "Hydro",
    color: "text-[#4CC2F8]",
    bg: "bg-[#4CC2F8]/15",
    border: "border-[#4CC2F8]/40",
    glow: "shadow-[#4CC2F8]/20",
  },
  pyro: {
    label: "Pyro",
    color: "text-[#EF7845]",
    bg: "bg-[#EF7845]/15",
    border: "border-[#EF7845]/40",
    glow: "shadow-[#EF7845]/20",
  },
  cryo: {
    label: "Cryo",
    color: "text-[#9CE8FF]",
    bg: "bg-[#9CE8FF]/15",
    border: "border-[#9CE8FF]/40",
    glow: "shadow-[#9CE8FF]/20",
  },
  traveler: {
    label: "Traveler",
    color: "text-gold-300",
    bg: "bg-gold-300/15",
    border: "border-gold-300/40",
    glow: "shadow-gold-300/20",
  },
};

function formatTimeAgo(isoString: string): string {
  try {
    const diff = Date.now() - new Date(isoString).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Baru saja";
    if (minutes < 60) return `${minutes} menit lalu`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} jam lalu`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} hari lalu`;
    return new Date(isoString).toLocaleDateString("id-ID");
  } catch {
    return "Baru saja";
  }
}

interface CommentSectionProps {
  storySlug: string;
  storyTitle: string;
}

export default function CommentSection({ storySlug, storyTitle }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [authorName, setAuthorName] = useState("");
  const [selectedElement, setSelectedElement] = useState<VisionElement>("anemo");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedNotice, setSubmittedNotice] = useState(false);

  // Reply State
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyAuthor, setReplyAuthor] = useState("");
  const [replyElement, setReplyElement] = useState<VisionElement>("geo");
  const [replyContent, setReplyContent] = useState("");

  // Liked State tracking
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function load() {
      try {
        const data = await getCommentsBySlug(storySlug);
        setComments(data);
      } catch (err) {
        console.error("Gagal load komentar:", err);
      } finally {
        setLoading(false);
      }
    }
    load();

    try {
      const savedLikes = localStorage.getItem(`teyvat_liked_comments_${storySlug}`);
      if (savedLikes) setLikedMap(JSON.parse(savedLikes));
      const savedName = localStorage.getItem("teyvat_user_name");
      if (savedName) setAuthorName(savedName);
    } catch {
      // ignore
    }
  }, [storySlug]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const name = authorName.trim() || "Pengelana Teyvat";
      const newCmt = await postComment(storySlug, name, selectedElement, content);
      setComments((prev) => [newCmt, ...prev]);
      setContent("");
      setSubmittedNotice(true);
      setTimeout(() => setSubmittedNotice(false), 3000);

      localStorage.setItem("teyvat_user_name", name);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (commentId: string) => {
    if (likedMap[commentId]) return;

    setLikedMap((prev) => {
      const next = { ...prev, [commentId]: true };
      localStorage.setItem(`teyvat_liked_comments_${storySlug}`, JSON.stringify(next));
      return next;
    });

    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, likesCount: c.likesCount + 1 } : c))
    );

    try {
      await likeCommentItem(storySlug, commentId);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmitReply = async (commentId: string) => {
    if (!replyContent.trim()) return;

    try {
      const name = replyAuthor.trim() || authorName.trim() || "Pengelana Teyvat";
      const newRep = await postReply(storySlug, commentId, name, replyElement, replyContent);

      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? { ...c, replies: [...(c.replies || []), newRep] }
            : c
        )
      );

      setReplyContent("");
      setReplyingToId(null);
    } catch (e) {
      console.error(e);
    }
  };

  const totalCount =
    comments.reduce((acc, c) => acc + 1 + (c.replies ? c.replies.length : 0), 0);

  return (
    <section className="mt-16 pt-10 border-t border-gold-300/20">
      {/* Header Kolom Komentar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="text-gold-300" size={20} />
            <h2
              className="text-xl sm:text-2xl font-bold text-gold-200"
              style={{ fontFamily: "Cinzel, Georgia, serif" }}
            >
              Ruang Diskusi & Teori Pengelana
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-gold-400/20 text-gold-300 border border-gold-400/30 font-mono font-semibold">
              {totalCount} Diskusi
            </span>
          </div>
          <p className="text-xs sm:text-sm text-parchment-muted">
            Bagikan hipotesis, pandangan cerita, atau tanyakan detail lore mengenai{" "}
            <span className="text-gold-300 font-medium">"{storyTitle}"</span>.
          </p>
        </div>
      </div>

      {/* Form Tulis Komentar */}
      <div className="p-5 sm:p-6 rounded-2xl bg-celestia-900/80 border border-gold-300/20 shadow-xl mb-10 primogem-corner">
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Input Nama */}
            <div>
              <label className="block text-xs text-parchment-muted mb-1.5 font-medium">
                Nama Pengelana / Panggilan:
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Contoh: Aether, Lumine, Dainsleif_Fan"
                maxLength={40}
                className="w-full bg-scroll-800/90 border border-gold-300/20 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-parchment placeholder-parchment-muted/50 focus:outline-none focus:border-gold-300/60 transition-colors"
              />
            </div>

            {/* Pilihan Elemen Vision */}
            <div>
              <label className="block text-xs text-parchment-muted mb-1.5 font-medium">
                Pilih Elemen Vision:
              </label>
              <div className="flex items-center gap-1.5 flex-wrap">
                {(Object.keys(ELEMENT_CONFIG) as VisionElement[]).map((el) => {
                  const cfg = ELEMENT_CONFIG[el];
                  const isSelected = selectedElement === el;
                  return (
                    <button
                      key={el}
                      type="button"
                      onClick={() => setSelectedElement(el)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold transition-all border ${
                        isSelected
                          ? `${cfg.bg} ${cfg.color} ${cfg.border} shadow-sm ${cfg.glow}`
                          : "bg-celestia-800/80 text-parchment-muted border-gold-300/10 hover:text-parchment"
                      }`}
                    >
                      {cfg.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Textarea Komentar */}
          <div>
            <label className="block text-xs text-parchment-muted mb-1.5 font-medium">
              Analisis Lore, Hipotesis, atau Pendapatmu:
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tuliskan analisis, kaitan peristiwa dengan quest lain, atau diskusikan teori terbesarmu di sini..."
              rows={3}
              required
              className="w-full bg-scroll-800/90 border border-gold-300/20 rounded-xl p-3.5 text-xs sm:text-sm text-parchment placeholder-parchment-muted/50 focus:outline-none focus:border-gold-300/60 transition-colors leading-relaxed"
            />
          </div>

          {/* Quick Reaction Pills & Tombol Kirim */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-1.5 text-xs text-parchment-muted">
              <span>Sematkan:</span>
              {["✦", "📜", "👑", "⭐", "🗡️", "🌙"].map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setContent((prev) => prev + " " + emoji)}
                  className="px-2 py-0.5 rounded bg-celestia-800 hover:bg-gold-300/20 text-gold-300 transition-colors text-xs"
                >
                  {emoji}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-400 to-gold-200 hover:from-gold-300 hover:to-gold-100 text-celestia-950 font-bold text-xs sm:text-sm transition-all hover:scale-105 active:scale-95 shadow-lg shadow-gold-400/20 disabled:opacity-50 disabled:pointer-events-none"
            >
              <Send size={14} />
              <span>{isSubmitting ? "Mengirim..." : "Kirim Komentar"}</span>
            </button>
          </div>

          {submittedNotice && (
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-lg animate-fade-in">
              <CheckCircle size={14} />
              <span>Komentar berhasil dipublikasikan ke ruang diskusi!</span>
            </div>
          )}
        </form>
      </div>

      {/* Daftar Komentar */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8 text-parchment-muted text-xs">
            Memuat diskusi pengelana...
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-10 px-4 rounded-xl border border-dashed border-gold-300/20 text-parchment-muted text-xs">
            Belum ada diskusi untuk naskah ini. Jadilah pengelana pertama yang menyampaikan teorimu!
          </div>
        ) : (
          comments.map((comment) => {
            const cfg = ELEMENT_CONFIG[comment.avatarElement] || ELEMENT_CONFIG.traveler;
            const isLiked = Boolean(likedMap[comment.id]);
            const isReplying = replyingToId === comment.id;

            return (
              <div
                key={comment.id}
                className="p-5 rounded-2xl bg-celestia-900/60 border border-gold-300/15 hover:border-gold-300/35 transition-all shadow-md"
              >
                {/* Author row */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full ${cfg.bg} border ${cfg.border} flex items-center justify-center font-bold text-xs ${cfg.color} shadow-sm`}
                    >
                      <User size={16} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-parchment">
                          {comment.authorName}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.2 rounded-full font-bold uppercase tracking-wider ${cfg.bg} ${cfg.color} border ${cfg.border}`}
                        >
                          {cfg.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-parchment-muted">
                        <Clock size={11} />
                        <span>{formatTimeAgo(comment.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Like & Reply Action */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleLike(comment.id)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${
                        isLiked
                          ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                          : "bg-celestia-800/60 text-parchment-muted hover:text-rose-300 border-gold-300/10 hover:border-rose-400/30"
                      }`}
                      title="Sukai Komentar"
                    >
                      <Heart size={13} className={isLiked ? "fill-rose-400 text-rose-400" : ""} />
                      <span>{comment.likesCount}</span>
                    </button>

                    <button
                      onClick={() => setReplyingToId(isReplying ? null : comment.id)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs text-parchment-muted hover:text-gold-300 bg-celestia-800/60 border border-gold-300/10 hover:border-gold-300/30 transition-colors"
                      title="Balas Komentar"
                    >
                      <Reply size={13} />
                      <span>Balas</span>
                    </button>
                  </div>
                </div>

                {/* Comment Text */}
                <p className="text-sm text-parchment/90 leading-relaxed pl-12 whitespace-pre-line mb-3">
                  {comment.content}
                </p>

                {/* Nested Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-12 mt-3 space-y-3 pt-3 border-t border-gold-300/10">
                    {comment.replies.map((reply) => {
                      const repCfg = ELEMENT_CONFIG[reply.avatarElement] || ELEMENT_CONFIG.traveler;
                      return (
                        <div
                          key={reply.id}
                          className="p-3.5 rounded-xl bg-celestia-800/50 border border-gold-300/10"
                        >
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-gold-200">
                                {reply.authorName}
                              </span>
                              <span
                                className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider ${repCfg.bg} ${repCfg.color}`}
                              >
                                {repCfg.label}
                              </span>
                            </div>
                            <span className="text-[10px] text-parchment-muted">
                              {formatTimeAgo(reply.createdAt)}
                            </span>
                          </div>
                          <p className="text-xs text-parchment-dim leading-relaxed">
                            {reply.content}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Reply Form */}
                {isReplying && (
                  <div className="ml-12 mt-3 p-3.5 rounded-xl bg-celestia-800/80 border border-gold-300/25 animate-fade-in space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gold-300 font-semibold flex items-center gap-1">
                        <Reply size={12} /> Balas ke {comment.authorName}:
                      </span>
                      <button
                        onClick={() => setReplyingToId(null)}
                        className="text-[11px] text-parchment-muted hover:text-parchment"
                      >
                        Batal
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={replyAuthor}
                        onChange={(e) => setReplyAuthor(e.target.value)}
                        placeholder="Nama kamu..."
                        className="w-1/3 bg-celestia-900 border border-gold-300/20 rounded-lg px-2.5 py-1 text-xs text-parchment placeholder-parchment-muted/50 focus:outline-none"
                      />
                      <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
                        {(["anemo", "geo", "electro", "dendro", "hydro", "pyro", "cryo"] as VisionElement[]).map(
                          (el) => (
                            <button
                              key={el}
                              type="button"
                              onClick={() => setReplyElement(el)}
                              className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-bold border ${
                                replyElement === el
                                  ? "bg-gold-400 text-celestia-950 border-gold-300"
                                  : "bg-celestia-900 text-parchment-muted border-gold-300/10"
                              }`}
                            >
                              {el.substring(0, 3)}
                            </button>
                          )
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Tulis balasanmu..."
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleSubmitReply(comment.id);
                          }
                        }}
                        className="flex-1 bg-celestia-900 border border-gold-300/20 rounded-lg px-3 py-1.5 text-xs text-parchment placeholder-parchment-muted/50 focus:outline-none focus:border-gold-300"
                      />
                      <button
                        type="button"
                        onClick={() => handleSubmitReply(comment.id)}
                        className="px-3 py-1.5 rounded-lg bg-gold-400 hover:bg-gold-300 text-celestia-950 font-bold text-xs transition-colors shrink-0"
                      >
                        Kirim
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

