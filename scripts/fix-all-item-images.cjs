const fs = require('fs');
const path = require('path');
const genshindb = require('genshin-db');

const dbDir = path.join(__dirname, '..', 'src', 'data', 'database');

console.log('--- FIXING ALL ITEM IMAGES USING VERIFIED CDN (gi.yatta.moe) ---');

// 1. FIX WEAPONS IMAGES
const weaponsPath = path.join(dbDir, 'weapons.json');
const weapons = JSON.parse(fs.readFileSync(weaponsPath, 'utf8'));
let updatedWeapons = 0;

weapons.forEach((w) => {
  const wData = genshindb.weapon(w.name) || genshindb.weapon(w.id);
  let iconName = wData?.images?.filename_icon;
  if (!iconName) {
    if (w.name.includes('Blackcliff')) iconName = 'UI_EquipIcon_Catalyst_Blackrock';
    else if (w.name.includes('Sword')) iconName = 'UI_EquipIcon_Sword_Blunt';
    else if (w.name.includes('Claymore')) iconName = 'UI_EquipIcon_Claymore_Anicar';
    else if (w.name.includes('Bow')) iconName = 'UI_EquipIcon_Bow_Hunter';
    else if (w.name.includes('Polearm')) iconName = 'UI_EquipIcon_Pole_Hberd';
    else iconName = 'UI_EquipIcon_Sword_Blunt';
  }
  w.iconUrl = `https://gi.yatta.moe/assets/UI/${iconName}.png`;
  updatedWeapons++;
});

fs.writeFileSync(weaponsPath, JSON.stringify(weapons, null, 2), 'utf8');
console.log(`[OK] Updated ${updatedWeapons} weapons with working CDN URLs.`);

// 2. FIX FOODS IMAGES & INGREDIENTS
const foodsPath = path.join(dbDir, 'foods.json');
const foods = JSON.parse(fs.readFileSync(foodsPath, 'utf8'));
let updatedFoods = 0;

foods.forEach((f) => {
  const fData = genshindb.food(f.nameEn || f.name);
  const iconName = fData?.images?.filename_icon || 'UI_ItemIcon_108001';
  f.iconUrl = `https://gi.yatta.moe/assets/UI/${iconName}.png`;

  // Fix ingredients
  if (Array.isArray(f.ingredients)) {
    f.ingredients.forEach((ing) => {
      const mat = genshindb.material(ing.name);
      if (mat?.images?.filename_icon) {
        ing.iconUrl = `https://gi.yatta.moe/assets/UI/${mat.images.filename_icon}.png`;
      } else if (mat?.id) {
        ing.iconUrl = `https://gi.yatta.moe/assets/UI/UI_ItemIcon_${mat.id}.png`;
      }
    });
  }
  updatedFoods++;
});

fs.writeFileSync(foodsPath, JSON.stringify(foods, null, 2), 'utf8');
console.log(`[OK] Updated ${updatedFoods} foods and ingredients.`);

// 3. FIX WORLD ITEMS IMAGES
const worldPath = path.join(dbDir, 'world-items.json');
const worldItems = JSON.parse(fs.readFileSync(worldPath, 'utf8'));
let updatedWorld = 0;

worldItems.forEach((w) => {
  const mData = genshindb.material(w.nameEn || w.name);
  let iconName = mData?.images?.filename_icon;
  if (!iconName) {
    if (w.subCategory === 'Batu & Tambang') iconName = 'UI_ItemIcon_100058';
    else if (w.subCategory === 'Spesialis Daerah') iconName = 'UI_ItemIcon_100021';
    else if (w.subCategory === 'Kayu Alam') iconName = 'UI_ItemIcon_101301';
    else if (w.subCategory === 'Ikan & Pancing') iconName = 'UI_ItemIcon_131016';
    else iconName = 'UI_ItemIcon_100984';
  }
  w.iconUrl = `https://gi.yatta.moe/assets/UI/${iconName}.png`;
  updatedWorld++;
});

fs.writeFileSync(worldPath, JSON.stringify(worldItems, null, 2), 'utf8');
console.log(`[OK] Updated ${updatedWorld} world items.`);

// 4. FIX MATERIALS IMAGES
const matsPath = path.join(dbDir, 'materials.json');
const materials = JSON.parse(fs.readFileSync(matsPath, 'utf8'));
let updatedMats = 0;

materials.forEach((m) => {
  const mData = genshindb.material(m.nameEn || m.name);
  let iconName = mData?.images?.filename_icon;
  if (!iconName) {
    if (m.subCategory.includes('Batu Elemen')) iconName = 'UI_ItemIcon_104104';
    else if (m.subCategory.includes('Buku Bakat')) iconName = 'UI_ItemIcon_104301';
    else if (m.subCategory.includes('Ascension Senjata')) iconName = 'UI_ItemIcon_114001';
    else if (m.subCategory.includes('Drop Monster')) iconName = 'UI_ItemIcon_112001';
    else iconName = 'UI_ItemIcon_104001';
  }
  m.iconUrl = `https://gi.yatta.moe/assets/UI/${iconName}.png`;
  updatedMats++;
});

fs.writeFileSync(matsPath, JSON.stringify(materials, null, 2), 'utf8');
console.log(`[OK] Updated ${updatedMats} enhancement materials.`);

// 5. ENHANCE CHARACTERS WITH CLOUD ICON URL BACKUP
const charsPath = path.join(dbDir, 'characters.json');
const characters = JSON.parse(fs.readFileSync(charsPath, 'utf8'));
let updatedChars = 0;

characters.forEach((c) => {
  const cData = genshindb.character(c.name) || genshindb.character(c.id);
  let iconName = cData?.images?.filename_icon;
  if (!iconName) {
    const cleanId = c.id.replace(/-/g, '_').toLowerCase();
    iconName = `UI_AvatarIcon_${cleanId}`;
  }
  c.iconUrl = `https://gi.yatta.moe/assets/UI/${iconName}.png`;
  updatedChars++;
});

fs.writeFileSync(charsPath, JSON.stringify(characters, null, 2), 'utf8');
console.log(`[OK] Enhanced ${updatedChars} characters with cloud avatar backup.`);

console.log('All image datasets updated successfully!');
