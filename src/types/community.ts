export interface CommunityLore {
  id?: string;
  title: string;
  slug: string;
  authorName: string;
  topic: string; // Bebas diisi oleh user, contoh: "Lore Naga Purba", "Celestia & Primordial One"
  summary: string;
  content: string; // Teks naskah/markdown
  coverImageUrl?: string;
  tags?: string[];
  likesCount: number;
  status: "pending" | "approved" | "rejected";
  createdAt: number; // Timestamp Unix ms
  updatedAt?: number;
}

export interface CommunityTheory {
  id: string;
  title: string;
  source: string; // Misal: "Forum HoYoLAB", "Arsip Teori Pengelana", "Kolektif Lore Teyvat"
  author: string;
  topic: string; // Misal: "Naga Purba", "Celestia", "Khaenri'ah", "Descender"
  summary: string;
  content: string;
  likes: number;
  commentsCount: number;
  readingTime: string;
  tags: string[];
  date: string;
}
