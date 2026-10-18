'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Product, Order, SiteConfig, OrderStatus, CategoryItem, Lead, LeadStatus, Article } from '@/types';
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
  Edit,
  CheckCircle2,
  ExternalLink,
  Phone,
  RefreshCw,
  Save,
  Image as ImageIcon,
  Lock,
  LogOut,
  FileText,
  AlertCircle,
  Eye,
  EyeOff,
  Search,
  Check,
  X,
} from 'lucide-react';

export default function AdminPage() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authChecking, setAuthChecking] = useState<boolean>(true);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'orders' | 'products' | 'categories' | 'articles' | 'cms'>('overview');

  // Data states
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [successToast, setSuccessToast] = useState('');

  // Filters & Search
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');

  // Product Add / Edit Modal state
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodSlug, setProdSlug] = useState('');
  const [prodCategory, setProdCategory] = useState('');
  const [prodSubtitle, setProdSubtitle] = useState('');
  const [prodDescription, setProdDescription] = useState('');
  const [prodOrigin, setProdOrigin] = useState('Đà Lạt, Lâm Đồng');
  const [prodExtraction, setProdExtraction] = useState('Chưng cất lôi cuốn hơi nước');
  const [prodImage, setProdImage] = useState('');
  const [prodTopNote, setProdTopNote] = useState('');
  const [prodMidNote, setProdMidNote] = useState('');
  const [prodBaseNote, setProdBaseNote] = useState('');
  const [price10ml, setPrice10ml] = useState('180000');
  const [salePrice10ml, setSalePrice10ml] = useState('160000');
  const [stock10ml, setStock10ml] = useState('50');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Category Modal state
  const [showCatModal, setShowCatModal] = useState(false);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catSubtitle, setCatSubtitle] = useState('');
  const [catImage, setCatImage] = useState('');
  const [uploadingCatImage, setUploadingCatImage] = useState(false);

  // Article Modal state
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [articleTitle, setArticleTitle] = useState('');
  const [articleSlug, setArticleSlug] = useState('');
  const [articleCategory, setArticleCategory] = useState('Nghi Thức Hương');
  const [articleExcerpt, setArticleExcerpt] = useState('');
  const [articleContent, setArticleContent] = useState('');
  const [articleCover, setArticleCover] = useState('');
  const [uploadingArticleCover, setUploadingArticleCover] = useState(false);

  // File Inputs
  const prodFileInputRef = useRef<HTMLInputElement>(null);
  const catFileInputRef = useRef<HTMLInputElement>(null);
  const articleFileInputRef = useRef<HTMLInputElement>(null);

  // Check existing session
  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('nmh_admin_auth');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
    }
    setAuthChecking(false);
  }, []);

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [resOrders, resProducts, resCats, resLeads, resArticles, resConfig] = await Promise.all([
        fetch('/api/orders').then((r) => r.json()).catch(() => []),
        fetch('/api/products').then((r) => r.json()).catch(() => []),
        fetch('/api/categories').then((r) => r.json()).catch(() => []),
        fetch('/api/leads').then((r) => r.json()).catch(() => []),
        fetch('/api/articles').then((r) => r.json()).catch(() => []),
        fetch('/api/config').then((r) => r.json()).catch(() => null),
      ]);

      if (Array.isArray(resOrders)) setOrders(resOrders);
      if (Array.isArray(resProducts)) {
        setProducts(resProducts);
        if (resProducts.length > 0 && !prodCategory) {
          setProdCategory(resProducts[0].category);
        }
      }
      if (Array.isArray(resCats)) setCategories(resCats);
      if (Array.isArray(resLeads)) setLeads(resLeads);
      if (Array.isArray(resArticles)) setArticles(resArticles);
      if (resConfig && !resConfig.error) setConfig(resConfig);
    } catch (err) {
      console.error('Error fetching admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  // Password verification
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === '@Nammochuong') {
      sessionStorage.setItem('nmh_admin_auth', 'true');
      setIsAuthenticated(true);
      setPasswordError('');
      showToast('Đăng nhập quản trị viên thành công!');
    } else {
      setPasswordError('Mật mã quản trị viên không chính xác. Vui lòng kiểm tra lại!');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('nmh_admin_auth');
    setIsAuthenticated(false);
    setPasswordInput('');
  };

  // Generic Image Upload to ImgBB / Local API
  const uploadImageFile = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (res.ok && data.url) {
      if (data.provider === 'imgbb') {
        showToast('Tải ảnh thành công qua ImgBB Cloud!');
      } else {
        showToast('Tải ảnh thành công!');
      }
      return data.url;
    }
    throw new Error(data.error || 'Upload failed');
  };

  // Upload Product Image
  const handleProdImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const url = await uploadImageFile(file);
      if (url) setProdImage(url);
    } catch (err) {
      console.error(err);
      showToast('Có lỗi khi tải ảnh lên');
    } finally {
      setUploadingImage(false);
    }
  };

  // Upload Category Image
  const handleCatImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCatImage(true);
    try {
      const url = await uploadImageFile(file);
      if (url) setCatImage(url);
    } catch (err) {
      console.error(err);
      showToast('Có lỗi khi tải ảnh danh mục');
    } finally {
      setUploadingCatImage(false);
    }
  };

  // Upload Article Cover
  const handleArticleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingArticleCover(true);
    try {
      const url = await uploadImageFile(file);
      if (url) setArticleCover(url);
    } catch (err) {
      console.error(err);
      showToast('Có lỗi khi tải ảnh bìa bài viết');
    } finally {
      setUploadingArticleCover(false);
    }
  };

  // Open Edit Product Modal
  const openEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setProdName(p.name);
    setProdSlug(p.slug);
    setProdCategory(p.category);
    setProdSubtitle(p.subtitle);
    setProdDescription(p.description);
    setProdOrigin(p.origin || 'Đà Lạt, Lâm Đồng');
    setProdExtraction(p.extractionMethod || 'Chưng cất lôi cuốn hơi nước');
    setProdImage(p.image);
    setProdTopNote(p.notes?.top || '');
    setProdMidNote(p.notes?.middle || '');
    setProdBaseNote(p.notes?.base || '');
    setPrice10ml(p.variants[0]?.price ? String(p.variants[0].price) : '180000');
    setSalePrice10ml(p.variants[0]?.salePrice ? String(p.variants[0].salePrice) : '');
    setStock10ml(p.variants[0]?.stock ? String(p.variants[0].stock) : '50');
    setShowProductModal(true);
  };

  // Open Add Product Modal
  const openAddProduct = () => {
    setEditingProductId(null);
    setProdName('');
    setProdSlug('');
    setProdCategory(categories[0]?.slug || 'thu-gian');
    setProdSubtitle('');
    setProdDescription('');
    setProdOrigin('Đà Lạt, Lâm Đồng');
    setProdExtraction('Chưng cất lôi cuốn hơi nước');
    setProdImage('');
    setProdTopNote('');
    setProdMidNote('');
    setProdBaseNote('');
    setPrice10ml('180000');
    setSalePrice10ml('160000');
    setStock10ml('50');
    setShowProductModal(true);
  };

  // Save Product (Create or Update)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) return;

    const slug = prodSlug.trim() || prodName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const catItem = categories.find((c) => c.slug === prodCategory);

    const productPayload: Product = {
      id: editingProductId || `nmh-${Date.now()}`,
      name: prodName.trim(),
      slug,
      category: prodCategory || 'thu-gian',
      categoryName: catItem?.name || 'Tinh dầu Thư giãn',
      subtitle: prodSubtitle.trim() || 'Tinh dầu thiên nhiên nguyên chất',
      description: prodDescription.trim() || prodSubtitle.trim(),
      story: 'Chưng cất từ nguyên liệu thảo mộc tươi qua quy trình kiểm soát nhiệt độ nghiêm ngặt.',
      origin: prodOrigin.trim(),
      extractionMethod: prodExtraction.trim(),
      image: prodImage.trim() || 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
      gallery: [prodImage.trim() || 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80'],
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
        top: prodTopNote.trim() || 'Hương thảo mộc mát lành',
        middle: prodMidNote.trim() || 'Hương hoa thoang thoảng',
        base: prodBaseNote.trim() || 'Gỗ mộc ấm áp',
      },
      benefits: ['Thư giãn tâm trí và giảm mệt mỏi', 'Thanh lọc không khí tự nhiên'],
      ritualGuide: ['Khuếch tán 4-6 giọt với máy xông sương siêu âm'],
      isFeatured: true,
      rating: 5.0,
      reviewCount: 1,
    };

    try {
      const method = editingProductId ? 'PUT' : 'POST';
      const res = await fetch('/api/products', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productPayload),
      });

      if (res.ok) {
        showToast(editingProductId ? 'Đã cập nhật sản phẩm!' : 'Đã thêm sản phẩm mới!');
        setShowProductModal(false);
        fetchData();
      }
    } catch (err) {
      console.error(err);
      showToast('Có lỗi khi lưu sản phẩm');
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc muốn xóa vĩnh viễn sản phẩm "${name}"?`)) return;
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        showToast(`Đã xóa sản phẩm ${name}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Save Category
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    const slug = catSlug.trim() || catName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const catPayload: CategoryItem = {
      id: editingCatId || `cat-${Date.now()}`,
      name: catName.trim(),
      slug,
      subtitle: catSubtitle.trim() || 'Bộ sưu tập tinh dầu thảo mộc',
      image: catImage.trim() || 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80',
    };

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(catPayload),
      });

      if (res.ok) {
        showToast(editingCatId ? 'Cập nhật danh mục thành công!' : 'Thêm danh mục mới thành công!');
        setShowCatModal(false);
        setEditingCatId(null);
        setCatName('');
        setCatSlug('');
        setCatSubtitle('');
        setCatImage('');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Category
  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc muốn xóa loại sản phẩm "${name}"?`)) return;
    try {
      const res = await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
        showToast(`Đã xóa danh mục ${name}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Save Article
  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleTitle.trim()) return;

    const slug = articleSlug.trim() || articleTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const articlePayload: Article = {
      id: `art-${Date.now()}`,
      title: articleTitle.trim(),
      slug,
      excerpt: articleExcerpt.trim(),
      content: articleContent.trim(),
      coverImage: articleCover.trim() || 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80',
      category: articleCategory.trim(),
      publishedAt: new Date().toISOString().split('T')[0],
      readTime: '4 phút đọc',
      author: 'Nam Mộc Hương Editorial',
    };

    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articlePayload),
      });

      if (res.ok) {
        showToast('Đăng bài viết mới thành công!');
        setShowArticleModal(false);
        setArticleTitle('');
        setArticleSlug('');
        setArticleExcerpt('');
        setArticleContent('');
        setArticleCover('');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Article
  const handleDeleteArticle = async (id: string, title: string) => {
    if (!confirm(`Bạn có chắc muốn xóa bài viết "${title}"?`)) return;
    try {
      const res = await fetch(`/api/articles?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setArticles((prev) => prev.filter((a) => a.id !== id));
        showToast(`Đã xóa bài viết ${title}`);
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

  // -------------------------------------------------------------
  // RENDER: PASSWORD PROTECTION GATE
  // -------------------------------------------------------------
  if (authChecking) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-botanical border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-clay shadow-xl text-center space-y-6 animate-fade-in">
          {/* Logo & Lock Icon */}
          <div className="mx-auto w-16 h-16 rounded-full bg-botanical flex items-center justify-center text-gold shadow-md">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="font-serif text-2xl font-bold text-botanical tracking-tight">
              NAM MỘC HƯƠNG
            </h1>
            <p className="text-xs uppercase tracking-widest text-earth font-bold">
              Bảo Mật Quản Trị Hệ Thống
            </p>
            <p className="text-xs text-charcoal/60 pt-1">
              Khu vực bảo mật dành riêng cho quản trị viên. Vui lòng nhập mật mã quản trị để truy cập.
            </p>
          </div>

          {passwordError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  if (passwordError) setPasswordError('');
                }}
                placeholder="Nhập mật mã quản trị..."
                className="w-full px-4 py-3 pr-11 rounded-xl border border-clay bg-ivory-50 focus:bg-white focus:border-botanical outline-none text-sm font-medium transition-all"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-botanical p-1"
                aria-label="Hiện/ẩn mật khẩu"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-botanical hover:bg-botanical-dark text-ivory py-3 rounded-xl font-semibold text-xs transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4 text-gold" />
              <span>Mở Khóa Quản Trị</span>
            </button>
          </form>

          <div className="pt-4 border-t border-clay/60">
            <Link
              href="/"
              className="text-xs text-charcoal/50 hover:text-botanical transition-colors"
            >
              ← Quay về trang chủ website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: MAIN ADMIN DASHBOARD
  // -------------------------------------------------------------
  const totalRevenue = orders.reduce((sum, o) => (o.status !== 'cancelled' ? sum + o.total : sum), 0);
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const newLeads = leads.filter((l) => l.status === 'new').length;

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.categoryName?.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredOrders = orders.filter(
    (o) =>
      o.orderCode.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerPhone.includes(orderSearch)
  );

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
              <span>Xem Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs font-semibold bg-botanical/60 hover:bg-red-800 text-ivory px-3 py-1.5 rounded-full transition-all border border-ivory/20"
              title="Đăng xuất khỏi Admin"
            >
              <LogOut className="w-3.5 h-3.5 text-gold" />
              <span>Đăng xuất</span>
            </button>
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
            onClick={() => setActiveTab('articles')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'articles' ? 'bg-botanical text-ivory shadow-xs' : 'text-charcoal/70 hover:bg-clay/50'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Bài Viết ({articles.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('cms')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'cms' ? 'bg-botanical text-ivory shadow-xs' : 'text-charcoal/70 hover:bg-clay/50'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Cấu Hình Website & CMS</span>
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
                <span className="text-[11px] text-charcoal/50">Tính trên các đơn không bị hủy</span>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-clay shadow-xs space-y-2">
                <span className="text-xs uppercase tracking-wider text-earth font-bold">Đơn Hàng Mới</span>
                <p className="font-serif text-3xl font-bold text-amber-600">{pendingOrders}</p>
                <span className="text-[11px] text-charcoal/50">Cần xác nhận và đóng gói</span>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-clay shadow-xs space-y-2">
                <span className="text-xs uppercase tracking-wider text-earth font-bold">Khách Cần Tư Vấn (Leads)</span>
                <p className="font-serif text-3xl font-bold text-emerald-600">{newLeads}</p>
                <span className="text-[11px] text-charcoal/50">Khách gửi SĐT qua form / hotline</span>
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
                  openAddProduct();
                }}
                className="bg-botanical hover:bg-botanical-dark text-ivory text-xs font-semibold px-5 py-3 rounded-xl flex items-center gap-2 shadow-xs transition-all"
              >
                <Plus className="w-4 h-4" /> Đăng Sản Phẩm Mới & Upload ImgBB
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('categories');
                  setEditingCatId(null);
                  setCatName('');
                  setCatSlug('');
                  setCatSubtitle('');
                  setCatImage('');
                  setShowCatModal(true);
                }}
                className="bg-white hover:bg-clay/50 text-botanical border border-botanical text-xs font-semibold px-5 py-3 rounded-xl flex items-center gap-2 shadow-xs transition-all"
              >
                <FolderTree className="w-4 h-4" /> Thêm Loại Sản Phẩm Mới
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('articles');
                  setShowArticleModal(true);
                }}
                className="bg-white hover:bg-clay/50 text-botanical border border-clay text-xs font-semibold px-5 py-3 rounded-xl flex items-center gap-2 shadow-xs transition-all"
              >
                <FileText className="w-4 h-4" /> Viết Bài Blog Mới
              </button>
            </div>
          </div>
        )}

        {/* ========================================= */}
        {/* TAB 2: LEADS (DATA KHÁCH HÀNG) */}
        {/* ========================================= */}
        {activeTab === 'leads' && (
          <div className="bg-white p-6 rounded-3xl border border-clay shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl font-bold text-botanical">Danh Sách Khách Hàng Để Lại Data</h2>
                <p className="text-xs text-charcoal/60 mt-0.5">Khách đăng ký nhận tư vấn và đặt hàng từ form bong bóng.</p>
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
                      <th className="p-3">Ghi Chú / Lời Nhắn</th>
                      <th className="p-3">Thời Gian</th>
                      <th className="p-3">Trạng Thái Xử Lý</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-clay/40">
                    {leads.map((l) => (
                      <tr key={l.id} className="hover:bg-ivory-50/50">
                        <td className="p-3 font-semibold text-charcoal">{l.name}</td>
                        <td className="p-3">
                          <a
                            href={`tel:${l.phone}`}
                            className="inline-flex items-center gap-1.5 font-bold text-botanical hover:underline bg-botanical/10 px-2.5 py-1 rounded"
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
                            <option value="cancelled">Hủy / Không liên hệ được</option>
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
        {/* TAB 3: PRODUCTS & IMGBB UPLOAD */}
        {/* ========================================= */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-botanical">Danh Sách Sản Phẩm & Upload</h2>
                <p className="text-xs text-charcoal/60 mt-0.5">Tải ảnh qua API ImgBB Cloud, quản lý giá và chỉnh sửa sản phẩm.</p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Tìm tên sản phẩm..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-clay bg-white text-xs outline-none focus:border-botanical"
                  />
                  <Search className="w-4 h-4 text-charcoal/40 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>

                <button
                  type="button"
                  onClick={openAddProduct}
                  className="bg-botanical hover:bg-botanical-dark text-ivory text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm transition-all whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" /> Đăng Sản Phẩm
                </button>
              </div>
            </div>

            {/* Product Add / Edit Modal */}
            {showProductModal && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                <form
                  onSubmit={handleSaveProduct}
                  className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 border border-clay shadow-2xl space-y-6 my-8 text-xs max-h-[90vh] overflow-y-auto"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-clay">
                    <h3 className="font-serif text-lg font-bold text-botanical">
                      {editingProductId ? 'Chỉnh Sửa Thông Tin Sản Phẩm' : 'Đăng Sản Phẩm Mới & Upload Ảnh'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowProductModal(false)}
                      className="p-1.5 rounded-full hover:bg-clay text-charcoal/60"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-semibold text-charcoal">Tên sản phẩm *</label>
                      <input
                        type="text"
                        required
                        value={prodName}
                        onChange={(e) => setProdName(e.target.value)}
                        placeholder="Ví dụ: Tinh dầu vỏ quế Yên Bái"
                        className="w-full px-4 py-2.5 rounded-xl border border-clay bg-ivory-50 focus:bg-white outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-charcoal">Loại sản phẩm / Danh mục *</label>
                      <select
                        value={prodCategory}
                        onChange={(e) => setProdCategory(e.target.value)}
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
                        value={prodSubtitle}
                        onChange={(e) => setProdSubtitle(e.target.value)}
                        placeholder="Ví dụ: Ấm áp, thư giãn cơ bắp"
                        className="w-full px-4 py-2.5 rounded-xl border border-clay bg-ivory-50 focus:bg-white outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-charcoal">Vùng nguyên liệu bản địa</label>
                      <input
                        type="text"
                        value={prodOrigin}
                        onChange={(e) => setProdOrigin(e.target.value)}
                        placeholder="Ví dụ: Yên Bái / Bến Tre"
                        className="w-full px-4 py-2.5 rounded-xl border border-clay bg-ivory-50 focus:bg-white outline-none"
                      />
                    </div>
                  </div>

                  {/* Upload Image Section (ImgBB Integration) */}
                  <div className="p-4 bg-ivory-50 rounded-2xl border border-clay/80 space-y-3">
                    <label className="font-semibold text-charcoal block">Ảnh đại diện sản phẩm (Tải qua ImgBB) *</label>
                    
                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                      {/* Image Preview Box */}
                      <div className="relative w-28 h-32 rounded-xl border border-clay bg-white overflow-hidden flex items-center justify-center flex-shrink-0 shadow-xs">
                        {prodImage ? (
                          <img src={prodImage} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-8 h-8 text-charcoal/30" />
                        )}
                      </div>

                      <div className="flex-1 space-y-2 w-full">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => prodFileInputRef.current?.click()}
                            disabled={uploadingImage}
                            className="bg-white hover:bg-clay/50 text-botanical border border-botanical px-4 py-2 rounded-xl font-semibold flex items-center gap-1.5 shadow-xs transition-all"
                          >
                            <Upload className="w-4 h-4" />
                            <span>{uploadingImage ? 'Đang tải lên...' : 'Chọn Ảnh Từ Máy Tính (ImgBB)'}</span>
                          </button>
                          <input
                            ref={prodFileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleProdImageUpload}
                            className="hidden"
                          />
                        </div>

                        <div className="space-y-1">
                          <span className="text-[11px] text-charcoal/50 block">Hoặc dán trực tiếp đường link ảnh (URL):</span>
                          <input
                            type="url"
                            value={prodImage}
                            onChange={(e) => setProdImage(e.target.value)}
                            placeholder="https://i.ibb.co/... hoặc https://images.unsplash.com/..."
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
                        value={prodTopNote}
                        onChange={(e) => setProdTopNote(e.target.value)}
                        placeholder="Ví dụ: Vỏ quế ngọt"
                        className="w-full px-3 py-2 rounded-xl border border-clay bg-ivory-50 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-charcoal">Hương giữa (Heart)</label>
                      <input
                        type="text"
                        value={prodMidNote}
                        onChange={(e) => setProdMidNote(e.target.value)}
                        placeholder="Ví dụ: Thảo mộc khô"
                        className="w-full px-3 py-2 rounded-xl border border-clay bg-ivory-50 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-charcoal">Hương cuối (Base)</label>
                      <input
                        type="text"
                        value={prodBaseNote}
                        onChange={(e) => setProdBaseNote(e.target.value)}
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
                      onClick={() => setShowProductModal(false)}
                      className="px-5 py-2.5 rounded-xl border border-clay hover:bg-clay/40 font-semibold"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      type="submit"
                      className="bg-botanical hover:bg-botanical-dark text-ivory px-6 py-2.5 rounded-xl font-semibold shadow-md flex items-center gap-1.5"
                    >
                      <Save className="w-4 h-4 text-gold" />
                      <span>{editingProductId ? 'Lưu Thay Đổi' : 'Tạo Sản Phẩm'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
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

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditProduct(p)}
                          className="text-botanical hover:bg-clay/50 p-1.5 rounded-lg transition-colors"
                          title="Chỉnh sửa sản phẩm"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                          title="Xóa sản phẩm"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
                onClick={() => {
                  setEditingCatId(null);
                  setCatName('');
                  setCatSlug('');
                  setCatSubtitle('');
                  setCatImage('');
                  setShowCatModal(true);
                }}
                className="bg-botanical hover:bg-botanical-dark text-ivory text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" /> Thêm Danh Mục
              </button>
            </div>

            {/* Modal Add / Edit Category */}
            {showCatModal && (
              <form onSubmit={handleSaveCategory} className="p-6 rounded-2xl bg-ivory-50 border border-clay space-y-4 text-xs animate-fade-in">
                <h4 className="font-serif font-bold text-sm text-botanical">
                  {editingCatId ? 'Cập Nhật Loại Sản Phẩm' : 'Tạo Loại Sản Phẩm Mới'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-charcoal">Tên loại sản phẩm *</label>
                    <input
                      type="text"
                      required
                      value={catName}
                      onChange={(e) => setCatName(e.target.value)}
                      placeholder="Ví dụ: Tinh dầu Kháng khuẩn"
                      className="w-full px-4 py-2 rounded-xl border border-clay bg-white outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-charcoal">Mô tả ngắn</label>
                    <input
                      type="text"
                      value={catSubtitle}
                      onChange={(e) => setCatSubtitle(e.target.value)}
                      placeholder="Ví dụ: Bảo vệ hệ hô hấp cho gia đình"
                      className="w-full px-4 py-2 rounded-xl border border-clay bg-white outline-none"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-semibold text-charcoal">Ảnh bìa danh mục</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="url"
                        value={catImage}
                        onChange={(e) => setCatImage(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="flex-1 px-4 py-2 rounded-xl border border-clay bg-white outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => catFileInputRef.current?.click()}
                        disabled={uploadingCatImage}
                        className="px-3 py-2 bg-white border border-clay rounded-xl font-semibold hover:bg-clay/40 flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingCatImage ? 'Đang tải...' : 'Upload'}</span>
                      </button>
                      <input
                        ref={catFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleCatImageUpload}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCatModal(false)}
                    className="px-4 py-2 rounded-xl border border-clay bg-white text-xs font-semibold"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="bg-botanical text-ivory px-5 py-2 rounded-xl text-xs font-semibold shadow-xs"
                  >
                    Lưu Danh Mục
                  </button>
                </div>
              </form>
            )}

            {/* Categories List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((c) => (
                <div key={c.id} className="relative rounded-2xl overflow-hidden aspect-[4/3] border border-clay shadow-xs group">
                  <img src={c.image} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-forest/90 via-deep-forest/40 to-transparent p-4 flex flex-col justify-end text-ivory">
                    <h4 className="font-serif font-bold text-base">{c.name}</h4>
                    <p className="text-[11px] text-ivory/70 line-clamp-1">{c.subtitle}</p>
                    <span className="text-[10px] text-gold mt-1 font-mono">Slug: {c.slug}</span>
                    
                    <div className="pt-2 mt-2 border-t border-ivory/20 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCatId(c.id);
                          setCatName(c.name);
                          setCatSlug(c.slug);
                          setCatSubtitle(c.subtitle);
                          setCatImage(c.image);
                          setShowCatModal(true);
                        }}
                        className="text-gold hover:underline text-[11px] font-medium"
                      >
                        Sửa
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(c.id, c.name)}
                        className="text-red-400 hover:text-red-200 text-[11px]"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================= */}
        {/* TAB 5: ARTICLES / BLOG MANAGEMENT */}
        {/* ========================================= */}
        {activeTab === 'articles' && (
          <div className="bg-white p-6 rounded-3xl border border-clay shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl font-bold text-botanical">Quản Lý Bài Viết & Nhật Ký Thảo Mộc</h2>
                <p className="text-xs text-charcoal/60 mt-0.5">Xuất bản bài viết kiến thức và cẩm nang sử dụng tinh dầu.</p>
              </div>

              <button
                type="button"
                onClick={() => setShowArticleModal(true)}
                className="bg-botanical hover:bg-botanical-dark text-ivory text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" /> Viết Bài Mới
              </button>
            </div>

            {/* Modal Add Article */}
            {showArticleModal && (
              <form onSubmit={handleSaveArticle} className="p-6 rounded-2xl bg-ivory-50 border border-clay space-y-4 text-xs animate-fade-in">
                <h4 className="font-serif font-bold text-sm text-botanical">Đăng Bài Viết Blog Mới</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-charcoal">Tiêu đề bài viết *</label>
                    <input
                      type="text"
                      required
                      value={articleTitle}
                      onChange={(e) => setArticleTitle(e.target.value)}
                      placeholder="Ví dụ: Bí quyết xông phòng ngủ ngon giấc"
                      className="w-full px-4 py-2 rounded-xl border border-clay bg-white outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-charcoal">Chủ đề / Chuyên mục</label>
                    <input
                      type="text"
                      value={articleCategory}
                      onChange={(e) => setArticleCategory(e.target.value)}
                      placeholder="Ví dụ: Nghi Thức Hương / Kiến Thức Tinh Dầu"
                      className="w-full px-4 py-2 rounded-xl border border-clay bg-white outline-none"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-semibold text-charcoal">Tóm tắt ngắn (Excerpt)</label>
                    <textarea
                      rows={2}
                      value={articleExcerpt}
                      onChange={(e) => setArticleExcerpt(e.target.value)}
                      placeholder="Tóm tắt nội dung chính để hiển thị ngoài trang chủ..."
                      className="w-full px-4 py-2 rounded-xl border border-clay bg-white outline-none"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-semibold text-charcoal">Ảnh bìa bài viết</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="url"
                        value={articleCover}
                        onChange={(e) => setArticleCover(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="flex-1 px-4 py-2 rounded-xl border border-clay bg-white outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => articleFileInputRef.current?.click()}
                        disabled={uploadingArticleCover}
                        className="px-3 py-2 bg-white border border-clay rounded-xl font-semibold hover:bg-clay/40 flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingArticleCover ? 'Đang tải...' : 'Upload'}</span>
                      </button>
                      <input
                        ref={articleFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleArticleImageUpload}
                        className="hidden"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-semibold text-charcoal">Nội dung chi tiết</label>
                    <textarea
                      rows={6}
                      value={articleContent}
                      onChange={(e) => setArticleContent(e.target.value)}
                      placeholder="Soạn nội dung bài viết..."
                      className="w-full px-4 py-2.5 rounded-xl border border-clay bg-white outline-none leading-relaxed"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowArticleModal(false)}
                    className="px-4 py-2 rounded-xl border border-clay bg-white text-xs font-semibold"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="bg-botanical text-ivory px-5 py-2 rounded-xl text-xs font-semibold shadow-xs"
                  >
                    Xuất Bản Bài Viết
                  </button>
                </div>
              </form>
            )}

            {/* Articles List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {articles.map((a) => (
                <div key={a.id} className="bg-white rounded-2xl border border-clay overflow-hidden shadow-xs flex flex-col justify-between">
                  <div className="aspect-[16/10] overflow-hidden bg-ivory">
                    <img src={a.coverImage} alt={a.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <span className="text-[10px] text-earth uppercase font-bold">{a.category}</span>
                      <h4 className="font-serif font-bold text-sm text-botanical line-clamp-2 mt-0.5">{a.title}</h4>
                      <p className="text-[11px] text-charcoal/60 line-clamp-2 mt-1">{a.excerpt}</p>
                    </div>

                    <div className="pt-3 border-t border-clay/60 flex items-center justify-between text-[11px] text-charcoal/50">
                      <span>{a.publishedAt}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteArticle(a.id, a.title)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================= */}
        {/* TAB 6: ORDERS */}
        {/* ========================================= */}
        {activeTab === 'orders' && (
          <div className="bg-white p-6 rounded-3xl border border-clay shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-botanical">Quản Lý Đơn Hàng Thực Tế</h2>
                <p className="text-xs text-charcoal/60 mt-0.5">Xác nhận và theo dõi các đơn hàng khách đặt qua web.</p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Tìm theo mã đơn hoặc SĐT..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-clay bg-white text-xs outline-none focus:border-botanical"
                  />
                  <Search className="w-4 h-4 text-charcoal/40 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>

                <button
                  type="button"
                  onClick={fetchData}
                  className="text-xs text-charcoal/70 hover:text-botanical flex items-center gap-1 border border-clay px-3 py-2 rounded-xl whitespace-nowrap"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Làm mới
                </button>
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <p className="text-xs text-charcoal/60 py-12 text-center">Chưa có đơn hàng nào phù hợp.</p>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((o) => (
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
                        {o.note && <p className="text-charcoal/50 italic mt-1">Ghi chú: {o.note}</p>}
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
        {/* TAB 7: VISUAL CMS & CONFIG */}
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
