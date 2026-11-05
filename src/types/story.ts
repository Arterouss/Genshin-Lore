export type Element =
  | "anemo"
  | "geo"
  | "electro"
  | "dendro"
  | "hydro"
  | "pyro"
  | "cryo"
  | "none";

export type Region =
  | "Mondstadt"
  | "Liyue"
  | "Inazuma"
  | "Sumeru"
  | "Fontaine"
  | "Natlan"
  | "Snezhnaya"
  | "Khaenri'ah"
  | "Semua";

export type Category =
  | "archon-quest"
  | "story-quest"
  | "world-lore"
  | "character-backstory";

export interface StoryMeta {
  slug: string;
  title: string;
  character?: string;
  region: Region;
  element?: Element;
  category: Category;
  readingTime: string;
  audioUrl?: string;
  audioDuration?: string;
  summary: string;
  tags?: string[];
  publishedAt?: string;
  coverImage?: string;
}

export interface StoryFull extends StoryMeta {
  contentHtml: string;
}

