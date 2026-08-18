import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Printer, Sparkles } from 'lucide-react';
import { CharacterInfo, DuaItem } from '../types';
import { audioEngine } from '../utils/audio';
import { ALL_DUA_LIST } from '../data/allDuaList';

interface FlashcardModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: CharacterInfo;
  activeDua?: DuaItem;
}

export const FlashcardModal: React.FC<FlashcardModalProps> = ({
  isOpen,
  onClose,
  character,
  activeDua,
}) => {
  const fallbackDua = activeDua || ALL_DUA_LIST[0];
  const [selectedDua, setSelectedDua] = useState<DuaItem>(fallbackDua);
  const [printMode, setPrintMode] = useState<'single' | 'all'>('single');

  useEffect(() => {
    if (activeDua) {
      setSelectedDua(activeDua);
    }
  }, [activeDua, isOpen]);

  if (!isOpen) return null;

  const handlePrint = () => {
    audioEngine.playPop(500);
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto print:static print:bg-white print:backdrop-blur-none print:p-0 print:block">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-amber-300 my-6"
          id="printable-flashcard"
        >
          {/* Close button */}
          <button
            onClick={() => {
              audioEngine.playPop(350);
              onClose();
            }}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer print:hidden shadow"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Flashcard Header */}
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-6 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-28 h-28 rounded-full bg-white/10 blur-xl pointer-events-none" />
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Kartu Hafalan Doa Harian Anak Muslim</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-amber-200 uppercase">
              {printMode === 'single' ? selectedDua.title : 'Buku Saku 25 Doa Harian'}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 mt-1">
              Dipandu oleh {character.name} &bull; Seri Anak Muslim Shalih & Cerdas
            </p>
          </div>

          {/* Controls Bar (Print mode & Dua picker) */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 print:hidden">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPrintMode('single')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                  printMode === 'single'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-200'
                }`}
              >
                Cetak 1 Doa Pilihan
              </button>
              <button
                onClick={() => setPrintMode('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                  printMode === 'all'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-200'
                }`}
              >
                Cetak Semua 25 Doa
              </button>
            </div>

            {printMode === 'single' && (
              <select
                value={selectedDua.id}
                onChange={(e) => {
                  const found = ALL_DUA_LIST.find((d) => d.id === Number(e.target.value));
                  if (found) setSelectedDua(found);
                }}
                className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                {ALL_DUA_LIST.map((dua) => (
                  <option key={dua.id} value={dua.id}>
                    #{dua.number} - {dua.title}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Content Preview */}
          <div className="p-6 sm:p-8 max-h-[65vh] overflow-y-auto space-y-6">
            {printMode === 'single' ? (
              <>
                {/* Arabic Big Box */}
                <div className="bg-amber-50/70 border-2 border-dashed border-amber-300 rounded-2xl p-5 text-center shadow-inner">
                  <span className="text-xs font-black tracking-wider text-amber-800 uppercase block mb-2">
                    Lafaz Doa (#{selectedDua.number})
                  </span>
                  <p
                    className="font-arabic text-2xl sm:text-3xl font-bold text-emerald-950 leading-loose"
                    dir="rtl"
                  >
                    {selectedDua.arabic}
                  </p>
                </div>

                {/* Latin & Translation */}
                <div className="space-y-3">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="text-xs font-bold text-slate-500 block uppercase">
                      Bacaan Latin:
                    </span>
                    <p className="text-sm sm:text-base font-extrabold text-slate-800 mt-0.5">
                      "{selectedDua.latin}"
                    </p>
                  </div>

                  <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200">
                    <span className="text-xs font-bold text-emerald-700 block uppercase">
                      Artinya:
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-emerald-950 mt-0.5 leading-relaxed">
                      "{selectedDua.translation}"
                    </p>
                  </div>
                </div>

                {/* Explanation & Sunnah */}
                <div className="bg-teal-50/80 p-4 rounded-xl border border-teal-200 text-xs text-teal-950">
                  <span className="font-extrabold block text-teal-800 uppercase mb-1">
                    💡 Hikmah & Panduan Mengamalkan:
                  </span>
                  <p>{selectedDua.explanation}</p>
                  {selectedDua.funFact && (
                    <p className="mt-1 text-teal-700 italic">★ {selectedDua.funFact}</p>
                  )}
                </div>
              </>
            ) : (
              /* All 25 Doa List for Printable Booklet */
              <div className="space-y-4">
                <p className="text-xs text-slate-500 text-center font-bold">
                  Daftar Lengkap 25 Doa Harian Anak Muslim (Siap Cetak / Tempel)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ALL_DUA_LIST.map((dua) => (
                    <div
                      key={dua.id}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs"
                    >
                      <div className="flex items-center justify-between gap-1 font-bold text-emerald-800 mb-1">
                        <span>#{dua.number}. {dua.title}</span>
                        <span className="text-[10px] text-slate-500">{dua.categoryName}</span>
                      </div>
                      <p className="font-arabic text-sm text-right text-slate-900 mb-1" dir="rtl">
                        {dua.arabic}
                      </p>
                      <p className="font-semibold text-slate-700 text-[11px] italic">
                        "{dua.latin}"
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {dua.translation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 print:hidden">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-3 rounded-2xl shadow-lg cursor-pointer transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>{printMode === 'single' ? 'Cetak Kartu Ini' : 'Cetak 25 Doa Lengkap'}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
