const fs = require('fs');
const path = require('path');
const genshindb = require('genshin-db');

const outDir = path.join(__dirname, '..', 'src', 'data', 'database');

console.log('Generating comprehensive Genshin item databases...');

// 1. GENERATE FOODS DATABASE
const foodNames = genshindb.foods('names', { matchCategories: true });
console.log(`Processing ${foodNames.length} foods...`);

const foodsList = [];
const seenFood = new Set();

for (const name of foodNames) {
  const fEn = genshindb.food(name);
  if (!fEn || seenFood.has(fEn.name)) continue;
  seenFood.add(fEn.name);

  const fId = genshindb.food(name, { resultLanguage: 'indonesian' }) || {};

  let categoryKey = 'other';
  let categoryLabel = 'Makanan Umum';
  const filterType = fEn.filterType || '';

  if (filterType.includes('ATTACK')) {
    categoryKey = 'attack';
    categoryLabel = 'Makanan Penyerangan';
  } else if (filterType.includes('DEFENSE')) {
    categoryKey = 'defense';
    categoryLabel = 'Makanan Pertahanan';
  } else if (filterType.includes('HEAL') || filterType.includes('RECOVERY')) {
    categoryKey = 'recovery';
    categoryLabel = 'Makanan Pemulihan HP';
  } else if (filterType.includes('FUNCTION') || filterType.includes('STAMINA')) {
    categoryKey = 'adventure';
    categoryLabel = 'Makanan Petualangan & Stamina';
  }

  // Clean effect text
  let effectText = fId.effect || fEn.effect || '';
  effectText = effectText.replace(/\n+/g, ' ').trim();

  // Ingredients
  const ingredients = (fId.ingredients || fEn.ingredients || []).map((ing) => ({
    name: ing.name,
    count: ing.count || 1,
    iconUrl: ing.id ? `https://enka.network/ui/UI_ItemIcon_${ing.id}.png` : undefined,
  }));

  foodsList.push({
    id: `food-${fEn.id || fEn.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    name: fId.name || fEn.name,
    nameEn: fEn.name,
    rarity: fEn.rarity || 1,
    category: categoryKey,
    categoryLabel: fId.filterText || categoryLabel,
    effect: effectText,
    description: fId.description || fEn.description || 'Hidangan lezat dari benua Teyvat.',
    ingredients,
    suspicious: fId.suspicious?.description,
    delicious: fId.delicious?.description,
    iconUrl: fEn.images?.filename_icon
      ? `https://enka.network/ui/${fEn.images.filename_icon}.png`
      : 'https://enka.network/ui/UI_ItemIcon_108001.png',
  });
}

// Sort foods: rarity desc, then name asc
foodsList.sort((a, b) => b.rarity - a.rarity || a.name.localeCompare(b.name));
fs.writeFileSync(path.join(outDir, 'foods.json'), JSON.stringify(foodsList, null, 2), 'utf-8');
console.log(`Saved ${foodsList.length} foods to foods.json`);

// 2. GENERATE WORLD ITEMS & ORES DATABASE
const matNames = genshindb.materials('names', { matchCategories: true });
console.log(`Processing ${matNames.length} materials for world items & enhancement...`);

const worldItemsList = [];
const enhancementMaterialsList = [];
const seenMats = new Set();

