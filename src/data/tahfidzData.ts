import { TahfidzProfile, Santri, KegiatanSantri, Guru } from '../types';

export const DEFAULT_TAHFIDZ_PROFILE: TahfidzProfile = {
  name: "Rumah Tahfidz Nurul A'laa Al-Qur'an",
  tagline: "Mencetak Generasi Rabbani Penghafal Al-Qur'an yang Berakhlakul Karimah",
  logoUrl: "",
  profilText: "Rumah Tahfidz Nurul A'laa Al-Qur'an adalah lembaga pendidikan Al-Qur'an non-formal yang berfokus pada pembentukan karakter hafiz/hafizah Al-Qur'an. Dengan metode mutqin yang terstruktur, kami mendampingi anak-anak dan remaja dalam menghafal, memahami, serta mengamalkan nilai-nilai Al-Qur'an dalam kehidupan sehari-hari.",
  visi: "Terwujudnya Generasi Qur'ani yang Hafiz, Mutqin, Berkarakter Islami, dan Bermanfaat Bagi Agama, Keluarga, serta Bangsa.",
  misi: [
    "Menyelenggarakan program Tahfidzul Qur'an 30 Juz dengan metode bimbingan terstruktur dan berstandar mutqin.",
    "Membina adab, tajwid, dan kelancaran bacaan Al-Qur'an sesuai kaidah Qira'at Syatibiyyah.",
    "Membentuk karakter santri yang berakhlak mulia melalui pembiasaan ibadah harian dan kajian adab.",
    "Mengembangkan kemandirian dan potensi kepemimpinan para santri melalui kegiatan keislaman dan kebersamaan.",
    "Membangun kemitraan yang erat dengan orang tua / wali santri dalam pengawasan hafalan di rumah."
  ],
  address: "Jl. Nurul A'laa No. 15, Kec. Pondok Gede, Kota Bekasi, Jawa Barat",
  phone: "0812-9876-5432",
  whatsapp: "6281298765432",
  pengasuh: "Ustadz H. Ahmad Fauzi Al-Hafiz, Lc.",
  establishedYear: 2018
};

export const DEFAULT_SANTRI_LIST: Santri[] = [
  {
    id: 'snt-001',
    nis: 'NUR-202301',
    name: 'Muhammad Rayhan Al-Fatih',
    gender: 'L',
    age: 14,
    hafalanJuz: 15,
    status: 'Aktif',
    wali: 'Bpk. Hendra Wijaya',
    phoneWali: '081234567891',
    photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400',
    joinedDate: '2023-01-10',
    notes: 'Istiqomah setoran 1 halaman tiap subuh. Lancar di Juz 1-15.'
  },
  {
    id: 'snt-002',
    nis: 'NUR-202205',
    name: 'Aisyah Azzahra',
    gender: 'P',
    age: 12,
    hafalanJuz: 30,
    status: 'Mutqin',
    wali: 'Ibu Fatimah Zahra',
    phoneWali: '081398765432',
    photoUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=400',
    joinedDate: '2022-05-15',
    notes: 'Khatam 30 Juz dan telah lulus Ujian Munaqasyah Mutqin.'
  },
  {
    id: 'snt-003',
    nis: 'NUR-202308',
    name: 'Fatih Ahmad Al-Ghazali',
    gender: 'L',
    age: 11,
    hafalanJuz: 8,
    status: 'Aktif',
    wali: 'Bpk. Dr. Syaifullah',
    phoneWali: '085711223344',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    joinedDate: '2023-08-01',
    notes: 'Tajwid dan makhraj sangat baik, aktif diawali juz 30 & juz 1-7.'
  },
  {
    id: 'snt-004',
    nis: 'NUR-202312',
    name: 'Khadijah Nur Jannah',
    gender: 'P',
    age: 13,
    hafalanJuz: 12,
    status: 'Aktif',
    wali: 'Ibu Nurbaiti',
    phoneWali: '081987654321',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    joinedDate: '2023-12-05',
    notes: 'Fokus murojaah rutin sore hari.'
  },
  {
    id: 'snt-005',
    nis: 'NUR-202102',
    name: 'Umar Khalid Bin Walid',
    gender: 'L',
    age: 16,
    hafalanJuz: 30,
    status: 'Lulus',
    wali: 'Bpk. M. Syukri',
    phoneWali: '081122334455',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    joinedDate: '2021-02-10',
    notes: 'Alumni lulusan 2025, saat ini menjadi asisten pengajar tahfidz.'
  }
];

