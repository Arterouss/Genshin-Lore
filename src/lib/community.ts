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

const COLLECTION_NAME = "community_lore";
const LOCAL_STORAGE_KEY = "teyvat_lore_community_posts";

// Contoh lore bawaan jika database belum dihubungkan atau masih kosong
export const INITIAL_COMMUNITY_LORES: CommunityLore[] = [
  {
    id: "sample-1",
    title: "Misteri Kebangkitan Tujuh Naga Berdaulat (Seven Sovereigns)",
    slug: "misteri-kebangkitan-tujuh-naga-berdaulat",
    authorName: "NeuvilletteEnjoyer",
    topic: "Lore Naga Purba",
    summary:
      "Analisis mendalam mengenai pengembalian Otoritas Kuno kepada para Penguasa Naga Pertama, kepunahan Nibelung, dan bagaimana Fontaine menjadi titik balik tatanan langit Celestia.",
    content: `### Era Sebelum Tatanan Celestia Datang

Sebelum *The Primordial One* (Phanes) tiba di Teyvat bersama empat bayangannya, dunia ini bukanlah milik manusia atau para dewa Archon. Dunia Teyvat purba sepenuhnya dikuasai oleh **Tujuh Naga Berdaulat (Seven Dragon Sovereigns)** di bawah kepemimpinan Raja Naga Pertama, **Nibelung**.

Elemen di masa itu masih liar dan murni, mengalir langsung melalui tubuh para Vishap purba. Namun, setelah peperangan dahsyat selama empat puluh tahun, Celestia mengalahkan para Sovereign dan merebut bagian inti dari kekuatan elemen mereka, yang kemudian dikenal sebagai **Elemental Authorities** (Otoritas Kuno). Otoritas inilah yang dibagi menjadi tujuh *Gnoses* dan dipegang oleh *The Seven Archons*.

### Titik Balik Fontaine: Pengorbanan Focalors

Selama ribuan tahun, tidak ada satupun naga yang berhasil merebut kembali otoritas penuh mereka—sampai tiba peristiwa penghakiman di Fontaine. **Focalors**, Sang Dewa Keadilan, menyusun rencana rahasia selama 500 tahun untuk menghancurkan tahta Archon Hydro melalui *Indemnitium*.

Ketika pedang eksekusi membelah tahta Ilahi, Otoritas Hydro kembali seutuhnya kepada reinkarnasi Naga Hydro Purba: **Neuvillette**.

> *"Sekarang setelah kekuatanku kembali seutuhnya, aku dapat memaafkan dosa seluruh bangsa Fontaine dan mengubah darah Primordial Sea mereka menjadi darah manusia sejati."*

### Apa Artinya Bagi Masa Depan Teyvat?

Dengan kembalinya otoritas Hydro, tatanan *Heavenly Principles* terbukti bisa dihancurkan. Pertanyaan terbesarnya sekarang:
1. Akankah naga elemen lain (seperti Apep di Sumeru) menuntut kembali hak mereka?
2. Apakah Nibelung benar-benar telah binasa, ataukah 'kekuatan dari luar' (Forbidden Knowledge) yang ia bawa akan kembali bangkit?`,
    coverImageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
    tags: ["Naga Purba", "Neuvillette", "Fontaine", "Sovereign", "Celestia"],
    likesCount: 42,
    status: "approved",
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: "sample-2",
    title: "Kebenaran di Balik Langit Palsu dan Sistem Bintang Primogem",
    slug: "kebenaran-di-balik-langit-palsu-dan-bintang-primogem",
    authorName: "KhaenriahScholar",
    topic: "Celestia & Kosmologi",
    summary:
      "Mengapa Scaramouche dan Dottore menyebut bahwa bintang-bintang di Teyvat adalah dusta? Eksplorasi hubungan antara Primogem, Takdir Karakter, dan Ilusi Kubah Langit.",
    content: `### Pernyataan Menggemparkan di Unreconciled Stars

Pada event versi 1.1, Scaramouche menyampaikan satu kalimat yang menjadi pilar teori Genshin hingga hari ini:
> *"Bintang-bintang, langit itu sendiri... semuanya adalah kebohongan besar. Sebuah tipuan raksasa."*

Dottore kemudian menegaskan hal yang sama dalam perbincangannya dengan Nahida di akhir Archon Quest Sumeru. Ia menyebutkan bahwa Celestia menyembunyikan kebenaran tentang 'Firmament' (kubah langit buatan).

### Hubungan Primogem dengan Jiwa & Nasib

Di menu gacha dan deskripsi item:
- **Primogem** digambarkan sebagai *"batu permata kristal yang melampaui dunia materi, mengumpulkan harapan dan mimpi yang melayang di angkasa"*.
- **Constellation (Rasi Bintang)** setiap karakter terkunci di langit, menentukan jalan hidup dan takdir mereka.

Jika langit adalah kubah buatan, maka rasi bintang bukanlah bintang sungguhan di galaksi, melainkan rekaman proyeksi dari *Irminsul* yang dipaksakan kepada penduduk Teyvat oleh tatanan langit untuk mengontrol takdir manusia.`,
    coverImageUrl: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1200&auto=format&fit=crop",
    tags: ["Celestia", "Scaramouche", "Firmament", "Teori Kosmologi"],
    likesCount: 38,
    status: "approved",
    createdAt: Date.now() - 86400000 * 5,
  },
];

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
