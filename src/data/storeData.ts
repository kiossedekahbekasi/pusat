import { Product, StoreInfo } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Beras Premium Pandan Wangi 5kg',
    category: 'beras',
    price: 78000,
    wholesalePrice: 73000,
    minWholesaleQty: 5,
    unit: 'Karung 5kg',
    stock: 45,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600',
    description: 'Beras Pandan Wangi asli Cianjur, wangi alami, pulen, bersih dari kutu dan batu.',
    isBestSeller: true,
    badge: 'Terlaris'
  },
  {
    id: 'p2',
    name: 'Beras Medium Ramos Super 10kg',
    category: 'beras',
    price: 145000,
    wholesalePrice: 138000,
    minWholesaleQty: 3,
    unit: 'Karung 10kg',
    stock: 30,
    image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&q=80&w=600',
    description: 'Beras Ramos pilihan keluarga, cocok untuk rumah tangga dan usaha katering.',
    isBestSeller: false,
  },
  {
    id: 'p3',
    name: 'Minyak Goreng Bimoli Pouch 2 Liter',
    category: 'minyak',
    price: 38000,
    wholesalePrice: 35500,
    minWholesaleQty: 6,
    unit: 'Pouch 2L',
    stock: 80,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=600',
    description: 'Minyak goreng kelapa sawit murni kualitas premium, membuat masakan renyah dan tidak cepat berjelantah.',
    isBestSeller: true,
    badge: 'Favorit'
  },
  {
    id: 'p4',
    name: 'Minyak Goreng SunCo 1 Liter',
    category: 'minyak',
    price: 19500,
    wholesalePrice: 18000,
    minWholesaleQty: 12,
    unit: 'Pouch 1L',
    stock: 120,
    image: 'https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?auto=format&fit=crop&q=80&w=600',
    description: 'Minyak bening tidak mudah beku, cair seperti air, aman untuk kesehatan keluarga.',
  },
  {
    id: 'p5',
    name: 'Gula Pasir Premium Gulaku 1kg',
    category: 'gula_telur',
    price: 17500,
    wholesalePrice: 16200,
    minWholesaleQty: 10,
    unit: 'Bungkus 1kg',
    stock: 150,
    image: 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?auto=format&fit=crop&q=80&w=600',
    description: 'Gula pasir kristal putih murni dari tebu alami, manis sempurna untuk teh dan olahan kue.',
    isBestSeller: true,
  },
  {
    id: 'p6',
    name: 'Telur Ayam Negeri Segar 1kg',
    category: 'gula_telur',
    price: 28500,
    wholesalePrice: 26500,
    minWholesaleQty: 5,
    unit: 'Kg (isi ~16 butir)',
    stock: 60,
    image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&q=80&w=600',
    description: 'Telur ayam peternakan lokal segar harian, cangkang tebal, tidak amis dan kaya nutrisi.',
    isBestSeller: true,
    badge: 'Segar Tiap Hari'
  },
  {
    id: 'p7',
    name: 'Tepung Terigu Segitiga Biru 1kg',
    category: 'tepung_bumbu',
    price: 13000,
    wholesalePrice: 11800,
    minWholesaleQty: 10,
    unit: 'Bungkus 1kg',
    stock: 95,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600',
    description: 'Tepung terigu protein sedang serbaguna, cocok untuk aneka martabak, kue, dan gorengan.',
  },
  {
    id: 'p8',
    name: 'Tepung Tapioka / Kanji Cap Pak Tani 500g',
    category: 'tepung_bumbu',
    price: 9500,
    wholesalePrice: 8500,
    minWholesaleQty: 10,
    unit: 'Bungkus 500g',
    stock: 75,
    image: 'https://images.unsplash.com/photo-1627483262268-9c2b5b2834b5?auto=format&fit=crop&q=80&w=600',
    description: 'Tepung tapioka berkualitas murni untuk cilok, cireng, pempek, dan kenyal olahan masakan.',
  },
  {
    id: 'p9',
    name: 'Indomie Goreng Spesial (1 Dus / 40 Pcs)',
    category: 'mie_makanan',
    price: 112000,
    wholesalePrice: 108000,
    minWholesaleQty: 3,
    unit: 'Karton / Dus',
    stock: 40,
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&q=80&w=600',
    description: 'Mie instan favorit Indonesia rasa goreng spesial legendaris, stok hemat untuk keluarga.',
    isBestSeller: true,
    badge: 'Harga Dusan'
  },
  {
    id: 'p10',
    name: 'Indomie Rasa Ayam Bawang (10 Pcs)',
    category: 'mie_makanan',
    price: 31000,
    wholesalePrice: 29000,
    minWholesaleQty: 5,
    unit: 'Paket 10 Pcs',
    stock: 65,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=600',
    description: 'Mie kuah aroma ayam bawang gurih hangat cocok untuk musim hujan.',
  },
  {
    id: 'p11',
    name: 'Susu Kental Manis Frisian Flag Cokelat 560g',
    category: 'susu_minuman',
    price: 18500,
    wholesalePrice: 17200,
    minWholesaleQty: 6,
    unit: 'Pouch 560g',
    stock: 50,
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=600',
    description: 'Susu kental manis lezat untuk pelengkap roti bakar, es campur, krimer kopi dan martabak.',
  },
  {
    id: 'p12',
    name: 'Teh Celup Sosro Box isi 30 Kantong',
    category: 'susu_minuman',
    price: 7500,
    wholesalePrice: 6800,
    minWholesaleQty: 10,
    unit: 'Kotak 30 kantong',
    stock: 110,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=600',
    description: 'Teh hitam pilihan aroma melati harum menenangkan.',
  },
  {
    id: 'p13',
    name: 'Paket Sembako Hemat Dapur (Beras 5kg + Minyak 2L + Gula 1kg)',
    category: 'paket_hemat',
    price: 132000,
    discountPrice: 125000,
    unit: '1 Paket Lengkap',
    stock: 25,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600',
    description: 'Paket super hemat kebutuhan pokok bulanan. Termasuk Beras Pandan Wangi 5kg, Minyak Goreng 2L, dan Gula 1kg.',
    isPromo: true,
    badge: 'Diskon 5%'
  },
  {
    id: 'p14',
    name: 'Paket Sembako Jum’at Berkah / Sedekah',
    category: 'paket_hemat',
    price: 65000,
    discountPrice: 59000,
    unit: '1 Paket Bingkisan',
    stock: 50,
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=600',
    description: 'Paket bungkusan rapi siap bagikan: Beras 2.5kg, Minyak 1L, Gula 500g, & Mie 3 Pcs. Gratis tas spunbond!',
    isPromo: true,
    badge: 'Paket Berkah'
  },
  {
    id: 'p15',
    name: 'Garam Dapur Beriodium Cap Kapal 500g',
    category: 'tepung_bumbu',
    price: 4500,
    wholesalePrice: 3800,
    minWholesaleQty: 10,
    unit: 'Bungkus 500g',
    stock: 200,
    image: 'https://images.unsplash.com/photo-1518110165367-210e7b8b4a02?auto=format&fit=crop&q=80&w=600',
    description: 'Garam halus beriodium tinggi murni untuk kelezatan masakan sehat.',
  },
  {
    id: 'p16',
    name: 'Kecap Manis Bango Pouch 520ml',
    category: 'tepung_bumbu',
    price: 24500,
    wholesalePrice: 22800,
    minWholesaleQty: 6,
    unit: 'Pouch 520ml',
    stock: 70,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=600',
    description: 'Kecap manis gurih hitam pekat dibuat dari kedelai hitam berkualitas tinggi Malika.',
  }
];

