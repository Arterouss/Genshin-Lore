import {
  collection,
  addDoc,
  getDocs,
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

// Flag cerdas: jika koneksi Firestore/Storage terbukti offline / ditolak izinnya,
// langsung alihkan semua operasi berikutnya ke LocalStorage tanpa jeda waktu (0ms delay).
let firebaseKnownBroken = false;

// Helper: membungkus promise dengan batas waktu timeout agar UI tidak pernah freeze/hang
export function withTimeout<T>(promise: Promise<T>, ms = 2500): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Operasi Firebase melampaui batas waktu (${ms}ms)`)), ms)
    ),
  ]);
}

// Helper: Kompresi gambar ke format JPEG Data URL ringkas (~50-100KB)
// Menjamin gambar muat disimpan di localStorage tanpa melebihi kuota 5MB browser
export function compressImageToDataUrl(file: File, maxWidth = 1000, quality = 0.75): Promise<string> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve("");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(reader.result as string);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", quality));
        } catch {
          resolve(reader.result as string);
        }
      };
      img.onerror = () => resolve(reader.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve("");
    reader.readAsDataURL(file);
  });
}

// 8 Teori Besar Komunitas Global (Tab 2)
export const GLOBAL_COMMUNITY_THEORIES: CommunityLore[] = communityTheories.map((t, idx) => ({
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

// Contoh awal karya pengelana lokal yang dikirim pengunjung (Tab 1)
export const INITIAL_USER_LORES: CommunityLore[] = [
  {
    id: "user-lore-1",
    title: "Catatan Penjelajah: Menguak Misteri Reruntuhan Gurun Hadramaveth",
    slug: "catatan-penjelajah-misteri-gurun-hadramaveth",
    authorName: "Pengelana_Gurun",
    topic: "Eksplorasi Sumeru & Liloupar",
    summary:
      "Catatan observasi lapangan mengenai arsitektur Gurun Hadramaveth, hubungan peradaban Gurabad dengan jin Liloupar, dan sisa-sisa mekanik Raja Deshret yang masih aktif.",
    content: `### 1. Badai Pasir Abadi di Jantung Hadramaveth

Sebagai pengelana yang menghabiskan puluhan jam menjelajahi lorong-lorong bawah tanah Hadramaveth, ada banyak detail reruntuhan kuno yang sering terlewatkan dalam pencarian peti harta karun biasa. Di tengah pusaran badai pasir raksasa, tersembunyi puing-puing peradaban Gurabad yang pernah makmur ribuan tahun silam.

### 2. Tragedi Ratu Jin Liloupar

Kisah Liloupar adalah salah satu cerita paling tragis dalam sejarah Sumeru kuno. Dipenuhi rasa sakit hati dan dendam terhadap Raja Ormazd, Liloupar merancang kehancuran dinastinya sendiri dari dalam. Ia meracuni garis keturunan kerajaan selama tiga generasi, hingga kota Gurabad runtuh dan ditelan oleh pasir hisap.

> *"Kebencian adalah racun yang paling lambat membunuh, namun paling pasti membinasakan sebuah peradaban."* — Fragmen Tablet Liloupar

### 3. Peninggalan Mesin Al-Ahmar

Mekanisme canggih yang masih berfungsi di kuil-kuil bawah tanah membuktikan bahwa Raja Deshret telah mencapai tingkat sains yang mendekati teknologi Khaenri'ah sebelum kejatuhannya akibat Forbidden Knowledge.`,
    coverImageUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1200&auto=format&fit=crop",
    tags: ["Sumeru", "Hadramaveth", "Liloupar", "Deshret", "Gurabad"],
    likesCount: 38,
    status: "approved",
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: "user-lore-2",
    title: "Hipotesis: Mengapa Tartaglia Mengalami Efek Samping Berbeda dari Delusion?",
    slug: "hipotesis-vision-delusion-tartaglia",
    authorName: "FatuiAnalyst_ID",
    topic: "Karakter & Kekuatan Tartaglia",
    summary:
      "Menganalisis mengapa Tartaglia mampu mengombinasikan Hydro Vision, Electro Delusion, dan Foul Legacy secara bersamaan, serta harga fisik yang harus ia bayar.",
    content: `### 1. Paradoks Tiga Lapisan Kekuatan Ajax

Ajax (Tartaglia / Childe) adalah satu-satunya karakter di Teyvat yang secara kanonik memegang tiga jenis energi yang saling bertentangan:
1. **Hydro Vision:** Diberikan oleh ambisinya sendiri yang murni dan haus akan pertarungan.
2. **Electro Delusion:** Diberikan langsung oleh Tsaritsa sebagai simbol kedudukannya sebagai Fatui Harbinger ke-11.
3. **Foul Legacy Transformation:** Ilmu terlarang dari Abyss yang diajarkan oleh Skirk saat ia jatuh ke jurang kegelapan pada usia 14 tahun.

### 2. Mengapa Delusion Tidak Membunuhnya?

Karakter manusia biasa (seperti Teppei di Inazuma) mengalami penuaan cepat dan kematian dalam hitungan minggu setelah menggunakan Delusion. Namun, Tartaglia telah menggunakannya selama bertahun-tahun.

Kuncinya terletak pada **ketahanan tubuhnya terhadap energi Abyss**. Karena tubuhnya telah beradaptasi dengan radiasi jurang maut sejak remaja, tubuh Ajax memiliki ambang batas ketahanan fisik yang jauh melampaui manusia fana biasa. Namun demikian, seperti yang terlihat di Fontaine setelah menahan Narwhal selama berminggu-minggu, kekuatan ini tetap mengikis staminanya secara ekstrem.`,
    coverImageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
    tags: ["Tartaglia", "Childe", "Fatui", "Delusion", "Abyss", "Skirk"],
    likesCount: 52,
    status: "approved",
    createdAt: Date.now() - 86400000 * 4,
  },
];

