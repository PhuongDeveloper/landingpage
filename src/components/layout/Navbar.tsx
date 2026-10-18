'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Menu, X, ArrowUpRight, ShieldCheck, Phone } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems, openCart } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-botanical-dark text-ivory/90 text-xs py-2 px-4 tracking-wider text-center flex items-center justify-center gap-4 transition-all">
        <span className="flex items-center gap-1.5 font-light">
          <ShieldCheck className="w-3.5 h-3.5 text-gold-light" />
          Tinh dầu chưng cất tự nhiên 100% • Miễn phí vận chuyển từ 499.000đ
        </span>
        <span className="hidden md:inline-block text-ivory/40">|</span>
        <a
          href="tel:0988123456"
          className="hidden md:flex items-center gap-1 hover:text-gold-light transition-colors"
        >
          <Phone className="w-3 h-3" /> Hotline: 0988 123 456
        </a>
      </div>

      {/* Main Navigation Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-ivory/95 backdrop-blur-md shadow-sm border-b border-clay py-3.5'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-botanical hover:text-deep-forest focus:outline-none"
                aria-label={mobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Brand Logo */}
            <div className="flex-1 lg:flex-initial text-center lg:text-left">
              <Link href="/" className="inline-block group">
                <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-botanical group-hover:text-botanical-dark transition-colors">
                  NAM MỘC HƯƠNG
                </span>
                <span className="block text-[10px] uppercase tracking-[0.25em] text-earth-light font-medium -mt-1">
                  Botanical Ritual · Chưng Cất Tự Nhiên
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium text-charcoal">
              <Link
                href="/"
                className="hover:text-botanical transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-botanical hover:after:w-full after:transition-all"
              >
                Trang Chủ
              </Link>
              <Link
                href="/san-pham"
                className="hover:text-botanical transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-botanical hover:after:w-full after:transition-all"
              >
                Sản Phẩm
              </Link>
              <Link
                href="/#cau-chuyen"
                className="hover:text-botanical transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-botanical hover:after:w-full after:transition-all"
              >
                Câu Chuyện Mộc
              </Link>
              <Link
                href="/#nghi-thuc"
                className="hover:text-botanical transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-botanical hover:after:w-full after:transition-all"
              >
                Nghi Thức Hương
              </Link>
              <Link
                href="/kien-thuc"
                className="hover:text-botanical transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-botanical hover:after:w-full after:transition-all"
              >
                Cẩm Nang
              </Link>
            </nav>

            {/* Actions (Cart & Admin trigger) */}
            <div className="flex items-center space-x-3 sm:space-x-5">
              <Link
                href="/admin"
                className="hidden md:inline-flex items-center gap-1 text-xs text-earth hover:text-botanical transition-colors border border-clay px-3 py-1.5 rounded-full"
                title="Quản trị nội dung & Đơn hàng"
              >
                <span>CMS Admin</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                type="button"
                onClick={openCart}
                className="relative p-2.5 rounded-full text-botanical hover:bg-clay/50 transition-colors flex items-center justify-center"
                aria-label={`Giỏ hàng, hiện có ${totalItems} sản phẩm`}
              >
                <ShoppingBag className="w-5 h-5 text-botanical" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-botanical-dark text-ivory text-[11px] font-semibold w-5 h-5 rounded-full flex items-center justify-center animate-fade-in shadow-sm">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-clay bg-ivory px-6 pt-4 pb-6 space-y-4 animate-fade-in">
            <nav className="flex flex-col space-y-3 text-base font-medium text-charcoal">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-clay/60 hover:text-botanical"
              >
                Trang Chủ
              </Link>
              <Link
                href="/san-pham"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-clay/60 hover:text-botanical"
              >
                Tất Cả Sản Phẩm
              </Link>
              <Link
                href="/#cau-chuyen"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-clay/60 hover:text-botanical"
              >
                Câu Chuyện Mộc Hương
              </Link>
              <Link
                href="/#nghi-thuc"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-clay/60 hover:text-botanical"
              >
                Nghi Thức Dùng Tinh Dầu
              </Link>
              <Link
                href="/kien-thuc"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-clay/60 hover:text-botanical"
              >
                Cẩm Nang Sống Lành
              </Link>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-sm text-earth hover:text-botanical flex items-center justify-between"
              >
                <span>Trang Quản Trị CMS</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </nav>
            <div className="pt-2 text-xs text-charcoal/70 flex flex-col gap-1.5">
              <p>Hotline: <strong className="text-botanical">0988 123 456</strong></p>
              <p>Xưởng chưng cất: Xã Lộc Tân, Bảo Lâm, Lâm Đồng</p>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
