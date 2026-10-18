'use client';

import React, { useState } from 'react';
import { Phone, Send, MessageCircle, Sparkles, X, CheckCircle2 } from 'lucide-react';

interface FloatingContactBubblesProps {
  hotline?: string;
  zalo?: string;
  telegram?: string;
}

export default function FloatingContactBubbles({
  hotline = '0968 123 456',
  zalo = '0968123456',
  telegram = 'nammochuong_support',
}: FloatingContactBubblesProps) {
  const [showConsultModal, setShowConsultModal] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [interest, setInterest] = useState('Thư giãn & Giảm căng thẳng');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, interest }),
      });
      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setShowConsultModal(false);
          setName('');
          setPhone('');
        }, 2500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const cleanPhone = hotline.replace(/\s+/g, '');

  return (
    <>
      {/* Floating Bubbles Stack on bottom-right */}
      <div className="fixed bottom-6 right-5 z-40 flex flex-col items-end gap-3 pointer-events-auto">
        {/* Bubble 1: Nhận Tư Vấn Nhanh & Ưu Đãi (Pill Button) */}
        <button
          type="button"
          onClick={() => setShowConsultModal(true)}
          className="group flex items-center gap-2 bg-gradient-to-r from-botanical to-botanical-dark text-ivory text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gold/40 animate-pulse"
          aria-label="Nhận tư vấn mùi hương miễn phí"
        >
          <Sparkles className="w-4 h-4 text-gold-light" />
          <span className="hidden sm:inline">Nhận Tư Vấn & Giảm 10%</span>
          <span className="sm:hidden">Tư Vấn</span>
        </button>

        {/* Bubble 2: Zalo */}
        <a
          href={`https://zalo.me/${zalo.replace(/\D/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative w-12 h-12 rounded-full bg-[#0068FF] text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
          title="Chat qua Zalo"
          aria-label="Chat qua Zalo"
        >
          <span className="font-bold text-xs">Zalo</span>
          {/* Tooltip */}
          <span className="absolute right-14 bg-charcoal text-white text-[11px] px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Chat Zalo: {zalo}
          </span>
        </a>

        {/* Bubble 3: Telegram */}
        <a
          href={`https://t.me/${telegram}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative w-12 h-12 rounded-full bg-[#229ED9] text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
          title="Chat qua Telegram"
          aria-label="Chat qua Telegram"
        >
          <Send className="w-5 h-5 -translate-x-0.5 translate-y-0.5" />
          {/* Tooltip */}
          <span className="absolute right-14 bg-charcoal text-white text-[11px] px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Telegram: @{telegram}
          </span>
        </a>

        {/* Bubble 4: Hotline Gọi Ngay (có hiệu ứng vòng sóng lan tỏa) */}
        <a
          href={`tel:${cleanPhone}`}
          className="group relative w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-botanical text-ivory flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300 border-2 border-gold/60"
          title={`Gọi Hotline: ${hotline}`}
          aria-label={`Gọi ngay: ${hotline}`}
        >
          {/* Pulsing ring */}
          <span className="absolute -inset-1 rounded-full bg-botanical/40 animate-ping opacity-75" />
          <Phone className="w-6 h-6 text-gold-light relative z-10 animate-bounce" />
          {/* Tooltip */}
          <span className="absolute right-16 bg-botanical-dark text-ivory text-xs px-3 py-1.5 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-medium pointer-events-none border border-gold/30">
            Hotline: {hotline}
          </span>
        </a>
      </div>

      {/* Modal Nhận Tư Vấn Nhanh (Lead Capture Modal) */}
      {showConsultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-deep-forest/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-clay shadow-2xl relative space-y-5">
            <button
              type="button"
              onClick={() => setShowConsultModal(false)}
              className="absolute top-4 right-4 p-2 text-charcoal/50 hover:text-botanical rounded-full hover:bg-clay/50 transition-colors"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <span className="text-[10px] uppercase tracking-widest text-earth font-bold block">
                Chuyên Gia Mùi Hương Nam Mộc Hương
              </span>
              <h3 className="font-serif text-2xl font-bold text-botanical">
                Nhận Tư Vấn & Mã Giảm 10%
              </h3>
              <p className="text-xs text-charcoal/70">
                Để lại thông tin, chúng tôi sẽ gợi ý mùi hương chuẩn xác nhất cho không gian và thể trạng của bạn.
              </p>
            </div>

            {submitted ? (
              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2 text-emerald-800">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-semibold text-sm">Gửi Thông Tin Thành Công!</h4>
                <p className="text-xs text-emerald-700">
                  Chuyên viên Nam Mộc Hương sẽ gọi lại tư vấn cho bạn trong vòng 15 phút.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitLead} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-charcoal">Họ và tên của bạn</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ví dụ: Hoàng Yến"
                    className="w-full px-4 py-3 rounded-xl border border-clay bg-ivory-50 focus:bg-white focus:border-botanical outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-charcoal">Số điện thoại / Zalo</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ví dụ: 0912345678"
                    className="w-full px-4 py-3 rounded-xl border border-clay bg-ivory-50 focus:bg-white focus:border-botanical outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-charcoal">Nhu cầu chính của bạn</label>
                  <select
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-clay bg-ivory-50 focus:bg-white focus:border-botanical outline-none"
                  >
                    <option value="Thư giãn & Giảm căng thẳng">Thư giãn & Giảm căng thẳng sau ngày làm việc</option>
                    <option value="Ngủ ngon & Trị liệu sâu">Cải thiện giấc ngủ sâu, an thần</option>
                    <option value="Thanh lọc không khí & Đuổi muỗi">Khử mùi ẩm mốc, xua đuổi muỗi</option>
                    <option value="Tập trung làm việc & Tỉnh táo">Tăng cường sự tập trung, tỉnh táo</option>
                    <option value="Phong thủy & Thiền định">Xông hương phong thủy, thiền định, bàn thờ</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-botanical hover:bg-botanical-dark text-ivory py-3.5 px-6 rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-gold-light" />
                  <span>{isSubmitting ? 'Đang gửi...' : 'Gửi Yêu Cầu Nhận Ưu Đãi'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
