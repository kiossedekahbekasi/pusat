/**
 * Ambil jadwal waktu sholat harian untuk wilayah Bekasi dari AlAdhan API (gratis, tanpa API key).
 * Memakai metode perhitungan #20 = KEMENAG (Kementerian Agama Republik Indonesia) agar sesuai
 * dengan jadwal resmi yang umum dipakai masjid-masjid di Indonesia.
 */

export interface PrayerTimings {
  Imsak: string;
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
}

export interface PrayerTimesResult {
  timings: PrayerTimings;
  dateReadable: string;
  hijriReadable: string;
}

const ALADHAN_ENDPOINT = 'https://api.aladhan.com/v1/timingsByCity';

/** Bersihkan suffix zona waktu seperti "04:35 (WIB)" menjadi "04:35" saja. */
const cleanTime = (value: string): string => value.replace(/\s*\(.*?\)\s*/g, '').trim();

export const fetchBekasiPrayerTimes = async (city = 'Bekasi', country = 'Indonesia'): Promise<PrayerTimesResult> => {
  const url = `${ALADHAN_ENDPOINT}?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=20`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Gagal memuat jadwal sholat (status ${res.status})`);
  }
  const json = await res.json();
  const timings = json?.data?.timings;
  if (!timings) {
    throw new Error('Format respons jadwal sholat tidak sesuai');
  }

  return {
    timings: {
      Imsak: cleanTime(timings.Imsak),
      Fajr: cleanTime(timings.Fajr),
      Sunrise: cleanTime(timings.Sunrise),
      Dhuhr: cleanTime(timings.Dhuhr),
      Asr: cleanTime(timings.Asr),
      Sunset: cleanTime(timings.Sunset),
      Maghrib: cleanTime(timings.Maghrib),
      Isha: cleanTime(timings.Isha),
    },
    dateReadable: json?.data?.date?.readable ?? '',
    hijriReadable: json?.data?.date?.hijri
      ? `${json.data.date.hijri.day} ${json.data.date.hijri.month?.en ?? ''} ${json.data.date.hijri.year} H`
      : '',
  };
};

/** Urutan waktu sholat wajib yang ditampilkan ke pengguna, beserta label Bahasa Indonesia. */
export const PRAYER_LABELS: { key: keyof PrayerTimings; label: string }[] = [
  { key: 'Fajr', label: 'Subuh' },
  { key: 'Sunrise', label: 'Terbit' },
  { key: 'Dhuhr', label: 'Dzuhur' },
  { key: 'Asr', label: 'Ashar' },
  { key: 'Maghrib', label: 'Maghrib' },
  { key: 'Isha', label: "Isya'" },
];

/** Cari waktu sholat wajib (bukan "Terbit") berikutnya berdasarkan jam saat ini di WIB. */
export const getNextPrayer = (
  timings: PrayerTimings,
  now: Date = new Date()
): { key: keyof PrayerTimings; label: string; time: string } | null => {
  const wajibOnly = PRAYER_LABELS.filter((p) => p.key !== 'Sunrise');
  const nowStr = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(now);

  const toMinutes = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };
  const nowMinutes = toMinutes(nowStr);

  for (const p of wajibOnly) {
    const time = timings[p.key];
    if (toMinutes(time) > nowMinutes) {
      return { ...p, time };
    }
  }
  // Kalau semua waktu hari ini sudah lewat, waktu berikutnya adalah Subuh besok.
  const fajr = wajibOnly[0];
  return { ...fajr, time: timings[fajr.key] };
};
