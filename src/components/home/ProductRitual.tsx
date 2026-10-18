import React from 'react';
import { Wind, Heart, Sparkles } from 'lucide-react';

const rituals = [
  {
    step: 'Nghi thức 01',
    title: 'Khuếch Tán Sương Vi Mô',
    subtitle: 'Khơi mở không gian làm việc hoặc phòng ngủ',
    instruction: 'Cho 150ml - 200ml nước sạch vào máy khuếch tán sương siêu âm. Nhỏ 4-6 giọt tinh dầu nguyên chất. Bật chế độ phun sương ngắt quãng để hương thơm lan tỏa dịu nhẹ mà không gây quá nồng.',
    icon: Wind,
    idealFor: 'Tinh dầu Bưởi Hồng, Sả Chanh, Dạ Nguyệt',
  },
  {
    step: 'Nghi thức 02',
    title: 'Thức Tỉnh Khứu Giác & Hơi Thở',
    subtitle: 'Giải tỏa căng thẳng tức thì giữa ngày làm việc',
    instruction: 'Nhỏ 1 giọt tinh dầu vào lòng bàn tay. Xoa ấm hai bàn tay trong 5 giây, khum nhẹ bàn tay che trước mũi và hít một hơi thật sâu trong 4 giây, giữ 4 giây và thở ra nhẹ nhàng trong 6 giây.',
    icon: Heart,
    idealFor: 'Tinh dầu Gỗ Tuyết Tùng, Bưởi Hồng',
  },
  {
    step: 'Nghi thức 03',
    title: 'Xoa Bóp Làm Ấm Khí Huyết',
    subtitle: 'Nâng niu cơ thể và ru êm giấc ngủ',
    instruction: 'Lấy một lượng vừa đủ dầu massage thảo mộc (5-8 giọt), massage nhẹ nhàng theo vòng tròn lên các điểm co cứng như vai gáy, bắp chân hoặc lòng bàn chân sau khi tắm nước ấm.',
    icon: Sparkles,
    idealFor: 'Dầu Massage Thảo Mộc, Trầm Hương',
  },
];

export default function ProductRitual() {
  return (
    <section id="nghi-thuc" className="py-20 lg:py-28 bg-ivory scroll-mt-20 border-t border-clay/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-[0.2em] text-earth font-bold block">
            Nghi Thức Dùng Tinh Dầu
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-botanical-dark">
            Ba Bước Chạm Đến Sự Cân Bằng Thân Tâm
          </h2>
          <p className="text-sm text-charcoal/70">
            Dành cho bản thân vài phút mỗi ngày để lắng đọng và kết nối lại với năng lượng tự nhiên.
          </p>
        </div>

        {/* Ritual Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {rituals.map((r, idx) => {
            const Icon = r.icon;
            return (
              <div
                key={idx}
                className="bg-white p-8 rounded-2xl border border-clay/80 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-widest font-semibold text-earth font-mono">
                      {r.step}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-botanical/10 flex items-center justify-center text-botanical">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-botanical">
                    {r.title}
                  </h3>
                  <p className="text-xs text-charcoal/60 font-medium">
                    {r.subtitle}
                  </p>
                  <p className="text-xs text-charcoal/80 leading-relaxed pt-2 border-t border-clay/60">
                    {r.instruction}
                  </p>
                </div>

                <div className="pt-3 border-t border-clay/60 text-[11px] text-earth bg-ivory-50 p-3 rounded-xl">
                  <span className="font-semibold text-botanical">Phù hợp nhất với: </span>
                  <span>{r.idealFor}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
