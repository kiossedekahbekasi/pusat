import { CharacterInfo, DuaWord, VideoScene, QuizQuestion, AdabItem } from '../types';

import { salamImg, doaImg, makanImg, arfitaImg, munifImg } from '../utils/placeholderScenes';

export const CHARACTERS: CharacterInfo[] = [
  {
    id: 'arfita',
    name: 'Kakak Arfita',
    role: 'Pemandu Berhijab Ceria',
    avatarColor: 'from-emerald-500 to-teal-700',
    badge: 'Ramah & Bersuara Merdu',
    voicePitch: 1.25,
    voiceRate: 0.85,
    imageSrc: arfitaImg,
    description: 'Kakak pembimbing perempuan berhijab anggun yang ramah, bersuara merdu, dan selalu ceria membimbing teman-teman berdoa.',
  },
  {
    id: 'munif',
    name: 'Kakak Munif',
    role: 'Sahabat Bijak Berpeci',
    avatarColor: 'from-amber-600 to-slate-800',
    badge: 'Santun & Berwibawa',
    voicePitch: 0.95,
    voiceRate: 0.88,
    imageSrc: munifImg,
    description: 'Kakak pembimbing laki-laki berpeci hitam dan busana santun yang bijaksana, sabar, dan membimbing doa dengan jelas.',
  }
];

export const DUA_WORDS: DuaWord[] = [
  {
    id: 'bismillah',
    arabic: 'بِسْمِ اللَّهِ',
    latin: 'Bismillaahir',
    meaningId: 'Dengan menyebut nama Allah',
    explanation: 'Memulai segala kebaikan dengan menyebut nama Allah Yang Maha Pengasih.',
    audioKey: 'bismillah',
    startTime: 0.0,
    duration: 1.8,
  },
  {
    id: 'rahmanir-rahim',
    arabic: 'الرَّحْمَٰنِ الرَّحِيمِ',
    latin: 'Rahmaanir Rahiim',
    meaningId: 'Yang Maha Pengasih lagi Maha Penyayang',
    explanation: 'Allah selalu menyayangi dan memberi kita nikmat yang melimpah setiap hari.',
    audioKey: 'rahmanir-rahim',
    startTime: 1.8,
    duration: 2.2,
  },
  {
    id: 'allahumma',
    arabic: 'اللَّهُمَّ',
    latin: 'Allaahumma',
    meaningId: 'Ya Allah',
    explanation: 'Kita memanggil dan memohon hanya kepada Allah yang Maha Kuasa.',
    audioKey: 'allahumma',
    startTime: 4.2,
    duration: 1.5,
  },
  {
    id: 'barik-lana',
    arabic: 'بَارِكْ لَنَا',
    latin: 'Baarik Lanaa',
    meaningId: 'Berkahilah kami / berkahilah untuk kami',
    explanation: 'Meminta agar makanan ini menjadi kebaikan, kesehatan, dan tenaga untuk beribadah.',
    audioKey: 'barik-lana',
    startTime: 5.7,
    duration: 1.8,
  },
  {
    id: 'fima-razaqtana',
    arabic: 'فِيمَا رَزَقْتَنَا',
    latin: 'Fiimaa Razaqtanaa',
    meaningId: 'Pada rezeki yang telah Engkau berikan kepada kami',
    explanation: 'Makanan dan minuman lezat adalah rezeki halal dari Allah SWT.',
    audioKey: 'fima-razaqtana',
    startTime: 7.5,
    duration: 2.4,
  },
  {
    id: 'wa-qina',
    arabic: 'وَقِنَا',
    latin: 'Wa Qinaa',
    meaningId: 'Dan peliharalah/lindungilah kami',
    explanation: 'Permohonan perlindungan kepada Allah dari segala bahaya dan keburukan.',
    audioKey: 'wa-qina',
    startTime: 10.0,
    duration: 1.5,
  },
  {
    id: 'adzaban-nar',
    arabic: 'عَذَابَ النَّارِ',
    latin: "'Adzaaban Naar",
    meaningId: 'Dari siksaan api neraka',
    explanation: 'Semoga kita senantiasa menjadi hamba yang beriman dan masuk surga-Nya.',
    audioKey: 'adzaban-nar',
    startTime: 11.5,
    duration: 2.5,
  }
];

