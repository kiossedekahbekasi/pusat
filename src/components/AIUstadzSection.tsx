import React, { useState, useEffect, useRef } from 'react';
import { SiteSettings } from '../types';
import {
  Sparkles, Send, BookOpen, MessageCircle, Search, Loader2, AlertTriangle,
  ChevronLeft, RefreshCw, BookMarked,
} from 'lucide-react';

interface AIUstadzSectionProps {
  siteSettings: SiteSettings;
}

// ---------------- Tipe data ringan untuk surat & ayat dari equran.id ----------------
interface SurahListItem {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi?: string;
}

interface AyatItem {
  nomorAyat: number;
  teksArab: string;
  teksLatin?: string;
  teksIndonesia: string;
}

interface SurahDetail extends SurahListItem {
  ayat: AyatItem[];
}

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

// equran.id v1: response langsung tanpa pembungkus status, jadi lebih sederhana dipakai di sini.
const QURAN_API_BASE = 'https://equran.id/api';

function normalizeSurahList(raw: any[]): SurahListItem[] {
  return raw.map((s) => ({
    nomor: s.nomor,
    nama: s.nama,
    namaLatin: s.nama_latin || s.namaLatin,
    jumlahAyat: s.jumlah_ayat || s.jumlahAyat,
    tempatTurun: s.tempat_turun || s.tempatTurun,
    arti: s.arti,
    deskripsi: s.deskripsi,
  }));
}

function normalizeSurahDetail(s: any): SurahDetail {
  const ayatRaw: any[] = s.ayat || [];
  return {
    nomor: s.nomor,
    nama: s.nama,
    namaLatin: s.nama_latin || s.namaLatin,
    jumlahAyat: s.jumlah_ayat || s.jumlahAyat,
    tempatTurun: s.tempat_turun || s.tempatTurun,
    arti: s.arti,
    deskripsi: s.deskripsi,
    ayat: ayatRaw.map((a) => ({
      nomorAyat: a.nomor ?? a.nomorAyat,
      teksArab: a.ar ?? a.teksArab,
      teksLatin: a.tr ?? a.teksLatin,
      teksIndonesia: a.idn ?? a.tr ?? a.teksIndonesia,
    })),
  };
}

