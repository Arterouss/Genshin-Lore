/**
 * ═══════════════════════════════════════════════════════════════
 *  Teyvat Lore — Genshin Impact Fandom Wiki Scraper v3
 * ═══════════════════════════════════════════════════════════════
 * 
 *  Mengambil Character Stories & Voice-Overs dari Fandom Wiki API
 *  dan menyimpannya ke:
 *    1. `content/stories/character-backstory/[slug].md` (Markdown per karakter)
 *    2. `content/stories/archon-quest/[slug].md` (Markdown per Archon Quest)
 *    3. `content/data/all-lore.json` (Master JSON untuk pencarian/arsip lengkap)
 * 
 *  Penggunaan:
 *    node scripts/scrape-wiki.mjs --character "Zhongli"
 *    node scripts/scrape-wiki.mjs --region "Liyue"
 *    node scripts/scrape-wiki.mjs --archons             # Hanya 7 Archon utama
 *    node scripts/scrape-wiki.mjs --quests              # Hanya Archon Quests
 *    node scripts/scrape-wiki.mjs --popular             # 20+ karakter terpopuler
 *    node scripts/scrape-wiki.mjs --all                 # Semua karakter + quests
 * 
 * ═══════════════════════════════════════════════════════════════
 */

import fs from "fs";
import path from "path";
import { parse as parseHTML } from "node-html-parser";

const WIKI_API = "https://genshin-impact.fandom.com/api.php";
const OUTPUT_DIR = path.resolve("content/stories");
const DATA_DIR = path.resolve("content/data");
const DELAY_MS = 600;

// ─── 7 Archon Utama ─────────────────────────────────────────
export const ARCHONS = [
  { name: "Venti",         title: "Barbatos",   region: "Mondstadt", element: "anemo",   rarity: 5 },
  { name: "Zhongli",       title: "Morax",      region: "Liyue",     element: "geo",     rarity: 5 },
  { name: "Raiden Shogun", title: "Beelzebul",  region: "Inazuma",   element: "electro", rarity: 5 },
  { name: "Nahida",        title: "Buer",       region: "Sumeru",    element: "dendro",  rarity: 5 },
  { name: "Furina",        title: "Focalors",   region: "Fontaine",  element: "hydro",   rarity: 5 },
  { name: "Mavuika",       title: "Habroc",     region: "Natlan",    element: "pyro",    rarity: 5 },
];

// ─── Karakter Populer / Kunci Lore ──────────────────────────
export const POPULAR_CHARACTERS = [
  ...ARCHONS,
  { name: "Neuvillette",      region: "Fontaine",  element: "hydro",   rarity: 5 },
  { name: "Albedo",           region: "Mondstadt", element: "geo",     rarity: 5 },
  { name: "Diluc",            region: "Mondstadt", element: "pyro",    rarity: 5 },
  { name: "Kaeya",            region: "Mondstadt", element: "cryo",    rarity: 4 },
  { name: "Xiao",             region: "Liyue",     element: "anemo",   rarity: 5 },
  { name: "Hu Tao",           region: "Liyue",     element: "pyro",    rarity: 5 },
  { name: "Ganyu",            region: "Liyue",     element: "cryo",    rarity: 5 },
  { name: "Yelan",            region: "Liyue",     element: "hydro",   rarity: 5 },
  { name: "Kaedehara Kazuha", region: "Inazuma",   element: "anemo",   rarity: 5 },
  { name: "Kamisato Ayaka",   region: "Inazuma",   element: "cryo",    rarity: 5 },
  { name: "Yae Miko",         region: "Inazuma",   element: "electro", rarity: 5 },
  { name: "Wanderer",         region: "Sumeru",    element: "anemo",   rarity: 5 },
  { name: "Alhaitham",        region: "Sumeru",    element: "dendro",  rarity: 5 },
  { name: "Cyno",             region: "Sumeru",    element: "electro", rarity: 5 },
  { name: "Navia",            region: "Fontaine",  element: "geo",     rarity: 5 },
  { name: "Clorinde",         region: "Fontaine",  element: "electro", rarity: 5 },
  { name: "Arlecchino",       region: "Fontaine",  element: "pyro",    rarity: 5 },
  { name: "Kinich",           region: "Natlan",    element: "dendro",  rarity: 5 },
  { name: "Xilonen",          region: "Natlan",    element: "geo",     rarity: 5 },
  { name: "Mualani",          region: "Natlan",    element: "hydro",   rarity: 5 },
  { name: "Tartaglia",        region: "Snezhnaya", element: "hydro",   rarity: 5 },
];