export const VIDEO_SCENES: VideoScene[] = [
  {
    id: 1,
    title: 'Salam & Sapa Teman-Teman',
    shortLabel: 'Salam & Sapa',
    duration: 7,
    narrationText: 'Assalamu\'alaikum teman-teman yang manis, cerdas, dan shalih! Apa kabar semuanya? Senang sekali kita bisa berjumpa lagi hari ini! Yuk lambaikan tangan kalian dan jawab salam bersama-sama yaa!',
    backgroundImage: salamImg,
    characterAction: 'wave',
    actionPrompt: 'Hai teman-teman tersayang! Lambaikan tanganmu yuk!',
    funFact: 'Rasulullah SAW mengajarkan kita untuk selalu menebarkan salam dan senyum ramah kepada teman-teman.'
  },
  {
    id: 2,
    title: 'Sapaan & Ajakan Berdoa Bersama',
    shortLabel: 'Ajakan Berdoa',
    duration: 7,
    narrationText: 'Halo teman-teman tersayang! Sebelum kita menikmati makanan yang lezat dan bergizi di meja makan, mari kita baca Doa Sebelum Makan bersama-sama yaa!',
    arabicText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    latinText: 'Bismillahirrahmanirrahim',
    translationText: 'Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang',
    backgroundImage: doaImg,
    characterAction: 'pray',
    actionPrompt: 'Yuk teman-teman, angkat kedua tanganmu dan bersiap berdoa!',
    funFact: 'Membaca doa bersama teman-teman membuat suasana makan menjadi penuh berkah dan kegembiraan.'
  },
  {
    id: 3,
    title: 'Membaca Doa Sebelum Makan Bersama',
    shortLabel: 'Baca Doa',
    duration: 14,
    narrationText: 'Ayo teman-teman, ikuti suaraku yaa: Bismillahirrahmanirrahim, Allahumma baarik lanaa fiimaa razaqtanaa wa qinaa \'adzaaban naar.',
    arabicText: 'اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ',
    latinText: 'Allahumma barik lana fi ma razaqtana wa qina \'adzaban nar',
    translationText: 'Ya Allah, berkahilah kami dalam rezeki yang telah Engkau berikan kepada kami dan peliharalah kami dari siksa api neraka.',
    backgroundImage: doaImg,
    characterAction: 'pray',
    actionPrompt: 'Ayo teman-teman, lafalkan doa dengan suara merdu!',
    funFact: 'Doa ini adalah bentuk rasa syukur kita bersama atas rezeki makanan nikmat dari Allah.'
  },
  {
    id: 4,
    title: 'Sapaan Makna Doa Untuk Teman-Teman',
    shortLabel: 'Makna Doa',
    duration: 8,
    narrationText: 'Maa syaa Allah, pintar sekali teman-teman! Doa tadi memohon agar makanan kita berkah, tubuh teman-teman selalu sehat, kuat untuk bermain dan belajar, serta disayang oleh Allah!',
    arabicText: 'اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ',
    latinText: 'Doa Sebelum Makan',
    translationText: 'Semoga makanan ini membawa keberkahan dan kesehatan untuk teman-teman semua.',
    backgroundImage: makanImg,
    characterAction: 'talk',
    actionPrompt: 'Senyum ceria untuk semua teman-teman pintar!',
    funFact: 'Makanan yang berkah akan membuat teman-teman semakin cerdas dan bersemangat.'
  },
  {
    id: 5,
    title: 'Sapaan & Mengingatkan Teman-Teman',
    shortLabel: 'Sapa Teman',
    duration: 9,
    narrationText: 'Hai teman-teman, yuk kita selalu ingat untuk duduk dengan rapi, gunakan tangan kanan, dan tidak terburu-buru saat makan yaa sahabatku!',
    backgroundImage: makanImg,
    characterAction: 'eat',
    actionPrompt: 'Duduk sopan dan makan dengan tangan kanan ya teman-teman!',
    funFact: 'Makan dengan tenang dan sopan adalah tanda anak yang berakhlak mulia.'
  },
  {
    id: 6,
    title: 'Salam Perpisahan & Selamat Makan Teman-Teman',
    shortLabel: 'Selamat Makan',
    duration: 8,
    narrationText: 'Terima kasih teman-teman shalih dan shalihah! Selamat menikmati hidangan yang lezat yaa. Sampai jumpa lagi, Wassalamu\'alaikum warahmatullahi wabarakatuh!',
    arabicText: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ',
    latinText: 'Alhamdulillahilladzi ath\'amana wa saqana wa ja\'alana minal muslimin',
    translationText: 'Segala puji bagi Allah yang telah memberi kami makan dan minum, serta menjadikan kami orang-orang muslim.',
    backgroundImage: salamImg,
    characterAction: 'cheer',
    actionPrompt: 'Horeee! Selamat makan teman-teman tersayang! 🌟',
    funFact: 'Nanti setelah kenyang, jangan lupa ucapkan Alhamdulillah ya teman-teman!'
  }
];

