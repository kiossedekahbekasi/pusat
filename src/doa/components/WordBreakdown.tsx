import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ALL_DUA_LIST } from '../data/allDuaList';
import { DuaItem } from '../types';
import { Volume2, Sparkles, BookOpen } from 'lucide-react';
import { speakText, audioEngine } from '../utils/audio';

interface WordBreakdownProps {
  activeDua?: DuaItem;
  onSelectDua?: (dua: DuaItem) => void;
}

export const WordBreakdown: React.FC<WordBreakdownProps> = ({
  activeDua,
  onSelectDua,
}) => {
  const fallbackDua = activeDua || ALL_DUA_LIST[0];
  const [selectedDua, setSelectedDua] = useState<DuaItem>(fallbackDua);
  const [selectedWordIdx, setSelectedWordIdx] = useState<number>(0);

  useEffect(() => {
    if (activeDua) {
      setSelectedDua(activeDua);
      setSelectedWordIdx(0);
    }
  }, [activeDua]);

  // Split Latin into words
  const latinWords = selectedDua.latin.split(' ').filter(Boolean);

  const handleWordClick = (word: string, index: number) => {
    setSelectedWordIdx(index);
    audioEngine.playChime(659.25);
    speakText(`${word}`, {
      pitch: 1.25,
      rate: 0.82,
    });
  };

  const handlePlayFull = () => {
    audioEngine.playChime(587.33);
    speakText(`${selectedDua.title}. ${selectedDua.latin}. Artinya: ${selectedDua.translation}`, {
      pitch: 1.2,
      rate: 0.85,
    });
  };

  const handleDuaChange = (dua: DuaItem) => {
    setSelectedDua(dua);
    setSelectedWordIdx(0);
    if (onSelectDua) onSelectDua(dua);
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-xl border-2 border-emerald-100/80" id="word-breakdown-section">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-emerald-100">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Belajar Lafaz & Arti 25 Doa Harian</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-800 mt-1">
            Sentuh Potongan Kata Untuk Belajar 👆
          </h3>
        </div>

        {/* 25 Dua Selector Dropdown */}
        <div className="flex items-center gap-2">
          <select
            value={selectedDua.id}
            onChange={(e) => {
              const found = ALL_DUA_LIST.find((d) => d.id === Number(e.target.value));
              if (found) handleDuaChange(found);
            }}
            className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl px-4 py-2 text-xs sm:text-sm font-extrabold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            {ALL_DUA_LIST.map((d) => (
              <option key={d.id} value={d.id}>
                #{d.number} - {d.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Full Arabic Calligraphy Display */}
      <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-amber-50/50 p-6 rounded-3xl border-2 border-emerald-200 text-center mb-6 shadow-inner">
        <span className="text-xs font-black tracking-widest text-emerald-700 uppercase block mb-2">
          Lafaz Doa (#{selectedDua.number}: {selectedDua.title})
        </span>
        <p className="font-arabic text-3xl sm:text-4xl font-bold text-emerald-950 leading-loose" dir="rtl">
          {selectedDua.arabic}
        </p>

        {/* Latin Translation */}
        <div className="mt-4 pt-3 border-t border-emerald-200/70">
          <p className="text-base sm:text-lg font-black text-slate-800">
            "{selectedDua.latin}"
          </p>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 italic">
            Artinya: "{selectedDua.translation}"
          </p>
        </div>

        <button
          onClick={handlePlayFull}
          className="mt-4 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold px-5 py-2.5 rounded-full shadow-md cursor-pointer transition-colors"
        >
          <Volume2 className="w-4 h-4" />
          <span>Dengarkan Seluruh Doa 🔊</span>
        </button>
      </div>

      {/* Interactive Word Chips */}
      <div className="mb-6">
        <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-3">
          Ketuk kata-kata di bawah ini untuk belajar membaca per kata:
        </h4>
        <div className="flex flex-wrap gap-2.5">
          {latinWords.map((word, idx) => {
            const isSelected = selectedWordIdx === idx;
            return (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleWordClick(word, idx)}
                className={`px-4 py-3 rounded-2xl text-center font-bold text-sm sm:text-base cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-300'
                    : 'bg-slate-50 hover:bg-emerald-50 text-slate-800 border-slate-200'
                }`}
              >
                <span>{word}</span>
                <span className="block text-[10px] opacity-75 mt-0.5">#{idx + 1}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Meaning & Hikmah Card */}
      <div className="bg-amber-50/80 border border-amber-200 p-4 sm:p-5 rounded-2xl text-xs sm:text-sm text-amber-950">
        <div className="font-black text-amber-900 flex items-center gap-1.5 uppercase mb-1">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>Hikmah & Manfaat Membaca {selectedDua.title}:</span>
        </div>
        <p className="leading-relaxed">{selectedDua.explanation}</p>
        {selectedDua.funFact && (
          <p className="mt-2 text-amber-800 font-semibold italic">★ {selectedDua.funFact}</p>
        )}
      </div>
    </div>
  );
};
