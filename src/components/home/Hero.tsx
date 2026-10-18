'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { ArrowRight, ChevronDown } from 'lucide-react';

interface HeroProps {
  headline?: string;
  subheadline?: string;
  ctaText?: string;
  ctaLink?: string;
}

export default function Hero({
  headline = 'Lan tỏa hương thơm\nThuần khiết từ thiên nhiên',
  subheadline = 'Nam Mộc Hương – tinh hoa từ thiên nhiên, cho một cuộc sống an yên và cân bằng.',
  ctaText = 'Khám phá sản phẩm',
  ctaLink = '#san-pham',
}: HeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const bottleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' }
      );
      gsap.fromTo(
        bottleRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 1.3, ease: 'power2.out', delay: 0.2 }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[85vh] lg:min-h-[92vh] flex items-center justify-center bg-gradient-to-b from-[#2E4133] via-[#354B3C] to-[#1E2D24] text-ivory overflow-hidden pt-8 pb-24"
    >
      {/* Background Natural Sunlight & Forest Imagery Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1920&q=85"
          alt="Thiên nhiên rừng xanh Nam Mộc Hương"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-30 mix-blend-overlay scale-105"
        />
        {/* Soft Golden Sunlight Rays Effect */}
        <div className="absolute -top-20 left-1/4 w-[600px] h-[600px] bg-amber-200/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      </div>

      {/* Decorative Botanical Branch hanging from top-left matching reference */}
      <div className="absolute top-0 left-0 w-48 sm:w-72 h-48 sm:h-72 pointer-events-none opacity-40 z-10">
        <svg viewBox="0 0 200 200" className="w-full h-full fill-emerald-200/30">
          <path d="M0,0 Q60,30 80,100 Q100,170 120,200 Q70,160 50,110 Q30,60 0,0 Z" />
          <path d="M20,10 Q80,20 110,60 Q80,70 40,30 Z" />
          <path d="M50,70 Q110,90 140,140 Q100,130 65,85 Z" />
        </svg>
      </div>

      {/* Hero Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Typography & CTA */}
          <div ref={textRef} className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Eyebrow with decorative lines matching reference */}
            <div className="inline-flex items-center gap-3 text-xs sm:text-sm text-ivory/80 font-light tracking-widest uppercase">
              <span className="w-8 h-[1px] bg-gold/70" />
              <span>Tinh dầu thiên nhiên</span>
              <span className="w-8 h-[1px] bg-gold/70" />
            </div>

            {/* Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-ivory leading-[1.2] drop-shadow-sm whitespace-pre-line">
              {headline}
            </h1>

            {/* Subheadline */}
            <p className="text-sm sm:text-base text-ivory/80 max-w-lg mx-auto lg:mx-0 font-light leading-relaxed">
              {subheadline}
            </p>

            {/* CTA Button matching reference image */}
            <div className="pt-2">
              <Link
                href={ctaLink}
                className="inline-flex items-center gap-3 bg-ivory text-botanical hover:bg-gold-light hover:text-deep-forest px-8 py-3.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 group"
              >
                <span>{ctaText}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Right Column: 2D Cinematic Botanical Spotlight with Amber Bottle on Driftwood */}
          <div ref={bottleRef} className="lg:col-span-5 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md aspect-[4/5] sm:aspect-[1/1] rounded-3xl overflow-hidden shadow-2xl border border-ivory/20 group">
              <Image
                src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1000&q=85"
                alt="Chai tinh dầu hổ phách Nam Mộc Hương trên gỗ mộc"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
              />
              {/* Radial Vignette & Warm Glow */}
              <div className="absolute inset-0 bg-radial-vignette from-transparent via-black/10 to-deep-forest/40 pointer-events-none" />

              {/* Floating Lotus Stamp Badge */}
              <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-lg border border-gold/40 flex items-center gap-1.5 text-xs text-botanical font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                <span>100% Nguyên Chất</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Organic Curved Bottom Divider (Wave Transition to Warm Ivory) */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-20">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-12 sm:h-20 text-ivory fill-current"
        >
          <path d="M0,0 C150,90 350,-40 500,50 C650,140 900,10 1200,60 L1200,120 L0,120 Z" />
        </svg>
      </div>

      {/* Mouse Scroll Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-1 text-ivory/60 hover:text-ivory transition-colors z-30">
        <div className="w-5 h-8 rounded-full border-2 border-ivory/40 flex items-start justify-center p-1">
          <div className="w-1 h-2 rounded-full bg-gold animate-bounce" />
        </div>
      </div>
    </section>
  );
}
