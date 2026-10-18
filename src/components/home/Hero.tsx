'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import LazyAmberBottle from '@/components/3d/LazyAmberBottle';
import { ArrowRight, Sparkles, ChevronDown } from 'lucide-react';

interface HeroProps {
  headline?: string;
  subheadline?: string;
  ctaText?: string;
  ctaLink?: string;
}

export default function Hero({
  headline = 'Hơi Thở Thiên Nhiên Trong Từng Giọt Hương',
  subheadline = 'Chưng cất từ thảo mộc bản địa qua phương pháp lôi cuốn hơi nước truyền thống, giữ trọn vẹn tinh chất thuần khiết và năng lượng chữa lành của đất mẹ.',
  ctaText = 'Khám Phá Bộ Sưu Tập',
  ctaLink = '#san-pham',
}: HeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const ctaGroupRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Kiểm tra prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        badgeRef.current,
        { opacity: 0, y: -15 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.1 }
      )
        .fromTo(
          headlineRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 1 },
          '-=0.5'
        )
        .fromTo(
          subheadRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.9 },
          '-=0.6'
        )
        .fromTo(
          ctaGroupRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.8 },
          '-=0.5'
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[90vh] flex items-center bg-gradient-to-b from-ivory via-ivory-100 to-ivory pt-8 pb-16 overflow-hidden bg-grain"
    >
      {/* Decorative Natural Glow Circles */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-sage-light/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/10 w-[450px] h-[450px] bg-gold-light/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Copy */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            {/* Eyebrow Badge */}
            <div ref={badgeRef} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-botanical/10 border border-botanical/20 text-botanical text-xs font-medium tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-gold-dark" />
              <span>Liệu Pháp Mùi Hương Bản Địa Thuần Khiết</span>
            </div>

            {/* Main Editorial Headline */}
            <h1
              ref={headlineRef}
              className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-botanical-dark leading-[1.15]"
            >
              {headline}
            </h1>

            {/* Brand Subheadline */}
            <p
              ref={subheadRef}
              className="text-base sm:text-lg text-charcoal/80 leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal"
            >
              {subheadline}
            </p>

            {/* CTA Group */}
            <div
              ref={ctaGroupRef}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <Link
                href={ctaLink}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-botanical hover:bg-botanical-dark text-ivory px-8 py-4 rounded-full text-sm font-semibold transition-all shadow-md hover:shadow-lg group"
              >
                <span>{ctaText}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="#cau-chuyen"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full text-sm font-semibold text-botanical hover:bg-clay/50 border border-botanical/30 transition-all"
              >
                Hành Trình Mộc Hương
              </Link>
            </div>

            {/* Trust Points */}
            <div className="pt-6 border-t border-clay/60 grid grid-cols-3 gap-4 text-center lg:text-left">
              <div>
                <span className="font-serif text-xl sm:text-2xl font-bold text-botanical block">
                  100%
                </span>
                <span className="text-[11px] text-charcoal/70 uppercase tracking-wider">
                  Thảo mộc tự nhiên
                </span>
              </div>
              <div>
                <span className="font-serif text-xl sm:text-2xl font-bold text-botanical block">
                  72 Giờ
                </span>
                <span className="text-[11px] text-charcoal/70 uppercase tracking-wider">
                  Chưng cất chậm
                </span>
              </div>
              <div>
                <span className="font-serif text-xl sm:text-2xl font-bold text-botanical block">
                  0%
                </span>
                <span className="text-[11px] text-charcoal/70 uppercase tracking-wider">
                  Hương liệu nhân tạo
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Amber Bottle Scene / Visual Spotlight */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="w-full max-w-md lg:max-w-none h-[460px] sm:h-[520px] rounded-3xl overflow-hidden bg-ivory-50/60 border border-clay/60 p-4 relative shadow-xl backdrop-blur-xs flex items-center justify-center">
              <LazyAmberBottle />

              {/* Floating Essence Note Pill */}
              <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md border border-clay/80 px-4 py-2.5 rounded-2xl shadow-lg text-xs space-y-0.5">
                <span className="text-[10px] uppercase tracking-wider text-earth font-bold block">
                  Chai Thủy Tinh Hổ Phách
                </span>
                <span className="text-charcoal font-medium">Bảo toàn năng lượng dược tính</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Scroll Cue */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-1 text-botanical/50 hover:text-botanical transition-colors">
        <span className="text-[10px] uppercase tracking-widest font-semibold">Cuộn để khám phá</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </div>
    </section>
  );
}
