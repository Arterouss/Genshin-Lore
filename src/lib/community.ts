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

// Helper: ambil data lokal karya pengguna (Tab 1)
function getLocalUserPosts(): CommunityLore[] {
  if (typeof window === "undefined") return INITIAL_USER_LORES;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_USER_LORES));
      return INITIAL_USER_LORES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_USER_LORES;
  }
}

function saveLocalUserPosts(posts: CommunityLore[]) {
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

// 1. Submit Postingan Baru Pengguna (status: "pending")
export async function createCommunityLore(
  data: Omit<CommunityLore, "id" | "likesCount" | "status" | "createdAt">
): Promise<string> {
  const newLore: CommunityLore = {
    ...data,
    slug: `${slugify(data.title)}-${Math.random().toString(36).substring(2, 6)}`,
    likesCount: 0,
    status: "pending",
    createdAt: Date.now(),
  };

  if (isFirebaseConfigured() && db) {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), newLore);
      newLore.id = docRef.id;
      return docRef.id;
    } catch (err) {
      console.warn("Firestore write error, menyimpan ke cache lokal:", err);
    }
  }

  newLore.id = `local-${Date.now()}`;
  const existing = getLocalUserPosts();
  saveLocalUserPosts([newLore, ...existing]);
  return newLore.id;
}

// 2. Ambil Postingan Pengguna yang Sudah Diapprove (Untuk Tab 1)
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

  const local = getLocalUserPosts();
  return local.filter((item) => item.status === "approved");
}

// 3. Ambil Semua Postingan Pengguna untuk Halaman Admin
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

  return getLocalUserPosts();
}

// 4. Update Status Postingan (Approve / Reject)
export async function updateLoreStatus(
  id: string,
  status: "approved" | "rejected"
): Promise<void> {
  if (isFirebaseConfigured() && db && !id.startsWith("user-lore-") && !id.startsWith("theory-") && !id.startsWith("local-")) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, { status, updatedAt: Date.now() });
      return;
    } catch (err) {
      console.warn("Firestore update status error:", err);
    }
  }

  const items = getLocalUserPosts();
  const updated = items.map((item) =>
    item.id === id ? { ...item, status, updatedAt: Date.now() } : item
  );
  saveLocalUserPosts(updated);
}

// 5. Hapus Postingan
export async function deleteLore(id: string): Promise<void> {
  if (isFirebaseConfigured() && db && !id.startsWith("user-lore-") && !id.startsWith("theory-") && !id.startsWith("local-")) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
      return;
    } catch (err) {
      console.warn("Firestore delete error:", err);
    }
  }

  const items = getLocalUserPosts();
  const updated = items.filter((item) => item.id !== id);
  saveLocalUserPosts(updated);
}

// 6. Like Postingan
export async function likeLore(id: string): Promise<number> {
  if (isFirebaseConfigured() && db && !id.startsWith("user-lore-") && !id.startsWith("theory-") && !id.startsWith("local-")) {
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
  return newLikes;
}

// 7. Ambil Detail Lore berdasarkan Slug (Mencari di Firestore, User Lores, & Global Theories)
export async function getLoreBySlug(slug: string): Promise<CommunityLore | null> {
  // Cek Firestore terlebih dahulu
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

  // Cek di arsip Teori Global
  const foundGlobal = GLOBAL_COMMUNITY_THEORIES.find((item) => item.slug === slug);
  if (foundGlobal) return foundGlobal;

  // Cek di karya user lokal
  const userItems = getLocalUserPosts();
  const foundUser = userItems.find((item) => item.slug === slug);
  return foundUser || null;
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

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
}