export const AIUstadzSection: React.FC<AIUstadzSectionProps> = ({ siteSettings }) => {
  const [tab, setTab] = useState<'chat' | 'surat'>('chat');

  return (
    <section className="py-8 px-4 sm:px-6 max-w-5xl mx-auto space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative bg-gradient-to-r from-teal-800 via-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-10 text-white overflow-hidden shadow-xl border border-emerald-600/40">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-teal-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 space-y-3 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-400/20 border border-emerald-300/40 rounded-full text-emerald-100 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> AI Ustadz
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
            Tanya Ustadz AI &amp; Baca Al-Qur'an
          </h1>
          <p className="text-emerald-100/90 text-sm sm:text-base max-w-2xl mx-auto sm:mx-0">
            Tanyakan seputar ilmu keislaman sehari-hari, atau baca langsung 114 surat Al-Qur'an lengkap dengan teks Arab dan terjemahan Bahasa Indonesia.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-neutral-100 p-1.5 rounded-2xl w-fit mx-auto sm:mx-0">
        <button
          onClick={() => setTab('chat')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors cursor-pointer ${
            tab === 'chat' ? 'bg-white text-emerald-800 shadow-xs' : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          <MessageCircle className="w-4 h-4" /> Chat AI Ustadz
        </button>
        <button
          onClick={() => setTab('surat')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors cursor-pointer ${
            tab === 'surat' ? 'bg-white text-emerald-800 shadow-xs' : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Daftar 114 Surat
        </button>
      </div>

      {tab === 'chat' ? <ChatPanel siteSettings={siteSettings} /> : <SurahDirectoryPanel />}

      <p className="text-center text-[11px] text-neutral-400 pt-2">
        Jawaban AI Ustadz dibuat otomatis oleh kecerdasan buatan dan bisa saja keliru. Untuk hal fikih yang rinci atau kondisi personal, tetap konsultasikan ke ustadz/ulama tepercaya di sekitar Anda. Data surat Al-Qur'an bersumber dari equran.id.
      </p>
    </section>
  );
};

// =============================================================================
// CHAT PANEL
// =============================================================================
const ChatPanel: React.FC<{ siteSettings: SiteSettings }> = ({ siteSettings }) => {
  const { aiUstadz } = siteSettings;
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Assalamu\'alaikum! Saya AI Ustadz. Silakan tanyakan seputar ilmu keislaman, doa, atau ayat Al-Qur\'an yang ingin Anda pahami lebih lanjut. 🌙' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const hasApiKey = !!aiUstadz?.apiKey?.trim();

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading || !hasApiKey) return;
    const nextMessages: ChatMessage[] = [...messages, { role: 'user', text }];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);
    setError('');

    try {
      // Model lama (gemini-2.0-flash, gemini-1.5-flash, dll) sudah dimatikan oleh Google.
      // Kalau konfigurasi tersimpan masih memakai model lama, otomatis pakai model yang masih aktif.
      const DEPRECATED_MODELS = new Set([
        'gemini-2.0-flash',
        'gemini-2.0-flash-lite',
        'gemini-2.0-flash-exp',
        'gemini-1.5-flash',
        'gemini-1.5-flash-8b',
        'gemini-1.5-pro',
        'gemini-pro',
      ]);
      const savedModel = aiUstadz.model?.trim();
      const model = savedModel && !DEPRECATED_MODELS.has(savedModel) ? savedModel : 'gemini-2.5-flash';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(aiUstadz.apiKey)}`;
      const contents = nextMessages
        .filter((m) => !(m.role === 'model' && nextMessages.indexOf(m) === 0))
        .map((m) => ({ role: m.role, parts: [{ text: m.text }] }));

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          systemInstruction: { parts: [{ text: aiUstadz.systemPrompt }] },
          generationConfig: { temperature: 0.6, maxOutputTokens: 1024 },
        }),
      });

      if (!res.ok) {
        const errBody = await res.text().catch(() => '');
        throw new Error(`Gagal menghubungi AI (status ${res.status}). ${errBody ? errBody.slice(0, 200) : ''}`);
      }

      const data = await res.json();
      const reply: string =
        data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text || '').join('') ||
        'Maaf, AI tidak memberikan jawaban. Silakan coba lagi.';

      setMessages((prev) => [...prev, { role: 'model', text: reply }]);
    } catch (err: any) {
      setError(err?.message || 'Terjadi kesalahan saat menghubungi AI. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (aiUstadz?.enabled === false) {
    return (
      <div className="bg-white rounded-3xl p-10 border border-neutral-200 shadow-xs text-center text-sm text-neutral-500">
        Fitur AI Ustadz sedang tidak aktif.
      </div>
    );
  }

  if (!hasApiKey) {
    return (
      <div className="bg-amber-50 rounded-3xl p-8 sm:p-10 border border-amber-200 shadow-xs text-center space-y-2">
        <AlertTriangle className="w-8 h-8 text-amber-600 mx-auto" />
        <p className="text-sm font-bold text-amber-900">Fitur Chat AI Ustadz belum aktif</p>
        <p className="text-xs text-amber-700 max-w-md mx-auto">
          Admin toko belum mengatur API Key AI di Panel Admin &rarr; Konten Halaman Depan &rarr; Fitur "AI Ustadz". Sementara itu, Anda tetap bisa membaca 114 surat Al-Qur'an di tab sebelah.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs flex flex-col h-[520px] overflow-hidden">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] sm:max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                m.role === 'user'
                  ? 'bg-emerald-700 text-white rounded-br-sm'
                  : 'bg-neutral-100 text-neutral-800 rounded-bl-sm'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-neutral-100 text-neutral-500 px-4 py-2.5 rounded-2xl rounded-bl-sm text-sm flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> AI Ustadz sedang mengetik...
            </div>
          </div>
        )}
        {error && (
          <div className="flex justify-start">
            <div className="bg-rose-50 text-rose-700 border border-rose-200 px-4 py-2.5 rounded-2xl text-xs">{error}</div>
          </div>
        )}
      </div>

      <div className="border-t border-neutral-100 p-3 sm:p-4 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Tulis pertanyaan Anda di sini..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="p-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white transition-colors cursor-pointer disabled:cursor-not-allowed shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// =============================================================================
// SURAH DIRECTORY PANEL
// =============================================================================
const SurahDirectoryPanel: React.FC = () => {
  const [surahs, setSurahs] = useState<SurahListItem[] | null>(null);
  const [loadError, setLoadError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedNomor, setSelectedNomor] = useState<number | null>(null);

  const fetchList = () => {
    setLoadError('');
    setSurahs(null);
    fetch(`${QURAN_API_BASE}/surat`)
      .then((res) => {
        if (!res.ok) throw new Error('Gagal memuat daftar surat.');
        return res.json();
      })
      .then((raw) => setSurahs(normalizeSurahList(Array.isArray(raw) ? raw : raw?.data || [])))
      .catch(() => setLoadError('Gagal memuat daftar surat. Periksa koneksi internet Anda lalu coba lagi.'));
  };

  useEffect(() => {
    fetchList();
  }, []);

  if (selectedNomor !== null) {
    return <SurahDetailView nomor={selectedNomor} onBack={() => setSelectedNomor(null)} />;
  }

  const filtered = (surahs || []).filter((s) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return s.namaLatin?.toLowerCase().includes(q) || s.arti?.toLowerCase().includes(q) || String(s.nomor) === q;
  });

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-neutral-200 shadow-xs space-y-5">
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama surat atau arti (mis. Yasin, cahaya)..."
          className="w-full pl-10 pr-4 py-2.5 bg-neutral-100 text-sm rounded-full border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
        />
      </div>

      {loadError && (
        <div className="text-center py-10 space-y-3">
          <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto" />
          <p className="text-sm text-rose-600">{loadError}</p>
          <button
            onClick={fetchList}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Coba Lagi
          </button>
        </div>
      )}

      {!loadError && surahs === null && (
        <div className="py-16 text-center text-sm text-neutral-400 flex flex-col items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" /> Memuat daftar 114 surat...
        </div>
      )}

      {surahs !== null && !loadError && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((s) => (
            <button
              key={s.nomor}
              onClick={() => setSelectedNomor(s.nomor)}
              className="text-left p-4 bg-neutral-50 hover:bg-emerald-50 rounded-2xl border border-neutral-200 hover:border-emerald-300 transition-colors cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 shrink-0 rounded-full bg-emerald-700 text-white text-[10px] font-bold flex items-center justify-center">
                      {s.nomor}
                    </span>
                    <span className="font-bold text-sm text-neutral-900 truncate">{s.namaLatin}</span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1 truncate">{s.arti} &middot; {s.jumlahAyat} ayat &middot; {s.tempatTurun}</p>
                </div>
                <span className="text-xl font-arabic text-emerald-800 shrink-0">{s.nama}</span>
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full text-center text-sm text-neutral-400 py-10">Surat tidak ditemukan.</p>
          )}
        </div>
      )}
    </div>
  );
};

const SurahDetailView: React.FC<{ nomor: number; onBack: () => void }> = ({ nomor, onBack }) => {
  const [detail, setDetail] = useState<SurahDetail | null>(null);
  const [loadError, setLoadError] = useState('');

  const fetchDetail = () => {
    setLoadError('');
    setDetail(null);
    fetch(`${QURAN_API_BASE}/surat/${nomor}`)
      .then((res) => {
        if (!res.ok) throw new Error('Gagal memuat surat.');
        return res.json();
      })
      .then((raw) => setDetail(normalizeSurahDetail(raw?.data || raw)))
      .catch(() => setLoadError('Gagal memuat isi surat. Periksa koneksi internet Anda lalu coba lagi.'));
  };

  useEffect(() => {
    fetchDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nomor]);

  return (
    <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs overflow-hidden">
      <div className="flex items-center gap-3 p-4 sm:p-5 border-b border-neutral-100 bg-emerald-800 text-white">
        <button
          onClick={onBack}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 cursor-pointer transition-colors shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-base sm:text-lg truncate">
            {detail ? `${detail.namaLatin} (${detail.arti})` : 'Memuat surat...'}
          </h3>
          {detail && (
            <p className="text-emerald-100 text-xs">
              {detail.tempatTurun} &middot; {detail.jumlahAyat} ayat
            </p>
          )}
        </div>
        <BookMarked className="w-5 h-5 text-emerald-200 shrink-0" />
      </div>

      <div className="max-h-[560px] overflow-y-auto p-4 sm:p-6 space-y-5">
        {loadError && (
          <div className="text-center py-10 space-y-3">
            <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto" />
            <p className="text-sm text-rose-600">{loadError}</p>
            <button
              onClick={fetchDetail}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Coba Lagi
            </button>
          </div>
        )}

        {!detail && !loadError && (
          <div className="py-16 text-center text-sm text-neutral-400 flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin" /> Memuat ayat...
          </div>
        )}

        {detail && detail.ayat.map((a) => (
          <div key={a.nomorAyat} className="pb-5 border-b border-neutral-100 last:border-0 last:pb-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center shrink-0">
                {a.nomorAyat}
              </span>
            </div>
            <p dir="rtl" lang="ar" className="text-right text-2xl leading-loose text-neutral-900 mb-2">
              {a.teksArab}
            </p>
            {a.teksLatin && <p className="text-xs text-neutral-400 italic mb-1.5">{a.teksLatin}</p>}
            <p className="text-sm text-neutral-700 leading-relaxed">{a.teksIndonesia}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
