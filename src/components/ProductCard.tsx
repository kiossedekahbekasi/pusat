import React, { useState } from 'react';
import { Check, Info, ShoppingBag, Sparkles } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number, unitType: 'eceran' | 'grosir') => void;
  onOpenDetail: (product: Product) => void;
  isWholesaleMode: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onOpenDetail,
  isWholesaleMode,
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const activePrice = isWholesaleMode && product.wholesalePrice
    ? product.wholesalePrice
    : (product.discountPrice || product.price);

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Mode grosir hanya sah bila produk punya harga grosir DAN jumlahnya
    // memenuhi minimum pembelian grosir.
    const useWholesale = isWholesaleMode && !!product.wholesalePrice;
    const minQty = product.minWholesaleQty || 5;
    const finalQuantity = useWholesale ? Math.max(quantity, minQty) : quantity;
    onAddToCart(product, finalQuantity, useWholesale ? 'grosir' : 'eceran');
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  return (
    <div
      onClick={() => onOpenDetail(product)}
      className="group bg-white rounded-2xl border border-neutral-200 hover:border-emerald-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer"
    >
      <div>
        {/* Product Image & Badges */}
        <div className="relative aspect-4/3 w-full bg-neutral-100 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
            <span className="text-white text-xs font-semibold flex items-center gap-1 bg-black/60 px-2.5 py-1 rounded-full backdrop-blur-xs">
              <Info className="w-3.5 h-3.5" /> Lihat Detail Sembako
            </span>
          </div>

          {/* Top Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
            {product.badge && (
              <span className="bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> {product.badge}
              </span>
            )}
            {product.isPromo && (
              <span className="bg-amber-500 text-neutral-950 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs">
                PROMO HEMAT
              </span>
            )}
          </div>

          {/* Stock Tag */}
          <div className="absolute top-2.5 right-2.5">
            <span className="bg-white/90 text-neutral-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-neutral-200/80 shadow-2xs backdrop-blur-xs">
              Stok: {product.stock}
            </span>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-4 space-y-2">
          <div className="text-[11px] font-semibold text-emerald-700 tracking-wide uppercase">
            {product.unit}
          </div>

          <h3 className="font-bold text-neutral-900 text-base leading-snug group-hover:text-emerald-800 transition-colors line-clamp-2">
            {product.name}
          </h3>

          <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>

      {/* Pricing & Cart Action */}
      <div className="p-4 pt-0 space-y-3">
        {/* Wholesale indicator tier */}
        {product.wholesalePrice && (
          <div className="text-[11px] text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60 font-medium">
            Grosir (Min {product.minWholesaleQty || 5} unit): {formatRupiah(product.wholesalePrice)}
          </div>
        )}

        <div className="flex items-baseline justify-between pt-1">
          <div>
            <div className="text-xs text-neutral-400 font-medium">
              {isWholesaleMode ? 'Harga Grosir' : 'Harga Eceran'}
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-emerald-800">
                {formatRupiah(activePrice)}
              </span>
              {product.discountPrice && !isWholesaleMode && (
                <span className="text-xs text-neutral-400 line-through">
                  {formatRupiah(product.price)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quantity and Add Button */}
        <div className="flex items-center gap-2 pt-1">
          <div className="flex items-center border border-neutral-200 rounded-lg bg-neutral-50 p-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-7 h-7 flex items-center justify-center text-neutral-600 hover:bg-neutral-200 rounded font-bold text-sm transition-colors"
            >
              -
            </button>
            <span className="w-8 text-center text-xs font-semibold text-neutral-800">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              className="w-7 h-7 flex items-center justify-center text-neutral-600 hover:bg-neutral-200 rounded font-bold text-sm transition-colors"
            >
              +
            </button>
          </div>

          <button
            onClick={handleAdd}
            className={`flex-1 py-2 px-3 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs ${
              addedAnimation
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-800 text-white hover:bg-emerald-900'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Masuk!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>+ Keranjang</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
