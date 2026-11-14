const fs = require("fs");
const path = require("path");
const genshindb = require("genshin-db");

const outputPath = path.join(__dirname, "..", "src", "data", "database", "weapons.json");
const weaponNames = genshindb.weapons("names", { matchCategories: true });

console.log(`Menemukan ${weaponNames.length} senjata di genshin-db...`);

const weapons = [];
const seenIds = new Set();

for (const name of weaponNames) {
  // Ambil data bahasa Indonesia, fallback ke Inggris
  const wId = genshindb.weapons(name, { resultLanguage: "Indonesian" });
  const wEn = genshindb.weapons(name, { resultLanguage: "English" }) || wId;
  const w = wId || wEn;
  if (!w) continue;

  let type = "Sword";
  if (w.weaponType) {
    if (w.weaponType.includes("CLAYMORE")) type = "Claymore";
    else if (w.weaponType.includes("POLE")) type = "Polearm";
    else if (w.weaponType.includes("BOW")) type = "Bow";
    else if (w.weaponType.includes("CATALYST")) type = "Catalyst";
  }

  // Buat ID slug unik
  let baseSlug = (wEn.name || w.name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  if (seenIds.has(baseSlug)) {
    baseSlug = `${baseSlug}-${w.id || w.rarity}`;
  }
  seenIds.add(baseSlug);

  const iconUrl =
    w.images?.mihoyo_icon ||
    w.images?.icon ||
    w.images?.mihoyo_awakenIcon ||
    "";

  const passiveDesc = w.r1?.description
    ? w.r1.description.replace(/\n+/g, " ")
    : wEn.r1?.description
    ? wEn.r1.description.replace(/\n+/g, " ")
    : "Senjata tanpa efek pasif khusus.";

  const loreStory = w.story
    ? w.story
    : wEn.story
    ? wEn.story
    : w.description || "Kisah senjata belum tercatat dalam arsip kuno.";

  weapons.push({
    id: baseSlug,
    name: w.name,
    type,
    rarity: w.rarity,
    baseAtk: w.baseAtkValue || 0,
    subStat: w.mainStatText || "None",
    passiveName: w.effectName || wEn.effectName || "Kemampuan Standar",
    passiveDesc,
    description: w.description || wEn.description || "",
    loreStory,
    iconUrl,
  });
}

// Urutkan berdasarkan rarity menurun (5★ dulu), lalu nama
weapons.sort((a, b) => b.rarity - a.rarity || a.name.localeCompare(b.name));

fs.writeFileSync(outputPath, JSON.stringify(weapons, null, 2), "utf-8");
console.log(`Berhasil mengekstrak ${weapons.length} senjata ke ${outputPath}!`);
