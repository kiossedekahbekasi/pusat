import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { DuaItem, CharacterInfo } from '../types';
import { ALL_DUA_LIST } from '../data/allDuaList';
import { CharacterAvatar } from './CharacterAvatar';
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Maximize2,
  Minimize2,
  Sparkles,
  Repeat,
  Type,
  Star,
  Mic,
  BookOpen,
} from 'lucide-react';
import { speakText, stopSpeech, audioEngine } from '../utils/audio';

interface DuaVideoPlayerProps {
  character: CharacterInfo;
  selectedDua: DuaItem;
  onSelectDua: (dua: DuaItem) => void;
  masteredIds: number[];
  onToggleMastered: (id: number) => void;
  onGoToPractice: (dua: DuaItem) => void;
}

export const DuaVideoPlayer: React.FC<DuaVideoPlayerProps> = ({
  character,
  selectedDua,
  onSelectDua,
  masteredIds,
  onToggleMastered,
  onGoToPractice,
}) => {
  const currentDua = selectedDua || ALL_DUA_LIST[0];
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isAutoPlayNext, setIsAutoPlayNext] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [subtitleSize, setSubtitleSize] = useState<'md' | 'lg'>('md');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [characterAction, setCharacterAction] = useState<'wave' | 'pray' | 'talk' | 'cheer'>('pray');

  const containerRef = useRef<HTMLDivElement>(null);
  const currentIdx = ALL_DUA_LIST.findIndex((d) => d.id === currentDua.id);
  const isMastered = masteredIds.includes(currentDua.id);

  // Play narration & prayer audio for the selected dua
  const playDuaRecitation = (dua: DuaItem) => {
    const targetDua = dua || currentDua;
    stopSpeech();
    audioEngine.playChime(659.25);
    setIsSpeaking(true);
    setCharacterAction('pray');

    const greeting = `Assalamu'alaikum teman-teman! Mari kita baca ${targetDua.title} bersama-sama yaa.`;
    const fullSpeech = `${greeting} ... ${targetDua.latin}. Artinya: ${targetDua.translation}.`;

    speakText(fullSpeech, {
      lang: 'id-ID',
      pitch: character?.voicePitch ?? 1.2,
      rate: (character?.voiceRate ?? 0.85) * playbackSpeed,
      onStart: () => {
        setIsSpeaking(true);
        setCharacterAction('pray');
      },
      onEnd: () => {
        setIsSpeaking(false);
        setCharacterAction('cheer');
        if (isAutoPlayNext) {
          handleNextDua();
        } else {
          setIsPlaying(false);
        }
      },
    });
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      stopSpeech();
      setIsPlaying(false);
      setIsSpeaking(false);
      setCharacterAction('talk');
    } else {
      setIsPlaying(true);
      playDuaRecitation(currentDua);
    }
  };

  const handleSelectDuaByIdx = (idx: number) => {
    stopSpeech();
    const validIdx = (idx + ALL_DUA_LIST.length) % ALL_DUA_LIST.length;
    const targetDua = ALL_DUA_LIST[validIdx];
    onSelectDua(targetDua);
    if (isPlaying) {
      playDuaRecitation(targetDua);
    }
  };

  const handlePrevDua = () => {
    audioEngine.playPop(480);
    handleSelectDuaByIdx(currentIdx - 1);
  };

  const handleNextDua = () => {
    audioEngine.playPop(520);
    handleSelectDuaByIdx(currentIdx + 1);
  };

  const handleReplay = () => {
    audioEngine.playPop(500);
    setIsPlaying(true);
    playDuaRecitation(currentDua);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Switch background ambiance based on prayer category
  const getCategoryTheme = (category: string) => {
    switch (category) {
      case 'daily':
        return 'from-indigo-900/90 via-slate-900/80 to-amber-950/80';
      case 'meal':
        return 'from-emerald-950/90 via-teal-900/80 to-amber-950/80';
      case 'home':
        return 'from-teal-950/90 via-cyan-950/80 to-emerald-950/80';
      case 'study':
        return 'from-blue-950/90 via-indigo-950/80 to-purple-950/80';
      case 'activity':
        return 'from-rose-950/90 via-purple-950/80 to-amber-950/80';
      case 'travel':
        return 'from-sky-950/90 via-blue-950/80 to-slate-950/80';
      default:
        return 'from-emerald-950/90 via-teal-900/80 to-slate-900/90';
    }
  };

  return (
    <div
      ref={containerRef}
      id="video-player-root"
      className={`relative w-full rounded-3xl overflow-hidden shadow-2xl bg-slate-950 border-4 border-amber-400/90 transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none' : ''
      }`}
    >
      {/* 1. Video Canvas Stage */}
      <div className="relative aspect-video w-full min-h-[380px] sm:min-h-[460px] flex flex-col justify-between overflow-hidden select-none">
        {/* Animated Background Atmosphere */}
        <div className={`absolute inset-0 bg-gradient-to-tr ${getCategoryTheme(selectedDua.category)} transition-colors duration-700`} />

        {/* Ambient Floating Sparkles / Islamic Geometric Blobs */}
        <div className="absolute top-10 left-12 w-64 h-64 rounded-full bg-amber-400/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-12 w-72 h-72 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none" />

        {/* 2. Top Video Header HUD */}
        <div className="relative z-20 p-4 sm:p-6 flex items-center justify-between gap-3 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
          {/* Dua Title & Number Badge */}
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-amber-400 text-amber-950 font-black text-sm sm:text-base shadow-lg ring-2 ring-amber-200">
              #{currentDua.number}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-500/80 backdrop-blur-md text-white text-[10px] sm:text-xs font-black uppercase px-2.5 py-0.5 rounded-full border border-emerald-300/40">
                  {currentDua.categoryName}
                </span>
                <span className="text-white/70 text-xs font-semibold hidden sm:inline">
                  (Doa {currentIdx + 1} dari 25)
                </span>
              </div>
              <h2 className="text-white font-black text-sm sm:text-lg tracking-tight line-clamp-1 mt-0.5">
                {currentDua.title}
              </h2>
            </div>
          </div>

          {/* Quick HUD Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Mastered Star Toggle */}
            <button
              id="hud-star-toggle"
              onClick={() => {
                audioEngine.playPop(650);
                onToggleMastered(currentDua.id);
              }}
              title={isMastered ? 'Sudah Dihafal' : 'Tandai Hafal'}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md ${
                isMastered
                  ? 'bg-amber-400 text-amber-950 font-black ring-2 ring-amber-200'
                  : 'bg-black/50 hover:bg-black/70 text-white/90 border border-white/20'
              }`}
            >
              <Star className={`w-4 h-4 ${isMastered ? 'fill-amber-950 text-amber-950' : 'text-amber-400'}`} />
              <span className="hidden sm:inline">{isMastered ? 'Hafal ⭐' : 'Tandai Hafal'}</span>
            </button>

            {/* Direct Voice Practice Button */}
            <button
              onClick={() => {
                audioEngine.playPop(520);
                onGoToPractice(currentDua);
              }}
              title="Latihan Rekam Suara"
              className="flex items-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-md cursor-pointer transition-colors"
            >
              <Mic className="w-4 h-4" />
              <span className="hidden sm:inline">Latihan Suara</span>
            </button>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              title="Layar Penuh"
              className="p-2 rounded-xl bg-black/40 hover:bg-black/60 text-white border border-white/20 cursor-pointer transition-colors"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 3. Center Interactive Character & Dua Stage */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-8 py-2">
          {/* Animated 3D Character Avatar Rig */}
          <div className="transform scale-90 sm:scale-100 transition-transform mb-2">
            <CharacterAvatar
              character={character}
              characterId={character?.id}
              action={characterAction}
              isSpeaking={isSpeaking}
              size="md"
              onClick={() => {
                audioEngine.playPop(600);
                handleTogglePlay();
              }}
            />
          </div>

          {/* Sapaan Ramah Sahabat Teman-Teman */}
          <div className="bg-amber-400/90 text-amber-950 px-3.5 py-1 rounded-full text-xs sm:text-sm font-extrabold shadow-lg mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Assalamu'alaikum Teman-Teman! Yuk Baca {currentDua.title} 🤲</span>
          </div>

          {/* Central Calligraphy Subtitle Card */}
          <motion.div
            key={currentDua.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-3xl bg-black/60 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/20 shadow-2xl text-center"
          >
            {/* Arabic Text */}
            <p
              className={`font-arabic font-bold text-amber-300 leading-relaxed tracking-wide ${
                subtitleSize === 'lg' ? 'text-2xl sm:text-4xl' : 'text-xl sm:text-3xl'
              }`}
              dir="rtl"
            >
              {currentDua.arabic}
            </p>

            {/* Latin Transliteration */}
            <p className="text-white font-extrabold text-xs sm:text-base mt-2 text-shadow">
              "{currentDua.latin}"
            </p>

            {/* Translation */}
            <p className="text-emerald-200/90 text-xs sm:text-sm mt-1 italic leading-relaxed">
              Artinya: "{currentDua.translation}"
            </p>
          </motion.div>
        </div>

        {/* 4. Bottom Video Player Controller Bar */}
        <div className="relative z-20 bg-gradient-to-t from-black/95 via-black/85 to-transparent px-4 sm:px-6 pt-2 pb-4">
          {/* Main Controls Row */}
          <div className="flex items-center justify-between gap-3">
            {/* Left: Previous, Play/Pause, Next, Replay */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Prev Dua Button */}
              <button
                id="btn-prev-dua"
                onClick={handlePrevDua}
                title="Doa Sebelumnya"
                className="p-2 sm:p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              {/* Main Play / Pause Button */}
              <motion.button
                id="btn-play-pause-main"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={handleTogglePlay}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 flex items-center justify-center shadow-xl shadow-amber-500/30 cursor-pointer font-black"
                title={isPlaying ? 'Jeda Suara' : 'Putar Suara Doa'}
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-amber-950" /> : <Play className="w-6 h-6 fill-amber-950 ml-0.5" />}
              </motion.button>

              {/* Next Dua Button */}
              <button
                id="btn-next-dua"
                onClick={handleNextDua}
                title="Doa Selanjutnya"
                className="p-2 sm:p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
              >
                <SkipForward className="w-5 h-5" />
              </button>

              {/* Replay Button */}
              <button
                id="btn-replay-dua"
                onClick={handleReplay}
                title="Ulangi Doa"
                className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">Ulangi</span>
              </button>
            </div>

            {/* Right: Auto Next Toggle, Playback Speed, Font Size */}
            <div className="flex items-center gap-2">
              {/* Auto Play Next Toggle */}
              <button
                onClick={() => {
                  audioEngine.playPop(480);
                  setIsAutoPlayNext(!isAutoPlayNext);
                }}
                title={isAutoPlayNext ? 'Putar Otomatis 25 Doa: Aktif' : 'Putar Otomatis: Nonaktif'}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                  isAutoPlayNext
                    ? 'bg-emerald-500 text-white shadow-md'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                <Repeat className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Putar Terus 25 Doa</span>
              </button>

              {/* Speed Switcher */}
              <button
                onClick={() => {
                  const speeds = [0.8, 1.0, 1.2];
                  const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
                  setPlaybackSpeed(speeds[nextIdx]);
                }}
                title="Kecepatan Suara"
                className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer"
              >
                {playbackSpeed}x
              </button>

              {/* Text Size Switcher */}
              <button
                onClick={() => setSubtitleSize(subtitleSize === 'md' ? 'lg' : 'md')}
                title="Ukuran Huruf Arab"
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <Type className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Bottom 25 Doa Fast Carousel Navigation (Replaces old video scenes) */}
      <div className="bg-slate-900 border-t border-slate-800 p-3 sm:p-4">
        <div className="flex items-center justify-between gap-2 mb-2 px-1">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
            <BookOpen className="w-4 h-4" />
            <span>Pilih Cepat Dari 25 Doa Harian:</span>
          </div>
          <span className="text-[11px] font-semibold text-slate-400">
            Geser untuk melihat semua 25 doa ➔
          </span>
        </div>

        {/* 25 Doa Buttons Scrollable Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700">
          {ALL_DUA_LIST.map((dua) => {
            const isCurrent = dua.id === selectedDua.id;
            const isDuaMastered = masteredIds.includes(dua.id);

            return (
              <button
                key={dua.id}
                id={`carousel-dua-${dua.id}`}
                onClick={() => {
                  audioEngine.playPop(520);
                  onSelectDua(dua);
                  if (isPlaying) {
                    playDuaRecitation(dua);
                  }
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 border ${
                  isCurrent
                    ? 'bg-amber-400 text-amber-950 border-amber-300 shadow-lg scale-105 font-extrabold'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
              >
                <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black ${
                  isCurrent ? 'bg-amber-950 text-white' : 'bg-slate-700 text-amber-300'
                }`}>
                  #{dua.number}
                </span>
                <span>{dua.title}</span>
                {isDuaMastered && (
                  <Star className={`w-3.5 h-3.5 ${isCurrent ? 'fill-amber-950 text-amber-950' : 'fill-amber-400 text-amber-400'}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
