const fs = require('fs');
const path = require('path');

const characterAudioUrls = {
  'albedo': 'https://static.wikia.nocookie.net/gensin-impact/images/5/5f/VO_Albedo_Hello.ogg/revision/latest?cb=20201230085715',
  'alhaitham': 'https://static.wikia.nocookie.net/gensin-impact/images/a/a3/VO_Alhaitham_Hello.ogg/revision/latest?cb=20230119174839',
  'arlecchino': 'https://static.wikia.nocookie.net/gensin-impact/images/c/c5/VO_Arlecchino_Hello.ogg/revision/latest?cb=20240502205856',
  'clorinde': 'https://static.wikia.nocookie.net/gensin-impact/images/a/ac/VO_Clorinde_Hello.ogg/revision/latest?cb=20240612001543',
  'cyno': 'https://static.wikia.nocookie.net/gensin-impact/images/d/db/VO_Cyno_Hello_-_The_Present.ogg/revision/latest?cb=20221114150540',
  'diluc': 'https://static.wikia.nocookie.net/gensin-impact/images/6/63/VO_Diluc_Hello.ogg/revision/latest?cb=20210110215656',
  'furina': 'https://static.wikia.nocookie.net/gensin-impact/images/f/f8/VO_Furina_Hello.ogg/revision/latest?cb=20231111061913',
  'ganyu': 'https://static.wikia.nocookie.net/gensin-impact/images/7/70/VO_Ganyu_Hello.ogg/revision/latest?cb=20210112193939',
  'hu-tao': 'https://static.wikia.nocookie.net/gensin-impact/images/2/28/VO_Hu_Tao_Hello.ogg/revision/latest?cb=20210303203536',
  'kaedehara-kazuha': 'https://static.wikia.nocookie.net/gensin-impact/images/2/25/VO_Kaedehara_Kazuha_Hello.ogg/revision/latest?cb=20210629112654',
  'kaeya': 'https://static.wikia.nocookie.net/gensin-impact/images/e/e1/VO_Kaeya_Hello.ogg/revision/latest?cb=20210111200722',
  'kamisato-ayaka': 'https://static.wikia.nocookie.net/gensin-impact/images/b/b8/VO_Kamisato_Ayaka_Hello.ogg/revision/latest?cb=20210728005831',
  'kinich': 'https://static.wikia.nocookie.net/gensin-impact/images/f/f4/VO_Kinich_Hello.ogg/revision/latest?cb=20250508024447',
  'mavuika': 'https://static.wikia.nocookie.net/gensin-impact/images/6/6e/VO_Mavuika_Hello.ogg/revision/latest?cb=20250101183057',
  'mualani': 'https://static.wikia.nocookie.net/gensin-impact/images/2/2a/VO_Mualani_Hello.ogg/revision/latest?cb=20240831135304',
  'nahida': 'https://static.wikia.nocookie.net/gensin-impact/images/b/b6/VO_Nahida_Hello.ogg/revision/latest?cb=20221114125325',
  'navia': 'https://static.wikia.nocookie.net/gensin-impact/images/e/ee/VO_Navia_Hello.ogg/revision/latest?cb=20231221031600',
  'neuvillette': 'https://static.wikia.nocookie.net/gensin-impact/images/5/53/VO_Neuvillette_Hello.ogg/revision/latest?cb=20231001184807',
  'raiden-shogun': 'https://static.wikia.nocookie.net/gensin-impact/images/9/9a/VO_Raiden_Shogun_Hello.ogg/revision/latest?cb=20210902172734',
  'tartaglia': 'https://static.wikia.nocookie.net/gensin-impact/images/0/0d/VO_Tartaglia_Hello.ogg/revision/latest?cb=20210113114247',
  'venti': 'https://static.wikia.nocookie.net/gensin-impact/images/a/ad/VO_Venti_Hello.ogg/revision/latest?cb=20210113121129',
  'wanderer': 'https://static.wikia.nocookie.net/gensin-impact/images/3/30/VO_Wanderer_Hello.ogg/revision/latest?cb=20221207192823',
  'xiao': 'https://static.wikia.nocookie.net/gensin-impact/images/f/ff/VO_Xiao_Hello.ogg/revision/latest?cb=20210209003240',
  'xilonen': 'https://static.wikia.nocookie.net/gensin-impact/images/2/21/VO_Xilonen_Hello.ogg/revision/latest?cb=20241014020718',
  'yae-miko': 'https://static.wikia.nocookie.net/gensin-impact/images/0/08/VO_Yae_Miko_Hello.ogg/revision/latest?cb=20220216025750',
  'yelan': 'https://static.wikia.nocookie.net/gensin-impact/images/1/1c/VO_Yelan_Hello.ogg/revision/latest?cb=20220531185432',
  'zhongli': 'https://static.wikia.nocookie.net/gensin-impact/images/7/7b/VO_Zhongli_Hello.ogg/revision/latest?cb=20210113143726'
};

const dir = path.join(__dirname, '..', 'content', 'stories', 'character-backstory');
let count = 0;
for (const [slug, url] of Object.entries(characterAudioUrls)) {
  const filePath = path.join(dir, slug + '.md');
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/audioUrl:\s*["'][^"']*["']/, `audioUrl: "${url}"`);
    content = content.replace(/audioDuration:\s*["'][^"']*["']/, `audioDuration: "Suara Karakter"`);
    fs.writeFileSync(filePath, content, 'utf8');
    count++;
  } else {
    console.warn('File not found:', filePath);
  }
}

// Update Furina Story Quest
const furinaStory = path.join(__dirname, '..', 'content', 'stories', 'story-quest', 'furina-sandiwara-500-tahun.md');
if (fs.existsSync(furinaStory)) {
  let content = fs.readFileSync(furinaStory, 'utf8');
  content = content.replace(/audioUrl:\s*["'][^"']*["']/, `audioUrl: "${characterAudioUrls.furina}"`);
  content = content.replace(/audioDuration:\s*["'][^"']*["']/, `audioDuration: "Suara Karakter"`);
  fs.writeFileSync(furinaStory, content, 'utf8');
}

console.log(`Success! Updated ${count} character files with official in-game voice audio.`);

