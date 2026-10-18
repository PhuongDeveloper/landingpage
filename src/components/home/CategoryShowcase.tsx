import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus } from 'lucide-react';
import { CategoryItem } from '@/types';
import { initialCategories } from '@/data/initialData';

interface CategoryShowcaseProps {
  categories?: CategoryItem[];
}

export default function CategoryShowcase({ categories = initialCategories }: CategoryShowcaseProps) {
  return (
    <section id="danh-muc" className="py-16 sm:py-24 bg-ivory relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header matching reference image */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center gap-2.5 text-xs text-earth font-light tracking-widest uppercase">
            <span className="w-6 h-[1px] bg-earth/60" />
            <span>Danh mục sản phẩm</span>
            <span className="w-6 h-[1px] bg-earth/60" />
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-botanical-dark">
            Khám phá thế giới tinh dầu
          </h2>
        </div>

        {/* 4 Category Cards matching reference design */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.slice(0, 4).map((cat) => (
            <Link
              key={cat.id}
              href={`/san-pham?category=${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-[3/4] bg-white border border-clay/80 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-end p-5"
            >
              {/* Background Image */}
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
              />

              {/* Gradient Scrim for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-deep-forest/85 via-deep-forest/30 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

              {/* Title & Plus Icon inside bottom matching reference */}
              <div className="relative z-10 flex items-end justify-between">
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-medium text-ivory group-hover:text-gold-light transition-colors leading-snug">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-ivory/70 line-clamp-1 mt-0.5">
                    {cat.subtitle}
                  </p>
                </div>

                {/* Circular Plus Icon Button */}
                <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-xs group-hover:bg-gold group-hover:text-botanical text-ivory flex items-center justify-center transition-all flex-shrink-0 shadow-sm">
                  <Plus className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
