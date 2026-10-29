import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getOrderByCode, getSiteConfig } from '@/lib/storage';
import { vietQrTransfer } from '@/lib/vietqr';
import { formatVND, formatDateVietnamese } from '@/lib/utils';
import { CheckCircle2, Clock, Truck, PackageCheck, AlertCircle, Phone, ArrowLeft, QrCode } from 'lucide-react';

export const dynamic='force-dynamic';
export const metadata={robots:{index:false,follow:false}};

interface Props {
  params: {
    code: string;
  };
}

export default async function OrderDetailPage({ params }: Props) {
  const [order, config] = await Promise.all([getOrderByCode(params.code),getSiteConfig()]);

  if (!order) {
    notFound();
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Chờ xác nhận',
          color: 'bg-amber-50 text-amber-800 border-amber-200',
          icon: Clock,
        };
      case 'processing':
        return {
          label: 'Đang đóng gói',
          color: 'bg-blue-50 text-blue-800 border-blue-200',
          icon: Clock,
        };
      case 'shipping':
        return {
          label: 'Đang giao hàng',
          color: 'bg-purple-50 text-purple-800 border-purple-200',
          icon: Truck,
        };
      case 'completed':
        return {
          label: 'Đã hoàn thành',
          color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          icon: PackageCheck,
        };
      case 'cancelled':
        return {
          label: 'Đã hủy',
          color: 'bg-red-50 text-red-800 border-red-200',
          icon: AlertCircle,
        };
      default:
        return {
          label: status,
          color: 'bg-gray-50 text-gray-800 border-gray-200',
          icon: Clock,
        };
    }
  };

  const statusInfo = getStatusBadge(order.status);
  const StatusIcon = statusInfo.icon;
  const transfer = order.paymentMethod === 'bank_transfer' ? vietQrTransfer(order,config) : null;

  return (
    <div className="py-12 lg:py-20 bg-ivory min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center space-y-3 mb-10">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-botanical-dark">
            Đặt Hàng Thành Công!
          </h1>
          <p className="text-sm text-charcoal/70 max-w-md mx-auto">
            Cảm ơn bạn đã lựa chọn Nam Mộc Hương. Chúng tôi sẽ sớm liên hệ xác nhận đơn hàng qua số điện thoại của bạn.
          </p>
        </div>

        {/* Order Card */}
        <div className="bg-white rounded-3xl border border-clay/80 shadow-sm overflow-hidden space-y-6 p-6 sm:p-8">
          {/* Top Bar Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-clay/60 gap-4">
            <div>
              <span className="text-[11px] text-earth uppercase font-semibold block">Mã Đơn Hàng</span>
              <span className="font-mono text-xl font-bold text-botanical">{order.orderCode}</span>
              <span className="text-xs text-charcoal/50 block mt-0.5">
                Ngày đặt: {formatDateVietnamese(order.createdAt)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${statusInfo.color}`}
              >
                <StatusIcon className="w-4 h-4" />
                <span>{statusInfo.label}</span>
              </span>
            </div>
          </div>

          {order.paymentMethod === 'bank_transfer' && order.status === 'pending' && (
            transfer ? <div className="p-5 bg-ivory border border-clay text-sm space-y-4">
              <h2 className="font-serif text-2xl text-botanical">Chuyển khoản VietQR</h2>
              <div className="flex flex-col sm:flex-row items-start gap-5">
                <div className="relative w-[240px] h-[284px] shrink-0"><Image src={transfer.imageUrl} alt="Mã VietQR cho đơn hàng" fill unoptimized sizes="240px" className="object-contain" /></div>
                <dl className="space-y-3 text-xs break-words">
                  <div><dt className="text-charcoal/60">Ngân hàng</dt><dd className="font-semibold">{config.bankName}</dd></div>
                  <div><dt className="text-charcoal/60">Số tài khoản</dt><dd className="font-semibold">{config.bankAccountNo}</dd></div>
                  <div><dt className="text-charcoal/60">Chủ tài khoản</dt><dd className="font-semibold">{config.bankAccountName}</dd></div>
                  <div><dt className="text-charcoal/60">Số tiền</dt><dd className="font-semibold">{formatVND(order.total)}</dd></div>
                  <div><dt className="text-charcoal/60">Nội dung trong QR</dt><dd className="font-semibold">{transfer.transferNote}</dd></div>
                  <div><dt className="text-charcoal/60">Thông tin đối chiếu đầy đủ</dt><dd>{transfer.fullReference}</dd></div>
                </dl>
              </div>
              <p className="text-xs text-charcoal/70">VietQR giới hạn 50 ký tự không dấu cho nội dung. Địa chỉ có thể được rút gọn trong QR; địa chỉ giao hàng đầy đủ vẫn nằm trong đơn hàng.</p>
            </div> : <p className="p-4 border border-amber-300 bg-amber-50 text-amber-900 text-sm">Thông tin chuyển khoản chưa được cấu hình. Vui lòng liên hệ cửa hàng trước khi thanh toán.</p>
          )}

          {/* Delivery & Customer Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs border-b border-clay/60 pb-6">
            <div className="space-y-1">
              <h3 className="font-semibold text-botanical text-sm">Người Nhận Hàng</h3>
              <p className="font-medium text-charcoal">{order.customerName}</p>
              <p className="text-charcoal/70">Số điện thoại: {order.customerPhone}</p>
              {order.customerEmail && <p className="text-charcoal/70">Email: {order.customerEmail}</p>}
            </div>

            <div className="space-y-1">
              <h3 className="font-semibold text-botanical text-sm">Địa Chỉ Giao Nhận</h3>
              <p className="text-charcoal/80 leading-relaxed">{order.shippingAddress}</p>
              {order.note && <p className="text-earth italic mt-1">Ghi chú: "{order.note}"</p>}
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-3">
            <h3 className="font-semibold text-botanical text-sm">Sản Phẩm Đã Đặt</h3>
            <div className="divide-y divide-clay/40 text-xs">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3 flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-charcoal">{item.name}</h4>
                    <span className="text-earth text-[11px]">Dung tích: {item.capacity}</span>
                    <span className="text-charcoal/50 ml-2">x{item.quantity}</span>
                  </div>
                  <span className="font-semibold text-botanical">
                    {formatVND(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Calculation Summary */}
          <div className="border-t border-clay/60 pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-charcoal/70">
              <span>Tạm tính:</span>
              <span>{formatVND(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-charcoal/70">
              <span>Phí vận chuyển:</span>
              <span>{order.shippingFee === 0 ? 'Miễn phí' : formatVND(order.shippingFee)}</span>
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t border-clay/60 text-sm">
              <span className="font-bold text-charcoal">Tổng thanh toán:</span>
              <span className="font-serif text-xl font-bold text-botanical">
                {formatVND(order.total)}
              </span>
            </div>
          </div>

          {/* Support Actions */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-clay/60 text-xs">
            <div className="flex items-center gap-1.5 text-charcoal/70">
              <Phone className="w-4 h-4 text-botanical" />
              {config.hotline && <span>Hỗ trợ nhanh: <strong className="text-botanical">{config.hotline}</strong></span>}
            </div>

            <Link
              href="/san-pham"
              className="inline-flex items-center gap-2 bg-botanical hover:bg-botanical-dark text-ivory px-6 py-2.5 rounded-full font-semibold transition-all shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" /> Tiếp tục khám phá sản phẩm
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
