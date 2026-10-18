import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

const categories = [
  {
    id: 'don-huong',
    name: 'Tinh Dầu Đơn Hương',
    subtitle: 'Nốt hương thuần khiết từ một loài thảo mộc duy nhất',
    count: 'Bưởi hồng, Trầm hương, Tuyết tùng',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
    link: '/san-pham?category=don-huong',
  },
  {
    id: 'phoi-huong',
    name: 'Tinh Dầu Phối Hương',
    subtitle: 'Hòa tấu đa tầng phục hồi giấc ngủ và thanh lọc tâm trí',
    count: 'Dạ Nguyệt (Deep Sleep), Bình Minh',
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80',
    link: '/san-pham?category=phoi-huong',
  },
  {
    id: 'xong-phong',
    name: 'Tinh Dầu Xông Phòng',
    subtitle: 'Khử mùi ẩm, xua muỗi và mang lại không khí thanh sạch',
    count: 'Sả chanh đồi cao, Cam ngọt tự nhiên',
    image: 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&w=800&q=80',
    link: '/san-pham?category=xong-phong',
  },
  {
    id: 'massage',
    name: 'Dầu Massage Thảo Mộc',
    subtitle: 'Dầu nền ép lạnh dưỡng da và làm ấm cơ khớp',
    count: 'Gừng gió, Quế chi, Hạt nho hữu cơ',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    link: '/san-pham?category=massage',
  },
];

export default function CategoryShowcase() {
  return (
    <section className="py-20 lg:py-28 bg-ivory-50 border-t border-clay/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-earth font-bold block mb-2">
              Bộ Sưu Tập Hương Thơm
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-botanical-dark">
              Khám Phá Theo Nhu Cầu Không Gian
            </h2>
          </div>
          <Link
            href="/san-pham"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-botanical hover:text-botanical-dark transition-colors group"
          >
            <span>Xem tất cả sản phẩm</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Category Editorial Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={cat.link}
              className="group relative rounded-2xl overflow-hidden aspect-[3/4] bg-ivory border border-clay/80 shadow-xs hover:shadow-lg transition-all duration-500 flex flex-col justify-end p-6"
            >
              {/* Background Image with Overlay */}
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep-forest/90 via-deep-forest/40 to-transparent transition-opacity duration-300 group-hover:opacity-95" />

              {/* Content Over Image */}
              <div className="relative z-10 space-y-2">
                <span className="text-[11px] uppercase tracking-wider text-gold-light font-medium block">
                  {cat.count}
                </span>
                <h3 className="font-serif text-xl font-bold text-ivory group-hover:text-gold-light transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-ivory/80 line-clamp-2 leading-relaxed font-light">
                  {cat.subtitle}
                </p>

                <div className="pt-2 flex items-center text-xs text-ivory/90 font-medium group-hover:text-gold-light transition-colors">
                  <span>Khám phá bộ sưu tập</span>
                  <ArrowUpRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
