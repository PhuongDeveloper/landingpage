import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/types';
import { ArrowUpRight, Clock } from 'lucide-react';

interface JournalSectionProps {
  articles: Article[];
}

export default function JournalSection({ articles }: JournalSectionProps) {
  return (
    <section className="py-20 lg:py-28 bg-ivory-50 border-t border-clay/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-earth font-bold block mb-2">
              Cẩm Nang Sống Lành
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-botanical-dark">
              Kiến Thức Liệu Pháp Mùi Hương
            </h2>
          </div>
          <Link
            href="/kien-thuc"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-botanical hover:text-botanical-dark transition-colors group"
          >
            <span>Đọc tất cả bài viết</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((art) => (
            <article
              key={art.id}
              className="bg-white rounded-2xl border border-clay/80 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <Link href={`/kien-thuc#${art.slug}`} className="block relative aspect-[16/10] overflow-hidden bg-ivory">
                  <Image
                    src={art.coverImage}
                    alt={art.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-botanical text-[11px] font-semibold px-2.5 py-1 rounded-md">
                    {art.category}
                  </div>
                </Link>

                <div className="p-6 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs text-charcoal/50">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {art.readTime}
                    </span>
                    <span>•</span>
                    <span>{art.publishedAt}</span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-botanical group-hover:text-botanical-dark transition-colors line-clamp-2">
                    <Link href={`/kien-thuc#${art.slug}`}>
                      {art.title}
                    </Link>
                  </h3>

                  <p className="text-xs text-charcoal/70 line-clamp-3 leading-relaxed">
                    {art.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2">
                <Link
                  href={`/kien-thuc#${art.slug}`}
                  className="inline-flex items-center text-xs font-semibold text-botanical hover:underline gap-1"
                >
                  <span>Đọc tiếp</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
