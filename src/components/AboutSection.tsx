import React, { useState } from 'react';
import { 
  Store, 
  MapPin, 
  Clock, 
  Phone, 
  Truck, 
  ChevronDown, 
  HeartHandshake, 
  Scale, 
  BadgePercent,
  MessageSquare,
  Image as ImageIcon,
  Banknote,
  Smartphone,
  Landmark,
} from 'lucide-react';
import { StoreInfo, CustomPhoto, SiteSettings } from '../types';

interface AboutSectionProps {
  storeInfo: StoreInfo;
  photos: CustomPhoto[];
  siteSettings: SiteSettings;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ storeInfo, photos, siteSettings }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const sembako9List = [
    { title: 'Beras & Biji-bijian', desc: 'Beras Pandan Wangi, Ramos, Setra Ramos & Beras Merah berkualitas.' },
    { title: 'Gula Pasir & Pemanis', desc: 'Gula kristal putih murni dari tebu alami berkualitas.' },
    { title: 'Minyak Goreng & Margarin', desc: 'Minyak kelapa sawit bening pouch 1L & 2L serta mentega serbaguna.' },
    { title: 'Daging, Ayam & Ikan', desc: 'Olahan protein segar harian dari peternak lokal terpercaya.' },
    { title: 'Telur Ayam Negeri', desc: 'Telur ayam cangkang cokelat segar dipasok setiap pagi hari.' },
    { title: 'Susu & Produk Olahan', desc: 'Susu kental manis, susu bubuk anak & krimer pilihan keluarga.' },
    { title: 'Tepung Terigu & Tapioka', desc: 'Tepung serbaguna protein tinggi, sedang, dan tepung kanji.' },
    { title: 'Garam Beriodium & Bumbu', desc: 'Garam halus beriodium murni, kecap manis, saus & bumbu racik.' },
    { title: 'Gas LPG & Bahan Bakar', desc: 'Tabung Gas LPG 3kg & 12kg resmi agen Pertamina terjamin aman.' },
  ];

  return (
    <div className="space-y-12 py-4">
      {/* Hero Header About */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-3xl p-8 sm:p-12 shadow-md relative overflow-hidden">
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-700/60 text-emerald-100 border border-emerald-500/30 text-xs font-semibold">
            <Store className="w-4 h-4 text-emerald-300" />
            <span>{siteSettings.aboutPageContent.badgeText}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Tentang {storeInfo.name}
          </h1>

          <p className="text-emerald-100 text-base sm:text-lg leading-relaxed">
            Berdiri sejak tahun {storeInfo.established}, {storeInfo.name} berkomitmen menjadi mitra terpercaya keluarga dan pelaku usaha mikro dalam menyediakan sembilan bahan pokok harian berstandar mutu terbaik dengan harga grosir dan eceran yang jujur.
          </p>

          {storeInfo.description && (
            <p className="text-emerald-50 text-sm sm:text-base leading-relaxed whitespace-pre-line bg-emerald-950/30 rounded-2xl p-4 border border-emerald-700/40">
              {storeInfo.description}
            </p>
          )}

          <div className="flex flex-wrap gap-6 pt-4 border-t border-emerald-700/50 text-emerald-200 text-sm">
            <div>
              <span className="block text-2xl font-black text-amber-300">{siteSettings.aboutPageContent.stat1Value}</span>
              <span className="text-xs">{siteSettings.aboutPageContent.stat1Label}</span>
            </div>
            <div>
              <span className="block text-2xl font-black text-amber-300">{siteSettings.aboutPageContent.stat2Value}</span>
              <span className="text-xs">{siteSettings.aboutPageContent.stat2Label}</span>
            </div>
            <div>
              <span className="block text-2xl font-black text-amber-300">{siteSettings.aboutPageContent.stat3Value}</span>
              <span className="text-xs">{siteSettings.aboutPageContent.stat3Label}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Photos Section added by Admin */}
      {photos && photos.length > 0 && (
        <div className="space-y-4 bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-emerald-700" />
            <h2 className="text-xl font-bold text-neutral-900">Galeri & Dokumentasi Foto Toko</h2>
          </div>
          <p className="text-xs text-neutral-500">
            Kumpulan foto suasana toko, pengiriman sembako, dan stok bahan pokok di {storeInfo.name}.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
            {photos.map((photo) => (
              <div key={photo.id} className="group relative rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-100 shadow-xs">
                <div className="h-48 overflow-hidden">
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3.5 bg-white">
                  <h4 className="font-bold text-xs text-neutral-900">{photo.title}</h4>
                  {photo.description && (
                    <p className="text-[11px] text-neutral-500 mt-0.5">{photo.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid: 9 Sembako Explanation */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-neutral-900">
            Sembilan Bahan Pokok (Sembako) Lengkap
          </h2>
          <p className="text-neutral-600 text-sm">
            Kami menyediakan seluruh komoditas utama sesuai standar Keputusan Menteri Industri dan Perdagangan:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sembako9List.map((item, idx) => (
            <div
              key={idx}
              className="p-5 bg-white rounded-2xl border border-neutral-200 hover:border-emerald-300 shadow-2xs space-y-2 transition-all"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                <h3 className="font-bold text-neutral-900 text-base">
                  {item.title}
                </h3>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed pl-8">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Keunggulan Toko */}
      <div className="bg-emerald-50/70 rounded-3xl p-8 border border-emerald-100 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase text-emerald-800 tracking-wider">
            Mengapa Memilih Kami?
          </span>
          <h2 className="text-2xl font-bold text-neutral-900">
            Komitmen Pelayanan {storeInfo.name}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Scale className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-neutral-900 text-base">Timbangan Pas & Jujur</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Seluruh komoditas timbangan (beras, telur, gula) ditimbang menggunakan timbangan digital terkalibrasi akurat.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-neutral-200 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <BadgePercent className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-neutral-900 text-base">Harga Eceran & Grosir</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Tersedia skema potongan harga grosir untuk pembelian per karton/dus, per sak, atau pembelian katering.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-neutral-200 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-neutral-900 text-base">Layanan Antar Rumah</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Armada kurir toko kami siap mengantarkan belanjaan sembako berat langsung hingga ke depan pintu rumah Anda.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-neutral-200 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-neutral-900 text-base">Paket Sedekah / Bansos</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Menerima pengadaan paket sembako custom untuk kegiatan sosial, zakat, santunan, dan hari raya.
            </p>
          </div>
        </div>
      </div>

      {/* Informasi Alamat, Jam Buka & Peta Toko */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Detail Alamat */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-2xs space-y-6">
          <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
            <Store className="w-5 h-5 text-emerald-700" /> Kontak & Lokasi Toko
          </h2>

          <div className="space-y-4 text-sm text-neutral-700">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-neutral-900">Alamat Fisik Toko:</div>
                <div className="text-xs text-neutral-600 leading-relaxed">
                  {storeInfo.address}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-neutral-900">Jam Operasional:</div>
                <div className="text-xs text-neutral-600 leading-relaxed">
                  {storeInfo.operatingHours}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-neutral-900">Telepon & WhatsApp:</div>
                <div className="text-xs text-neutral-600">
                  {storeInfo.phone} / {storeInfo.whatsapp}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="pt-4 border-t border-neutral-100 space-y-2">
            <div className="text-xs font-bold text-neutral-800 uppercase tracking-wide">
              Metode Pembayaran Diterima:
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-100 text-neutral-700 font-semibold rounded-lg border border-neutral-200">
                <Banknote className="w-3.5 h-3.5" /> Tunai (COD)
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-100 text-neutral-700 font-semibold rounded-lg border border-neutral-200">
                <Smartphone className="w-3.5 h-3.5" /> QRIS All Payment
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-100 text-neutral-700 font-semibold rounded-lg border border-neutral-200">
                <Landmark className="w-3.5 h-3.5" /> Transfer BCA / BRI / Mandiri
              </span>
            </div>
          </div>
        </div>

        {/* Simulated Map Card */}
        <div className="lg:col-span-7 bg-emerald-900 rounded-3xl p-6 text-white space-y-4 shadow-md overflow-hidden relative min-h-[300px] flex flex-col justify-between">
          <div className="space-y-2 relative z-10">
            <span className="bg-emerald-700/80 text-emerald-100 text-xs px-3 py-1 rounded-full font-semibold border border-emerald-500/30">
              Peta Lokasi Toko Sembako
            </span>
            <h3 className="text-2xl font-bold">Kunjungi Toko Fisik Kami</h3>
            <p className="text-emerald-200 text-xs max-w-md">
              Lokasi toko berada di pinggir jalan utama, mudah diakses kendaraan roda 2 & roda 4 dengan fasilitas parkir luas.
            </p>
          </div>

          {/* Simulated Map Canvas Visual */}
          <div className="bg-emerald-950/80 rounded-2xl p-6 border border-emerald-700/50 relative z-10 space-y-4">
            <div className="flex items-center justify-between text-xs text-emerald-300">
              <span className="font-mono">GPS: -6.2847, 106.9748</span>
              <span className="text-emerald-400 font-bold">● Area Terbuka</span>
            </div>

            <div className="p-4 bg-emerald-900/90 rounded-xl border border-emerald-600/40 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-400 text-neutral-900 font-black flex items-center justify-center text-lg shadow-xs">
                  S
                </div>
                <div>
                  <div className="font-bold text-sm text-white">{storeInfo.name}</div>
                  <div className="text-xs text-emerald-200">{storeInfo.address}</div>
                </div>
              </div>
              <a
                href={`https://wa.me/${storeInfo.whatsapp}?text=Halo%20${encodeURIComponent(storeInfo.name)}%20bisa%20minta%20share%20location%20toko?`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-lg text-xs transition-colors shrink-0"
              >
                Minta Shareloc WA
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-3xl p-8 border border-neutral-200 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-neutral-900 flex items-center justify-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-700" /> Tanya Jawab (FAQ) Toko Sembako
          </h2>
          <p className="text-xs text-neutral-500">
            Pertanyaan yang sering diajukan oleh pelanggan {storeInfo.name}
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {storeInfo.faq.map((item, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="border border-neutral-200 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 text-left font-bold text-neutral-900 text-sm flex items-center justify-between gap-3 bg-neutral-50/50 hover:bg-neutral-100/60 transition-colors cursor-pointer"
                >
                  <span>{item.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-500 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="p-4 pt-2 text-xs text-neutral-600 leading-relaxed border-t border-neutral-100 bg-white">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

