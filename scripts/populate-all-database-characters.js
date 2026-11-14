const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const storiesDir = path.join(__dirname, '..', 'content', 'stories', 'character-backstory');
const dbDir = path.join(__dirname, '..', 'src', 'data', 'database');
const existingDbChars = JSON.parse(fs.readFileSync(path.join(dbDir, 'characters.json'), 'utf-8'));

const existingMap = new Map(existingDbChars.map(c => [c.id, c]));

// Weapon and detail lookup for remaining characters
const characterDetails = {
  "albedo": { weapon: "Sword", affiliation: "Knights of Favonius", constellation: "Princeps Cretaceus", title: "Kreideprinz", birthday: "13 September" },
  "alhaitham": { weapon: "Sword", affiliation: "Sumeru Akademiya", constellation: "Vultur Volans", title: "Admonishing Instruction", birthday: "11 Februari" },
  "arataki-itto": { weapon: "Claymore", affiliation: "Arataki Gang", constellation: "Taurus Iracundus", title: "Hanamizaka Heroics", birthday: "1 Juni" },
  "baizhu": { weapon: "Catalyst", affiliation: "Bubu Pharmacy", constellation: "Lagenaria", title: "Beyond Mortality", birthday: "25 April" },
  "chasca": { weapon: "Bow", affiliation: "Tlalocan (Flower-Feather Clan)", constellation: "Vultur Caeruleus", title: "Skybreaker", birthday: "20 Desember" },
  "clorinde": { weapon: "Sword", affiliation: "Champion Duelists", constellation: "Rapperia", title: "Candlebearer, Shadowhunter", birthday: "20 September" },
  "cyno": { weapon: "Polearm", affiliation: "Temple of Silence / Matra", constellation: "Lupus Aureus", title: "Judicator of Secrets", birthday: "23 Juni" },
  "dehya": { weapon: "Claymore", affiliation: "The Eremites", constellation: "Mantichora", title: "Flame-Mane", birthday: "7 April" },
  "eula": { weapon: "Claymore", affiliation: "Knights of Favonius / Lawrence Clan", constellation: "Aphros Delos", title: "Spindrift Knight", birthday: "25 Oktober" },
  "ganyu": { weapon: "Bow", affiliation: "Yuehai Pavilion", constellation: "Sinae Unicornis", title: "Plenilune Gaze", birthday: "2 Desember" },
  "jean": { weapon: "Sword", affiliation: "Knights of Favonius", constellation: "Leo Minor", title: "Dandelion Knight", birthday: "14 Maret" },
  "kamisato-ayaka": { weapon: "Sword", affiliation: "Yashiro Commission", constellation: "Grus Nivis", title: "Frostflake Heron", birthday: "28 September" },
  "kamisato-ayato": { weapon: "Sword", affiliation: "Yashiro Commission", constellation: "Cypressus Custos", title: "Pillar of Fortitude", birthday: "26 Maret" },
  "keqing": { weapon: "Sword", affiliation: "Liyue Qixing", constellation: "Trulla Cementarii", title: "Driving Thunder", birthday: "20 November" },
  "kinich": { weapon: "Claymore", affiliation: "Scions of the Canopy", constellation: "Chimaera Alebrijes", title: "Hunting Hunter", birthday: "10 November" },
  "klee": { weapon: "Catalyst", affiliation: "Knights of Favonius", constellation: "Trifolium", title: "Fleeing Sunlight", birthday: "27 Juli" },
  "lyney": { weapon: "Bow", affiliation: "Hotel Bouffes d'ete / Fatui", constellation: "Felis Alba", title: "Spectacle of Phantasmagoria", birthday: "2 Februari" },
  "mavuika": { weapon: "Claymore", affiliation: "Natlan / The Seven", constellation: "Sol Invictus", title: "Habringer of Dawnfire", birthday: "24 Juli" },
  "mualani": { weapon: "Catalyst", affiliation: "People of the Springs", constellation: "Phoca Neomonachus", title: "Splish-Splash Wavechaser", birthday: "3 Agustus" },
  "navia": { weapon: "Claymore", affiliation: "Spina di Rosula", constellation: "Rosa Multiflora", title: "Helm of the Radiant Rose", birthday: "16 Agustus" },
  "nilou": { weapon: "Sword", affiliation: "Zubayr Theater", constellation: "Lotos Somno", title: "Dance of Lotuslight", birthday: "3 Desember" },
  "sangonomiya-kokomi": { weapon: "Catalyst", affiliation: "Watatsumi Island", constellation: "Dracaena Somnolenta", title: "Pearl of Wisdom", birthday: "22 Februari" },
  "shenhe": { weapon: "Polearm", affiliation: "Cloud Retainer Adepti", constellation: "Crista Doloris", title: "Lonesome Transcendence", birthday: "10 Maret" },
  "tartaglia": { weapon: "Bow", affiliation: "Fatui Harbingers (Ke-11)", constellation: "Monoceros Caeli", title: "Childe", birthday: "20 Juli" },
  "tighnari": { weapon: "Bow", affiliation: "Gandharva Ville Forest Rangers", constellation: "Vulpes Zerda", title: "Verdant Strider", birthday: "29 Desember" },
  "wanderer": { weapon: "Catalyst", affiliation: "Vahumana (Sumeru Akademiya)", constellation: "Peregrinus", title: "From Ashes Reborn", birthday: "3 Januari" },
  "wriothesley": { weapon: "Catalyst", affiliation: "Fortress of Meropide", constellation: "Cerberus", title: "Emissary of Solitary Iniquity", birthday: "23 November" },
  "xianyun": { weapon: "Catalyst", affiliation: "Mt. Aocang Adepti", constellation: "Grus Serena", title: "Passerine Herald", birthday: "11 April" },
  "xilonen": { weapon: "Sword", affiliation: "Children of Echoes", constellation: "Nameless Forge", title: "Forged in Melody", birthday: "28 Maret" },
  "yae-miko": { weapon: "Catalyst", affiliation: "Grand Narukami Shrine", constellation: "Divina Vulpes", title: "Astute Amusement", birthday: "27 Juni" },
  "yelan": { weapon: "Bow", affiliation: "Ministry of Civil Affairs", constellation: "Umbrabilis Orchis", title: "Valley Orchid", birthday: "20 April" },
  "yoimiya": { weapon: "Bow", affiliation: "Naganohara Fireworks", constellation: "Carassius Auratus", title: "Frolicking Flames", birthday: "21 Juni" }
};

