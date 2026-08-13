import React from 'react';
import { ShoppingBag, Search, Store, Info, Gift, PhoneCall, SlidersHorizontal, UserCheck, Shield, BookOpen } from 'lucide-react';
import { StoreInfo, AdminUser, SiteSettings, TahfidzProfile, CustomPage } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartItemCount: number;
  setIsCartOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isWholesaleMode: boolean;
  setIsWholesaleMode: (mode: boolean) => void;
  storeInfo: StoreInfo;
  adminUser: AdminUser | null;
  siteSettings: SiteSettings;
  tahfidzProfile?: TahfidzProfile;
  customPages?: CustomPage[];
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  cartItemCount,
  setIsCartOpen,
  searchQuery,
  setSearchQuery,
  isWholesaleMode,
  setIsWholesaleMode,
  storeInfo,
  adminUser,
  siteSettings,
  tahfidzProfile,
  customPages = [],
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-2xs">
      {/* Top Announcement Bar */}
      <div className="bg-emerald-800 text-emerald-50 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium">TOKO BUKA: {storeInfo.operatingHours}</span>
            <span className="hidden md:inline">| Siap kirim area lokal & instan</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] opacity-90">
            <span>Gratis Ongkir &lt; 3 Km (Min. Rp 100rb)</span>
            <a 
              href={`https://wa.me/${storeInfo.whatsapp}?text=Halo%20${encodeURIComponent(storeInfo.name)}`}
              target="_blank" 
              rel="noreferrer"
              className="hover:underline flex items-center gap-1 font-semibold text-emerald-200"
            >
              <PhoneCall className="w-3 h-3" /> WA: {storeInfo.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div
            onClick={() => setActiveTab('catalog')}
            className="flex items-center gap-3 cursor-pointer select-none shrink-0"
          >
            <div className="flex items-center -space-x-3">
              {siteSettings.storeLogoImage ? (
                <img
                  src={siteSettings.storeLogoImage}
                  alt="Logo Toko"
                  className="w-10 h-10 rounded-xl object-cover border-2 border-white shadow-xs z-10 relative bg-white"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md font-bold text-xl border-2 border-white z-10 relative">
                  <Store className="w-6 h-6" />
                </div>
              )}
              {tahfidzProfile?.logoUrl && (
                <img
                  src={tahfidzProfile.logoUrl}
                  alt="Logo Rumah Tahfidz"
                  className="w-10 h-10 rounded-xl object-cover border-2 border-white shadow-xs bg-white"
                />
              )}
            </div>
            <div>
              <h1 className="font-bold text-lg text-neutral-900 leading-tight tracking-tight flex items-center gap-1.5">
                {storeInfo.name}
              </h1>
              <p className="text-xs text-emerald-700 font-medium hidden sm:block">
                {storeInfo.tagline}
              </p>
            </div>
          </div>

          {/* Middle Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Cari beras, minyak, telur, gula, mi instan..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeTab !== 'catalog') setActiveTab('catalog');
                }}
                className="w-full pl-10 pr-4 py-2 bg-neutral-100 hover:bg-neutral-100/80 focus:bg-white text-sm text-neutral-900 rounded-full border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-600 bg-neutral-200 rounded-full w-4 h-4 flex items-center justify-center"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Right Actions: Wholesale Toggle & Cart */}
          <div className="flex items-center gap-3">
            {/* Mode Grosir Switch */}
            <button
              onClick={() => setIsWholesaleMode(!isWholesaleMode)}
              className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                isWholesaleMode
                  ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                  : 'bg-neutral-100 text-neutral-700 border-neutral-200 hover:bg-neutral-200'
              }`}
              title="Aktifkan mode grosir untuk melihat potongan harga per dus / sak"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{isWholesaleMode ? 'Mode Grosir Active' : 'Harga Eceran'}</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-all flex items-center gap-2 font-medium text-sm group cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5 text-emerald-700 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline font-semibold">{siteSettings.navLabels.cart}</span>
              {cartItemCount > 0 && (
                <span className="bg-emerald-600 text-white text-xs font-bold rounded-full h-5 min-w-5 px-1.5 flex items-center justify-center animate-bounce">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar Mobile */}
        <div className="mt-2.5 lg:hidden">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Cari sembako (beras, minyak, gula...)"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeTab !== 'catalog') setActiveTab('catalog');
              }}
              className="w-full pl-10 pr-4 py-2 bg-neutral-100 text-sm text-neutral-900 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-2 mt-3 pt-2 border-t border-neutral-100 overflow-x-auto no-scrollbar text-sm">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'catalog'
                ? 'bg-emerald-800 text-white shadow-xs font-bold'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>{siteSettings.navLabels.catalog}</span>
          </button>

          <button
            onClick={() => setActiveTab('tahfidz')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'tahfidz'
                ? 'bg-emerald-800 text-white shadow-xs font-bold'
                : 'text-emerald-900 bg-emerald-50 hover:bg-emerald-100 font-semibold border border-emerald-200'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-700" />
            <span>{siteSettings.navLabels.tahfidz}</span>
            {siteSettings.navLabels.tahfidzBadge && (
              <span className="bg-amber-400 text-emerald-950 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full uppercase">{siteSettings.navLabels.tahfidzBadge}</span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'about'
                ? 'bg-emerald-800 text-white shadow-xs font-bold'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>{siteSettings.navLabels.about}</span>
          </button>

          <button
            onClick={() => setActiveTab('packages')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'packages'
                ? 'bg-emerald-800 text-white shadow-xs font-bold'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            <Gift className="w-4 h-4 text-amber-300" />
            <span>{siteSettings.navLabels.packages}</span>
            {siteSettings.navLabels.packagesBadge && (
              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full">{siteSettings.navLabels.packagesBadge}</span>
            )}
          </button>

          {/* Dynamic Custom Pages Links */}
          {customPages.map((page) => (
            <button
              key={page.id}
              onClick={() => setActiveTab(page.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === page.id
                  ? 'bg-emerald-800 text-white shadow-xs font-bold'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <span>{page.icon || '📄'}</span>
              <span>{page.title}</span>
            </button>
          ))}

          {/* New Login / Admin Menu Tab */}
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ml-auto ${
              activeTab === 'admin'
                ? 'bg-neutral-900 text-white shadow-xs font-bold'
                : adminUser?.isLoggedIn
                ? 'bg-emerald-100 text-emerald-900 font-semibold border border-emerald-300 hover:bg-emerald-200'
                : 'text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
            }`}
          >
            {adminUser?.isLoggedIn ? (
              <>
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>Panel Admin ({adminUser.name})</span>
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>{siteSettings.navLabels.admin}</span>
              </>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};

