import { useEffect, useState } from 'react';
import { StoreInfo } from '../types';

/**
 * Sinkronisasi status BUKA/TUTUP toko dengan jam & hari operasional asli.
 *
 * Sebelumnya badge BUKA/TUTUP di beranda hanya mengikuti satu saklar manual
 * (storeInfo.storeStatus) yang harus diubah admin sendiri setiap toko buka/tutup.
 * Sekarang, saat statusMode = 'otomatis', status dihitung ulang setiap detik
 * berdasarkan waktu Asia/Jakarta dibandingkan dengan openTime/closeTime & closedDays,
 * sehingga badge berubah sendiri tanpa perlu ada yang klik apa pun.
 */

const parseTimeToMinutes = (time: string): number | null => {
  const match = /^(\d{1,2}):(\d{2})$/.exec((time || '').trim());
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return null;
  if (hour < 0 || hour > 24 || minute < 0 || minute > 59) return null;
  return hour * 60 + minute;
};

const JAKARTA_WEEKDAY_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

const getJakartaTimeParts = (now: Date) => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Jakarta',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(now);

  const get = (type: string) => parts.find((p) => p.type === type)?.value || '';
  const dayIndex = JAKARTA_WEEKDAY_INDEX[get('weekday')] ?? now.getDay();
  const hourRaw = Number(get('hour'));
  const hour = hourRaw === 24 ? 0 : hourRaw;
  const minute = Number(get('minute'));

  return { dayIndex, minutesOfDay: hour * 60 + minute };
};

/** Hitung status buka/tutup otomatis berdasarkan jadwal toko, pada waktu WIB saat ini. */
export const computeAutoOpenStatus = (storeInfo: StoreInfo, now: Date = new Date()): boolean => {
  const { dayIndex, minutesOfDay } = getJakartaTimeParts(now);

  if (storeInfo.closedDays?.includes(dayIndex)) return false;

  const openMinutes = parseTimeToMinutes(storeInfo.openTime);
  const closeMinutes = parseTimeToMinutes(storeInfo.closeTime);

  // Jadwal belum diisi lengkap -> anggap selalu buka, jangan sampai malah menutup toko tanpa sebab.
  if (openMinutes === null || closeMinutes === null) return true;

  // Jam buka sama dengan jam tutup -> diartikan buka 24 jam.
  if (openMinutes === closeMinutes) return true;

  if (openMinutes < closeMinutes) {
    // Jam operasional normal dalam 1 hari, misal 06:00 - 21:00.
    return minutesOfDay >= openMinutes && minutesOfDay < closeMinutes;
  }

  // Jam operasional melewati tengah malam, misal 20:00 - 02:00.
  return minutesOfDay >= openMinutes || minutesOfDay < closeMinutes;
};

/** Status final: pakai perhitungan otomatis, atau saklar manual, sesuai statusMode. */
export const getStoreOpenStatus = (storeInfo: StoreInfo, now: Date = new Date()): boolean => {
  if (storeInfo.statusMode === 'manual') {
    return storeInfo.storeStatus !== 'tutup';
  }
  return computeAutoOpenStatus(storeInfo, now);
};

export interface StoreStatusResult {
  isOpen: boolean;
  currentTime: string;
}

/**
 * Hook realtime: re-render otomatis setiap detik supaya badge BUKA/TUTUP dan jam
 * berjalan langsung berubah sendiri begitu melewati jam tutup/buka, tanpa refresh halaman.
 */
export const useStoreStatus = (storeInfo: StoreInfo): StoreStatusResult => {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const currentTime = new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(now);

  return {
    isOpen: getStoreOpenStatus(storeInfo, now),
    currentTime,
  };
};

export const DAY_LABELS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu'];
