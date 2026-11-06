const fs = require('fs');
const path = require('path');

const newCharacters = [
  {
    slug: 'kamisato-ayato',
    title: 'Lore & Backstory: Kamisato Ayato',
    character: 'Kamisato Ayato',
    region: 'Inazuma',
    element: 'hydro',
    readingTime: '15 Menit',
    audioUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/5/5b/VO_JA_Kamisato_Ayato_Hello.ogg/revision/latest?cb=20220330112219',
    audioDuration: 'Suara Karakter (JP)',
    summary: 'Kepala Klan Kamisato yang penuh strategi dan intrik cerdas, mengendalikan Komisi Yashiro dan korps rahasia Shuumatsuban di balik bayang-bayang demi melindungi stabilitas Inazuma.',
    tags: ['Inazuma', 'Kamisato Ayato', 'Yashiro Commission', 'Shuumatsuban', 'Hydro'],
    content: `## Profil Resmi & Latar Belakang

> *"Politik adalah permainan catur di mana setiap langkah menentukan nasib klan dan bangsa. Aku lebih memilih bekerja dalam bayang-bayang agar adikku, Ayaka, bisa tetap menjadi permata suci Inazuma."*
> — Kamisato Ayato

Kamisato Ayato adalah Kepala Klan Kamisato saat ini dan Komisaris Yashiro. Di usianya yang masih sangat muda, kedua orang tuanya meninggal dunia dan klan Kamisato berada di ambang kehancuran akibat intrik faksi lawan. 

Dengan kecerdasan taktis yang luar biasa, Ayato menstabilkan klan, mengambil alih kendali organisasi intelijen **Shuumatsuban**, dan menjadi pilar penopang kedamaian Inazuma yang tak tergantikan.`
  },
  {
    slug: 'wriothesley',
    title: 'Lore & Backstory: Wriothesley',
    character: 'Wriothesley',
    region: 'Fontaine',
    element: 'cryo',
    readingTime: '16 Menit',
    audioUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/4/4a/VO_JA_Wriothesley_Hello.ogg/revision/latest?cb=20231017201257',
    audioDuration: 'Suara Karakter (JP)',
    summary: 'Duke of the Fortress of Meropide. Mengubah penjara bawah air yang suram menjadi komunitas mandiri dengan hukum besi dan tinju dinginnya, serta menjaga gerbang Laut Primordial.',
    tags: ['Fontaine', 'Wriothesley', 'Fortress of Meropide', 'Cryo', 'Duke'],
    content: `## Sang Penguasa Penjara Bawah Air

> *"Tempat ini bukan neraka, tapi bukan juga surga. Ini adalah suaka bagi mereka yang telah membayar hutang dosanya kepada masyarakat."*
> — Wriothesley

Wriothesley menyandang gelar "Duke" bukan karena garis bangsawan, melainkan atas jasa tak tertandinginya memulihkan ketertiban di **Fortress of Meropide**. Di masa lalunya, Wriothesley membunuh orang tua angkatnya yang kejam demi menyelamatkan saudara-saudara angkatnya dari perbudakan, menjadikannya narapidana sebelum akhirnya bangkit memimpin seluruh benteng bawah air tersebut.`
  },
  {
    slug: 'lyney',
    title: 'Lore & Backstory: Lyney',
    character: 'Lyney',
    region: 'Fontaine',
    element: 'pyro',
    readingTime: '14 Menit',
    audioUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/f/f6/VO_JA_Lyney_Hello.ogg/revision/latest?cb=20230819113214',
    audioDuration: 'Suara Karakter (JP)',
    summary: 'Pesulap ulung Opera Epiclese dan agen andalan House of the Hearth. Menggunakan trik ilusi di atas panggung sembari memikul misi rahasia demi melindungi saudara-saudaranya.',
    tags: ['Fontaine', 'Lyney', 'House of the Hearth', 'Pesulap', 'Pyro'],
    content: `## Ilusi Panggung dan Rahasia Perapian

> *"Mata bisa menipu, telinga bisa berdusta. Namun keajaiban yang kau rasakan di dalam hatimu... itu adalah kebenaran murni."*
> — Lyney

Di hadapan penonton Opera Epiclese, Lyney adalah pesulap karismatik paling berbakat di Fontaine. Namun di balik layar, ia dan saudara kembarnya Lynette adalah agen terlatih Fatui di bawah pimpinan "Ayah" Arlecchino. Keinginannya yang terbesar hanyalah melindungi keluarganya dari kejamnya dunia luar.`
  },
  {
    slug: 'chasca',
    title: 'Lore & Backstory: Chasca',
    character: 'Chasca',
    region: 'Natlan',
    element: 'anemo',
    readingTime: '15 Menit',
    audioUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/9/90/VO_JA_Chasca_Hello.ogg/revision/latest?cb=20241121102858',
    audioDuration: 'Suara Karakter (JP)',
    summary: 'Peacemaker dari Suku Sayap Bunga (Flower-Feather Clan) Natlan. Dibesarkan oleh Qucusaur di tebing liar, terbang dengan senjata unik melintasi langit untuk menjaga perdamaian antar suku.',
    tags: ['Natlan', 'Chasca', 'Flower-Feather Clan', 'Anemo', 'Peacemaker'],
    content: `## Penjaga Perdamaian Langit Natlan

Chasca memiliki masa kecil yang luar biasa: ia sempat hilang di pegunungan terjal dan diasuh oleh induk naga terbang **Qucusaur**. Karena dibesarkan oleh naluri alam liar, Chasca memiliki indra pendengaran dan penglihatan yang sangat tajam. Sebagai Peacemaker, ia menengahi berbagai konflik sengit antar suku Natlan dengan senapan terbangnya.`
  },
  {
    slug: 'xianyun',
    title: 'Lore & Backstory: Xianyun',
    character: 'Xianyun (Cloud Retainer)',
    region: 'Liyue',
    element: 'anemo',
    readingTime: '15 Menit',
    audioUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/2/29/VO_JA_Xianyun_Hello.ogg/revision/latest?cb=20240204105016',
    audioDuration: 'Suara Karakter (JP)',
    summary: 'Adeptus legendaris Gunung Mt. Aocang pencipta mesin pusaka mekanik. Kini menjelma menjadi warga kota Liyue Harbor yang modis, anggun, dan protektif terhadap murid-muridnya.',
    tags: ['Liyue', 'Xianyun', 'Cloud Retainer', 'Adeptus', 'Anemo'],
    content: `## Sang Bangau Putih di Tengah Hiruk Pikuk Kota

Sebagai salah satu Adeptus tertua Liyue, **Cloud Retainer** terkenal dengan penemuan mesin-mesin canggih dan rasa sayangnya yang berlebihan pada murid-muridnya (Ganyu dan Shenhe). Memilih nama "Xianyun", sang bangau kini tinggal di Liyue Harbor, menikmati masakan lezat dan diam-diam membantu warganya dari bahaya gaib.`
  },
  {
    slug: 'shenhe',
    title: 'Lore & Backstory: Shenhe',
    character: 'Shenhe',
    region: 'Liyue',
    element: 'cryo',
    readingTime: '16 Menit',
    audioUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/4/4a/VO_JA_Shenhe_Hello.ogg/revision/latest?cb=20220107184005',
    audioDuration: 'Suara Karakter (JP)',
    summary: 'Keturunan klan pengusir setan yang dikorbankan ayahnya sendiri kepada monster purba. Bertahan hidup dengan amarah murni sebelum diselamatkan Adeptus dan diikat tali merah peredam nafsu membunuh.',
    tags: ['Liyue', 'Shenhe', 'Adeptus', 'Cryo', 'Tali Merah'],
    content: `## Jiwa Dingin yang Terikat Tali Merah

Saat masih anak-anak, ayah Shenhe menguncinya di dalam gua untuk dikorbankan demi menghidupkan kembali almarhumah istrinya. Shenhe bertarung sendirian melawan bayangan iblis selama berhari-hari sebelum diselamatkan Cloud Retainer. Untuk meredam takdir kelam dan hasrat membunuhnya, para adeptus melilitkan **Tali Merah Jiwa** di sekujur tubuhnya.`
  },
  {
    slug: 'keqing',
    title: 'Lore & Backstory: Keqing',
    character: 'Keqing',
    region: 'Liyue',
    element: 'electro',
    readingTime: '14 Menit',
    audioUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/d/d6/VO_JA_Keqing_Hello.ogg/revision/latest?cb=20210526230755',
    audioDuration: 'Suara Karakter (JP)',
    summary: 'Yuheng dari Liyue Qixing. Tokoh reformis yang gigih memperjuangkan agar umat manusia Liyue mandiri menentukan nasib mereka sendiri tanpa bergantung pada perlindungan para dewa.',
    tags: ['Liyue', 'Keqing', 'Liyue Qixing', 'Yuheng', 'Electro'],
    content: `## Pelopor Kemandirian Umat Manusia

Keqing adalah satu-satunya pejabat Qixing yang berani mempertanyakan: *"Morax telah melindungi Liyue selama seribu tahun, tapi bagaimana dengan seribu tahun berikutnya jika suatu saat Morax tiada?"* Dedikasi kerjanya yang tanpa lelah membuktikan bahwa manusia fana mampu mengelola dan memakmurkan Liyue secara mandiri.`
  },
  {
    slug: 'jean',
    title: 'Lore & Backstory: Jean Gunnhildr',
    character: 'Jean Gunnhildr',
    region: 'Mondstadt',
    element: 'anemo',
    readingTime: '15 Menit',
    audioUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/3/39/VO_JA_Jean_Hello.ogg/revision/latest?cb=20210526224055',
    audioDuration: 'Suara Karakter (JP)',
    summary: 'Penjabat Grand Master Knights of Favonius (Dandelion Knight). Mewarisi moto klan Gunnhildr: "Demi Mondstadt, Selamanya", mengorbankan waktu istirahatnya demi mengayomi setiap warga kota.',
    tags: ['Mondstadt', 'Jean', 'Knights of Favonius', 'Dandelion Knight', 'Anemo'],
    content: `## Ksatria Pelindung Kota Kebebasan

Mewarisi nama klan Gunnhildr tertua di Mondstadt, Jean memikul tanggung jawab penuh Knights of Favonius saat Grand Master Varka memimpin ekspedisi ke utara. Dari urusan diplomasi diplomatik Snezhnaya hingga kucing warga yang tersesat, Jean selalu turun tangan memastikan rakyat Mondstadt bisa hidup bebas dan tenteram.`
  },
  {
    slug: 'eula',
    title: 'Lore & Backstory: Eula Lawrence',
    character: 'Eula Lawrence',
    region: 'Mondstadt',
    element: 'cryo',
    readingTime: '15 Menit',
    audioUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/1/13/VO_JA_Eula_Hello.ogg/revision/latest?cb=20210526190529',
    audioDuration: 'Suara Karakter (JP)',
    summary: 'Kapten Reconnaissance Company Knights of Favonius (Spindrift Knight). Terlahir dari klan aristokrat zalim Lawrence, memikul stigma kebencian warga sembari melindungi kota dengan tarian pedang esnya.',
    tags: ['Mondstadt', 'Eula', 'Lawrence Clan', 'Spindrift Knight', 'Cryo'],
    content: `## Tarian Es di Balik Sumpah Balas Dendam

Meskipun menyandang nama keluarga bangsawan tirani Lawrence yang dibenci seluruh Mondstadt, Eula memilih bergabung dengan Knights of Favonius untuk menebus dosa leluhurnya. Ungkapan ikoniknya *"Dendam ini akan kuingat!"* sebenarnya adalah caranya menutupi rasa peduli dan kehangatan hatinya yang tulus.`
  },
  {
    slug: 'klee',
    title: 'Lore & Backstory: Klee',
    character: 'Klee',
    region: 'Mondstadt',
    element: 'pyro',
    readingTime: '13 Menit',
    audioUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/4/41/VO_JA_Klee_Hello.ogg/revision/latest?cb=20210526232411',
    audioDuration: 'Suara Karakter (JP)',
    summary: 'Spark Knight yang ceria dari Knights of Favonius. Putri dari penyihir legendaris Alice Hexenzirkel, gemar meledakkan ikan di Cider Lake dan menjadi langganan ruang isolasi Jean.',
    tags: ['Mondstadt', 'Klee', 'Spark Knight', 'Hexenzirkel', 'Pyro'],
    content: `## Si Kecil Penakluk Pegunungan

Klee adalah anak dari alkemis pengembara legendaris Alice, anggota perkumpulan penyihir **Hexenzirkel**. Klee memiliki bakat alami menciptakan formula peledak berkekuatan dahsyat seperti *Jumpy Dumpty*, yang sering kali mengubah topografi perbukitan Mondstadt dalam hitungan menit.`
  },
  {
    slug: 'nilou',
    title: 'Lore & Backstory: Nilou',
    character: 'Nilou',
    region: 'Sumeru',
    element: 'hydro',
    readingTime: '14 Menit',
    audioUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/c/cd/VO_JA_Nilou_Hello.ogg/revision/latest?cb=20221014200645',
    audioDuration: 'Suara Karakter (JP)',
    summary: 'Penari anggun Teater Zubayr yang menghidupkan kembali seni dan tarian Sabzeruz Festival, menjadi kunci pembebasan Nahida dari cengkeraman dogma kaku Akademi.',
    tags: ['Sumeru', 'Nilou', 'Zubayr Theater', 'Sabzeruz', 'Hydro'],
    content: `## Tarian Murni Sang Teratai Air

Di Sumeru yang sempat mengagungkan rasionalitas kaku hingga menindas seni, Nilou tetap menari dengan tulus di panggung Teater Zubayr. Tariannya merefleksikan kegembiraan murni Goddess of Flowers masa purba, dan menjadi instrumen penyelamat yang memecahkan siklus Samsara mimpi Sumeru.`
  },
  {
    slug: 'dehya',
    title: 'Lore & Backstory: Dehya',
    character: 'Dehya (Flame-Mane)',
    region: 'Sumeru',
    element: 'pyro',
    readingTime: '15 Menit',
    audioUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/0/02/VO_JA_Dehya_Hello.ogg/revision/latest?cb=20230303004654',
    audioDuration: 'Suara Karakter (JP)',
    summary: 'Tentara bayaran legendaris Eremite berjuluk "Flame-Mane". Berjiwa ksatria, setia kawan, dan rela mengorbankan tabungan hidupnya demi masa depan anak-anak yatim padang pasir.',
    tags: ['Sumeru', 'Dehya', 'Eremite', 'Flame-Mane', 'Pyro'],
    content: `## Singa Betina Padang Pasir

Dehya adalah simbol kehormatan kaum Eremite sejati. Di balik pedang besarnya dan tinju apinya yang garang, Dehya memiliki hati emas: ia menyumbangkan dana pensiunnya untuk mendirikan yayasan *Doushiru's Wall* demi pendidikan anak-anak padang pasir Sumeru.`
  },
  {
    slug: 'tighnari',
    title: 'Lore & Backstory: Tighnari',
    character: 'Tighnari',
    region: 'Sumeru',
    element: 'dendro',
    readingTime: '14 Menit',
    audioUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/6/6b/VO_JA_Tighnari_Hello.ogg/revision/latest?cb=20220828121304',
    audioDuration: 'Suara Karakter (JP)',
    summary: 'Pemimpin Forest Ranger di Hutan Avidya dan ilmuwan botani brilian ras Valuka Shuna. Menolak intrik politik Akademi demi menjaga keseimbangan ekosistem hutan hujan.',
    tags: ['Sumeru', 'Tighnari', 'Avidya Forest', 'Valuka Shuna', 'Dendro'],
    content: `## Penjaga Kehidupan Rimba Sumeru

Tighnari adalah keturunan ras rubah purba Valuka Shuna dengan telinga lebar yang sangat peka. Meskipun lulusan terbaik Amurta, ia memilih tinggal di desa Gandharva Ville untuk membimbing para ranger muda dan mengobati Collei dari penyakit Eleazar.`
  },
  {
    slug: 'arataki-itto',
    title: 'Lore & Backstory: Arataki Itto',
    character: 'Arataki Itto',
    region: 'Inazuma',
    element: 'geo',
    readingTime: '14 Menit',
    audioUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/6/64/VO_JA_Arataki_Itto_Hello.ogg/revision/latest?cb=20211214125525',
    audioDuration: 'Suara Karakter (JP)',
    summary: 'Pemimpin pertama dan terhebat dari Geng Arataki! Keturunan Oni Merah berdarah panas yang menjunjung tinggi harga diri klan, duel adu kumbang Onikabuto, dan persaudaraan tanpa batas.',
    tags: ['Inazuma', 'Arataki Itto', 'Oni Merah', 'Geng Arataki', 'Geo'],
    content: `## Kebanggaan Sang Oni Merah Hanamizaka

Meski sering membuat Kuki Shinobu pusing karena berurusan dengan penjara Doushin, Itto adalah Oni yang sangat berprinsip. Ia memegang teguh perjanjian pengorbanan leluhur Oni Biru dan Oni Merah, membuktikan bahwa kaum Oni adalah sahabat setia manusia yang penuh kehormatan.`
  },
  {
    slug: 'sangonomiya-kokomi',
    title: 'Lore & Backstory: Sangonomiya Kokomi',
    character: 'Sangonomiya Kokomi',
    region: 'Inazuma',
    element: 'hydro',
    readingTime: '15 Menit',
    audioUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/a/a8/VO_JA_Sangonomiya_Kokomi_Hello.ogg/revision/latest?cb=20210921161037',
    audioDuration: 'Suara Karakter (JP)',
    summary: 'Pendeta Ilahi Pulau Watatsumi dan ahli strategi militer brilian. Memimpin pasukan pemberontak melawan Vision Hunt Decree demi mempertahankan kebebasan rakyatnya.',
    tags: ['Inazuma', 'Sangonomiya Kokomi', 'Watatsumi', 'Orobashi', 'Hydro'],
    content: `## Sang Mutiara Kebijaksanaan Lautan

Sebagai keturunan langsung garis Pendeta Watatsumi, Kokomi memikul tanggung jawab atas kesejahteraan ekonomi, militer, dan spiritual rakyatnya. Dengan buku-buku strategi perangnya yang terkenal, ia mampu menghadapi kekuatan Shogunate yang berkali-kali lipat lebih besar.`
  },
  {
    slug: 'yoimiya',
    title: 'Lore & Backstory: Naganohara Yoimiya',
    character: 'Naganohara Yoimiya',
    region: 'Inazuma',
    element: 'pyro',
    readingTime: '14 Menit',
    audioUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/6/6e/VO_JA_Yoimiya_Hello.ogg/revision/latest?cb=20210810131238',
    audioDuration: 'Suara Karakter (JP)',
    summary: 'Pemilik Naganohara Fireworks (Ratu Festival Musim Panas). Menghadirkan senyum dan kenangan abadi di langit malam Inazuma melalui kembang api buatannya.',
    tags: ['Inazuma', 'Yoimiya', 'Naganohara', 'Kembang Api', 'Pyro'],
    content: `## Percikan Harapan di Langit Malam

Yoimiya adalah sosok yang dicintai oleh seluruh penduduk Pulau Narukami. Di masa-masa kelam Dekrit Sakoku, bengkel kembang api Yoimiya menjadi tempat perlindungan rahasia bagi para pemilik Vision buronan, membuktikan bahwa harapan rakyat tak pernah bisa dipadamkan.`
  },
  {
    slug: 'baizhu',
    title: 'Lore & Backstory: Baizhu',
    character: 'Baizhu',
    region: 'Liyue',
    element: 'dendro',
    readingTime: '15 Menit',
    audioUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/a/a2/VO_JA_Baizhu_Hello.ogg/revision/latest?cb=20230509230911',
    audioDuration: 'Suara Karakter (JP)',
    summary: 'Pemilik Bubu Pharmacy yang ditemani ular putih Changsheng. Menguasai seni medis kuno rahasia dan mengikat kontrak abadi menyerap penyakit pasien ke dalam tubuhnya sendiri.',
    tags: ['Liyue', 'Baizhu', 'Bubu Pharmacy', 'Changsheng', 'Dendro', 'Tabib'],
    content: `## Sumpah Tabib Pengikat Jiwa

Baizhu merawat Qiqi seperti putrinya sendiri di Bubu Pharmacy. Demi menyelamatkan pasien yang sekarat, Baizhu mewarisi kontrak rahasia dengan ular Changsheng: menyerap energi penyakit dan kematian ke tubuhnya sendiri, memperpendek usianya demi memperpanjang napas orang lain.`
  }
];

const targetDir = path.join(__dirname, '..', 'content', 'stories', 'character-backstory');
let count = 0;
for (const char of newCharacters) {
  const filePath = path.join(targetDir, char.slug + '.md');
  const frontmatter = `---
title: ${JSON.stringify(char.title)}
character: ${JSON.stringify(char.character)}
region: "${char.region}"
element: "${char.element}"
category: "character-backstory"
readingTime: "${char.readingTime}"
audioUrl: "${char.audioUrl}"
audioDuration: "${char.audioDuration}"
summary: ${JSON.stringify(char.summary)}
tags: ${JSON.stringify(char.tags)}
publishedAt: "2026-11-04"
rarity: 5
---

${char.content}
`;

  fs.writeFileSync(filePath, frontmatter, 'utf8');
  count++;
  console.log('Created character:', char.slug);
}

console.log(`Success! Created ${count} new characters with authentic Japanese voice lines.`);