export const STORE_INFO: StoreInfo = {
  name: 'Toko Sembako Berkah Utama',
  tagline: 'Penyedia Sembilan Bahan Pokok Lengkap, Murah & Berkualitas',
  description: 'Toko Sembako Berkah Utama melayani kebutuhan sembako (sembilan bahan pokok) bagi masyarakat, rumah tangga, UMKM, warung makan, hingga katering. Kami melayani pembelian eceran dengan harga terjangkau serta harga grosir spesial untuk partai besar.',
  established: 2012,
  address: 'Jl. Raya Merdeka No. 88, RT 03/RW 05, Kel. Sukamaju, Kec. Jatiasih, Kota Bekasi 17425',
  phone: '0812-3456-7890',
  whatsapp: '6281234567890',
  operatingHours: 'Setiap Hari (Senin - Minggu): 06:00 - 21:00 WIB',
  deliveryRange: 'Pengiriman langsung (Lokal Toko / Kurir) radius hingga 15 Km & Pengiriman instan',
  storeStatus: 'buka',
  statusMode: 'otomatis',
  openTime: '06:00',
  closeTime: '21:00',
  closedDays: [],
  advantages: [
    {
      title: 'Harga Bersahabat (Ecer & Grosir)',
      desc: 'Harga bersaing langsung dari distributor utama, tersedia diskon potongan harga untuk pembelian grosir.',
      icon: 'Tag'
    },
    {
      title: 'Jaminan Kualitas & 100% Asli',
      desc: 'Beras pulen tanpa pemutih/pewangi buatan, telur segar harian, dan barang bermerek segel resmi.',
      icon: 'ShieldCheck'
    },
    {
      title: 'Pengiriman Cepat Hari Ini',
      desc: 'Pesan sebelum jam 16:00 WIB diantar langsung ke rumah atau warung Anda pada hari yang sama.',
      icon: 'Truck'
    },
    {
      title: 'Paket Hemat Sembako',
      desc: 'Tersedia paket sembako bulanan & paket sembako khusus sedekah / Jum’at Berkah berhadiah souvenir.',
      icon: 'Gift'
    }
  ],
  faq: [
    {
      question: 'Apa saja barang sembako yang dijual di Toko Sembako Berkah Utama?',
      answer: 'Kami menyediakan Sembilan Bahan Pokok (Sembako) meliputi beras premium & medium, minyak goreng berbagai merek, gula pasir, telur ayam segar, tepung terigu/tapioka, mie instan, susu kental manis/bubuk, garam, bumbu dapur, kecap, teh/kopi, serta paket sembako hemat.'
    },
    {
      question: 'Apakah bisa beli grosir untuk dijual kembali di warung?',
      answer: 'Sangat bisa! Kami memberikan potongan harga grosir khusus untuk pembelian minimal tertentu (misalnya beras per 5 karung, minyak per karton/dus, mie per dus). Anda dapat memilih mode harga grosir di aplikasi ini.'
    },
    {
      question: 'Bagaimana cara melakukan pemesanan & pembayaran?',
      answer: 'Anda dapat memilih barang ke keranjang belanja, tentukan metode kirim (Ambil di Toko atau Antar ke Rumah), lalu kirim pesanan secara otomatis via WhatsApp Toko atau lakukan konfirmasi langsung di aplikasi. Pembayaran bisa Tunai/COD saat barang tiba, QRIS, atau Transfer Bank.'
    },
    {
      question: 'Berapa biaya pengiriman dan berapa lama pengantarannya?',
      answer: 'Untuk radius < 3 Km dari toko kami memberikan GRATIS ONGKIR dengan minimal belanja Rp 100.000. Di bawah Rp 100.000 dikenakan ongkos kurir Rp 10.000, dan untuk jarak di luar radius 3 Km ongkos kirim dikonfirmasi petugas via WhatsApp. Pengiriman dilakukan oleh kurir internal toko dalam waktu 1-3 jam setelah konfirmasi.'
    },
    {
      question: 'Apakah melayani pemesanan paket sembako untuk acara / bansos / sedekah?',
      answer: 'Ya, kami melayani pemesanan paket sembako kustom sesuai budget (misal paket Rp 50rb, Rp 75rb, Rp 100rb) lengkap dengan tas kemasan spunbond / dus dan layanan antar lokasi acara.'
    }
  ]
};
