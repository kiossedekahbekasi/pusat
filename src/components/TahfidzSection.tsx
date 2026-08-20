import React, { useState } from 'react';
import { TahfidzProfile, Santri, KegiatanSantri } from '../types';
import { BookOpen, Award, Calendar, MapPin, Phone, MessageSquare, Search, Filter, Sparkles, GraduationCap, X, ChevronRight, User, Play } from 'lucide-react';
import { PrayerTimesWidget } from './PrayerTimesWidget';

interface TahfidzSectionProps {
  tahfidzProfile: TahfidzProfile;
  santriList: Santri[];
  kegiatanList: KegiatanSantri[];
}

export const TahfidzSection: React.FC<TahfidzSectionProps> = ({
  tahfidzProfile,
  santriList,
  kegiatanList,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'santri' | 'kegiatan'>('profile');
  const [santriSearch, setSantriSearch] = useState('');
  const [santriStatusFilter, setSantriStatusFilter] = useState<'all' | 'Aktif' | 'Mutqin' | 'Lulus'>('all');
  const [kegiatanCategoryFilter, setKegiatanCategoryFilter] = useState<string>('all');
  const [logoFailed, setLogoFailed] = useState(false);
  const [selectedPhotoModal, setSelectedPhotoModal] = useState<KegiatanSantri | null>(null);
  const [selectedSantriModal, setSelectedSantriModal] = useState<Santri | null>(null);

  // Filtered Santri
  const filteredSantri = santriList.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(santriSearch.toLowerCase()) ||
                          s.nis.toLowerCase().includes(santriSearch.toLowerCase()) ||
                          s.wali.toLowerCase().includes(santriSearch.toLowerCase());
    const matchesStatus = santriStatusFilter === 'all' || s.status === santriStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered Kegiatan
  const filteredKegiatan = kegiatanList.filter((k) => {
    return kegiatanCategoryFilter === 'all' || k.category === kegiatanCategoryFilter;
  });

  // Stats
  const totalSantriAktif = santriList.filter(s => s.status === 'Aktif').length;
  const totalMutqin = santriList.filter(s => s.status === 'Mutqin' || s.hafalanJuz === 30).length;
  const totalLulus = santriList.filter(s => s.status === 'Lulus').length;

  return (
    <section className="py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-10 text-white overflow-hidden shadow-xl border border-emerald-700/40">
        {/* Background Islamic Pattern Accent */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-emerald-700/20 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-8">
          {/* Logo Tahfidz */}
          <div className="shrink-0 relative group">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-white/10 backdrop-blur-md p-2 border-2 border-amber-400/60 shadow-lg flex items-center justify-center overflow-hidden">
              {tahfidzProfile.logoUrl && !logoFailed ? (
                <img
                  src={tahfidzProfile.logoUrl}
                  alt={tahfidzProfile.name}
                  className="w-full h-full object-cover rounded-xl"
                  onError={() => setLogoFailed(true)}
                />
              ) : (
                <div className="flex flex-col items-center text-center p-2 text-amber-300">
                  <BookOpen className="w-10 h-10 mb-1" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">NURUL A'LAA</span>
                </div>
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-amber-400 text-emerald-950 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Tahfidz
            </div>
          </div>

          {/* Title & Info */}
          <div className="space-y-3 text-center md:text-left flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 border border-amber-300/40 rounded-full text-amber-200 text-xs font-semibold">
              <GraduationCap className="w-3.5 h-3.5" /> Berdiri Sejak Tahun {tahfidzProfile.establishedYear}
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {tahfidzProfile.name}
            </h1>
            <p className="text-emerald-100/90 text-sm sm:text-base max-w-2xl font-light italic">
              "{tahfidzProfile.tagline}"
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-emerald-200">
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-amber-300" />
                <span>Pengasuh: <strong className="text-white">{tahfidzProfile.pengasuh}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-300" />
                <span className="line-clamp-1">{tahfidzProfile.address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="mt-8 pt-6 border-t border-emerald-700/50 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-emerald-950/40 backdrop-blur-xs p-3 rounded-2xl border border-emerald-700/40">
            <p className="text-2xl font-black text-amber-300">{totalSantriAktif}</p>
            <p className="text-[11px] text-emerald-200 uppercase tracking-wider font-medium">Santri Aktif</p>
          </div>
          <div className="bg-emerald-950/40 backdrop-blur-xs p-3 rounded-2xl border border-emerald-700/40">
            <p className="text-2xl font-black text-amber-300">{totalMutqin}</p>
            <p className="text-[11px] text-emerald-200 uppercase tracking-wider font-medium">Hafiz 30 Juz / Mutqin</p>
          </div>
          <div className="bg-emerald-950/40 backdrop-blur-xs p-3 rounded-2xl border border-emerald-700/40">
            <p className="text-2xl font-black text-amber-300">{totalLulus}</p>
            <p className="text-[11px] text-emerald-200 uppercase tracking-wider font-medium">Alumni Lulus</p>
          </div>
          <div className="bg-emerald-950/40 backdrop-blur-xs p-3 rounded-2xl border border-emerald-700/40">
            <p className="text-2xl font-black text-amber-300">{kegiatanList.length}</p>
            <p className="text-[11px] text-emerald-200 uppercase tracking-wider font-medium">Kegiatan / Agenda</p>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 border-b border-neutral-200 pb-2">
        <button
          onClick={() => setActiveSubTab('profile')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'profile'
              ? 'bg-emerald-800 text-white shadow-md'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Profil & Visi Misi</span>
        </button>

        <button
          onClick={() => setActiveSubTab('santri')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'santri'
              ? 'bg-emerald-800 text-white shadow-md'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Data Santri ({santriList.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('kegiatan')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'kegiatan'
              ? 'bg-emerald-800 text-white shadow-md'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Kegiatan Santri ({kegiatanList.length})</span>
        </button>
      </div>

      {/* SUB TAB 1: PROFIL & VISI MISI */}
      {activeSubTab === 'profile' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Jadwal Waktu Sholat Bekasi */}
          <PrayerTimesWidget />

          {/* About & Profile Text Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-4">
            <div className="flex items-center gap-3 border-b border-neutral-100 pb-4">
              <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-2xl">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-neutral-900">Profil Rumah Tahfidz</h2>
                <p className="text-xs text-neutral-500">Mengenal lebih dekat {tahfidzProfile.name}</p>
              </div>
            </div>

            <p className="text-neutral-700 text-sm leading-relaxed whitespace-pre-line">
              {tahfidzProfile.profilText}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-neutral-100">
              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 flex items-start gap-3">
                <User className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-emerald-900 uppercase">Pengasuh / Pimpinan Utama</p>
                  <p className="text-sm font-bold text-neutral-900">{tahfidzProfile.pengasuh}</p>
                </div>
              </div>

              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-emerald-900 uppercase">Alamat Sekretariat</p>
                  <p className="text-sm font-bold text-neutral-900">{tahfidzProfile.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Visi & Misi Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Visi Card */}
            <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-emerald-700/50 space-y-4 lg:col-span-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400 text-emerald-950 rounded-full text-xs font-extrabold uppercase">
                  <Award className="w-3.5 h-3.5" /> VISI UTAMA
                </div>
                <h3 className="text-xl font-bold text-white">Visi Rumah Tahfidz</h3>
                <p className="text-emerald-100 text-sm leading-relaxed italic border-l-4 border-amber-400 pl-4 py-1">
                  "{tahfidzProfile.visi}"
                </p>
              </div>

              <div className="pt-4 border-t border-emerald-800 text-xs text-emerald-300 flex items-center justify-between">
                <span>Berdiri sejak {tahfidzProfile.establishedYear}</span>
                <span className="font-bold text-amber-300">Target 30 Juz Mutqin</span>
              </div>
            </div>

            {/* Misi Card List */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-4 lg:col-span-2">
              <div className="flex items-center gap-3 border-b border-neutral-100 pb-3">
                <div className="p-2 bg-amber-50 text-amber-800 rounded-xl">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-900">Misi & Langkah Program</h3>
                  <p className="text-xs text-neutral-500">Komitmen dalam mendidik dan membimbing para santri</p>
                </div>
              </div>

              <div className="space-y-3">
                {tahfidzProfile.misi.map((m, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-neutral-50 rounded-2xl border border-neutral-100 hover:border-emerald-200 transition-colors">
                    <span className="w-7 h-7 rounded-full bg-emerald-800 text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-neutral-800 leading-relaxed pt-1">
                      {m}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact & Inquiries */}
          <div className="bg-emerald-50 rounded-3xl p-6 sm:p-8 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="font-bold text-emerald-950 text-base">Tertarik Mendaftarkan Putra/Putri Anda?</h4>
              <p className="text-xs text-emerald-800">Hubungi pengurus Rumah Tahfidz Nurul A'laa untuk informasi pendaftaran santri baru atau donasi wakaf.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`https://wa.me/${tahfidzProfile.whatsapp}?text=Halo%20Pengurus%20${encodeURIComponent(tahfidzProfile.name)}`}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-2xl text-xs flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Hubungi via WhatsApp</span>
              </a>
              <a
                href={`tel:${tahfidzProfile.phone}`}
                className="px-5 py-2.5 bg-white hover:bg-neutral-100 text-emerald-900 border border-emerald-300 font-bold rounded-2xl text-xs flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Phone className="w-4 h-4 text-emerald-700" />
                <span>Telepon Pengurus</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB 2: DATA SANTRI */}
      {activeSubTab === 'santri' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Controls & Search */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-neutral-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Cari nama santri, NIS, atau wali..."
                value={santriSearch}
                onChange={(e) => setSantriSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              <span className="text-xs font-semibold text-neutral-500 flex items-center gap-1 shrink-0">
                <Filter className="w-3.5 h-3.5" /> Status:
              </span>
              {(['all', 'Aktif', 'Mutqin', 'Lulus'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setSantriStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 cursor-pointer transition-colors ${
                    santriStatusFilter === st
                      ? 'bg-emerald-800 text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {st === 'all' ? 'Semua' : st}
                </button>
              ))}
            </div>
          </div>

          {/* Santri Cards Grid */}
          {filteredSantri.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-neutral-200 space-y-3">
              <GraduationCap className="w-12 h-12 mx-auto text-neutral-300" />
              <p className="text-sm font-bold text-neutral-700">Data Santri Tidak Ditemukan</p>
              <p className="text-xs text-neutral-400">Coba ubah kata kunci pencarian atau filter status santri.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSantri.map((santri) => (
                <div
                  key={santri.id}
                  className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="flex items-start gap-4">
                    {/* Santri Avatar */}
                    <div
                      className="relative shrink-0 cursor-pointer"
                      onClick={() => setSelectedSantriModal(santri)}
                    >
                      <img
                        src={santri.photoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400'}
                        alt={santri.name}
                        className="w-16 h-16 rounded-2xl object-cover border border-neutral-200 shadow-xs group-hover:scale-105 transition-transform"
                      />
                      <span className={`absolute -bottom-1 -right-1 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md text-white ${
                        santri.status === 'Mutqin' ? 'bg-amber-500' : santri.status === 'Aktif' ? 'bg-emerald-600' : 'bg-neutral-500'
                      }`}>
                        {santri.status}
                      </span>
                    </div>

                    {/* Santri Main Info */}
                    <div className="space-y-1 min-w-0 flex-1">
                      <p className="text-[10px] font-mono text-emerald-800 font-bold tracking-wider">{santri.nis}</p>
                      <h4 className="font-bold text-neutral-900 text-sm line-clamp-1 group-hover:text-emerald-800 transition-colors">
                        {santri.name}
                      </h4>
                      <p className="text-xs text-neutral-500 flex items-center gap-1">
                        <span>{santri.gender === 'L' ? 'Santriwan' : 'Santriwati'}</span> • <span>{santri.age} Tahun</span>
                      </p>
                    </div>
                  </div>

                  {/* Hafalan Progress Badge */}
                  <div className="bg-emerald-50/80 rounded-2xl p-3 border border-emerald-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-emerald-800">Pencapaian Hafalan</p>
                      <p className="text-sm font-extrabold text-emerald-950">
                        {santri.hafalanJuz === 30 ? '30 Juz (Khatam Mutqin)' : `${santri.hafalanJuz} Juz Al-Qur'an`}
                      </p>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-emerald-800 text-amber-300 font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                      {santri.hafalanJuz} JZ
                    </div>
                  </div>

                  {/* Additional details */}
                  <div className="text-[11px] text-neutral-600 space-y-1 pt-1 border-t border-neutral-100">
                    <p className="flex justify-between">
                      <span className="text-neutral-400">Wali Santri:</span>
                      <strong className="text-neutral-800">{santri.wali}</strong>
                    </p>
                    {santri.notes && (
                      <p className="text-neutral-500 italic line-clamp-2 text-[10px] pt-1">
                        "{santri.notes}"
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB TAB 3: KEGIATAN SANTRI */}
      {activeSubTab === 'kegiatan' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Category Filter */}
          <div className="bg-white rounded-3xl p-4 border border-neutral-200 shadow-xs flex items-center gap-2 overflow-x-auto">
            <span className="text-xs font-semibold text-neutral-500 shrink-0 flex items-center gap-1 pl-2">
              <Filter className="w-3.5 h-3.5" /> Kategori Kegiatan:
            </span>
            {['all', 'Setoran Hafalan', 'Munaqasyah', 'Kajian', 'Rihlah', 'Kegiatan Harian', 'Bakti Sosial'].map((cat) => (
              <button
                key={cat}
                onClick={() => setKegiatanCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 cursor-pointer transition-colors ${
                  kegiatanCategoryFilter === cat
                    ? 'bg-emerald-800 text-white shadow-2xs'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {cat === 'all' ? 'Semua Kegiatan' : cat}
              </button>
            ))}
          </div>

          {/* Activities Cards Grid */}
          {filteredKegiatan.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-neutral-200 space-y-3">
              <Calendar className="w-12 h-12 mx-auto text-neutral-300" />
              <p className="text-sm font-bold text-neutral-700">Belum Ada Kegiatan untuk Kategori Ini</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredKegiatan.map((kgt) => (
                <div
                  key={kgt.id}
                  className="bg-white rounded-3xl border border-neutral-200 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group"
                >
                  {/* Photo/Video Container with Category Badge — rasio kotak 1:1 seperti Instagram */}
                  <div className="relative aspect-square overflow-hidden bg-neutral-100 cursor-pointer" onClick={() => setSelectedPhotoModal(kgt)}>
                    {kgt.videoUrl ? (
                      <video
                        src={kgt.videoUrl}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        muted
                        loop
                        playsInline
                        autoPlay
                      />
                    ) : (
                      <img
                        src={kgt.photoUrl}
                        alt={kgt.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                    <span className="absolute top-3 left-3 bg-emerald-800/90 text-white text-[10px] font-bold uppercase px-3 py-1 rounded-full backdrop-blur-xs shadow-xs">
                      {kgt.category}
                    </span>
                    {kgt.videoUrl && (
                      <span className="absolute top-3 right-3 bg-black/60 text-white p-1.5 rounded-full backdrop-blur-xs">
                        <Play className="w-3.5 h-3.5 fill-white" />
                      </span>
                    )}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <p className="text-xs text-emerald-200 font-semibold flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {kgt.date} {kgt.time ? `• ${kgt.time}` : ''}
                      </p>
                      <h3 className="font-bold text-base sm:text-lg line-clamp-2 text-white">
                        {kgt.title}
                      </h3>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <p className="text-xs text-neutral-600 leading-relaxed line-clamp-3">
                      {kgt.description}
                    </p>

                    <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                      {kgt.location && (
                        <span className="flex items-center gap-1 line-clamp-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span className="truncate">{kgt.location}</span>
                        </span>
                      )}

                      <button
                        onClick={() => setSelectedPhotoModal(kgt)}
                        className="text-emerald-800 font-bold hover:underline flex items-center gap-1 shrink-0 ml-auto cursor-pointer"
                      >
                        <span>Lihat Foto Foto</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL FOTO RESOLUSI PENUH */}
      {selectedPhotoModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl space-y-4">
            <div className="relative bg-black aspect-square flex items-center justify-center">
              {selectedPhotoModal.videoUrl ? (
                <video
                  src={selectedPhotoModal.videoUrl}
                  className="w-full h-full object-contain"
                  controls
                  autoPlay
                  playsInline
                />
              ) : (
                <img
                  src={selectedPhotoModal.photoUrl}
                  alt={selectedPhotoModal.title}
                  className="w-full h-full object-contain"
                />
              )}
              <button
                onClick={() => setSelectedPhotoModal(null)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 backdrop-blur-md cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-2">
              <span className="inline-block px-2.5 py-0.5 bg-emerald-100 text-emerald-900 text-[11px] font-bold rounded-lg uppercase">
                {selectedPhotoModal.category}
              </span>
              <h3 className="text-xl font-bold text-neutral-900">{selectedPhotoModal.title}</h3>
              <p className="text-xs text-neutral-500 flex items-center gap-2">
                <span>{selectedPhotoModal.date}</span>
                {selectedPhotoModal.location && <span>• {selectedPhotoModal.location}</span>}
              </p>
              <p className="text-xs text-neutral-700 pt-2 leading-relaxed">
                {selectedPhotoModal.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL FOTO SANTRI RESOLUSI PENUH */}
      {selectedSantriModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedSantriModal(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-black aspect-square flex items-center justify-center">
              <img
                src={selectedSantriModal.photoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400'}
                alt={selectedSantriModal.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedSantriModal(null)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 backdrop-blur-md cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <span className={`absolute bottom-4 right-4 text-[11px] font-extrabold px-2.5 py-1 rounded-lg text-white ${
                selectedSantriModal.status === 'Mutqin' ? 'bg-amber-500' : selectedSantriModal.status === 'Aktif' ? 'bg-emerald-600' : 'bg-neutral-500'
              }`}>
                {selectedSantriModal.status}
              </span>
            </div>

            <div className="px-6 pb-6 space-y-3">
              <div>
                <p className="text-[10px] font-mono text-emerald-800 font-bold tracking-wider">{selectedSantriModal.nis}</p>
                <h3 className="text-xl font-bold text-neutral-900">{selectedSantriModal.name}</h3>
                <p className="text-xs text-neutral-500">
                  {selectedSantriModal.gender === 'L' ? 'Santriwan' : 'Santriwati'} • {selectedSantriModal.age} Tahun
                </p>
              </div>

              <div className="bg-emerald-50/80 rounded-2xl p-3 border border-emerald-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-bold text-emerald-800">Pencapaian Hafalan</p>
                  <p className="text-sm font-extrabold text-emerald-950">
                    {selectedSantriModal.hafalanJuz === 30 ? "30 Juz (Khatam Mutqin)" : `${selectedSantriModal.hafalanJuz} Juz Al-Qur'an`}
                  </p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-emerald-800 text-amber-300 font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                  {selectedSantriModal.hafalanJuz} JZ
                </div>
              </div>

              <div className="text-[11px] text-neutral-600 space-y-1 pt-1 border-t border-neutral-100">
                <p className="flex justify-between">
                  <span className="text-neutral-400">Wali Santri:</span>
                  <strong className="text-neutral-800">{selectedSantriModal.wali}</strong>
                </p>
                {selectedSantriModal.notes && (
                  <p className="text-neutral-500 italic pt-1">"{selectedSantriModal.notes}"</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
