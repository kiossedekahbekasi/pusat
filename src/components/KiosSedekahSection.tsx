import React from 'react';
import { KiosSedekahProfile } from '../types';
import { HeartHandshake, MapPin, Phone, MessageSquare, CheckCircle2, Sparkles, User, ImageIcon } from 'lucide-react';

interface KiosSedekahSectionProps {
  kiosSedekahProfile: KiosSedekahProfile;
}

export const KiosSedekahSection: React.FC<KiosSedekahSectionProps> = ({ kiosSedekahProfile }) => {
  return (
    <section className="py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative bg-gradient-to-r from-amber-800 via-amber-700 to-orange-800 rounded-3xl p-6 sm:p-10 text-white overflow-hidden shadow-xl border border-amber-600/40">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-amber-600/20 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-8">
          {/* Logo */}
          <div className="shrink-0 relative group">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-white/10 backdrop-blur-md p-2 border-2 border-emerald-300/60 shadow-lg flex items-center justify-center overflow-hidden">
              {kiosSedekahProfile.logoUrl ? (
                <img
                  src={kiosSedekahProfile.logoUrl}
                  alt={kiosSedekahProfile.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <div className="flex flex-col items-center text-center p-2 text-emerald-200">
                  <HeartHandshake className="w-10 h-10 mb-1" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Sedekah</span>
                </div>
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-emerald-400 text-emerald-950 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Sosial
            </div>
          </div>

          {/* Title & Info */}
          <div className="space-y-3 text-center md:text-left flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-400/20 border border-emerald-300/40 rounded-full text-emerald-100 text-xs font-semibold">
              <HeartHandshake className="w-3.5 h-3.5" /> Program Sosial & Kepedulian
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {kiosSedekahProfile.name}
            </h1>
            <p className="text-amber-100/90 text-sm sm:text-base max-w-2xl font-light italic">
              "{kiosSedekahProfile.tagline}"
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-amber-100">
              {kiosSedekahProfile.penanggungJawab && (
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-emerald-300" />
                  <span>Penanggung Jawab: <strong className="text-white">{kiosSedekahProfile.penanggungJawab}</strong></span>
                </div>
              )}
              {kiosSedekahProfile.address && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-300" />
                  <span className="line-clamp-1">{kiosSedekahProfile.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Description & Programs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-2xs space-y-4">
          <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-amber-700" /> Tentang Kios Sedekah
          </h2>
          <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-line">
            {kiosSedekahProfile.description}
          </p>
        </div>

        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-2xs space-y-4">
          <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-700" /> Program Kami
          </h2>
          <ul className="space-y-2.5">
            {kiosSedekahProfile.programs.map((program, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-neutral-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{program}</span>
              </li>
            ))}
            {kiosSedekahProfile.programs.length === 0 && (
              <li className="text-xs text-neutral-400">Belum ada program yang ditambahkan.</li>
            )}
          </ul>

          {(kiosSedekahProfile.phone || kiosSedekahProfile.whatsapp) && (
            <div className="pt-4 border-t border-neutral-100 space-y-2">
              {kiosSedekahProfile.phone && (
                <div className="flex items-center gap-2 text-xs text-neutral-600">
                  <Phone className="w-3.5 h-3.5 text-amber-700" /> {kiosSedekahProfile.phone}
                </div>
              )}
              {kiosSedekahProfile.whatsapp && (
                <a
                  href={`https://wa.me/${kiosSedekahProfile.whatsapp}?text=Halo%2C%20saya%20ingin%20bertanya%20tentang%20${encodeURIComponent(kiosSedekahProfile.name)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> Hubungi via WhatsApp
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Photo Gallery */}
      {kiosSedekahProfile.photos.length > 0 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-2xs space-y-4">
          <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-amber-700" /> Dokumentasi Kegiatan
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {kiosSedekahProfile.photos.map((photo) => (
              <div key={photo.id} className="rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-50">
                <img src={photo.url} alt={photo.caption} className="w-full h-32 object-cover" />
                {photo.caption && (
                  <p className="text-[11px] text-neutral-600 p-2 leading-snug">{photo.caption}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
