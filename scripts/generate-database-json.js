const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'src', 'data', 'database');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// ─────────────────────────────────────────────────────────────
// 1. CHARACTERS
// ─────────────────────────────────────────────────────────────
const characters = [
  {
    id: "zhongli",
    name: "Zhongli",
    title: "Vago Mundo",
    rarity: 5,
    element: "geo",
    weapon: "Polearm",
    region: "Liyue",
    affiliation: "Wangsheng Funeral Parlor / The Seven",
    constellation: "Lapis Dei",
    birthday: "31 Desember",
    summary: "Konsultan misterius Wangsheng Funeral Parlor yang sesungguhnya adalah Morax (Rex Lapis), Dewa Kontrak tertua yang mendirikan Liyue ribuan tahun silam.",
    loreDescription: "Sebagai Prime Adeptus tertua di antara The Seven, Rex Lapis telah memimpin Liyue melewati Perang Archon yang berdarah. Setelah menyaksikan berlalunya 3.700 tahun dan melihat kemandirian bangsanya, ia memutuskan memalsukan kematiannya melalui Rite of Descension untuk menguji apakah manusia fana siap memegang kendali atas takdir mereka sendiri."
  },
  {
    id: "furina",
    name: "Furina",
    title: "Endless Solo of Solitude",
    rarity: 5,
    element: "hydro",
    weapon: "Sword",
    region: "Fontaine",
    affiliation: "Court of Fontaine",
    constellation: "Animula Choragi",
    birthday: "13 Oktober",
    summary: "Mantan figur Archon Fontaine yang menanggung sandiwara penderitaan tanpa henti selama 500 tahun demi menyelamatkan seluruh rakyat Fontaine dari nubuatan kehancuran.",
    loreDescription: "Diciptakan sebagai bagian manusia dari Focalors setelah terpisahnya keilahian, Furina hidup dalam kesepian dan ketakutan abadi di atas panggung Opera Epiclese. Dengan kekuatan tekad murni seorang manusia fana tanpa sihir dewa, ia berhasil menipu seluruh dunia dan Celestial Heavenly Principles agar Fontaine terbebas dari kutukan air primordial."
  },
  {
    id: "raiden-shogun",
    name: "Raiden Shogun",
    title: "Plane of Euthymia",
    rarity: 5,
    element: "electro",
    weapon: "Polearm",
    region: "Inazuma",
    affiliation: "Inazuma Shogunate / The Seven",
    constellation: "Imperatrix Umbrosa",
    birthday: "26 Juni",
    summary: "Penguasa tertinggi kepulauan Inazuma, inkarnasi kilat petir abadi yang menjaga keabadian sejati setelah kehilangan saudara kembarnya dalam Bencana Khaenri'ah.",
    loreDescription: "Ei mengunci jiwanya di dalam Alam Euthymia selama berabad-abad demi menghindari erosi waktu, menyerahkan pemerintahan fisik Inazuma kepada boneka mekanis Shogun. Melalui pertemuannya dengan Sang Pengelana dan pertempuran tekad melawan bayangannya sendiri, Ei akhirnya menyadari bahwa keabadian bukanlah kebekuan abadi, melainkan impian rakyatnya yang senantiasa hidup."
  },
  {
    id: "nahida",
    name: "Nahida",
    title: "Physalis of Purity",
    rarity: 5,
    element: "dendro",
    weapon: "Catalyst",
    region: "Sumeru",
    affiliation: "Sumeru Akademiya / The Seven",
    constellation: "Sapientia Oromasdis",
    birthday: "27 Oktober",
    summary: "Lesser Lord Kusanali, Archon Kebijaksanaan Sumeru yang merupakan cabang termurni dari Pohon Irminsul, lahir setelah pengorbanan Greater Lord Rukkhadevata.",
    loreDescription: "Meski dikurung di Sanctuary of Surasthana oleh para Grand Sage Akademiya selama 500 tahun sejak kelahirannya, Nahida tetap menyayangi rakyat Sumeru dan mengawasi mereka melalui dunia mimpi. Dengan bantuan Pengelana, ia membebaskan Sumeru dari delusi Samsara dan menghapus polusi Forbidden Knowledge dari akar Irminsul."
  },
  {
    id: "venti",
    name: "Venti",
    title: "Windborne Bard",
    rarity: 5,
    element: "anemo",
    weapon: "Bow",
    region: "Mondstadt",
    affiliation: "Mondstadt / The Seven",
    constellation: "Carmen Dei",
    birthday: "16 Juni",
    summary: "Seorang penyair pengembara berjiwa bebas di Mondstadt yang sesungguhnya adalah Barbatos, Anemo Archon pelindung kebebasan.",
    loreDescription: "Awalnya adalah roh angin kecil tanpa wujud, Barbatos bangkit bersama seorang penyair muda tak bernama untuk menggulingkan tiran badai Decarabian di Old Mondstadt 2.600 tahun lalu. Demi menghormati sahabatnya yang gugur, Barbatos mengambil wujud manusia sang penyair dan menolak memimpin Mondstadt sebagai raja agar rakyatnya menikmati kebebasan sejati."
  },
  {
    id: "neuvillette",
    name: "Neuvillette",
    title: "Ordainer of Inexorable Judgment",
    rarity: 5,
    element: "hydro",
    weapon: "Catalyst",
    region: "Fontaine",
    affiliation: "Court of Fontaine",
    constellation: "Leviathan Judicator",
    birthday: "18 Desember",
    summary: "Iudex (Ketua Mahkamah Agung) Fontaine yang sesungguhnya adalah Reinkarnasi Naga Penguasa Air (Hydro Sovereign Dragon).",
    loreDescription: "Setelah kematian Focalors dan pengembalian otoritas ilahi kuno kepadanya, Neuvillette mendapatkan kembali wujud kekuasaan penuh sang Naga Purba. Kendati demikian, 500 tahun hidup bersama manusia telah menumbuhkan empati mendalam di hatinya, mendorongnya memaafkan dosa asal manusia Fontaine dan mengubah air primordial mereka menjadi darah manusia sejati."
  },
  {
    id: "arlecchino",
    name: "Arlecchino",
    title: "The Knave",
    rarity: 5,
    element: "pyro",
    weapon: "Polearm",
    region: "Snezhnaya",
    affiliation: "Fatui Harbingers (Keempat) / House of the Hearth",
    constellation: "Ignis Purgatorius",
    birthday: "22 Agustus",
    summary: "Fatui Harbinger Peringkat Keempat dan 'Ayah' pengayom House of the Hearth, pembawa darah terkutuk dari Dinasti Crimson Moon Khaenri'ah.",
    loreDescription: "Dikenal dengan nama aslinya Peruere, ia membunuh Crucabena (Knave sebelumnya) demi membebaskan anak-anak yatim piatu dari pertumpahan darah saudara. Membawa api bulan merah yang membakar ilusi dan kutukan hitam di kedua lengannya, Arlecchino memerintah House of the Hearth dengan disiplin besi namun menjaga anak-anaknya dengan perlindungan penuh kasih."
  },
  {
    id: "hu-tao",
    name: "Hu Tao",
    title: "Fragrance in Thaw",
    rarity: 5,
    element: "pyro",
    weapon: "Polearm",
    region: "Liyue",
    affiliation: "Wangsheng Funeral Parlor",
    constellation: "Papilio Charontis",
    birthday: "15 Juli",
    summary: "Direktur ke-77 Wangsheng Funeral Parlor yang eksentrik dan ceria, penjaga perbatasan sakral antara dunia fana dan akhirat.",
    loreDescription: "Meski sering dianggap aneh karena lelucon dan syair jenakanya di jalanan Liyue, Hu Tao memperlakukan ritus kematian dengan rasa hormat paling khidmat. Sejak usia 13 tahun, ia telah melintasi bukit Wuwang Hill hingga ke perbatasan roh untuk mengantarkan kakeknya dan jiwa-jiwa penasaran menuju peristirahatan abadi."
  },
  {
    id: "kaedehara-kazuha",
    name: "Kaedehara Kazuha",
    title: "Scarlet Leaves Pursue Wild Waves",
    rarity: 5,
    element: "anemo",
    weapon: "Sword",
    region: "Inazuma",
    affiliation: "The Crux Fleet",
    constellation: "Acer Palmatum",
    birthday: "29 Oktober",
    summary: "Samurai pengelana dari klan Kaedehara yang runtuh, mampu mendengar bisikan angin dan pernah menahan tebasan pedang Musou no Hitotachi milik Raiden Shogun.",
    loreDescription: "Membawa kehancuran klan Isshin dan duka atas kematian sahabatnya Tomo di hadapan Tenshukaku, Kazuha mengarungi samudra bersama Armada Crux pimpinan Beidou. Pada pertempuran Inazuma, resonansi tekadnya menghidupkan kembali Vision Elektro almarhum sahabatnya, menorehkan sejarah manusia fana pertama yang berhasil menangkis jurus pamungkas dewa petir."
  },
  {
    id: "xiao",
    name: "Xiao",
    title: "Vigilant Yaksha",
    rarity: 5,
    element: "anemo",
    weapon: "Polearm",
    region: "Liyue",
    affiliation: "Adepti Liyue",
    constellation: "Alatus Nemeseos",
    birthday: "17 April",
    summary: "Satu-satunya Yaksha penjaga Liyue yang tersisa, menanggung derita karma hitam selama ribuan tahun demi membasmi sisa-sisa dendam para dewa kuno.",
    loreDescription: "Dikenal sebagai Alatus atau Jenderal Conqueror of Demons, Xiao mengikat kontrak sumpah setia kepada Rex Lapis. Karena jiwanya terkontaminasi oleh karma iblis ratusan pertempuran, Xiao memilih menjauh dari keramaian manusia di Wangshu Inn, menahan rasa sakit tak terperi yang hanya bisa diredakan oleh lantunan seruling Anemo Barbatos."
  },
  {
    id: "diluc",
    name: "Diluc",
    title: "The Darknight Hero",
    rarity: 5,
    element: "pyro",
    weapon: "Claymore",
    region: "Mondstadt",
    affiliation: "Dawn Winery",
    constellation: "Noctua",
    birthday: "30 April",
    summary: "Pemilik perkebunan Dawn Winery terkaya di Mondstadt, pahlawan bayangan yang melindungi kota dari ancaman Abyss Order dan Fatui saat malam tiba.",
    loreDescription: "Mantan kapten termuda Knights of Favonius yang mengundurkan diri dengan rasa kecewa mendalam setelah kematian ayahnya, Crepus, yang ditutup-tutupi oleh petinggi ksatria. Selama bertahun-tahun Diluc berkelana seorang diri memburu jaringan Fatui menggunakan Delusion ayahnya sebelum kembali ke Mondstadt sebagai pelindung tanpa tanda jasa."
  },
  {
    id: "bennett",
    name: "Bennett",
    title: "Trial by Fire",
    rarity: 4,
    element: "pyro",
    weapon: "Sword",
    region: "Mondstadt",
    affiliation: "Adventurers' Guild",
    constellation: "Rota Calamitatis",
    birthday: "29 Februari",
    summary: "Pemuda petualang yang ramah dari Mondstadt dengan nasib sial legendaris, namun memiliki hati sehangat kobaran api dan pantang menyerah.",
    loreDescription: "Ditemukan sebagai bayi di jurang neraka Mare Jivari oleh seorang petualang tua, Bennett dibesarkan oleh para petualang veteran Mondstadt. Walau kemalangan selalu menyertainya kemanapun ia pergi, kepositifan dan keberaniannya dalam mengorbankan diri demi teman-temannya membuatnya dianugerahi Vision Pyro."
  },
  {
    id: "xiangling",
    name: "Xiangling",
    title: "Exquisite Delicacy",
    rarity: 4,
    element: "pyro",
    weapon: "Polearm",
    region: "Liyue",
    affiliation: "Wanmin Restaurant",
    constellation: "Trulla",
    birthday: "2 November",
    summary: "Koki jenius dan berani dari Restoran Wanmin di Liyue, bertualang mencari bahan kuliner unik bersama rekannya Guoba.",
    loreDescription: "Bagi Xiangling, seni memasak tidak mengenal batasan kelas maupun bahan terlarang. Kehangatan hati dan semangat inovasinya menarik perhatian Guoba—yang sesungguhnya adalah Marchosius, Sang Dewa Kompor kuno yang telah kehilangan memori dan kekuatannya setelah memberkati tanah Liyue."
  },
  {
    id: "xingqiu",
    name: "Xingqiu",
    title: "Juvenile Galant",
    rarity: 4,
    element: "hydro",
    weapon: "Sword",
    region: "Liyue",
    affiliation: "Feiyun Commerce Guild / Guhua Clan",
    constellation: "Fabulae Textile",
    birthday: "9 Oktober",
    summary: "Tuan muda kedua Feiyun Commerce Guild yang santun namun gemar membaca novel pendekar dan mewarisi seni pedang Aliran Guhua.",
    loreDescription: "Di balik penampilannya sebagai cendekiawan muda kaya raya, Xingqiu adalah pendekar pedang jenius yang berhasil menghidupkan kembali jurus-jurus kuno Aliran Guhua yang hampir punah melalui pemahaman mendalam tentang seni dan kekuatan Vision Hydro."
  },
  {
    id: "fischl",
    name: "Fischl",
    title: "Prinzessin der Verurteilung",
    rarity: 4,
    element: "electro",
    weapon: "Bow",
    region: "Mondstadt",
    affiliation: "Adventurers' Guild",
    constellation: "Corvus",
    birthday: "27 Mei",
    summary: "Penyidik misterius Adventurers' Guild yang mengaku sebagai putri dari kerajaan Immernachtreich, didampingi burung gagak malam Oz.",
    loreDescription: "Lahir dengan nama Amy, ia melarikan diri dari kesepian masa kecil melalui buku dongeng fantasi. Keyakinannya yang tulus pada dunia mimpi membangkitkan Vision Electro dan memanggil manifestasi Oz ke dunia nyata, menjadikannya salah satu agen penyelidik paling tajam di seluruh Mondstadt."
  },
  {
    id: "kaeya",
    name: "Kaeya",
    title: "Frostwind Swordsman",
    rarity: 4,
    element: "cryo",
    weapon: "Sword",
    region: "Mondstadt",
    affiliation: "Knights of Favonius",
    constellation: "Pavo Ocellus",
    birthday: "30 November",
    summary: "Kapten Kavaleri Knights of Favonius yang cerdik dan memikat, menyimpan rahasia besar sebagai keturunan terakhir klan Alberich dari Khaenri'ah.",
    loreDescription: "Ditinggalkan oleh ayah kandungnya di depan Dawn Winery saat badai hujan dengan pesan bahwa ia adalah 'harapan terakhir Khaenri'ah', Kaeya terbelah di antara kesetiaan pada tanah air leluhurnya atau tanah Mondstadt dan saudara angkatnya Diluc yang telah memberinya kehangatan keluarga."
  }
];

