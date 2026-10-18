'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Menu, X, Search, ShieldCheck, Phone, ArrowUpRight } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems, openCart } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-botanical-forest text-ivory/90 text-xs py-2 px-4 tracking-wider text-center flex items-center justify-center gap-4 transition-all">
        <span className="flex items-center gap-1.5 font-light">
          <ShieldCheck className="w-3.5 h-3.5 text-gold" />
          Tinh dầu thiên nhiên nguyên chất 100% • Miễn phí vận chuyển toàn quốc từ 499.000đ
        </span>
        <span className="hidden md:inline-block text-ivory/40">|</span>
        <a
          href="tel:0968123456"
          className="hidden md:flex items-center gap-1 text-gold-light hover:underline font-medium"
        >
          <Phone className="w-3 h-3" /> Hotline: 0968 123 456
        </a>
      </div>

      {/* Main Navigation Header matching reference design */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-ivory/95 backdrop-blur-md shadow-sm border-b border-clay py-3'
            : 'bg-ivory/80 backdrop-blur-xs py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Toggle */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-botanical hover:text-botanical-dark"
                aria-label={mobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Brand Logo with Lotus / Botanical Emblem */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2.5 group">
                {/* Stylized Lotus SVG Emblem */}
                <div className="w-9 h-9 rounded-full bg-botanical flex items-center justify-center text-gold shadow-xs group-hover:scale-105 transition-transform">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" stroke="currentColor" strokeWidth="1">
                    <path d="M12 2C12 2 8 8 8 13C8 16 10 18 12 18C14 18 16 16 16 13C16 8 12 2 12 2Z" />
                    <path d="M6 13C6 11 7 8 7 8C7 8 3 11 3 14C3 17 5.5 19 8 19C10.5 19 9 16 9 16C7 16 6 15 6 13Z" opacity="0.8" />
                    <path d="M18 13C18 11 17 8 17 8C17 8 21 11 21 14C21 17 18.5 19 16 19C13.5 19 15 16 15 16C17 16 18 15 18 13Z" opacity="0.8" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-botanical group-hover:text-botanical-dark transition-colors">
                    NAM MỘC HƯƠNG
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.25em] text-earth font-medium -mt-1">
                    Tinh Dầu Thiên Nhiên
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links (Ảnh mẫu: Sản phẩm, Giới thiệu, Câu chuyện hương, Blog, Liên hệ) */}
            <nav className="hidden lg:flex items-center space-x-9 text-sm font-medium text-charcoal">
              <Link
                href="/san-pham"
                className="hover:text-botanical transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-botanical hover:after:w-full after:transition-all"
              >
                Sản phẩm
              </Link>
              <Link
                href="/#gioi-thieu"
                className="hover:text-botanical transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-botanical hover:after:w-full after:transition-all"
              >
                Giới thiệu
              </Link>
              <Link
                href="/#cau-chuyen"
                className="hover:text-botanical transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-botanical hover:after:w-full after:transition-all"
              >
                Câu chuyện hương
              </Link>
              <Link
                href="/kien-thuc"
                className="hover:text-botanical transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-botanical hover:after:w-full after:transition-all"
              >
                Blog
              </Link>
              <Link
                href="/#lien-he"
                className="hover:text-botanical transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-botanical hover:after:w-full after:transition-all"
              >
                Liên hệ
              </Link>
            </nav>

            {/* Actions: Search icon & Cart icon with Badge */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Link
                href="/san-pham"
                className="p-2 text-botanical hover:text-botanical-dark transition-colors"
                aria-label="Tìm kiếm sản phẩm"
              >
                <Search className="w-5 h-5" />
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                type="button"
                onClick={openCart}
                className="relative p-2 rounded-full text-botanical hover:bg-clay/50 transition-colors flex items-center justify-center"
                aria-label={`Giỏ hàng, hiện có ${totalItems} sản phẩm`}
              >
                <ShoppingBag className="w-5 h-5 text-botanical" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-botanical text-gold text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Admin Portal link */}
              <Link
                href="/admin"
                className="hidden xl:inline-flex items-center gap-1 text-xs text-earth hover:text-botanical border border-clay px-3 py-1.5 rounded-full bg-white shadow-xs font-medium"
                title="Cổng Quản Trị Cửa Hàng"
              >
                <span>CMS Admin</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-clay bg-ivory px-6 pt-4 pb-6 space-y-4 animate-fade-in shadow-lg">
            <nav className="flex flex-col space-y-3 text-sm font-medium text-charcoal">
              <Link
                href="/san-pham"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-clay/60 hover:text-botanical"
              >
                Sản phẩm
              </Link>
              <Link
                href="/#gioi-thieu"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-clay/60 hover:text-botanical"
              >
                Giới thiệu
              </Link>
              <Link
                href="/#cau-chuyen"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-clay/60 hover:text-botanical"
              >
                Câu chuyện hương
              </Link>
              <Link
                href="/kien-thuc"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-clay/60 hover:text-botanical"
              >
                Blog
              </Link>
              <Link
                href="/#lien-he"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-clay/60 hover:text-botanical"
              >
                Liên hệ
              </Link>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-xs font-semibold text-botanical flex items-center justify-between bg-botanical/10 px-3 rounded-lg"
              >
                <span>Trang Quản Trị CMS</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
