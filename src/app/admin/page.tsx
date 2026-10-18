'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Product, Order, SiteConfig, OrderStatus, CategoryItem, Lead, LeadStatus } from '@/types';
import { formatVND, formatDateVietnamese } from '@/lib/utils';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Sliders,
  Users,
  FolderTree,
  Upload,
  Plus,
  Trash2,
  CheckCircle2,
  ExternalLink,
  Phone,
  RefreshCw,
  Save,
  Image as ImageIcon,
  Check,
  Zap,
} from 'lucide-react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'orders' | 'products' | 'categories' | 'cms'>('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [successToast, setSuccessToast] = useState('');

  // Product Form state
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductSlug, setNewProductSlug] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('');
  const [newProductSubtitle, setNewProductSubtitle] = useState('');
  const [newProductDescription, setNewProductDescription] = useState('');
  const [newProductOrigin, setNewProductOrigin] = useState('Đà Lạt, Lâm Đồng');
  const [newProductExtraction, setNewProductExtraction] = useState('Chưng cất lôi cuốn hơi nước');
  const [newProductImage, setNewProductImage] = useState('');
  const [newProductTopNote, setNewProductTopNote] = useState('');
  const [newProductMidNote, setNewProductMidNote] = useState('');
  const [newProductBaseNote, setNewProductBaseNote] = useState('');
  const [price10ml, setPrice10ml] = useState('180000');
  const [salePrice10ml, setSalePrice10ml] = useState('160000');
  const [stock10ml, setStock10ml] = useState('50');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Category Form state
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [newCatSubtitle, setNewCatSubtitle] = useState('');
  const [newCatImage, setNewCatImage] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load all data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [resOrders, resProducts, resCats, resLeads, resConfig] = await Promise.all([
        fetch('/api/orders').then((r) => r.json()),
        fetch('/api/products').then((r) => r.json()),
        fetch('/api/categories').then((r) => r.json()),
        fetch('/api/leads').then((r) => r.json()),
        fetch('/api/config').then((r) => r.json()),
      ]);

      if (Array.isArray(resOrders)) setOrders(resOrders);
      if (Array.isArray(resProducts)) {
        setProducts(resProducts);
        if (resProducts.length > 0 && !newProductCategory) {
          setNewProductCategory(resProducts[0].category);
        }
      }
      if (Array.isArray(resCats)) setCategories(resCats);
      if (Array.isArray(resLeads)) setLeads(resLeads);
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

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  // Image upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setNewProductImage(data.url);
        showToast('Tải ảnh thành công!');
      } else {
        // Fallback convert to Base64
        const reader = new FileReader();
        reader.onloadend = () => {
          setNewProductImage(reader.result as string);
          showToast('Tải ảnh thành công (Base64)!');
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.error(err);
      showToast('Có lỗi khi tải ảnh');
    } finally {
      setUploadingImage(false);
    }
  };

  // Create Product handler
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim()) return;

    const slug = newProductSlug.trim() || newProductName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const catItem = categories.find((c) => c.slug === newProductCategory);

    const productPayload: Product = {
      id: `nmh-${Date.now()}`,
      name: newProductName.trim(),
      slug,
      category: newProductCategory || 'thu-gian',
      categoryName: catItem?.name || 'Tinh dầu Thư giãn',
      subtitle: newProductSubtitle.trim() || 'Tinh dầu thiên nhiên nguyên chất',
      description: newProductDescription.trim() || newProductSubtitle.trim(),
      story: 'Chưng cất từ nguyên liệu thảo mộc tươi qua quy trình kiểm soát nhiệt độ nghiêm ngặt.',
      origin: newProductOrigin.trim(),
      extractionMethod: newProductExtraction.trim(),
      image: newProductImage.trim() || 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
      gallery: [newProductImage.trim() || 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80'],
      variants: [
        {
          capacity: '10ml',
          price: Number(price10ml) || 180000,
          salePrice: salePrice10ml ? Number(salePrice10ml) : undefined,
          stock: Number(stock10ml) || 50,
          sku: `NMH-${Date.now().toString().slice(-4)}`,
        },
      ],
      notes: {
        top: newProductTopNote.trim() || 'Hương thảo mộc mát lành',
        middle: newProductMidNote.trim() || 'Hương hoa thoang thoảng',
        base: newProductBaseNote.trim() || 'Gỗ mộc ấm áp',
      },
      benefits: ['Thư giãn tâm trí và giảm mệt mỏi', 'Thanh lọc không khí tự nhiên'],
      ritualGuide: ['Khuếch tán 4-6 giọt với máy xông sương siêu âm'],
      isFeatured: true,
      rating: 5.0,
      reviewCount: 1,
    };

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productPayload),
      });

      if (res.ok) {
        showToast('Đăng sản phẩm mới thành công!');
        setShowAddProductModal(false);
        setNewProductName('');
        setNewProductSlug('');
        setNewProductSubtitle('');
        setNewProductImage('');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc muốn xóa sản phẩm "${name}"?`)) return;
    try {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showToast(`Đã xóa sản phẩm ${name}`);
    } catch (err) {
      console.error(err);
    }
  };

  // Create Category
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const slug = newCatSlug.trim() || newCatName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const catPayload: CategoryItem = {
      id: `cat-${Date.now()}`,
      name: newCatName.trim(),
      slug,
      subtitle: newCatSubtitle.trim() || 'Bộ sưu tập tinh dầu thảo mộc',
      image: newCatImage.trim() || 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80',
    };

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(catPayload),
      });

      if (res.ok) {
        showToast('Thêm danh mục mới thành công!');
        setShowAddCategoryModal(false);
        setNewCatName('');
        setNewCatSlug('');
        setNewCatSubtitle('');
        setNewCatImage('');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Update Lead status
  const handleUpdateLeadStatus = async (id: string, status: LeadStatus) => {
    try {
      const res = await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
        showToast('Đã cập nhật trạng thái khách hàng');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Update Order status
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
        showToast(`Đã cập nhật đơn hàng ${orderCode}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Save Site Config
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (res.ok) {
        showToast('Xuất bản nội dung thành công!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => (o.status !== 'cancelled' ? sum + o.total : sum), 0);
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const newLeads = leads.filter((l) => l.status === 'new').length;

  return (
    <div className="min-h-screen bg-ivory-100 text-charcoal">
      {/* Top Header */}
      <header className="bg-botanical-forest text-ivory px-6 py-4 border-b border-botanical-dark sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-serif text-xl font-bold tracking-tight text-ivory">
              NAM MỘC HƯƠNG
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-gold text-botanical">
              Store Master Admin
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs font-semibold bg-ivory text-botanical hover:bg-gold-light px-3.5 py-1.5 rounded-full transition-all shadow-xs"
            >
              <span>Xem Website Trực Tiếp</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toast */}
        {successToast && (
          <div className="fixed top-20 right-6 z-50 bg-botanical text-ivory px-5 py-3 rounded-2xl shadow-2xl border border-gold flex items-center gap-2 text-xs font-semibold animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-gold-light" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 mb-8 bg-white p-2 rounded-2xl border border-clay shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'overview' ? 'bg-botanical text-ivory shadow-xs' : 'text-charcoal/70 hover:bg-clay/50'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Tổng Quan</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('leads')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'leads' ? 'bg-botanical text-ivory shadow-xs' : 'text-charcoal/70 hover:bg-clay/50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Data Khách Hàng ({leads.length})</span>
            {newLeads > 0 && (
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                {newLeads}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'orders' ? 'bg-botanical text-ivory shadow-xs' : 'text-charcoal/70 hover:bg-clay/50'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Đơn Hàng ({orders.length})</span>
            {pendingOrders > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
                {pendingOrders}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'products' ? 'bg-botanical text-ivory shadow-xs' : 'text-charcoal/70 hover:bg-clay/50'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Sản Phẩm ({products.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'categories' ? 'bg-botanical text-ivory shadow-xs' : 'text-charcoal/70 hover:bg-clay/50'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>Loại Sản Phẩm ({categories.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('cms')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'cms' ? 'bg-botanical text-ivory shadow-xs' : 'text-charcoal/70 hover:bg-clay/50'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Visual CMS & Banner</span>
          </button>
        </div>

        {/* ========================================= */}
        {/* TAB 1: OVERVIEW */}
        {/* ========================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-clay shadow-xs space-y-2">
                <span className="text-xs uppercase tracking-wider text-earth font-bold">Doanh Thu Đơn Hàng</span>
                <p className="font-serif text-3xl font-bold text-botanical">{formatVND(totalRevenue)}</p>
                <span className="text-[11px] text-charcoal/50">Tính trên các đơn không hủy</span>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-clay shadow-xs space-y-2">
                <span className="text-xs uppercase tracking-wider text-earth font-bold">Đơn Hàng Mới</span>
                <p className="font-serif text-3xl font-bold text-amber-600">{pendingOrders}</p>
                <span className="text-[11px] text-charcoal/50">Cần xác nhận và đóng gói</span>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-clay shadow-xs space-y-2">
                <span className="text-xs uppercase tracking-wider text-earth font-bold">Khách Cần Tư Vấn (Leads)</span>
                <p className="font-serif text-3xl font-bold text-emerald-600">{newLeads}</p>
                <span className="text-[11px] text-charcoal/50">Khách để lại SĐT qua form</span>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-clay shadow-xs space-y-2">
                <span className="text-xs uppercase tracking-wider text-earth font-bold">Sản Phẩm Đang Bán</span>
                <p className="font-serif text-3xl font-bold text-botanical">{products.length}</p>
                <span className="text-[11px] text-charcoal/50">{categories.length} Danh mục tinh dầu</span>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('products');
                  setShowAddProductModal(true);
                }}
                className="bg-botanical hover:bg-botanical-dark text-ivory text-xs font-semibold px-5 py-3 rounded-xl flex items-center gap-2 shadow-xs transition-all"
              >
                <Plus className="w-4 h-4" /> Đăng Sản Phẩm Mới & Upload Ảnh
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('categories');
                  setShowAddCategoryModal(true);
                }}
                className="bg-white hover:bg-clay/50 text-botanical border border-botanical text-xs font-semibold px-5 py-3 rounded-xl flex items-center gap-2 shadow-xs transition-all"
              >
                <FolderTree className="w-4 h-4" /> Thêm Loại Sản Phẩm Mới
              </button>
            </div>
          </div>
        )}

        {/* ========================================= */}
        {/* TAB 2: LEADS (KHÁCH ĐỂ LẠI DATA) */}
        {/* ========================================= */}
        {activeTab === 'leads' && (
          <div className="bg-white p-6 rounded-3xl border border-clay shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl font-bold text-botanical">Danh Sách Khách Hàng Để Lại Data</h2>
                <p className="text-xs text-charcoal/60 mt-0.5">Khách đăng ký nhận mẫu thử hoặc tư vấn mùi hương qua web.</p>
              </div>
              <button
                type="button"
                onClick={fetchData}
                className="text-xs text-charcoal/70 hover:text-botanical flex items-center gap-1 border border-clay px-3 py-1.5 rounded-full"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Làm mới
              </button>
            </div>

            {leads.length === 0 ? (
              <p className="text-xs text-charcoal/60 py-12 text-center">Chưa có khách hàng nào để lại data.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-ivory border-b border-clay text-charcoal/70 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3">Họ Tên</th>
                      <th className="p-3">Số Điện Thoại</th>
                      <th className="p-3">Nhu Cầu Tư Vấn</th>
                      <th className="p-3">Ghi Chú / Địa Chỉ</th>
                      <th className="p-3">Thời Gian</th>
                      <th className="p-3">Trạng Thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-clay/40">
                    {leads.map((l) => (
                      <tr key={l.id} className="hover:bg-ivory-50/50">
                        <td className="p-3 font-semibold text-charcoal">{l.name}</td>
                        <td className="p-3">
                          <a
                            href={`tel:${l.phone}`}
                            className="inline-flex items-center gap-1.5 font-bold text-botanical hover:underline bg-botanical/10 px-2 py-1 rounded"
                          >
                            <Phone className="w-3 h-3 text-gold-dark" />
                            {l.phone}
                          </a>
                        </td>
                        <td className="p-3 text-charcoal/80 font-medium">{l.interest || 'Tư vấn mùi hương'}</td>
                        <td className="p-3 text-charcoal/60 max-w-xs truncate">{l.message || '—'}</td>
                        <td className="p-3 text-charcoal/50 text-[11px]">{formatDateVietnamese(l.createdAt)}</td>
                        <td className="p-3">
                          <select
                            value={l.status}
                            onChange={(e) => handleUpdateLeadStatus(l.id, e.target.value as LeadStatus)}
                            className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold outline-none ${
                              l.status === 'new'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : l.status === 'contacted'
                                ? 'bg-blue-50 text-blue-800 border-blue-300'
                                : l.status === 'ordered'
                                ? 'bg-purple-50 text-purple-800 border-purple-300'
                                : 'bg-gray-100 text-gray-700 border-gray-300'
                            }`}
                          >
                            <option value="new">Mới (Chưa gọi)</option>
                            <option value="contacted">Đã tư vấn</option>
                            <option value="ordered">Đã chốt đơn</option>
                            <option value="cancelled">Hủy / Không nghe máy</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ========================================= */}
        {/* TAB 3: PRODUCTS & IMAGE UPLOAD */}
        {/* ========================================= */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl font-bold text-botanical">Danh Sách Sản Phẩm & Upload</h2>
                <p className="text-xs text-charcoal/60 mt-0.5">Tải ảnh thật từ máy tính, cập nhật giá và đăng sản phẩm mới.</p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddProductModal(!showAddProductModal)}
                className="bg-botanical hover:bg-botanical-dark text-ivory text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" /> Đăng Sản Phẩm Mới
              </button>
            </div>

            {/* Form Thêm Sản Phẩm Mới */}
            {showAddProductModal && (
              <form onSubmit={handleCreateProduct} className="bg-white p-6 sm:p-8 rounded-3xl border border-clay shadow-md space-y-6 animate-fade-in text-xs">
                <h3 className="font-serif text-lg font-bold text-botanical pb-3 border-b border-clay">
                  Điền Thông Tin Sản Phẩm & Upload Ảnh
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-charcoal">Tên sản phẩm *</label>
                    <input
                      type="text"
                      required
                      value={newProductName}
                      onChange={(e) => setNewProductName(e.target.value)}
                      placeholder="Ví dụ: Tinh dầu vỏ quế Yên Bái"
                      className="w-full px-4 py-2.5 rounded-xl border border-clay bg-ivory-50 focus:bg-white outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-charcoal">Loại sản phẩm / Danh mục *</label>
                    <select
                      value={newProductCategory}
                      onChange={(e) => setNewProductCategory(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-clay bg-ivory-50 focus:bg-white outline-none"
                    >
                      {categories.map((c) => (
                        <option key={c.slug} value={c.slug}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-charcoal">Dòng phụ đề ngắn *</label>
                    <input
                      type="text"
                      required
                      value={newProductSubtitle}
                      onChange={(e) => setNewProductSubtitle(e.target.value)}
                      placeholder="Ví dụ: Ấm áp, thư giãn cơ bắp"
                      className="w-full px-4 py-2.5 rounded-xl border border-clay bg-ivory-50 focus:bg-white outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-charcoal">Vùng nguyên liệu bản địa</label>
                    <input
                      type="text"
                      value={newProductOrigin}
                      onChange={(e) => setNewProductOrigin(e.target.value)}
                      placeholder="Ví dụ: Yên Bái / Bến Tre"
                      className="w-full px-4 py-2.5 rounded-xl border border-clay bg-ivory-50 focus:bg-white outline-none"
                    />
                  </div>
                </div>

                {/* Upload Image Section */}
                <div className="p-4 bg-ivory-50 rounded-2xl border border-clay/80 space-y-3">
                  <label className="font-semibold text-charcoal block">Ảnh đại diện sản phẩm *</label>
                  
                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    {/* Image Preview Box */}
                    <div className="relative w-28 h-32 rounded-xl border border-clay bg-white overflow-hidden flex items-center justify-center flex-shrink-0 shadow-xs">
                      {newProductImage ? (
                        <img src={newProductImage} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-charcoal/30" />
                      )}
                    </div>

                    <div className="flex-1 space-y-2 w-full">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingImage}
                          className="bg-white hover:bg-clay/50 text-botanical border border-botanical px-4 py-2 rounded-xl font-semibold flex items-center gap-1.5 shadow-xs"
                        >
                          <Upload className="w-4 h-4" />
                          <span>{uploadingImage ? 'Đang tải lên...' : 'Chọn Ảnh Từ Máy Tính'}</span>
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </div>

                      <div className="space-y-1">
                        <span className="text-[11px] text-charcoal/50 block">Hoặc dán trực tiếp đường link ảnh (URL):</span>
                        <input
                          type="url"
                          value={newProductImage}
                          onChange={(e) => setNewProductImage(e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full px-4 py-2 rounded-xl border border-clay bg-white focus:border-botanical outline-none text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fragrance Notes */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-charcoal">Hương đầu (Top)</label>
                    <input
                      type="text"
                      value={newProductTopNote}
                      onChange={(e) => setNewProductTopNote(e.target.value)}
                      placeholder="Ví dụ: Vỏ quế ngọt"
                      className="w-full px-3 py-2 rounded-xl border border-clay bg-ivory-50 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-charcoal">Hương giữa (Heart)</label>
                    <input
                      type="text"
                      value={newProductMidNote}
                      onChange={(e) => setNewProductMidNote(e.target.value)}
                      placeholder="Ví dụ: Thảo mộc khô"
                      className="w-full px-3 py-2 rounded-xl border border-clay bg-ivory-50 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-charcoal">Hương cuối (Base)</label>
                    <input
                      type="text"
                      value={newProductBaseNote}
                      onChange={(e) => setNewProductBaseNote(e.target.value)}
                      placeholder="Ví dụ: Gỗ mộc ấm"
                      className="w-full px-3 py-2 rounded-xl border border-clay bg-ivory-50 outline-none"
                    />
                  </div>
                </div>

                {/* Price & Stock */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-xl border border-clay/60">
                  <div className="space-y-1">
                    <label className="font-semibold text-charcoal">Giá niêm yết 10ml (VNĐ) *</label>
                    <input
                      type="number"
                      required
                      value={price10ml}
                      onChange={(e) => setPrice10ml(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-clay bg-ivory-50 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-charcoal">Giá khuyến mãi (tùy chọn)</label>
                    <input
                      type="number"
                      value={salePrice10ml}
                      onChange={(e) => setSalePrice10ml(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-clay bg-ivory-50 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-charcoal">Số lượng tồn kho</label>
                    <input
                      type="number"
                      value={stock10ml}
                      onChange={(e) => setStock10ml(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-clay bg-ivory-50 outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddProductModal(false)}
                    className="px-5 py-2.5 rounded-xl border border-clay hover:bg-clay/40 font-semibold"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="bg-botanical hover:bg-botanical-dark text-ivory px-6 py-2.5 rounded-xl font-semibold shadow-md flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" /> Lưu Sản Phẩm
                  </button>
                </div>
              </form>
            )}

            {/* Danh sách sản phẩm hiện tại */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <div key={p.id} className="bg-white p-4 rounded-2xl border border-clay shadow-xs flex gap-4 text-xs">
                  <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-ivory flex-shrink-0 border border-clay">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-earth uppercase font-bold block">{p.categoryName}</span>
                      <h4 className="font-serif font-bold text-sm text-botanical line-clamp-1">{p.name}</h4>
                      <p className="text-charcoal/60 text-[11px] line-clamp-1 mt-0.5">{p.subtitle}</p>
                    </div>

                    <div className="pt-2 border-t border-clay/60 flex items-center justify-between">
                      <span className="font-serif font-bold text-botanical text-sm">
                        {formatVND(p.variants[0]?.salePrice || p.variants[0]?.price || 0)}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(p.id, p.name)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Xóa sản phẩm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================= */}
        {/* TAB 4: CATEGORIES MANAGEMENT */}
        {/* ========================================= */}
        {activeTab === 'categories' && (
          <div className="bg-white p-6 rounded-3xl border border-clay shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl font-bold text-botanical">Quản Lý Loại Sản Phẩm (Danh Mục)</h2>
                <p className="text-xs text-charcoal/60 mt-0.5">Tạo các nhóm phân loại theo nhu cầu khách hàng.</p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddCategoryModal(!showAddCategoryModal)}
                className="bg-botanical hover:bg-botanical-dark text-ivory text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" /> Thêm Danh Mục Mới
              </button>
            </div>

            {/* Modal/Form Add Category */}
            {showAddCategoryModal && (
              <form onSubmit={handleCreateCategory} className="p-5 rounded-2xl bg-ivory-50 border border-clay space-y-4 text-xs animate-fade-in">
                <h4 className="font-serif font-bold text-sm text-botanical">Tạo Loại Sản Phẩm Mới</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-charcoal">Tên loại sản phẩm *</label>
                    <input
                      type="text"
                      required
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      placeholder="Ví dụ: Tinh dầu Kháng khuẩn"
                      className="w-full px-4 py-2 rounded-xl border border-clay bg-white outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-charcoal">Mô tả ngắn</label>
                    <input
                      type="text"
                      value={newCatSubtitle}
                      onChange={(e) => setNewCatSubtitle(e.target.value)}
                      placeholder="Ví dụ: Bảo vệ hệ hô hấp cho gia đình"
                      className="w-full px-4 py-2 rounded-xl border border-clay bg-white outline-none"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-semibold text-charcoal">Link ảnh bìa danh mục</label>
                    <input
                      type="url"
                      value={newCatImage}
                      onChange={(e) => setNewCatImage(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-4 py-2 rounded-xl border border-clay bg-white outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddCategoryModal(false)}
                    className="px-4 py-2 rounded-xl border border-clay bg-white text-xs font-semibold"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="bg-botanical text-ivory px-5 py-2 rounded-xl text-xs font-semibold shadow-xs"
                  >
                    Tạo Danh Mục
                  </button>
                </div>
              </form>
            )}

            {/* Categories List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((c) => (
                <div key={c.id} className="relative rounded-2xl overflow-hidden aspect-[4/3] border border-clay shadow-xs group">
                  <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-forest/90 via-deep-forest/40 to-transparent p-4 flex flex-col justify-end text-ivory">
                    <h4 className="font-serif font-bold text-base">{c.name}</h4>
                    <p className="text-[11px] text-ivory/70 line-clamp-1">{c.subtitle}</p>
                    <span className="text-[10px] text-gold mt-1 font-mono">Slug: {c.slug}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================= */}
        {/* TAB 5: ORDERS */}
        {/* ========================================= */}
        {activeTab === 'orders' && (
          <div className="bg-white p-6 rounded-3xl border border-clay shadow-xs space-y-6">
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
              <p className="text-xs text-charcoal/60 py-12 text-center">Chưa có đơn hàng nào.</p>
            ) : (
              <div className="space-y-4">
                {orders.map((o) => (
                  <div key={o.id} className="p-5 rounded-2xl border border-clay bg-ivory-50/50 space-y-3 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-clay/60 gap-2">
                      <div>
                        <span className="font-mono text-sm font-bold text-botanical">{o.orderCode}</span>
                        <span className="text-charcoal/50 text-[11px] ml-2">
                          {formatDateVietnamese(o.createdAt)} • Thanh toán: {o.paymentMethod.toUpperCase()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-charcoal">Trạng thái:</span>
                        <select
                          value={o.status}
                          onChange={(e) => handleUpdateOrderStatus(o.orderCode, e.target.value as OrderStatus)}
                          className="px-3 py-1.5 rounded-xl border border-clay bg-white text-xs font-semibold text-botanical outline-none"
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
                        <h4 className="font-semibold text-botanical">Khách Hàng</h4>
                        <p className="font-medium text-charcoal">{o.customerName} - {o.customerPhone}</p>
                        <p className="text-charcoal/70 mt-0.5">{o.shippingAddress}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-botanical">Sản Phẩm ({o.items.length} món)</h4>
                        {o.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between text-charcoal/80">
                            <span>{it.name} ({it.capacity}) x{it.quantity}</span>
                            <span className="font-medium">{formatVND(it.price * it.quantity)}</span>
                          </div>
                        ))}
                        <div className="pt-2 border-t border-clay/40 flex justify-between font-bold text-botanical text-sm mt-1">
                          <span>Tổng tiền:</span>
                          <span>{formatVND(o.total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================= */}
        {/* TAB 6: VISUAL CMS & HERO BANNER */}
        {/* ========================================= */}
        {activeTab === 'cms' && config && (
          <form onSubmit={handleSaveConfig} className="bg-white p-6 sm:p-8 rounded-3xl border border-clay shadow-xs space-y-6 text-xs">
            <div className="border-b border-clay pb-4">
              <h2 className="font-serif text-xl font-bold text-botanical">Cấu Hình Giao Diện & Nội Dung Thương Hiệu</h2>
              <p className="text-xs text-charcoal/60 mt-1">Chỉnh sửa thông điệp Hero banner, số Hotline và Zalo hiển thị trên web.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1 sm:col-span-2">
                <label className="font-semibold text-charcoal">Tiêu đề chính Hero (Headline)</label>
                <textarea
                  rows={2}
                  value={config.heroHeadline}
                  onChange={(e) => setConfig({ ...config, heroHeadline: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-clay bg-ivory-50 focus:bg-white outline-none"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="font-semibold text-charcoal">Dòng mô tả thương hiệu (Subheadline)</label>
                <textarea
                  rows={2}
                  value={config.heroSubheadline}
                  onChange={(e) => setConfig({ ...config, heroSubheadline: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-clay bg-ivory-50 focus:bg-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-charcoal">Hotline hiển thị</label>
                <input
                  type="text"
                  value={config.hotline}
                  onChange={(e) => setConfig({ ...config, hotline: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-clay bg-ivory-50 focus:bg-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-charcoal">Số Zalo liên hệ</label>
                <input
                  type="text"
                  value={config.zalo}
                  onChange={(e) => setConfig({ ...config, zalo: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-clay bg-ivory-50 focus:bg-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-charcoal">Telegram Username (không dấu @)</label>
                <input
                  type="text"
                  value={config.telegram}
                  onChange={(e) => setConfig({ ...config, telegram: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-clay bg-ivory-50 focus:bg-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-charcoal">Email liên hệ</label>
                <input
                  type="email"
                  value={config.email}
                  onChange={(e) => setConfig({ ...config, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-clay bg-ivory-50 focus:bg-white outline-none"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="font-semibold text-charcoal">Địa chỉ phòng trưng bày</label>
                <input
                  type="text"
                  value={config.address}
                  onChange={(e) => setConfig({ ...config, address: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-clay bg-ivory-50 focus:bg-white outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-botanical hover:bg-botanical-dark text-ivory py-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <Save className="w-4 h-4 text-gold" />
              <span>Xuất Bản Thay Đổi (Publish)</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
