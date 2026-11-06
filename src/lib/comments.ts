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
  // 1. Coba ambil dari Firebase Firestore jika terkonfigurasi
  if (typeof window !== "undefined" && isFirebaseConfigured() && db) {
    try {
      const q = query(
        collection(db, "lore_comments"),
        where("storySlug", "==", storySlug)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const firestoreList: CommentItem[] = [];
        snapshot.forEach((d) => {
          firestoreList.push({ id: d.id, ...d.data() } as CommentItem);
        });
        firestoreList.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        return firestoreList;
      }
    } catch (e) {
      console.warn("Gagal mengambil komentar dari Firestore, beralih ke local storage:", e);
    }
  }

  // 2. Ambil dari LocalStorage
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(getLocalKey(storySlug));
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
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

  // Simpan ke Firestore jika tersedia
  if (typeof window !== "undefined" && isFirebaseConfigured() && db) {
    try {
      const docRef = await addDoc(collection(db, "lore_comments"), newComment);
      newComment.id = docRef.id;
    } catch (e) {
      console.warn("Firestore save failed, persisting locally:", e);
    }
  }

  // Simpan ke LocalStorage
  if (typeof window !== "undefined") {
    try {
      const current = await getCommentsBySlug(storySlug);
      const updated = [newComment, ...current];
      localStorage.setItem(getLocalKey(storySlug), JSON.stringify(updated));
    } catch (e) {
      console.error("LocalStorage save error:", e);
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

  // Jika Firestore aktif
  if (typeof window !== "undefined" && isFirebaseConfigured() && db) {
    try {
      const commentRef = doc(db, "lore_comments", commentId);
      const current = await getCommentsBySlug(storySlug);
      const found = current.find((c) => c.id === commentId);
      if (found) {
        await updateDoc(commentRef, {
          replies: [...(found.replies || []), newReply],
        });
      }
    } catch (e) {
      console.warn("Firestore update reply failed:", e);
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

  if (typeof window !== "undefined" && isFirebaseConfigured() && db) {
    try {
      const commentRef = doc(db, "lore_comments", commentId);
      await updateDoc(commentRef, {
        likesCount: increment(1),
      });
    } catch (e) {
      console.warn("Firestore like increment failed:", e);
    }
  }
}

