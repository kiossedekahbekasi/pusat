import { Product, StoreInfo, SiteSettings, CustomPhoto, AdminUser, OrderDetails, TahfidzProfile, Santri, KegiatanSantri, CustomPage, KiosSedekahProfile } from '../types';
import { INITIAL_PRODUCTS, STORE_INFO } from '../data/storeData';
import { DEFAULT_TAHFIDZ_PROFILE, DEFAULT_SANTRI_LIST, DEFAULT_KEGIATAN_LIST } from '../data/tahfidzData';
import { DEFAULT_KIOS_SEDEKAH_PROFILE } from '../data/kiosSedekahData';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { firestore, auth } from '../lib/firebase';

const KEYS = {
  PRODUCTS: 'tsbu_db_products_v1',
  STORE_INFO: 'tsbu_db_store_info_v1',
  SETTINGS: 'tsbu_db_settings_v1',
  PHOTOS: 'tsbu_db_photos_v1',
  ADMIN_USER: 'tsbu_db_admin_user_v1',
  ORDERS: 'tsbu_db_orders_v1',
  TAHFIDZ_PROFILE: 'tsbu_db_tahfidz_profile_v1',
  SANTRI: 'tsbu_db_santri_v1',
  KEGIATAN: 'tsbu_db_kegiatan_v1',
  CUSTOM_PAGES: 'tsbu_db_custom_pages_v1',
  KIOS_SEDEKAH: 'tsbu_db_kios_sedekah_v1',
};

