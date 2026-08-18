import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ALL_DUA_LIST } from '../data/allDuaList';
import { DuaItem, DuaCategory, CharacterInfo } from '../types';
import {
  Search,
  Volume2,
  BookOpen,
  Star,
} from 'lucide-react';
import { speakText, audioEngine } from '../utils/audio';

interface DuaCatalogProps {
  selectedDua: DuaItem;
  onSelectDua: (dua: DuaItem) => void;
  masteredIds: number[];
  onToggleMastered: (id: number) => void;
  character: CharacterInfo;
  onPracticeDua: (dua: DuaItem) => void;
}

export const DuaCatalog: React.FC<DuaCatalogProps> = ({
  selectedDua,
  onSelectDua,
  masteredIds,
  onToggleMastered,
  character,
  onPracticeDua,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<DuaCategory>('all');

  const categories: { id: DuaCategory; label: string; icon: string; count: number }[] = [
    { id: 'all', label: 'Semua 25 Doa', icon: '🌟', count: ALL_DUA_LIST.length },
    { id: 'daily', label: 'Rutinitas Harian', icon: '🌅', count: ALL_DUA_LIST.filter(d => d.category === 'daily').length },
    { id: 'meal', label: 'Makan & Minum', icon: '🍽️', count: ALL_DUA_LIST.filter(d => d.category === 'meal').length },
    { id: 'home', label: 'Rumah & Bersih', icon: '🏠', count: ALL_DUA_LIST.filter(d => d.category === 'home').length },
    { id: 'study', label: 'Belajar & Ibadah', icon: '📚', count: ALL_DUA_LIST.filter(d => d.category === 'study').length },
    { id: 'activity', label: 'Aktivitas Diri', icon: '✨', count: ALL_DUA_LIST.filter(d => d.category === 'activity').length },
    { id: 'travel', label: 'Bepergian & Cuaca', icon: '🚗', count: ALL_DUA_LIST.filter(d => d.category === 'travel').length },
  ];

  const filteredList = ALL_DUA_LIST.filter((dua) => {
    const matchesCategory = activeCategory === 'all' || dua.category === activeCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      query === '' ||
      dua.title.toLowerCase().includes(query) ||
      dua.latin.toLowerCase().includes(query) ||
      dua.translation.toLowerCase().includes(query) ||
      dua.number.toString() === query;
    return matchesCategory && matchesSearch;
  });

  const handleRecite = (dua: DuaItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    audioEngine.playChime(659.25);
    speakText(`${dua.title}. ${dua.latin}. Artinya: ${dua.translation}`, {
      pitch: character.voicePitch,
      rate: character.voiceRate,
    });
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-xl border-2 border-emerald-100/90" id="dua-catalog-section">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-emerald-100">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Koleksi Lengkap 25 Doa Harian Anak Muslim</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-800 mt-1">
            Pilih Doa Yang Ingin Dipelajari 🤲
          </h3>
        </div>

        {/* Global Memorization Counter */}
        <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-2xl shadow-md font-bold text-xs sm:text-sm self-start md:self-auto">
          <Star className="w-4 h-4 fill-white text-white" />
          <span>Prestasi Hafalan: {masteredIds.length} / 25 Doa</span>
        </div>
      </div>

      {/* Search Bar & Category Filters */}
      <div className="space-y-3 mb-6">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="dua-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari doa (contoh: makan, tidur, wudhu, orang tua, hujan, cermin)..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold bg-slate-200 hover:bg-slate-300 text-slate-700 px-2.5 py-1 rounded-full cursor-pointer"
            >
              Hapus
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  audioEngine.playPop(500);
                  setActiveCategory(cat.id);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-300'
                    : 'bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-800'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of 25 Dua Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {filteredList.map((dua) => {
          const isSelected = selectedDua.id === dua.id;
          const isMastered = masteredIds.includes(dua.id);

          return (
            <motion.div
              key={dua.id}
              id={`dua-card-${dua.id}`}
              onClick={() => {
                audioEngine.playPop(520);
                onSelectDua(dua);
              }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`relative p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-br from-emerald-50 via-teal-50/70 to-amber-50/40 border-emerald-500 shadow-lg ring-2 ring-emerald-200'
                  : 'bg-slate-50/80 hover:bg-emerald-50/40 border-slate-200/80 hover:border-emerald-300'
              }`}
            >
              <div>
                {/* Top Badge: Number, Category & Mastered Status */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-emerald-700 text-white font-black text-xs flex items-center justify-center shadow-sm">
                      #{dua.number}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                      {dua.categoryName}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      audioEngine.playPop(650);
                      onToggleMastered(dua.id);
                    }}
                    title={isMastered ? 'Sudah Hafal' : 'Tandai Hafal'}
                    className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                      isMastered
                        ? 'bg-amber-400 border-amber-500 text-amber-950 shadow-sm font-bold scale-105'
                        : 'bg-white hover:bg-amber-50 border-slate-200 text-slate-400 hover:text-amber-500'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${isMastered ? 'fill-amber-950' : ''}`} />
                  </button>
                </div>

                {/* Title */}
                <h4 className="text-base font-extrabold text-slate-800 mb-2 leading-snug">
                  {dua.title}
                </h4>

                {/* Arabic Excerpt */}
                <p
                  className="font-arabic text-lg sm:text-xl font-bold text-emerald-950 leading-relaxed mb-2 line-clamp-2"
                  dir="rtl"
                >
                  {dua.arabic}
                </p>

                {/* Latin */}
                <p className="text-xs font-bold text-slate-600 line-clamp-1 italic mb-1">
                  "{dua.latin}"
                </p>

                {/* Translation */}
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {dua.translation}
                </p>
              </div>

              {/* Bottom Card Controls */}
              <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between gap-2">
                <button
                  onClick={(e) => handleRecite(dua, e)}
                  className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-100/60 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Dengar</span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    audioEngine.playPop(520);
                    onPracticeDua(dua);
                  }}
                  className="text-xs font-bold text-amber-700 hover:text-amber-900 bg-amber-100/60 hover:bg-amber-100 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                >
                  Latihan 🎙️
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredList.length === 0 && (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
          <p className="text-slate-500 text-sm font-semibold">
            Tidak ditemukan doa dengan kata kunci "{searchQuery}".
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('all');
            }}
            className="mt-3 text-xs font-bold text-emerald-600 hover:underline"
          >
            Tampilkan Semua 25 Doa
          </button>
        </div>
      )}
    </div>
  );
};