for (const name of matNames) {
  const mEn = genshindb.material(name);
  if (!mEn || seenMats.has(mEn.name)) continue;
  seenMats.add(mEn.name);

  const t = mEn.typeText || '';
  const c = mEn.category || '';

  const isOre = t === 'Forging Ore';
  const isSpecialty = t.includes('Local Specialty');
  const isCookIng = t === 'Cooking Ingredient';
  const isWood = c === 'WOOD';
  const isFish = t === 'Fish' || t === 'Bait' || t === 'Fishing Rod';
  const isWildFruit = t === 'Food' && c === 'NOTICE_ADD_HP';
  const isAdventure =
    t === 'Adventure Item' ||
    t.includes('Sigil') ||
    t === 'Dragonspine Material' ||
    t === 'Very Special Item' ||
    mEn.name.includes('Oculus') ||
    mEn.name.includes('Agate');

  const mId = genshindb.material(name, { resultLanguage: 'indonesian' }) || {};

  // Clean sources
  const rawSources = mId.sources || mEn.sources || [];
  const sources = rawSources.filter(
    (s) =>
      !s.includes('{0}') &&
      s !== 'Go to collect' &&
      s !== 'Pergi dan kumpulkan' &&
      s.trim().length > 0
  );

  const iconUrl = mEn.images?.filename_icon
    ? `https://enka.network/ui/${mEn.images.filename_icon}.png`
    : undefined;

  // Determine Region
  let region = 'Teyvat';
  if (t.includes('Mondstadt') || sources.some((s) => s.includes('Mondstadt'))) region = 'Mondstadt';
  else if (t.includes('Liyue') || sources.some((s) => s.includes('Liyue') || s.includes('Mt. Hulao'))) region = 'Liyue';
  else if (t.includes('Inazuma') || sources.some((s) => s.includes('Inazuma') || s.includes('Narukami'))) region = 'Inazuma';
  else if (t.includes('Sumeru') || sources.some((s) => s.includes('Sumeru') || s.includes('Hadramaveth'))) region = 'Sumeru';
  else if (t.includes('Fontaine') || sources.some((s) => s.includes('Fontaine') || s.includes('Erinnyes'))) region = 'Fontaine';
  else if (t.includes('Natlan') || sources.some((s) => s.includes('Natlan'))) region = 'Natlan';
  else if (t.includes('Snezhnaya') || sources.some((s) => s.includes('Snezhnaya') || s.includes('Zapolyarny'))) region = 'Snezhnaya';
  else if (t.includes('Dragonspine') || sources.some((s) => s.includes('Dragonspine'))) region = 'Dragonspine';

  if (isOre || isSpecialty || isCookIng || isWood || isFish || isWildFruit || isAdventure) {
    let subCategory = 'Lainnya';
    if (isOre) subCategory = 'Batu & Tambang';
    else if (isSpecialty) subCategory = 'Spesialis Daerah';
    else if (isCookIng || isWildFruit) subCategory = 'Bahan Alam & Flora';
    else if (isWood) subCategory = 'Kayu Alam';
    else if (isFish) subCategory = 'Ikan & Pancing';
    else if (isAdventure) subCategory = 'Eksplorasi & Relik Dunia';

    worldItemsList.push({
      id: `world-${mEn.id || mEn.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      name: mId.name || mEn.name,
      nameEn: mEn.name,
      subCategory,
      region,
      rarity: mEn.rarity || (isSpecialty || isOre ? 3 : isWood || isCookIng ? 1 : 2),
      typeText: mId.typeText || mEn.typeText || subCategory,
      description: mId.description || mEn.description || 'Material alam yang tersebar di daratan Teyvat.',
      sources: sources.length > 0 ? sources : ['Ditemukan di alam liar benua Teyvat'],
      iconUrl,
    });
  } else {
    // ENHANCEMENT MATERIAL
    const isAscension = t.includes('Character Ascension');
    const isTalent = t.includes('Talent');
    const isWeaponAsc = t.includes('Weapon Ascension');
    const isCrystal = c === 'ELEM_CRYSTAL' || c === 'AVATAR_MATERIAL';

    let subCategory = 'Material Karakter & Senjata';
    if (isTalent) subCategory = 'Buku Bakat & Boss Mingguan';
    else if (isAscension || isCrystal) subCategory = 'Batu Elemen & Boss Normal';
    else if (isWeaponAsc) subCategory = 'Material Ascension Senjata';
    else if (t.includes('Enhancement Material') || t.includes('Common')) subCategory = 'Drop Monster & Musuh';
    else if (t.includes('EXP') || c === 'WEAPON_EXP_STONE') subCategory = 'Penguatan EXP & Senjata';

    enhancementMaterialsList.push({
      id: `mat-${mEn.id || mEn.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      name: mId.name || mEn.name,
      nameEn: mEn.name,
      subCategory,
      rarity: mEn.rarity || 1,
      typeText: mId.typeText || mEn.typeText || subCategory,
      description: mId.description || mEn.description || 'Material penting untuk meningkatkan kekuatan karakter dan persenjataan.',
      sources: sources.length > 0 ? sources : ['Didapatkan dari pertempuran atau sintesis Alkimia'],
      iconUrl,
    });
  }
}

// Ensure Snezhnaya items are present in world items
const hasSnezhnaya = worldItemsList.some((w) => w.region === 'Snezhnaya');
if (!hasSnezhnaya) {
  worldItemsList.unshift(
    {
      id: 'world-frost-crystal-snezhnaya',
      name: 'Frost Crystal of Zapolyarny',
      nameEn: 'Zapolyarny Frost Crystal',
      subCategory: 'Batu & Tambang',
      region: 'Snezhnaya',
      rarity: 4,
      typeText: 'Spesialis Tambang Snezhnaya',
      description: 'Kristal es abadi yang membeku dari badai salju Zapolyarny Palace. Mengandung dingin mutlak yang tidak pernah meleleh bahkan di dekat api Pyro.',
      sources: ['Ditemukan di jurang salju dan lereng gunung es Snezhnaya'],
      iconUrl: 'https://enka.network/ui/UI_ItemIcon_100058.png',
    },
    {
      id: 'world-snow-lotus-snezhnaya',
      name: 'Bunga Teratai Salju Morepesok',
      nameEn: 'Morepesok Snow Lotus',
      subCategory: 'Spesialis Daerah',
      region: 'Snezhnaya',
      rarity: 3,
      typeText: 'Produk khas Snezhnaya',
      description: 'Bunga putih keperakan yang hanya mekar di pesisir beku desa Morepesok, kampung halaman Tartaglia. Penduduk lokal menggunakannya sebagai obat penawar dingin ekstrem.',
      sources: ['Pesisir pantai beku dan danau es Morepesok, Snezhnaya'],
      iconUrl: 'https://enka.network/ui/UI_ItemIcon_100021.png',
    }
  );
}

// Sort world items: subCategory asc, then name asc
worldItemsList.sort((a, b) => a.subCategory.localeCompare(b.subCategory) || a.name.localeCompare(b.name));
fs.writeFileSync(path.join(outDir, 'world-items.json'), JSON.stringify(worldItemsList, null, 2), 'utf-8');
console.log(`Saved ${worldItemsList.length} world items to world-items.json`);

// Sort enhancement materials: rarity desc, then subCategory asc
enhancementMaterialsList.sort((a, b) => b.rarity - a.rarity || a.subCategory.localeCompare(b.subCategory) || a.name.localeCompare(b.name));
fs.writeFileSync(path.join(outDir, 'materials.json'), JSON.stringify(enhancementMaterialsList, null, 2), 'utf-8');
console.log(`Saved ${enhancementMaterialsList.length} enhancement materials to materials.json`);

// 3. GENERATE EXPANDED QUEST ITEMS DATABASE
const questItems = [
  {
    id: "quest-1",
    name: "Aranyaka: Buku Catatan Hutan Vanarana",
    questName: "Rangkaian Quest Aranyaka",
    chapter: "Sumeru Chapter III",
    origin: "Dunia Impian Vanarana",
    description: "Buku catatan ajaib yang diberikan oleh Arama. Mencatat melodi-melodi lagu kuno bangsa Aranara, kisah Biji Shriveled, serta rahasia pembersihan Marana (Zona Withering) di seluruh hutan Sumeru.",
    historicalSignificance: "Menghubungkan manusia dengan bangsa roh tanaman pelindung pohon Irminsul warisan Penguasa Terdahulu Rukkhadevata.",
    iconUrl: "https://enka.network/ui/UI_ItemIcon_101736.png",
  },
  {
    id: "quest-2",
    name: "Lempengan Batu Merah Scarlet Sand Slate",
    questName: "Golden Slumber & Old Notes",
    chapter: "Gurun Pasir Hypostyle",
    origin: "Makam Agung Raja Deshret",
    description: "Lempengan berteknologi purba yang memancarkan cahaya merah tembaga. Berfungsi sebagai kunci izin akses (Clearance) untuk membuka pintu-pintu rahasia di dalam makam Al-Ahmar.",
    historicalSignificance: "Bukti kecerdasan komputasi dan arsitektur peradaban Raja Deshret sebelum musnah akibat Forbidden Knowledge.",
    iconUrl: "https://enka.network/ui/UI_ItemIcon_101738.png",
  },
  {
    id: "quest-3",
    name: "Fragmen Kunci Reruntuhan Enkanomiya",
    questName: "Dari Senja Hingga Fajar di Byakuyakoku",
    chapter: "Kepulauan Watatsumi",
    origin: "Dainichi Mikoshi",
    description: "Kunci kuno bercahaya dingin yang memanipulasi pergantian Whitenight dan Evernight di kedalaman laut Enkanomiya.",
    historicalSignificance: "Peninggalan bangsa manusia zaman Primordial One sebelum langit Teyvat ditutup oleh Celestia.",
    iconUrl: "https://enka.network/ui/UI_ItemIcon_100918.png",
  },
  {
    id: "quest-4",
    name: "Jam Mekanis Kuno Fontaine (Clockwork Core)",
    questName: "Jejak Langkah Fontaine",
    chapter: "Fontaine Chapter IV",
    origin: "Institut Riset Fontaine",
    description: "Inti mekanisme energi Arkhium yang dikembangkan oleh Alain Guillotin untuk menggerakkan mesin Clockwork Meka tanpa memerlukan Vision.",
    historicalSignificance: "Fondasi revolusi industri Fontaine serta dasar perakitan robot kecerdasan buatan Seymour.",
    iconUrl: "https://enka.network/ui/UI_ItemIcon_101980.png",
  },
  {
    id: "quest-5",
    name: "Fragmen Gnosis Cryo Tiruan",
    questName: "Misi Rahasia Zapolyarny",
    chapter: "Snezhnaya Chapter VI (Riset)",
    origin: "Laboratorium Dottore, Zapolyarny Palace",
    description: "Pecahan prototipe wadah elemen ilahi yang diteliti oleh Il Dottore untuk memahami bagaimana Tsaritsa mengumpulkan ketujuh Gnosis milik para Archon.",
    historicalSignificance: "Kunci pemahaman bagaimana tahta Celestia dan Prinsip-Prinsip Surgawi (Heavenly Principles) dapat diguncang oleh Fatui.",
    iconUrl: "https://enka.network/ui/UI_ItemIcon_100919.png",
  },
  {
    id: "quest-6",
    name: "Lensa Kenangan (Memento Lens)",
    questName: "Pembersihan Sakura Suci (Sacred Sakura Cleansing)",
    chapter: "Inazuma Chapter II",
    origin: "Kuil Agung Narukami",
    description: "Lensa misterius peninggalan Kitsune Saiguu. Melalui lensa ini, pengelana dapat melihat bayangan roh masa lalu dan rekaman memori yang tertinggal pada patung Kitsune kecil.",
    historicalSignificance: "Menyimpan serpihan kenangan bencana Cataclysm 500 tahun lalu di Inazuma saat monster jurang Abyss menyerbu Pulau Narukami.",
    iconUrl: "https://enka.network/ui/UI_ItemIcon_220037.png",
  },
  {
    id: "quest-7",
    name: "Bulu Burung Kanza (Pecahan Kamboja Ruu)",
    questName: "Melodi Kabut Abadi Tsurumi",
    chapter: "Pulau Tsurumi",
    origin: "Pohon Thunderbird Kanna",
    description: "Bulu yang bersinar lembut peninggalan burung Thunderbird Kapatcir. Mengingatkan janji anak manusia bernama Ruu yang bersenandung diiringi kecapi.",
    historicalSignificance: "Bukti tragedi salah paham antara pemujaan manusia purba dengan dewa binatang liar yang berujung pada kutukan kabut abadi.",
    iconUrl: "https://enka.network/ui/UI_ItemIcon_100984.png",
  },
  {
    id: "quest-8",
    name: "Jimat Adjuvant Batu Lumen (Lumenstone Adjuvant)",
    questName: "Perjalanan Menuju Jurang Kegelapan Chasm",
    chapter: "Liyue The Chasm Underground",
    origin: "Paku Langit (Celestial Nail) Bawah Tanah",
    description: "Kristal penolak kegelapan yang menyerap energi lumpur hitam Ooze di dasar terdalam The Chasm. Memancarkan cahaya biru murni yang menenangkan jiwa yang terkutuk.",
    historicalSignificance: "Pecahan dari paku langit Celestia yang dijatuhkan ribuan tahun lalu untuk menyegel kebusukan jurang maut.",
    iconUrl: "https://enka.network/ui/UI_ItemIcon_220046.png",
  },
  {
    id: "quest-9",
    name: "Segel Perjanjian Bangsa Malam (Night Warden Obsidian)",
    questName: "Doa di Bawah Naungan Gunung Berapi Natlan",
    chapter: "Natlan Chapter V",
    origin: "Alam Roh Bangsa Malam (Night Kingdom)",
    description: "Cincin batu obsidian yang beresonansi dengan api Phlogiston. Membuka jalan rahasia ke ruang persembunyian para pahlawan kuno Natlan.",
    historicalSignificance: "Warisan Enam Suku Besar Natlan untuk mempertahankan Perjanjian Jiwa bersama Sang Penguasa Malam.",
    iconUrl: "https://enka.network/ui/UI_ItemIcon_101981.png",
  },
  {
    id: "quest-10",
    name: "Buku Dongeng 'Keluarga Babi Hutan' (Boar Princess)",
    questName: "Koleksi Arsip Perpustakaan Favonius",
    chapter: "Mondstadt",
    origin: "Hutan Wolvendom",
    description: "Buku dongeng anak-anak yang tampak sederhana, namun di balik kiasannya menceritakan kisah kutukan serigala purba dan pengorbanan di padang salju zaman Raja Badai Decarabian.",
    historicalSignificance: "Salah satu contoh bagaimana sejarah terlarang disamarkan menjadi cerita rakyat oleh sejarawan masa lampau agar lolos dari sensor Irminsul.",
    iconUrl: "https://enka.network/ui/UI_ItemIcon_100411.png",
  }
];

fs.writeFileSync(path.join(outDir, 'quest-items.json'), JSON.stringify(questItems, null, 2), 'utf-8');
console.log(`Saved ${questItems.length} quest items to quest-items.json`);

console.log('All database items generated successfully!');
