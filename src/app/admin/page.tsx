'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product, Order, SiteConfig, OrderStatus } from '@/types';
import { formatVND, formatDateVietnamese } from '@/lib/utils';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Sliders,
  Sparkles,
  ArrowUpRight,
  Save,
  CheckCircle2,
  Clock,
  Truck,
  Check,
  X,
  AlertCircle,
  Database,
  ExternalLink,
  Plus,
  RefreshCw,
} from 'lucide-react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'cms'>('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingConfig, setSavingConfig] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [resOrders, resProducts, resConfig] = await Promise.all([
        fetch('/api/orders').then((r) => r.json()),
        fetch('/api/products').then((r) => r.json()),
        fetch('/api/config').then((r) => r.json()),
      ]);

      if (Array.isArray(resOrders)) setOrders(resOrders);
      if (Array.isArray(resProducts)) setProducts(resProducts);
      if (resConfig && !resConfig.error) setConfig(resConfig);
    } catch (err) {
      console.error('Error fetching admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateOrderStatus = async (orderCode: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderCode, status: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.orderCode === orderCode ? { ...o, status: newStatus } : o))
        );
        showToast(`Đã cập nhật trạng thái đơn ${orderCode}`);
      }
    } catch (err) {
      console.error('Error updating order status', err);
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;
    setSavingConfig(true);
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (res.ok) {
        showToast('Xuất bản nội dung thành công! Trang chủ đã được cập nhật.');
      }
    } catch (err) {
      console.error('Error saving config', err);
    } finally {
      setSavingConfig(false);
    }
  };

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => (o.status !== 'cancelled' ? sum + o.total : sum), 0);
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;

  return (
    <div className="min-h-screen bg-ivory-100/60 text-charcoal">
      {/* Admin Top Header */}
      <header className="bg-botanical-forest text-ivory px-6 py-4 border-b border-botanical-dark sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-serif text-xl font-bold tracking-tight text-ivory">
              NAM MỘC HƯƠNG CMS
            </span>
            <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-botanical text-gold border border-gold/30">
              Visual Admin
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs text-ivory/70 bg-botanical/40 px-3 py-1.5 rounded-full border border-clay/10">
              <Database className="w-3.5 h-3.5 text-gold" />
              <span>Lưu trữ: Dual Storage Active</span>
            </div>

            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs font-semibold bg-ivory text-botanical hover:bg-gold-light px-3.5 py-1.5 rounded-full transition-colors"
            >
              <span>Xem Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toast Notification */}
        {successToast && (
          <div className="fixed top-20 right-6 z-50 bg-botanical text-ivory px-5 py-3 rounded-2xl shadow-xl border border-gold/40 flex items-center gap-2 text-xs font-medium animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-gold-light" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 mb-8 bg-white p-2 rounded-2xl border border-clay/80 shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'overview'
                ? 'bg-botanical text-ivory shadow-xs'
                : 'text-charcoal/70 hover:bg-clay/50'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Tổng Quan</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'orders'
                ? 'bg-botanical text-ivory shadow-xs'
                : 'text-charcoal/70 hover:bg-clay/50'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Đơn Hàng ({orders.length})</span>
            {pendingOrders > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center">
                {pendingOrders}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'products'
                ? 'bg-botanical text-ivory shadow-xs'
                : 'text-charcoal/70 hover:bg-clay/50'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Sản Phẩm ({products.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('cms')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'cms'
                ? 'bg-botanical text-ivory shadow-xs'
                : 'text-charcoal/70 hover:bg-clay/50'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Visual CMS & Hero</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-clay/80 shadow-xs space-y-2">
                <span className="text-xs uppercase tracking-wider text-earth font-bold">Tổng Doanh Thu</span>
                <p className="font-serif text-3xl font-bold text-botanical">{formatVND(totalRevenue)}</p>
                <span className="text-[11px] text-charcoal/50">Tính trên các đơn không hủy</span>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-clay/80 shadow-xs space-y-2">
                <span className="text-xs uppercase tracking-wider text-earth font-bold">Đơn Hàng Mới</span>
                <p className="font-serif text-3xl font-bold text-amber-600">{pendingOrders}</p>
                <span className="text-[11px] text-charcoal/50">Đơn chờ xác nhận giao hàng</span>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-clay/80 shadow-xs space-y-2">
                <span className="text-xs uppercase tracking-wider text-earth font-bold">Sản Phẩm Đang Bán</span>
                <p className="font-serif text-3xl font-bold text-botanical">{products.length}</p>
                <span className="text-[11px] text-charcoal/50">4 Danh mục chưng cất tự nhiên</span>
              </div>
            </div>

            {/* Recent Orders Preview */}
            <div className="bg-white p-6 rounded-2xl border border-clay/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-clay/60">
                <h3 className="font-serif text-lg font-bold text-botanical">Đơn Hàng Mới Nhất</h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-semibold text-botanical hover:underline flex items-center gap-1"
                >
                  <span>Xem tất cả đơn hàng</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {orders.length === 0 ? (
                <p className="text-xs text-charcoal/60 py-6 text-center">Chưa có đơn hàng nào.</p>
              ) : (
                <div className="divide-y divide-clay/40 text-xs">
                  {orders.slice(0, 5).map((o) => (
                    <div key={o.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="font-mono font-bold text-botanical">{o.orderCode}</span>
                        <span className="text-charcoal/60 ml-2">— {o.customerName} ({o.customerPhone})</span>
                        <p className="text-charcoal/50 text-[11px] mt-0.5">{formatDateVietnamese(o.createdAt)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-serif font-bold text-botanical">{formatVND(o.total)}</span>
                        <span className="capitalize px-2 py-0.5 rounded text-[10px] font-semibold bg-ivory-200 text-charcoal">
                          {o.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="bg-white p-6 rounded-2xl border border-clay/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold text-botanical">Quản Lý Đơn Hàng Thực Tế</h2>
              <button
                type="button"
                onClick={fetchData}
                className="text-xs text-charcoal/70 hover:text-botanical flex items-center gap-1 border border-clay px-3 py-1.5 rounded-full"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Làm mới
              </button>
            </div>

            {orders.length === 0 ? (
              <p className="text-xs text-charcoal/60 py-10 text-center">Chưa có đơn hàng nào được ghi nhận.</p>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="p-5 rounded-2xl border border-clay/80 bg-ivory-50/50 space-y-4 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-clay/60 gap-2">
                      <div>
                        <span className="font-mono text-sm font-bold text-botanical">{order.orderCode}</span>
                        <span className="text-charcoal/50 text-[11px] block">
                          {formatDateVietnamese(order.createdAt)} • Thanh toán: {order.paymentMethod.toUpperCase()}
                        </span>
                      </div>

                      {/* Status Selector */}
                      <div className="flex items-center gap-2">
                        <span className="text-charcoal/60 font-medium">Trạng thái:</span>
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.orderCode, e.target.value as OrderStatus)}
                          className="px-3 py-1.5 rounded-xl border border-clay bg-white text-xs font-semibold text-botanical focus:ring-1 focus:ring-botanical outline-none"
                        >
                          <option value="pending">Chờ xác nhận</option>
                          <option value="processing">Đang đóng gói</option>
                          <option value="shipping">Đang giao hàng</option>
                          <option value="completed">Đã hoàn thành</option>
                          <option value="cancelled">Đã hủy</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-botanical mb-1">Khách Hàng</h4>
                        <p className="font-medium text-charcoal">{order.customerName} - {order.customerPhone}</p>
                        <p className="text-charcoal/70 leading-relaxed mt-0.5">{order.shippingAddress}</p>
                        {order.note && <p className="text-earth italic mt-1">Lưu ý: "{order.note}"</p>}
                      </div>

                      <div>
                        <h4 className="font-semibold text-botanical mb-1">Sản Phẩm ({order.items.length} loại)</h4>
                        <div className="space-y-1 text-charcoal/80">
                          {order.items.map((it, idx) => (
                            <div key={idx} className="flex justify-between">
                              <span>{it.name} ({it.capacity}) x{it.quantity}</span>
                              <span className="font-medium">{formatVND(it.price * it.quantity)}</span>
                            </div>
                          ))}
                        </div>
                        <div className="pt-2 border-t border-clay/60 flex justify-between font-bold text-botanical text-sm mt-2">
                          <span>Tổng tiền:</span>
                          <span>{formatVND(order.total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="bg-white p-6 rounded-2xl border border-clay/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl font-bold text-botanical">Danh Mục & Sản Phẩm</h2>
                <p className="text-xs text-charcoal/60 mt-0.5">Quản lý giá, dung tích và chi tiết từng loại tinh dầu.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {products.map((p) => (
                <div key={p.id} className="p-4 rounded-2xl border border-clay/80 bg-ivory-50/50 flex gap-4 text-xs">
                  <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-ivory flex-shrink-0 border border-clay/60">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-earth uppercase font-semibold block">{p.categoryName}</span>
                      <h4 className="font-serif font-bold text-sm text-botanical line-clamp-1">{p.name}</h4>
                      <p className="text-charcoal/60 text-[11px] line-clamp-1 mt-0.5">{p.origin}</p>
                    </div>

                    <div className="pt-2 border-t border-clay/40 space-y-1">
                      <div className="flex flex-wrap gap-1.5">
                        {p.variants.map((v) => (
                          <span key={v.capacity} className="px-2 py-0.5 rounded bg-white border border-clay/60 text-[10px] font-medium">
                            {v.capacity}: {formatVND(v.salePrice || v.price)} (Kho: {v.stock})
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: VISUAL CMS & HERO EDITOR */}
        {activeTab === 'cms' && config && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Editor Form */}
            <form onSubmit={handleSaveConfig} className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-clay/80 shadow-xs space-y-6">
              <div className="border-b border-clay/60 pb-4">
                <h2 className="font-serif text-xl font-bold text-botanical">Chỉnh Sửa Giao Diện & Nội Dung Visual CMS</h2>
                <p className="text-xs text-charcoal/60 mt-1">
                  Thay đổi các thông điệp thương hiệu, Hero banner, Hotline và cấu hình SEO hiển thị trên website.
                </p>
              </div>

              {/* Section Hero Banner */}
              <div className="space-y-4">
                <h3 className="font-semibold text-xs uppercase tracking-wider text-earth flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-gold-dark" />
                  Nội Dung Hero Banner
                </h3>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-charcoal">Tiêu đề chính Hero (Headline)</label>
                  <input
                    type="text"
                    value={config.heroHeadline}
                    onChange={(e) => setConfig({ ...config, heroHeadline: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-clay bg-ivory-50 text-xs focus:ring-2 focus:ring-botanical/20 focus:border-botanical outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-charcoal">Dòng mô tả thương hiệu (Subheadline)</label>
                  <textarea
                    rows={3}
                    value={config.heroSubheadline}
                    onChange={(e) => setConfig({ ...config, heroSubheadline: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-clay bg-ivory-50 text-xs focus:ring-2 focus:ring-botanical/20 focus:border-botanical outline-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-charcoal">Chữ trên nút CTA</label>
                    <input
                      type="text"
                      value={config.heroCtaText}
                      onChange={(e) => setConfig({ ...config, heroCtaText: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-clay bg-ivory-50 text-xs focus:ring-2 focus:ring-botanical/20 focus:border-botanical outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-charcoal">Đường dẫn nút CTA</label>
                    <input
                      type="text"
                      value={config.heroCtaLink}
                      onChange={(e) => setConfig({ ...config, heroCtaLink: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-clay bg-ivory-50 text-xs focus:ring-2 focus:ring-botanical/20 focus:border-botanical outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Contact & Store Info */}
              <div className="space-y-4 pt-4 border-t border-clay/60">
                <h3 className="font-semibold text-xs uppercase tracking-wider text-earth">
                  Thông Tin Liên Hệ & Xưởng Chưng Cất
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-charcoal">Hotline CSKH</label>
                    <input
                      type="text"
                      value={config.hotline}
                      onChange={(e) => setConfig({ ...config, hotline: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-clay bg-ivory-50 text-xs outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-charcoal">Zalo Hỗ Trợ</label>
                    <input
                      type="text"
                      value={config.zalo}
                      onChange={(e) => setConfig({ ...config, zalo: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-clay bg-ivory-50 text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-charcoal">Địa chỉ phòng trưng bày</label>
                  <input
                    type="text"
                    value={config.address}
                    onChange={(e) => setConfig({ ...config, address: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-clay bg-ivory-50 text-xs outline-none"
                  />
                </div>
              </div>

              {/* SEO Config */}
              <div className="space-y-4 pt-4 border-t border-clay/60">
                <h3 className="font-semibold text-xs uppercase tracking-wider text-earth">
                  Cấu Hình SEO Google
                </h3>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-charcoal">SEO Title</label>
                  <input
                    type="text"
                    value={config.seoTitle}
                    onChange={(e) => setConfig({ ...config, seoTitle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-clay bg-ivory-50 text-xs outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-charcoal">SEO Description</label>
                  <textarea
                    rows={2}
                    value={config.seoDescription}
                    onChange={(e) => setConfig({ ...config, seoDescription: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-clay bg-ivory-50 text-xs outline-none"
                  />
                </div>
              </div>

              {/* Publish Button */}
              <button
                type="submit"
                disabled={savingConfig}
                className="w-full bg-botanical hover:bg-botanical-dark text-ivory py-4 px-6 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
              >
                <Save className="w-4 h-4 text-gold-light" />
                <span>{savingConfig ? 'Đang xuất bản...' : 'Xuất Bản Thay Đổi (Publish)'}</span>
              </button>
            </form>

            {/* Right: Live Preview Box */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-clay/80 shadow-xs sticky top-24 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-clay/60">
                  <span className="text-xs uppercase font-bold text-botanical flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-gold-dark" /> Live Preview Hero
                  </span>
                  <span className="text-[10px] bg-ivory px-2 py-0.5 rounded text-charcoal/60">Trực quan tức thì</span>
                </div>

                {/* Simulated Hero Card */}
                <div className="p-6 rounded-2xl bg-ivory border border-clay/80 space-y-4">
                  <span className="inline-block text-[10px] font-semibold text-botanical bg-botanical/10 px-2.5 py-0.5 rounded-full">
                    Liệu Pháp Mùi Hương Bản Địa
                  </span>
                  <h3 className="font-serif text-xl font-bold text-botanical-dark leading-snug">
                    {config.heroHeadline}
                  </h3>
                  <p className="text-xs text-charcoal/70 leading-relaxed">
                    {config.heroSubheadline}
                  </p>
                  <div className="pt-2">
                    <span className="inline-block bg-botanical text-ivory text-xs px-5 py-2.5 rounded-full font-semibold shadow-xs">
                      {config.heroCtaText} →
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-charcoal/50 p-3 bg-ivory-50 rounded-xl">
                  * Nhấn nút <strong>Xuất Bản Thay Đổi</strong> để lưu dữ liệu vào hệ thống và hiển thị trực tiếp ra trang chủ.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
