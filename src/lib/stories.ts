import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";
import remarkGfm from "remark-gfm";
import type { StoryMeta, StoryFull, Region, Category } from "@/types/story";

const CONTENT_DIR = path.join(process.cwd(), "content", "stories");

/** Semua slug yang tersedia */
export function getAllSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const files: string[] = [];
  function walk(dir: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) walk(path.join(dir, entry.name));
      else if (entry.name.endsWith(".md")) files.push(path.join(dir, entry.name));
    }
  }
  walk(CONTENT_DIR);
  return files.map((f) => {
    const relative = path.relative(CONTENT_DIR, f);
    return relative.replace(/\.md$/, "").replace(/\\/g, "-").replace(/\//g, "-");
  });
}

/** Ambil semua metadata cerita (untuk listing) */
export function getAllStories(): StoryMeta[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const files: string[] = [];
  function walk(dir: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) walk(path.join(dir, entry.name));
      else if (entry.name.endsWith(".md")) files.push(path.join(dir, entry.name));
    }
  }
  walk(CONTENT_DIR);

  return files
    .map((filePath) => {
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(raw);
      const relative = path.relative(CONTENT_DIR, filePath);
      const slug = relative.replace(/\.md$/, "").replace(/\\/g, "-").replace(/\//g, "-");

      const baseName = path.basename(filePath, ".md");
      const localCharImg = path.join(process.cwd(), "public", "images", "characters", `${baseName}.png`);
      const coverImage = data.coverImage || (fs.existsSync(localCharImg) ? `/images/characters/${baseName}.png` : undefined);

      return { slug, ...data, coverImage } as StoryMeta;
    })
    .sort((a, b) =>
      new Date(b.publishedAt ?? "2000-01-01").getTime() -
      new Date(a.publishedAt ?? "2000-01-01").getTime()
    );
}

/** Ambil satu cerita lengkap dengan HTML content */
export async function getStoryBySlug(slug: string): Promise<StoryFull | null> {
  if (!fs.existsSync(CONTENT_DIR)) return null;

  // Walk semua file, cocokkan slug
  const files: string[] = [];
  function walk(dir: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) walk(path.join(dir, entry.name));
      else if (entry.name.endsWith(".md")) files.push(path.join(dir, entry.name));
    }
  }
  walk(CONTENT_DIR);

  let filePath = files.find((f) => {
    const relative = path.relative(CONTENT_DIR, f);
    const fileSlug = relative.replace(/\.md$/, "").replace(/\\/g, "-").replace(/\//g, "-");
    return fileSlug === slug;
  });

  if (!filePath && slug.startsWith("character-backstory-")) {
    const charId = slug.replace("character-backstory-", "").toLowerCase();
    // Coba cari file case-insensitive
    filePath = files.find((f) => {
      const base = path.basename(f, ".md").toLowerCase();
      return base === charId;
    });

    if (!filePath) {
      // Fallback dinamis langsung dari database jika file fisik belum terdaftar
      try {
        const characters = require("@/data/database/characters.json");
        const char = characters.find((c: any) => c.id.toLowerCase() === charId);
        if (char) {
          const localCharImg = path.join(process.cwd(), "public", "images", "characters", `${char.id}.png`);
          const coverImage = fs.existsSync(localCharImg) ? `/images/characters/${char.id}.png` : undefined;
          const html = `<h2>Pengenalan Karakter</h2><blockquote>${char.summary}</blockquote><p>${char.loreDescription}</p><h3>Profil Singkat</h3><ul><li><strong>Nama:</strong> ${char.name} (${char.title})</li><li><strong>Elemen:</strong> ${char.element.toUpperCase()}</li><li><strong>Senjata:</strong> ${char.weapon}</li><li><strong>Wilayah:</strong> ${char.region}</li><li><strong>Afiliasi:</strong> ${char.affiliation}</li><li><strong>Konstelasi:</strong> ${char.constellation}</li><li><strong>Ulang Tahun:</strong> ${char.birthday}</li></ul>`;
          return {
            slug,
            title: `Lore & Backstory: ${char.name}`,
            character: char.name,
            region: char.region,
            element: char.element,
            category: "character-backstory",
            readingTime: "8 Menit",
            audioUrl: "",
            audioDuration: "Narasi AI",
            summary: char.summary,
            tags: [char.region, char.name, char.element, "Backstory", "Official Lore"],
            publishedAt: "2026-11-04",
            rarity: char.rarity,
            coverImage,
            contentHtml: html,
          };
        }
      } catch (e) {
        // Abaikan error fallback
      }
    }
  }

  if (!filePath) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  const processed = await remark().use(remarkGfm).use(remarkHtml, { sanitize: false }).process(content);

  const baseName = path.basename(filePath, ".md");
  const localCharImg = path.join(process.cwd(), "public", "images", "characters", `${baseName}.png`);
  const coverImage = data.coverImage || (fs.existsSync(localCharImg) ? `/images/characters/${baseName}.png` : undefined);

  return {
    slug,
    ...(data as Omit<StoryMeta, "slug">),
    coverImage,
    contentHtml: processed.toString(),
  };
}

/** Filter berdasarkan region atau category */
export function filterStories(stories: StoryMeta[], region?: Region, category?: Category): StoryMeta[] {
  return stories.filter((s) => {
    if (region && region !== "Semua" && s.region !== region) return false;
    if (category && s.category !== category) return false;
    return true;
  });
}
