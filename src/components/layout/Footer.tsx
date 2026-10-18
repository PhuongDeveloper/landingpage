'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, ArrowRight, Facebook, Youtube, Linkedin, Instagram, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail('');
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <footer id="lien-he" className="bg-botanical-forest text-ivory/80 pt-16 pb-8 border-t border-botanical-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12 border-b border-botanical-light/20">
          {/* Column 1: Brand & Socials */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" stroke="currentColor" strokeWidth="1">
                  <path d="M12 2C12 2 8 8 8 13C8 16 10 18 12 18C14 18 16 16 16 13C16 8 12 2 12 2Z" />
                  <path d="M6 13C6 11 7 8 7 8C7 8 3 11 3 14C3 17 5.5 19 8 19C10.5 19 9 16 9 16C7 16 6 15 6 13Z" opacity="0.8" />
                  <path d="M18 13C18 11 17 8 17 8C17 8 21 11 21 14C21 17 18.5 19 16 19C13.5 19 15 16 15 16C17 16 18 15 18 13Z" opacity="0.8" />
                </svg>
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-ivory">
                NAM MỘC HƯƠNG
              </span>
            </Link>

            <p className="text-xs text-ivory/70 leading-relaxed">
              Tinh dầu thiên nhiên – Cho cuộc sống an lành
            </p>

            {/* Social Icons matching reference image */}
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-botanical/60 hover:bg-gold hover:text-botanical flex items-center justify-center text-ivory transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-botanical/60 hover:bg-gold hover:text-botanical flex items-center justify-center text-ivory transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-botanical/60 hover:bg-gold hover:text-botanical flex items-center justify-center text-ivory transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-botanical/60 hover:bg-gold hover:text-botanical flex items-center justify-center text-ivory transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Liên hệ với chúng tôi */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-ivory font-sans">
              Liên hệ với chúng tôi
            </h4>
            <ul className="space-y-2.5 text-xs text-ivory/70 leading-relaxed">
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                <a href="tel:0968123456" className="hover:text-gold transition-colors font-medium">
                  0968 123 456
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                <a href="mailto:hello@nammochuong.com" className="hover:text-gold transition-colors">
                  hello@nammochuong.com
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <span>Số 123 Đường Hoa Sen, Hà Nội</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Hỗ trợ khách hàng */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-ivory font-sans">
              Hỗ trợ khách hàng
            </h4>
            <ul className="space-y-2 text-xs text-ivory/70">
              <li>
                <Link href="/san-pham" className="hover:text-gold transition-colors">
                  Chính sách mua hàng
                </Link>
              </li>
              <li>
                <Link href="/san-pham" className="hover:text-gold transition-colors">
                  Chính sách đổi trả
                </Link>
              </li>
              <li>
                <Link href="/#nghi-thuc" className="hover:text-gold transition-colors">
                  Hướng dẫn sử dụng
                </Link>
              </li>
              <li>
                <Link href="/kien-thuc" className="hover:text-gold transition-colors">
                  Câu hỏi thường gặp
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Đăng ký nhận tin */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-ivory font-sans">
              Đăng ký nhận tin
            </h4>
            <p className="text-xs text-ivory/70 leading-relaxed">
              Cập nhật sản phẩm mới và ưu đãi đặc biệt
            </p>

            {submitted ? (
              <div className="p-3 bg-botanical/60 border border-gold/40 text-gold rounded-xl text-xs flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-gold" />
                <span>Đã đăng ký nhận ưu đãi thành công!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="relative mt-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email của bạn"
                  className="w-full pl-4 pr-12 py-3 rounded-full bg-botanical/50 border border-botanical-light/40 text-xs text-ivory placeholder:text-ivory/40 focus:outline-none focus:border-gold"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gold hover:bg-gold-light text-botanical flex items-center justify-center transition-colors shadow-sm"
                  aria-label="Gửi email"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Credits matching reference image */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-ivory/50 gap-2">
          <p>© 2025 Nam Mộc Hương. All rights reserved.</p>
          <p className="flex items-center gap-1.5 text-gold-light/70">
            <span>🌿</span>
            <span>Lan tỏa hương thơm – Gieo mầm an lành</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
