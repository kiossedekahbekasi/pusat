import React from 'react';
import { Gift, Sparkles, Check, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface PaketSembakoProps {
  products: Product[];
  onAddToCart: (product: Product, quantity: number, unitType: 'eceran' | 'grosir') => void;
  onOpenDetail: (product: Product) => void;
}

export const PaketSembako: React.FC<PaketSembakoProps> = ({
  products,
  onAddToCart,
  onOpenDetail,
}) => {
  const paketProducts = products.filter((p) => p.category === 'paket_hemat');

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="space-y-8 py-4">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white p-8 rounded-3xl shadow-md space-y-3 relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-amber-700/60 rounded-full text-xs font-bold border border-amber-300/30">
          <Gift className="w-4 h-4 text-amber-200" />
          <span>Solusi Hemat Kebutuhan Keluarga & Sedekah</span>
        </div>

        <h1 className="text-3xl font-black">Paket Sembako Promo Hemat</h1>
        <p className="text-amber-100 text-sm max-w-2xl leading-relaxed">
          Pilihan bundel sembako lengkap berhadiah atau diskon spesial. Sangat cocok untuk stok persediaan bulanan rumah tangga maupun untuk dibagikan sebagai sembako sedekah Jum’at Berkah.
        </p>
      </div>

      {/* Grid of Packages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paketProducts.map((paket) => {
          const price = paket.discountPrice || paket.price;
          return (
            <div
              key={paket.id}
              className="bg-white rounded-3xl border border-neutral-200 hover:border-amber-400 p-6 shadow-2xs space-y-4 flex flex-col justify-between transition-all group"
            >
              <div className="space-y-4">
                <div className="relative aspect-16/9 rounded-2xl bg-neutral-100 overflow-hidden">
                  <img
                    src={paket.image}
                    alt={paket.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {paket.badge && (
                    <span className="absolute top-3 left-3 bg-amber-500 text-neutral-950 text-xs font-black px-3 py-1 rounded-full shadow-md">
                      {paket.badge}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                    {paket.unit}
                  </div>
                  <h3 className="text-xl font-extrabold text-neutral-900 group-hover:text-amber-900 transition-colors">
                    {paket.name}
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {paket.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-neutral-400 font-medium">Harga Paket:</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-amber-900">
                      {formatRupiah(price)}
                    </span>
                    {paket.discountPrice && (
                      <span className="text-xs text-neutral-400 line-through">
                        {formatRupiah(paket.price)}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => onAddToCart(paket, 1, 'eceran')}
                  className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Pesan Paket</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
