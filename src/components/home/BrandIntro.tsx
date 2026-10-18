import React from 'react';
import Image from 'next/image';
import { Droplet, Wind, SunMedium } from 'lucide-react';

export default function BrandIntro() {
  return (
    <section className="py-20 lg:py-28 bg-ivory relative border-t border-clay/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <span className="text-xs uppercase tracking-[0.2em] text-earth-light font-bold">
            Triết Lý Chưng Cất
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-botanical-dark leading-snug">
            Trở về với sự tĩnh lặng nguyên sơ của cỏ cây
          </h2>

          <p className="text-base sm:text-lg text-charcoal/80 leading-relaxed font-normal">
            Chúng tôi tin rằng mùi hương không chỉ là một trải nghiệm khứu giác thoáng qua, mà là sợi dây nối kết tâm trí con người với nhịp đập của đất mẹ. Từng mẻ tinh dầu tại Nam Mộc Hương được chưng cất thủ công mẻ nhỏ, không pha loãng, không hương liệu nhân tạo, lưu giữ trọn vẹn dược tính và năng lượng chữa lành của thổ nhưỡng Việt Nam.
          </p>
        </div>

        {/* Three Organic Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-12 border-t border-clay/80">
          <div className="bg-white/80 p-8 rounded-2xl border border-clay/60 shadow-xs space-y-3.5 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-botanical/10 flex items-center justify-center text-botanical">
              <Droplet className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-botanical">
              Giọt Hương Nguyên Bản
            </h3>
            <p className="text-xs text-charcoal/70 leading-relaxed">
              Chiết xuất 100% từ hoa lá, vỏ quả và thân mộc bản địa, giữ trọn các tầng hương tự nhiên không biến tính.
            </p>
          </div>

          <div className="bg-white/80 p-8 rounded-2xl border border-clay/60 shadow-xs space-y-3.5 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-sage/20 flex items-center justify-center text-botanical">
              <Wind className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-botanical">
              Chưng Cất Áp Suất Thấp
            </h3>
            <p className="text-xs text-charcoal/70 leading-relaxed">
              Phương pháp lôi cuốn hơi nước nhiệt độ thấp bảo toàn nguyên vẹn cấu trúc phân tử tinh dầu nhạy cảm.
            </p>
          </div>

          <div className="bg-white/80 p-8 rounded-2xl border border-clay/60 shadow-xs space-y-3.5 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-gold/20 flex items-center justify-center text-botanical">
              <SunMedium className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-botanical">
              Bảo Tồn Nguồn Gien Thảo Dược
            </h3>
            <p className="text-xs text-charcoal/70 leading-relaxed">
              Hợp tác thu hoạch bền vững cùng các nông hộ tại Hà Giang, Quảng Nam, Lâm Đồng, giữ gìn sinh thái rừng.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
