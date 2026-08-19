export interface Product {
  id: string;
  name: string;
  category: 'beras' | 'minyak' | 'gula_telur' | 'tepung_bumbu' | 'susu_minuman' | 'mie_makanan' | 'paket_hemat';
  price: number;
  wholesalePrice?: number;
  minWholesaleQty?: number;
  unit: string;
  stock: number;
  image: string;
  description: string;
  isBestSeller?: boolean;
  isPromo?: boolean;
  discountPrice?: number;
  badge?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedUnitType: 'eceran' | 'grosir';
}

export interface StoreInfo {
  name: string;
  tagline: string;
  description: string;
  established: number;
  address: string;
  phone: string;
  whatsapp: string;
  operatingHours: string;
  deliveryRange: string;
  storeStatus: 'buka' | 'tutup';
  /** 'otomatis' = status BUKA/TUTUP dihitung sendiri dari jam & hari di bawah ini.
   *  'manual' = memakai nilai storeStatus yang diatur admin secara manual. */
  statusMode: 'otomatis' | 'manual';
  /** Jam buka & tutup format 24 jam "HH:mm", contoh "07:30". Dipakai saat statusMode = 'otomatis'. */
  openTime: string;
  closeTime: string;
  /** Hari libur toko (0 = Minggu ... 6 = Sabtu). Kosong berarti buka setiap hari. */
  closedDays: number[];
  advantages: {
    title: string;
    desc: string;
    icon: string;
  }[];
  faq: {
    question: string;
    answer: string;
  }[];
}

export interface OrderDetails {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  deliveryType: 'delivery' | 'pickup';
  paymentMethod: 'cod' | 'qris' | 'transfer';
  items: CartItem[];
  totalAmount: number;
  date: string;
  status: 'Menunggu Konfirmasi' | 'Diproses' | 'Siap Diantar' | 'Selesai';
  notes?: string;
}

export type FontFamilyType = 'Plus Jakarta Sans' | 'Inter' | 'Poppins' | 'Playfair Display' | 'Roboto' | 'Comic Neue';
export type FontSizeScale = 'sm' | 'md' | 'lg' | 'xl';
export type PrimaryColorTheme = 'emerald' | 'teal' | 'amber' | 'blue' | 'indigo' | 'rose';

export interface NavLabels {
  catalog: string;
  tahfidz: string;
  tahfidzBadge: string;
  kiosSedekah: string;
  kiosSedekahBadge: string;
  about: string;
  packages: string;
  packagesBadge: string;
  aiUstadz: string;
  aiUstadzBadge: string;
  cart: string;
  admin: string;
}

export type NavItemKey = 'catalog' | 'tahfidz' | 'kios_sedekah' | 'about' | 'packages' | 'ai_ustadz';

export interface NavItemConfig {
  key: NavItemKey;
  visible: boolean;
}

/** Nama-nama ikon lucide-react yang boleh dipakai pada 3 kotak keunggulan banner utama. */
export type HeroFeatureIconName =
  | 'Tag'
  | 'Truck'
  | 'ShieldCheck'
  | 'Star'
  | 'Award'
  | 'Gift'
  | 'Clock'
  | 'Heart'
  | 'Percent'
  | 'CreditCard'
  | 'PackageCheck'
  | 'Sparkles'
  | 'Leaf'
  | 'Wallet'
  | 'ThumbsUp'
  | 'ShoppingBag'
  | 'BadgeCheck'
  | 'Handshake';

export interface HeroContent {
  badgeText: string;
  feature1Label: string;
  feature1Value: string;
  feature1Icon: HeroFeatureIconName;
  feature2Label: string;
  feature2Value: string;
  feature2Icon: HeroFeatureIconName;
  feature3Label: string;
  feature3Value: string;
  feature3Icon: HeroFeatureIconName;
  primaryButtonText: string;
  secondaryButtonText: string;
}

/** Pengaturan fitur "AI Ustadz" (chatbot tanya-jawab keislaman + direktori 114 surat Al-Qur'an). */
export interface AiUstadzSettings {
  /** Tampilkan atau sembunyikan fitur AI Ustadz secara keseluruhan. */
  enabled: boolean;
  /** API Key Google Gemini milik admin. Disimpan & dikirim dari sisi browser (client-side), sama seperti kunci Cloudinary/Firebase lain di aplikasi ini. */
  apiKey: string;
  /** Nama model Gemini yang dipakai, mis. 'gemini-2.5-flash'. */
  model: string;
  /** Instruksi/persona sistem untuk AI, menentukan gaya jawab Ustadz AI. */
  systemPrompt: string;
}

export interface FooterContent {
  aboutText: string;
  commodities: string[];
  bottomTagline: string;
}

export interface AboutPageContent {
  badgeText: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
}

export interface SiteSettings {
  fontFamily: FontFamilyType;
  fontSize: FontSizeScale;
  primaryColor: PrimaryColorTheme;
  heroTitle: string;
  heroSubtitle: string;
  heroBannerImage: string;
  storeLogoImage: string;
  /** URL video (disimpan di Firebase Storage) yang ditampilkan di banner utama halaman depan. Kosong = tidak ada video. */
  heroVideoUrl?: string;
  navLabels: NavLabels;
  navOrder: NavItemConfig[];
  heroContent: HeroContent;
  footerContent: FooterContent;
  aboutPageContent: AboutPageContent;
  aiUstadz: AiUstadzSettings;
}

export interface CustomPhoto {
  id: string;
  title: string;
  url: string;
  category: string; // e.g., 'galeri_toko', 'hero', 'tentang_toko', 'promosi'
  description?: string;
  createdAt: string;
}

export interface AdminUser {
  email: string;
  name: string;
  role: 'admin';
  isLoggedIn: boolean;
  loginTime?: string;
}

export interface TahfidzProfile {
  name: string;
  tagline: string;
  logoUrl: string;
  profilText: string;
  visi: string;
  misi: string[];
  address: string;
  phone: string;
  whatsapp: string;
  pengasuh: string;
  establishedYear: number;
}

export interface Santri {
  id: string;
  nis: string;
  name: string;
  gender: 'L' | 'P';
  age: number;
  hafalanJuz: number;
  status: 'Aktif' | 'Mutqin' | 'Lulus';
  wali: string;
  phoneWali?: string;
  photoUrl: string;
  joinedDate: string;
  notes?: string;
}

export interface CustomPage {
  id: string;
  title: string;
  content: string;
  icon?: string; // optional emoji shown next to the nav link
  createdAt: string;
}

export interface KegiatanSantri {
  id: string;
  title: string;
  category: 'Setoran Hafalan' | 'Munaqasyah' | 'Kajian' | 'Rihlah' | 'Kegiatan Harian' | 'Bakti Sosial';
  date: string;
  time?: string;
  location?: string;
  description: string;
  photoUrl: string;
  /** Video dokumentasi kegiatan (opsional). Kalau diisi, video ditampilkan menggantikan foto di halaman publik. */
  videoUrl?: string;
  createdAt: string;
}

export interface KiosSedekahPhoto {
  id: string;
  url: string;
  caption: string;
}

export interface KiosSedekahProfile {
  name: string;
  tagline: string;
  logoUrl: string;
  description: string;
  programs: string[];
  address: string;
  phone: string;
  whatsapp: string;
  penanggungJawab: string;
  photos: KiosSedekahPhoto[];
}

