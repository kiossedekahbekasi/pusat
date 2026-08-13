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
  cart: string;
  admin: string;
}

export interface SiteSettings {
  fontFamily: FontFamilyType;
  fontSize: FontSizeScale;
  primaryColor: PrimaryColorTheme;
  heroTitle: string;
  heroSubtitle: string;
  heroBannerImage: string;
  storeLogoImage: string;
  navLabels: NavLabels;
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