// ─── Daftar Seluruh Karakter ────────────────────────────────
export const ALL_CHARACTERS = [
  ...POPULAR_CHARACTERS,
  // Mondstadt
  { name: "Amber",    region: "Mondstadt", element: "pyro",    rarity: 4 },
  { name: "Barbara",  region: "Mondstadt", element: "hydro",   rarity: 4 },
  { name: "Bennett",  region: "Mondstadt", element: "pyro",    rarity: 4 },
  { name: "Diona",    region: "Mondstadt", element: "cryo",    rarity: 4 },
  { name: "Eula",     region: "Mondstadt", element: "cryo",    rarity: 5 },
  { name: "Fischl",   region: "Mondstadt", element: "electro", rarity: 4 },
  { name: "Jean",     region: "Mondstadt", element: "anemo",   rarity: 5 },
  { name: "Klee",     region: "Mondstadt", element: "pyro",    rarity: 5 },
  { name: "Lisa",     region: "Mondstadt", element: "electro", rarity: 4 },
  { name: "Mona",     region: "Mondstadt", element: "hydro",   rarity: 5 },
  { name: "Noelle",   region: "Mondstadt", element: "geo",     rarity: 4 },
  { name: "Razor",    region: "Mondstadt", element: "electro", rarity: 4 },
  { name: "Rosaria",  region: "Mondstadt", element: "cryo",    rarity: 4 },
  { name: "Sucrose",  region: "Mondstadt", element: "anemo",   rarity: 4 },

  // Liyue
  { name: "Baizhu",   region: "Liyue", element: "dendro",  rarity: 5 },
  { name: "Beidou",   region: "Liyue", element: "electro", rarity: 4 },
  { name: "Chongyun", region: "Liyue", element: "cryo",    rarity: 4 },
  { name: "Gaming",   region: "Liyue", element: "pyro",    rarity: 4 },
  { name: "Keqing",   region: "Liyue", element: "electro", rarity: 5 },
  { name: "Ningguang",region: "Liyue", element: "geo",     rarity: 4 },
  { name: "Qiqi",     region: "Liyue", element: "cryo",    rarity: 5 },
  { name: "Shenhe",   region: "Liyue", element: "cryo",    rarity: 5 },
  { name: "Xiangling",region: "Liyue", element: "pyro",    rarity: 4 },
  { name: "Xingqiu",  region: "Liyue", element: "hydro",   rarity: 4 },
  { name: "Yanfei",   region: "Liyue", element: "pyro",    rarity: 4 },
  { name: "Xianyun",  region: "Liyue", element: "anemo",   rarity: 5 },

  // Inazuma
  { name: "Arataki Itto",       region: "Inazuma", element: "geo",     rarity: 5 },
  { name: "Kamisato Ayato",     region: "Inazuma", element: "hydro",   rarity: 5 },
  { name: "Kuki Shinobu",       region: "Inazuma", element: "electro", rarity: 4 },
  { name: "Kujou Sara",         region: "Inazuma", element: "electro", rarity: 4 },
  { name: "Sangonomiya Kokomi", region: "Inazuma", element: "hydro",   rarity: 5 },
  { name: "Thoma",              region: "Inazuma", element: "pyro",    rarity: 4 },
  { name: "Yoimiya",            region: "Inazuma", element: "pyro",    rarity: 5 },

  // Sumeru
  { name: "Collei",   region: "Sumeru", element: "dendro",  rarity: 4 },
  { name: "Dehya",    region: "Sumeru", element: "pyro",    rarity: 5 },
  { name: "Faruzan",  region: "Sumeru", element: "anemo",   rarity: 4 },
  { name: "Kaveh",    region: "Sumeru", element: "dendro",  rarity: 4 },
  { name: "Layla",    region: "Sumeru", element: "cryo",    rarity: 4 },
  { name: "Nilou",    region: "Sumeru", element: "hydro",   rarity: 5 },
  { name: "Tighnari", region: "Sumeru", element: "dendro",  rarity: 5 },

  // Fontaine
  { name: "Lyney",        region: "Fontaine", element: "pyro",  rarity: 5 },
  { name: "Lynette",      region: "Fontaine", element: "anemo", rarity: 4 },
  { name: "Freminet",     region: "Fontaine", element: "cryo",  rarity: 4 },
  { name: "Wriothesley",  region: "Fontaine", element: "cryo",  rarity: 5 },
  { name: "Sigewinne",    region: "Fontaine", element: "hydro", rarity: 5 },
  { name: "Chevreuse",    region: "Fontaine", element: "pyro",  rarity: 4 },

  // Natlan
  { name: "Chasca",  region: "Natlan", element: "anemo", rarity: 5 },
  { name: "Citlali", region: "Natlan", element: "cryo",  rarity: 5 },
  { name: "Kachina", region: "Natlan", element: "geo",   rarity: 4 },
];

