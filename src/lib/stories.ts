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
    return relative.replace(/\.md$/, "").split(path.sep).join("-");
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
      return { slug, ...data } as StoryMeta;
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

  const filePath = files.find((f) => {
    const relative = path.relative(CONTENT_DIR, f);
    const fileSlug = relative.replace(/\.md$/, "").split(path.sep).join("-");
    return fileSlug === slug;
  });

  if (!filePath) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  const processed = await remark().use(remarkGfm).use(remarkHtml, { sanitize: false }).process(content);

  return {
    slug,
    ...(data as Omit<StoryMeta, "slug">),
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
