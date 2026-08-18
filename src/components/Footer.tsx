import React from 'react';
import { Store, Phone, MapPin, Clock, ShieldCheck, UserCheck, BookOpen, Info, HeartHandshake, Gift } from 'lucide-react';
import { StoreInfo, SiteSettings, CustomPage, NavItemKey } from '../types';

interface FooterProps {
  onNavigateTab: (tab: string) => void;
  storeInfo: StoreInfo;
  siteSettings: SiteSettings;
  customPages?: CustomPage[];
}

const NAV_META: Record<NavItemKey, { tab: string; icon: React.ReactNode; getLabel: (s: SiteSettings) => string; className: string }> = {
  catalog: {
    tab: 'catalog',
    icon: null,
    getLabel: (s) => s.navLabels.catalog,
    className: '',
  },
  tahfidz: {
    tab: 'tahfidz',
    icon: <BookOpen className="w-3.5 h-3.5" />,
    getLabel: (s) => s.navLabels.tahfidz,
    className: 'font-semibold text-emerald-300',
  },
  about: {
    tab: 'about',
    icon: <Info className="w-3.5 h-3.5" />,
    getLabel: (s) => s.navLabels.about,
    className: '',
  },
  kios_sedekah: {
    tab: 'kios_sedekah',
    icon: <HeartHandshake className="w-3.5 h-3.5" />,
    getLabel: (s) => s.navLabels.kiosSedekah,
    className: 'font-semibold text-amber-300',
  },
  packages: {
    tab: 'packages',
    icon: <Gift className="w-3.5 h-3.5" />,
    getLabel: (s) => s.navLabels.packages,
    className: '',
  },
};

export const Footer: React.FC<FooterProps> = ({ onNavigateTab, storeInfo, siteSettings, customPages = [] }) => {
  const orderedVisibleItems = (siteSettings.navOrder || []).filter((item) => item.visible);

  return (
    <footer className="w-full bg-neutral-900 text-neutral-300 mt-16 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Brand Profile */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                <Store className="w-5 h-5" />
              </div>
              <span className="font-bold text-white text-base leading-tight">
                {storeInfo.name}
              </span>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">
              {storeInfo.tagline}. {siteSettings.footerContent.aboutText}
            </p>

            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" /> Terpercaya Sejak Tahun {storeInfo.established}
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">
              Navigasi Cepat
            </h4>
            <ul className="space-y-2 text-xs">
              {orderedVisibleItems.map((item) => {
                const meta = NAV_META[item.key];
                if (!meta) return null;
                return (
                  <li key={item.key}>
                    <button
                      onClick={() => onNavigateTab(meta.tab)}
                      className={`hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1.5 ${meta.className}`}
                    >
                      {meta.icon}
                      <span>{meta.getLabel(siteSettings)}</span>
                    </button>
                  </li>
                );
              })}
              {customPages.map((page) => (
                <li key={page.id}>
                  <button
                    onClick={() => onNavigateTab(page.id)}
                    className="hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>{page.icon || '📄'}</span>
                    <span>{page.title}</span>
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => onNavigateTab('admin')}
                  className="text-amber-300 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5" /> {siteSettings.navLabels.admin}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Categories */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">
              Komoditas Pokok
            </h4>
            <ul className="space-y-1.5 text-xs text-neutral-400">
              {siteSettings.footerContent.commodities.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Col 4: Store Contact & Hours */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">
              Jam Operasional & Kontak
            </h4>
            <div className="space-y-2 text-xs text-neutral-400">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{storeInfo.operatingHours}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{storeInfo.address}</span>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>WA: {storeInfo.phone}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-neutral-800 text-center text-xs text-neutral-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            © {new Date().getFullYear()} {storeInfo.name}. Seluruh Hak Cipta Dilindungi.
          </div>
          <div className="flex items-center gap-1 text-neutral-400">
            <span>{siteSettings.footerContent.bottomTagline}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
