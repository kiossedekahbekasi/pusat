import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CharacterInfo, CharacterId } from '../types';
import { CHARACTERS } from '../data/doaData';
import { Sparkles, Volume2, Heart, Star } from 'lucide-react';
import { audioEngine } from '../utils/audio';

interface CharacterAvatarProps {
  character?: CharacterInfo;
  characterId?: CharacterId;
  action: 'wave' | 'pray' | 'talk' | 'eat' | 'cheer';
  isSpeaking: boolean;
  dialogue?: string;
  onTapCharacter?: () => void;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg' | 'hero';
}

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  character,
  characterId,
  action,
  isSpeaking,
  dialogue,
  onTapCharacter,
  onClick,
  size = 'md',
}) => {
  const [blink, setBlink] = useState(false);
  const [showHearts, setShowHearts] = useState(false);

  // Safe character resolution
  const resolvedChar =
    character ||
    CHARACTERS.find((c) => c.id === characterId) ||
    CHARACTERS[0];

  // Periodic blinking effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 180);
    }, 3200 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  const handleInteraction = () => {
    audioEngine.playPop(580);
    setShowHearts(true);
    setTimeout(() => setShowHearts(false), 1600);
    if (onClick) onClick();
    if (onTapCharacter) onTapCharacter();
  };

  const isArfita = resolvedChar.id === 'arfita' || resolvedChar.id === 'aisyah' || resolvedChar.id === 'salma';
  const isMunif = resolvedChar.id === 'munif' || resolvedChar.id === 'rayyan' || resolvedChar.id === 'bilal';

  // Sizing styles
  const sizeClasses = {
    sm: 'w-24 h-28',
    md: 'w-36 h-44 sm:w-40 sm:h-48',
    lg: 'w-48 h-56',
    hero: 'w-56 h-64 sm:w-64 sm:h-72',
  }[size];

  const photoSizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-28 h-28 sm:w-32 sm:h-32',
    lg: 'w-36 h-36',
    hero: 'w-44 h-44 sm:w-48 sm:h-48',
  }[size];

  return (
    <div className="relative flex flex-col items-center select-none" id={`character-${resolvedChar.id}`}>
      {/* Floating Dialogue Bubble */}
      <AnimatePresence>
        {dialogue && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="mb-2 max-w-xs sm:max-w-sm px-4 py-2.5 bg-white/95 backdrop-blur-md text-slate-800 rounded-2xl shadow-xl border-2 border-amber-300 text-center relative z-20"
          >
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-600 mb-0.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
              <span>{resolvedChar.name} ({resolvedChar.role})</span>
            </div>
            <p className="text-xs sm:text-sm font-medium leading-snug text-slate-700">
              "{dialogue}"
            </p>
            {/* Bubble arrow pointer */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-b-2 border-r-2 border-amber-300"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Heart / Star Particles on click */}
      <AnimatePresence>
        {showHearts && (
          <div className="absolute -top-10 flex gap-2 pointer-events-none z-30">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 1, y: 0, scale: 0.5 }}
                animate={{ opacity: 0, y: -40 - i * 15, scale: 1.2, x: (i - 1) * 25 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="text-pink-500"
              >
                {i % 2 === 0 ? <Heart className="w-6 h-6 fill-pink-500" /> : <Star className="w-6 h-6 fill-amber-400 text-amber-400" />}
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Character Interactive Canvas / Animated Portrait Rig */}
      <motion.div
        className={`relative ${sizeClasses} cursor-pointer group flex flex-col items-center justify-center`}
        onClick={handleInteraction}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          y: action === 'cheer' ? [0, -12, 0] : isSpeaking ? [0, -5, 0] : [0, -3, 0],
          rotate: action === 'wave' ? [-2, 2, -2] : [0, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: action === 'cheer' ? 1.0 : isSpeaking ? 1.4 : 2.8,
          ease: 'easeInOut',
        }}
      >
        {/* Glow halo when praying or speaking */}
        {(action === 'pray' || isSpeaking) && (
          <motion.div
            className="absolute inset-0 rounded-full bg-amber-300/40 blur-xl pointer-events-none"
            animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.85, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
          />
        )}

        {resolvedChar.imageSrc ? (
          /* Real High-Quality Character Photo Frame */
          <div className="relative flex flex-col items-center">
            {/* Outer Animated Ring */}
            <motion.div
              className={`relative ${photoSizeClasses} rounded-full p-1 shadow-2xl bg-gradient-to-br ${
                resolvedChar.id === 'arfita'
                  ? 'from-emerald-400 via-teal-300 to-emerald-600'
                  : 'from-amber-400 via-yellow-200 to-amber-600'
              }`}
              animate={isSpeaking ? { scale: [1, 1.06, 1], rotate: [0, 1, -1, 0] } : { scale: 1 }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            >
              <div className="w-full h-full rounded-full overflow-hidden border-3 border-white shadow-inner bg-slate-100">
                <img
                  src={resolvedChar.imageSrc}
                  alt={resolvedChar.name}
                  className="w-full h-full object-cover object-top filter brightness-105"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Status Action Indicator Badge */}
              <div className="absolute -bottom-1 -right-1 bg-amber-400 text-amber-950 p-1.5 rounded-full shadow-lg border-2 border-white">
                {action === 'pray' ? (
                  <span className="text-xs font-bold leading-none">🤲</span>
                ) : action === 'wave' ? (
                  <span className="text-xs font-bold leading-none">👋</span>
                ) : isSpeaking ? (
                  <Volume2 className="w-3.5 h-3.5 text-amber-950 animate-pulse" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-amber-950" />
                )}
              </div>
            </motion.div>

            {/* Nameplate Pill */}
            <div className="mt-1.5 px-3 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/30 text-white shadow-lg text-center">
              <p className="text-xs font-black tracking-tight">{resolvedChar.name}</p>
              <p className="text-[10px] text-amber-300 font-semibold">{resolvedChar.role}</p>
            </div>
          </div>
        ) : (
          /* SVG Rig Fallback */
          <svg
            viewBox="0 0 200 240"
            className="w-full h-full drop-shadow-2xl overflow-visible"
          >
            {/* Defs for gradients & shadows */}
            <defs>
              <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFE0BD" />
                <stop offset="100%" stopColor="#F5C6A5" />
              </linearGradient>
              <linearGradient id="hijabGradAisyah" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34D399" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <linearGradient id="robeGradRayyan" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#0284C7" />
              </linearGradient>
            </defs>

            {/* Clothes / Body */}
            <path
              d="M 60 170 C 40 180, 30 220, 20 240 L 180 240 C 170 220, 160 180, 140 170 Z"
              fill={isArfita ? '#047857' : '#0369A1'}
            />
            
            {/* Inner Shirt Collar */}
            <path
              d="M 85 160 Q 100 175 115 160 L 120 185 Q 100 200 80 185 Z"
              fill="#FFFFFF"
            />

            {/* Hijab Drape for Arfita */}
            {isArfita && (
              <path
                d="M 50 120 Q 30 180 55 210 Q 100 225 145 210 Q 170 180 150 120 Z"
                fill="url(#hijabGradAisyah)"
                filter="drop-shadow(0px 4px 6px rgba(0,0,0,0.15))"
              />
            )}

            {/* Neck */}
            <rect x="90" y="130" width="20" height="25" rx="5" fill="url(#skinGrad)" />

            {/* Head Base */}
            <ellipse cx="100" cy="105" rx="42" ry="46" fill="url(#skinGrad)" />

            {/* Boys Hair & Peci for Munif */}
            {isMunif && (
              <>
                <path
                  d="M 55 100 C 50 70, 70 50, 100 50 C 130 50, 150 70, 145 100 Z"
                  fill="#292524"
                />
                <path
                  d="M 55 75 C 55 50, 145 50, 145 75 L 148 90 C 148 95, 52 95, 52 90 Z"
                  fill="#0F172A"
                />
                <path
                  d="M 53 88 Q 100 93 147 88"
                  stroke="#F59E0B"
                  strokeWidth="2.5"
                  fill="none"
                />
              </>
            )}

            {/* Hijab Framing for Arfita */}
            {isArfita && (
              <path
                d="M 55 110 C 52 60, 70 45, 100 45 C 130 45, 148 60, 145 110 C 145 140, 135 155, 100 155 C 65 155, 55 140, 55 110 Z"
                fill="url(#hijabGradAisyah)"
              />
            )}

            {/* Face Area inside Hijab */}
            {isArfita && (
              <path
                d="M 68 100 C 68 75, 80 68, 100 68 C 120 68, 132 75, 132 100 C 132 125, 120 142, 100 142 C 80 142, 68 125, 68 100 Z"
                fill="url(#skinGrad)"
              />
            )}

            {/* Cute Rosy Cheeks */}
            <circle cx="78" cy="115" r="7" fill="#FB7185" opacity="0.45" />
            <circle cx="122" cy="115" r="7" fill="#FB7185" opacity="0.45" />

            {/* Eyebrows */}
            <path d="M 74 88 Q 83 83 91 88" stroke="#451A03" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M 109 88 Q 117 83 126 88" stroke="#451A03" strokeWidth="3" strokeLinecap="round" fill="none" />

            {/* Eyes */}
            {blink ? (
              <>
                <path d="M 75 102 Q 83 107 91 102" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                <path d="M 109 102 Q 117 107 125 102" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              </>
            ) : (
              <>
                <ellipse cx="83" cy="100" rx="6.5" ry="8" fill="#1E293B" />
                <circle cx="81" cy="98" r="2.5" fill="#FFFFFF" />
                <circle cx="85" cy="103" r="1.2" fill="#FFFFFF" />
                
                <ellipse cx="117" cy="100" rx="6.5" ry="8" fill="#1E293B" />
                <circle cx="115" cy="98" r="2.5" fill="#FFFFFF" />
                <circle cx="119" cy="103" r="1.2" fill="#FFFFFF" />
              </>
            )}

            {/* Nose */}
            <path d="M 98 108 Q 100 112 102 108" stroke="#D97706" strokeWidth="2" strokeLinecap="round" fill="none" />

            {/* Mouth */}
            {isSpeaking ? (
              <motion.path
                d="M 88 122 Q 100 138 112 122 Q 100 130 88 122"
                fill="#E11D48"
                animate={{
                  d: [
                    "M 90 123 Q 100 134 110 123 Q 100 128 90 123",
                    "M 86 120 Q 100 142 114 120 Q 100 135 86 120",
                    "M 90 123 Q 100 134 110 123 Q 100 128 90 123",
                  ],
                }}
                transition={{ repeat: Infinity, duration: 0.25 }}
              />
            ) : (
              <path d="M 88 122 Q 100 134 112 122" stroke="#E11D48" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            )}
          </svg>
        )}

        {/* Interactive hint badge */}
        <div className="mt-1 bg-emerald-600/90 hover:bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-md backdrop-blur-sm flex items-center gap-1 border border-emerald-400">
          <Volume2 className="w-3 h-3 animate-pulse" />
          <span>Klik Aku!</span>
        </div>
      </motion.div>
    </div>
  );
};
