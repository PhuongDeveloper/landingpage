'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import ProductCard from '@/components/product/ProductCard';
import { ArrowRight } from 'lucide-react';

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'don-huong' | 'phoi-huong' | 'xong-phong' | 'massage'>('all');

  const filteredProducts = activeFilter === 'all'
    ? products
    : products.filter((p) => p.category === activeFilter);

  return (
    <section id="san-pham" className="py-20 lg:py-28 bg-ivory scroll-mt-20 border-t border-clay/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <span className="text-xs uppercase tracking-[0.2em] text-earth font-bold block">
            Tuyển Chọn Nam Mộc Hương
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-botanical-dark">
            Tinh Dầu Thiên Nhiên Nguyên Chất
          </h2>
          <p className="text-sm text-charcoal/70">
            Mỗi giọt tinh dầu là sự kết tinh của thảo mộc tự nhiên và sự tỉ mỉ trong từng giờ chưng cất chậm.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              activeFilter === 'all'
                ? 'bg-botanical text-ivory shadow-xs'
                : 'bg-white text-charcoal/70 hover:bg-clay/60 border border-clay/80'
            }`}
          >
            Tất Cả ({products.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('don-huong')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              activeFilter === 'don-huong'
                ? 'bg-botanical text-ivory shadow-xs'
                : 'bg-white text-charcoal/70 hover:bg-clay/60 border border-clay/80'
            }`}
          >
            Đơn Hương
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('phoi-huong')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              activeFilter === 'phoi-huong'
                ? 'bg-botanical text-ivory shadow-xs'
                : 'bg-white text-charcoal/70 hover:bg-clay/60 border border-clay/80'
            }`}
          >
            Phối Hương (Blend)
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('xong-phong')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              activeFilter === 'xong-phong'
                ? 'bg-botanical text-ivory shadow-xs'
                : 'bg-white text-charcoal/70 hover:bg-clay/60 border border-clay/80'
            }`}
          >
            Xông Phòng & Kháng Khuẩn
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('massage')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              activeFilter === 'massage'
                ? 'bg-botanical text-ivory shadow-xs'
                : 'bg-white text-charcoal/70 hover:bg-clay/60 border border-clay/80'
            }`}
          >
            Dầu Massage Thảo Mộc
          </button>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12 pt-8">
          <Link
            href="/san-pham"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white hover:bg-clay/50 text-botanical border border-botanical/40 font-semibold text-xs tracking-wider transition-all shadow-xs hover:shadow-sm"
          >
            <span>Xem Đầy Đủ Danh Mục Sản Phẩm</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
