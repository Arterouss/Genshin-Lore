import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  increment,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, isFirebaseConfigured } from "./firebase";
import { CommunityLore } from "@/types/community";
import communityTheories from "@/data/community-theories.json";

const COLLECTION_NAME = "community_lore";
const LOCAL_STORAGE_KEY = "teyvat_lore_community_posts";

// Contoh & arsip teori komunitas resmi bawaan
export const INITIAL_COMMUNITY_LORES: CommunityLore[] = communityTheories.map((t, idx) => ({
  id: t.id,
  title: t.title,
  slug: t.slug,
  authorName: t.authorName,
  topic: t.topic,
  summary: t.summary,
  content: t.content,
  coverImageUrl: t.coverImageUrl,
  tags: t.tags,
  likesCount: t.likesCount,
  status: "approved" as const,
  createdAt: Date.now() - 86400000 * (idx + 1),
}));

// Helper: ambil data lokal fallback
function getLocalPosts(): CommunityLore[] {
  if (typeof window === "undefined") return INITIAL_COMMUNITY_LORES;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_COMMUNITY_LORES));
      return INITIAL_COMMUNITY_LORES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_COMMUNITY_LORES;
  }
}

function saveLocalPosts(posts: CommunityLore[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(posts));
  } catch (e) {
    console.error("Gagal menyimpan ke localStorage:", e);
  }
}

// Generate URL slug dari judul
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// 1. Submit Postingan Baru (status: "pending")
export async function createCommunityLore(
  data: Omit<CommunityLore, "id" | "likesCount" | "status" | "createdAt">
): Promise<string> {
  const newLore: CommunityLore = {
    ...data,
    slug: `${slugify(data.title)}-${Math.random().toString(36).substring(2, 6)}`,
    likesCount: 0,
    status: "pending", // Selalu pending untuk direview Admin!
    createdAt: Date.now(),
  };

  // Coba simpan ke Firebase jika aktif
  if (isFirebaseConfigured() && db) {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), newLore);
      newLore.id = docRef.id;
      return docRef.id;
    } catch (err) {
      console.warn("Firestore write error, menyimpan ke cache lokal:", err);
    }
  }

  // Fallback ke localStorage
  newLore.id = `local-${Date.now()}`;
  const existing = getLocalPosts();
  saveLocalPosts([newLore, ...existing]);
  return newLore.id;
}

// 2. Ambil Postingan yang Sudah Diapprove (Untuk Publik)
export async function getApprovedLores(): Promise<CommunityLore[]> {
  if (isFirebaseConfigured() && db) {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where("status", "==", "approved"),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      const items: CommunityLore[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...(docSnap.data() as Omit<CommunityLore, "id">) });
      });

      if (items.length > 0) return items;
    } catch (err) {
      console.warn("Firestore read error, fallback ke cache lokal:", err);
    }
  }

  // Fallback lokal
  const local = getLocalPosts();
  return local.filter((item) => item.status === "approved");
}

// 3. Ambil Semua Postingan untuk Halaman Admin
export async function getAllLoresForAdmin(): Promise<CommunityLore[]> {
  if (isFirebaseConfigured() && db) {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const items: CommunityLore[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...(docSnap.data() as Omit<CommunityLore, "id">) });
      });
      return items;
    } catch (err) {
      console.warn("Firestore read admin error, fallback ke cache lokal:", err);
    }
  }

  return getLocalPosts();
}

// 4. Update Status Postingan (Approve / Reject)
export async function updateLoreStatus(
  id: string,
  status: "approved" | "rejected"
): Promise<void> {
  if (isFirebaseConfigured() && db && !id.startsWith("sample-") && !id.startsWith("local-")) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, { status, updatedAt: Date.now() });
      return;
    } catch (err) {
      console.warn("Firestore update status error:", err);
    }
  }

  // Fallback lokal
  const items = getLocalPosts();
  const updated = items.map((item) =>
    item.id === id ? { ...item, status, updatedAt: Date.now() } : item
  );
  saveLocalPosts(updated);
}

// 5. Hapus Postingan
export async function deleteLore(id: string): Promise<void> {
  if (isFirebaseConfigured() && db && !id.startsWith("sample-") && !id.startsWith("local-")) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
      return;
    } catch (err) {
      console.warn("Firestore delete error:", err);
    }
  }

  const items = getLocalPosts();
  const updated = items.filter((item) => item.id !== id);
  saveLocalPosts(updated);
}

// 6. Like Postingan
export async function likeLore(id: string): Promise<number> {
  if (isFirebaseConfigured() && db && !id.startsWith("sample-") && !id.startsWith("local-")) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, { likesCount: increment(1) });
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return (snap.data().likesCount as number) || 1;
      }
    } catch (err) {
      console.warn("Firestore like error:", err);
    }
  }

  const items = getLocalPosts();
  let newLikes = 1;
  const updated = items.map((item) => {
    if (item.id === id) {
      newLikes = item.likesCount + 1;
      return { ...item, likesCount: newLikes };
    }
    return item;
  });
  saveLocalPosts(updated);
  return newLikes;
}

// 7. Ambil Detail Lore berdasarkan Slug
export async function getLoreBySlug(slug: string): Promise<CommunityLore | null> {
  if (isFirebaseConfigured() && db) {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where("slug", "==", slug)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const first = snapshot.docs[0];
        return { id: first.id, ...(first.data() as Omit<CommunityLore, "id">) };
      }
    } catch (err) {
      console.warn("Firestore getLoreBySlug error:", err);
    }
  }

  const items = getLocalPosts();
  const found = items.find((item) => item.slug === slug);
  return found || null;
}

// 8. Upload Gambar Sampul (Firebase Storage / Base64 fallback)
export async function uploadCoverImage(file: File): Promise<string> {
  if (isFirebaseConfigured() && storage) {
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const fileName = `covers/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
      const storageRef = ref(storage, fileName);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      return downloadUrl;
    } catch (err) {
      console.warn("Firebase Storage upload error, converting to base64:", err);
    }
  }

  // Fallback: convert file to compressed Data URL
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
}

