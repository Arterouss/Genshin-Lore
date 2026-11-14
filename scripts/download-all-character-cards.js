const fs = require('fs');
const path = require('path');
const https = require('https');

const outDir = path.join(__dirname, '..', 'public', 'images', 'characters');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Canonical name map
const canonicalNames = {
  "albedo": "Albedo",
  "alhaitham": "Alhaitham",
  "arataki-itto": "Arataki_Itto",
  "arlecchino": "Arlecchino",
  "baizhu": "Baizhu",
  "bennett": "Bennett",
  "chasca": "Chasca",
  "clorinde": "Clorinde",
  "cyno": "Cyno",
  "dehya": "Dehya",
  "diluc": "Diluc",
  "eula": "Eula",
  "fischl": "Fischl",
  "furina": "Furina",
  "ganyu": "Ganyu",
  "hu-tao": "Hu_Tao",
  "jean": "Jean",
  "kaedehara-kazuha": "Kaedehara_Kazuha",
  "kaeya": "Kaeya",
  "kamisato-ayaka": "Kamisato_Ayaka",
  "kamisato-ayato": "Kamisato_Ayato",
  "keqing": "Keqing",
  "kinich": "Kinich",
  "klee": "Klee",
  "lyney": "Lyney",
  "mavuika": "Mavuika",
  "mualani": "Mualani",
  "nahida": "Nahida",
  "navia": "Navia",
  "neuvillette": "Neuvillette",
  "nilou": "Nilou",
  "raiden-shogun": "Raiden_Shogun",
  "sangonomiya-kokomi": "Sangonomiya_Kokomi",
  "shenhe": "Shenhe",
  "tartaglia": "Tartaglia",
  "tighnari": "Tighnari",
  "venti": "Venti",
  "wanderer": "Wanderer",
  "wriothesley": "Wriothesley",
  "xiangling": "Xiangling",
  "xianyun": "Xianyun",
  "xiao": "Xiao",
  "xilonen": "Xilonen",
  "xingqiu": "Xingqiu",
  "yae-miko": "Yae_Miko",
  "yelan": "Yelan",
  "yoimiya": "Yoimiya",
  "zhongli": "Zhongli"
};

async function getWikiImageUrl(name) {
  const titles = [
    'File:' + name + '_Card.png',
    'File:' + name + '_Icon.png',
    'File:Character_' + name + '_Card.png',
    'File:Character_' + name + '_Thumb.png'
  ];

  for (const title of titles) {
    const url = 'https://genshin-impact.fandom.com/api.php?action=query&titles=' + encodeURIComponent(title) + '&prop=imageinfo&iiprop=url&format=json';
    try {
      const json = await new Promise((resolve) => {
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

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
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
      }).on('error', reject);
    }
    get(url);
  });
}

(async () => {
  console.log('Downloading official character card images into local dataset (public/images/characters)...');
  const slugs = Object.keys(canonicalNames);

  for (let i = 0; i < slugs.length; i++) {
    const slug = slugs[i];
    const canonical = canonicalNames[slug];
    const dest = path.join(outDir, `${slug}.png`);

    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
      console.log(`[${i+1}/${slugs.length}] ${slug} already exists (${(fs.statSync(dest).size/1024).toFixed(1)} KB)`);
      continue;
    }

    const imgUrl = await getWikiImageUrl(canonical);
    if (imgUrl) {
      const ok = await downloadFile(imgUrl, dest);
      if (ok) {
        console.log(`[${i+1}/${slugs.length}] Downloaded ${slug} (${(fs.statSync(dest).size/1024).toFixed(1)} KB)`);
      } else {
        console.error(`[${i+1}/${slugs.length}] Failed to download from: ${imgUrl}`);
      }
    } else {
      console.error(`[${i+1}/${slugs.length}] No image found for: ${canonical}`);
    }

    // Small delay to be polite to the wiki API
    await new Promise(r => setTimeout(r, 100));
  }

  console.log('Finished downloading all character card images!');
})();
