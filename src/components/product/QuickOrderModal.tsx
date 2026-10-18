'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product, ProductCapacity } from '@/types';
import { formatVND } from '@/lib/utils';
import { X, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

interface QuickOrderModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickOrderModal({ product, isOpen, onClose }: QuickOrderModalProps) {
  const router = useRouter();
  const [selectedCapacity, setSelectedCapacity] = useState<ProductCapacity>(
    product?.variants[0]?.capacity || '10ml'
  );
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank_transfer'>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Sync capacity when product changes
  React.useEffect(() => {
    if (product && product.variants?.length > 0) {
      setSelectedCapacity(product.variants[0].capacity);
    }
  }, [product]);

  if (!isOpen || !product) return null;


  const currentVariant =
    product.variants.find((v) => v.capacity === selectedCapacity) || product.variants[0];
  const itemPrice = currentVariant.salePrice || currentVariant.price;
  const subtotal = itemPrice * quantity;
  const shippingFee = subtotal >= 499000 ? 0 : 30000;
  const total = subtotal + shippingFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName.trim() || !customerPhone.trim() || !shippingAddress.trim()) {
      setErrorMessage('Vui lòng điền Họ tên, Số điện thoại và Địa chỉ nhận hàng.');
      return;
    }

    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Số điện thoại không hợp lệ (ít nhất 10 số).');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerPhone: cleanPhone,
          shippingAddress,
          paymentMethod,
          items: [
            {
              productId: product.id,
              capacity: selectedCapacity,
              quantity,
            },
          ],
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Có lỗi xảy ra');
      }

      onClose();
      router.push(`/don-hang/${data.order.orderCode}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Không thể gửi đơn hàng');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-deep-forest/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-clay shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-5">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-charcoal/50 hover:text-botanical rounded-full hover:bg-clay/50 transition-colors"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-4 pb-4 border-b border-clay/60">
          <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-ivory flex-shrink-0 border border-clay">
            <Image src={product.image} alt={product.name} fill className="object-cover" />
          </div>
          <div>
            <span className="text-[10px] text-earth uppercase font-semibold block">Đặt Hàng Nhanh 1 Bước</span>
            <h3 className="font-serif text-lg font-bold text-botanical">{product.name}</h3>
            <span className="text-xs text-charcoal/70">{product.subtitle}</span>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Capacity selection */}
          <div className="space-y-1.5">
            <label className="font-semibold text-charcoal">Chọn dung tích:</label>
            <div className="flex gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.capacity}
                  type="button"
                  onClick={() => setSelectedCapacity(v.capacity)}
                  className={`flex-1 py-2 px-3 rounded-xl border font-medium text-xs text-center transition-all ${
                    selectedCapacity === v.capacity
                      ? 'bg-botanical text-ivory border-botanical shadow-xs'
                      : 'bg-ivory border-clay text-charcoal hover:bg-clay/50'
                  }`}
                >
                  <span className="block font-bold">{v.capacity}</span>
                  <span className="text-[10px] opacity-80">{formatVND(v.salePrice || v.price)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="flex items-center justify-between py-2 border-y border-clay/40">
            <span className="font-semibold text-charcoal">Số lượng lọ:</span>
            <div className="flex items-center border border-clay rounded-xl bg-ivory-50 px-2 py-1">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-2 font-bold text-charcoal hover:text-botanical"
              >
                -
              </button>
              <span className="px-3 font-bold text-sm text-charcoal">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="px-2 font-bold text-charcoal hover:text-botanical"
              >
                +
              </button>
            </div>
          </div>

          {/* Customer info fields */}
          <div className="space-y-3 pt-1">
            <div className="space-y-1">
              <label className="font-semibold text-charcoal">Họ tên người nhận *</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Ví dụ: Trần Văn Nam"
                className="w-full px-4 py-2.5 rounded-xl border border-clay bg-ivory-50 focus:bg-white outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-charcoal">Số điện thoại *</label>
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Ví dụ: 0912345678"
                className="w-full px-4 py-2.5 rounded-xl border border-clay bg-ivory-50 focus:bg-white outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-charcoal">Địa chỉ nhận hàng cụ thể *</label>
              <input
                type="text"
                required
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành..."
                className="w-full px-4 py-2.5 rounded-xl border border-clay bg-ivory-50 focus:bg-white outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-charcoal">Hình thức thanh toán:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-2.5 rounded-xl border text-center font-medium transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-botanical bg-botanical/10 text-botanical font-bold'
                      : 'border-clay text-charcoal'
                  }`}
                >
                  Tiền mặt khi nhận (COD)
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank_transfer')}
                  className={`p-2.5 rounded-xl border text-center font-medium transition-all ${
                    paymentMethod === 'bank_transfer'
                      ? 'border-botanical bg-botanical/10 text-botanical font-bold'
                      : 'border-clay text-charcoal'
                  }`}
                >
                  Chuyển khoản (VietQR)
                </button>
              </div>
            </div>
          </div>

          {/* Pricing summary */}
          <div className="bg-ivory-50 p-4 rounded-2xl border border-clay/60 space-y-1.5">
            <div className="flex justify-between text-charcoal/70">
              <span>Tiền hàng:</span>
              <span>{formatVND(subtotal)}</span>
            </div>
            <div className="flex justify-between text-charcoal/70">
              <span>Phí vận chuyển:</span>
              <span>{shippingFee === 0 ? 'Miễn phí' : formatVND(shippingFee)}</span>
            </div>
            <div className="flex justify-between items-baseline pt-1.5 border-t border-clay/60 font-bold text-sm text-botanical">
              <span>Tổng thanh toán:</span>
              <span className="font-serif text-lg">{formatVND(total)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-botanical hover:bg-botanical-dark text-ivory py-3.5 px-6 rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4 fill-current text-gold" />
            <span>{isSubmitting ? 'Đang tạo đơn...' : `Xác Nhận Đặt Hàng (${formatVND(total)})`}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
