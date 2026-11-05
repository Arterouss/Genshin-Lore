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

export interface RedditPost {
  id: string;
  title: string;
  author: string;
  subreddit: string;
  ups: number;
  num_comments: number;
  permalink: string;
  url: string;
  created_utc: number;
  selftext?: string;
  link_flair_text?: string;
}

