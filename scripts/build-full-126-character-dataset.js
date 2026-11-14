const fs = require('fs');
const path = require('path');
const https = require('https');
const genshindb = require('genshin-db');

const outDir = path.join(__dirname, '..', 'public', 'images', 'characters');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const dbDir = path.join(__dirname, '..', 'src', 'data', 'database');
const charactersJsonPath = path.join(dbDir, 'characters.json');

// Normalizer helpers
function normalizeElement(elem) {
  if (!elem) return "none";
  const lower = elem.toLowerCase();
  if (lower.includes("pyro")) return "pyro";
  if (lower.includes("hydro")) return "hydro";
  if (lower.includes("anemo")) return "anemo";
  if (lower.includes("electro")) return "electro";
  if (lower.includes("dendro")) return "dendro";
  if (lower.includes("cryo")) return "cryo";
  if (lower.includes("geo")) return "geo";
  return "none";
}

function normalizeWeapon(w) {
  if (!w) return "Sword";
  const lower = w.toLowerCase();
  if (lower.includes("bow") || lower.includes("panah")) return "Bow";
  if (lower.includes("claymore") || lower.includes("pedang besar")) return "Claymore";
  if (lower.includes("polearm") || lower.includes("tombak")) return "Polearm";
  if (lower.includes("catalyst") || lower.includes("katalis")) return "Catalyst";
  return "Sword";
}

function normalizeRegion(r) {
  if (!r) return "Teyvat";
  const lower = r.toLowerCase();
  if (lower.includes("mondstadt")) return "Mondstadt";
  if (lower.includes("liyue")) return "Liyue";
  if (lower.includes("inazuma")) return "Inazuma";
  if (lower.includes("sumeru")) return "Sumeru";
  if (lower.includes("fontaine")) return "Fontaine";
  if (lower.includes("natlan")) return "Natlan";
  if (lower.includes("snezhnaya")) return "Snezhnaya";
  if (lower.includes("khaenri")) return "Khaenri'ah";
  return r;
}

async function getWikiCardUrl(name) {
  const formatted = name.replace(/ /g, '_');
  const titles = [
    'File:' + formatted + '_Card.png',
    'File:Character_' + formatted + '_Card.png',
    'File:' + formatted + '_Icon.png',
    'File:Character_' + formatted + '_Thumb.png'
  ];

  for (const t of titles) {
    const url = 'https://genshin-impact.fandom.com/api.php?action=query&titles=' + encodeURIComponent(t) + '&prop=imageinfo&iiprop=url&format=json';
    try {
      const json = await new Promise(resolve => {
        https.get(url, { headers: { 'User-Agent': 'TeyvatLore/1.0' } }, res => {
          let d = '';
          res.on('data', c => d += c);
          res.on('end', () => {
            try { resolve(JSON.parse(d)); } catch(e) { resolve(null); }
          });
        }).on('error', () => resolve(null));
      });
      if (json && json.query && json.query.pages) {
        const pid = Object.keys(json.query.pages)[0];
        if (pid !== '-1' && json.query.pages[pid].imageinfo) {
          return json.query.pages[pid].imageinfo[0].url;
        }
      }
    } catch(e) {}
  }
  return null;
}

function downloadImage(url, dest) {
  return new Promise((resolve) => {
    function get(u) {
      https.get(u, { headers: { 'User-Agent': 'TeyvatLore/1.0' } }, res => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          get(res.headers.location);
        } else if (res.statusCode === 200) {
          const file = fs.createWriteStream(dest);
          res.pipe(file);
          file.on('finish', () => {
            file.close();
            resolve(true);
          });
        } else {
          resolve(false);
        }
      }).on('error', () => resolve(false));
    }
    get(url);
  });
}

(async () => {
  console.log('Building complete playable character dataset from official genshin-db...');
  const allNames = genshindb.characters('names', { matchCategories: true });
  console.log(`Found ${allNames.length} total character entries in database.`);

  const dataset = [];

  for (let i = 0; i < allNames.length; i++) {
    const enName = allNames[i];
    const cId = genshindb.characters(enName, { resultLanguage: 'ID' });
    const cEn = genshindb.characters(enName, { resultLanguage: 'EN' });

    if (!cId || !cId.rarity) continue;

    const id = enName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    const rarity = cId.rarity === 5 ? 5 : 4;
    const element = normalizeElement(cId.elementText || cEn?.elementText);
    const weapon = normalizeWeapon(cId.weaponText || cEn?.weaponText);
    const region = normalizeRegion(cId.region || cEn?.region);
    const title = cId.title || cEn?.title || 'Ksatria Teyvat';
    const affiliation = cId.affiliation || cEn?.affiliation || region;
    const constellation = cId.constellation || cEn?.constellation || 'Stella Fortis';
    const birthday = cId.birthday || cEn?.birthday || '1 Januari';
    const summary = cId.description || cEn?.description || `Karakter bintang ${rarity} yang bertualang di benua Teyvat.`;

    const loreDescription = `${summary} ${cId.name || enName} memegang kekuatan elemen ${element.toUpperCase()} dengan senjata ${weapon}. Berasal dari ${region} dan berafiliasi dengan ${affiliation}, konstelasi ${constellation} menaungi takdir perjalanannya di seluruh penjuru benua Teyvat.`;

    dataset.push({
      id,
      name: cId.name || enName,
      title,
      rarity,
      element,
      weapon,
      region,
      affiliation,
      constellation,
      birthday,
      summary,
      loreDescription
    });

    // Check / Download Character Image
    const dest = path.join(outDir, `${id}.png`);
    if (!fs.existsSync(dest) || fs.statSync(dest).size < 1000) {
      // Try wiki card
      let imgUrl = await getWikiCardUrl(enName);
      if (!imgUrl && (cId.images?.card || cEn?.images?.card)) {
        imgUrl = cId.images?.card || cEn?.images?.card;
      }
      if (!imgUrl && (cId.images?.mihoyo_icon || cEn?.images?.mihoyo_icon)) {
        imgUrl = cId.images?.mihoyo_icon || cEn?.images?.mihoyo_icon;
      }

      if (imgUrl) {
        const ok = await downloadImage(imgUrl, dest);
        if (ok) {
          console.log(`[${i+1}/${allNames.length}] Saved image for ${id} (${(fs.statSync(dest).size/1024).toFixed(1)} KB)`);
        } else {
          console.log(`[${i+1}/${allNames.length}] Could not save image for ${id}`);
        }
      }
      await new Promise(r => setTimeout(r, 80));
    } else {
      console.log(`[${i+1}/${allNames.length}] ${id} image ready.`);
    }
  }

  // Sort alphabetically by name
  dataset.sort((a, b) => a.name.localeCompare(b.name));

  // Save to characters.json
  fs.writeFileSync(charactersJsonPath, JSON.stringify(dataset, null, 2), 'utf-8');

  console.log(`\nSUCCESS: Saved ${dataset.length} characters to src/data/database/characters.json`);
})();
