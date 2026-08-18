import { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AboutSection } from './components/AboutSection';
import { PaketSembako } from './components/PaketSembako';
import { CartDrawer } from './components/CartDrawer';
import { OrderReceiptModal } from './components/OrderReceiptModal';
import { Footer } from './components/Footer';
import { TahfidzSection } from './components/TahfidzSection';
import { KiosSedekahSection } from './components/KiosSedekahSection';
import { CustomPageView } from './components/CustomPageView';

import { db } from './services/db';
import { applyGlobalTheme } from './utils/theme';
import { Product, CartItem, OrderDetails, StoreInfo, SiteSettings, CustomPhoto, AdminUser, TahfidzProfile, Santri, KegiatanSantri, CustomPage, KiosSedekahProfile } from './types';
import { SlidersHorizontal, Tag, Info } from 'lucide-react';

// Panel Admin adalah komponen terbesar dan hanya dibutuhkan pengurus toko,
// jadi dimuat terpisah (lazy) agar halaman pembeli jauh lebih cepat dibuka.
const AdminPanel = lazy(() =>
  import('./components/AdminPanel').then((m) => ({ default: m.AdminPanel }))
);

const CART_STORAGE_KEY = 'tsbu_cart_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('catalog');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isWholesaleMode, setIsWholesaleMode] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc'>('popular');

  // Dynamic Database State
  const [products, setProducts] = useState<Product[]>(() => db.getProducts());
  const [storeInfo, setStoreInfo] = useState<StoreInfo>(() => db.getStoreInfo());
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => db.getSiteSettings());
  const [photos, setPhotos] = useState<CustomPhoto[]>(() => db.getPhotos());
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => db.getAdminUser());
  const [tahfidzProfile, setTahfidzProfile] = useState<TahfidzProfile>(() => db.getTahfidzProfile());
  const [santriList, setSantriList] = useState<Santri[]>(() => db.getSantriList());
  const [kegiatanList, setKegiatanList] = useState<KegiatanSantri[]>(() => db.getKegiatanList());
  const [customPages, setCustomPages] = useState<CustomPage[]>(() => db.getCustomPages());
  const [kiosSedekahProfile, setKiosSedekahProfile] = useState<KiosSedekahProfile>(() => db.getKiosSedekahProfile());

  // Shopping Cart & Modals State
  // Keranjang ikut disimpan di localStorage supaya tidak hilang saat halaman di-refresh.
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as CartItem[]) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);
  const [completedOrder, setCompletedOrder] = useState<OrderDetails | null>(null);

  // Simpan keranjang setiap kali berubah.
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      /* localStorage penuh / diblokir: abaikan saja. */
    }
  }, [cart]);

  // Terapkan tema setiap kali pengaturan tampilan berubah.
  useEffect(() => {
    applyGlobalTheme(siteSettings);
  }, [siteSettings]);

  // Sinkronkan state saat database berubah.
  // Catatan: dependency HARUS kosong. Sebelumnya memakai [siteSettings],
  // sehingga listener dilepas & dipasang ulang setiap kali pengaturan berubah.
  useEffect(() => {
    const unsubscribe = db.subscribe(() => {
      const updatedProducts = db.getProducts();
      const updatedStoreInfo = db.getStoreInfo();
      const updatedSiteSettings = db.getSiteSettings();
      const updatedPhotos = db.getPhotos();
      const updatedAdminUser = db.getAdminUser();
      const updatedTahfidzProfile = db.getTahfidzProfile();
      const updatedSantri = db.getSantriList();
      const updatedKegiatan = db.getKegiatanList();
      const updatedCustomPages = db.getCustomPages();
      const updatedKiosSedekahProfile = db.getKiosSedekahProfile();

      setProducts(updatedProducts);
      setStoreInfo(updatedStoreInfo);
      setSiteSettings(updatedSiteSettings);
      setPhotos(updatedPhotos);
      setAdminUser(updatedAdminUser);
      setTahfidzProfile(updatedTahfidzProfile);
      setSantriList(updatedSantri);
      setKegiatanList(updatedKegiatan);
      setCustomPages(updatedCustomPages);
      setKiosSedekahProfile(updatedKiosSedekahProfile);
    });

    return () => unsubscribe();
  }, []);

  // Update browser tab title & favicon to match the store's name and logo.
  useEffect(() => {
    document.title = storeInfo.name || 'Toko Sembako';

    const faviconUrl = siteSettings.storeLogoImage || tahfidzProfile.logoUrl;
    if (faviconUrl) {
      let link = document.getElementById('dynamic-favicon') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.id = 'dynamic-favicon';
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = faviconUrl;
    }
  }, [storeInfo.name, siteSettings.storeLogoImage, tahfidzProfile.logoUrl]);

  const categories = [
    { id: 'all', label: 'Semua Sembako' },
    { id: 'beras', label: '🌾 Beras & Padi' },
    { id: 'minyak', label: '🍶 Minyak Goreng' },
    { id: 'gula_telur', label: '🥚 Gula & Telur' },
    { id: 'tepung_bumbu', label: '🧂 Tepung & Bumbu' },
    { id: 'mie_makanan', label: '🍜 Mie & Makanan' },
    { id: 'susu_minuman', label: '🥛 Susu & Minuman' },
    { id: 'paket_hemat', label: '🎁 Paket Hemat' },
  ];

  // Cart Handlers
  // Satu produk bisa masuk keranjang dua kali (harga eceran & harga grosir),
  // jadi identitas baris keranjang = id produk + jenis harga.
  const handleAddToCart = (product: Product, quantity: number, unitType: 'eceran' | 'grosir') => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.product.id === product.id && item.selectedUnitType === unitType
      );

      if (existingIndex > -1) {
        // Salin objeknya, jangan diubah langsung (menghindari mutasi state).
        return prevCart.map((item, idx) =>
          idx === existingIndex ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevCart, { product, quantity, selectedUnitType: unitType }];
    });
  };

  const handleUpdateCartQuantity = (
    productId: string,
    unitType: 'eceran' | 'grosir',
    quantity: number
  ) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId, unitType);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId && item.selectedUnitType === unitType
          ? { ...item, quantity }
          : item
      )
    );
  };

  const handleRemoveCartItem = (productId: string, unitType: 'eceran' | 'grosir') => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) => !(item.product.id === productId && item.selectedUnitType === unitType)
      )
    );
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleCompleteOrder = (orderDetails: OrderDetails) => {
    db.addOrder(orderDetails);
    setCompletedOrder(orderDetails);
    setCart([]);
    setIsCartOpen(false);
  };

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.unit.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      const getPrice = (p: Product) =>
        isWholesaleMode && p.wholesalePrice ? p.wholesalePrice : (p.discountPrice || p.price);

      if (sortBy === 'price-asc') return getPrice(a) - getPrice(b);
      if (sortBy === 'price-desc') return getPrice(b) - getPrice(a);
      // 'popular' default sorting
      if (a.isBestSeller && !b.isBestSeller) return -1;
      if (!a.isBestSeller && b.isBestSeller) return 1;
      return 0;
    });
  }, [products, selectedCategory, searchQuery, isWholesaleMode, sortBy]);

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-neutral-50 text-neutral-900 font-sans flex flex-col justify-between selection:bg-emerald-200 selection:text-emerald-900">
      <div className="w-full">
        {/* Navigation Bar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          cartItemCount={totalCartCount}
          setIsCartOpen={setIsCartOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isWholesaleMode={isWholesaleMode}
          setIsWholesaleMode={setIsWholesaleMode}
          siteSettings={siteSettings}
          storeInfo={storeInfo}
          adminUser={adminUser}
          tahfidzProfile={tahfidzProfile}
          customPages={customPages}
        />

        {/* Main Content Area */}
        <main className="w-full max-w-7xl mx-auto px-4 sm:px-6">
          {activeTab === 'catalog' && (
            <div className="space-y-8 pb-12">
              {/* Hero Banner */}
              <HeroBanner
                onExploreClick={() => {
                  const el = document.getElementById('catalog-grid');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                onAboutClick={() => setActiveTab('about')}
                isWholesaleMode={isWholesaleMode}
                setIsWholesaleMode={setIsWholesaleMode}
                storeInfo={storeInfo}
                siteSettings={siteSettings}
              />

              {/* Wholesale mode notification bar */}
              {isWholesaleMode && (
                <div className="p-4 bg-amber-500 text-neutral-950 rounded-2xl flex items-center justify-between gap-4 font-medium text-xs sm:text-sm shadow-xs border border-amber-600">
                  <div className="flex items-center gap-2">
                    <Tag className="w-5 h-5 shrink-0" />
                    <span>
                      <strong>Mode Grosir Aktif:</strong> Menampilkan perkiraan harga potongan grosir untuk pembelian per dus / per karung (min. pembelian 3-10 unit).
                    </span>
                  </div>
                  <button
                    onClick={() => setIsWholesaleMode(false)}
                    className="px-3 py-1 bg-neutral-950 text-white rounded-lg text-xs font-bold hover:bg-neutral-800 transition-colors shrink-0 cursor-pointer"
                  >
                    Kembali Eceran
                  </button>
                </div>
              )}

              {/* Category Pills & Sorting Bar */}
              <div id="catalog-grid" className="space-y-4 pt-2">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
                  {/* Category Pills */}
                  <div className="flex flex-wrap items-center gap-2 py-1">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                          selectedCategory === cat.id
                            ? 'bg-emerald-800 text-white shadow-xs'
                            : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Sort Filter */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                    <span className="text-xs text-neutral-500 font-medium flex items-center gap-1">
                      <SlidersHorizontal className="w-3.5 h-3.5" /> Urutkan:
                    </span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-white border border-neutral-200 rounded-lg px-3 py-1.5 text-xs font-medium text-neutral-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 cursor-pointer"
                    >
                      <option value="popular">Terfavorit / Terlaris</option>
                      <option value="price-asc">Harga Terendah</option>
                      <option value="price-desc">Harga Tertinggi</option>
                    </select>
                  </div>
                </div>

                {/* Product Results Counter */}
                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <span>
                    Menampilkan <strong>{filteredProducts.length}</strong> produk sembako
                    {searchQuery && ` untuk kata kunci "${searchQuery}"`}
                  </span>
                  {selectedCategory !== 'all' && (
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className="text-emerald-700 hover:underline font-semibold cursor-pointer"
                    >
                      Reset Kategori
                    </button>
                  )}
                </div>

                {/* Grid of Product Cards */}
                {filteredProducts.length === 0 ? (
                  <div className="py-16 text-center space-y-3 bg-white rounded-3xl border border-neutral-200 p-8">
                    <div className="w-12 h-12 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
                      <Info className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-neutral-800 text-base">
                      Produk Sembako Tidak Ditemukan
                    </h3>
                    <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                      Coba ubah kata kunci pencarian atau pilih kategori sembako yang berbeda.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('all');
                      }}
                      className="px-4 py-2 bg-emerald-800 text-white text-xs font-semibold rounded-xl hover:bg-emerald-900 transition-colors cursor-pointer"
                    >
                      Tampilkan Semua Sembako
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={handleAddToCart}
                        onOpenDetail={setSelectedProductDetail}
                        isWholesaleMode={isWholesaleMode}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tahfidz Section View */}
          {activeTab === 'tahfidz' && (
            <TahfidzSection
              tahfidzProfile={tahfidzProfile}
              santriList={santriList}
              kegiatanList={kegiatanList}
            />
          )}

          {/* Kios Sedekah Section View */}
          {activeTab === 'kios_sedekah' && (
            <KiosSedekahSection kiosSedekahProfile={kiosSedekahProfile} />
          )}

          {/* About Section View */}
          {activeTab === 'about' && <AboutSection storeInfo={storeInfo} photos={photos} siteSettings={siteSettings} />}

          {/* Packages View */}
          {activeTab === 'packages' && (
            <PaketSembako
              products={products}
              onAddToCart={handleAddToCart}
              onOpenDetail={setSelectedProductDetail}
            />
          )}

          {/* Admin / Login View */}
          {activeTab === 'admin' && (
            <Suspense
              fallback={
                <div className="py-24 text-center text-sm font-semibold text-neutral-500">
                  Memuat Panel Admin...
                </div>
              }
            >
              <AdminPanel
                adminUser={adminUser}
                siteSettings={siteSettings}
                storeInfo={storeInfo}
                products={products}
                photos={photos}
              />
            </Suspense>
          )}

          {/* Custom Page View (halaman tambahan buatan admin) */}
          {customPages.some((p) => p.id === activeTab) && (
            <CustomPageView page={customPages.find((p) => p.id === activeTab)!} />
          )}
        </main>
      </div>

      {/* Modals & Slide-over Drawers */}
      <ProductDetailModal
        product={selectedProductDetail}
        onClose={() => setSelectedProductDetail(null)}
        onAddToCart={handleAddToCart}
        isWholesaleMode={isWholesaleMode}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onCompleteOrder={handleCompleteOrder}
        storeInfo={storeInfo}
      />

      <OrderReceiptModal
        order={completedOrder}
        onClose={() => setCompletedOrder(null)}
        storeInfo={storeInfo}
      />

      {/* Footer */}
      <Footer onNavigateTab={setActiveTab} storeInfo={storeInfo} siteSettings={siteSettings} customPages={customPages} />
    </div>
  );
}

