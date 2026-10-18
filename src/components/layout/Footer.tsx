import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Compass, Sparkles, HeartHandshake } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-botanical-forest text-ivory/80 pt-16 pb-12 border-t border-botanical-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-botanical-light/20">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <span className="font-serif text-2xl font-bold tracking-tight text-ivory block">
              NAM MỘC HƯƠNG
            </span>
            <p className="text-sm leading-relaxed text-ivory/70 max-w-sm">
              Tinh dầu thiên nhiên nguyên chất chưng cất từ thảo mộc bản địa Việt Nam. Chúng tôi lưu giữ năng lượng thuần khiết của cây cỏ, nâng niu không gian sống và mang lại sự an lành cho thân tâm.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs text-gold bg-botanical/60 px-3 py-1 rounded-full border border-gold/30">
                <Sparkles className="w-3.5 h-3.5" />
                100% Thuần Tự Nhiên
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-ivory/90 bg-botanical/60 px-3 py-1 rounded-full border border-clay/20">
                <HeartHandshake className="w-3.5 h-3.5" />
                Bản Địa Bền Vững
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-ivory uppercase tracking-wider font-sans">
              Bộ Sưu Tập
            </h4>
            <ul className="space-y-2 text-sm text-ivory/70">
              <li>
                <Link href="/san-pham?category=don-huong" className="hover:text-gold transition-colors">
                  Tinh Dầu Đơn Hương
                </Link>
              </li>
              <li>
                <Link href="/san-pham?category=phoi-huong" className="hover:text-gold transition-colors">
                  Tinh Dầu Phối Hương (Blend)
                </Link>
              </li>
              <li>
                <Link href="/san-pham?category=xong-phong" className="hover:text-gold transition-colors">
                  Tinh Dầu Xông Phòng
                </Link>
              </li>
              <li>
                <Link href="/san-pham?category=massage" className="hover:text-gold transition-colors">
                  Dầu Massage Thảo Mộc
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation & Story */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-ivory uppercase tracking-wider font-sans">
              Về Chúng Tôi
            </h4>
            <ul className="space-y-2 text-sm text-ivory/70">
              <li>
                <Link href="/#cau-chuyen" className="hover:text-gold transition-colors">
                  Hành Trình Chưng Cất
                </Link>
              </li>
              <li>
                <Link href="/#nghi-thuc" className="hover:text-gold transition-colors">
                  Nghi Thức Hương Sớm
                </Link>
              </li>
              <li>
                <Link href="/kien-thuc" className="hover:text-gold transition-colors">
                  Cẩm Nang Sống Lành
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-gold transition-colors">
                  Cổng Quản Trị CMS
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-ivory uppercase tracking-wider font-sans">
              Liên Hệ & Xưởng
            </h4>
            <ul className="space-y-2.5 text-xs text-ivory/70 leading-relaxed">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <span>Số 48 Đường Thảo Mộc, P. An Phú, TP. Thủ Đức, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-start gap-2">
                <Compass className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <span>Xưởng chưng cất: Xã Lộc Tân, Huyện Bảo Lâm, Tỉnh Lâm Đồng</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                <a href="tel:0988123456" className="hover:text-gold">0988 123 456 (Zalo hỗ trợ)</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                <a href="mailto:chamsoc@nammochuong.com" className="hover:text-gold">chamsoc@nammochuong.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits & Policies */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-ivory/50 gap-4">
          <p>© {new Date().getFullYear()} Nam Mộc Hương. Bảo tồn giá trị hương thơm nguyên bản.</p>
          <div className="flex items-center space-x-6">
            <span>Chính sách đổi trả trong 7 ngày</span>
            <span>Cam kết hoàn tiền nếu phát hiện hương liệu tổng hợp</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