// Gabungan semua slug untuk generateStaticParams
export const ALL_COMMUNITY_LORES: CommunityLore[] = [
  ...GLOBAL_COMMUNITY_THEORIES,
  ...INITIAL_USER_LORES,
];

// Helper: ambil data karya pengguna dari localStorage
export function getLocalUserPosts(): CommunityLore[] {
  if (typeof window === "undefined") return INITIAL_USER_LORES;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_USER_LORES));
      return INITIAL_USER_LORES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_USER_LORES;
  } catch {
    return INITIAL_USER_LORES;
  }
}

// Helper: simpan data karya pengguna ke localStorage
export function saveLocalUserPosts(posts: CommunityLore[]) {
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

// 1. Submit Postingan Baru Pengguna (Langsung diterbitkan dengan status: "approved")
export async function createCommunityLore(
  data: Omit<CommunityLore, "id" | "likesCount" | "status" | "createdAt">
): Promise<{ id: string; slug: string }> {
  const generatedSlug = `${slugify(data.title)}-${Math.random().toString(36).substring(2, 6)}`;
  const newLore: CommunityLore = {
    ...data,
    slug: generatedSlug,
    likesCount: 0,
    status: "approved", // Langsung aktif agar langsung terlihat oleh pengelana!
    createdAt: Date.now(),
  };

  // Prioritas 1: Simpan ke LocalStorage secara instan (0ms delay)
  // Menjamin naskah pengguna 100% aman dan tidak pernah hilang
  newLore.id = `local-${Date.now()}`;
  const existing = getLocalUserPosts();
  saveLocalUserPosts([newLore, ...existing]);

  // Prioritas 2: Coba sinkronisasi ke Firebase Firestore jika tersedia
  if (!firebaseKnownBroken && isFirebaseConfigured() && db) {
    try {
      const docRef = await withTimeout(
        addDoc(collection(db, COLLECTION_NAME), {
          ...newLore,
          id: undefined, // biarkan firestore generate id sendiri
        }),
        2500
      );
      if (docRef?.id) {
        newLore.id = docRef.id;
        // perbarui ID di local storage
        const currentList = getLocalUserPosts();
        const updatedList = currentList.map((item) =>
          item.slug === generatedSlug ? { ...item, id: docRef.id } : item
        );
        saveLocalUserPosts(updatedList);
      }
    } catch (err) {
      console.warn("Firestore write gagal/timeout, data tersimpan aman di local storage:", err);
      firebaseKnownBroken = true;
    }
  }

  return { id: newLore.id, slug: newLore.slug };
}

// 2. Ambil Postingan Pengguna yang Sudah Diapprove (Untuk Tab 1)
export async function getApprovedLores(): Promise<CommunityLore[]> {
  const local = getLocalUserPosts();
  const approvedLocal = local.filter((item) => item.status === "approved");

  if (!firebaseKnownBroken && isFirebaseConfigured() && db) {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where("status", "==", "approved"),
        orderBy("createdAt", "desc")
      );
      const snapshot = await withTimeout(getDocs(q), 2500);
      const items: CommunityLore[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...(docSnap.data() as Omit<CommunityLore, "id">) });
      });

      if (items.length > 0) {
        // Gabungkan karya firestore dengan karya lokal tanpa duplikat
        const ids = new Set(items.map((i) => i.id));
        const merged = [...approvedLocal.filter((l) => !ids.has(l.id)), ...items];
        return merged;
      }
    } catch (err) {
      console.warn("Firestore getApprovedLores warning, menggunakan local posts:", err);
      firebaseKnownBroken = true;
    }
  }

  return approvedLocal;
}

