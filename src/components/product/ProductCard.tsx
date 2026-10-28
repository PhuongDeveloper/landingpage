'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product, ProductCapacity } from '@/types';
import { useCart } from '@/context/CartContext';
import { formatVND } from '@/lib/utils';
import { ShoppingBag, Star, Sparkles, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [selectedCapacity, setSelectedCapacity] = useState<ProductCapacity>(
    product.variants[0]?.capacity || '10ml'
  );
  const [addedAnimation, setAddedAnimation] = useState(false);

  const currentVariant =
    product.variants.find((v) => v.capacity === selectedCapacity) || product.variants[0];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedCapacity, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  return (
    <div className="group bg-white rounded-2xl border border-clay/80 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
      {/* Product Image Frame */}
      <Link href={`/san-pham/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-ivory-50">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isNew && (
            <span className="bg-botanical text-ivory text-[10px] uppercase font-semibold px-2.5 py-0.5 rounded-full tracking-wider shadow-sm">
              Mới
            </span>
          )}
          {product.isFeatured && (
            <span className="bg-gold text-white text-[10px] uppercase font-semibold px-2.5 py-0.5 rounded-full tracking-wider shadow-sm flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> Tuyển chọn
            </span>
          )}
        </div>

        {/* Origin Pill */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="bg-deep-forest/70 backdrop-blur-sm text-ivory text-[11px] px-2.5 py-1 rounded-md">
            {product.origin.split(',')[0]}
          </span>
        </div>
      </Link>

      {/* Product Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1.5 text-xs text-charcoal/70 mb-1.5">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="font-semibold text-charcoal">{product.rating}</span>
            <span className="text-charcoal/40">({product.reviewCount})</span>
          </div>

          {/* Title */}
          <Link href={`/san-pham/${product.slug}`}>
            <h3 className="font-serif text-lg font-bold text-botanical hover:text-botanical-dark transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Subtitle */}
          <p className="text-xs text-charcoal/70 line-clamp-2 mt-1 leading-relaxed">
            {product.subtitle}
          </p>

          {/* Fragrance Notes Tag */}
          <div className="mt-3 pt-2.5 border-t border-clay/60 text-[11px] text-earth">
            <span className="font-semibold text-botanical">Hương đầu: </span>
            <span className="italic">{product.notes.top}</span>
          </div>
        </div>

        {/* Capacity Selector & Price */}
        <div className="space-y-3 pt-1">
          {/* Capacity Buttons */}
          <div className="flex items-center gap-1.5">
            {product.variants.map((v) => (
              <button
                key={v.capacity}
                type="button"
                onClick={() => setSelectedCapacity(v.capacity)}
                className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all ${
                  selectedCapacity === v.capacity
                    ? 'bg-botanical text-ivory shadow-xs'
                    : 'bg-ivory text-charcoal/70 hover:bg-clay/60'
                }`}
              >
                {v.capacity}
              </button>
            ))}
          </div>

          {/* Price & Add to Cart */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex flex-col">
              <span className="font-serif text-base sm:text-lg font-bold text-botanical">
                {formatVND(currentVariant.salePrice || currentVariant.price)}
              </span>
              {currentVariant.salePrice && (
                <span className="text-xs text-charcoal/40 line-through -mt-1">
                  {formatVND(currentVariant.price)}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className={`p-2.5 rounded-xl font-medium text-xs flex items-center gap-1.5 transition-all ${
                addedAnimation
                  ? 'bg-emerald-700 text-white'
                  : 'bg-botanical hover:bg-botanical-dark text-ivory shadow-sm'
              }`}
              aria-label={`Thêm ${product.name} dung tích ${selectedCapacity} vào giỏ`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-4 h-4" />
                  <span className="hidden sm:inline">Đã thêm</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span className="hidden sm:inline">Thêm giỏ</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
