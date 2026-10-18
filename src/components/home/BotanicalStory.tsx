import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function BotanicalStory() {
  return (
    <section id="cau-chuyen" className="py-20 sm:py-28 bg-ivory relative overflow-hidden">
      {/* Background Subtle Water-ink Mountains Landscape matching reference */}
      <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
        <svg viewBox="0 0 1000 500" className="w-full h-full fill-botanical">
          <path d="M600,300 Q750,150 900,320 Q950,220 1000,350 L1000,500 L600,500 Z" />
          <path d="M400,350 Q550,200 700,380 L1000,500 L400,500 Z" opacity="0.5" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Atmospheric Ceramic Diffuser with Steam & Amber Bottle */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-3xl overflow-hidden shadow-2xl border border-clay/80 group">
              <Image
                src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1000&q=85"
                alt="Máy xông gốm sứ tỏa sương và lọ tinh dầu Nam Mộc Hương"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep-forest/40 via-transparent to-transparent pointer-events-none" />

              {/* Gentle Steam Mist Aura overlay */}
              <div className="absolute top-1/4 left-1/3 w-32 h-32 bg-white/20 rounded-full blur-2xl animate-pulse pointer-events-none" />
            </div>
          </div>

          {/* Right Column: Copy & CTA matching reference image */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2.5 text-xs text-earth font-light tracking-widest uppercase">
              <span className="w-6 h-[1px] bg-earth/60" />
              <span>Câu chuyện thương hiệu</span>
              <span className="w-6 h-[1px] bg-earth/60" />
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-botanical-dark leading-[1.25]">
              Hành trình mang hương thiên nhiên vào từng khoảnh khắc sống
            </h2>

            <p className="text-sm sm:text-base text-charcoal/80 font-light leading-relaxed">
              Nam Mộc Hương bắt đầu từ tình yêu với thiên nhiên, với mong muốn lan tỏa giá trị của tinh dầu thuần khiết đến mọi nhà, cho một cuộc sống an yên và cân bằng hơn.
            </p>

            <div className="pt-2">
              <Link
                href="/san-pham"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-earth/60 text-xs sm:text-sm font-semibold text-earth-dark hover:bg-botanical hover:text-ivory hover:border-botanical transition-all duration-300 shadow-xs"
              >
                <span>Tìm hiểu thêm</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
