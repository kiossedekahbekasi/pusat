import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Square, Play, RotateCcw, Award, Sparkles, Volume2, ThumbsUp, ChevronDown } from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioEngine, speakText } from '../utils/audio';
import { DuaItem, CharacterInfo } from '../types';
import { ALL_DUA_LIST } from '../data/allDuaList';

interface PracticeRecorderProps {
  activeDua?: DuaItem;
  onSelectDua?: (dua: DuaItem) => void;
  character?: CharacterInfo;
}

export const PracticeRecorder: React.FC<PracticeRecorderProps> = ({
  activeDua,
  onSelectDua,
  character,
}) => {
  const currentDua = activeDua || ALL_DUA_LIST[0];
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlayingBack, setIsPlayingBack] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  useEffect(() => {
    if (activeDua) {
      setAudioUrl(null);
      setFeedbackGiven(false);
    }
  }, [activeDua]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = async () => {
    try {
      audioEngine.playPop(500);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        setFeedbackGiven(true);
        triggerPraise();
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      setAudioUrl(null);
      setFeedbackGiven(false);

      timerRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch {
      // Fallback simulation if microphone not granted
      simulatePractice();
    }
  };

  const simulatePractice = () => {
    setIsRecording(true);
    setRecordingSeconds(0);
    timerRef.current = window.setInterval(() => {
      setRecordingSeconds((prev) => {
        if (prev >= 4) {
          stopRecordingSimulated();
          return 5;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopRecordingSimulated = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRecording(false);
    setFeedbackGiven(true);
    triggerPraise();
  };

  const stopRecording = () => {
    audioEngine.playPop(400);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    } else {
      stopRecordingSimulated();
    }
    setIsRecording(false);
  };

  const triggerPraise = () => {
    audioEngine.playSuccess();
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#10B981', '#F59E0B', '#3B82F6', '#EC4899'],
    });
    speakText(`Maa syaa Allah, bacaan ${currentDua.title} kamu hebat sekali adik pintar! Barakallahu fiik!`, {
      pitch: character?.voicePitch || 1.3,
      rate: character?.voiceRate || 0.88,
    });
  };

  const playRecordedAudio = () => {
    if (audioUrl) {
      if (!audioPlayerRef.current) {
        audioPlayerRef.current = new Audio(audioUrl);
        audioPlayerRef.current.onended = () => setIsPlayingBack(false);
      }
      setIsPlayingBack(true);
      audioPlayerRef.current.play();
    }
  };

  const resetRecording = () => {
    audioEngine.playPop(350);
    setAudioUrl(null);
    setFeedbackGiven(false);
    setIsPlayingBack(false);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }
  };

  const handleListenDua = () => {
    audioEngine.playChime(659.25);
    speakText(`${currentDua.title}. ${currentDua.latin}. Artinya: ${currentDua.translation}`, {
      pitch: character?.voicePitch || 1.25,
      rate: character?.voiceRate || 0.85,
    });
  };

  return (
    <div className="bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-800 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden" id="practice-recorder-section">
      {/* Background Islamic Geometric / Sparkle Watermark */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-44 h-44 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-44 h-44 rounded-full bg-emerald-400/20 blur-2xl pointer-events-none" />

      {/* Target Dua Quick Switcher Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-emerald-500/40">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-amber-400 text-amber-950 font-black text-xs flex items-center justify-center shadow-md">
            #{currentDua.number}
          </span>
          <div>
            <span className="text-xs text-emerald-200 uppercase font-bold tracking-wider block">
              Sedang Dilatih:
            </span>
            <span className="text-base sm:text-lg font-black text-white">
              {currentDua.title}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleListenDua}
            className="flex items-center gap-1.5 bg-emerald-800/80 hover:bg-emerald-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl border border-emerald-400/30 transition-colors cursor-pointer"
          >
            <Volume2 className="w-4 h-4 text-amber-300" />
            <span>Contoh Suara</span>
          </button>

          {onSelectDua && (
            <div className="relative">
              <button
                onClick={() => setIsSelectorOpen(!isSelectorOpen)}
                className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-3.5 py-2 rounded-xl backdrop-blur-sm transition-colors cursor-pointer border border-white/20"
              >
                <span>Ganti Doa (25 Pilihan)</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {isSelectorOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 max-h-60 overflow-y-auto bg-slate-900/95 backdrop-blur-md rounded-2xl p-2 border border-slate-700 shadow-2xl z-50">
                  {ALL_DUA_LIST.map((dua) => (
                    <button
                      key={dua.id}
                      onClick={() => {
                        onSelectDua(dua);
                        setIsSelectorOpen(false);
                        resetRecording();
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                        currentDua.id === dua.id
                          ? 'bg-emerald-600 text-white'
                          : 'text-slate-200 hover:bg-white/10'
                      }`}
                    >
                      <span className="truncate">{dua.number}. {dua.title}</span>
                      <span className="text-[10px] text-emerald-300 shrink-0 ml-2">{dua.categoryName}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left flex-1">
          <div className="inline-flex items-center gap-1.5 bg-emerald-800/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-emerald-200 border border-emerald-400/30 mb-2">
            <Mic className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>Studio Hafalan & Rekam Mandiri</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Yuk Rekam & Dengarkan Suaramu! 🎙️
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1 leading-relaxed">
            Tekan tombol rekam di samping, lalu bacakan lafaz doa berikut:
          </p>

          <div className="bg-emerald-800/50 p-4 rounded-2xl border border-emerald-400/30 my-3 text-center md:text-left">
            <p className="font-arabic text-xl sm:text-2xl text-amber-200 font-bold leading-relaxed" dir="rtl">
              {currentDua.arabic}
            </p>
            <p className="text-xs sm:text-sm font-bold text-white mt-1">
              "{currentDua.latin}"
            </p>
          </div>
        </div>

        {/* Controls Container */}
        <div className="flex flex-col items-center gap-3 w-full md:w-auto shrink-0">
          {!isRecording && !audioUrl && (
            <motion.button
              id="btn-start-record"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={startRecording}
              className="flex items-center gap-3 bg-amber-400 hover:bg-amber-300 text-amber-950 font-extrabold text-base sm:text-lg px-8 py-4 rounded-2xl shadow-xl shadow-amber-950/20 border-2 border-amber-200 cursor-pointer transition-transform"
            >
              <div className="p-2 bg-amber-500/40 rounded-full">
                <Mic className="w-6 h-6 text-amber-950" />
              </div>
              <span>Mulai Rekam Suara</span>
            </motion.button>
          )}

          {isRecording && (
            <div className="flex flex-col items-center gap-3">
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="flex items-center gap-2 bg-red-500/90 text-white font-bold px-4 py-1.5 rounded-full text-sm shadow-md"
              >
                <div className="w-3 h-3 rounded-full bg-white animate-ping" />
                <span>Merekam: 00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}</span>
              </motion.div>

              <motion.button
                id="btn-stop-record"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                onClick={stopRecording}
                className="flex items-center gap-2.5 bg-white hover:bg-slate-100 text-red-600 font-extrabold text-base px-6 py-3.5 rounded-2xl shadow-lg cursor-pointer"
              >
                <Square className="w-5 h-5 fill-red-600" />
                <span>Selesai Membaca</span>
              </motion.button>
            </div>
          )}

          {/* Feedback & Playback After Recording */}
          {feedbackGiven && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col sm:flex-row items-center gap-3"
            >
              {audioUrl && (
                <motion.button
                  id="btn-playback-recording"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={playRecordedAudio}
                  className="flex items-center gap-2 bg-white text-emerald-800 font-bold px-5 py-3 rounded-xl shadow-md cursor-pointer hover:bg-emerald-50"
                >
                  <Play className={`w-4 h-4 ${isPlayingBack ? 'text-emerald-500' : ''}`} />
                  <span>{isPlayingBack ? 'Memutar Suaramu...' : 'Dengar Rekaman'}</span>
                </motion.button>
              )}

              <motion.button
                id="btn-retry-record"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetRecording}
                className="flex items-center gap-2 bg-emerald-800/80 hover:bg-emerald-800 text-white font-bold px-4 py-3 rounded-xl border border-emerald-400/40 cursor-pointer text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Ulangi Lagi</span>
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Encouragement Badge */}
      <AnimatePresence>
        {feedbackGiven && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="mt-6 pt-5 border-t border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-400 text-amber-950 rounded-2xl shadow-md">
                <Award className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-extrabold text-lg text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  Maa Syaa Allah! 3 Bintang Untukmu ⭐⭐⭐
                </h4>
                <p className="text-xs text-emerald-100 mt-0.5">
                  Bagus sekali! Hafalan {currentDua.title} kamu semakin lancar dan fasih. Teruslah istiqamah yaa!
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-amber-400/20 px-3 py-1.5 rounded-full border border-amber-300/40 text-amber-200 text-xs font-bold">
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>Anak Shalih & Pintar</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
