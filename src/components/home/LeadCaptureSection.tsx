'use client';

import React, { useState } from 'react';
import { Sparkles, CheckCircle2, Gift, Send, ShieldCheck } from 'lucide-react';

export default function LeadCaptureSection() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [interest, setInterest] = useState('Thư giãn giảm căng thẳng');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          interest,
          message: address ? `Địa chỉ nhận mẫu thử: ${address}` : 'Đăng ký tư vấn trực tiếp',
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-ivory to-ivory-100 relative border-t border-clay/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-clay shadow-lg relative overflow-hidden">
          {/* Subtle Decorative Aura */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-sage-light/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 text-center max-w-2xl mx-auto space-y-3 mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-botanical/10 text-botanical text-xs font-semibold">
              <Gift className="w-3.5 h-3.5 text-gold-dark" />
              <span>Dành Cho Khách Hàng Lần Đầu Ghé Thăm</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-botanical-dark">
              Đăng Ký Nhận Mẫu Thử & Tư Vấn Mùi Hương
            </h2>

            <p className="text-xs sm:text-sm text-charcoal/70 leading-relaxed">
              Bạn chưa biết chọn loại tinh dầu nào phù hợp với thể trạng hoặc không gian nhà mình? Hãy để chuyên viên Nam Mộc Hương tư vấn và gửi tặng bạn mẫu thử mùi hương trải nghiệm tận nhà.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3 max-w-lg mx-auto animate-fade-in text-emerald-800">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="font-serif text-xl font-bold">Cảm ơn bạn đã để lại thông tin!</h3>
              <p className="text-xs text-emerald-700 leading-relaxed">
                Chúng tôi đã ghi nhận yêu cầu và sẽ liên hệ qua số điện thoại <strong>{phone}</strong> trong vòng 15 phút làm việc để chuẩn bị mẫu thử gửi đến bạn.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-charcoal">Họ và tên *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Thảo Vy"
                  className="w-full px-4 py-3 rounded-xl border border-clay bg-ivory-50 focus:bg-white focus:border-botanical outline-none text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-charcoal">Số điện thoại nhận tư vấn *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ví dụ: 0988 123 456"
                  className="w-full px-4 py-3 rounded-xl border border-clay bg-ivory-50 focus:bg-white focus:border-botanical outline-none text-xs"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="font-semibold text-charcoal">Nhu cầu chính của bạn</label>
                <select
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-clay bg-ivory-50 focus:bg-white focus:border-botanical outline-none text-xs"
                >
                  <option value="Thư giãn giảm căng thẳng">Thư giãn giảm căng thẳng, cân bằng cảm xúc</option>
                  <option value="Cải thiện giấc ngủ sâu">Cải thiện giấc ngủ sâu, trị liệu an thần</option>
                  <option value="Thanh lọc phòng & Đuổi côn trùng">Thanh lọc không khí, khử mùi ẩm mốc, xua muỗi</option>
                  <option value="Tập trung làm việc, tỉnh táo">Tăng cường sự tập trung khi học tập và làm việc</option>
                  <option value="Phong thủy & Thưởng trà">Xông hương phong thủy, thiền định, bàn thờ gia tiên</option>
                </select>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="font-semibold text-charcoal">Địa chỉ nhận mẫu thử (Tùy chọn)</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ví dụ: Số 12 Đường Hoa Sen, Q. Ba Đình, Hà Nội"
                  className="w-full px-4 py-3 rounded-xl border border-clay bg-ivory-50 focus:bg-white focus:border-botanical outline-none text-xs"
                />
              </div>

              <div className="sm:col-span-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-botanical hover:bg-botanical-dark text-ivory py-4 px-6 rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 text-gold" />
                  <span>{isSubmitting ? 'Đang gửi đăng ký...' : 'Đăng Ký Nhận Mẫu Thử & Tư Vấn Miễn Phí'}</span>
                </button>
              </div>

              <div className="sm:col-span-2 text-center text-[11px] text-charcoal/50 flex items-center justify-center gap-1.5 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-botanical" />
                <span>Cam kết bảo mật thông tin 100%, không gửi tin nhắn quảng cáo rác.</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