// Helper to sync to Firestore in background
const saveToFirestore = async (docName: string, data: any) => {
  try {
    const docRef = doc(firestore, 'store_data', docName);
    await setDoc(docRef, { data, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (err) {
    console.warn(`Firestore sync skipped for ${docName}:`, err);
  }
};

// Initial sync to ensure collections are populated in Firestore
if (typeof window !== 'undefined') {
  setTimeout(() => {
    try {
      saveToFirestore('products', JSON.parse(localStorage.getItem(KEYS.PRODUCTS) || JSON.stringify(INITIAL_PRODUCTS)));
      saveToFirestore('storeInfo', JSON.parse(localStorage.getItem(KEYS.STORE_INFO) || JSON.stringify(STORE_INFO)));
      saveToFirestore('settings', JSON.parse(localStorage.getItem(KEYS.SETTINGS) || JSON.stringify(DEFAULT_SITE_SETTINGS)));
      saveToFirestore('photos', JSON.parse(localStorage.getItem(KEYS.PHOTOS) || JSON.stringify(DEFAULT_PHOTOS)));
      saveToFirestore('orders', JSON.parse(localStorage.getItem(KEYS.ORDERS) || JSON.stringify(DEFAULT_ORDERS)));
      saveToFirestore('tahfidzProfile', JSON.parse(localStorage.getItem(KEYS.TAHFIDZ_PROFILE) || JSON.stringify(DEFAULT_TAHFIDZ_PROFILE)));
      saveToFirestore('santri', JSON.parse(localStorage.getItem(KEYS.SANTRI) || JSON.stringify(DEFAULT_SANTRI_LIST)));
      saveToFirestore('kegiatan', JSON.parse(localStorage.getItem(KEYS.KEGIATAN) || JSON.stringify(DEFAULT_KEGIATAN_LIST)));
      saveToFirestore('customPages', JSON.parse(localStorage.getItem(KEYS.CUSTOM_PAGES) || '[]'));
      saveToFirestore('kiosSedekah', JSON.parse(localStorage.getItem(KEYS.KIOS_SEDEKAH) || JSON.stringify(DEFAULT_KIOS_SEDEKAH_PROFILE)));
    } catch (e) {
      console.warn('Initial Firestore sync error:', e);
    }
  }, 1000);
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  fontFamily: 'Plus Jakarta Sans',
  fontSize: 'md',
  primaryColor: 'emerald',
  heroTitle: 'Toko Sembako Lengkap, Murah & Terpercaya',
  heroSubtitle: 'Menyediakan Beras, Minyak, Gula, Telur, Mie & Kebutuhan Pokok Dapur Eceran & Grosir Harga Distributor.',
  heroBannerImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200',
  storeLogoImage: '',
  navLabels: {
    catalog: 'Katalog Sembako',
    tahfidz: "Rumah Tahfidz Nurul A'laa",
    tahfidzBadge: 'Baru',
    about: 'Tentang Toko Sembako',
    packages: 'Paket Hemat & Promo',
    packagesBadge: 'Hemat',
    cart: 'Keranjang',
    admin: 'Halaman Login / Admin',
    kiosSedekah: 'Kios Sedekah',
    kiosSedekahBadge: '',
  },
  navOrder: [
    { key: 'catalog', visible: true },
    { key: 'tahfidz', visible: true },
    { key: 'about', visible: true },
    { key: 'kios_sedekah', visible: true },
    { key: 'packages', visible: true },
  ],
  heroContent: {
    badgeText: 'Pusat Sembilan Bahan Pokok Resmi & Terpercaya',
    feature1Label: 'Harga Jujur',
    feature1Value: 'Ecer & Grosir',
    feature2Label: 'Pengiriman',
    feature2Value: 'Hari Yang Sama',
    feature3Label: 'Kualitas',
    feature3Value: '100% Asli & Fresh',
    primaryButtonText: 'Lihat Katalog Sembako',
    secondaryButtonText: 'Tentang Toko Kami',
  },
  footerContent: {
    aboutText: 'Melayani pasokan sembako eceran dan grosir partai besar dengan timbangan jujur dan harga terjangkau.',
    commodities: [
      'Beras Pandan Wangi & Ramos',
      'Minyak Goreng Pouch 1L & 2L',
      'Gula Pasir & Pemani Murni',
      'Telur Ayam Negeri Segar',
      'Tepung Terigu & Tapioka',
      'Mie Instan Dus & Eceran',
    ],
    bottomTagline: 'Dibuat untuk melayani kebutuhan pokok keluarga Indonesia',
  },
  aboutPageContent: {
    badgeText: 'Profil Toko Sembako Resmi',
    stat1Value: '12+ Tahun',
    stat1Label: 'Pengalaman Melayani',
    stat2Value: '2.500+',
    stat2Label: 'Pelanggan Setia Harian',
    stat3Value: '100% Asli',
    stat3Label: 'Sembako Bersertifikat',
  },
};

export const DEFAULT_PHOTOS: CustomPhoto[] = [
  {
    id: 'photo-1',
    title: 'Gudang Stok Berkas & Minyak',
    url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800',
    category: 'galeri_toko',
    description: 'Stok beras segar langsung dari penggilingan padi terpercaya.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'photo-2',
    title: 'Pelayanan Ramah Toko Sembako',
    url: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=800',
    category: 'tentang_toko',
    description: 'Petugas siap membantu penimbangan dan pemuatan barang belanjaan Anda.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'photo-3',
    title: 'Pengiriman Kurir Cepat Toko',
    url: 'https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?auto=format&fit=crop&q=80&w=800',
    category: 'pengiriman',
    description: 'Armada pengiriman langsung sampai ke warung / rumah Anda.',
    createdAt: new Date().toISOString(),
  },
];

export const DEFAULT_ORDERS: OrderDetails[] = [
  {
    id: 'SBK-829104',
    customerName: 'Ibu Rahmawati',
    phone: '081234567890',
    address: 'Jl. Melati No. 12, RT 03/RW 05, Bekasi Timur',
    deliveryType: 'delivery',
    paymentMethod: 'cod',
    items: [
      {
        product: INITIAL_PRODUCTS[0],
        quantity: 2,
        selectedUnitType: 'eceran',
      },
      {
        product: INITIAL_PRODUCTS[1],
        quantity: 3,
        selectedUnitType: 'eceran',
      },
    ],
    totalAmount: 261000,
    date: '9 Agustus 2026, 14:30',
    status: 'Menunggu Konfirmasi',
    notes: 'Mohon diantar sebelum jam 5 sore ya, mas.',
  },
  {
    id: 'SBK-541290',
    customerName: 'Bapak H. Darmawan (Warung Madura)',
    phone: '085711223344',
    address: 'Warung Kelontong Berkah, Ruko Grand Galaxy Blok B2',
    deliveryType: 'delivery',
    paymentMethod: 'transfer',
    items: [
      {
        product: INITIAL_PRODUCTS[0],
        quantity: 10,
        selectedUnitType: 'grosir',
      },
      {
        product: INITIAL_PRODUCTS[2],
        quantity: 20,
        selectedUnitType: 'grosir',
      },
    ],
    totalAmount: 1020000,
    date: '9 Agustus 2026, 11:15',
    status: 'Diproses',
    notes: 'Nota di lampirkan cap toko untuk laporan pembukuan.',
  },
  {
    id: 'SBK-319082',
    customerName: 'Siti Nurhaliza',
    phone: '081987654321',
    address: 'Ambil Langsung di Toko Sembako Berkah Utama',
    deliveryType: 'pickup',
    paymentMethod: 'qris',
    items: [
      {
        product: INITIAL_PRODUCTS[7],
        quantity: 1,
        selectedUnitType: 'eceran',
      },
    ],
    totalAmount: 110000,
    date: '8 Agustus 2026, 16:45',
    status: 'Selesai',
    notes: 'Sudah lunas via QRIS.',
  },
];

// Helper to notify listeners of DB updates
const notifyDBChange = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('tsbu-db-updated'));
  }
};