// ─────────────────────────────────────────────────────────────
// 2. WEAPONS
// ─────────────────────────────────────────────────────────────
const weapons = [
  {
    id: "mistsplitter-reforged",
    name: "Mistsplitter Reforged",
    type: "Sword",
    rarity: 5,
    baseAtk: 674,
    subStat: "CRIT DMG 44.1%",
    passiveName: "Mistsplitter's Edge",
    passiveDesc: "Memberikan 12% Elemental DMG Bonus untuk semua elemen dan tumpukan Mistsplitter's Emblem hingga 28%.",
    description: "Pedang pusaka yang pernah hancur berkeping-keping saat pertarungan melawan monster jurang abyss di Inazuma, kini ditempa ulang dengan kilauan petir ungu yang membelah kabut pekat tak berujung."
  },
  {
    id: "staff-of-homa",
    name: "Staff of Homa",
    type: "Polearm",
    rarity: 5,
    baseAtk: 608,
    subStat: "CRIT DMG 66.2%",
    passiveName: "Reckless Cinnabar",
    passiveDesc: "Meningkatkan Max HP sebesar 20% dan memberikan bonus ATK berdasarkan Max HP pengguna.",
    description: "Tongkat kayu bakar suci yang digunakan dalam ritual pemurnian kuno untuk membakar dosa, rasa sakit, dan kotoran dunia agar jiwa yang gugur dapat kembali ke pelukan perapian abadi."
  },
  {
    id: "aqua-simulacra",
    name: "Aqua Simulacra",
    type: "Bow",
    rarity: 5,
    baseAtk: 542,
    subStat: "CRIT DMG 88.2%",
    passiveName: "The Cleansing Form",
    passiveDesc: "HP meningkat 16%. Saat ada musuh di sekitar, DMG meningkat 20% baik saat karakter berada di medan pertempuran maupun tidak.",
    description: "Busur panjang dengan warna yang senantiasa berubah menyerupai aliran air bawah tanah yang tak terduga, melambangkan rahasia tersembunyi yang terkubur di kedalaman jurang The Chasm."
  },
  {
    id: "wolfs-gravestone",
    name: "Wolf's Gravestone",
    type: "Claymore",
    rarity: 5,
    baseAtk: 608,
    subStat: "ATK 49.6%",
    passiveName: "Wolfish Tracker",
    passiveDesc: "Meningkatkan ATK sebesar 20%. Serangan terhadap musuh dengan HP di bawah 30% meningkatkan ATK seluruh anggota party sebesar 40%.",
    description: "Bilah pedang raksasa tanpa tepi tajam yang tertancap di Wolvendom, penanda makam sang Kesatria Serigala dan bukti ikatan persahabatan sejati antara manusia dan Raja Serigala Andrius."
  },
  {
    id: "kaguras-verity",
    name: "Kagura's Verity",
    type: "Catalyst",
    rarity: 5,
    baseAtk: 608,
    subStat: "CRIT DMG 66.2%",
    passiveName: "Kagura Dance",
    passiveDesc: "Meningkatkan Elemental Skill DMG setiap kali melancarkan skill, menumpuk hingga 3 lapis untuk bonus semua Elemental DMG.",
    description: "Lonceng upacara suci yang digunakan oleh Yae Miko dalam ritual tarian Kagura di bawah naungan pohon Sacred Sakura Gunung Yougou, melantunkan nada-nada mistis yang menghalau roh jahat."
  },
  {
    id: "the-catch",
    name: "The Catch",
    type: "Polearm",
    rarity: 4,
    baseAtk: 510,
    subStat: "Energy Recharge 45.9%",
    passiveName: "Shanty",
    passiveDesc: "Meningkatkan Elemental Burst CRIT Rate sebesar 12% dan Elemental Burst DMG sebesar 32%.",
    description: "Tombak bercabang yang awalnya merupakan alat penangkap ikan legendaris dari Inazuma, namun ketangguhan dan keseimbangannya setara dengan senjata para kesatria elit istana."
  },
  {
    id: "favonius-sword",
    name: "Favonius Sword",
    type: "Sword",
    rarity: 4,
    baseAtk: 454,
    subStat: "Energy Recharge 61.3%",
    passiveName: "Windfall",
    passiveDesc: "Serangan CRIT memiliki peluang 100% menghasilkan partikel energi netral untuk memulihkan energi seluruh anggota tim.",
    description: "Pedang standar para ksatria Knights of Favonius, ringan dan terasah sempurna, mencerminkan semilir angin kebebasan yang melindungi rakyat Mondstadt dari ancaman bahaya."
  },
  {
    id: "the-widsith",
    name: "The Widsith",
    type: "Catalyst",
    rarity: 4,
    baseAtk: 510,
    subStat: "CRIT DMG 55.1%",
    passiveName: "Debut",
    passiveDesc: "Saat memasuki medan laga, memainkan melodi acak: meningkatkan ATK 120%, Elemental DMG 96%, atau Elemental Mastery 480 selama 10 detik.",
    description: "Buku catatan partitur musik tua yang merekam lagu-lagu pemberontakan para musisi pengembara Wanderer's Troupe dalam menggulingkan tirani bangsawan lama Mondstadt."
  },
  {
    id: "dull-blade",
    name: "Dull Blade",
    type: "Sword",
    rarity: 1,
    baseAtk: 185,
    subStat: "None",
    passiveName: "None",
    passiveDesc: "Tidak memiliki kemampuan pasif khusus.",
    description: "Pedang latihan tumpul berbahan besi sederhana yang setia menemani Sang Pengelana (Traveler) melintasi perbatasan berbagai benua sejak hari pertama terbangun di pesisir pantai Mondstadt."
  }
];

