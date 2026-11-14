const fs = require("fs");
const path = require("path");
const genshindb = require("genshin-db");

const characters = require("../src/data/database/characters.json");
const storiesDir = path.join(__dirname, "..", "content", "stories", "character-backstory");

if (!fs.existsSync(storiesDir)) {
  fs.mkdirSync(storiesDir, { recursive: true });
}

let createdCount = 0;

for (const c of characters) {
  const filePath = path.join(storiesDir, `${c.id}.md`);
  if (fs.existsSync(filePath)) {
    continue; // File sudah ada
  }

  // Coba ambil data lebih mendalam dari genshin-db
  let gdbChar =
    genshindb.characters(c.id, { resultLanguage: "Indonesian" }) ||
    genshindb.characters(c.name, { resultLanguage: "Indonesian" }) ||
    genshindb.characters(c.id, { resultLanguage: "English" }) ||
    genshindb.characters(c.name, { resultLanguage: "English" });

  let vo =
    genshindb.voiceovers(c.id, { resultLanguage: "Indonesian" }) ||
    genshindb.voiceovers(c.name, { resultLanguage: "Indonesian" }) ||
    genshindb.voiceovers(c.id, { resultLanguage: "English" }) ||
    genshindb.voiceovers(c.name, { resultLanguage: "English" });

  let tal =
    genshindb.talents(c.id, { resultLanguage: "Indonesian" }) ||
    genshindb.talents(c.name, { resultLanguage: "Indonesian" });

  let con =
    genshindb.constellations(c.id, { resultLanguage: "Indonesian" }) ||
    genshindb.constellations(c.name, { resultLanguage: "Indonesian" });

  // Voice lines section
  let voicelinesSection = "";
  if (vo && vo.friendLines && vo.friendLines.length > 0) {
    const lines = vo.friendLines
      .slice(0, 15)
      .map((f) => `* **${f.title}:** "${f.description.replace(/"/g, '\\"')}"`)
      .join("\n\n");
    voicelinesSection = `\n\n## Transkrip Suara Resmi Karakter (Voice Lines)\n\n${lines}`;
  }

  // Talents section
  let talentsSection = "";
  if (tal) {
    const parts = [];
    if (tal.combat1) parts.push(`* **${tal.combat1.name} (Normal Attack):** ${tal.combat1.description.replace(/\n+/g, " ")}`);
    if (tal.combat2) parts.push(`* **${tal.combat2.name} (Elemental Skill):** ${tal.combat2.description.replace(/\n+/g, " ")}`);
    if (tal.combat3) parts.push(`* **${tal.combat3.name} (Elemental Burst):** ${tal.combat3.description.replace(/\n+/g, " ")}`);
    if (tal.passive1) parts.push(`* **${tal.passive1.name} (Pasif 1):** ${tal.passive1.description.replace(/\n+/g, " ")}`);
    if (tal.passive2) parts.push(`* **${tal.passive2.name} (Pasif 2):** ${tal.passive2.description.replace(/\n+/g, " ")}`);
    if (parts.length > 0) {
      talentsSection = `\n\n### Seni Bertarung & Bakat Elemen\n\n${parts.join("\n\n")}`;
    }
  }

  // Constellation section
  let constellationSection = "";
  if (con) {
    const cparts = [];
    if (con.c1) cparts.push(`* **C1 - ${con.c1.name}:** ${con.c1.description.replace(/\n+/g, " ")}`);
    if (con.c2) cparts.push(`* **C2 - ${con.c2.name}:** ${con.c2.description.replace(/\n+/g, " ")}`);
    if (con.c3) cparts.push(`* **C3 - ${con.c3.name}:** ${con.c3.description.replace(/\n+/g, " ")}`);
    if (con.c4) cparts.push(`* **C4 - ${con.c4.name}:** ${con.c4.description.replace(/\n+/g, " ")}`);
    if (con.c5) cparts.push(`* **C5 - ${con.c5.name}:** ${con.c5.description.replace(/\n+/g, " ")}`);
    if (con.c6) cparts.push(`* **C6 - ${con.c6.name}:** ${con.c6.description.replace(/\n+/g, " ")}`);
    if (cparts.length > 0) {
      constellationSection = `\n\n### Takdir Konstelasi Bintang (${c.constellation})\n\n${cparts.join("\n\n")}`;
    }
  }

  const audioUrl = ""; // Mode Narator AI aktif otomatis bila audioUrl kosong
  const stars = "★".repeat(c.rarity);

  const fileContent = `---
title: "Lore & Backstory: ${c.name}"
character: "${c.name}"
region: "${c.region}"
element: "${c.element}"
category: "character-backstory"
readingTime: "8 Menit"
audioUrl: "${audioUrl}"
audioDuration: "Narasi AI"
summary: "${c.summary.replace(/"/g, '\\"')}"
tags: ["${c.region}", "${c.name}", "${c.element}", "Backstory", "Official Lore"]
publishedAt: "2026-11-04"
rarity: ${c.rarity}
---
## Pengenalan Karakter Resmi

> ${c.summary}

${c.loreDescription}

### Profil Karakter
* **Nama Lengkap:** ${c.name}
* **Gelar Kehormatan:** ${c.title}
* **Kelangkaan (Rarity):** ${stars} (${c.rarity}★)
* **Elemen Pengendalian:** ${c.element.toUpperCase()}
* **Tipe Senjata:** ${c.weapon}
* **Wilayah Asal:** ${c.region}
* **Afiliasi / Organisasi:** ${c.affiliation}
* **Konstelasi Takdir:** ${c.constellation}
* **Tanggal Lahir:** ${c.birthday}

## Catatan Sejarah & Latar Belakang

${c.name} adalah sosok pejuang yang memegang peran penting di wilayah ${c.region}. Dengan anugerah Vision berelemen ${c.element.toUpperCase()} serta kemahiran bertarung menggunakan senjata berjenis ${c.weapon}, ${c.name} mengukir kisahnya sendiri di tengah takdir benua Teyvat yang penuh rahasia.

Sebagai bagian dari ${c.affiliation}, ${c.name} dikenal atas dedikasi dan kontribusinya bagi masyarakat di wilayah ${c.region}. Di bawah naungan rasi bintang **${c.constellation}**, setiap langkah perjalanannya terikat erat dengan hukum kosmik dan leylines dunia.${talentsSection}${constellationSection}${voicelinesSection}
`;

  fs.writeFileSync(filePath, fileContent, "utf-8");
  createdCount++;
}

console.log(`Berhasil membuat ${createdCount} file backstory karakter baru! Total file sekarang: ${fs.readdirSync(storiesDir).length}`);
