'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className="py-20 bg-ivory relative border-t border-clay/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <span className="text-xs uppercase tracking-[0.2em] text-earth font-bold block">
          Lá Thư Mộc Hương
        </span>

        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-botanical-dark">
          Đón Nhận Năng Lượng Mùa Vụ Mới
        </h2>

        <p className="text-sm text-charcoal/70 max-w-xl mx-auto leading-relaxed">
          Đăng ký để nhận thông báo về những mẻ chưng cất giới hạn theo mùa hoa quả, cùng cẩm nang liệu pháp mùi hương bảo vệ sức khỏe gia đình.
        </p>

        {subscribed ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center justify-center gap-2 max-w-md mx-auto text-sm animate-fade-in font-medium">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>Cảm ơn bạn. Chúng tôi sẽ gửi thư khi có mẻ chưng cất mới nhất.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email của bạn..."
              required
              className="flex-1 px-5 py-3.5 rounded-full border border-clay bg-white text-sm focus:outline-none focus:ring-2 focus:ring-botanical/20 focus:border-botanical text-charcoal placeholder:text-charcoal/40"
            />
            <button
              type="submit"
              className="bg-botanical hover:bg-botanical-dark text-ivory px-7 py-3.5 rounded-full text-xs font-semibold tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <span>Đăng Ký</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        <p className="text-[11px] text-charcoal/50">
          * Chúng tôi trân trọng sự riêng tư và cam kết không bao giờ gửi thư rác.
        </p>
      </div>
    </section>
  );
}