// ─────────────────────────────────────────────────────────────
// 3. MATERIALS & FOOD
// ─────────────────────────────────────────────────────────────
const materials = [
  {
    id: "agnidus-agate",
    name: "Agnidus Agate Gemstone",
    category: "ascension",
    rarity: 5,
    region: "Natlan / Semua",
    source: "Hadiah Pyro Hypostasis, Pyro Regisvine, atau Weekly Boss Natlan",
    effect: "Material tertinggi untuk menembus batas level maksimal (Lv. 90) karakter berelemen Pyro.",
    description: "Permata merah membara yang menyimpan firman Dewa Perang: 'Janji telah dibuat demi impian... Perang berkobar demi nama kebenaran.'"
  },
  {
    id: "varunada-lazurite",
    name: "Varunada Lazurite Gemstone",
    category: "ascension",
    rarity: 5,
    region: "Fontaine / Semua",
    source: "Hadiah Oceanid, Hydro Tulpa, atau All-Devouring Narwhal",
    effect: "Material tertinggi untuk menembus batas level maksimal karakter berelemen Hydro.",
    description: "Kristal biru murni tanpa cela yang memantulkan hukum keadilan Fontaine: 'Idealku tidak ternoda... Para dewa pun dapat diadili di hadapan hukum keadilan.'"
  },
  {
    id: "philanemo-mushroom",
    name: "Philanemo Mushroom",
    category: "specialty",
    rarity: 1,
    region: "Mondstadt",
    source: "Tumbuh di bawah atap dan dinding rumah di Kota Mondstadt dan Springvale",
    description: "Jamur unik yang tumbuh menyerap hembusan angin hangat Mondstadt. Sering digunakan dalam bahan racikan obat dan kenaikan level karakter seperti Mona, Klee, dan Barbara."
  },
  {
    id: "cor-lapis",
    name: "Cor Lapis",
    category: "specialty",
    rarity: 1,
    region: "Liyue",
    source: "Ditambang di tebing terjal Gunung Liyue (terutama Mt. Hulao)",
    description: "Batu mineral mulia berwarna kuning emas yang merupakan kondensasi elemen Geo murni di dalam perut bumi Liyue, bahan penting bagi Zhongli dan Keqing."
  },
  {
    id: "naku-weed",
    name: "Naku Weed",
    category: "specialty",
    rarity: 1,
    region: "Inazuma",
    source: "Tumbuh di daerah dengan konsentrasi Electro tinggi di Tatarasuna dan Narukami Island",
    description: "Tumbuhan yang mengeluarkan dengungan listrik samar saat badai mendekat. Kelopaknya bergetar melindungi putik bunganya dari sambaran petir."
  },
  {
    id: "adeptus-temptation",
    name: "Adeptus' Temptation",
    category: "food",
    rarity: 5,
    region: "Liyue",
    source: "Dimasak dari Ham, Kepiting, Daging Udang, dan Jamur Matsutake",
    effect: "Meningkatkan ATK seluruh anggota party sebesar 372 dan CRIT Rate sebesar 12% selama 300 detik.",
    description: "Mahakarya kuliner tertinggi di seantero Liyue. Aromanya yang begitu surgawi konon bahkan mampu menggoda para Adepti yang hidup menyendiri di puncak awan untuk turun ke dunia fana."
  }
];

