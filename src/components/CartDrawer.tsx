import React, { useEffect, useRef, useState } from 'react';
import { X, Trash2, ShoppingBag, Truck, Store, ArrowRight, Phone, MapPin, User, CheckCircle2, PackageSearch, LocateFixed, AlertTriangle, Banknote } from 'lucide-react';
import { CartItem, OrderDetails, StoreInfo } from '../types';

// Titik acuan toko (hasil konversi Plus Code QXCR+HQ6, Jl. Kp. Kandang, RT.002/RW.008,
// Harapan Mulya, Kec. Medan Satria, Kota Bekasi, Jawa Barat 17143) — dipakai sebagai
// titik nol untuk menghitung jarak alamat pembeli secara otomatis.
const STORE_ORIGIN = { lat: -6.2285875, lng: 106.991890625 };

// Jarak garis lurus (great-circle) dalam KM antara dua titik koordinat, memakai rumus Haversine.
const haversineDistanceKm = (
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number => {
  const R = 6371; // radius bumi dalam KM
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
};

// Aturan tambahan ongkir berdasar jarak dari toko (di luar radius gratis/dasar 3 Km).
// > 10 Km dianggap di luar jangkauan otomatis, ongkir final dikonfirmasi admin via WhatsApp.
const getDistanceSurcharge = (km: number): { fee: number; label: string } | 'manual' => {
  if (km <= 3) return { fee: 0, label: '' };
  if (km <= 5) return { fee: 20000, label: 'Tambahan jarak 4-5 Km' };
  if (km <= 10) return { fee: 30000, label: 'Tambahan jarak 6-10 Km' };
  return 'manual';
};

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, unitType: 'eceran' | 'grosir', quantity: number) => void;
  onRemoveItem: (productId: string, unitType: 'eceran' | 'grosir') => void;
  onClearCart: () => void;
  onCompleteOrder: (orderDetails: OrderDetails) => void;
  storeInfo: StoreInfo;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCompleteOrder,
  storeInfo,
}) => {
  // PENTING: semua hook harus dipanggil sebelum `return null`,
  // kalau tidak React akan error "Rendered fewer hooks than expected".
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup' | 'titip_indogrosir'>('delivery');
  const [notes, setNotes] = useState('');
  const [step, setStep] = useState<'cart' | 'checkout'>('cart');

  // Status hitung jarak otomatis (hanya relevan untuk deliveryType === 'delivery').
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [distanceStatus, setDistanceStatus] = useState<'idle' | 'checking' | 'done' | 'not_found' | 'error'>('idle');
  const geocodeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const geocodeAbort = useRef<AbortController | null>(null);

  // Cek jarak alamat pembeli ke toko secara otomatis (debounce 900ms setelah berhenti mengetik),
  // memakai geocoding gratis dari OpenStreetMap Nominatim. Ini murni bantuan estimasi ongkir —
  // kalau gagal/alamat tidak ketemu, checkout tetap bisa jalan dan ongkir final dikonfirmasi admin.
  useEffect(() => {
    if (geocodeTimer.current) clearTimeout(geocodeTimer.current);
    if (geocodeAbort.current) geocodeAbort.current.abort();

    if (deliveryType !== 'delivery' || address.trim().length < 8) {
      setDistanceKm(null);
      setDistanceStatus('idle');
      return;
    }

    setDistanceStatus('checking');
    geocodeTimer.current = setTimeout(async () => {
      const controller = new AbortController();
      geocodeAbort.current = controller;
      try {
        const query = `${address}, ${storeInfo.address || 'Bekasi, Jawa Barat'}`;
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=id&q=${encodeURIComponent(query)}`,
          { signal: controller.signal, headers: { Accept: 'application/json' } }
        );
        const results = await res.json();
        if (Array.isArray(results) && results.length > 0) {
          const km = haversineDistanceKm(STORE_ORIGIN, {
            lat: parseFloat(results[0].lat),
            lng: parseFloat(results[0].lon),
          });
          setDistanceKm(km);
          setDistanceStatus('done');
        } else {
          setDistanceKm(null);
          setDistanceStatus('not_found');
        }
      } catch {
        setDistanceKm(null);
        setDistanceStatus('error');
      }
    }, 900);

    return () => {
      if (geocodeTimer.current) clearTimeout(geocodeTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, deliveryType]);

  // Kembali ke langkah awal setiap kali panel dibuka lagi.
  useEffect(() => {
    if (isOpen) setStep('cart');
  }, [isOpen]);

  // Tutup panel dengan tombol Esc.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Pesan WhatsApp otomatis yang dikirim ke Toko begitu pesanan baru dibuat,
  // supaya admin langsung tahu ada pesanan tanpa harus buka Panel Admin dulu.
  const generateAdminOrderMessage = (order: OrderDetails) => {
    const itemList = order.items
      .map(
        (item, idx) =>
          `${idx + 1}. ${item.product.name} x${item.quantity} ${item.product.unit} (${item.selectedUnitType === 'grosir' ? 'Grosir' : 'Eceran'})`
      )
      .join('\n');

    const deliveryLabel =
      order.deliveryType === 'delivery'
        ? 'Antar Kurir Toko'
        : order.deliveryType === 'titip_indogrosir'
        ? 'Jasa Titip Indogrosir'
        : 'Ambil di Toko';

    const ongkirLine =
      order.deliveryType === 'pickup'
        ? ''
        : `\n*Ongkir:* ${order.deliveryFee ? formatRupiah(order.deliveryFee) : 'Rp0 (belum termasuk)'}${
            order.distanceKm != null ? ` (± ${order.distanceKm.toFixed(1)} Km dari toko)` : ''
          }${order.shippingNote ? `\n*Catatan Ongkir:* ${order.shippingNote}` : ''}`;

    const text = `*PESANAN SEMBAKO BARU*\nNo. Nota: *${order.id}*\nTanggal: ${order.date}\n\n*Pelanggan:* ${order.customerName}\n*No. HP:* ${order.phone}\n*Metode:* ${deliveryLabel}\n*Alamat:* ${order.address}${ongkirLine}\n\n*Daftar Belanja:*\n${itemList}\n\n*Total Bayar:* *${formatRupiah(order.totalAmount)}*\n*Pembayaran:* COD / Tunai di Tempat\n\nCatatan: ${order.notes || '-'}\n\nMohon diproses, terima kasih!`;

    return encodeURIComponent(text);
  };

  const subtotal = cartItems.reduce((acc, item) => {
    const itemUnitPrice =
      item.selectedUnitType === 'grosir' && item.product.wholesalePrice
        ? item.product.wholesalePrice
        : (item.product.discountPrice || item.product.price);
    return acc + itemUnitPrice * item.quantity;
  }, 0);

  // Aturan ongkir dasar (radius <= 3 Km): gratis bila belanja minimal Rp 100.000,
  // di bawah itu dikenakan ongkos kurir Rp 10.000.
  const FREE_DELIVERY_MIN = 100000;
  const DELIVERY_FEE = 10000;
  const baseFee = subtotal >= FREE_DELIVERY_MIN ? 0 : DELIVERY_FEE;

  // Tambahan ongkir otomatis berdasar jarak alamat ke toko (di luar radius 3 Km):
  // 4-5 Km +Rp20.000, 6-10 Km +Rp30.000. Di atas 10 Km atau bila jarak belum
  // berhasil dihitung otomatis, ongkir final dikonfirmasi admin via WhatsApp.
  const surcharge = distanceKm !== null ? getDistanceSurcharge(distanceKm) : null;
  // "Belum diketahui" (surcharge === null) hanya dianggap butuh konfirmasi admin
  // kalau pembeli SUDAH mulai mengisi alamat — supaya ringkasan di langkah
  // "Keranjang" (sebelum isi alamat) tidak menampilkan status yang membingungkan.
  const needsManualShipping =
    deliveryType === 'titip_indogrosir' ||
    (deliveryType === 'delivery' && address.trim().length > 0 && (surcharge === 'manual' || surcharge === null));

  const distanceSurchargeFee = surcharge && surcharge !== 'manual' ? surcharge.fee : 0;
  const distanceSurchargeLabel = surcharge && surcharge !== 'manual' ? surcharge.label : '';

  const deliveryFee =
    deliveryType === 'pickup'
      ? 0
      : deliveryType === 'titip_indogrosir'
      ? 0 // jasa titip Indogrosir: nominal ditentukan admin, bukan dihitung otomatis
      : baseFee + distanceSurchargeFee;

  const shippingNote =
    deliveryType === 'titip_indogrosir'
      ? 'Ongkos jasa titip Indogrosir akan diinfokan Admin via WhatsApp setelah pesanan dikonfirmasi.'
      : deliveryType === 'delivery' && surcharge === 'manual' && distanceKm !== null
      ? `Alamat berjarak ± ${distanceKm.toFixed(1)} Km dari toko (di luar 10 Km) — ongkir final dikonfirmasi Admin via WhatsApp.`
      : deliveryType === 'delivery' && needsManualShipping
      ? 'Jarak alamat belum bisa diverifikasi otomatis — ongkir final dikonfirmasi Admin via WhatsApp.'
      : deliveryType === 'delivery' && distanceSurchargeLabel
      ? `${distanceSurchargeLabel}: Rp${distanceSurchargeFee.toLocaleString('id-ID')} (jarak ± ${distanceKm?.toFixed(1)} Km)`
      : '';

  const grandTotal = subtotal + deliveryFee;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const addressRequired = deliveryType === 'delivery' || deliveryType === 'titip_indogrosir';
    if (!customerName.trim() || !phone.trim() || (addressRequired && !address.trim())) {
      alert('Mohon lengkapi Nama, Nomor Telepon, dan Alamat Pengiriman.');
      return;
    }

    const newOrder: OrderDetails = {
      id: 'SBK-' + Math.floor(100000 + Math.random() * 900000),
      customerName,
      phone,
      address: addressRequired ? address : `Ambil Langsung di ${storeInfo.name}`,
      deliveryType,
      paymentMethod: 'cod',
      items: [...cartItems],
      subtotal,
      deliveryFee,
      distanceKm: deliveryType === 'delivery' ? distanceKm : null,
      shippingNote: shippingNote || undefined,
      totalAmount: grandTotal,
      date: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      createdAt: new Date().toISOString(),
      status: 'Menunggu Konfirmasi',
      notes,
    };

    onCompleteOrder(newOrder);

    // Langsung buka WhatsApp Toko dengan pesan pesanan baru yang sudah terisi otomatis,
    // supaya pesanan langsung "terkoneksi" ke admin tanpa perlu klik tombol lagi.
    // Dipanggil langsung (bukan lewat setTimeout/promise) supaya browser tidak
    // memblokirnya sebagai popup, karena ini masih dalam alur klik tombol submit pengguna.
    const adminWhatsappNumber = (storeInfo.whatsapp || '').replace(/\D/g, '');
    if (adminWhatsappNumber) {
      window.open(`https://wa.me/${adminWhatsappNumber}?text=${generateAdminOrderMessage(newOrder)}`, '_blank');
    }

    // Bersihkan form supaya pesanan berikutnya mulai dari kosong.
    setCustomerName('');
    setPhone('');
    setAddress('');
    setNotes('');
    setDistanceKm(null);
    setDistanceStatus('idle');
    setStep('cart');
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="bg-white w-full max-w-lg h-full flex flex-col justify-between shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between bg-emerald-900 text-white">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-amber-300" />
            <h2 className="font-bold text-lg">
              {step === 'cart' ? 'Keranjang Belanja Sembako' : 'Form Pemesanan & Alamat'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-neutral-800 text-base">Keranjang Anda Kosong</h3>
                <p className="text-xs text-neutral-500 max-w-xs">
                  Pilih beras, minyak, gula, telur atau komoditas sembako lainnya dari katalog.
                </p>
              </div>
            </div>
          ) : step === 'cart' ? (
            // Cart List View
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-neutral-500 border-b border-neutral-100 pb-2">
                <span>Daftar Sembako ({cartItems.length} jenis)</span>
                <button
                  onClick={onClearCart}
                  className="text-rose-600 hover:underline flex items-center gap-1 font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Kosongkan
                </button>
              </div>

              <div className="space-y-3">
                {cartItems.map((item) => {
                  const unitPrice =
                    item.selectedUnitType === 'grosir' && item.product.wholesalePrice
                      ? item.product.wholesalePrice
                      : (item.product.discountPrice || item.product.price);
                  const itemTotal = unitPrice * item.quantity;

                  return (
                    <div
                      key={`${item.product.id}-${item.selectedUnitType}`}
                      className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center gap-3"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-14 h-14 rounded-lg object-cover border border-neutral-200 shrink-0"
                      />

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-1">
                          <h4 className="font-bold text-xs text-neutral-900 truncate">
                            {item.product.name}
                          </h4>
                        </div>
                        <div className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
                          <span>{formatRupiah(unitPrice)}</span>
                          <span className="text-neutral-400 font-normal">/ {item.product.unit}</span>
                          {item.selectedUnitType === 'grosir' && (
                            <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.5 rounded">
                              Grosir
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          {/* Quantity selector */}
                          <div className="flex items-center border border-neutral-300 rounded bg-white p-0.5">
                            <button
                              onClick={() =>
                                onUpdateQuantity(item.product.id, item.selectedUnitType, item.quantity - 1)
                              }
                              className="w-6 h-6 flex items-center justify-center font-bold text-neutral-600 text-xs"
                            >
                              -
                            </button>
                            <span className="w-6 text-center text-xs font-bold text-neutral-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                onUpdateQuantity(item.product.id, item.selectedUnitType, item.quantity + 1)
                              }
                              className="w-6 h-6 flex items-center justify-center font-bold text-neutral-600 text-xs"
                            >
                              +
                            </button>
                          </div>

                          <div className="font-extrabold text-xs text-neutral-900">
                            {formatRupiah(itemTotal)}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.product.id, item.selectedUnitType)}
                        aria-label={`Hapus ${item.product.name} dari keranjang`}
                        className="text-neutral-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            // Checkout Form View
            <form onSubmit={handleCheckoutSubmit} className="space-y-5">
              <div className="space-y-3">
                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">
                  1. Metode Pengiriman:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryType('delivery')}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                      deliveryType === 'delivery'
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/20'
                        : 'border-neutral-200 bg-white hover:bg-neutral-50'
                    }`}
                  >
                    <Truck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold">Kurir Toko (Diantar)</div>
                      <div className="text-[10px] text-neutral-500">Ongkir dihitung otomatis dari jarak</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryType('pickup')}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                      deliveryType === 'pickup'
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/20'
                        : 'border-neutral-200 bg-white hover:bg-neutral-50'
                    }`}
                  >
                    <Store className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold">Ambil Sendiri</div>
                      <div className="text-[10px] text-neutral-500">Ambil di lokasi toko</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryType('titip_indogrosir')}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                      deliveryType === 'titip_indogrosir'
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/20'
                        : 'border-neutral-200 bg-white hover:bg-neutral-50'
                    }`}
                  >
                    <PackageSearch className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold">Jasa Titip Indogrosir</div>
                      <div className="text-[10px] text-neutral-500">Ongkos jasa ditentukan Admin</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">
                  2. Informasi Pembeli:
                </label>

                <div className="space-y-2">
                  <div className="relative">
                    <User className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Nama Lengkap Pemesan *"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs text-neutral-900 bg-neutral-50 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    />
                  </div>

                  <div className="relative">
                    <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      placeholder="No. WhatsApp / HP *"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs text-neutral-900 bg-neutral-50 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    />
                  </div>

                  {(deliveryType === 'delivery' || deliveryType === 'titip_indogrosir') && (
                    <div className="space-y-1.5">
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                        <textarea
                          placeholder={
                            deliveryType === 'titip_indogrosir'
                              ? 'Alamat Tujuan Antar Titipan (Jl, RT/RW, No. Rumah, Patokan) *'
                              : 'Alamat Lengkap Pengiriman (Jl, RT/RW, No. Rumah, Patokan) *'
                          }
                          required
                          rows={3}
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 text-xs text-neutral-900 bg-neutral-50 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                        />
                      </div>

                      {/* Status hitung jarak & tambahan ongkir otomatis */}
                      {deliveryType === 'delivery' && distanceStatus === 'checking' && (
                        <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 px-1">
                          <LocateFixed className="w-3 h-3 animate-pulse" />
                          <span>Mengecek jarak alamat ke toko...</span>
                        </div>
                      )}
                      {deliveryType === 'delivery' && distanceStatus === 'done' && distanceKm !== null && (
                        <div
                          className={`flex items-start gap-1.5 text-[10px] px-2.5 py-1.5 rounded-lg ${
                            surcharge === 'manual'
                              ? 'bg-amber-50 text-amber-800'
                              : distanceSurchargeFee > 0
                              ? 'bg-amber-50 text-amber-800'
                              : 'bg-emerald-50 text-emerald-800'
                          }`}
                        >
                          {surcharge === 'manual' ? (
                            <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
                          ) : (
                            <LocateFixed className="w-3 h-3 shrink-0 mt-0.5" />
                          )}
                          <span>
                            Jarak ± {distanceKm.toFixed(1)} Km dari toko.{' '}
                            {surcharge === 'manual'
                              ? 'Di luar 10 Km, ongkir final dikonfirmasi Admin via WhatsApp.'
                              : distanceSurchargeFee > 0
                              ? `${distanceSurchargeLabel}: +${formatRupiah(distanceSurchargeFee)}.`
                              : 'Masih dalam radius 3 Km, tidak ada tambahan ongkir jarak.'}
                          </span>
                        </div>
                      )}
                      {deliveryType === 'delivery' && (distanceStatus === 'not_found' || distanceStatus === 'error') && (
                        <div className="flex items-start gap-1.5 text-[10px] text-neutral-500 bg-neutral-100 px-2.5 py-1.5 rounded-lg">
                          <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
                          <span>Jarak belum bisa dideteksi otomatis dari alamat ini — ongkir final akan dikonfirmasi Admin via WhatsApp.</span>
                        </div>
                      )}
                      {deliveryType === 'titip_indogrosir' && (
                        <div className="flex items-start gap-1.5 text-[10px] text-amber-800 bg-amber-50 px-2.5 py-1.5 rounded-lg">
                          <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
                          <span>Ongkos jasa titip belum termasuk di total ini — Admin akan menginfokan nominalnya via WhatsApp.</span>
                        </div>
                      )}
                    </div>
                  )}

                  <input
                    type="text"
                    placeholder="Catatan tambahan (opsional, misal: titip di satpam)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs text-neutral-900 bg-neutral-50 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>
              </div>

              {/* Payment Method Info (COD saja) */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">
                  3. Metode Pembayaran:
                </label>
                <div className="p-3 rounded-xl border-2 border-emerald-700 bg-emerald-50 text-emerald-900 text-xs font-bold flex items-center gap-2">
                  <Banknote className="w-4 h-4 shrink-0" />
                  Tunai / COD (Bayar di Tempat saat barang diterima)
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Konfirmasi & Kirim Pesanan</span>
              </button>
            </form>
          )}
        </div>

        {/* Footer Summary & Action */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t border-neutral-200 bg-neutral-50 space-y-3">
            <div className="space-y-1.5 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>Subtotal Sembako</span>
                <span className="font-semibold text-neutral-900">{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>
                  Ongkos Kirim (
                  {deliveryType === 'delivery'
                    ? 'Kurir Toko'
                    : deliveryType === 'titip_indogrosir'
                    ? 'Jasa Titip Indogrosir'
                    : 'Ambil di Toko'}
                  )
                </span>
                <span className="font-semibold text-neutral-900">
                  {needsManualShipping
                    ? 'Dikonfirmasi Admin'
                    : deliveryFee === 0
                    ? 'GRATIS'
                    : formatRupiah(deliveryFee)}
                </span>
              </div>
              {shippingNote && (
                <div className="text-[10px] text-amber-700 bg-amber-50 rounded-lg px-2 py-1 -mt-0.5">
                  {shippingNote}
                </div>
              )}
              <div className="flex justify-between text-sm font-black text-neutral-900 pt-1 border-t border-neutral-200">
                <span>Total Biaya{needsManualShipping ? ' (Belum Ongkir)' : ''}:</span>
                <span className="text-emerald-800">{formatRupiah(grandTotal)}</span>
              </div>
            </div>

            {step === 'cart' ? (
              <div className="flex gap-2">
                <button
                  onClick={() => setStep('checkout')}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Lanjut Ke Alamat & Kirim</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setStep('cart')}
                className="w-full py-2 text-xs text-neutral-500 hover:text-neutral-700 font-medium text-center"
              >
                ← Kembali ke daftar keranjang
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
