const fs = require('fs');
const path = require('path');

const storyQuests = [
  {
    fileName: 'zhongli-historia-antiqua.md',
    title: 'Historia Antiqua: Garam, Janji Abadi, dan Erosi Azhdaha',
    character: 'Zhongli (Morax)',
    region: 'Liyue',
    element: 'geo',
    readingTime: '22 Menit',
    audioUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/7/7b/VO_Zhongli_Hello.ogg/revision/latest?cb=20210113143726',
    audioDuration: 'Suara Karakter',
    summary: 'Kisah Sang Dewa Kontrak Morax menghadapi beban waktu dan hukum mutlak erosi, mengungkap kebenaran tragis Dewi Garam Havria di Sal Terrae, serta duel emosional menyegel kembali sahabat purbanya, Naga Azhdaha di bawah Pohon Dragon-Queller.',
    tags: ['Liyue', 'Zhongli', 'Morax', 'Azhdaha', 'Havria', 'Erosi', 'Story Quest'],
    content: `## Babak I: Jejak Dewi Garam di Sal Terrae

Dalam Chapter I (*Shadow of Yore*), Pengelana mendampingi Zhongli dan seorang sarjana arogan dari Snezhnaya bernama Wanyan. Wanyan mengklaim bahwa Morax adalah pembunuh keji yang membantai Dewi Garam, **Havria**, karena rasa cemburu.

Namun saat segel peninggalan Sal Terrae dibuka dan pedang peninggalan Havria ditemukan, kebenaran pahit terungkap:

1. **Havria Bukan Dibunuh Morax:** Havria adalah dewa yang terlalu lemah lembut dan selalu memilih mengalah di tengah berkecamuknya Archon War.
2. **Pengkhianatan dari Pengikut Sendiri:** Karena tanah mereka terus terdesak dan penderitaan tak kunjung berakhir, para tetua rakyatnya sendiri menikam Havria dari belakang dengan pedang agar sang dewi tidak tersiksa lebih lama.
3. **Kutukan Ledakan Garam:** Saat dewa tewas, energi ilahi yang meledak mengubah seluruh orang di dalam tempat persembunyian menjadi patung-patung garam abadi dalam pose melarikan diri.

> *"Bahkan batu terkeras sekalipun tidak kebal terhadap keausan waktu. Namun janji dan kontrak adalah jangkar yang menahan ingatan peradaban agar tidak hanyut terhapus sejarah."*
> — Zhongli

---

## Babak II: Tragedi Erosi dan Persahabatan Azhdaha

Dalam Chapter II (*No Mere Stone*), bencana melanda para penambang Chasm yang kehilangan ingatan dan bertingkah aneh. Penyelidikan membawa Pengelana dan Zhongli pada sosok anak kecil misterius bernama Jiu dan sang penambang tua Kun Jun.

Kebenaran yang terkuak meremukkan hati:

- **Asal-Usul Azhdaha:** Dahulu kala, Azhdaha adalah naga buta raksasa yang tertidur di perut bumi. Morax membawanya ke permukaan bumi, mengukir sepasang mata bercahaya baginya, dan mengikat kontrak abadi: *Azhdaha diizinkan hidup bersama umat manusia selama ia tidak mencelakai mereka.*
- **Kutukan Erosi (Erosion / 磨损):** Waktu mengikis pikiran Azhdaha. Hubungannya dengan urat Ley Line membuatnya menyerap penderitaan bumi dan melupakan persahabatannya dengan Morax. Kebenciannya terhadap manusia yang menambang bumi meledak menjadi amukan dahsyat.
- **Pemisahan Jiwa:** Jiwa Azhdaha terbelah menjadi dua: Kun Jun (sisa ingatan cinta dan terima kasih kepada Morax) dan Jiu (kebencian murni akibat erosi).

---

## Babak III: Duel di Bawah Dragon-Queller

Pertarungan sengit pecah di dalam Domain Pohon Penunduk Naga (*Dragon-Queller Tree*). Dengan bantuan sisa kehendak Kun Jun, Morax berhasil menundukkan sang naga purba.

Sebelum disegel kembali ke perut bumi untuk selamanya, Azhdaha dalam wujud Kun Jun mengucapkan salam perpisahan yang tak terlupakan:

> *"Morax... tidak peduli berapa ratus kali kau harus menyegelku kembali, aku tidak pernah menyesal telah menjadi sahabatmu dan melihat indahnya dunia di atas tanah."*

Zhongli berdiri terdiam menatap pohon berkilau itu, memikul kesepian ribuan tahun sebagai dewa tertua yang hidup lebih lama dari semua sahabatnya.`
  },
  {
    fileName: 'raiden-shogun-imperatrix-umbrosa.md',
    title: 'Imperatrix Umbrosa: Kilatan Petir dan Impian Abadi Sang Shogun',
    character: 'Raiden Ei (Raiden Shogun)',
    region: 'Inazuma',
    element: 'electro',
    readingTime: '24 Menit',
    audioUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/9/9a/VO_Raiden_Shogun_Hello.ogg/revision/latest?cb=20210902172734',
    audioDuration: 'Suara Karakter',
    summary: 'Perjalanan batin Raiden Ei melepaskan trauma masa lalu Cataclysm 500 tahun silam, berduel melawan boneka buatannya sendiri selama 500 tahun dalam ruang kesadaran, dan merangkul keabadian sejati yang berakar pada impian rakyat Inazuma.',
    tags: ['Inazuma', 'Raiden Shogun', 'Raiden Ei', 'Makoto', 'Keabadian', 'Story Quest'],
    content: `## Babak I: Menatap Dunia Fana yang Telah Berubah

Setelah Keputusan Berburu Vision (*Vision Hunt Decree*) dicabut, Raiden Ei mulai keluar dari Alam Kesadaran Euthymia (*Plane of Euthymia*) untuk berjalan-jalan di Kota Inazuma bersama Pengelana.

Untuk pertama kalinya dalam ratusan tahun, Ei menyaksikan bagaimana rakyatnya hidup:
- Menikmati susu dango (*Dango Milk*) dan membaca novel ringan di Yae Publishing House.
- Menyadari bahwa perubahan bukanlah musuh dari keabadian, melainkan bagian dari denyut nadi manusia fana.

Namun bayang-bayang masa lalu belum selesai. Di balik kedamaian Inazuma, tubuh boneka **Raiden Shogun** mendeteksi bahwa kehendak batin Ei telah "menyimpang" dari aturan keabadian mutlak yang dirancang 500 tahun lalu.

---

## Babak II: Pemberontakan Sang Boneka Pelindung

Tubuh Shogun mengunci kendali kekuasaan dan menganggap jiwa Ei sebagai "musuh dari Keabadian":

> *"Jika kehendakmu goyah oleh waktu dan perasaan fana, maka tugasku adalah memenggalmu demi menjaga Inazuma tetap abadi selamanya."*
> — Boneka Raiden Shogun

Keduanya memasuki ruang dimensi kesadaran murni di bawah Kuil Agung Narukami. Di sana, waktu berjalan berbeda: **Ei harus bertarung dalam duel tanpa henti melawan boneka tersebut selama 500 tahun waktu dimensi**.

---

## Babak III: Warisan Raiden Makoto & Pohon Sacred Sakura

Pengelana dan Yae Miko berhasil menembus celah dimensi tepat saat pertarungan mencapai puncaknya. Dengan tekad yang tak tergoyahkan, Ei mengayunkan *Musou Isshin* dan menundukkan Sang Boneka.

Saat pedang Makoto bersinar, sisa jiwa kembarannya, **Raiden Makoto**, menampakkan diri:
- Makoto menjelaskan bahwa keabadian sejati bukanlah kekakuan yang menolak perubahan, melainkan harapan dan impian manusia yang terus diwariskan lintas generasi.
- Bibit suci yang diberikan Makoto ditanamkan oleh Ei di masa lalu melalui celah ruang-waktu, tumbuh menjadi **Pohon Sacred Sakura** raksasa yang selama 500 tahun telah melindungi Inazuma dari kegelapan Abyss.

Dengan senyuman lega, Raiden Ei menghapus dekrit isolasi Sakoku Decree dan melangkah maju memimpin Inazuma menuju fajar baru.`
  },
  {
    fileName: 'nahida-sapientia-oromasdis.md',
    title: 'Sapientia Oromasdis: Api Kebijaksanaan dan Warisan Purba Apep',
    character: 'Nahida (Lesser Lord Kusanali)',
    region: 'Sumeru',
    element: 'dendro',
    readingTime: '21 Menit',
    audioUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/b/b6/VO_Nahida_Hello.ogg/revision/latest?cb=20221114125325',
    audioDuration: 'Suara Karakter',
    summary: 'Kisah Nahida merawat mimpi rakyat Sumeru setelah terbebas dari kurungan Akademi, serta ekspedisi berbahaya ke kedalaman padang pasir demi menyembuhkan infeksi Forbidden Knowledge pada Naga Rumput Purba Apep.',
    tags: ['Sumeru', 'Nahida', 'Kusanali', 'Apep', 'Dragon', 'Story Quest'],
    content: `## Babak I: Mimpi-Mimpi yang Tersesat di Alam Bawah Sadar

Setelah 500 tahun terkurung di Sanctuary of Surasthana, Nahida mulai belajar berinteraksi langsung dengan rakyat Sumeru. Di Babak I (*Lingering Warmth*), sebuah fenomena aneh melanda warga: orang-orang terjebak dalam mimpi kolektif di mana mereka bisa bertemu kembali dengan orang-orang tercinta yang telah meninggal.

Nahida membimbing warganya untuk menyadari batas antara kenyamanan ilusi mimpi dan kenyataan hidup:
- Manusia membutuhkan kenangan indah masa lalu, namun masa depan hanya bisa diraih dengan berpijak pada realitas hari ini.
- Nahida mengorbankan sebagian energinya untuk menjaga agar mimpi tidak melahap jiwa mereka.

---

## Babak II: Infeksi Purba Naga Rumput Apep

Di Babak II (*Homecoming*), krisis kosmik mengancam tanah Sumeru. Salah satu dari Tujuh Penguasa Naga Purba (*Seven Sovereigns*), yaitu **Apep (Dendro Dragon)**, sekarat di perut padang pasir akibat racun *Forbidden Knowledge* yang ia telan saat Raja Deshret binasa.

Nahida dan Pengelana melacak elemen purba berbentuk jamur elemen yang membawa ingatan rumah masa lalu:
1. Makhluk elemen ini mengorbankan eksistensinya agar Nahida bisa masuk ke dalam perut raksasa Naga Apep.
2. Di dalam jantung Apep, mereka menemukan *Oasis of Memories* yang telah tercemar oleh monster mutasi Abyss.

---

## Babak III: Menghidupkan Kembali Jantung Oasis

Melalui pertarungan epik membersihkan infeksi Forbidden Knowledge, Nahida menggunakan *Fire of Oasis* untuk menyembuhkan sang naga purba.

Apep, yang selama ribuan tahun membenci dewa-dewa Celestia dan menganggap para Archon sebagai perampas tahta bumi, terkejut melihat keikhlasan dan kerendahan hati sang Dewa Kebijaksanaan cilik:

> *"Dewa kecil... kau menyelamatkanku bukan demi pujian atau pengabdian, melainkan murni demi kelangsungan hidup ekosistem tanah ini. Aku tidak akan bersumpah setia kepadamu, namun aku mengakui kebijakanmu."*
> — Naga Purba Apep

Dengan sembuhnya Apep, fondasi kehidupan tanah Sumeru terselamatkan dari kehancuran total.`
  },
  {
    fileName: 'neuvillette-diluvies.md',
    title: 'Diluvies: Luka Carole dan Keadilan Sang Naga Penguasa',
    character: 'Neuvillette',
    region: 'Fontaine',
    element: 'hydro',
    readingTime: '20 Menit',
    audioUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/5/53/VO_Neuvillette_Hello.ogg/revision/latest?cb=20231001184807',
    audioDuration: 'Suara Karakter',
    summary: 'Menyelidiki kembali tragedi 400 tahun silam yang merenggut nyawa Carole dari ras Melusine, mengungkap surat ancaman berdarah, dan menyaksikan bagaimana Sang Hakim Agung Fontaine belajar memahami hati manusia.',
    tags: ['Fontaine', 'Neuvillette', 'Hydro Dragon', 'Melusine', 'Keadilan', 'Story Quest'],
    content: `## Babak I: Surat Ancaman untuk Sang Hakim Agung

Sebuah surat ancaman dikirimkan kepada Sedene, staf Melusine di Palais Mermonia. Surat itu menuntut Neuvillette untuk membebaskan narapidana tertentu atau keselamatan para Melusine akan terancam.

Penyelidikan membawa Neuvillette, Pengelana, dan Navia menggali arsip kasus tertua Fontaine yang terjadi 400 tahun lalu: **Tragedi Carole dan Komandan Vautrin**.

---

## Babak II: Tragedi 400 Tahun Silam

Dahulu kala, ketika Neuvillette pertama kali membawa ras Melusine hidup berdampingan dengan manusia di perkotaan Court of Fontaine:
- Kaum bangsawan konservatif menolak kehadiran Melusine dan memfitnah **Carole**, seorang Melusine yang tulus dan penuh kasih.
- Terjebak dalam fitnah makar dan dikepung massa yang marah, Carole memilih mengorbankan nyawanya sendiri demi mencegah terjadinya perang sipil antara Melusine dan manusia.
- Sahabat karib Carole, **Komandan Vautrin** (pemimpin korps penjaga saat itu), tidak tahan melihat ketidakadilan ini dan membunuh para konspirator bangsawan dengan tangannya sendiri.

Neuvillette, yang saat itu menjunjung hukum tanpa kompromi, terpaksa menjatuhkan hukuman pengasingan seumur hidup kepada Vautrin ke Fortress of Meropide.

---

## Babak III: Air Mata Hujan Fontaine

Dalam penyelidikan modern, Neuvillette berhasil mengungkap keturunan konspirator bangsawan yang mencoba mengulangi taktik kotor tersebut. Di hadapan Pengelana di Monumen Pemakaman Carole, hujan deras mengguyur Fontaine tanpa henti:

> *"Orang-orang sering berkata: 'Naga Hydro, Naga Hydro, jangan menangis.' Dahulu aku menganggap ungkapan itu hanya dongeng anak-anak. Namun hari ini, aku memahami rasa sakit kehilangan dan beban air mata yang tertumpah demi sebuah keadilan."*

Neuvillette kini tidak lagi memandang keadilan sekadar pasal-pasal hukum yang dingin, melainkan perlindungan penuh kasih bagi mereka yang lemah dan tak bersuara.`
  },
  {
    fileName: 'venti-carmen-dei.md',
    title: 'Carmen Dei: Jika Kau Terjebak di Tanah Tanpa Angin',
    character: 'Venti (Barbatos)',
    region: 'Mondstadt',
    element: 'anemo',
    readingTime: '17 Menit',
    audioUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/a/ad/VO_Venti_Hello.ogg/revision/latest?cb=20210113121129',
    audioDuration: 'Suara Karakter',
    summary: 'Menguak rahasia teman khayalan warga Mondstadt dan kisah haru Hans Archibald yang menyamar sebagai petualang legendaris Stanley demi menjaga agar nama sahabatnya yang gugur di Mare Jivari tidak terlupakan.',
    tags: ['Mondstadt', 'Venti', 'Barbatos', 'Stanley', 'Mare Jivari', 'Story Quest'],
    content: `## Babak I: Teropong Teman Khayalan

Dengan menggunakan perangkat penemu monokel unik milik Lisa, Pengelana dan Venti menjelajahi jalanan Mondstadt melihat "teman khayalan" yang menemani anak-anak dan orang dewasa:
- Flora memiliki teman khayalan berupa tanaman bunga yang bisa berbicara.
- Para ksatria Favonius memiliki bayangan rekan tempur masa lalu.
- Namun ketika monokel diarahkan kepada **Stanley**, seorang petualang tua yang terkenal membual tentang kehebatannya di kedai anggur Angel's Share, terlihat sosok hantu petualang berlumuran darah yang berdiri tegap di sampingnya.

---

## Babak II: Tragedi di Mare Jivari

Di tengah malam di sudut kota, Pengelana dan Venti mendengarkan pengakuan pahit sang petualang tua yang sedang mabuk sendirian:

Nama aslinya bukanlah Stanley, melainkan **Hans Archibald**. Puluhan tahun lalu, ia dan Stanley yang asli menjelajahi **Mare Jivari** — lautan abu terkutuk di mana angin tidak pernah berhembus.

Di sana, monster ganas menyerang mereka. Stanley yang asli mengorbankan nyawanya demi menyelamatkan Hans:
- Sebelum mati, Stanley berbisik memohon agar namanya tidak dilupakan.
- Dalam keputusasaan karena selamat seorang diri, Hans membuang identitas aslinya dan bersumpah hidup sebagai "Stanley", menceritakan kisah heroik sahabatnya ke setiap orang yang ia temui di seluruh dunia.
- Ketakutan terbesar Hans adalah: *Jika ia mati atau lupa, maka Stanley yang asli akan lenyap dari ingatan dunia untuk selamanya di tanah tanpa angin.*

---

## Babak III: Angin Sang Dewa Pembebas

Venti melangkah maju di bawah rembulan, menanggalkan aura konyol sang penyair jalanan dan memancarkan wujud ilahi Archon Anemo Barbatos:

> *"Hans... angin Mondstadt akan selalu mengingat setiap jiwa yang pernah melangkah di bumi ini. Biarkan sahabatmu terbang bebas bersama embusan angin kebebasan."*

Sebuah pusaran angin hijau zamrud merengkuh jiwa Stanley yang asli dan mengangkatnya ke langit tinggi. Hans menangis tersedu-sedu dalam kelegaan yang telah ia nantikan selama setengah abad.`
  },
  {
    fileName: 'xiao-alatus.md',
    title: 'Alatus: Sayap Kupu-Kupu dan Penebusan Karma Sang Yaksha',
    character: 'Xiao (Alatus)',
    region: 'Liyue',
    element: 'anemo',
    readingTime: '18 Menit',
    audioUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/f/ff/VO_Xiao_Hello.ogg/revision/latest?cb=20210209003240',
    audioDuration: 'Suara Karakter',
    summary: 'Pertemuan Xiao dengan penipu yang menyamar sebagai adeptus di Dihua Marsh, mengungkap penghormatan mendalam kepada mendiang Yaksha Pervases, dan beban kesepian Xiao yang terus bertarung melawan sisa kebencian para dewa kuno.',
    tags: ['Liyue', 'Xiao', 'Yaksha', 'Alatus', 'Karma', 'Story Quest'],
    content: `## Babak I: Penipu Adeptus di Dihua Marsh

Pengelana mendengar desas-desus tentang seorang "Bintang Adeptus Agung" bernama Starsnatcher yang menjual jimat perlindungan mahal kepada warga desa. Namun jimat tersebut memicu gangguan roh jahat karena dibuat tanpa berkah sejati.

Xiao muncul dari balik kabut rawa, memperingatkan bahwa menyalahgunakan nama para adeptus yang telah berdarah-darah membela Liyue adalah penghinaan besar terhadap mereka yang telah gugur.

---

## Babak II: Kuil Runtuh Sang Yaksha Pervases

Penyelidikan membawa mereka ke sebuah kuil tua yang terbengkalai di selatan Tianqiu Valley. Di sana terukir nama **Pervases (Junior Yaksha)**, salah satu rekan tempur Xiao ribuan tahun lalu yang gugur dalam pertempuran membersihkan sisa energi dewa-dewa yang kalah.

Starsnatcher yang ketakutan akhirnya mengakui kebohongannya di depan patung Pervases dan berjanji bertobat membersihkan kuil tersebut setiap hari.

---

## Babak III: Pengorbanan Tanpa Pamrih Sang Penjaga Terakhir

Di bawah taburan bintang di Wangshu Inn, Xiao menyantap sepiring *Almond Tofu* — satu-satunya makanan manusia yang bisa ia nikmati karena teksturnya mengingatkannya pada mimpi-mimpi manis masa lalu yang pernah ia telan.

> *"Jika kau memanggil namaku saat berada dalam bahaya maut, di manapun kau berada di tanah Teyvat, aku akan datang membantumu. Namun jangan pernah mendekatiku saat karma burukku sedang meluap... aku tidak ingin melukaimu."*
> — Xiao

Xiao tetap teguh berdiri di atap Wangshu Inn, memegang tombak gioknya di tengah malam sunyi, menjadi perisai tak terlihat yang menjaga kedamaian Liyue.`
  },
  {
    fileName: 'arlecchino-ignis-purgatorius.md',
    title: 'Ignis Purgatorius: Saat Api Perapian Padam dan Bayang-Bayang Sang Ayah',
    character: 'Arlecchino (The Knave / Peruere)',
    region: 'Fontaine',
    element: 'pyro',
    readingTime: '23 Menit',
    audioUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/c/c5/VO_Arlecchino_Hello.ogg/revision/latest?cb=20240502205856',
    audioDuration: 'Suara Karakter',
    summary: 'Kisah kelam masa lalu Arlecchino sebagai Peruere yang harus membunuh sahabat masa kecilnya Clervie, menumbangkan "Ibu" Crucabena yang kejam, dan ujian darah demi melindungi anak-anak House of the Hearth dari kutukan api darah Crimson Moon.',
    tags: ['Fontaine', 'Arlecchino', 'The Knave', 'Peruere', 'House of the Hearth', 'Story Quest'],
    content: `## Babak I: Arwah Clervie dan Memori Kelam Panti Asuhan

Pengelana bertemu dengan sosok gadis cilik berwujud arwah bernama **Clervie** di Mont Esus. Clervie memohon bantuan untuk menyelamatkan anak-anak *House of the Hearth* (Lyney, Lynette, dan Freminet) dari sosok "Ayah" yang ia yakini sangat kejam.

Namun kebenaran yang terkuak jauh lebih tragis daripada dongeng panti asuhan biasa:
- Puluhan tahun lalu, panti asuhan dikelola oleh Arlecchino generasi terdahulu, yaitu **Crucabena ("Ibu")**.
- Crucabena mendidik anak-anak dengan prinsip seleksi alam berdarah: anak-anak dipaksa saling membunuh dalam turnamen maut sampai hanya tersisa satu "Raja".
- Sahabat karib Peruere (Arlecchino saat ini) adalah Clervie. Agar Peruere bisa selamat, Clervie sengaja membiarkan dirinya ditikam oleh pedang Peruere dalam duel terakhir mereka.

---

## Babak II: Kudeta Berdarah Peruere

Setelah membunuh sahabatnya dengan hati remuk, Peruere melangkah masuk ke aula utama dan mengeksekusi Crucabena, mengakhiri era kejam sang "Ibu".

Tsaritsa menganugerahi Peruere gelar Harbingers ke-4: **The Knave / Arlecchino**. Peruere menolak dipanggil "Ibu" karena trauma masa lalunya, dan memilih dipanggil **"Ayah" (Father)**:
- Sebagai "Ayah", ia mendidik anak-anaknya dengan disiplin keras dan keterampilan bertahan hidup di dunia nyata, namun melarang keras pertumpahan darah antar saudara.

---

## Babak III: Ujian Api Darah Crimson Moon

Ketika Lyney, Lynette, dan Freminet mencoba memberontak demi membebaskan teman mereka yang dianggap akan dihukum mati oleh Ayah, Arlecchino menguji tekad mereka dalam duel habis-habisan di reruntuhan Fontaine.

Arlecchino menunjukkan wujud aslinya: keturunan dinasti terkutuk **Crimson Moon Khaenri'ah**, dengan sayap api darah yang membakar realitas.

Setelah menguji keberanian anak-anaknya, Arlecchino tersenyum tipis:
- Teman mereka tidak pernah dibunuh, melainkan diberi ramuan penghapus ingatan agar bisa hidup damai sebagai warga biasa di luar bayang-bayang Fatui.
- Arlecchino membakar sisa arwah Clervie dengan api pembersih, membebaskan sahabat masa kecilnya dari rasa sakit untuk beristirahat dengan damai selamanya.`
  },
  {
    fileName: 'hu-tao-papilio-charontis.md',
    title: 'Papilio Charontis: Menatap Batas Kematian di Bukit Wuwang',
    character: 'Hu Tao',
    region: 'Liyue',
    element: 'pyro',
    readingTime: '17 Menit',
    audioUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/2/28/VO_Hu_Tao_Hello.ogg/revision/latest?cb=20210303203536',
    audioDuration: 'Suara Karakter',
    summary: 'Mendampingi Direktur ke-77 Wangsheng Funeral Parlor mengantarkan arwah Meng dan Big G menuju perbatasan alam fana dan alam baka di Bukit Wuwang, memahami filosofi mendalam bahwa kematian adalah bagian alami dari kehidupan.',
    tags: ['Liyue', 'Hu Tao', 'Wangsheng', 'Wuwang Hill', 'Story Quest'],
    content: `## Babak I: Direktur Eksentrik Wangsheng Funeral Parlor

Pengelana berkenalan dengan Hu Tao, Direktur ke-77 Wangsheng Funeral Parlor yang terkenal di seantero pelabuhan Liyue karena perangainya yang ceria, suka membuat puisi usil, dan kerap mempromosikan diskon peti mati beli satu gratis satu.

Namun di balik sikap jenakanya, Hu Tao memegang teguh tugas sakral leluhurnya: menjaga keseimbangan mutlak antara kehidupan dan kematian.

---

## Babak II: Penyesalan Arwah Masa Kecil

Seorang pegawai baru bernama Meng dihantui rasa bersalah karena percaya bahwa ia telah memicu kutukan yang membunuh sahabat masa kecilnya, **Big G**.

Hu Tao mengajak Pengelana melakukan upacara pemanggilan arwah di kedalaman kabut **Bukit Wuwang (Wuwang Hill)**:
- Mereka menyeberangi pintu gerbang perbatasan alam gaib (*The Border*).
- Di sana, arwah Big G menampakkan diri. Big G tidak pernah menaruh dendam kepada Meng; ia hanya ingin menyampaikan salam perpisahan terakhir dan memastikan sahabatnya hidup bahagia.

---

## Babak III: Filosofi Perbatasan Kehidupan

Di tepi sungai perbatasan di mana ribuan arwah berbaris tenang menuju reinkarnasi, Hu Tao menceritakan pengalamannya saat kakeknya (Direktur ke-75) meninggal dunia:
- Hu Tao kecil pernah duduk di Bukit Wuwang selama berhari-hari menunggu arwah sang kakek lewat.
- Seorang wanita tua arwah memberitahunya: *Semua Direktur Wangsheng meninggal tanpa penyesalan di hati mereka, sehingga mereka langsung menyeberang tanpa perlu singgah di perbatasan.*

> *"Kematian bukanlah akhir dari segalanya, melainkan sebuah babak baru. Karena ada kematianlah, setiap detik dari napas kehidupan manusia menjadi begitu berharga."*
> — Hu Tao`
  },
  {
    fileName: 'kaedehara-kazuha-acer-palmatum.md',
    title: 'Acer Palmatum: Pedang Terkutuk Isshin dan Jalan Sang Samurai Pengelana',
    character: 'Kaedehara Kazuha',
    region: 'Inazuma',
    element: 'anemo',
    readingTime: '18 Menit',
    audioUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/2/25/VO_Kaedehara_Kazuha_Hello.ogg/revision/latest?cb=20210629112654',
    audioDuration: 'Suara Karakter',
    summary: 'Kazuha menghadapi bilah pedang terkutuk peninggalan klan Isshin yang dirasuki dendam Tatarasuna, memurnikannya dengan keikhlasan hati, dan meneruskan seni tempa legendaris leluhurnya tanpa terikat belenggu masa lalu.',
    tags: ['Inazuma', 'Kazuha', 'Isshin', 'Kagotsurube Isshin', 'Story Quest'],
    content: `## Babak I: Serangan Samurai Misterius di Hutan Chinju

Kazuha dan Pengelana diserang oleh seorang pendekar pedang tak dikenal yang matanya menyala merah darah di Hutan Chinju. Pendekar tersebut bertarung dengan gaya brutal klan Isshin kuno.

Setelah dilumpuhkan, terungkap bahwa pendekar tersebut hanyalah manusia biasa yang raganya dikendalikan sepenuhnya oleh sebuah pedang terkutuk: **Kagotsurube Isshin**.

---

## Babak II: Dendam Bilah Besi yang Ditelantarkan

Pedang tersebut ditempa oleh leluhur klan Kaedehara di Tatarasuna ratusan tahun lalu:
- Karena sabotase Scaramouche (Kunikuzushi) di masa lalu, pedang ini gagal memenuhi standar Shogunate dan pembuatnya melarikan diri ke Snezhnaya.
- Bilah pedang yang memiliki kesadaran tersebut merasa dikhianati dan menyimpan obsesi gila: membuktikan bahwa ia adalah pedang terbaik di dunia dengan memotong pedang Kazuha.

---

## Babak III: Pemurnian Bilah Pedang di Pantai Ritou

Kazuha membiarkan pedang tersebut merasakan langsung jiwanya dalam sebuah duel uji coba. Pedang tersebut menyadari bahwa kehausan darah hanya membawa kehancuran dan keausan pada bilahnya sendiri.

Dengan keikhlasan hati, Kazuha menyalakan kembali perapian Amenoma Smithy:
- Kazuha menempa ulang bilah tersebut bersama Master Amenoma, memurnikan dendamnya menjadi tekad pelindung.
- Pedang tersebut menyerahkan seluruh kesadaran sisa energinya ke tangan Kazuha sebagai pusaka pelindung perjalanannya.

> *"Bilah pedang tidak boleh dibebani dendam masa lalu. Pedang sejati ditempa untuk melindungi jalan hidup dan impian masa depan."*
> — Kaedehara Kazuha`
  },
  {
    fileName: 'albedo-princeps-cretaceus.md',
    title: 'Princeps Cretaceus: Manusia dari Kapur dan Misteri Dragonspine',
    character: 'Albedo (Kreideprinz)',
    region: 'Mondstadt',
    element: 'geo',
    readingTime: '19 Menit',
    audioUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/5/5f/VO_Albedo_Hello.ogg/revision/latest?cb=20201230085715',
    audioDuration: 'Suara Karakter',
    summary: 'Eksperimen mendalam alkimia kuno Khemia di puncak bersalju Dragonspine, mengungkap rahasia penciptaan manusia buatan oleh Rhinedottir, hubungan misterius dengan naga Durin, dan kekhawatiran Albedo jika suatu hari ia kehilangan kendali.',
    tags: ['Mondstadt', 'Albedo', 'Khemia', 'Rhinedottir', 'Durin', 'Dragonspine', 'Story Quest'],
    content: `## Babak I: Laboratorium di Tengah Badai Salju

Kepala Alkemis Knights of Favonius, Albedo, mengundang Pengelana ke kemah penelitiannya di Dragonspine untuk menjalani serangkaian tes adaptasi fisik dan kimia terhadap energi dingin ekstrem.

Albedo mengamati bahwa Pengelana tidak memiliki Vision namun mampu mengendalikan berbagai elemen alami, mirip dengan substansi misterius materi purba.

---

## Babak II: Filosofi Seni Khemia Khaenri'ah

Albedo menjelaskan empat tahapan alkimia seni Khemia warisan peradaban kuno Khaenri'ah:
1. **Nigredo (Kehitaman):** Materi dasar yang tak berbentuk.
2. **Albedo (Keputihan / Kapur):** Pemurnian materi menjadi bentuk murni tanpa cacat.
3. **Rubedo (Kemerahan):** Pemberian kehidupan dan jiwa melalui darah dan api.
4. **Citrinitas (Kekuningan):** Kesempurnaan emas ilahi.

Albedo mengungkapkan bahwa dirinya adalah manusia buatan yang diciptakan dari kapur (*chalk*) oleh alkemis legendaris **Rhinedottir (Gold)** — sosok yang sama yang menciptakan naga pemusnah **Durin** yang kini terkubur di bawah salju Dragonspine.

---

## Babak III: Ketakutan Sang Pangeran Kapur

Setelah menyelesaikan eksperimen pedang Festering Desire yang menyerap darah korup Durin, Albedo berdiri sendirian di tepi tebing memandang ke arah Kota Mondstadt yang damai di kejauhan:

> *"Jika suatu hari nanti... nalar dan kendali diriku runtuh oleh esensi kegelapan yang diwariskan penciptaku, dan aku mulai menghancurkan Mondstadt... bisakah aku mengandalkanmu untuk menghentikanku?"*
> — Albedo

Sebuah pertanyaan menggantung yang menjadi salah satu misteri paling mendalam dalam takdir masa depan Teyvat.`
  }
];

const targetDir = path.join(__dirname, '..', 'content', 'stories', 'story-quest');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

let created = 0;
for (const sq of storyQuests) {
  const filePath = path.join(targetDir, sq.fileName);
  const frontmatter = `---
title: ${JSON.stringify(sq.title)}
character: ${JSON.stringify(sq.character)}
region: "${sq.region}"
element: "${sq.element}"
category: "story-quest"
readingTime: "${sq.readingTime}"
audioUrl: "${sq.audioUrl}"
audioDuration: "${sq.audioDuration}"
summary: ${JSON.stringify(sq.summary)}
tags: ${JSON.stringify(sq.tags)}
publishedAt: "2026-11-04"
---

${sq.content}
`;

  fs.writeFileSync(filePath, frontmatter, 'utf8');
  created++;
  console.log('Created Story Quest:', sq.fileName);
}

console.log(`Success! Created ${created} rich Story Quest files.`);
