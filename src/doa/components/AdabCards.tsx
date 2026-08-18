import React from 'react';
import { motion } from 'motion/react';
import { ADAB_ITEMS } from '../data/doaData';
import { Sparkles, Utensils, Hand, Wind, HeartHandshake, Armchair, Check } from 'lucide-react';
import { speakText, audioEngine } from '../utils/audio';

export const AdabCards: React.FC = () => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Sparkles':
        return <Sparkles className="w-6 h-6" />;
      case 'Armchair':
        return <Armchair className="w-6 h-6" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-6 h-6" />;
      case 'Hand':
        return <Hand className="w-6 h-6" />;
      case 'Wind':
        return <Wind className="w-6 h-6" />;
      case 'Utensils':
        return <Utensils className="w-6 h-6" />;
      default:
        return <Check className="w-6 h-6" />;
    }
  };

  const handleCardClick = (item: (typeof ADAB_ITEMS)[0]) => {
    audioEngine.playPop(550);
    speakText(`Adab nomor ${item.id}: ${item.title}. ${item.desc}. Sunnah: ${item.sunnah}`, {
      pitch: 1.25,
      rate: 0.88,
    });
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-emerald-100/90" id="adab-cards-section">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-emerald-100">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
            <Utensils className="w-4 h-4" />
            <span>Sunnah Rasulullah SAW</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-800 mt-1">
            6 Adab Makan Anak Shalih & Shalihah 🍽️
          </h3>
        </div>
        <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full font-medium self-start sm:self-auto">
          Klik kartu untuk mendengarkan audio
        </span>
      </div>

      {/* 6 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ADAB_ITEMS.map((item) => (
          <motion.div
            key={item.id}
            id={`adab-card-${item.id}`}
            onClick={() => handleCardClick(item)}
            whileHover={{ scale: 1.03, y: -3 }}
            whileTap={{ scale: 0.97 }}
            className="group relative p-5 rounded-2xl bg-gradient-to-b from-slate-50 to-emerald-50/30 border border-slate-200/80 hover:border-emerald-400 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${item.color} text-white flex items-center justify-center shadow-md shadow-emerald-900/10`}
                >
                  {getIcon(item.iconName)}
                </div>
                <span className="text-xs font-black text-slate-400 group-hover:text-emerald-600">
                  Adab #{item.id}
                </span>
              </div>

              {/* Title & Desc */}
              <h4 className="text-base font-extrabold text-slate-800 group-hover:text-emerald-800 mb-1.5 transition-colors">
                {item.title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                {item.desc}
              </p>
            </div>

            {/* Sunnah Note */}
            <div className="mt-2 pt-2.5 border-t border-slate-200/60 flex items-start gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-100/50 p-2 rounded-xl">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>{item.sunnah}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