// Unique characters by name
const UNIQUE_CHARACTERS = Array.from(
  new Map(ALL_CHARACTERS.map(c => [c.name, c])).values()
);

// ─── Archon Quests ─────────────────────────────────────────
export const ARCHON_QUESTS = [
  { wikiPage: "Prologue",   title: "Prologue: The Outlander Who Caught the Wind", region: "Mondstadt" },
  { wikiPage: "Chapter_I",  title: "Chapter I: Farewell, Archaic Lord",           region: "Liyue" },
  { wikiPage: "Chapter_II", title: "Chapter II: Omnipresence Over Mortals",        region: "Inazuma" },
  { wikiPage: "Chapter_III",title: "Chapter III: Truth Amongst the Pages of Purana",region: "Sumeru" },
  { wikiPage: "Chapter_IV", title: "Chapter IV: Masquerade of the Guilty",         region: "Fontaine" },
  { wikiPage: "Chapter_V",  title: "Chapter V: Incandescent Ode of Resurrection",  region: "Natlan" },
];

// ─── Helpers ───────────────────────────────────────────────
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function ensureDir(dir) { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); }

async function fetchWikiPage(title) {
  const url = new URL(WIKI_API);
  url.search = new URLSearchParams({
    format: "json",
    action: "parse",
    page: title,
    prop: "text|sections",
    disabletoc: "true",
    disableeditsection: "true",
  }).toString();

  const resp = await fetch(url.toString(), {
    headers: { "User-Agent": "TeyvatLoreBot/2.0 (Indonesian Lore Community; Genshin Web)" },
  });
  if (!resp.ok) return null;
  const json = await resp.json();
  if (json.error) return null;
  return json.parse;
}