// 3. Ambil Semua Postingan Pengguna untuk Halaman Admin
export async function getAllLoresForAdmin(): Promise<CommunityLore[]> {
  const local = getLocalUserPosts();

  if (!firebaseKnownBroken && isFirebaseConfigured() && db) {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
      const snapshot = await withTimeout(getDocs(q), 2500);
      const items: CommunityLore[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...(docSnap.data() as Omit<CommunityLore, "id">) });
      });
      if (items.length > 0) {
        const ids = new Set(items.map((i) => i.id));
        return [...local.filter((l) => !ids.has(l.id)), ...items];
      }
    } catch (err) {
      console.warn("Firestore getAllLoresForAdmin warning:", err);
      firebaseKnownBroken = true;
    }
  }

  return local;
}

// 4. Update Status Postingan (Approve / Reject)
export async function updateLoreStatus(
  id: string,
  status: "approved" | "rejected"
): Promise<void> {
  const items = getLocalUserPosts();
  const updated = items.map((item) =>
    item.id === id ? { ...item, status, updatedAt: Date.now() } : item
  );
  saveLocalUserPosts(updated);

  if (!firebaseKnownBroken && isFirebaseConfigured() && db && !id.startsWith("user-lore-") && !id.startsWith("theory-") && !id.startsWith("local-")) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await withTimeout(updateDoc(docRef, { status, updatedAt: Date.now() }), 2500);
    } catch (err) {
      console.warn("Firestore update status error:", err);
    }
  }
}

// 5. Hapus Postingan
export async function deleteLore(id: string): Promise<void> {
  const items = getLocalUserPosts();
  const updated = items.filter((item) => item.id !== id);
  saveLocalUserPosts(updated);

  if (!firebaseKnownBroken && isFirebaseConfigured() && db && !id.startsWith("user-lore-") && !id.startsWith("theory-") && !id.startsWith("local-")) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await withTimeout(deleteDoc(docRef), 2500);
    } catch (err) {
      console.warn("Firestore delete error:", err);
    }
  }
}

// 6. Like Postingan
export async function likeLore(id: string): Promise<number> {
  const items = getLocalUserPosts();
  let newLikes = 1;
  const updated = items.map((item) => {
    if (item.id === id) {
      newLikes = item.likesCount + 1;
      return { ...item, likesCount: newLikes };
    }
    return item;
  });
  saveLocalUserPosts(updated);

  if (!firebaseKnownBroken && isFirebaseConfigured() && db && !id.startsWith("user-lore-") && !id.startsWith("theory-") && !id.startsWith("local-")) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await withTimeout(updateDoc(docRef, { likesCount: increment(1) }), 2500);
    } catch (err) {
      console.warn("Firestore like error:", err);
    }
  }

  return newLikes;
}

// 7. Ambil Detail Lore berdasarkan Slug (Mencari di Local, Global Theories, & Firestore)
export async function getLoreBySlug(slug: string): Promise<CommunityLore | null> {
  // 1. Cek di karya user lokal dulu (0ms - instan)
  const local = getLocalUserPosts();
  const foundUser = local.find((item) => item.slug === slug);
  if (foundUser) return foundUser;

  // 2. Cek di arsip Teori Global (0ms - instan)
  const foundGlobal = GLOBAL_COMMUNITY_THEORIES.find((item) => item.slug === slug);
  if (foundGlobal) return foundGlobal;

  // 3. Cek Firestore jika belum ditemukan secara lokal
  if (!firebaseKnownBroken && isFirebaseConfigured() && db) {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where("slug", "==", slug)
      );
      const snapshot = await withTimeout(getDocs(q), 2500);
      if (!snapshot.empty) {
        const first = snapshot.docs[0];
        return { id: first.id, ...(first.data() as Omit<CommunityLore, "id">) };
      }
    } catch (err) {
      console.warn("Firestore getLoreBySlug error:", err);
      firebaseKnownBroken = true;
    }
  }

  return null;
}

// 8. Upload Gambar Sampul (Firebase Storage / Kompresi Base64 fallback)
export async function uploadCoverImage(file: File): Promise<string> {
  // 1. Coba upload ke Firebase Storage jika tersedia & aktif
  if (!firebaseKnownBroken && isFirebaseConfigured() && storage) {
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const fileName = `covers/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
      const storageRef = ref(storage, fileName);
      const snapshot = await withTimeout(uploadBytes(storageRef, file), 2500);
      const downloadUrl = await withTimeout(getDownloadURL(snapshot.ref), 2500);
      if (downloadUrl) return downloadUrl;
    } catch (err) {
      console.warn("Firebase Storage upload error/timeout, beralih ke kompresi Data URL:", err);
      firebaseKnownBroken = true;
    }
  }

  // 2. Fallback cepat: kompresi gambar menjadi Data URL ringkas (maks 1000px lebar, 0.75 JPEG)
  // Memastikan gambar dapat langsung ditampilkan dan aman di localStorage
  return compressImageToDataUrl(file);
}
