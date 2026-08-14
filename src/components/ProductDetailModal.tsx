import React, { useEffect, useState } from 'react';
import { X, ShoppingBag, ShieldCheck, Truck, Check, Tag } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, unitType: 'eceran' | 'grosir') => void;
  isWholesaleMode: boolean;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  isWholesaleMode,
}) => {
  // PENTING: hook dipanggil lebih dulu, `return null` menyusul.
  // Versi sebelumnya keluar lebih awal sehingga jumlah hook berubah
  // antar render dan React melempar error saat modal dibuka/ditutup.
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedUnitType, setSelectedUnitType] = useState<'eceran' | 'grosir'>('eceran');
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Setel ulang jumlah & skema harga setiap kali produk yang dibuka berganti.
  useEffect(() => {
    if (!product) return;
    const startAsWholesale = isWholesaleMode && !!product.wholesalePrice;
    setSelectedUnitType(startAsWholesale ? 'grosir' : 'eceran');
    setQuantity(startAsWholesale ? product.minWholesaleQty || 5 : 1);
    setAddedAnimation(false);
  }, [product, isWholesaleMode]);

  // Tutup modal dengan tombol Esc.
  useEffect(() => {
    if (!product) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  const minWholesaleQty = product.minWholesaleQty || 5;
  const isWholesaleQtyTooLow = selectedUnitType === 'grosir' && quantity < minWholesaleQty;

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const activeUnitPrice =
    selectedUnitType === 'grosir' && product.wholesalePrice
      ? product.wholesalePrice
      : (product.discountPrice || product.price);

  const totalPrice = activeUnitPrice * quantity;

  const handleAdd = () => {
    // Harga grosir hanya berlaku mulai dari jumlah minimalnya.
    const finalQuantity =
      selectedUnitType === 'grosir' ? Math.max(quantity, minWholesaleQty) : quantity;
    onAddToCart(product, finalQuantity, selectedUnitType);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {product.category.replace(/_/g, ' ')}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Image */}
          <div className="space-y-3">
            <div className="aspect-square rounded-2xl bg-neutral-100 overflow-hidden border border-neutral-200 relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.badge && (
                <span className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  {product.badge}
                </span>
              )}
            </div>

            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/80 space-y-1.5 text-xs text-neutral-600">
              <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                <ShieldCheck className="w-4 h-4" /> 100% Produk Asli & Garansi Fresh
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-neutral-500" /> Dikirim via kurir toko / instan
              </div>
            </div>
          </div>

          {/* Right Column: Information & Controls */}
          <div className="space-y-5 flex flex-col justify-between">
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-neutral-900 leading-snug">
                {product.name}
              </h2>

              <p className="text-sm text-neutral-600 leading-relaxed">
                {product.description}
              </p>

              {/* Unit Tag */}
              <div className="text-xs text-neutral-500 font-medium">
                Kemasan: <span className="text-neutral-900 font-semibold">{product.unit}</span> (Stok: {product.stock})
              </div>

              {/* Wholesale Option Selector */}
              {product.wholesalePrice && (
                <div className="pt-2">
                  <label className="text-xs font-bold text-neutral-700 block mb-2">
                    Pilih Skema Harga:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedUnitType('eceran')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedUnitType === 'eceran'
                          ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 ring-2 ring-emerald-500/20'
                          : 'border-neutral-200 bg-white hover:bg-neutral-50'
                      }`}
                    >
                      <div className="text-xs font-bold">Harga Eceran</div>
                      <div className="text-sm font-extrabold text-neutral-900">
                        {formatRupiah(product.discountPrice || product.price)}
                      </div>
                      <div className="text-[10px] text-neutral-500">Satuan harian</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedUnitType('grosir');
                        setQuantity((q) => Math.max(q, minWholesaleQty));
                      }}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedUnitType === 'grosir'
                          ? 'border-amber-600 bg-amber-50/50 text-amber-950 ring-2 ring-amber-500/20'
                          : 'border-neutral-200 bg-white hover:bg-neutral-50'
                      }`}
                    >
                      <div className="text-xs font-bold flex items-center gap-1 text-amber-800">
                        <Tag className="w-3 h-3" /> Harga Grosir
                      </div>
                      <div className="text-sm font-extrabold text-amber-900">
                        {formatRupiah(product.wholesalePrice)}
                      </div>
                      <div className="text-[10px] text-amber-700 font-medium">
                        Min. {product.minWholesaleQty || 5} unit
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Price & Add Footer */}
            <div className="space-y-4 pt-4 border-t border-neutral-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-neutral-500">Total Harga:</div>
                  <div className="text-2xl font-black text-emerald-800">
                    {formatRupiah(totalPrice)}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center border border-neutral-300 rounded-xl bg-neutral-50 p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    aria-label="Kurangi jumlah"
                    className="w-8 h-8 flex items-center justify-center font-bold text-neutral-700 hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold text-neutral-900 text-sm">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    aria-label="Tambah jumlah"
                    className="w-8 h-8 flex items-center justify-center font-bold text-neutral-700 hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {isWholesaleQtyTooLow && (
                <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  Harga grosir berlaku mulai {minWholesaleQty} unit. Jumlah akan otomatis
                  disesuaikan menjadi {minWholesaleQty} saat dimasukkan ke keranjang.
                </p>
              )}

              <button
                onClick={handleAdd}
                className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                  addedAnimation
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-800 hover:bg-emerald-900 text-white'
                }`}
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Tersimpan di Keranjang!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>Tambah ke Keranjang Belanja</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
