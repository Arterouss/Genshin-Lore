/**
 * Debug script: cek apa yang dikembalikan oleh Wiki API
 */
import { parse as parseHTML } from "node-html-parser";

const WIKI_API = "https://genshin-impact.fandom.com/api.php";
const CHAR = process.argv[2] || "Zhongli";

async function fetchPage(title) {
  const url = new URL(WIKI_API);
  url.search = new URLSearchParams({
    format: "json",
    action: "parse",
    page: title,
    prop: "text|sections|categories",
    disabletoc: "true",
    disableeditsection: "true",
  }).toString();

  const resp = await fetch(url.toString(), {
    headers: { "User-Agent": "TeyvatLoreBot/1.0" },
  });
  return resp.json();
}

async function main() {
  // 1. Cek halaman utama
  console.log(`\n=== Main page: "${CHAR}" ===`);
  const mainData = await fetchPage(CHAR);
  if (mainData.error) {
    console.log("Error:", mainData.error.info);
  } else {
    const mainHtml = mainData.parse.text["*"];
    const root = parseHTML(mainHtml);
    const firstP = root.querySelector("p");
    console.log("First paragraph:", firstP?.textContent?.trim()?.substring(0, 200));
    console.log("Sections:", mainData.parse.sections?.map(s => `${s.number}. ${s.line}`).join(", "));
    console.log("HTML length:", mainHtml.length);
  }

  // 2. Cek halaman /Lore
  console.log(`\n=== Lore page: "${CHAR}/Lore" ===`);
  const loreData = await fetchPage(`${CHAR}/Lore`);
  if (loreData.error) {
    console.log("Error:", loreData.error.info);
  } else {
    const loreHtml = loreData.parse.text["*"];
    const root = parseHTML(loreHtml);
    root.querySelectorAll("table, .mbox, .navbox, .toc, sup, .mw-references-wrap, style, script, .nomobile, .noprint, .article-thumb, figure, .pi-data, .aside-table, .wds-tabber, .tabber")
      .forEach((el) => el.remove());
    const text = root.textContent.trim();
    console.log("Content length (cleaned):", text.length);
    console.log("First 300 chars:", text.substring(0, 300));
    console.log("Sections:", loreData.parse.sections?.map(s => `${s.number}. ${s.line}`).join("\n  "));
  }

  // 3. Coba halaman /Story
  console.log(`\n=== Story page: "${CHAR}/Story" ===`);
  const storyData = await fetchPage(`${CHAR}/Story`);
  if (storyData.error) {
    console.log("Error:", storyData.error.info);
  } else {
    const storyHtml = storyData.parse.text["*"];
    const root = parseHTML(storyHtml);
    root.querySelectorAll("table, .mbox, .navbox, .toc, sup, .mw-references-wrap, style, script, .nomobile, .noprint, .article-thumb, figure, .pi-data, .aside-table")
      .forEach((el) => el.remove());
    const text = root.textContent.trim();
    console.log("Content length (cleaned):", text.length);
    console.log("First 500 chars:", text.substring(0, 500));
    console.log("Sections:", storyData.parse.sections?.map(s => `${s.number}. ${s.line}`).join("\n  "));
  }

  // 4. Coba Companion page
  console.log(`\n=== Companion page: "${CHAR}/Companion" ===`);
  const compData = await fetchPage(`${CHAR}/Companion`);
  if (compData.error) {
    console.log("Error:", compData.error.info);
  } else {
    const compHtml = compData.parse.text["*"];
    console.log("HTML length:", compHtml.length);
    console.log("Sections:", compData.parse.sections?.map(s => `${s.number}. ${s.line}`).join("\n  "));
  }
}

main().catch(console.error);

