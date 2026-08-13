import React from 'react';
import { Store, Phone, MapPin, Clock, ShieldCheck, UserCheck } from 'lucide-react';
import { StoreInfo } from '../types';

interface FooterProps {
  onNavigateTab: (tab: 'catalog' | 'tahfidz' | 'about' | 'packages' | 'admin') => void;
  storeInfo: StoreInfo;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab, storeInfo }) => {
  return (
    <footer className="bg-neutral-900 text-neutral-300 mt-16 border-t border-neutral-800">
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
              {storeInfo.tagline}. Melayani pasokan sembako eceran dan grosir partai besar dengan timbangan jujur dan harga terjangkau.
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
              <li>
                <button
                  onClick={() => onNavigateTab('catalog')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Katalog Sembako Lengkap
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('tahfidz')}
                  className="hover:text-emerald-400 font-semibold text-emerald-300 transition-colors cursor-pointer"
                >
                  Rumah Tahfidz Nurul A'laa
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('about')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Tentang Toko Sembako (Profil & Lokasi)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('packages')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Paket Sembako Hemat & Sedekah
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('admin')}
                  className="text-amber-300 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5" /> Halaman Login & Panel Admin
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
              <li>Beras Pandan Wangi & Ramos</li>
              <li>Minyak Goreng Pouch 1L & 2L</li>
              <li>Gula Pasir & Pemani Murni</li>
              <li>Telur Ayam Negeri Segar</li>
              <li>Tepung Terigu & Tapioka</li>
              <li>Mie Instan Dus & Eceran</li>
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
            <span>Dibuat untuk melayani kebutuhan pokok keluarga Indonesia</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

