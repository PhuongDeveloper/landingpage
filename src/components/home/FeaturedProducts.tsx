'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { formatVND } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Plus, ShoppingBag, Zap } from 'lucide-react';
import QuickOrderModal from '@/components/product/QuickOrderModal';
import { useCart } from '@/context/CartContext';

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const { addToCart } = useCart();
  const [selectedProductForQuickOrder, setSelectedProductForQuickOrder] = useState<Product | null>(null);

  // Hiển thị 4 sản phẩm chính theo đúng ảnh mẫu
  const displayProducts = products.slice(0, 4);

  return (
    <section id="san-pham" className="py-16 sm:py-24 bg-ivory-50 relative border-t border-clay/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header matching reference image */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center gap-2.5 text-xs text-earth font-light tracking-widest uppercase">
            <span className="w-6 h-[1px] bg-earth/60" />
            <span>Sản phẩm nổi bật</span>
            <span className="w-6 h-[1px] bg-earth/60" />
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-botanical-dark">
            Tinh hoa thiên nhiên, nâng tầm cuộc sống
          </h2>
        </div>

        {/* Product Carousel Grid with Arrows matching reference design */}
        <div className="relative">
          {/* Navigation Arrows on sides */}
          <div className="hidden lg:flex items-center justify-between absolute top-1/2 -left-4 -right-4 -translate-y-1/2 pointer-events-none z-20">
            <Link
              href="/san-pham"
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-xs text-botanical shadow-md flex items-center justify-center pointer-events-auto hover:bg-botanical hover:text-white transition-all -translate-x-2"
              aria-label="Xem sản phẩm trước"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <Link
              href="/san-pham"
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-xs text-botanical shadow-md flex items-center justify-center pointer-events-auto hover:bg-botanical hover:text-white transition-all translate-x-2"
              aria-label="Xem sản phẩm tiếp theo"
            >
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

        {/* Featured Products Cards */}
        {displayProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-clay/60 max-w-md mx-auto text-sm text-charcoal/60">
            Chưa có sản phẩm nào được hiển thị.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayProducts.map((p) => {
              const defaultVariant = p.variants[0];
              const price = defaultVariant?.salePrice || defaultVariant?.price || 0;

              return (
                <div
                  key={p.id}
                  className="group bg-white rounded-2xl overflow-hidden border border-clay/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Image Frame */}
                  <div className="relative aspect-[4/4] overflow-hidden bg-ivory-50 p-4">
                    <Link href={`/san-pham/${p.slug}`}>
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    </Link>

                    {/* Quick Order Button overlaid on image */}
                    <button
                      type="button"
                      onClick={() => setSelectedProductForQuickOrder(p)}
                      className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-botanical/80 hover:bg-botanical text-white flex items-center justify-center shadow-md transition-transform group-hover:scale-110"
                      title="Đặt nhanh 1 bước"
                      aria-label={`Đặt nhanh ${p.name}`}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Content details matching reference text */}
                  <div className="p-4 space-y-2">
                    <Link href={`/san-pham/${p.slug}`}>
                      <h3 className="font-serif font-semibold text-base text-botanical-dark group-hover:text-botanical transition-colors">
                        {p.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-charcoal/60 leading-snug line-clamp-1">
                      {p.subtitle}
                    </p>

                    <div className="pt-2 flex items-center justify-between border-t border-clay/40 text-xs">
                      <span className="font-serif font-bold text-botanical text-sm">
                        {formatVND(price)}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedProductForQuickOrder(p)}
                        className="text-[11px] font-semibold text-earth hover:text-botanical flex items-center gap-1 bg-ivory px-2.5 py-1 rounded-md border border-clay/60"
                      >
                        <Zap className="w-3 h-3 text-gold fill-current" />
                        <span>Mua ngay</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        </div>

        {/* View all link */}
        <div className="text-center mt-10">
          <Link
            href="/san-pham"
            className="inline-flex items-center text-xs font-semibold text-botanical hover:underline tracking-wider"
          >
            Khám phá toàn bộ {products.length} sản phẩm tinh dầu →
          </Link>
        </div>
      </div>

      {/* Quick Order 1-Step Modal */}
      <QuickOrderModal
        product={selectedProductForQuickOrder}
        isOpen={Boolean(selectedProductForQuickOrder)}
        onClose={() => setSelectedProductForQuickOrder(null)}
      />
    </section>
  );
}