// ─── Ekstraksi Konten Lore Karakter dari Profile ────────────
function extractCharacterStories(html) {
  const root = parseHTML(html);
  const po = root.querySelector(".mw-parser-output") || root;

  // Hapus elemen sampah
  po.querySelectorAll([
    "table.wikitable", ".mbox", ".navbox", ".toc", "sup", ".reference",
    ".mw-references-wrap", "style", "script", ".nomobile", ".noprint",
    ".article-thumb", "figure", ".pi-data", ".aside-table",
    ".wds-tabber", ".tabber", ".wikia-gallery", ".gallery",
    ".mw-collapsible", "nav", ".portable-infobox", ".infobox",
    "noscript", ".mw-editsection"
  ].join(",")).forEach(el => el.remove());

  let collecting = false;
  const output = [];
  let summaryText = "";

  for (const el of po.childNodes) {
    const tag = el.tagName?.toUpperCase();
    if (!tag) continue;
    const text = el.textContent.trim();

    if (tag === "H2") {
      const cleanH2 = text.replace(/\[edit\]/gi, "").trim();
      const lowerH2 = cleanH2.toLowerCase();

      // Mulai ambil dari "Official Introduction" atau "Character Stories"
      if (
        lowerH2.includes("character stories") ||
        lowerH2.includes("official introduction")
      ) {
        collecting = true;
        output.push(`\n## ${cleanH2}\n`);
      } else if (
        lowerH2.includes("namecard") ||
        lowerH2.includes("quests and events") ||
        lowerH2.includes("trivia") ||
        lowerH2.includes("references") ||
        lowerH2.includes("navigation") ||
        lowerH2.includes("character trials")
      ) {
        collecting = false;
      }
      continue;
    }

    if (collecting) {
      if (tag === "H3") {
        const cleanH3 = text.replace(/\[edit\]/gi, "").trim();
        output.push(`\n### ${cleanH3}\n`);
      } else if (tag === "H4") {
        const cleanH4 = text.replace(/\[edit\]/gi, "").trim();
        output.push(`\n#### ${cleanH4}\n`);
      } else if (tag === "BLOCKQUOTE" || tag === "Q") {
        if (text.length > 5) {
          output.push(`> ${text.replace(/\n+/g, " ")}\n`);
        }
      } else if (tag === "P") {
        if (text.length > 15 && !text.includes("OverviewProfileStoryline")) {
          if (!summaryText && text.length > 40) {
            summaryText = text.substring(0, 280);
          }
          output.push(`${text}\n`);
        }
      } else if (tag === "UL" || tag === "OL") {
        const items = el.querySelectorAll(":scope > li");
        if (items.length > 0) {
          items.forEach(li => {
            const liText = li.textContent.trim();
            if (liText.length > 2) output.push(`- ${liText}`);
          });
          output.push("");
        }
      }
    }
  }

  let finalMarkdown = output.join("\n").replace(/\n{3,}/g, "\n\n").trim();
  return { markdown: finalMarkdown, summary: summaryText };
}

// ─── Ekstraksi Konten Archon Quest ──────────────────────────
function extractQuestContent(html) {
  const root = parseHTML(html);
  const po = root.querySelector(".mw-parser-output") || root;

  po.querySelectorAll([
    "table.wikitable", ".mbox", ".navbox", ".toc", "sup", ".reference",
    ".mw-references-wrap", "style", "script", ".nomobile", ".noprint",
    ".article-thumb", "figure", ".pi-data", ".aside-table",
    ".wds-tabber", ".tabber", ".wikia-gallery", ".gallery",
    "nav", ".portable-infobox", ".infobox", "noscript", ".mw-editsection"
  ].join(",")).forEach(el => el.remove());

  const output = [];
  let summary = "";
  let insideSummary = false;

  for (const el of po.childNodes) {
    const tag = el.tagName?.toUpperCase();
    if (!tag) continue;
    const text = el.textContent.trim();

    if (tag === "H2") {
      const cleanH2 = text.replace(/\[edit\]/gi, "").trim();
      const lower = cleanH2.toLowerCase();
      if (lower.includes("gallery") || lower.includes("navigation") || lower.includes("references") || lower.includes("change history")) {
        break;
      }
      output.push(`\n## ${cleanH2}\n`);
      insideSummary = lower.includes("summary");
      continue;
    }

    if (tag === "H3") {
      output.push(`\n### ${text.replace(/\[edit\]/gi, "").trim()}\n`);
    } else if (tag === "P" && text.length > 15) {
      if (!summary && insideSummary) summary = text.substring(0, 280);
      output.push(`${text}\n`);
    } else if (tag === "UL" || tag === "OL") {
      el.querySelectorAll(":scope > li").forEach(li => {
        const t = li.textContent.trim();
        if (t.length > 2) output.push(`- ${t}`);
      });
      output.push("");
    }
  }

  return { markdown: output.join("\n").replace(/\n{3,}/g, "\n\n").trim(), summary };
}