export const DEFAULT_GURU_LIST: Guru[] = [
  {
    id: 'gr-001',
    name: 'Ustadz H. Ahmad Fauzi Al-Hafiz, Lc.',
    gender: 'L',
    jabatan: 'Pengasuh / Pimpinan',
    spesialisasi: "Hafal 30 Juz, Sanad Qira'at Ashim",
    phone: '081298765432',
    photoUrl: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=400',
    status: 'Aktif',
    joinedDate: '2018-01-01',
    bio: 'Pendiri dan pengasuh Rumah Tahfidz, membina santri dalam hafalan dan adab Al-Qur\'an sejak tahun 2018.'
  },
  {
    id: 'gr-002',
    name: 'Ustadzah Siti Maryam, S.Pd.I.',
    gender: 'P',
    jabatan: 'Pengajar Tahfidz Putri',
    spesialisasi: 'Hafal 30 Juz, Tahsin & Tajwid',
    phone: '081345678901',
    photoUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400',
    status: 'Aktif',
    joinedDate: '2019-06-15',
    bio: 'Membimbing santriwati dalam program tahfidz dan tahsin harian.'
  },
  {
    id: 'gr-003',
    name: 'Ustadz Zainal Abidin',
    gender: 'L',
    jabatan: 'Pengajar Tahsin & Tajwid',
    spesialisasi: "Qira'at Syatibiyyah",
    phone: '085612345678',
    photoUrl: 'https://images.unsplash.com/photo-1590086782957-93c06ef21604?auto=format&fit=crop&q=80&w=400',
    status: 'Aktif',
    joinedDate: '2021-03-10',
    bio: 'Fokus mengajarkan kelancaran bacaan dan kaidah tajwid kepada santri baru.'
  }
];

export const DEFAULT_KEGIATAN_LIST: KegiatanSantri[] = [
  {
    id: 'kgt-001',
    title: 'Munaqasyah & Uji Publik Hafalan 30 Juz Santri',
    category: 'Munaqasyah',
    date: '10 Agustus 2026',
    time: '08.00 - 12.00 WIB',
    location: 'Aula Utama Rumah Tahfidz Nurul A\'laa',
    description: 'Kegiatan pengujian hafalan terbuka di hadapan dewan penguji dan para wali santri untuk menguji kelancaran & mutqin hafalan Al-Qur\'an.',
    photoUrl: 'https://images.unsplash.com/photo-1609599006353-e629aa5d95d7?auto=format&fit=crop&q=80&w=800',
    createdAt: new Date().toISOString()
  },
  {
    id: 'kgt-002',
    title: 'Setoran Subuh & Murojaah Ziyadah Bersama',
    category: 'Setoran Hafalan',
    date: '12 Agustus 2026',
    time: '05.00 - 06.30 WIB',
    location: 'Masjid Nurul A\'laa',
    description: 'Rutinitas harian santri menyetorkan hafalan baru (ziyadah) dan mengulang hafalan lama (murojaah) pasca sholat Subuh berjamaah.',
    photoUrl: 'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?auto=format&fit=crop&q=80&w=800',
    createdAt: new Date().toISOString()
  },
  {
    id: 'kgt-003',
    title: 'Kajian Adab Penghafal Al-Qur\'an & Kitab At-Tibyan',
    category: 'Kajian',
    date: '7 Agustus 2026',
    time: '16.00 - 17.30 WIB',
    location: 'Ruang Serbaguna Lantai 2',
    description: 'Pembekalan nilai-nilai adab, pembersihan hati, dan etika pembawa Al-Qur\'an oleh Ustadz Pengasuh.',
    photoUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800',
    createdAt: new Date().toISOString()
  },
  {
    id: 'kgt-004',
    title: 'Rihlah & Outing Santri Tahfidz ke Alam',
    category: 'Rihlah',
    date: '28 Juli 2026',
    time: '07.00 - 16.00 WIB',
    location: 'Taman Bunga & Camping Ground Kebun Teh',
    description: 'Kegiatan tadabbur alam, rekreasi, dan tadarus outdoor untuk menyegarkan kembali semangat hafalan para santri.',
    photoUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800',
    createdAt: new Date().toISOString()
  }
];
