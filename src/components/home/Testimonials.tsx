import React from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    author: 'Chị Mai Lan',
    role: 'Kiến trúc sư nội thất, TP. Hồ Chí Minh',
    content: 'Mùi Bưởi Hồng Hoàng Gia có độ ngọt thanh rất tự nhiên, khác hẳn các loại hương liệu nồng gắt trên thị trường. Tôi thường dùng để xông văn phòng thiết kế vào mỗi sáng thứ Hai, cả đội ngũ đều cảm thấy nhẹ nhõm và tràn đầy cảm hứng.',
    productName: 'Tinh Dầu Bưởi Hồng Hoàng Gia',
    rating: 5,
  },
  {
    author: 'Anh Quốc Bảo',
    role: 'Huấn luyện viên Thiền & Yoga, Hà Nội',
    content: 'Trầm Hương Rừng Già mang lại một tần số năng lượng rất đặc biệt. Nốt hương mộc ấm, tĩnh mịch và sâu lắng giúp học viên của tôi nhanh chóng ổn định hơi thở khi bắt đầu bài tập thiền chuông.',
    productName: 'Tinh Dầu Trầm Hương Rừng Già',
    rating: 5,
  },
  {
    author: 'Chị Thu Trang',
    role: 'Biên tập viên, Đà Nẵng',
    content: 'Trước đây tôi rất khó ngủ vì thường xuyên làm việc muộn trước màn hình. Từ ngày khuếch tán Dạ Nguyệt 30 phút trước khi ngủ, giấc ngủ của tôi sâu và không còn bị giật mình lúc nửa đêm. Rất ưng ý với thiết kế chai thủy tinh hổ phách mộc mạc.',
    productName: 'Tinh Dầu Dạ Nguyệt (Deep Sleep)',
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 lg:py-28 bg-ivory border-t border-clay/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-[0.2em] text-earth font-bold block">
            Cảm Nhận Thực Tế
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-botanical-dark">
            Lời Nhắn Gửi Từ Những Người Yêu Hương
          </h2>
          <p className="text-sm text-charcoal/70">
            Sự gắn kết của khách hàng là minh chứng đẹp nhất cho hành trình chưng cất tận tâm của Nam Mộc Hương.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-2xl border border-clay/80 shadow-xs flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-500">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-clay-border/80" />
                </div>

                <p className="text-xs sm:text-sm text-charcoal/80 leading-relaxed italic">
                  "{t.content}"
                </p>
              </div>

              <div className="pt-4 border-t border-clay/60">
                <h4 className="font-serif font-bold text-sm text-botanical">
                  {t.author}
                </h4>
                <p className="text-[11px] text-charcoal/60">
                  {t.role}
                </p>
                <span className="inline-block mt-2 text-[10px] text-earth bg-ivory px-2 py-0.5 rounded font-medium">
                  Sản phẩm: {t.productName}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