// ─────────────────────────────────────────────────────────────
// 4. WORLD ITEMS & EXPLORATION
// ─────────────────────────────────────────────────────────────
const worldItems = [
  {
    id: "anemoculus",
    name: "Anemoculus",
    type: "oculus",
    region: "Mondstadt",
    description: "Substansi terkonsentrasi yang menyimpan energi Anemo murni, melayang di berbagai sudut tersembunyi Mondstadt.",
    locationLore: "Persembahkan kepada Statue of The Seven di Mondstadt untuk memulihkan kekuatan dewa angin dan meningkatkan stamina maksimal Sang Pengelana."
  },
  {
    id: "geoculus",
    name: "Geoculus",
    type: "oculus",
    region: "Liyue",
    description: "Batu permata mengambang berwarna keemasan yang mengandung intisari bumi pegunungan Liyue.",
    locationLore: "Tersebar di 131 lokasi di puncak gunung dan reruntuhan kuno Liyue. Mempersembahkannya membuka segel sembilan pilar Nine Pillars of Peace di Cuijue Slope."
  },
  {
    id: "shrine-of-depths-key",
    name: "Shrine of Depths Key",
    type: "key",
    region: "Mondstadt, Liyue, Inazuma, Sumeru, Fontaine, Natlan",
    description: "Kunci kuno berpola rumit yang mampu membuka segel kuil terlupakan Shrine of Depths.",
    locationLore: "Shrine of Depths adalah peninggalan peradaban kuno yang tersebar di seluruh Teyvat, menyimpan Luxurious Chest berisikan artefak berharga dan Primogem melimpah."
  },
  {
    id: "luxurious-chest",
    name: "Luxurious Chest",
    type: "chest",
    region: "Seluruh Benua Teyvat",
    description: "Tingkatan peti harta karun termewah dan paling langka di Teyvat, dihiasi ukiran emas mulia dan batu permata berkilau.",
    locationLore: "Hanya dapat ditemukan setelah menyelesaikan teka-teki dunia tersulit, mengalahkan bos tersembunyi, atau menyelesaikan quest bersejarah skala besar."
  },
  {
    id: "crimson-agate",
    name: "Crimson Agate",
    type: "puzzle",
    region: "Mondstadt (Dragonspine)",
    description: "Kristal merah darah yang terbentuk dari akumulasi kekuatan pohon Frostbearing Tree di pegunungan es Dragonspine.",
    locationLore: "Merupakan kristalisasi darah naga Durin yang meresap ke dalam es abadi Dragonspine setelah pertempurannya melawan Dvalin 500 tahun lalu."
  }
];

