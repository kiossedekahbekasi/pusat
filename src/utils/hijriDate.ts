/**
 * Format tanggal Masehi (Gregorian) & Hijriah (Islamic/Umalqura) dalam Bahasa Indonesia,
 * memakai zona waktu Asia/Jakarta. Tidak perlu library tambahan — memanfaatkan Intl bawaan
 * browser yang sudah mendukung kalender Hijriah (kalender "islamic-umalqura").
 */

export const formatGregorianDate = (date: Date = new Date()): string => {
  try {
    return new Intl.DateTimeFormat('id-ID', {
      timeZone: 'Asia/Jakarta',
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch {
    return date.toLocaleDateString('id-ID');
  }
};

/** Pastikan tahun Hijriah diakhiri "H" persis satu kali, terlepas dari apakah Intl browser sudah menyertakannya sendiri atau belum. */
const ensureHijriSuffix = (formatted: string): string => (/\bH$/i.test(formatted.trim()) ? formatted.trim() : `${formatted.trim()} H`);

export const formatHijriDate = (date: Date = new Date()): string => {
  try {
    const formatted = new Intl.DateTimeFormat('id-ID-u-ca-islamic-umalqura', {
      timeZone: 'Asia/Jakarta',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
    return ensureHijriSuffix(formatted);
  } catch {
    try {
      const formatted = new Intl.DateTimeFormat('en-US-u-ca-islamic', {
        timeZone: 'Asia/Jakarta',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(date);
      return ensureHijriSuffix(formatted);
    } catch {
      return '';
    }
  }
};
