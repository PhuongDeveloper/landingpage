export type ProductCapacity = '10ml' | '30ml' | '50ml' | '100ml';

export interface ProductVariant {
  capacity: ProductCapacity;
  price: number;
  salePrice?: number;
  stock: number;
  sku: string;
}

export interface FragranceNotes {
  top: string;      // Hương đầu (ví dụ: Vỏ bưởi, Cam ngọt, Sả chanh)
  middle: string;   // Hương giữa (ví dụ: Hoa lài, Hoa mộc, Phong lữ)
  base: string;     // Hương cuối (ví dụ: Trầm hương, Gỗ tuyết tùng, Hổ phách)
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: 'don-huong' | 'phoi-huong' | 'xong-phong' | 'massage';
  categoryName: string;
  subtitle: string;
  description: string;
  story: string;
  origin: string; // Nguồn gốc nguyên liệu (ví dụ: Hà Giang, Quảng Nam)
  extractionMethod: string; // Phương pháp chiết xuất (ví dụ: Chưng cất lôi cuốn hơi nước)
  image: string;
  gallery: string[];
  variants: ProductVariant[];
  notes: FragranceNotes;
  benefits: string[];
  ritualGuide: string[];
  isFeatured?: boolean;
  isNew?: boolean;
  rating: number;
  reviewCount: number;
}

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  image: string;
  capacity: ProductCapacity;
  price: number;
  quantity: number;
}

export type OrderStatus = 'pending' | 'processing' | 'shipping' | 'completed' | 'cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  capacity: ProductCapacity;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  orderCode: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: string;
  note?: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  status: OrderStatus;
  paymentMethod: 'cod' | 'bank_transfer';
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  publishedAt: string;
  readTime: string;
  author: string;
}

export interface SiteConfig {
  siteName: string;
  brandTagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroCtaText: string;
  heroCtaLink: string;
  announcementText: string;
  hotline: string;
  zalo: string;
  email: string;
  address: string;
  distilleryAddress: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
}
