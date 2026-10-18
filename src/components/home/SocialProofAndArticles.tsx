'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/types';
import { initialArticles } from '@/data/initialData';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface Props {
  articles?: Article[];
}

const testimonialsList = [
  {
    quote: 'Tinh dầu ở đây thật sự chất lượng, mùi hương dịu nhẹ, giúp mình thư giãn hơn rất nhiều sau một ngày dài.',
    author: 'Thu Hà',
    role: 'Khách hàng thân thiết',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
  },
  {
    quote: 'Mùi hương cam ngọt và bạc hà làm phòng khách nhà mình luôn tươi mới, con nhỏ rất thích mùi này.',
    author: 'Minh Thảo',
    role: 'Khách hàng tại Hà Nội',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=80',
  },
];

export default function SocialProofAndArticles({ articles = initialArticles }: Props) {
  const [currentIdx, setCurrentIdx] = useState(0);

  const prevTestimonial = () => {
    setCurrentIdx((prev) => (prev === 0 ? testimonialsList.length - 1 : prev - 1));
  };

  const nextTestimonial = () => {
    setCurrentIdx((prev) => (prev === testimonialsList.length - 1 ? 0 : prev + 1));
  };

  const currentT = testimonialsList[currentIdx];

  return (
    <section className="py-16 sm:py-24 bg-ivory border-t border-clay/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10">
          {/* Left Column: Testimonials matching reference layout */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-clay/80 shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-botanical-dark">
                Khách hàng nói gì về Nam Mộc Hương?
              </h3>

              <div className="pt-2">
                <span className="font-serif text-4xl sm:text-5xl text-earth/50 leading-none block">“</span>
                <p className="text-xs sm:text-sm text-charcoal/80 leading-relaxed italic -mt-2">
                  {currentT.quote}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-clay/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-clay">
                  <Image src={currentT.avatar} alt={currentT.author} fill className="object-cover" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-botanical">{currentT.author}</h4>
                  <p className="text-[11px] text-charcoal/60">{currentT.role}</p>
                </div>
              </div>

              {/* Pagination Dots & Navigation */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={prevTestimonial}
                  className="w-7 h-7 rounded-full bg-ivory hover:bg-clay text-charcoal flex items-center justify-center transition-colors"
                  aria-label="Đánh giá trước"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <div className="flex gap-1 px-1">
                  {testimonialsList.map((_, i) => (
                    <span
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        currentIdx === i ? 'bg-botanical w-3' : 'bg-clay-border'
                      }`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={nextTestimonial}
                  className="w-7 h-7 rounded-full bg-ivory hover:bg-clay text-charcoal flex items-center justify-center transition-colors"
                  aria-label="Đánh giá tiếp"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Recent Articles matching reference layout */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-botanical-dark">
                Bài viết gần đây
              </h3>
              <Link
                href="/kien-thuc"
                className="text-xs font-semibold text-botanical hover:underline"
              >
                Xem tất cả
              </Link>
            </div>

            {/* 3 Articles Cards in a Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {articles.slice(0, 3).map((art) => (
                <Link
                  key={art.id}
                  href={`/kien-thuc#${art.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-clay/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-ivory">
                    <Image
                      src={art.coverImage}
                      alt={art.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-3.5 flex-1 flex flex-col justify-between">
                    <h4 className="font-serif text-xs sm:text-sm font-semibold text-botanical-dark group-hover:text-botanical line-clamp-2 leading-snug">
                      {art.title}
                    </h4>
                    <span className="text-[10px] text-charcoal/50 mt-2 block">
                      {art.publishedAt}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