// Keep local "logged in" state in sync with the real Firebase Auth session.
// If the Firebase session is invalid/expired/signed-out elsewhere, this
// clears the local admin flag too, so the UI can't show a stale logged-in state.
if (typeof window !== 'undefined') {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      localStorage.removeItem(KEYS.ADMIN_USER);
      notifyDBChange();
    }
  });
}

// Setup automatic real-time listener from Firestore
if (typeof window !== 'undefined') {
  const collectionsToSync = ['products', 'storeInfo', 'settings', 'photos', 'orders', 'tahfidzProfile', 'santri', 'kegiatan', 'customPages', 'kiosSedekah'];
  collectionsToSync.forEach((key) => {
    try {
      const docRef = doc(firestore, 'store_data', key);
      onSnapshot(
        docRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const remoteData = snapshot.data()?.data;
            if (remoteData) {
              const localKeyMap: Record<string, string> = {
                products: KEYS.PRODUCTS,
                storeInfo: KEYS.STORE_INFO,
                settings: KEYS.SETTINGS,
                photos: KEYS.PHOTOS,
                orders: KEYS.ORDERS,
                tahfidzProfile: KEYS.TAHFIDZ_PROFILE,
                santri: KEYS.SANTRI,
                kegiatan: KEYS.KEGIATAN,
                customPages: KEYS.CUSTOM_PAGES,
                kiosSedekah: KEYS.KIOS_SEDEKAH,
              };
              const storageKey = localKeyMap[key];
              if (storageKey) {
                localStorage.setItem(storageKey, JSON.stringify(remoteData));
                notifyDBChange();
              }
            }
          }
        },
        (err) => {
          console.warn(`Firestore listener info on ${key}:`, err);
        }
      );
    } catch (e) {
      console.warn(`Failed to attach Firestore listener for ${key}`, e);
    }
  });
}