const files = fs.readdirSync(storiesDir).filter(f => f.endsWith('.md'));

files.forEach(f => {
  const content = fs.readFileSync(path.join(storiesDir, f), 'utf-8');
  const { data } = matter(content);
  const id = f.replace('.md', '');

  if (!existingMap.has(id)) {
    const detail = characterDetails[id] || {
      weapon: "Sword",
      affiliation: data.region || "Teyvat",
      constellation: "Stella Nova",
      title: "Hero of Teyvat",
      birthday: "1 Januari"
    };

    existingMap.set(id, {
      id,
      name: data.character || data.title.replace('Lore & Backstory: ', ''),
      title: detail.title,
      rarity: data.rarity || 5,
      element: data.element || "anemo",
      weapon: detail.weapon,
      region: data.region || "Mondstadt",
      affiliation: detail.affiliation,
      constellation: detail.constellation,
      birthday: detail.birthday,
      summary: data.summary,
      loreDescription: data.summary + ` Merupakan salah satu figur legendaris terkemuka di tanah ${data.region} yang memiliki peran penting dalam sejarah dan takdir benua Teyvat.`
    });
  }
});

const finalCharacters = Array.from(existingMap.values()).sort((a, b) => a.name.localeCompare(b.name));
fs.writeFileSync(path.join(dbDir, 'characters.json'), JSON.stringify(finalCharacters, null, 2), 'utf-8');
console.log('Populated full character database. Total count:', finalCharacters.length);
