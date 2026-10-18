'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { formatVND } from '@/lib/utils';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';

const FREE_SHIPPING_THRESHOLD = 499000;

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeFromCart, subtotal, totalItems } = useCart();

  // Đóng giỏ hàng bằng phím Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  const diffForFreeShip = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShipProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-deep-forest/50 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-ivory shadow-2xl flex flex-col border-l border-clay animate-fade-in">
          {/* Header */}
          <div className="p-5 border-b border-clay flex items-center justify-between bg-ivory-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-botanical" />
              <h2 className="font-serif text-lg font-bold text-botanical">
                Giỏ Hàng Của Bạn ({totalItems})
              </h2>
            </div>
            <button
              type="button"
              onClick={closeCart}
              className="p-1.5 rounded-full text-charcoal/60 hover:text-botanical hover:bg-clay/50 transition-colors"
              aria-label="Đóng giỏ hàng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-botanical-forest/10 px-5 py-3 border-b border-clay/60 text-xs">
            {diffForFreeShip > 0 ? (
              <p className="text-charcoal mb-1.5">
                Mua thêm <strong className="text-botanical">{formatVND(diffForFreeShip)}</strong> để được{' '}
                <strong className="text-botanical font-semibold">Miễn phí giao hàng</strong> toàn quốc.
              </p>
            ) : (
              <p className="text-botanical font-medium flex items-center gap-1.5 mb-1.5">
                <ShieldCheck className="w-4 h-4 text-botanical" />
                Đơn hàng của bạn đã đủ điều kiện Miễn phí giao hàng!
              </p>
            )}
            <div className="w-full bg-clay h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-botanical h-full rounded-full transition-all duration-300"
                style={{ width: `${freeShipProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-clay/50 flex items-center justify-center text-botanical/60">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-lg font-medium text-charcoal">
                  Giỏ hàng đang trống
                </h3>
                <p className="text-xs text-charcoal/60 max-w-xs">
                  Hãy chọn những giọt hương thuần khiết từ thiên nhiên để bắt đầu nghi thức thư giãn của bạn.
                </p>
                <button
                  type="button"
                  onClick={closeCart}
                  className="mt-2 inline-flex items-center text-xs font-medium text-botanical hover:underline"
                >
                  Tiếp tục xem sản phẩm →
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.productId}-${item.capacity}`}
                  className="flex gap-4 p-3 bg-white rounded-xl border border-clay/60 shadow-sm"
                >
                  <div className="relative w-20 h-20 flex-shrink-0 bg-ivory rounded-lg overflow-hidden border border-clay/40">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-sm text-charcoal leading-snug line-clamp-1">
                          {item.name}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.productId, item.capacity)}
                          className="text-charcoal/40 hover:text-red-600 transition-colors p-1"
                          aria-label={`Xóa ${item.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="inline-block text-[11px] text-earth font-medium bg-ivory px-2 py-0.5 rounded mt-1">
                        Dung tích: {item.capacity}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-clay rounded-lg overflow-hidden bg-ivory-50">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.capacity, item.quantity - 1)}
                          className="p-1 hover:bg-clay text-charcoal transition-colors"
                          aria-label="Giảm 1"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold text-charcoal">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.capacity, item.quantity + 1)}
                          className="p-1 hover:bg-clay text-charcoal transition-colors"
                          aria-label="Tăng 1"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-serif text-sm font-semibold text-botanical">
                        {formatVND(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout CTA */}
          {items.length > 0 && (
            <div className="p-5 border-t border-clay bg-ivory-50 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-charcoal/70">Tạm tính:</span>
                <span className="font-serif text-lg font-bold text-botanical">
                  {formatVND(subtotal)}
                </span>
              </div>
              <p className="text-[11px] text-charcoal/60">
                * Phí vận chuyển sẽ được tính chi tiết tại bước thanh toán (Miễn phí từ 499.000đ).
              </p>
              <Link
                href="/thanh-toan"
                onClick={closeCart}
                className="w-full bg-botanical hover:bg-botanical-forest text-ivory py-3.5 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md"
              >
                <span>Tiến Hành Đặt Hàng</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
