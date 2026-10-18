'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';

const AmberBottleScene = dynamic(() => import('./AmberBottleScene'), {
  ssr: false,
  loading: () => <BottleFallback />,
});

function BottleFallback() {
  return (
    <div className="w-full h-full min-h-[420px] flex items-center justify-center relative">
      <div className="relative w-64 h-80 rounded-2xl overflow-hidden shadow-2xl border border-clay/60 bg-ivory-100">
        <Image
          src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80"
          alt="Lọ tinh dầu hổ phách Nam Mộc Hương"
          fill
          priority
          sizes="(max-width: 768px) 256px, 320px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-forest/40 to-transparent" />
      </div>
    </div>
  );
}

export default function LazyAmberBottle() {
  const [isClient, setIsClient] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(media.matches);
  }, []);

  // Nếu người dùng bật reduced motion hoặc ở server, hiển thị fallback tĩnh sắc nét
  if (!isClient || prefersReducedMotion) {
    return <BottleFallback />;
  }

  return (
    <div className="w-full h-full relative">
      <AmberBottleScene />
    </div>
  );
}
