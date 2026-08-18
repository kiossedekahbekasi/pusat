import React, { useEffect, useState } from 'react';
import { Moon, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { fetchBekasiPrayerTimes, getNextPrayer, PRAYER_LABELS, PrayerTimings } from '../utils/prayerTimes';
import { formatGregorianDate } from '../utils/hijriDate';

export const PrayerTimesWidget: React.FC = () => {
  const [timings, setTimings] = useState<PrayerTimings | null>(null);
  const [hijri, setHijri] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [now, setNow] = useState(new Date());

  const loadTimings = () => {
    setLoading(true);
    setError('');
    fetchBekasiPrayerTimes('Bekasi', 'Indonesia')
      .then((res) => {
        setTimings(res.timings);
        setHijri(res.hijriReadable);
      })
      .catch(() => {
        setError('Jadwal sholat sedang tidak dapat dimuat. Silakan coba lagi.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTimings();
  }, []);

  // Perbarui jam setiap menit supaya highlight "waktu sholat berikutnya" ikut ter-update.
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  const nextPrayer = timings ? getNextPrayer(timings, now) : null;

  return (
    <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-emerald-700/50 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-400/20 text-amber-300 rounded-2xl border border-amber-300/30">
            <Moon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Jadwal Waktu Sholat — Bekasi</h3>
            <p className="text-xs text-emerald-300">
              {formatGregorianDate(now)}
              {hijri ? ` • ${hijri}` : ''}
            </p>
          </div>
        </div>
        <span className="text-[10px] text-emerald-400 font-medium">Metode: Kemenag RI</span>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-emerald-200 text-sm py-4 justify-center">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Memuat jadwal sholat...</span>
        </div>
      )}

      {!loading && error && (
        <div className="flex flex-col items-center gap-3 text-center py-4">
          <AlertCircle className="w-8 h-8 text-amber-300" />
          <p className="text-sm text-emerald-200">{error}</p>
          <button
            onClick={loadTimings}
            className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Coba Lagi
          </button>
        </div>
      )}

      {!loading && !error && timings && (
        <>
          {nextPrayer && (
            <div className="bg-amber-400/10 border border-amber-300/30 rounded-2xl px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-200 text-xs font-semibold uppercase tracking-wide">
                <Clock className="w-4 h-4" /> Waktu Sholat Berikutnya
              </div>
              <div className="text-right">
                <span className="font-bold text-white">{nextPrayer.label}</span>
                <span className="ml-2 font-mono text-amber-300 font-bold tabular-nums">{nextPrayer.time}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
            {PRAYER_LABELS.map(({ key, label }) => {
              const isNext = nextPrayer?.key === key;
              return (
                <div
                  key={key}
                  className={`rounded-2xl p-3 text-center border transition-colors ${
                    isNext
                      ? 'bg-amber-400 border-amber-300 text-emerald-950'
                      : 'bg-emerald-950/50 border-emerald-700/50 text-emerald-100'
                  }`}
                >
                  <p className={`text-[10px] font-bold uppercase tracking-wide ${isNext ? 'text-emerald-900' : 'text-emerald-300'}`}>
                    {label}
                  </p>
                  <p className={`text-sm sm:text-base font-black tabular-nums mt-1 ${isNext ? 'text-emerald-950' : 'text-white'}`}>
                    {timings[key]}
                  </p>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-emerald-400 text-center pt-1">
            Sumber: AlAdhan API (metode Kemenag RI) • Waktu dalam WIB, dapat berbeda beberapa menit dari jadwal masjid setempat.
          </p>
        </>
      )}
    </div>
  );
};
