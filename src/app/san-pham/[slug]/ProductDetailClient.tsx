'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product, ProductCapacity } from '@/types';
import { useCart } from '@/context/CartContext';
import { formatVND } from '@/lib/utils';
import {
  Star,
  ShoppingBag,
  Zap,
  MapPin,
  Sparkles,
  Droplets,
  ShieldCheck,
  RotateCcw,
  Check,
  Plus,
  Minus,
} from 'lucide-react';

interface Props {
  product: Product;
}

export default function ProductDetailClient({ product }: Props) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [selectedCapacity, setSelectedCapacity] = useState<ProductCapacity>(
    product.variants[0]?.capacity || '10ml'
  );
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product.image);
  const [addedToast, setAddedToast] = useState(false);
  const [activeTab, setActiveTab] = useState<'benefits' | 'ritual' | 'guarantee'>('benefits');

  const currentVariant =
    product.variants.find((v) => v.capacity === selectedCapacity) || product.variants[0];

  const handleAddToCart = () => {
    addToCart(product, selectedCapacity, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedCapacity, quantity);
    router.push('/thanh-toan');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
      {/* Left: Product Images Gallery */}
      <div className="lg:col-span-6 space-y-4">
        {/* Main Image Frame */}
        <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-white border border-clay/80 shadow-sm">
          <Image
            src={activeImage}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          {product.isFeatured && (
            <div className="absolute top-4 left-4 bg-gold text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Tuyển chọn thủ công
            </div>
          )}
        </div>

        {/* Thumbnail Selector */}
        {product.gallery.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {product.gallery.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImage(img)}
                className={`relative w-20 h-24 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                  activeImage === img ? 'border-botanical scale-95' : 'border-clay/60 opacity-70 hover:opacity-100'
                }`}
              >
                <Image src={img} alt={`${product.name} - ảnh ${idx + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right: Product Purchase Controls & Fragrance Notes */}
      <div className="lg:col-span-6 space-y-6">
        <div>
          {/* Rating & Reviews */}
          <div className="flex items-center gap-2 text-xs text-charcoal/70 mb-2">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <span className="font-semibold text-charcoal">{product.rating}</span>
            <span className="text-charcoal/40">({product.reviewCount} đánh giá từ khách hàng)</span>
          </div>

          {/* Title & Subtitle */}
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-botanical-dark leading-tight">
            {product.name}
          </h1>
          <p className="text-sm text-charcoal/80 mt-2 leading-relaxed">
            {product.subtitle}
          </p>
        </div>

        {/* Price Box */}
        <div className="p-4 bg-white rounded-2xl border border-clay/80 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-3">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-botanical">
                {formatVND(currentVariant.salePrice || currentVariant.price)}
              </span>
              {currentVariant.salePrice && (
                <span className="text-sm text-charcoal/40 line-through">
                  {formatVND(currentVariant.price)}
                </span>
              )}
            </div>
            <span className="text-[11px] text-earth font-medium">
              Đã bao gồm thuế • Miễn phí vận chuyển từ 499.000đ
            </span>
          </div>

          <div className="text-right">
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
              Còn {currentVariant.stock} lọ
            </span>
          </div>
        </div>

        {/* Capacity Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block">
            Chọn Dung Tích: <span className="text-botanical font-bold">{selectedCapacity}</span>
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
            {product.variants.map((v) => (
              <button
                key={v.capacity}
                type="button"
                onClick={() => setSelectedCapacity(v.capacity)}
                className={`p-3 rounded-xl border text-xs font-medium transition-all text-center flex flex-col items-center justify-center gap-1 ${
                  selectedCapacity === v.capacity
                    ? 'border-botanical bg-botanical text-ivory shadow-xs font-semibold'
                    : 'border-clay bg-white text-charcoal hover:border-botanical/50'
                }`}
              >
                <span>{v.capacity}</span>
                <span className="text-[10px] opacity-80">
                  {formatVND(v.salePrice || v.price)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Quantity and Actions */}
        <div className="space-y-3 pt-2">
          <div className="flex gap-4">
            {/* Quantity Controls */}
            <div className="flex items-center border border-clay rounded-xl bg-white px-2">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-2 text-charcoal/70 hover:text-botanical transition-colors"
                aria-label="Giảm số lượng"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-10 text-center font-semibold text-sm text-charcoal">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="p-2 text-charcoal/70 hover:text-botanical transition-colors"
                aria-label="Tăng số lượng"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 bg-white hover:bg-clay/40 text-botanical border border-botanical py-3.5 px-6 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              {addedToast ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Đã thêm vào giỏ!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Thêm Vào Giỏ</span>
                </>
              )}
            </button>
          </div>

          {/* Buy Now Button */}
          <button
            type="button"
            onClick={handleBuyNow}
            className="w-full bg-botanical hover:bg-botanical-dark text-ivory py-4 px-6 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
          >
            <Zap className="w-4 h-4 fill-current text-gold" />
            <span>Mua Ngay — Giao Hàng Tận Nơi</span>
          </button>
        </div>

        {/* Fragrance Pyramid (Tầng hương nghệ thuật) */}
        <div className="p-5 bg-white rounded-2xl border border-clay/80 space-y-3">
          <h3 className="text-xs uppercase tracking-wider font-bold text-botanical flex items-center gap-1.5">
            <Droplets className="w-4 h-4 text-gold-dark" />
            Kim Tự Tháp Tầng Hương (Fragrance Pyramid)
          </h3>
          <div className="space-y-2 text-xs divide-y divide-clay/40">
            <div className="pt-1.5 flex justify-between">
              <span className="font-semibold text-earth">Hương đầu (Top):</span>
              <span className="text-charcoal/80 text-right">{product.notes.top}</span>
            </div>
            <div className="pt-1.5 flex justify-between">
              <span className="font-semibold text-earth">Hương giữa (Heart):</span>
              <span className="text-charcoal/80 text-right">{product.notes.middle}</span>
            </div>
            <div className="pt-1.5 flex justify-between">
              <span className="font-semibold text-earth">Hương cuối (Base):</span>
              <span className="text-charcoal/80 text-right">{product.notes.base}</span>
            </div>
          </div>
        </div>

        {/* Origin & Extraction Info */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-white rounded-xl border border-clay/70">
            <span className="text-[10px] text-earth uppercase font-semibold block mb-0.5">Vùng Nguyên Liệu</span>
            <div className="flex items-center gap-1 text-botanical font-medium">
              <MapPin className="w-3.5 h-3.5 text-gold-dark flex-shrink-0" />
              <span className="truncate">{product.origin}</span>
            </div>
          </div>
          <div className="p-3 bg-white rounded-xl border border-clay/70">
            <span className="text-[10px] text-earth uppercase font-semibold block mb-0.5">Phương Pháp</span>
            <div className="flex items-center gap-1 text-botanical font-medium">
              <Sparkles className="w-3.5 h-3.5 text-gold-dark flex-shrink-0" />
              <span className="truncate">{product.extractionMethod}</span>
            </div>
          </div>
        </div>

        {/* Tabbed Details (Lợi ích / Nghi thức / Cam kết) */}
        <div className="border-t border-clay/80 pt-4 space-y-4">
          <div className="flex border-b border-clay/80 gap-6 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('benefits')}
              className={`pb-2.5 transition-colors relative ${
                activeTab === 'benefits'
                  ? 'text-botanical border-b-2 border-botanical'
                  : 'text-charcoal/60 hover:text-botanical'
              }`}
            >
              Công Dụng Chính
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ritual')}
              className={`pb-2.5 transition-colors relative ${
                activeTab === 'ritual'
                  ? 'text-botanical border-b-2 border-botanical'
                  : 'text-charcoal/60 hover:text-botanical'
              }`}
            >
              Nghi Thức Sử Dụng
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('guarantee')}
              className={`pb-2.5 transition-colors relative ${
                activeTab === 'guarantee'
                  ? 'text-botanical border-b-2 border-botanical'
                  : 'text-charcoal/60 hover:text-botanical'
              }`}
            >
              Cam Kết & Đổi Trả
            </button>
          </div>

          <div className="text-xs text-charcoal/80 leading-relaxed min-h-[90px]">
            {activeTab === 'benefits' && (
              <ul className="space-y-2 list-disc list-inside">
                {product.benefits.map((b, idx) => (
                  <li key={idx} className="marker:text-botanical">
                    {b}
                  </li>
                ))}
              </ul>
            )}

            {activeTab === 'ritual' && (
              <ul className="space-y-2">
                {product.ritualGuide.map((r, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-botanical/10 text-botanical flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            )}

            {activeTab === 'guarantee' && (
              <div className="space-y-2 text-xs">
                <p className="flex items-center gap-1.5 font-medium text-botanical">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  100% Nguyên chất từ thiên nhiên, hoàn tiền 200% nếu phát hiện hương liệu hóa chất.
                </p>
                <p className="flex items-center gap-1.5 font-medium text-botanical">
                  <RotateCcw className="w-4 h-4 text-emerald-600" />
                  Đổi trả sản phẩm dễ dàng trong 7 ngày nếu không hợp mùi hương.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
