import React from 'react';
import { CheckCircle2, X, PhoneCall, Copy, Printer, ShoppingBag } from 'lucide-react';
import { OrderDetails } from '../types';
import { STORE_INFO } from '../data/storeData';

interface OrderReceiptModalProps {
  order: OrderDetails | null;
  onClose: () => void;
}

export const OrderReceiptModal: React.FC<OrderReceiptModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const generateWhatsAppMessage = () => {
    const itemList = order.items
      .map(
        (item, idx) =>
          `${idx + 1}. ${item.product.name} x${item.quantity} ${item.product.unit} (${item.selectedUnitType === 'grosir' ? 'Grosir' : 'Eceran'})`
      )
      .join('\n');

    const text = `*PESANAN SEMBAKO BARU* 🛒\nNo. Nota: *${order.id}*\nTanggal: ${order.date}\n\n*Pelanggan:* ${order.customerName}\n*No. HP:* ${order.phone}\n*Metode:* ${order.deliveryType === 'delivery' ? 'Antar Kurir Toko' : 'Ambil di Toko'}\n*Alamat:* ${order.address}\n\n*Daftar Belanja:* \n${itemList}\n\n*Total Bayar:* *${formatRupiah(order.totalAmount)}*\n*Pembayaran:* ${order.paymentMethod.toUpperCase()}\n\nCatatan: ${order.notes || '-'}\n\nMohon diproses, terima kasih!`;

    return encodeURIComponent(text);
  };

  const handleCopyReceipt = () => {
    const text = `Nota Pesanan Sembako: ${order.id}\nNama: ${order.customerName}\nTotal: ${formatRupiah(order.totalAmount)}`;
    navigator.clipboard.writeText(text);
    alert('Informasi Nota Pesanan berhasil disalin!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 text-center space-y-2 border-b border-neutral-100 relative bg-emerald-50">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white text-neutral-500 hover:bg-neutral-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <h2 className="text-xl font-bold text-neutral-900">Pesanan Sembako Berhasil Diproses!</h2>
          <p className="text-xs text-emerald-800 font-medium">
            Nomor Nota: <span className="font-bold text-neutral-900">{order.id}</span>
          </p>
        </div>

        {/* Receipt Content */}
        <div className="p-6 space-y-5 text-xs text-neutral-700">
          <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-2">
            <div className="flex justify-between">
              <span className="text-neutral-500">Tanggal:</span>
              <span className="font-semibold">{order.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Nama Pemesan:</span>
              <span className="font-semibold">{order.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">No. Kontak:</span>
              <span className="font-semibold">{order.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Layanan Kirim:</span>
              <span className="font-semibold">
                {order.deliveryType === 'delivery' ? 'Kurir Antar Toko' : 'Ambil Sendiri'}
              </span>
            </div>
            {order.deliveryType === 'delivery' && (
              <div className="pt-1 border-t border-neutral-200">
                <span className="text-neutral-500 block">Alamat Tujuan:</span>
                <span className="font-medium text-neutral-900">{order.address}</span>
              </div>
            )}
          </div>

          {/* Items Table */}
          <div className="space-y-2">
            <div className="font-bold text-neutral-800 uppercase tracking-wide">
              Rincian Belanja Sembako:
            </div>
            <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-xl overflow-hidden bg-white">
              {order.items.map((item, idx) => {
                const price =
                  item.selectedUnitType === 'grosir' && item.product.wholesalePrice
                    ? item.product.wholesalePrice
                    : (item.product.discountPrice || item.product.price);
                return (
                  <div key={idx} className="p-3 flex items-center justify-between gap-2">
                    <div>
                      <div className="font-semibold text-neutral-900">{item.product.name}</div>
                      <div className="text-[10px] text-neutral-500">
                        {item.quantity} {item.product.unit} x {formatRupiah(price)}
                      </div>
                    </div>
                    <div className="font-bold text-neutral-900">
                      {formatRupiah(price * item.quantity)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Total */}
          <div className="p-4 bg-emerald-900 text-white rounded-2xl flex items-center justify-between">
            <div>
              <div className="text-[11px] text-emerald-200">Total Pembayaran ({order.paymentMethod.toUpperCase()}):</div>
              <div className="text-xl font-black text-amber-300">{formatRupiah(order.totalAmount)}</div>
            </div>
            <span className="px-3 py-1 bg-emerald-800 rounded-full text-[10px] font-bold border border-emerald-600">
              {order.status}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <a
              href={`https://wa.me/${STORE_INFO.whatsapp}?text=${generateWhatsAppMessage()}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer text-center"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Kirim Nota via WhatsApp Toko</span>
            </a>

            <div className="flex gap-2">
              <button
                onClick={handleCopyReceipt}
                className="flex-1 py-2.5 px-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Nota</span>
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 px-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Nota</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