// ─── Scrape Single Character ────────────────────────────────
async function scrapeCharacter(char) {
  const { name, region, element, rarity } = char;
  console.log(`✦ Scraping: ${name} (${region} / ${element})`);

  let parsed = await fetchWikiPage(`${name}/Profile`);
  await sleep(DELAY_MS);

  if (!parsed) {
    parsed = await fetchWikiPage(name);
    await sleep(DELAY_MS);
  }

  if (!parsed) {
    console.log(`  ⚠ Halaman ${name} tidak ditemukan di wiki.`);
    return null;
  }

  const { markdown, summary } = extractCharacterStories(parsed.text["*"]);

  if (markdown.length < 150) {
    console.log(`  ⚠ Konten ${name} terlalu pendek (${markdown.length} karakter).`);
    return null;
  }

  const slug = `character-backstory-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "")}`;
  const wordCount = markdown.split(/\s+/).length;
  const readMin = Math.max(5, Math.ceil(wordCount / 200));
  const finalSummary = (summary || `Kumpulan catatan resmi Character Stories dan latar belakang ${name} dari ${region}.`)
    .replace(/"/g, '\\"');

  const frontmatter = [
    "---",
    `title: "Lore & Backstory: ${name}"`,
    `character: "${name}"`,
    `region: "${region}"`,
    `element: "${element}"`,
    `category: "character-backstory"`,
    `readingTime: "${readMin} Menit"`,
    `audioUrl: ""`,
    `audioDuration: ""`,
    `summary: "${finalSummary}"`,
    `tags: ["${region}", "${name}", "${element.charAt(0).toUpperCase() + element.slice(1)}", "Backstory", "Official Lore"]`,
    `publishedAt: "${new Date().toISOString().split("T")[0]}"`,
    `rarity: ${rarity || 5}`,
    "---",
    "",
  ].join("\n");

  return {
    slug,
    name,
    region,
    element,
    rarity: rarity || 5,
    readingTime: `${readMin} Menit`,
    summary: finalSummary,
    wordCount,
    frontmatter,
    content: markdown,
  };
}

// ─── Scrape Single Quest ────────────────────────────────────
async function scrapeQuest(quest) {
  const { wikiPage, title, region } = quest;
  console.log(`📖 Scraping Quest: ${title}`);

  const parsed = await fetchWikiPage(wikiPage);
  await sleep(DELAY_MS);

  if (!parsed) return null;

  const { markdown, summary } = extractQuestContent(parsed.text["*"]);
  if (markdown.length < 150) return null;

  const slug = `archon-quest-${wikiPage.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "")}`;
  const wordCount = markdown.split(/\s+/).length;
  const readMin = Math.max(8, Math.ceil(wordCount / 200));
  const finalSummary = (summary || `Rangkuman alur cerita utama ${title} yang berpusat di wilayah ${region}.`)
    .replace(/"/g, '\\"');

  const frontmatter = [
    "---",
    `title: "${title}"`,
    `region: "${region}"`,
    `element: "none"`,
    `category: "archon-quest"`,
    `readingTime: "${readMin} Menit"`,
    `audioUrl: ""`,
    `audioDuration: ""`,
    `summary: "${finalSummary}"`,
    `tags: ["${region}", "Archon Quest", "Main Story", "Teyvat History"]`,
    `publishedAt: "${new Date().toISOString().split("T")[0]}"`,
    "---",
    "",
  ].join("\n");

  return {
    slug,
    title,
    region,
    readingTime: `${readMin} Menit`,
    summary: finalSummary,
    wordCount,
    frontmatter,
    content: markdown,
  };
}

// ─── Main Runner ───────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  const flagChar = args.indexOf("--character");
  const flagRegion = args.indexOf("--region");
  const flagArchons = args.includes("--archons");
  const flagPopular = args.includes("--popular");
  const flagQuestsOnly = args.includes("--quests");
  const flagAll = args.includes("--all");

  let targetChars = [];

  if (flagChar > -1 && args[flagChar + 1]) {
    const q = args[flagChar + 1].toLowerCase();
    targetChars = UNIQUE_CHARACTERS.filter(c => c.name.toLowerCase().includes(q));
  } else if (flagRegion > -1 && args[flagRegion + 1]) {
    const r = args[flagRegion + 1].toLowerCase();
    targetChars = UNIQUE_CHARACTERS.filter(c => c.region.toLowerCase() === r);
  } else if (flagArchons) {
    targetChars = ARCHONS;
  } else if (flagPopular || (!flagQuestsOnly && !flagAll)) {
    // Default: Karakter populer kunci lore (~25 karakter)
    targetChars = POPULAR_CHARACTERS;
  } else if (flagAll) {
    targetChars = UNIQUE_CHARACTERS;
  }

  const doQuests = flagAll || flagQuestsOnly || flagPopular || (!flagChar && !flagRegion);

  console.log("═══════════════════════════════════════════════════════");
  console.log("  ✦ Teyvat Lore — Wiki Scraper v3");
  console.log("═══════════════════════════════════════════════════════");
  console.log(`  Karakter Target : ${targetChars.length}`);
  console.log(`  Archon Quests   : ${doQuests ? ARCHON_QUESTS.length : "Dilewati"}`);
  console.log(`  Lokasi Output   : ${OUTPUT_DIR}`);
  console.log("═══════════════════════════════════════════════════════\n");

  ensureDir(DATA_DIR);
  ensureDir(path.join(OUTPUT_DIR, "character-backstory"));
  ensureDir(path.join(OUTPUT_DIR, "archon-quest"));

  const masterData = {
    scrapedAt: new Date().toISOString(),
    characters: [],
    archonQuests: [],
  };

  let charSuccess = 0;
  for (let i = 0; i < targetChars.length; i++) {
    const char = targetChars[i];
    console.log(`[${i + 1}/${targetChars.length}]`);
    try {
      const res = await scrapeCharacter(char);
      if (res) {
        const filePath = path.join(OUTPUT_DIR, "character-backstory", `${res.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.md`);
        fs.writeFileSync(filePath, res.frontmatter + res.content, "utf-8");
        console.log(`  ✅ Tersimpan: ${path.basename(filePath)} (${res.wordCount} kata, ~${res.readingTime})`);
        charSuccess++;
        masterData.characters.push({
          slug: res.slug,
          name: res.name,
          region: res.region,
          element: res.element,
          rarity: res.rarity,
          readingTime: res.readingTime,
          summary: res.summary,
          wordCount: res.wordCount,
        });
      }
    } catch (e) {
      console.error(`  ❌ Error ${char.name}: ${e.message}`);
    }
    await sleep(DELAY_MS);
  }

  let questSuccess = 0;
  if (doQuests) {
    console.log("\n📖 ═══ Archon Quests ═══\n");
    for (let i = 0; i < ARCHON_QUESTS.length; i++) {
      const q = ARCHON_QUESTS[i];
      console.log(`[${i + 1}/${ARCHON_QUESTS.length}]`);
      try {
        const res = await scrapeQuest(q);
        if (res) {
          const filePath = path.join(OUTPUT_DIR, "archon-quest", `${q.wikiPage.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.md`);
          fs.writeFileSync(filePath, res.frontmatter + res.content, "utf-8");
          console.log(`  ✅ Tersimpan: ${path.basename(filePath)} (${res.wordCount} kata)`);
          questSuccess++;
          masterData.archonQuests.push({
            slug: res.slug,
            title: res.title,
            region: res.region,
            readingTime: res.readingTime,
            summary: res.summary,
            wordCount: res.wordCount,
          });
        }
      } catch (e) {
        console.error(`  ❌ Error ${q.title}: ${e.message}`);
      }
      await sleep(DELAY_MS);
    }
  }

  // Simpan JSON Master
  const jsonPath = path.join(DATA_DIR, "all-lore.json");
  fs.writeFileSync(jsonPath, JSON.stringify(masterData, null, 2), "utf-8");

  console.log("\n═══════════════════════════════════════════════════════");
  console.log("  ✦ PROSES SELESAI");
  console.log("═══════════════════════════════════════════════════════");
  console.log(`  ✅ Karakter Sukses    : ${charSuccess}`);
  console.log(`  📖 Archon Quest Sukses: ${questSuccess}`);
  console.log(`  📁 JSON Master        : ${jsonPath}`);
  console.log("═══════════════════════════════════════════════════════\n");
}

main().catch(console.error);
