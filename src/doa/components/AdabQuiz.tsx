import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QUIZ_QUESTIONS } from '../data/doaData';
import { QuizQuestion } from '../types';
import { CheckCircle2, XCircle, Award, RotateCcw, Sparkles, HelpCircle, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioEngine, speakText } from '../utils/audio';

export const AdabQuiz: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQ: QuizQuestion = QUIZ_QUESTIONS[currentIdx];

  const handleSelectOption = (optionId: string) => {
    if (isAnswerSubmitted) return;
    setSelectedOptionId(optionId);
    setIsAnswerSubmitted(true);

    const selectedOption = currentQ.options.find((o) => o.id === optionId);
    if (selectedOption?.isCorrect) {
      setScore((prev) => prev + 1);
      audioEngine.playChime(783.99);
      speakText('Tepat sekali! ' + selectedOption.explanation, {
        pitch: 1.25,
        rate: 0.9,
      });
    } else {
      audioEngine.playPop(300);
      speakText('Kurang tepat. ' + (selectedOption?.explanation || ''), {
        pitch: 1.1,
        rate: 0.9,
      });
    }
  };

  const handleNextQuestion = () => {
    audioEngine.playPop(520);
    if (currentIdx + 1 < QUIZ_QUESTIONS.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsCompleted(true);
      audioEngine.playSuccess();
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  };

  const handleRestartQuiz = () => {
    audioEngine.playPop(480);
    setCurrentIdx(0);
    setSelectedOptionId(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setIsCompleted(false);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-amber-200/80" id="adab-quiz-section">
      {!isCompleted ? (
        <div>
          {/* Header */}
          <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-amber-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-amber-100 text-amber-800 rounded-2xl">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                  Kuis Cerdas Ceria
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-800">
                  Uji Pemahaman Adab Makan
                </h3>
              </div>
            </div>

            {/* Progress Counter */}
            <div className="flex items-center gap-1.5 bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200 text-amber-900 font-bold text-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Soal {currentIdx + 1} / {QUIZ_QUESTIONS.length}</span>
            </div>
          </div>

          {/* Question Text */}
          <div className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50/50 p-4 sm:p-5 rounded-2xl border border-amber-200">
            <h4 className="text-base sm:text-lg font-black text-slate-800 leading-snug">
              {currentQ.question}
            </h4>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 gap-3 mb-6">
            {currentQ.options.map((option) => {
              const isSelected = selectedOptionId === option.id;
              const showResult = isAnswerSubmitted;

              let btnStyle = 'bg-slate-50 hover:bg-amber-50/60 border-slate-200 text-slate-700';
              if (showResult) {
                if (option.isCorrect) {
                  btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-300';
                } else if (isSelected && !option.isCorrect) {
                  btnStyle = 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-300';
                }
              }

              return (
                <motion.button
                  key={option.id}
                  id={`quiz-opt-${option.id}`}
                  whileHover={!isAnswerSubmitted ? { scale: 1.01 } : {}}
                  whileTap={!isAnswerSubmitted ? { scale: 0.99 } : {}}
                  onClick={() => handleSelectOption(option.id)}
                  disabled={isAnswerSubmitted}
                  className={`p-4 rounded-2xl border-2 text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-white flex items-center justify-center font-black text-sm shadow-sm text-amber-800 border border-amber-200">
                      {option.icon}
                    </span>
                    <span className="font-bold text-sm sm:text-base">{option.text}</span>
                  </div>

                  {showResult && option.isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {showResult && isSelected && !option.isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Explanation Alert & Next Button */}
          <AnimatePresence>
            {isAnswerSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200"
              >
                <div className="text-xs sm:text-sm font-medium text-slate-700">
                  {currentQ.options.find((o) => o.id === selectedOptionId)?.explanation}
                </div>

                <motion.button
                  id="btn-next-quiz"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNextQuestion}
                  className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm px-6 py-2.5 rounded-xl shadow-md cursor-pointer transition-colors shrink-0"
                >
                  {currentIdx + 1 < QUIZ_QUESTIONS.length ? 'Pertanyaan Berikutnya ➔' : 'Lihat Hasil Kuis 🏆'}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        /* Quiz Complete Screen */
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-6"
        >
          <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-3xl mx-auto flex items-center justify-center shadow-inner mb-4">
            <Trophy className="w-10 h-10 animate-bounce" />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Kuis Selesai!
          </span>

          <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mt-2">
            Maa Syaa Allah, Luar Biasa!
          </h3>

          <p className="text-sm text-slate-600 max-w-md mx-auto mt-2">
            Kamu berhasil menjawab <strong className="text-amber-600">{score}</strong> dari <strong>{QUIZ_QUESTIONS.length}</strong> pertanyaan dengan sangat baik!
          </p>

          {/* Trophy Medal */}
          <div className="my-6 inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3.5 rounded-2xl shadow-lg shadow-orange-500/20">
            <Award className="w-8 h-8" />
            <div className="text-left">
              <div className="text-xs font-bold uppercase opacity-90">Penghargaan</div>
              <div className="text-lg font-black">
                {score === QUIZ_QUESTIONS.length ? 'Bintang Adab Makan Sempurna ⭐' : 'Juara Adab Makan Cilik 🏅'}
              </div>
            </div>
          </div>

          <div>
            <motion.button
              id="btn-restart-quiz"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRestartQuiz}
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md cursor-pointer transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Mainkan Kuis Lagi</span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
