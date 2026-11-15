import { CommentItem, CommentReply, VisionElement } from "@/types/comment";
import { db, isFirebaseConfigured } from "./firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";

let commentsFirebaseBroken = false;

function withTimeout<T>(promise: Promise<T>, ms = 2500): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Koneksi komentar timeout (${ms}ms)`)), ms)
    ),
  ]);
}

// Seed komentar awal agar kolom diskusi tidak kosong melompong saat pertama dibuka
const DEFAULT_LORE_COMMENTS: Record<string, CommentItem[]> = {
  "default": [
    {
      id: "seed-1",
      storySlug: "default",
      authorName: "Pengelana_Irminsul",
      avatarElement: "anemo",
      content: "Penjelasan lore ini sangat mendalam dan runut! Banyak misteri yang akhirnya terjawab dari sudut pandang teks aslinya.",
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      likesCount: 14,
      replies: [
        {
          id: "seed-1-rep-1",
          authorName: "Teoris_Fontaine",
          avatarElement: "hydro",
          content: "Sepakat! Terutama bagian keterkaitannya dengan kutukan Celestia, ini menghubungkan banyak puzzle sejak Archon Quest awal.",
          createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
          likesCount: 6,
        },
      ],
    },
    {
      id: "seed-2",
      storySlug: "default",
      authorName: "Ksatria_Favonius",
      avatarElement: "pyro",
      content: "Ada yang menyadari kemiripan simbol di reruntuhan ini dengan artefak kuno zaman Archon War? Sepertinya ada rahasia yang sengaja disembunyikan oleh Heavenly Principles.",
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      likesCount: 9,
      replies: [],
    },
  ],
};

function getLocalKey(storySlug: string): string {
  return `teyvat_comments_${storySlug}`;
}

export async function getCommentsBySlug(storySlug: string): Promise<CommentItem[]> {
  // 1. Ambil dari LocalStorage terlebih dahulu (0ms respons cepat)
  let localComments: CommentItem[] = [];
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(getLocalKey(storySlug));
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          localComments = parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  // 2. Coba sinkronisasi dari Firebase Firestore jika terkonfigurasi & belum broken
  if (typeof window !== "undefined" && !commentsFirebaseBroken && isFirebaseConfigured() && db) {
    try {
      const q = query(
        collection(db, "lore_comments"),
        where("storySlug", "==", storySlug)
      );
      const snapshot = await withTimeout(getDocs(q), 2000);
      if (!snapshot.empty) {
        const firestoreList: CommentItem[] = [];
        snapshot.forEach((d) => {
          firestoreList.push({ id: d.id, ...d.data() } as CommentItem);
        });
        firestoreList.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        // Gabungkan dengan komentar lokal jika ada
        const ids = new Set(firestoreList.map((c) => c.id));
        const merged = [...localComments.filter((l) => !ids.has(l.id)), ...firestoreList];
        return merged;
      }
    } catch (e) {
      console.warn("Gagal mengambil komentar dari Firestore, beralih ke local storage:", e);
      commentsFirebaseBroken = true;
    }
  }

  if (localComments.length > 0) {
    return localComments;
  }

  // 3. Fallback ke seed default yang disesuaikan
  const seed = (DEFAULT_LORE_COMMENTS[storySlug] || DEFAULT_LORE_COMMENTS["default"]).map(
    (c) => ({
      ...c,
      storySlug,
    })
  );

  return seed;
}

export async function postComment(
  storySlug: string,
  authorName: string,
  avatarElement: VisionElement,
  content: string
): Promise<CommentItem> {
  const newComment: CommentItem = {
    id: `cmt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    storySlug,
    authorName: authorName.trim() || "Pengelana Teyvat",
    avatarElement,
    content: content.trim(),
    createdAt: new Date().toISOString(),
    likesCount: 0,
    replies: [],
  };

  // 1. Simpan ke LocalStorage langsung (0ms)
  if (typeof window !== "undefined") {
    try {
      const current = await getCommentsBySlug(storySlug);
      const updated = [newComment, ...current];
      localStorage.setItem(getLocalKey(storySlug), JSON.stringify(updated));
    } catch (e) {
      console.error("LocalStorage save error:", e);
    }
  }

  // 2. Simpan ke Firestore jika tersedia di background dengan timeout
  if (typeof window !== "undefined" && !commentsFirebaseBroken && isFirebaseConfigured() && db) {
    try {
      const docRef = await withTimeout(addDoc(collection(db, "lore_comments"), newComment), 2000);
      if (docRef?.id) {
        newComment.id = docRef.id;
      }
    } catch (e) {
      console.warn("Firestore save failed, data tersimpan aman secara lokal:", e);
      commentsFirebaseBroken = true;
    }
  }

  return newComment;
}

export async function postReply(
  storySlug: string,
  commentId: string,
  authorName: string,
  avatarElement: VisionElement,
  content: string
): Promise<CommentReply> {
  const newReply: CommentReply = {
    id: `rep_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    authorName: authorName.trim() || "Pengelana Teyvat",
    avatarElement,
    content: content.trim(),
    createdAt: new Date().toISOString(),
    likesCount: 0,
  };

  // 1. Perbarui LocalStorage langsung
  if (typeof window !== "undefined") {
    try {
      const current = await getCommentsBySlug(storySlug);
      const updated = current.map((c) => {
        if (c.id === commentId) {
          return {
            ...c,
            replies: [...(c.replies || []), newReply],
          };
        }
        return c;
      });
      localStorage.setItem(getLocalKey(storySlug), JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  }

  // 2. Sinkronkan ke Firestore jika aktif
  if (typeof window !== "undefined" && !commentsFirebaseBroken && isFirebaseConfigured() && db) {
    try {
      const commentRef = doc(db, "lore_comments", commentId);
      const current = await getCommentsBySlug(storySlug);
      const found = current.find((c) => c.id === commentId);
      if (found) {
        await withTimeout(
          updateDoc(commentRef, {
            replies: [...(found.replies || []), newReply],
          }),
          2000
        );
      }
    } catch (e) {
      console.warn("Firestore update reply failed:", e);
      commentsFirebaseBroken = true;
    }
  }

  return newReply;
}

export async function likeCommentItem(
  storySlug: string,
  commentId: string
): Promise<void> {
  if (typeof window !== "undefined") {
    try {
      const current = await getCommentsBySlug(storySlug);
      const updated = current.map((c) => {
        if (c.id === commentId) {
          return { ...c, likesCount: c.likesCount + 1 };
        }
        return c;
      });
      localStorage.setItem(getLocalKey(storySlug), JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  }

  if (typeof window !== "undefined" && !commentsFirebaseBroken && isFirebaseConfigured() && db) {
    try {
      const commentRef = doc(db, "lore_comments", commentId);
      await withTimeout(
        updateDoc(commentRef, {
          likesCount: increment(1),
        }),
        2000
      );
    } catch (e) {
      console.warn("Firestore like increment failed:", e);
      commentsFirebaseBroken = true;
    }
  }
}
