import React, { useState } from 'react';
import { motion } from 'motion/react';
import { DuaVideoPlayer } from './components/DuaVideoPlayer';
import { WordBreakdown } from './components/WordBreakdown';
import { PracticeRecorder } from './components/PracticeRecorder';
import { AdabCards } from './components/AdabCards';
import { AdabQuiz } from './components/AdabQuiz';
import { FlashcardModal } from './components/FlashcardModal';
import { DuaCatalog } from './components/DuaCatalog';
import { CHARACTERS } from './data/doaData';
import { ALL_DUA_LIST } from './data/allDuaList';
import { CharacterInfo, DuaItem } from './types';
import {
  Sparkles,
  BookOpen,
  Award,
  Mic,
  Utensils,
  Printer,
  Star,
  Video,
  ListTree,
  Trophy,
  Music,
} from 'lucide-react';
import { audioEngine } from './utils/audio';

type DoaTab = 'video' | 'catalog' | 'words' | 'practice' | 'adab' | 'quiz';

export const DoaAnakApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DoaTab>('video');
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterInfo>(CHARACTERS[0]);
  const [selectedDua, setSelectedDua] = useState<DuaItem>(ALL_DUA_LIST[0]);
  const [masteredIds, setMasteredIds] = useState<number[]>([1, 2, 3, 4]);
  const [isFlashcardOpen, setIsFlashcardOpen] = useState(false);
  const [isBgmActive, setIsBgmActive] = useState(false);

  const toggleBgm = () => {
    const nextState = audioEngine.toggleBgm();
    setIsBgmActive(nextState);
  };

  const handleToggleMastered = (id: number) => {
    setMasteredIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleGoToPractice = (dua: DuaItem) => {
    setSelectedDua(dua);
    setActiveTab('practice');
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const tabs = [
    { id: 'video', label: 'Video Animasi', icon: Video, color: 'text-amber-600' },
    { id: 'catalog', label: '25 Doa Harian', icon: Star, color: 'text-yellow-500' },
    { id: 'words', label: 'Kata Per Kata', icon: ListTree, color: 'text-emerald-600' },
    { id: 'practice', label: 'Latihan Suara', icon: Mic, color: 'text-rose-600' },
    { id: 'adab', label: 'Adab Islami', icon: Utensils, color: 'text-blue-600' },
    { id: 'quiz', label: 'Kuis Ceria', icon: Trophy, color: 'text-purple-600' },
  ] as const;

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Interactive Greeting Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-emerald-900/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 rounded-full bg-amber-400/20 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 rounded-full bg-teal-400/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="text-center lg:text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-emerald-800/80 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-amber-300 border border-emerald-400/40 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Assalamu'alaikum Teman-Teman Shalih & Shalihah!</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              25 Doa Harian Anak Muslim & Video Animasi Interaktif 🤲
            </h2>
            <p className="text-sm sm:text-base text-emerald-100 mt-2 leading-relaxed">
              Belajar lengkap 25 doa sehari-hari dipandu karakter animasi ceria, audio pelafalan suara merdu, studio latihan rekam suara, dan kartu hafalan!
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                audioEngine.playPop(520);
                setActiveTab('catalog');
              }}
              className="flex items-center gap-2.5 bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-sm px-5 py-3.5 rounded-2xl shadow-lg shadow-amber-950/20 cursor-pointer transition-colors"
            >
              <BookOpen className="w-5 h-5 text-amber-950" />
              <span>Daftar 25 Doa ({masteredIds.length}/25 Hafal) ⭐</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsFlashcardOpen(true)}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-bold text-sm px-4 py-3.5 rounded-2xl border border-white/30 backdrop-blur-md cursor-pointer transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Kartu Doa</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Local Toolbar: Character Selector, BGM, Sub-Tabs */}
      <div className="bg-white rounded-3xl border-2 border-emerald-100 shadow-sm p-3 sm:p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 gap-1">
            {CHARACTERS.map((char) => {
              const isSelected = selectedCharacter.id === char.id;
              return (
                <button
                  key={char.id}
                  onClick={() => {
                    audioEngine.playPop(520);
                    setSelectedCharacter(char);
                  }}
                  title={`${char.name} (${char.role})`}
                  className={`px-2.5 sm:px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-white text-emerald-900 shadow-md ring-2 ring-emerald-500 font-extrabold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>{char.name}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => {
              audioEngine.playPop(480);
              toggleBgm();
            }}
            title={isBgmActive ? 'Matikan Musik Latar' : 'Nyalakan Musik Latar'}
            className={`p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isBgmActive
                ? 'bg-amber-400 text-amber-950 shadow-md font-extrabold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Music className="w-4 h-4" />
            <span className="hidden sm:inline">{isBgmActive ? 'Musik Aktif' : 'Musik'}</span>
          </button>
        </div>

        {/* Sub-Tab Navigation */}
        <nav className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  audioEngine.playPop(550);
                  setActiveTab(tab.id);
                }}
                className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 ring-2 ring-emerald-400'
                    : 'bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : tab.color}`} />
                <span>{tab.label}</span>
                {tab.id === 'catalog' && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${isActive ? 'bg-amber-400 text-amber-950' : 'bg-emerald-200 text-emerald-900'}`}>
                    {masteredIds.length}/25
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content Stage */}
      {activeTab === 'video' && (
        <section className="space-y-6">
          <DuaVideoPlayer
            character={selectedCharacter}
            selectedDua={selectedDua}
            onSelectDua={(dua) => setSelectedDua(dua)}
            masteredIds={masteredIds}
            onToggleMastered={handleToggleMastered}
            onGoToPractice={handleGoToPractice}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <motion.div
              whileHover={{ y: -4 }}
              onClick={() => setActiveTab('catalog')}
              className="bg-white p-6 rounded-3xl border-2 border-amber-100 shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4 font-black text-lg">
                  25
                </div>
                <h3 className="text-lg font-black text-slate-800">
                  Koleksi Lengkap 25 Doa
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  Jelajahi seluruh 25 doa sehari-hari mulai dari bangun tidur, bercermin, pakaian, wudhu, hingga naik kendaraan.
                </p>
              </div>
              <div className="mt-4 flex items-center text-xs font-bold text-amber-600">
                <span>Buka 25 Doa ➔</span>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              onClick={() => setActiveTab('practice')}
              className="bg-white p-6 rounded-3xl border-2 border-rose-100 shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mb-4">
                  <Mic className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-800">
                  Latihan Rekam Suaramu
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  Ayo hafalkan dan rekam suaramu membaca doa pilihan untuk mendapatkan 3 bintang prestasi!
                </p>
              </div>
              <div className="mt-4 flex items-center text-xs font-bold text-rose-600">
                <span>Mulai Latihan ➔</span>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              onClick={() => setActiveTab('quiz')}
              className="bg-white p-6 rounded-3xl border-2 border-purple-100 shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-800">
                  Kuis Cerdas Ceria
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  Uji pemahaman dan hafalan doa harian serta adab Islami lewat kuis bergambar interaktif yang seru.
                </p>
              </div>
              <div className="mt-4 flex items-center text-xs font-bold text-purple-600">
                <span>Mulai Kuis ➔</span>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {activeTab === 'catalog' && (
        <section className="space-y-6">
          <DuaCatalog
            selectedDua={selectedDua}
            onSelectDua={(dua) => {
              setSelectedDua(dua);
              setActiveTab('video');
              window.scrollTo({ top: 180, behavior: 'smooth' });
            }}
            masteredIds={masteredIds}
            onToggleMastered={handleToggleMastered}
            character={selectedCharacter}
            onPracticeDua={handleGoToPractice}
          />
        </section>
      )}

      {activeTab === 'words' && (
        <section className="space-y-6">
          <WordBreakdown
            activeDua={selectedDua}
            onSelectDua={(dua) => setSelectedDua(dua)}
          />
        </section>
      )}

      {activeTab === 'practice' && (
        <section className="space-y-6">
          <PracticeRecorder
            activeDua={selectedDua}
            onSelectDua={(dua) => setSelectedDua(dua)}
            character={selectedCharacter}
          />
        </section>
      )}

      {activeTab === 'adab' && (
        <section className="space-y-6">
          <AdabCards />
        </section>
      )}

      {activeTab === 'quiz' && (
        <section className="space-y-6">
          <AdabQuiz />
        </section>
      )}

      {/* Footer note */}
      <div className="text-center text-xs text-slate-500 pt-4">
        <p className="mt-1">
          "Barakallahu fiikum — Semoga menjadi anak yang shalih, shalihah, cerdas, dan berbakti kepada orang tua."
        </p>
      </div>

      {/* Printable Flashcard Modal */}
      <FlashcardModal
        isOpen={isFlashcardOpen}
        onClose={() => setIsFlashcardOpen(false)}
        character={selectedCharacter}
        activeDua={selectedDua}
      />
    </div>
  );
};
