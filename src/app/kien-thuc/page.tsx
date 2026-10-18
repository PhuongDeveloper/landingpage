import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { getArticles } from '@/lib/storage';
import { Clock, User, ArrowLeft, ArrowUpRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cẩm Nang Mùi Hương & Sống Lành — Nam Mộc Hương',
  description: 'Chia sẻ kiến thức liệu pháp hương thơm (Aromatherapy), phân biệt tinh dầu nguyên chất và các nghi thức thư giãn thân tâm.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function KnowledgePage() {
  const articles = await getArticles();

  return (
    <div className="py-12 lg:py-20 bg-ivory min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12 space-y-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-earth hover:text-botanical transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Về Trang Chủ
          </Link>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-botanical-dark">
            Cẩm Nang Mùi Hương & Nghệ Thuật Sống Lành
          </h1>
          <p className="text-sm text-charcoal/70 leading-relaxed">
            Nơi Nam Mộc Hương chia sẻ những ghi chép về thảo mộc bản địa, phương pháp chưng cất hơi nước và cách ứng dụng mùi hương vào đời sống thường nhật.
          </p>
        </div>

        <div className="space-y-12">
          {articles.map((art) => (
            <article
              id={art.slug}
              key={art.id}
              className="bg-white rounded-3xl border border-clay/80 shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-12 scroll-mt-24 group"
            >
              <div className="md:col-span-5 relative aspect-[16/10] md:aspect-auto min-h-[260px] bg-ivory">
                <Image
                  src={art.coverImage}
                  alt={art.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

              <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs text-charcoal/60">
                    <span className="bg-botanical/10 text-botanical font-semibold px-2.5 py-0.5 rounded-full">
                      {art.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {art.readTime}
                    </span>
                    <span>•</span>
                    <span>{art.publishedAt}</span>
                  </div>

                  <h2 className="font-serif text-2xl font-bold text-botanical group-hover:text-botanical-dark transition-colors">
                    {art.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-charcoal/80 leading-relaxed">
                    {art.excerpt}
                  </p>

                  <div className="text-xs text-charcoal/70 pt-2 border-t border-clay/50 leading-relaxed">
                    <p>{art.content}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-clay/60 flex items-center justify-between text-xs">
                  <span className="text-charcoal/60 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-botanical" /> {art.author}
                  </span>

                  <Link
                    href="/san-pham"
                    className="text-botanical font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>Khám phá sản phẩm liên quan</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
