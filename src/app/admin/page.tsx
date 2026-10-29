'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Product, Order, SiteConfig, OrderStatus, CategoryItem, Lead, LeadStatus, Article } from '@/types';
import { formatVND, formatDateVietnamese, slugify } from '@/lib/utils';
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
  const [toastIsError, setToastIsError] = useState(false);
  const [loadError, setLoadError] = useState('');

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
  const [prodStory, setProdStory] = useState('');
  const [prodGallery, setProdGallery] = useState('');
  const [prodBenefits, setProdBenefits] = useState('');
  const [prodRitual, setProdRitual] = useState('');
  const [prodFeatured, setProdFeatured] = useState(false);
  const [prodNew, setProdNew] = useState(false);
  const [prodOrigin, setProdOrigin] = useState('');
  const [prodExtraction, setProdExtraction] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [prodTopNote, setProdTopNote] = useState('');
  const [prodMidNote, setProdMidNote] = useState('');
  const [prodBaseNote, setProdBaseNote] = useState('');

  // Dynamic variants state (hỗ trợ nhiều dung tích: 10ml, 30ml, 50ml, v.v...)
  const [variantsList, setVariantsList] = useState<
    Array<{ capacity: string; price: string; salePrice: string; stock: string }>
  >([
    { capacity: '10ml', price: '', salePrice: '', stock: '0' },
  ]);
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
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [articleTitle, setArticleTitle] = useState('');
  const [articleSlug, setArticleSlug] = useState('');
  const [articleCategory, setArticleCategory] = useState('Nghi Thức Hương');
  const [articleExcerpt, setArticleExcerpt] = useState('');
  const [articleContent, setArticleContent] = useState('');
  const [articleCover, setArticleCover] = useState('');
  const [articleAuthor, setArticleAuthor] = useState('');
  const [articlePublishedAt, setArticlePublishedAt] = useState('');
  const [articleReadTime, setArticleReadTime] = useState('');
  const [uploadingArticleCover, setUploadingArticleCover] = useState(false);

  // File Inputs
  const prodFileInputRef = useRef<HTMLInputElement>(null);
  const catFileInputRef = useRef<HTMLInputElement>(null);
  const articleFileInputRef = useRef<HTMLInputElement>(null);
  const heroBannerFileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingHeroBanner, setUploadingHeroBanner] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);

  // The server owns the session; browser storage must never grant admin access.
  useEffect(() => {
    fetch('/api/admin/session', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => setIsAuthenticated(data.authenticated === true))
      .catch(() => setPasswordError('Không kiểm tra được phiên quản trị.'))
      .finally(() => setAuthChecking(false));
  }, []);

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      setLoadError('');
      const t = Date.now();
      const fetchOpts: RequestInit = {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
        },
      };

      const read = async (url: string) => {
        const response = await fetch(url, fetchOpts);
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || 'Không tải được dữ liệu quản trị');
        return data;
      };
      const [resOrders, resProducts, resCats, resLeads, resArticles, resConfig] = await Promise.all([
        read(`/api/orders?_t=${t}`),
        read(`/api/products?_t=${t}`),
        read(`/api/categories?_t=${t}`),
        read(`/api/leads?_t=${t}`),
        read(`/api/articles?_t=${t}`),
        read(`/api/config?_t=${t}`),
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
      setLoadError(err instanceof Error ? err.message : 'Không tải được dữ liệu quản trị');
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
    setToastIsError(/lỗi|không|thiếu|vui lòng|chưa|supabase|permission|failed/i.test(msg));
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const adminFetch = async (input: string, init: RequestInit) => {
    const response = await fetch(input, init);
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      if (response.status === 401) setIsAuthenticated(false);
      throw new Error(body.error || 'Thao tác chưa được lưu. Vui lòng thử lại.');
    }
    return response;
  };

  // Password verification
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/session', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({password:passwordInput}) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Không đăng nhập được');
      setIsAuthenticated(true);
      setPasswordError('');
      setPasswordInput('');
    } catch (error) {
      setPasswordError(error instanceof Error ? error.message : 'Không đăng nhập được');
    }
  };

  const handleLogout = () => {
    fetch('/api/admin/session', { method:'DELETE' }).catch(console.error);
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

  // Upload Hero Banner Image
  const handleHeroBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingHeroBanner(true);
    try {
      const url = await uploadImageFile(file);
      if (url && config) {
        setConfig((prev) => (prev ? { ...prev, heroImage: url } : null));
        showToast('Đã tải ảnh banner lên thành công!');
      }
    } catch (err) {
      console.error(err);
      showToast('Có lỗi khi tải ảnh banner');
    } finally {
      setUploadingHeroBanner(false);
    }
  };

  // Variant helpers
  const handleAddVariant = (defaultCap = '') => {
    let nextCap = defaultCap;
    if (!nextCap) {
      const existingCaps = variantsList.map((v) => v.capacity.toLowerCase().trim());
      if (!existingCaps.includes('10ml')) nextCap = '10ml';
      else if (!existingCaps.includes('30ml')) nextCap = '30ml';
      else if (!existingCaps.includes('50ml')) nextCap = '50ml';
      else if (!existingCaps.includes('100ml')) nextCap = '100ml';
      else nextCap = `${(variantsList.length + 1) * 10}ml`;
    }

    // Nếu đã có capacity này thì không thêm trùng
    if (defaultCap && variantsList.some((v) => v.capacity.toLowerCase().trim() === defaultCap.toLowerCase().trim())) {
      showToast(`Dung tích ${defaultCap} đã có trong danh sách!`);
      return;
    }

    setVariantsList((prev) => [
      ...prev,
      { capacity: nextCap, price: '', salePrice: '', stock: '0' },
    ]);
  };

  const handleRemoveVariant = (index: number) => {
    if (variantsList.length <= 1) {
      showToast('Sản phẩm phải có ít nhất 1 mức dung tích / giá bán');
      return;
    }
    setVariantsList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateVariant = (
    index: number,
    field: 'capacity' | 'price' | 'salePrice' | 'stock',
    value: string
  ) => {
    setVariantsList((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Open Edit Product Modal
  const openEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setProdName(p.name);
    setProdSlug(p.slug);
    setProdCategory(p.category);
    setProdSubtitle(p.subtitle);
    setProdDescription(p.description);
    setProdStory(p.story || '');
    setProdGallery((p.gallery || []).filter(url=>url!==p.image).join('\n'));
    setProdBenefits((p.benefits || []).join('\n'));
    setProdRitual((p.ritualGuide || []).join('\n'));
    setProdFeatured(Boolean(p.isFeatured));
    setProdNew(Boolean(p.isNew));
    setProdOrigin(p.origin || '');
    setProdExtraction(p.extractionMethod || '');
    setProdImage(p.image);
    setProdTopNote(p.notes?.top || '');
    setProdMidNote(p.notes?.middle || '');
    setProdBaseNote(p.notes?.base || '');

    if (p.variants && p.variants.length > 0) {
      setVariantsList(
        p.variants.map((v) => ({
          capacity: v.capacity,
          price: String(v.price),
          salePrice: v.salePrice ? String(v.salePrice) : '',
          stock: String(v.stock),
        }))
      );
    } else {
      setVariantsList([
        { capacity: '10ml', price: '', salePrice: '', stock: '0' },
      ]);
    }
    setShowProductModal(true);
  };

  // Open Add Product Modal
  const openAddProduct = () => {
    setEditingProductId(null);
    setProdName('');
    setProdSlug('');
    setProdCategory(categories[0]?.slug || '');
    setProdSubtitle('');
    setProdDescription('');
    setProdStory('');
    setProdGallery('');
    setProdBenefits('');
    setProdRitual('');
    setProdFeatured(false);
    setProdNew(false);
    setProdOrigin('');
    setProdExtraction('');
    setProdImage('');
    setProdTopNote('');
    setProdMidNote('');
    setProdBaseNote('');
    setVariantsList([
      { capacity: '10ml', price: '', salePrice: '', stock: '0' },
    ]);
    setShowProductModal(true);
  };

  // Save Product (Create or Update)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) {
      showToast('Vui lòng nhập tên sản phẩm');
      return;
    }
    if (!prodImage.trim()) { showToast('Vui lòng tải ảnh sản phẩm trước khi lưu'); return; }

    // Kiểm tra tính hợp lệ của từng dung tích
    const invalidVariant = variantsList.find(
      (v) => !v.capacity.trim() || !v.price || Number(v.price) <= 0
    );
    if (invalidVariant) {
      showToast('Vui lòng nhập đầy đủ Tên dung tích và Giá niêm yết (> 0đ) cho tất cả biến thể');
      return;
    }

    const slug = slugify(prodSlug.trim() || prodName);
    const catItem = categories.find((c) => c.slug === prodCategory);
    if (!catItem) { showToast('Vui lòng chọn danh mục đã tồn tại'); return; }

    const mappedVariants = variantsList.map((v) => ({
      capacity: v.capacity.trim(),
      price: Number(v.price),
      salePrice: v.salePrice.trim() ? Number(v.salePrice) : undefined,
      stock: Number(v.stock) || 0,
      sku: `NMH-${slug.toUpperCase().slice(0, 4)}-${v.capacity.trim().toUpperCase()}`,
    }));

    const productPayload: Product = {
      id: editingProductId || `nmh-${Date.now()}`,
      name: prodName.trim(),
      slug,
      category: catItem.slug,
      categoryName: catItem.name,
      subtitle: prodSubtitle.trim(),
      description: prodDescription.trim(),
      story: prodStory.trim(),
      origin: prodOrigin.trim(),
      extractionMethod: prodExtraction.trim(),
      image: prodImage.trim(),
      gallery: [prodImage.trim(),...prodGallery.split('\n').map(x=>x.trim()).filter(Boolean)].filter(Boolean),
      variants: mappedVariants,
      notes: {
        top: prodTopNote.trim(),
        middle: prodMidNote.trim(),
        base: prodBaseNote.trim(),
      },
      benefits: prodBenefits.split('\n').map(x=>x.trim()).filter(Boolean),
      ritualGuide: prodRitual.split('\n').map(x=>x.trim()).filter(Boolean),
      isFeatured: prodFeatured,
      isNew: prodNew,
      rating: products.find(p=>p.id===editingProductId)?.rating || 0,
      reviewCount: products.find(p=>p.id===editingProductId)?.reviewCount || 0,
    };

    try {
      const method = editingProductId ? 'PUT' : 'POST';
      const res = await adminFetch('/api/products', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productPayload),
      });

      if (res.ok) {
        showToast(editingProductId ? 'Đã cập nhật sản phẩm và bảng giá!' : 'Đã thêm sản phẩm mới thành công!');
        setShowProductModal(false);
        await fetchData();
      }
    } catch (err) {
      console.error(err);
      showToast(err instanceof Error ? err.message : 'Có lỗi khi lưu sản phẩm');
    }
  };


  // Delete Product
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc muốn xóa vĩnh viễn sản phẩm "${name}"? Dữ liệu sẽ mất vĩnh viễn trên toàn hệ thống.`)) return;
    try {
      const res = await adminFetch(`/api/products?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        cache: 'no-store',
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        showToast(`Đã xóa vĩnh viễn sản phẩm "${name}"`);
        await fetchData();
      } else {
        const data = await res.json().catch(() => ({}));
        showToast(data.error || `Không thể xóa sản phẩm "${name}"`);
      }
    } catch (err) {
      console.error(err);
      showToast(err instanceof Error ? err.message : 'Lỗi kết nối khi xóa sản phẩm');
    }
  };

  // Save Category
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    const slug = slugify(catSlug.trim() || catName);

    const catPayload: CategoryItem = {
      id: editingCatId || `cat-${Date.now()}`,
      name: catName.trim(),
      slug,
      subtitle: catSubtitle.trim(),
      image: catImage.trim(),
    };

    try {
      const res = await adminFetch('/api/categories', {
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
        await fetchData();
      }
    } catch (err) {
      console.error(err);
      showToast(err instanceof Error ? err.message : 'Lỗi khi lưu danh mục');
    }
  };

  // Delete Category
  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc muốn xóa loại sản phẩm "${name}"?`)) return;
    try {
      const res = await adminFetch(`/api/categories?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        cache: 'no-store',
      });
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
        showToast(`Đã xóa vĩnh viễn danh mục "${name}"`);
        await fetchData();
      } else {
        const data = await res.json().catch(() => ({}));
        showToast(data.error || `Không thể xóa danh mục "${name}"`);
      }
    } catch (err) {
      console.error(err);
      showToast(err instanceof Error ? err.message : 'Lỗi kết nối khi xóa danh mục');
    }
  };

  // Save Article
  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleTitle.trim()) return;

    const slug = slugify(articleSlug.trim() || articleTitle);

    const articlePayload: Article = {
      id: editingArticleId || `art-${Date.now()}`,
      title: articleTitle.trim(),
      slug,
      excerpt: articleExcerpt.trim(),
      content: articleContent.trim(),
      coverImage: articleCover.trim(),
      category: articleCategory.trim(),
      publishedAt: articlePublishedAt || new Date().toISOString().split('T')[0],
      readTime: articleReadTime.trim(),
      author: articleAuthor.trim() || config?.siteName || 'Nam Mộc Hương',
    };

    try {
      const res = await adminFetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articlePayload),
      });

      if (res.ok) {
        showToast(editingArticleId ? 'Đã cập nhật bài viết' : 'Đã đăng bài viết');
        setShowArticleModal(false);
        setEditingArticleId(null);
        setArticleTitle('');
        setArticleSlug('');
        setArticleExcerpt('');
        setArticleContent('');
        setArticleCover('');
        setArticleAuthor('');
        setArticlePublishedAt('');
        setArticleReadTime('');
        await fetchData();
      }
    } catch (err) {
      console.error(err);
      showToast(err instanceof Error ? err.message : 'Lỗi khi lưu bài viết');
    }
  };

  const openEditArticle = (article: Article) => {
    setEditingArticleId(article.id);
    setArticleTitle(article.title);
    setArticleSlug(article.slug);
    setArticleCategory(article.category);
    setArticleExcerpt(article.excerpt);
    setArticleContent(article.content);
    setArticleCover(article.coverImage);
    setArticleAuthor(article.author);
    setArticlePublishedAt(article.publishedAt);
    setArticleReadTime(article.readTime);
    setShowArticleModal(true);
  };

  // Delete Article
  const handleDeleteArticle = async (id: string, title: string) => {
    if (!confirm(`Bạn có chắc muốn xóa bài viết "${title}"?`)) return;
    try {
      const res = await adminFetch(`/api/articles?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        cache: 'no-store',
      });
      if (res.ok) {
        setArticles((prev) => prev.filter((a) => a.id !== id));
        showToast(`Đã xóa vĩnh viễn bài viết "${title}"`);
        await fetchData();
      } else {
        const data = await res.json().catch(() => ({}));
        showToast(data.error || `Không thể xóa bài viết "${title}"`);
      }
    } catch (err) {
      console.error(err);
      showToast(err instanceof Error ? err.message : 'Lỗi kết nối khi xóa bài viết');
    }
  };

  // Delete Lead / Customer Data
  const handleDeleteLead = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc muốn xóa dữ liệu khách hàng "${name}"?`)) return;
    try {
      const res = await adminFetch(`/api/leads?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        cache: 'no-store',
      });
      if (res.ok) {
        setLeads((prev) => prev.filter((l) => l.id !== id));
        showToast(`Đã xóa data khách hàng "${name}"`);
        await fetchData();
      } else {
        const data = await res.json().catch(() => ({}));
        showToast(data.error || `Không thể xóa khách hàng "${name}"`);
      }
    } catch (err) {
      console.error(err);
      showToast(err instanceof Error ? err.message : 'Lỗi kết nối khi xóa khách hàng');
    }
  };

  // Delete Order
  const handleDeleteOrder = async (orderCode: string) => {
    if (!confirm(`Bạn có chắc muốn xóa vĩnh viễn đơn hàng "${orderCode}"? Dữ liệu này sẽ không thể khôi phục.`)) return;
    try {
      const res = await adminFetch(`/api/orders?code=${encodeURIComponent(orderCode)}`, {
        method: 'DELETE',
        cache: 'no-store',
      });
      if (res.ok) {
        setOrders((prev) => prev.filter((o) => o.orderCode !== orderCode && o.id !== orderCode));
        showToast(`Đã xóa vĩnh viễn đơn hàng "${orderCode}"`);
        await fetchData();
      } else {
        const data = await res.json().catch(() => ({}));
        showToast(data.error || `Không thể xóa đơn hàng "${orderCode}"`);
      }
    } catch (err) {
      console.error(err);
      showToast(err instanceof Error ? err.message : 'Lỗi kết nối khi xóa đơn hàng');
    }
  };

  // Update Lead status
  const handleUpdateLeadStatus = async (id: string, status: LeadStatus) => {
    try {
      const res = await adminFetch('/api/leads', {
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
      showToast(err instanceof Error ? err.message : 'Không cập nhật được khách hàng');
    }
  };

  // Update Order status
  const handleUpdateOrderStatus = async (orderCode: string, newStatus: OrderStatus) => {
    try {
      const res = await adminFetch('/api/orders', {
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
      showToast(err instanceof Error ? err.message : 'Không cập nhật được đơn hàng');
    }
  };

  // Save Site Config
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;
    setSavingConfig(true);
    try {
      const res = await adminFetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (res.ok) {
        showToast('Xuất bản nội dung & Banner thành công!');
        await fetchData();
      } else {
        showToast('Có lỗi khi lưu cấu hình');
      }
    } catch (err) {
      console.error(err);
      showToast(err instanceof Error ? err.message : 'Lỗi kết nối khi lưu cấu hình');
    } finally {
      setSavingConfig(false);
    }
  };

  // -------------------------------------------------------------
  // RENDER: PASSWORD PROTECTION GATE
  // -------------------------------------------------------------
  if (authChecking) {
    return (
      <div className="admin-root min-h-screen bg-ivory flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-botanical border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="admin-root min-h-screen bg-ivory flex items-center justify-center p-4">
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
    <div className="admin-root min-h-screen bg-ivory-100 text-charcoal">
      {/* Top Header */}
      <header className="bg-botanical-forest text-ivory px-6 py-4 border-b border-botanical-dark sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-serif text-xl font-bold tracking-tight text-ivory">
              NAM MỘC HƯƠNG
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-gold text-botanical">
              Quản trị
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
          <div className={`fixed top-20 right-6 z-50 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-fade-in ${toastIsError?'bg-red-700':'bg-botanical'}`}>
            {toastIsError?<AlertCircle className="w-4 h-4"/>:<CheckCircle2 className="w-4 h-4 text-gold-light" />}
            <span>{successToast}</span>
          </div>
        )}
        {loadError && <div role="alert" className="mb-6 p-4 bg-red-50 border border-red-300 text-red-800 rounded-xl text-sm flex items-center gap-3"><AlertCircle className="w-5 h-5 shrink-0"/><span>{loadError}</span><button type="button" onClick={fetchData} className="ml-auto underline font-semibold">Tải lại</button></div>}

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
            <span>Khách hàng ({leads.length})</span>
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
            <span>Nội dung website</span>
          </button>
        </div>

        {/* ========================================= */}
        {/* TAB 1: OVERVIEW */}
        {/* ========================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-clay shadow-xs space-y-2">
                <span className="text-xs uppercase tracking-wider text-earth font-bold">Giá trị đơn hàng</span>
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
                      <th className="p-3 text-right">Thao Tác</th>
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
                        <td className="p-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteLead(l.id, l.name)}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors inline-flex items-center gap-1"
                            title="Xóa data khách"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="text-[10px]">Xóa</span>
                          </button>
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="space-y-1"><span className="font-semibold">Đường dẫn sản phẩm</span><input value={prodSlug} onChange={e=>setProdSlug(e.target.value)} placeholder="Tự tạo từ tên nếu để trống" className="w-full px-4 py-2.5 rounded-xl border border-clay"/></label>
                    <label className="space-y-1"><span className="font-semibold">Phương pháp chiết xuất</span><input value={prodExtraction} onChange={e=>setProdExtraction(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-clay"/></label>
                    <label className="space-y-1 sm:col-span-2"><span className="font-semibold">Mô tả sản phẩm</span><textarea rows={4} value={prodDescription} onChange={e=>setProdDescription(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-clay"/></label>
                    <label className="space-y-1 sm:col-span-2"><span className="font-semibold">Câu chuyện sản phẩm</span><textarea rows={3} value={prodStory} onChange={e=>setProdStory(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-clay"/></label>
                    <label className="space-y-1 sm:col-span-2"><span className="font-semibold">Lợi ích (mỗi dòng một ý)</span><textarea rows={3} value={prodBenefits} onChange={e=>setProdBenefits(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-clay"/></label>
                    <label className="space-y-1 sm:col-span-2"><span className="font-semibold">Cách sử dụng (mỗi dòng một bước)</span><textarea rows={3} value={prodRitual} onChange={e=>setProdRitual(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-clay"/></label>
                    <label className="space-y-1 sm:col-span-2"><span className="font-semibold">Ảnh bổ sung (mỗi dòng một URL)</span><textarea rows={3} value={prodGallery} onChange={e=>setProdGallery(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-clay"/></label>
                    <label className="flex items-center gap-2"><input type="checkbox" checked={prodFeatured} onChange={e=>setProdFeatured(e.target.checked)}/> Hiển thị nổi bật ở trang chủ</label>
                    <label className="flex items-center gap-2"><input type="checkbox" checked={prodNew} onChange={e=>setProdNew(e.target.checked)}/> Đánh dấu sản phẩm mới</label>
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

                  {/* Dynamic Capacities & Pricing (Variants) */}
                  <div className="p-4 bg-ivory-50/80 rounded-2xl border border-clay/80 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-clay/60">
                      <div>
                        <h4 className="font-serif font-bold text-sm text-botanical flex items-center gap-2">
                          <span>Tùy Chỉnh Dung Tích & Bảng Giá</span>
                          <span className="text-[11px] font-sans font-normal text-charcoal/60">({variantsList.length} mức dung tích)</span>
                        </h4>
                        <p className="text-[11px] text-charcoal/60 mt-0.5">
                          Tùy biến dung tích (10ml, 30ml, 50ml, 100ml,...) với mức giá niêm yết, giá khuyến mãi và tồn kho riêng.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddVariant()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-botanical hover:bg-botanical-dark text-ivory text-xs font-semibold rounded-xl transition-all shadow-xs self-start sm:self-auto"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Thêm Dung Tích</span>
                      </button>
                    </div>

                    {/* Quick Suggestion Chips */}
                    <div className="flex items-center gap-2 flex-wrap text-[11px]">
                      <span className="text-charcoal/60 font-medium">Gợi ý nhanh:</span>
                      {['10ml', '15ml', '30ml', '50ml', '100ml'].map((suggestCap) => (
                        <button
                          key={suggestCap}
                          type="button"
                          onClick={() => handleAddVariant(suggestCap)}
                          className="px-2.5 py-0.5 rounded-full bg-white hover:bg-botanical/10 text-botanical border border-clay/80 font-medium transition-colors"
                        >
                          + {suggestCap}
                        </button>
                      ))}
                    </div>

                    {/* Variant Rows List */}
                    <div className="space-y-3">
                      {variantsList.map((vItem, index) => (
                        <div
                          key={index}
                          className="bg-white p-3.5 rounded-xl border border-clay/70 shadow-2xs space-y-3"
                        >
                          <div className="flex items-center justify-between pb-1.5 border-b border-clay/40">
                            <span className="text-xs font-bold text-botanical flex items-center gap-1.5">
                              <span className="w-4 h-4 rounded-full bg-botanical/10 text-botanical flex items-center justify-center text-[10px]">
                                {index + 1}
                              </span>
                              <span>Phân loại #{index + 1}</span>
                            </span>

                            {variantsList.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveVariant(index)}
                                className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors flex items-center gap-1 text-[11px]"
                                title="Xóa mức dung tích này"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Xóa</span>
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                            <div className="space-y-1">
                              <label className="font-semibold text-charcoal">Tên dung tích *</label>
                              <input
                                type="text"
                                required
                                value={vItem.capacity}
                                onChange={(e) => handleUpdateVariant(index, 'capacity', e.target.value)}
                                placeholder="VD: 10ml, 50ml..."
                                className="w-full px-3 py-2 rounded-xl border border-clay bg-ivory-50/50 focus:bg-white focus:border-botanical outline-none"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="font-semibold text-charcoal">Giá niêm yết (VNĐ) *</label>
                              <input
                                type="number"
                                required
                                value={vItem.price}
                                onChange={(e) => handleUpdateVariant(index, 'price', e.target.value)}
                                placeholder="VD: 180000"
                                className="w-full px-3 py-2 rounded-xl border border-clay bg-ivory-50/50 focus:bg-white focus:border-botanical outline-none"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="font-semibold text-charcoal">Giá khuyến mãi (tùy chọn)</label>
                              <input
                                type="number"
                                value={vItem.salePrice}
                                onChange={(e) => handleUpdateVariant(index, 'salePrice', e.target.value)}
                                placeholder="VD: 160000"
                                className="w-full px-3 py-2 rounded-xl border border-clay bg-ivory-50/50 focus:bg-white focus:border-botanical outline-none"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="font-semibold text-charcoal">Số lượng tồn kho</label>
                              <input
                                type="number"
                                value={vItem.stock}
                                onChange={(e) => handleUpdateVariant(index, 'stock', e.target.value)}
                                placeholder="VD: 50"
                                className="w-full px-3 py-2 rounded-xl border border-clay bg-ivory-50/50 focus:bg-white focus:border-botanical outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
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

                      {/* Capacities list badges */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {p.variants?.map((v) => (
                          <span
                            key={v.capacity}
                            className="px-1.5 py-0.5 rounded bg-ivory text-[10px] font-medium text-botanical border border-clay/60"
                          >
                            {v.capacity}: {formatVND(v.salePrice || v.price)}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-clay/60 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-charcoal/50 font-medium">
                          {p.variants?.length > 1 ? `${p.variants.length} dung tích` : '1 dung tích'}
                        </span>
                        <span className="font-serif font-bold text-botanical text-sm">
                          {formatVND(p.variants[0]?.salePrice || p.variants[0]?.price || 0)}
                          {p.variants?.length > 1 && (
                            <span className="font-sans font-normal text-xs text-charcoal/50"> trở lên</span>
                          )}
                        </span>
                      </div>


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
                onClick={() => {setEditingArticleId(null);setArticleTitle('');setArticleSlug('');setArticleCategory('');setArticleExcerpt('');setArticleContent('');setArticleCover('');setArticleAuthor('');setArticlePublishedAt('');setArticleReadTime('');setShowArticleModal(true);}}
                className="bg-botanical hover:bg-botanical-dark text-ivory text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" /> Viết Bài Mới
              </button>
            </div>

            {/* Modal Add Article */}
            {showArticleModal && (
              <form onSubmit={handleSaveArticle} className="p-6 rounded-2xl bg-ivory-50 border border-clay space-y-4 text-xs animate-fade-in">
                <h4 className="font-serif font-bold text-sm text-botanical">{editingArticleId?'Chỉnh sửa bài viết':'Đăng bài viết mới'}</h4>
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
                  <div className="space-y-1">
                    <label className="font-semibold text-charcoal">Tác giả</label>
                    <input type="text" value={articleAuthor} onChange={e=>setArticleAuthor(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-clay bg-white outline-none"/>
                  </div>
                  <label className="space-y-1"><span className="font-semibold">Đường dẫn bài viết</span><input value={articleSlug} onChange={e=>setArticleSlug(e.target.value)} placeholder="Tự tạo từ tiêu đề" className="w-full px-4 py-2 rounded-xl border border-clay bg-white outline-none"/></label>
                  <label className="space-y-1"><span className="font-semibold">Ngày đăng</span><input type="date" value={articlePublishedAt} onChange={e=>setArticlePublishedAt(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-clay bg-white outline-none"/></label>
                  <label className="space-y-1"><span className="font-semibold">Thời gian đọc</span><input value={articleReadTime} onChange={e=>setArticleReadTime(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-clay bg-white outline-none"/></label>

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
                    {editingArticleId?'Lưu thay đổi':'Xuất bản bài viết'}
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
                      <div className="flex items-center gap-3"><button type="button" onClick={()=>openEditArticle(a)} className="text-botanical hover:underline" aria-label={`Sửa ${a.title}`}><Edit className="w-3.5 h-3.5"/></button><button
                        type="button"
                        onClick={() => handleDeleteArticle(a.id, a.title)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button></div>
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

                        <button
                          type="button"
                          onClick={() => handleDeleteOrder(o.orderCode)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
                          title="Xóa vĩnh viễn đơn hàng này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
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
        {/* TAB 7: VISUAL CMS & BANNER CONFIG */}
        {/* ========================================= */}
        {activeTab === 'cms' && config && (
          <form onSubmit={handleSaveConfig} className="bg-white p-6 sm:p-8 rounded-3xl border border-clay shadow-xs space-y-8 text-xs">
            <div className="border-b border-clay pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-botanical">
                  Quản Trị Banner & Cấu Hình Website
                </h2>
                <p className="text-xs text-charcoal/60 mt-1">
                  Chỉnh sửa trực tiếp hình ảnh Banner Hero, tiêu đề, nút bấm và thông tin thương hiệu hiển thị trên toàn hệ thống.
                </p>
              </div>

              <button
                type="submit"
                disabled={savingConfig}
                className="bg-botanical hover:bg-botanical-dark text-ivory px-6 py-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all shrink-0 self-start sm:self-auto"
              >
                <Save className="w-4 h-4 text-gold" />
                <span>{savingConfig ? 'Đang xuất bản...' : 'Xuất Bản Thay Đổi'}</span>
              </button>
            </div>

            {/* KHU VỰC 1: BANNER HERO & HÌNH ẢNH CHÍNH TRANG CHỦ */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-1 border-b border-clay/60">
                <ImageIcon className="w-4 h-4 text-botanical" />
                <h3 className="font-serif font-bold text-sm sm:text-base text-botanical">
                  1. Hình Ảnh Banner Hero & Khung Giới Thiệu
                </h3>
              </div>

              {/* Banner Live Preview & Upload Box */}
              <div className="p-5 rounded-2xl bg-ivory-50 border border-clay flex flex-col md:flex-row gap-6 items-center">
                {/* Live Preview Box */}
                <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden bg-[#24372C] border-2 border-botanical/40 shadow-md shrink-0 flex items-center justify-center group">
                  {config.heroImage ? (
                    <img
                      src={config.heroImage}
                      alt="Banner Preview"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="text-center p-4 text-ivory/60 text-xs">
                      <ImageIcon className="w-8 h-8 mx-auto mb-2 text-ivory/40" />
                      Chưa có ảnh banner
                    </div>
                  )}
                  <span className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-md font-mono">
                    Xem trước thực tế
                  </span>
                </div>

                {/* Banner Image Controls */}
                <div className="flex-1 space-y-3 w-full">
                  <div>
                    <label className="font-semibold text-charcoal block mb-1">
                      Đường dẫn ảnh Banner Hero (Chai tinh dầu / Banner chính trang chủ) *
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="url"
                        value={config.heroImage || ''}
                        onChange={(e) => setConfig({ ...config, heroImage: e.target.value })}
                        placeholder="https://images.unsplash.com/... hoặc link ảnh ImgBB"
                        className="flex-1 px-4 py-2.5 rounded-xl border border-clay bg-white text-xs outline-none focus:border-botanical"
                      />
                      <button
                        type="button"
                        onClick={() => heroBannerFileInputRef.current?.click()}
                        disabled={uploadingHeroBanner}
                        className="px-4 py-2.5 bg-botanical hover:bg-botanical-dark text-ivory font-semibold rounded-xl flex items-center gap-1.5 shadow-xs transition-all shrink-0"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingHeroBanner ? 'Đang tải...' : 'Upload Ảnh'}</span>
                      </button>
                      <input
                        ref={heroBannerFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleHeroBannerUpload}
                        className="hidden"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-charcoal/60 pt-1">
                    <span>Gợi ý:</span>
                    <button
                      type="button"
                      onClick={() =>
                        setConfig({
                          ...config,
                          heroImage:
                            'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1000&q=85',
                        })
                      }
                      className="text-botanical font-semibold underline hover:text-botanical-dark"
                    >
                      Khôi phục ảnh mẫu chai thủy tinh hổ phách gốc
                    </button>
                    <span>•</span>
                    <span>Tỷ lệ chuẩn 1:1 (vuông) hoặc 4:5. Hỗ trợ JPG, PNG, WebP.</span>
                  </div>
                </div>
              </div>

              {/* Headline & Banner Text Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1 sm:col-span-2">
                  <label className="font-semibold text-charcoal">
                    Nhãn phụ trang trọng trên Headline (Eyebrow Badge)
                  </label>
                  <input
                    type="text"
                    value={config.heroBadge || ''}
                    onChange={(e) => setConfig({ ...config, heroBadge: e.target.value })}
                    placeholder="Ví dụ: Tinh dầu thiên nhiên nguyên chất 100%"
                    className="w-full px-4 py-2.5 rounded-xl border border-clay bg-ivory-50 focus:bg-white outline-none"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-charcoal">Tiêu đề lớn Hero (Headline)</label>
                    <span className="text-[11px] text-charcoal/50">Mẹo: Nhấn Enter để xuống dòng nghệ thuật</span>
                  </div>
                  <textarea
                    rows={2}
                    value={config.heroHeadline || ''}
                    onChange={(e) => setConfig({ ...config, heroHeadline: e.target.value })}
                    placeholder="Lan tỏa hương thơm&#10;Thuần khiết từ thiên nhiên"
                    className="w-full px-4 py-2.5 rounded-xl border border-clay bg-ivory-50 focus:bg-white outline-none leading-relaxed font-serif text-sm"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-semibold text-charcoal">Dòng mô tả thương hiệu (Subheadline)</label>
                  <textarea
                    rows={2}
                    value={config.heroSubheadline || ''}
                    onChange={(e) => setConfig({ ...config, heroSubheadline: e.target.value })}
                    placeholder="Nam Mộc Hương – tinh hoa từ thiên nhiên, cho một cuộc sống an yên và cân bằng."
                    className="w-full px-4 py-2.5 rounded-xl border border-clay bg-ivory-50 focus:bg-white outline-none leading-relaxed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-charcoal">Chữ hiển thị trên Nút bấm (CTA Text)</label>
                  <input
                    type="text"
                    value={config.heroCtaText || ''}
                    onChange={(e) => setConfig({ ...config, heroCtaText: e.target.value })}
                    placeholder="Khám phá sản phẩm"
                    className="w-full px-4 py-2.5 rounded-xl border border-clay bg-ivory-50 focus:bg-white outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-charcoal">Đường dẫn liên kết Nút bấm (CTA Link)</label>
                  <input
                    type="text"
                    value={config.heroCtaLink || ''}
                    onChange={(e) => setConfig({ ...config, heroCtaLink: e.target.value })}
                    placeholder="#san-pham hoặc /san-pham"
                    className="w-full px-4 py-2.5 rounded-xl border border-clay bg-ivory-50 focus:bg-white outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-5 pt-2">
              <div className="border-b border-clay/60 pb-2">
                <h3 className="font-serif font-bold text-base text-botanical">Nội dung trang chủ, menu và chân trang</h3>
                <p className="text-charcoal/60 mt-1">Các thay đổi hiển thị trên website sau khi bấm Xuất bản.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {([
                  ['siteName','Tên thương hiệu'],
                  ['brandTagline','Dòng giới thiệu thương hiệu'],
                  ['navProducts','Menu: sản phẩm'],
                  ['navStory','Menu: câu chuyện'],
                  ['navJournal','Menu: tạp chí'],
                  ['homeCategoryLabel','Nhãn khu danh mục'],
                  ['homeCategoryTitle','Tiêu đề khu danh mục'],
                  ['homeProductLabel','Nhãn khu sản phẩm'],
                  ['homeProductTitle','Tiêu đề khu sản phẩm'],
                  ['homeProductLinkText','Chữ liên kết xem tất cả sản phẩm'],
                  ['homeStoryLabel','Nhãn khu câu chuyện'],
                  ['homeStoryTitle','Tiêu đề khu câu chuyện'],
                  ['homeStoryBody','Nội dung khu câu chuyện'],
                  ['homeStoryImage','URL ảnh khu câu chuyện'],
                  ['homeStoryLinkText','Chữ liên kết khu câu chuyện'],
                  ['homeJournalLabel','Nhãn khu bài viết'],
                  ['homeJournalTitle','Tiêu đề khu bài viết'],
                  ['footerDescription','Mô tả chân trang'],
                  ['facebook','Liên kết Facebook'],
                ] as const).map(([key,label])=><label key={key} className="space-y-1 font-semibold text-charcoal">
                  <span>{label}</span>
                  {key==='homeStoryBody' ? <textarea rows={3} value={config[key]||''} onChange={e=>setConfig({...config,[key]:e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-clay bg-ivory-50 focus:bg-white outline-none font-normal"/> :
                    <input type="text" value={config[key]||''} onChange={e=>setConfig({...config,[key]:e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-clay bg-ivory-50 focus:bg-white outline-none font-normal"/>}
                </label>)}
              </div>
            </div>

            {/* KHU VỰC 2: THANH THÔNG BÁO ĐẦU TRANG */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 pb-1 border-b border-clay/60">
                <Sliders className="w-4 h-4 text-botanical" />
                <h3 className="font-serif font-bold text-sm sm:text-base text-botanical">
                  2. Thanh Thông Báo Đầu Trang (Announcement Bar)
                </h3>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-charcoal">
                  Dòng chữ chạy thông báo ưu đãi / vận chuyển
                </label>
                <input
                  type="text"
                  value={config.announcementText || ''}
                  onChange={(e) => setConfig({ ...config, announcementText: e.target.value })}
                  placeholder="Tinh dầu thiên nhiên nguyên chất 100% • Miễn phí vận chuyển toàn quốc cho đơn hàng từ 499.000đ"
                  className="w-full px-4 py-2.5 rounded-xl border border-clay bg-ivory-50 focus:bg-white outline-none"
                />
              </div>
            </div>

            {/* KHU VỰC 3: THÔNG TIN LIÊN HỆ & TƯ VẤN */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 pb-1 border-b border-clay/60">
                <Phone className="w-4 h-4 text-botanical" />
                <h3 className="font-serif font-bold text-sm sm:text-base text-botanical">
                  3. Kênh Tư Vấn & Liên Hệ Trực Tiếp (Bong Bóng Nổi & Footer)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-charcoal">Hotline tư vấn hiển thị</label>
                  <input
                    type="text"
                    value={config.hotline || ''}
                    onChange={(e) => setConfig({ ...config, hotline: e.target.value })}
                    placeholder="0968 123 456"
                    className="w-full px-4 py-2.5 rounded-xl border border-clay bg-ivory-50 focus:bg-white outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-charcoal">Số Zalo đặt hàng & tư vấn</label>
                  <input
                    type="text"
                    value={config.zalo || ''}
                    onChange={(e) => setConfig({ ...config, zalo: e.target.value })}
                    placeholder="0968123456"
                    className="w-full px-4 py-2.5 rounded-xl border border-clay bg-ivory-50 focus:bg-white outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-charcoal">Telegram Username (không dấu @)</label>
                  <input
                    type="text"
                    value={config.telegram || ''}
                    onChange={(e) => setConfig({ ...config, telegram: e.target.value })}
                    placeholder="nammochuong_support"
                    className="w-full px-4 py-2.5 rounded-xl border border-clay bg-ivory-50 focus:bg-white outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-charcoal">Email liên hệ hỗ trợ</label>
                  <input
                    type="email"
                    value={config.email || ''}
                    onChange={(e) => setConfig({ ...config, email: e.target.value })}
                    placeholder="hello@nammochuong.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-clay bg-ivory-50 focus:bg-white outline-none"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-semibold text-charcoal">Địa chỉ Showroom / Phòng trưng bày</label>
                  <input
                    type="text"
                    value={config.address || ''}
                    onChange={(e) => setConfig({ ...config, address: e.target.value })}
                    placeholder="Số 123 Đường Hoa Sen, Hà Nội"
                    className="w-full px-4 py-2.5 rounded-xl border border-clay bg-ivory-50 focus:bg-white outline-none"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-semibold text-charcoal">Địa chỉ Xưởng chưng cất dược liệu</label>
                  <input
                    type="text"
                    value={config.distilleryAddress || ''}
                    onChange={(e) => setConfig({ ...config, distilleryAddress: e.target.value })}
                    placeholder="Xưởng chưng cất: Xã Lộc Tân, Huyện Bảo Lâm, Tỉnh Lâm Đồng"
                    className="w-full px-4 py-2.5 rounded-xl border border-clay bg-ivory-50 focus:bg-white outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="pb-1 border-b border-clay/60"><h3 className="font-serif font-bold text-sm sm:text-base text-botanical">Tài khoản nhận chuyển khoản VietQR</h3></div>
              <p className="text-charcoal/70">Mặc định là ACB. Chuyển khoản chỉ hiện ở trang thanh toán khi đã nhập đủ số tài khoản và tên chủ tài khoản.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="space-y-1"><span className="font-semibold">Ngân hàng</span><input value={config.bankName || ''} onChange={e=>setConfig({...config,bankName:e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-clay bg-ivory-50" placeholder="ACB" /></label>
                <label className="space-y-1"><span className="font-semibold">Mã BIN ngân hàng</span><input inputMode="numeric" maxLength={6} value={config.bankBin || ''} onChange={e=>setConfig({...config,bankBin:e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-clay bg-ivory-50" placeholder="970416" /></label>
                <label className="space-y-1"><span className="font-semibold">Số tài khoản</span><input value={config.bankAccountNo || ''} onChange={e=>setConfig({...config,bankAccountNo:e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-clay bg-ivory-50" placeholder="Nhập số tài khoản thật" /></label>
                <label className="space-y-1"><span className="font-semibold">Tên chủ tài khoản</span><input value={config.bankAccountName || ''} onChange={e=>setConfig({...config,bankAccountName:e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-clay bg-ivory-50" placeholder="Tên trên tài khoản ngân hàng" /></label>
              </div>
            </div>

            {/* KHU VỰC 4: CHÍNH SÁCH VẬN CHUYỂN & SEO */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 pb-1 border-b border-clay/60">
                <Package className="w-4 h-4 text-botanical" />
                <h3 className="font-serif font-bold text-sm sm:text-base text-botanical">
                  4. Chính Sách Vận Chuyển & Cấu Hình SEO
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-charcoal">Đơn hàng tối thiểu miễn phí vận chuyển (VNĐ)</label>
                  <input
                    type="number"
                    value={config.freeShippingThreshold || 499000}
                    onChange={(e) => setConfig({ ...config, freeShippingThreshold: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl border border-clay bg-ivory-50 focus:bg-white outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-charcoal">Phí vận chuyển tiêu chuẩn toàn quốc (VNĐ)</label>
                  <input
                    type="number"
                    value={config.standardShippingFee || 30000}
                    onChange={(e) => setConfig({ ...config, standardShippingFee: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl border border-clay bg-ivory-50 focus:bg-white outline-none"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-semibold text-charcoal">Tiêu đề SEO website (Meta Title)</label>
                  <input
                    type="text"
                    value={config.seoTitle || ''}
                    onChange={(e) => setConfig({ ...config, seoTitle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-clay bg-ivory-50 focus:bg-white outline-none"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-semibold text-charcoal">Mô tả SEO website (Meta Description)</label>
                  <textarea
                    rows={2}
                    value={config.seoDescription || ''}
                    onChange={(e) => setConfig({ ...config, seoDescription: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-clay bg-ivory-50 focus:bg-white outline-none leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-clay">
              <button
                type="submit"
                disabled={savingConfig}
                className="w-full bg-botanical hover:bg-botanical-dark text-ivory py-4 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
              >
                <Save className="w-4 h-4 text-gold" />
                <span>
                  {savingConfig ? 'Đang xuất bản toàn bộ nội dung...' : 'Xuất Bản Thay Đổi Toàn Hệ Thống (Publish)'}
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
