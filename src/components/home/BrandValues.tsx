import React from 'react';
import { ShieldCheck, Recycle, MapPin, RefreshCw } from 'lucide-react';

const commitments = [
  {
    icon: ShieldCheck,
    title: '100% Chiết Xuất Tự Nhiên',
    description: 'Cam kết không sử dụng hương liệu tổng hợp (Fragrance Oil), không chất cố định mùi nhân tạo hay dầu khoáng pha loãng.',
  },
  {
    icon: MapPin,
    title: 'Vùng Trồng Minh Bạch',
    description: 'Mọi loài cây cỏ đều có vùng trồng xác thực: bưởi Bến Tre, trầm hương Quảng Nam, sả chanh Sơn La, tuyết tùng Lâm Đồng.',
  },
  {
    icon: Recycle,
    title: 'Bao Bì Thủy Tinh Hổ Phách',
    description: 'Ngăn chặn tia cực tím (UV) phá hủy dược tính của tinh dầu, đồng thời dễ dàng tái chế, hạn chế tối đa rác thải nhựa.',
  },
  {
    icon: RefreshCw,
    title: 'Đổi Trả An Tâm Trong 7 Ngày',
    description: 'Nếu bạn cảm thấy nốt hương chưa thực sự phù hợp với không gian gia đình, Nam Mộc Hương hỗ trợ đổi sang mùi hương khác.',
  },
];

export default function BrandValues() {
  return (
    <section className="py-20 lg:py-24 bg-ivory-50 border-t border-clay/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs uppercase tracking-[0.2em] text-earth font-bold block">
            Cam Kết Chân Thật
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-botanical-dark">
            Giá Trị Tạo Nên Niềm Tin Bền Lâu
          </h2>
          <p className="text-sm text-charcoal/70">
            Chúng tôi theo đuổi sự chân thật trong từng giọt hương, từ xưởng chưng cất đến tận tay bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {commitments.map((c, idx) => {
            const Icon = c.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-clay/70 shadow-xs space-y-3 text-center sm:text-left"
              >
                <div className="w-11 h-11 rounded-xl bg-botanical/10 flex items-center justify-center text-botanical mx-auto sm:mx-0">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-base font-bold text-botanical">
                  {c.title}
                </h3>
                <p className="text-xs text-charcoal/70 leading-relaxed">
                  {c.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
