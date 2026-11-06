const fs = require('fs');
const path = require('path');

const japaneseAudioUrls = {
  'albedo': 'https://static.wikia.nocookie.net/gensin-impact/images/9/95/VO_JA_Albedo_Hello.ogg/revision/latest?cb=20210524005409',
  'alhaitham': 'https://static.wikia.nocookie.net/gensin-impact/images/b/b0/VO_JA_Alhaitham_Hello.ogg/revision/latest?cb=20230119180429',
  'arlecchino': 'https://static.wikia.nocookie.net/gensin-impact/images/0/00/VO_JA_Arlecchino_Hello.ogg/revision/latest?cb=20240502210517',
  'clorinde': 'https://static.wikia.nocookie.net/gensin-impact/images/7/7f/VO_JA_Clorinde_Hello.ogg/revision/latest?cb=20240612090546',
  'cyno': 'https://static.wikia.nocookie.net/gensin-impact/images/d/dd/VO_JA_Cyno_Hello_-_The_Present.ogg/revision/latest?cb=20221114151457',
  'diluc': 'https://static.wikia.nocookie.net/gensin-impact/images/c/c6/VO_JA_Diluc_Hello.ogg/revision/latest?cb=20210526183331',
  'furina': 'https://static.wikia.nocookie.net/gensin-impact/images/6/62/VO_JA_Furina_Hello.ogg/revision/latest?cb=20231111062711',
  'ganyu': 'https://static.wikia.nocookie.net/gensin-impact/images/a/a6/VO_JA_Ganyu_Hello.ogg/revision/latest?cb=20210526204735',
  'hu-tao': 'https://static.wikia.nocookie.net/gensin-impact/images/f/fe/VO_JA_Hu_Tao_Hello.ogg/revision/latest?cb=20210419212220',
  'kaedehara-kazuha': 'https://static.wikia.nocookie.net/gensin-impact/images/3/37/VO_JA_Kaedehara_Kazuha_Hello.ogg/revision/latest?cb=20210629115434',
  'kaeya': 'https://static.wikia.nocookie.net/gensin-impact/images/2/27/VO_JA_Kaeya_Hello.ogg/revision/latest?cb=20210526224740',
  'kamisato-ayaka': 'https://static.wikia.nocookie.net/gensin-impact/images/c/ca/VO_JA_Kamisato_Ayaka_Hello.ogg/revision/latest?cb=20210730205639',
  'kinich': 'https://static.wikia.nocookie.net/gensin-impact/images/6/6f/VO_JA_Kinich_Hello.ogg/revision/latest?cb=20240918154351',
  'mavuika': 'https://static.wikia.nocookie.net/gensin-impact/images/1/12/VO_JA_Mavuika_Hello.ogg/revision/latest?cb=20250101190146',
  'mualani': 'https://static.wikia.nocookie.net/gensin-impact/images/8/8c/VO_JA_Mualani_Hello.ogg/revision/latest?cb=20240831135703',
  'nahida': 'https://static.wikia.nocookie.net/gensin-impact/images/1/1d/VO_JA_Nahida_Hello.ogg/revision/latest?cb=20221114130256',
  'navia': 'https://static.wikia.nocookie.net/gensin-impact/images/3/32/VO_JA_Navia_Hello.ogg/revision/latest?cb=20231221032151',
  'neuvillette': 'https://static.wikia.nocookie.net/gensin-impact/images/2/20/VO_JA_Neuvillette_Hello.ogg/revision/latest?cb=20231001191646',
  'raiden-shogun': 'https://static.wikia.nocookie.net/gensin-impact/images/a/a8/VO_JA_Raiden_Shogun_Hello.ogg/revision/latest?cb=20210902185602',
  'tartaglia': 'https://static.wikia.nocookie.net/gensin-impact/images/f/fb/VO_JA_Tartaglia_Hello.ogg/revision/latest?cb=20210527192829',
  'venti': 'https://static.wikia.nocookie.net/gensin-impact/images/8/8d/VO_JA_Venti_Hello.ogg/revision/latest?cb=20210527193456',
  'wanderer': 'https://static.wikia.nocookie.net/gensin-impact/images/e/ec/VO_JA_Wanderer_Hello.ogg/revision/latest?cb=20221207221019',
  'xiao': 'https://static.wikia.nocookie.net/gensin-impact/images/1/12/VO_JA_Xiao_Hello.ogg/revision/latest?cb=20210527195116',
  'xilonen': 'https://static.wikia.nocookie.net/gensin-impact/images/3/39/VO_JA_Xilonen_Hello.ogg/revision/latest?cb=20241014021137',
  'yae-miko': 'https://static.wikia.nocookie.net/gensin-impact/images/e/e6/VO_JA_Yae_Miko_Hello.ogg/revision/latest?cb=20220216155928',
  'yelan': 'https://static.wikia.nocookie.net/gensin-impact/images/4/49/VO_JA_Yelan_Hello.ogg/revision/latest?cb=20220601000544',
  'zhongli': 'https://static.wikia.nocookie.net/gensin-impact/images/c/c0/VO_JA_Zhongli_Hello.ogg/revision/latest?cb=20210218060452'
};

const backstoryDir = path.join(__dirname, '..', 'content', 'stories', 'character-backstory');
let count = 0;
for (const [slug, url] of Object.entries(japaneseAudioUrls)) {
  const filePath = path.join(backstoryDir, slug + '.md');
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/audioUrl:\s*["'][^"']*["']/, `audioUrl: "${url}"`);
    content = content.replace(/audioDuration:\s*["'][^"']*["']/, `audioDuration: "Suara Karakter (JP)"`);
    fs.writeFileSync(filePath, content, 'utf8');
    count++;
  }
}

// Update Story Quests yang bersesuaian dengan audio Jepang
const sqDir = path.join(__dirname, '..', 'content', 'stories', 'story-quest');
const sqMapping = {
  'furina-sandiwara-500-tahun.md': japaneseAudioUrls.furina,
  'zhongli-historia-antiqua.md': japaneseAudioUrls.zhongli,
  'raiden-shogun-imperatrix-umbrosa.md': japaneseAudioUrls['raiden-shogun'],
  'nahida-sapientia-oromasdis.md': japaneseAudioUrls.nahida,
  'neuvillette-diluvies.md': japaneseAudioUrls.neuvillette,
  'venti-carmen-dei.md': japaneseAudioUrls.venti,
  'xiao-alatus.md': japaneseAudioUrls.xiao,
  'arlecchino-ignis-purgatorius.md': japaneseAudioUrls.arlecchino,
  'hu-tao-papilio-charontis.md': japaneseAudioUrls['hu-tao'],
  'kaedehara-kazuha-acer-palmatum.md': japaneseAudioUrls['kaedehara-kazuha'],
  'albedo-princeps-cretaceus.md': japaneseAudioUrls.albedo,
};

let sqCount = 0;
for (const [file, url] of Object.entries(sqMapping)) {
  const filePath = path.join(sqDir, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/audioUrl:\s*["'][^"']*["']/, `audioUrl: "${url}"`);
    content = content.replace(/audioDuration:\s*["'][^"']*["']/, `audioDuration: "Suara Karakter (JP)"`);
    fs.writeFileSync(filePath, content, 'utf8');
    sqCount++;
  }
}

console.log(`Updated ${count} backstories and ${sqCount} story quests with JAPANESE voice lines.`);

