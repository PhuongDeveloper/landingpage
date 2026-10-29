'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { formatVND } from '@/lib/utils';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  ArrowLeft,
  Lock,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

const FREE_SHIPPING_THRESHOLD = 499000;
const STANDARD_SHIPPING_FEE = 30000;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank_transfer'>('cod');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  const total = subtotal + shippingFee;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (items.length === 0) {
      setErrorMessage('Giỏ hàng của bạn đang trống.');
      return;
    }

    if (!customerName.trim() || !customerPhone.trim() || !shippingAddress.trim()) {
      setErrorMessage('Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ nhận hàng.');
      return;
    }

    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Số điện thoại chưa đúng định dạng (ít nhất 10 số).');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerPhone: cleanPhone,
          customerEmail,
          shippingAddress,
          note,
          paymentMethod,
          items: items.map((item) => ({
            productId: item.productId,
            capacity: item.capacity,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Có lỗi xảy ra khi tạo đơn hàng');
      }

      clearCart();
      router.push(`/don-hang/${data.order.orderCode}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Không thể kết nối tới máy chủ, vui lòng thử lại.');
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="py-20 bg-ivory min-h-[70vh] flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-3xl border border-clay/80 shadow-xs max-w-md mx-auto space-y-4">
          <h2 className="font-serif text-2xl font-bold text-botanical">
            Giỏ Hàng Chưa Có Sản Phẩm
          </h2>
          <p className="text-xs text-charcoal/70">
            Vui lòng chọn ít nhất một sản phẩm tinh dầu để tiếp tục thanh toán.
          </p>
          <Link
            href="/san-pham"
            className="inline-flex items-center gap-2 bg-botanical text-ivory px-6 py-3 rounded-full text-xs font-semibold hover:bg-botanical-dark transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại xem sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 lg:py-16 bg-ivory min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/san-pham"
            className="inline-flex items-center gap-1.5 text-xs text-earth hover:text-botanical transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Tiếp tục mua sắm
          </Link>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-botanical-dark mt-2">
            Thông Tin Đặt Hàng & Giao Nhận
          </h1>
          <p className="text-xs text-charcoal/60 mt-1">
            Đặt hàng nhanh không cần tạo tài khoản. Chúng tôi sẽ liên hệ xác nhận trước khi giao.
          </p>
        </div>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Customer & Shipping Details */}
          <div className="lg:col-span-7 space-y-6">
            {errorMessage && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs flex items-center gap-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Contact Information */}
            <div className="p-6 bg-white rounded-2xl border border-clay/80 shadow-xs space-y-4">
              <h2 className="font-serif text-lg font-bold text-botanical flex items-center gap-2">
                <span>1. Thông Tin Người Nhận</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-charcoal">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ví dụ: Nguyễn Văn An"
                    className="w-full px-4 py-2.5 rounded-xl border border-clay bg-ivory-50 text-xs focus:ring-2 focus:ring-botanical/20 focus:border-botanical focus:bg-white outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-charcoal">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Ví dụ: 0912345678"
                    className="w-full px-4 py-2.5 rounded-xl border border-clay bg-ivory-50 text-xs focus:ring-2 focus:ring-botanical/20 focus:border-botanical focus:bg-white outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-charcoal">
                  Email nhận hóa đơn & thông báo (tùy chọn)
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-clay bg-ivory-50 text-xs focus:ring-2 focus:ring-botanical/20 focus:border-botanical focus:bg-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-charcoal">
                  Địa chỉ nhận hàng chi tiết <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành..."
                  className="w-full px-4 py-2.5 rounded-xl border border-clay bg-ivory-50 text-xs focus:ring-2 focus:ring-botanical/20 focus:border-botanical focus:bg-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-charcoal">
                  Ghi chú giao hàng (thời gian nhận, lưu ý đóng gói)
                </label>
                <textarea
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi đến..."
                  className="w-full px-4 py-2.5 rounded-xl border border-clay bg-ivory-50 text-xs focus:ring-2 focus:ring-botanical/20 focus:border-botanical focus:bg-white outline-none"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="p-6 bg-white rounded-2xl border border-clay/80 shadow-xs space-y-4">
              <h2 className="font-serif text-lg font-bold text-botanical">
                2. Hình Thức Thanh Toán
              </h2>

              <div className="space-y-3">
                <label
                  className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-botanical bg-botanical/5 shadow-xs'
                      : 'border-clay hover:border-botanical/40 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-1 accent-botanical"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-botanical" />
                      <span className="font-semibold text-xs text-charcoal">
                        Thanh toán khi nhận hàng (COD)
                      </span>
                    </div>
                    <p className="text-[11px] text-charcoal/70 mt-1">
                      Kiểm tra hàng thoải mái trước khi thanh toán tiền mặt cho nhân viên bưu tá.
                    </p>
                  </div>
                </label>

              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 bg-white rounded-2xl border border-clay/80 shadow-xs space-y-5 sticky top-24">
              <h2 className="font-serif text-lg font-bold text-botanical pb-3 border-b border-clay/60">
                Tóm Tắt Đơn Hàng ({items.reduce((s, i) => s + i.quantity, 0)} món)
              </h2>

              {/* Items List */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.capacity}`} className="flex gap-3 text-xs">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-ivory flex-shrink-0 border border-clay/60">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-charcoal line-clamp-1">{item.name}</h4>
                      <span className="text-[11px] text-earth">Dung tích: {item.capacity}</span>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-charcoal/60">x{item.quantity}</span>
                        <span className="font-semibold text-botanical">
                          {formatVND(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Calculation Breakdown */}
              <div className="border-t border-clay/60 pt-3 space-y-2 text-xs">
                <div className="flex justify-between text-charcoal/70">
                  <span>Tiền hàng:</span>
                  <span className="font-medium text-charcoal">{formatVND(subtotal)}</span>
                </div>
                <div className="flex justify-between text-charcoal/70">
                  <span>Phí vận chuyển:</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-emerald-700 font-semibold">Miễn phí</span>
                    ) : (
                      formatVND(shippingFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-clay/60">
                  <span className="font-semibold text-sm text-charcoal">Tổng thanh toán:</span>
                  <span className="font-serif text-xl font-bold text-botanical">
                    {formatVND(total)}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-botanical hover:bg-botanical-dark text-ivory py-4 px-6 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span>Đang xử lý đơn hàng...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-gold-light" />
                    <span>Xác Nhận Đặt Hàng ({formatVND(total)})</span>
                  </>
                )}
              </button>

              <div className="text-[11px] text-charcoal/60 space-y-1.5 pt-2 text-center border-t border-clay/40">
                <p className="flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-botanical" />
                  Bảo mật thông tin khách hàng tuyệt đối
                </p>
                <p>Hotline hỗ trợ: <strong>0988 123 456</strong></p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