// ─────────────────────────────────────────────────────────────
// 5. QUEST ITEMS & ARTIFACTS
// ─────────────────────────────────────────────────────────────
const questItems = [
  {
    id: "holy-lyre-der-himmel",
    name: "Holy Lyre der Himmel",
    questName: "Prologue: The Outlander Who Caught the Wind",
    chapter: "Archon Quest Mondstadt Babak II & III",
    origin: "Katedral Favonius / Barbatos",
    description: "Kecapi suci bertabur ukiran bulu angin yang pernah dipetik oleh Archon Barbatos untuk memanggil naga Dvalin ribuan tahun silam.",
    historicalSignificance: "Instrumen ini dipinjam (dan dicuri secara rahasia oleh Fatui) untuk memulihkan kewarasan Dvalin dari racun korupsi Abyss Order."
  },
  {
    id: "aranyaka-book",
    name: "Aranyaka (Buku Cerita Hutan)",
    questName: "Aranyaka World Quest Series",
    chapter: "Sumeru Dharma Forest Lore",
    origin: "Diberikan oleh kaum Aranara di Vanarana",
    description: "Buku catatan tebal bertuliskan bahasa kuno kaum peri hutan Aranara yang mencatat kenangan Nara Varuna (saudara kembar Pengelana).",
    historicalSignificance: "Merupakan kunci untuk membersihkan zona Marana (Withering) dan membangkitkan kembali Festival Utsava di jantung hutan Sumeru."
  },
  {
    id: "ancient-deshret-slate",
    name: "Scarlet Sand Slate",
    questName: "Golden Slumber & Old Notes",
    chapter: "Gurun Pasir Sumeru / Makam King Deshret",
    origin: "Peradaban Kuno Al-Ahmar (King Deshret)",
    description: "Lempengan batu bercahaya misterius yang dapat beresonansi dengan teknologi piramida kuno King Deshret.",
    historicalSignificance: "Membuka otoritas lift, gerbang rahasia, dan pintu makam Al-Ahmar, mengungkap kebenaran di balik persahabatan tragis Rukkhadevata, King Deshret, dan Nabu Malikata (Goddess of Flowers)."
  },
  {
    id: "narzissenkreuz-blade",
    name: "Sword of Narzissenkreuz",
    questName: "In the Wake of Narcissus",
    chapter: "Fontaine Narzissenkreuz Ordo Series",
    origin: "Ditempa di Laut Purba Primordial Sea",
    description: "Pedang suci yang ditempa dari kehendak murni Rene, Jakob, Mary-Ann, dan Ann untuk memotong benang takdir kiamat Fontaine.",
    historicalSignificance: "Senjata ini memiliki kemampuan unik untuk beralih antara energi Arkhe Pneuma dan Ousia secara bebas, lambang transendensi kehendak manusia atas nubuatan surga."
  }
];

// Write files
fs.writeFileSync(path.join(targetDir, 'characters.json'), JSON.stringify(characters, null, 2), 'utf-8');
fs.writeFileSync(path.join(targetDir, 'weapons.json'), JSON.stringify(weapons, null, 2), 'utf-8');
fs.writeFileSync(path.join(targetDir, 'materials.json'), JSON.stringify(materials, null, 2), 'utf-8');
fs.writeFileSync(path.join(targetDir, 'world-items.json'), JSON.stringify(worldItems, null, 2), 'utf-8');
fs.writeFileSync(path.join(targetDir, 'quest-items.json'), JSON.stringify(questItems, null, 2), 'utf-8');

console.log('Successfully generated database files in src/data/database/:');
console.log('- characters.json:', characters.length);
console.log('- weapons.json:', weapons.length);
console.log('- materials.json:', materials.length);
console.log('- world-items.json:', worldItems.length);
console.log('- quest-items.json:', questItems.length);
