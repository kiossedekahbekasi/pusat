import React, { useRef, useState, useEffect } from 'react';
import { Truck, ShieldCheck, Tag, ArrowRight, CheckCircle2, Clock, CalendarDays, Volume2, VolumeX } from 'lucide-react';
import { StoreInfo, SiteSettings } from '../types';
import { useStoreStatus } from '../utils/storeStatus';
import { formatGregorianDate, formatHijriDate } from '../utils/hijriDate';

interface HeroBannerProps {
  onExploreClick: () => void;
  onAboutClick: () => void;
  isWholesaleMode: boolean;
  setIsWholesaleMode: (mode: boolean) => void;
  storeInfo: StoreInfo;
  siteSettings: SiteSettings;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onExploreClick,
  onAboutClick,
  isWholesaleMode,
  setIsWholesaleMode,
  storeInfo,
  siteSettings,
}) => {
  // Status BUKA/TUTUP & jam berjalan dihitung otomatis dari jadwal toko (real-time,
  // ter-update sendiri setiap detik) — tidak lagi tergantung saklar manual saja.
  const { isOpen, currentTime, now } = useStoreStatus(storeInfo);
  const gregorianDate = formatGregorianDate(now);
  const hijriDate = formatHijriDate(now);

  // Kontrol suara video hero secara manual. Video tetap wajib dimulai dalam
  // kondisi "muted" karena browser modern memblokir autoplay bersuara — begitu
  // pengunjung menekan tombol speaker, baru audionya dinyalakan.
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    const nextMuted = !isMuted;
    video.muted = nextMuted;
    // Beberapa browser mengharuskan play() dipanggil ulang di dalam gesture
    // klik pengguna agar audio benar-benar diizinkan untuk berbunyi.
    if (!nextMuted) {
      video.play().catch(() => {
        // Kalau browser tetap menolak, biarkan video jalan tanpa suara.
      });
    }
    setIsMuted(nextMuted);
  };

  return (
    <div className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg overflow-hidden my-6">
      {/* Video banner (kalau admin sudah unggah video) — diputar otomatis, senyap di awal,
          berulang, jadi tetap ringan & tidak mengganggu. Musiknya bisa dinyalakan manual
          lewat tombol speaker di pojok kanan atas. Kalau tidak ada video, pakai gambar
          banner statis seperti biasa. */}
      {siteSettings.heroVideoUrl ? (
        <>
          <video
            ref={videoRef}
            className="absolute inset-0 z-0 w-full h-full opacity-25 object-cover"
            src={siteSettings.heroVideoUrl}
            poster={siteSettings.heroBannerImage || undefined}
            autoPlay
            muted={isMuted}
            loop
            playsInline
          />
          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? 'Nyalakan suara video' : 'Matikan suara video'}
            title={isMuted ? 'Nyalakan suara' : 'Matikan suara'}
            className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 border border-white/20 backdrop-blur-xs text-white transition-colors cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </>
      ) : (
        siteSettings.heroBannerImage && (
          <div className="absolute inset-0 z-0 opacity-20 bg-cover bg-center pointer-events-none" style={{ backgroundImage: `url(${siteSettings.heroBannerImage})` }} />
        )
      )}

      {/* Decorative background circle */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column Content */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-700/60 text-emerald-100 border border-emerald-500/30 text-xs font-semibold backdrop-blur-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{siteSettings.heroContent.badgeText}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
            {siteSettings.heroTitle || storeInfo.name}
          </h1>

          <p className="text-emerald-100 text-base sm:text-lg leading-relaxed max-w-2xl">
            {siteSettings.heroSubtitle || storeInfo.description}
          </p>

          {/* Quick Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-left">
            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10 flex items-center gap-2.5">
              <Tag className="w-5 h-5 text-amber-300 shrink-0" />
              <div>
                <div className="text-xs text-emerald-200">{siteSettings.heroContent.feature1Label}</div>
                <div className="text-xs sm:text-sm font-bold">{siteSettings.heroContent.feature1Value}</div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10 flex items-center gap-2.5">
              <Truck className="w-5 h-5 text-emerald-300 shrink-0" />
              <div>
                <div className="text-xs text-emerald-200">{siteSettings.heroContent.feature2Label}</div>
                <div className="text-xs sm:text-sm font-bold">{siteSettings.heroContent.feature2Value}</div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10 flex items-center gap-2.5 col-span-2 sm:col-span-1">
              <ShieldCheck className="w-5 h-5 text-teal-300 shrink-0" />
              <div>
                <div className="text-xs text-emerald-200">{siteSettings.heroContent.feature3Label}</div>
                <div className="text-xs sm:text-sm font-bold">{siteSettings.heroContent.feature3Value}</div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
            <button
              onClick={onExploreClick}
              className="px-6 py-3.5 rounded-xl bg-amber-400 text-neutral-950 font-bold hover:bg-amber-300 transition-colors shadow-md flex items-center gap-2 group cursor-pointer text-sm"
            >
              <span>{siteSettings.heroContent.primaryButtonText}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onAboutClick}
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors border border-white/20 flex items-center gap-2 cursor-pointer text-sm"
            >
              <span>{siteSettings.heroContent.secondaryButtonText}</span>
            </button>
          </div>
        </div>

        {/* Right Column Highlights */}
        <div className="lg:col-span-5 bg-emerald-950/70 rounded-2xl p-6 border border-emerald-500/20 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-800/80 pb-3">
            <div className="flex items-center gap-2 font-bold text-amber-300 text-sm">
              <Clock className="w-4 h-4" /> Jam Operasional Toko
            </div>
            <span
              className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${
                isOpen
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
              }`}
            >
              {isOpen ? 'BUKA' : 'TUTUP'}
            </span>
          </div>

          <div className="flex items-center gap-2 -mt-1">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="font-mono text-lg sm:text-xl font-bold text-white tracking-widest tabular-nums">
              {currentTime || '--:--:--'}
            </span>
            <span className="text-[11px] text-emerald-300 font-semibold">WIB</span>
          </div>

          {/* Kalender Masehi & Hijriah, ikut ter-update otomatis setiap hari. */}
          <div className="flex items-start gap-2 -mt-1 pb-1 border-b border-emerald-800/80">
            <CalendarDays className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <p className="text-white font-semibold">{gregorianDate}</p>
              {hijriDate && <p className="text-emerald-300">{hijriDate}</p>}
            </div>
          </div>

          <div className="text-sm space-y-2 text-emerald-100">
            <p className="font-semibold text-white">{storeInfo.name}</p>
            <p className="text-xs text-emerald-300">{storeInfo.operatingHours}</p>
            <p className="text-xs leading-relaxed pt-1 text-emerald-200">
              📍 {storeInfo.address}
            </p>
          </div>

          {/* Mode Switch Card */}
          <div className="pt-2">
            <div className="p-3 rounded-xl bg-emerald-900/80 border border-emerald-700/50 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-white">Mode Pembelian</div>
                <div className="text-[11px] text-emerald-300">
                  {isWholesaleMode ? 'Menampilkan harga grosir (Dus / Sak)' : 'Menampilkan harga eceran harian'}
                </div>
              </div>
              <button
                onClick={() => setIsWholesaleMode(!isWholesaleMode)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isWholesaleMode
                    ? 'bg-amber-400 text-neutral-900'
                    : 'bg-emerald-700 text-white hover:bg-emerald-600'
                }`}
              >
                {isWholesaleMode ? 'Grosir ON' : 'Ubah Grosir'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