export const db = {
  // PRODUCTS
  getProducts(): Product[] {
    try {
      const data = localStorage.getItem(KEYS.PRODUCTS);
      if (!data) {
        localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
        saveToFirestore('products', INITIAL_PRODUCTS);
        return INITIAL_PRODUCTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_PRODUCTS;
    }
  },

  saveProducts(products: Product[]): void {
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
    saveToFirestore('products', products);
    notifyDBChange();
  },

  addProduct(product: Omit<Product, 'id'>): Product {
    const products = this.getProducts();
    const newProduct: Product = {
      ...product,
      id: `p_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    const updated = [newProduct, ...products];
    this.saveProducts(updated);
    return newProduct;
  },

  updateProduct(id: string, updatedFields: Partial<Product>): void {
    const products = this.getProducts();
    const updated = products.map((p) => (p.id === id ? { ...p, ...updatedFields } : p));
    this.saveProducts(updated);
  },

  deleteProduct(id: string): void {
    const products = this.getProducts();
    const updated = products.filter((p) => p.id !== id);
    this.saveProducts(updated);
  },

  // STORE INFO
  getStoreInfo(): StoreInfo {
    try {
      const data = localStorage.getItem(KEYS.STORE_INFO);
      if (!data) {
        localStorage.setItem(KEYS.STORE_INFO, JSON.stringify(STORE_INFO));
        return STORE_INFO;
      }
      return { ...STORE_INFO, ...JSON.parse(data) };
    } catch {
      return STORE_INFO;
    }
  },

  saveStoreInfo(info: StoreInfo): void {
    localStorage.setItem(KEYS.STORE_INFO, JSON.stringify(info));
    saveToFirestore('storeInfo', info);
    notifyDBChange();
  },

  // SITE SETTINGS (Font, Color, Images, Titles)
  getSiteSettings(): SiteSettings {
    try {
      const data = localStorage.getItem(KEYS.SETTINGS);
      if (!data) {
        localStorage.setItem(KEYS.SETTINGS, JSON.stringify(DEFAULT_SITE_SETTINGS));
        saveToFirestore('settings', DEFAULT_SITE_SETTINGS);
        return DEFAULT_SITE_SETTINGS;
      }
      const parsed = JSON.parse(data);
      return {
        ...DEFAULT_SITE_SETTINGS,
        ...parsed,
        navLabels: { ...DEFAULT_SITE_SETTINGS.navLabels, ...(parsed.navLabels || {}) },
        navOrder: parsed.navOrder && Array.isArray(parsed.navOrder) && parsed.navOrder.length > 0 ? parsed.navOrder : DEFAULT_SITE_SETTINGS.navOrder,
        heroContent: { ...DEFAULT_SITE_SETTINGS.heroContent, ...(parsed.heroContent || {}) },
        footerContent: { ...DEFAULT_SITE_SETTINGS.footerContent, ...(parsed.footerContent || {}) },
        aboutPageContent: { ...DEFAULT_SITE_SETTINGS.aboutPageContent, ...(parsed.aboutPageContent || {}) },
      };
    } catch {
      return DEFAULT_SITE_SETTINGS;
    }
  },

  saveSiteSettings(settings: Partial<SiteSettings>): void {
    const current = this.getSiteSettings();
    const updated = {
      ...current,
      ...settings,
      navLabels: { ...current.navLabels, ...(settings.navLabels || {}) },
      navOrder: settings.navOrder && settings.navOrder.length > 0 ? settings.navOrder : current.navOrder,
      heroContent: { ...current.heroContent, ...(settings.heroContent || {}) },
      footerContent: { ...current.footerContent, ...(settings.footerContent || {}) },
      aboutPageContent: { ...current.aboutPageContent, ...(settings.aboutPageContent || {}) },
    };
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(updated));
    saveToFirestore('settings', updated);
    notifyDBChange();
  },

  // CUSTOM PHOTOS
  getPhotos(): CustomPhoto[] {
    try {
      const data = localStorage.getItem(KEYS.PHOTOS);
      if (!data) {
        localStorage.setItem(KEYS.PHOTOS, JSON.stringify(DEFAULT_PHOTOS));
        saveToFirestore('photos', DEFAULT_PHOTOS);
        return DEFAULT_PHOTOS;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_PHOTOS;
    }
  },

  addPhoto(photo: Omit<CustomPhoto, 'id' | 'createdAt'>): CustomPhoto {
    const photos = this.getPhotos();
    const newPhoto: CustomPhoto = {
      ...photo,
      id: `photo_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newPhoto, ...photos];
    localStorage.setItem(KEYS.PHOTOS, JSON.stringify(updated));
    saveToFirestore('photos', updated);
    notifyDBChange();
    return newPhoto;
  },

  deletePhoto(id: string): void {
    const photos = this.getPhotos();
    const updated = photos.filter((p) => p.id !== id);
    localStorage.setItem(KEYS.PHOTOS, JSON.stringify(updated));
    saveToFirestore('photos', updated);
    notifyDBChange();
  },

  // AUTHENTICATION
  getAdminUser(): AdminUser | null {
    try {
      const data = localStorage.getItem(KEYS.ADMIN_USER);
      if (!data) return null;
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  // Login admin sungguhan lewat Firebase Authentication.
  // Melempar error kalau email/password salah, akun tidak ada, dsb —
  // AdminPanel harus menangkap error ini dan menampilkannya ke user.
  async loginAdmin(email: string, password: string): Promise<AdminUser> {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const nameFromEmail = email.split('@')[0] || 'Admin Toko';
    const admin: AdminUser = {
      email: credential.user.email || email,
      name: nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1),
      role: 'admin',
      isLoggedIn: true,
      loginTime: new Date().toLocaleString('id-ID'),
    };
    localStorage.setItem(KEYS.ADMIN_USER, JSON.stringify(admin));
    notifyDBChange();
    return admin;
  },

  async logoutAdmin(): Promise<void> {
    await signOut(auth);
    localStorage.removeItem(KEYS.ADMIN_USER);
    notifyDBChange();
  },

  // ORDERS
  getOrders(): OrderDetails[] {
    try {
      const data = localStorage.getItem(KEYS.ORDERS);
      if (!data) {
        localStorage.setItem(KEYS.ORDERS, JSON.stringify(DEFAULT_ORDERS));
        return DEFAULT_ORDERS;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_ORDERS;
    }
  },

  saveOrders(orders: OrderDetails[]): void {
    localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
    saveToFirestore('orders', orders);
    notifyDBChange();
  },

  addOrder(order: OrderDetails): void {
    const orders = this.getOrders();
    const updated = [order, ...orders];
    this.saveOrders(updated);
  },

  updateOrderStatus(orderId: string, status: OrderDetails['status']): void {
    const orders = this.getOrders();
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
    this.saveOrders(updated);
  },

  deleteOrder(orderId: string): void {
    const orders = this.getOrders();
    const updated = orders.filter((o) => o.id !== orderId);
    this.saveOrders(updated);
  },

  // TAHFIDZ PROFILE
  getTahfidzProfile(): TahfidzProfile {
    try {
      const data = localStorage.getItem(KEYS.TAHFIDZ_PROFILE);
      if (!data) {
        localStorage.setItem(KEYS.TAHFIDZ_PROFILE, JSON.stringify(DEFAULT_TAHFIDZ_PROFILE));
        saveToFirestore('tahfidzProfile', DEFAULT_TAHFIDZ_PROFILE);
        return DEFAULT_TAHFIDZ_PROFILE;
      }
      return { ...DEFAULT_TAHFIDZ_PROFILE, ...JSON.parse(data) };
    } catch {
      return DEFAULT_TAHFIDZ_PROFILE;
    }
  },

  saveTahfidzProfile(profile: Partial<TahfidzProfile>): void {
    const current = this.getTahfidzProfile();
    const updated = { ...current, ...profile };
    localStorage.setItem(KEYS.TAHFIDZ_PROFILE, JSON.stringify(updated));
    saveToFirestore('tahfidzProfile', updated);
    notifyDBChange();
  },

  // SANTRI LIST
  getSantriList(): Santri[] {
    try {
      const data = localStorage.getItem(KEYS.SANTRI);
      if (!data) {
        localStorage.setItem(KEYS.SANTRI, JSON.stringify(DEFAULT_SANTRI_LIST));
        saveToFirestore('santri', DEFAULT_SANTRI_LIST);
        return DEFAULT_SANTRI_LIST;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_SANTRI_LIST;
    }
  },

  saveSantriList(list: Santri[]): void {
    localStorage.setItem(KEYS.SANTRI, JSON.stringify(list));
    saveToFirestore('santri', list);
    notifyDBChange();
  },

  addSantri(item: Omit<Santri, 'id'>): Santri {
    const list = this.getSantriList();
    const newItem: Santri = {
      ...item,
      id: `snt-${Date.now()}`,
    };
    const updated = [newItem, ...list];
    this.saveSantriList(updated);
    return newItem;
  },

  updateSantri(item: Santri): void {
    const list = this.getSantriList();
    const updated = list.map((s) => (s.id === item.id ? item : s));
    this.saveSantriList(updated);
  },

  deleteSantri(id: string): void {
    const list = this.getSantriList();
    const updated = list.filter((s) => s.id !== id);
    this.saveSantriList(updated);
  },

  // KEGIATAN SANTRI
  getKegiatanList(): KegiatanSantri[] {
    try {
      const data = localStorage.getItem(KEYS.KEGIATAN);
      if (!data) {
        localStorage.setItem(KEYS.KEGIATAN, JSON.stringify(DEFAULT_KEGIATAN_LIST));
        saveToFirestore('kegiatan', DEFAULT_KEGIATAN_LIST);
        return DEFAULT_KEGIATAN_LIST;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_KEGIATAN_LIST;
    }
  },

  saveKegiatanList(list: KegiatanSantri[]): void {
    localStorage.setItem(KEYS.KEGIATAN, JSON.stringify(list));
    saveToFirestore('kegiatan', list);
    notifyDBChange();
  },

  addKegiatan(item: Omit<KegiatanSantri, 'id' | 'createdAt'>): KegiatanSantri {
    const list = this.getKegiatanList();
    const newItem: KegiatanSantri = {
      ...item,
      id: `kgt-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newItem, ...list];
    this.saveKegiatanList(updated);
    return newItem;
  },

  updateKegiatan(item: KegiatanSantri): void {
    const list = this.getKegiatanList();
    const updated = list.map((k) => (k.id === item.id ? item : k));
    this.saveKegiatanList(updated);
  },

  deleteKegiatan(id: string): void {
    const list = this.getKegiatanList();
    const updated = list.filter((k) => k.id !== id);
    this.saveKegiatanList(updated);
  },

  // CUSTOM PAGES (halaman tambahan yang bisa dibuat admin)
  getCustomPages(): CustomPage[] {
    try {
      const data = localStorage.getItem(KEYS.CUSTOM_PAGES);
      if (!data) {
        localStorage.setItem(KEYS.CUSTOM_PAGES, JSON.stringify([]));
        return [];
      }
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveCustomPages(list: CustomPage[]): void {
    localStorage.setItem(KEYS.CUSTOM_PAGES, JSON.stringify(list));
    saveToFirestore('customPages', list);
    notifyDBChange();
  },

  addCustomPage(item: Omit<CustomPage, 'id' | 'createdAt'>): CustomPage {
    const list = this.getCustomPages();
    const newItem: CustomPage = {
      ...item,
      id: `page-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [...list, newItem];
    this.saveCustomPages(updated);
    return newItem;
  },

  updateCustomPage(item: CustomPage): void {
    const list = this.getCustomPages();
    const updated = list.map((p) => (p.id === item.id ? item : p));
    this.saveCustomPages(updated);
  },

  deleteCustomPage(id: string): void {
    const list = this.getCustomPages();
    const updated = list.filter((p) => p.id !== id);
    this.saveCustomPages(updated);
  },

  // KIOS SEDEKAH PROFILE
  getKiosSedekahProfile(): KiosSedekahProfile {
    try {
      const data = localStorage.getItem(KEYS.KIOS_SEDEKAH);
      if (!data) {
        localStorage.setItem(KEYS.KIOS_SEDEKAH, JSON.stringify(DEFAULT_KIOS_SEDEKAH_PROFILE));
        saveToFirestore('kiosSedekah', DEFAULT_KIOS_SEDEKAH_PROFILE);
        return DEFAULT_KIOS_SEDEKAH_PROFILE;
      }
      return { ...DEFAULT_KIOS_SEDEKAH_PROFILE, ...JSON.parse(data) };
    } catch {
      return DEFAULT_KIOS_SEDEKAH_PROFILE;
    }
  },

  saveKiosSedekahProfile(profile: Partial<KiosSedekahProfile>): void {
    const current = this.getKiosSedekahProfile();
    const updated = { ...current, ...profile };
    localStorage.setItem(KEYS.KIOS_SEDEKAH, JSON.stringify(updated));
    saveToFirestore('kiosSedekah', updated);
    notifyDBChange();
  },

  // RESET DATABASE
  resetToDefaults(): void {
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem(KEYS.STORE_INFO, JSON.stringify(STORE_INFO));
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(DEFAULT_SITE_SETTINGS));
    localStorage.setItem(KEYS.PHOTOS, JSON.stringify(DEFAULT_PHOTOS));
    localStorage.setItem(KEYS.ORDERS, JSON.stringify(DEFAULT_ORDERS));
    localStorage.setItem(KEYS.TAHFIDZ_PROFILE, JSON.stringify(DEFAULT_TAHFIDZ_PROFILE));
    localStorage.setItem(KEYS.SANTRI, JSON.stringify(DEFAULT_SANTRI_LIST));
    localStorage.setItem(KEYS.KEGIATAN, JSON.stringify(DEFAULT_KEGIATAN_LIST));
    localStorage.setItem(KEYS.CUSTOM_PAGES, JSON.stringify([]));
    localStorage.setItem(KEYS.KIOS_SEDEKAH, JSON.stringify(DEFAULT_KIOS_SEDEKAH_PROFILE));
    saveToFirestore('products', INITIAL_PRODUCTS);
    saveToFirestore('storeInfo', STORE_INFO);
    saveToFirestore('settings', DEFAULT_SITE_SETTINGS);
    saveToFirestore('photos', DEFAULT_PHOTOS);
    saveToFirestore('orders', DEFAULT_ORDERS);
    saveToFirestore('tahfidzProfile', DEFAULT_TAHFIDZ_PROFILE);
    saveToFirestore('santri', DEFAULT_SANTRI_LIST);
    saveToFirestore('kegiatan', DEFAULT_KEGIATAN_LIST);
    saveToFirestore('customPages', []);
    saveToFirestore('kiosSedekah', DEFAULT_KIOS_SEDEKAH_PROFILE);
    notifyDBChange();
  },

  // SUBSCRIBE TO CHANGES
  subscribe(callback: () => void): () => void {
    if (typeof window === 'undefined') return () => {};
    
    const handleUpdate = () => callback();
    window.addEventListener('tsbu-db-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('tsbu-db-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  },
};
