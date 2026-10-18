import React from 'react';
import Image from 'next/image';
import { MapPin, Sparkles, Sprout } from 'lucide-react';

export default function BotanicalStory() {
  return (
    <section id="cau-chuyen" className="py-20 lg:py-28 bg-botanical-forest text-ivory relative overflow-hidden">
      {/* Background Subtle Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-botanical/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Visual Showcase (2 Editorial Photos) */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-4 sm:space-y-6">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-botanical-light/30 shadow-lg">
                <Image
                  src="https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&w=800&q=80"
                  alt="Thảo mộc và gỗ trầm trong quá trình chọn lọc"
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="bg-botanical/40 p-4 rounded-xl border border-botanical-light/20 text-xs space-y-1">
                <span className="text-gold font-semibold uppercase tracking-wider block text-[10px]">
                  Chưng Cất Thủ Công
                </span>
                <p className="text-ivory/80">Nhiệt độ kiểm soát dưới 95°C để giữ trọn vẹn hương đầu.</p>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6 pt-8 sm:pt-12">
              <div className="bg-botanical/40 p-4 rounded-xl border border-botanical-light/20 text-xs space-y-1">
                <span className="text-gold font-semibold uppercase tracking-wider block text-[10px]">
                  Thu Hoạch Bình Minh
                </span>
                <p className="text-ivory/80">Hái sương sớm khi túi tinh dầu dưới biểu bì căng tròn nhất.</p>
              </div>
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-botanical-light/30 shadow-lg">
                <Image
                  src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80"
                  alt="Không gian thư giãn tự nhiên tĩnh tại"
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Editorial Content */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-[0.2em] text-gold-light font-bold flex items-center gap-1.5">
              <Sprout className="w-3.5 h-3.5" />
              Hành Trình Chưng Cất Bản Địa
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-ivory">
              Tôn trọng nhịp điệu của đất trời và cây cỏ
            </h2>

            <p className="text-sm sm:text-base text-ivory/80 leading-relaxed font-light">
              Mỗi vùng đất Việt Nam đều mang trong mình một linh hồn hương thơm riêng biệt: từ vị ngạt ngào phù sa của bưởi Bến Tre, vị ấm nồng mộc mạc của sả đồi Tây Bắc, cho đến sắc thái thâm trầm uy nghi của Dó bầu xứ Quảng.
            </p>

            <p className="text-sm sm:text-base text-ivory/80 leading-relaxed font-light">
              Tại Nam Mộc Hương, chúng tôi không cố gắng tạo ra những mùi hương nịnh mũi nhân tạo. Chúng tôi giữ vai trò người lắng nghe và chắt lọc — đưa toàn bộ sự tinh khôi, thô mộc và năng lượng an lành của rừng cây vào từng chiếc lọ thủy tinh hổ phách gửi đến bạn.
            </p>

            {/* Origins List */}
            <div className="space-y-3 pt-4 border-t border-botanical-light/20">
              <div className="flex items-center gap-3 text-xs text-ivory/90">
                <MapPin className="w-4 h-4 text-gold flex-shrink-0" />
                <span><strong>Bến Tre:</strong> Vỏ bưởi hồng chín mọng thơm mát</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-ivory/90">
                <MapPin className="w-4 h-4 text-gold flex-shrink-0" />
                <span><strong>Tiên Phước (Quảng Nam):</strong> Mộc trầm Dó bầu nuôi dưỡng bền vững</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-ivory/90">
                <MapPin className="w-4 h-4 text-gold flex-shrink-0" />
                <span><strong>Lâm Đồng & Tây Bắc:</strong> Tuyết tùng, sả chanh và thảo mộc vùng cao</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
