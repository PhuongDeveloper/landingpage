import React from 'react';
import { Wind, Heart, Sparkles, ChevronRight, Droplet } from 'lucide-react';

const steps = [
  {
    stepNumber: '01',
    title: 'Khuếch tán',
    subtitle: 'thư giãn không gian',
    iconSvg: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current fill-none" strokeWidth="1.5">
        <path d="M12 3V6M8 4L9 7M16 4L15 7" strokeLinecap="round" />
        <path d="M7 10C7 7.5 9 7 12 7C15 7 17 7.5 17 10C17 14 19 16 19 19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19C5 16 7 14 7 10Z" />
      </svg>
    ),
  },
  {
    stepNumber: '02',
    title: 'Massage',
    subtitle: 'chăm sóc cơ thể',
    iconSvg: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current fill-none" strokeWidth="1.5">
        <path d="M12 11C13.6569 11 15 9.65685 15 8C15 6.34315 13.6569 5 12 5C10.3431 5 9 6.34315 9 8C9 9.65685 10.3431 11 12 11Z" />
        <path d="M6 19C6 15.6863 8.68629 13 12 13C15.3137 13 18 15.6863 18 19" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    stepNumber: '03',
    title: 'Pha loãng',
    subtitle: 'cho bồn tắm',
    iconSvg: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current fill-none" strokeWidth="1.5">
        <path d="M4 12H20C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12Z" />
        <path d="M5 12V7C5 5.89543 5.89543 5 7 5H8" strokeLinecap="round" />
        <path d="M6 20L4 22M18 20L20 22" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    stepNumber: '04',
    title: 'Ứng dụng khác',
    subtitle: 'tùy nhu cầu',
    iconSvg: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current fill-none" strokeWidth="1.5">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
      </svg>
    ),
  },
];

export default function ProductRitual() {
  return (
    <section id="nghi-thuc" className="py-16 sm:py-24 bg-ivory-50 border-t border-clay/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header matching reference image */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <div className="inline-flex items-center gap-2.5 text-xs text-earth font-light tracking-widest uppercase">
            <span className="w-6 h-[1px] bg-earth/60" />
            <span>Cách sử dụng</span>
            <span className="w-6 h-[1px] bg-earth/60" />
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-botanical-dark">
            Tinh dầu – đơn giản mà hiệu quả
          </h2>
        </div>

        {/* 4 Circles with Arrow Connectors matching reference design */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 items-center">
          {steps.map((st, idx) => (
            <div key={idx} className="flex items-center">
              <div className="flex-1 flex flex-col items-center text-center space-y-3 group">
                {/* Organic Circular Icon Container */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white border border-clay shadow-xs flex items-center justify-center text-botanical group-hover:scale-105 group-hover:border-gold transition-all duration-300">
                  {/* Subtle inner decorative leaf circle */}
                  <div className="absolute inset-1 rounded-full border border-dashed border-clay/60 pointer-events-none" />
                  <div className="relative z-10 text-earth group-hover:text-botanical transition-colors">
                    {st.iconSvg}
                  </div>
                </div>

                <div className="space-y-0.5">
                  <h3 className="font-serif font-bold text-sm sm:text-base text-botanical">
                    {st.title}
                  </h3>
                  <p className="text-xs text-charcoal/60 font-light">
                    {st.subtitle}
                  </p>
                </div>
              </div>

              {/* Connector Arrow (hidden on last item and mobile) */}
              {idx < steps.length - 1 && (
                <div className="hidden md:flex text-clay-border/80 flex-shrink-0 px-2">
                  <ChevronRight className="w-5 h-5 text-earth/40" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