export const ADAB_ITEMS: AdabItem[] = [
  {
    id: 1,
    title: 'Mencuci Tangan',
    desc: 'Bersihkan kuman dan kotoran dengan air mengalir dan sabun.',
    iconName: 'Sparkles',
    sunnah: 'Menjaga kebersihan sebelum menyentuh makanan.',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 2,
    title: 'Duduk dengan Rapi & Tertib',
    desc: 'Makan dan minum sambil duduk tenang, tidak boleh sambil berjalan atau berdiri.',
    iconName: 'Armchair',
    sunnah: 'Sunnah Nabi SAW melarang makan/minum berdiri.',
    color: 'from-amber-500 to-yellow-500'
  },
  {
    id: 3,
    title: 'Membaca Bismillah & Doa',
    desc: 'Memohon berkah Allah dan menjauhkan gangguan syaitan.',
    iconName: 'HeartHandshake',
    sunnah: 'Jika lupa diawal, ucapkan "Bismillahi awwalahu wa akhirahu".',
    color: 'from-emerald-500 to-teal-500'
  },
  {
    id: 4,
    title: 'Makan dengan Tangan Kanan',
    desc: 'Gunakan tangan kanan yang bersih untuk menyuap makanan ke mulut.',
    iconName: 'Hand',
    sunnah: 'Rasulullah SAW selalu mendahulukan tangan kanan untuk hal baik.',
    color: 'from-purple-500 to-indigo-500'
  },
  {
    id: 5,
    title: 'Tidak Meniup Makanan Panas',
    desc: 'Kipas atau tunggu hingga hangat secara alami sebelum dimakan.',
    iconName: 'Wind',
    sunnah: 'Larangan bernafas atau meniup ke dalam bejana makanan.',
    color: 'from-rose-500 to-pink-500'
  },
  {
    id: 6,
    title: 'Mengambil Makanan Terdekat',
    desc: 'Ambil porsi yang cukup dan terjangkau dari depan kita tanpa berebut.',
    iconName: 'Utensils',
    sunnah: 'Menghargai orang lain di meja makan.',
    color: 'from-orange-500 to-amber-600'
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Tangan mana yang diajarkan Rasulullah SAW untuk makan?',
    imageIcon: 'Hand',
    options: [
      {
        id: 'a',
        text: 'Tangan Kiri',
        isCorrect: false,
        explanation: 'Kurang tepat. Syaitan makan dengan tangan kiri, kita makan dengan tangan kanan yaa.',
        icon: '❌'
      },
      {
        id: 'b',
        text: 'Tangan Kanan',
        isCorrect: true,
        explanation: 'Benar sekali! Rasulullah SAW memerintahkan kita makan dengan tangan kanan yang bersih.',
        icon: '🌟'
      },
      {
        id: 'c',
        text: 'Kedua Tangan Sekaligus',
        isCorrect: false,
        explanation: 'Gunakan satu tangan kanan untuk menyuap makanan dengan tertib yaa.',
        icon: '🤔'
      }
    ]
  },
  {
    id: 2,
    question: 'Kapan waktu yang tepat membaca doa sebelum makan?',
    imageIcon: 'Clock',
    options: [
      {
        id: 'a',
        text: 'Sebelum makanan masuk ke mulut',
        isCorrect: true,
        explanation: 'Pintar! Kita baca doa sebelum mulai menyantap makanan agar berkah.',
        icon: '🎉'
      },
      {
        id: 'b',
        text: 'Saat makanan sudah habis',
        isCorrect: false,
        explanation: 'Saat makanan habis, kita membaca doa sesudah makan (Alhamdulillah).',
        icon: '🍛'
      },
      {
        id: 'c',
        text: 'Saat sedang tidur',
        isCorrect: false,
        explanation: 'Saat mau tidur kita membaca doa sebelum tidur (Bismika Allahumma...).',
        icon: '😴'
      }
    ]
  },
  {
    id: 3,
    question: 'Apa arti dari potongan doa "Allahumma Baarik Lanaa"?',
    imageIcon: 'Heart',
    options: [
      {
        id: 'a',
        text: 'Ya Allah, berkahilah kami',
        isCorrect: true,
        explanation: 'Maa syaa Allah benar! Kita memohon agar rezeki makanan membawa berkah.',
        icon: '✨'
      },
      {
        id: 'b',
        text: 'Ya Allah, tidurkanlah kami',
        isCorrect: false,
        explanation: 'Bukan, itu doa sebelum tidur.',
        icon: '🌙'
      },
      {
        id: 'c',
        text: 'Ya Allah, berikan kami mainan',
        isCorrect: false,
        explanation: 'Kurang tepat ya, arti Baarik Lanaa adalah Berkahilah Kami.',
        icon: '🧸'
      }
    ]
  },
  {
    id: 4,
    question: 'Bagaimana posisi tubuh yang baik saat makan?',
    imageIcon: 'Smile',
    options: [
      {
        id: 'a',
        text: 'Sambil berlari-larian',
        isCorrect: false,
        explanation: 'Berbahaya! Makanan bisa tersedak jika makan sambil berlari.',
        icon: '🏃'
      },
      {
        id: 'b',
        text: 'Duduk dengan tenang dan rapi',
        isCorrect: true,
        explanation: 'Hebat! Duduk tenang membuat pencernaan sehat dan sesuai sunnah Nabi.',
        icon: '👑'
      },
      {
        id: 'c',
        text: 'Sambil tiduran di lantai',
        isCorrect: false,
        explanation: 'Tidak boleh yaa, makan harus duduk sopan.',
        icon: '🛋️'
      }
    ]
  }
];
