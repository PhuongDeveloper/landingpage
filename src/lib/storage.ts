import fs from 'fs';
import path from 'path';
import { Product, Order, Article, SiteConfig } from '@/types';
import { initialProducts, initialArticles, initialSiteConfig } from '@/data/initialData';
import { supabase, isSupabaseConfigured } from './supabaseClient';

interface StoreData {
  products: Product[];
  orders: Order[];
  articles: Article[];
  config: SiteConfig;
}

const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

// Khởi tạo thư mục và file lưu trữ nếu chưa có
function ensureLocalStore(): StoreData {
  if (typeof window !== 'undefined') {
    return {
      products: initialProducts,
      orders: [],
      articles: initialArticles,
      config: initialSiteConfig,
    };
  }

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(DATA_FILE)) {
      const initialData: StoreData = {
        products: initialProducts,
        orders: [],
        articles: initialArticles,
        config: initialSiteConfig,
      };
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
      return initialData;
    }

    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error accessing local store, using in-memory fallback:', err);
    return {
      products: initialProducts,
      orders: [],
      articles: initialArticles,
      config: initialSiteConfig,
    };
  }
}

function writeLocalStore(data: StoreData) {
  if (typeof window !== 'undefined') return;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to local store:', err);
  }
}

// ---------------- PRODUCTS ----------------
export async function getProducts(): Promise<Product[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('products').select('*');
      if (!error && data && data.length > 0) {
        return data.map((item) => ({
          ...item,
          categoryName: item.category_name,
          extractionMethod: item.extraction_method,
          isFeatured: item.is_featured,
          isNew: item.is_new,
          reviewCount: item.review_count,
        }));
      }
    } catch (e) {
      console.warn('Supabase fetch failed, falling back to local store:', e);
    }
  }

  const store = ensureLocalStore();
  return store.products;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.slug === slug) || null;
}

export async function saveProduct(product: Product): Promise<Product> {
  const store = ensureLocalStore();
  const index = store.products.findIndex((p) => p.id === product.id);
  if (index >= 0) {
    store.products[index] = product;
  } else {
    store.products.push(product);
  }
  writeLocalStore(store);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('products').upsert({
        id: product.id,
        name: product.name,
        slug: product.slug,
        category: product.category,
        category_name: product.categoryName,
        subtitle: product.subtitle,
        description: product.description,
        story: product.story,
        origin: product.origin,
        extraction_method: product.extractionMethod,
        image: product.image,
        gallery: product.gallery,
        variants: product.variants,
        notes: product.notes,
        benefits: product.benefits,
        ritual_guide: product.ritualGuide,
        is_featured: product.isFeatured,
        is_new: product.isNew,
        rating: product.rating,
        review_count: product.reviewCount,
      });
    } catch (e) {
      console.error('Supabase product upsert failed:', e);
    }
  }

  return product;
}

// ---------------- ORDERS ----------------
export async function getOrders(): Promise<Order[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        return data.map((o) => ({
          id: o.id,
          orderCode: o.order_code,
          createdAt: o.created_at,
          customerName: o.customer_name,
          customerPhone: o.customer_phone,
          customerEmail: o.customer_email,
          shippingAddress: o.shipping_address,
          note: o.note,
          items: o.items,
          subtotal: Number(o.subtotal),
          shippingFee: Number(o.shipping_fee),
          total: Number(o.total),
          status: o.status,
          paymentMethod: o.payment_method,
        }));
      }
    } catch (e) {
      console.warn('Supabase orders fetch failed:', e);
    }
  }

  const store = ensureLocalStore();
  return store.orders.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getOrderByCode(code: string): Promise<Order | null> {
  const orders = await getOrders();
  return orders.find((o) => o.orderCode === code) || null;
}

export async function createOrder(order: Order): Promise<Order> {
  const store = ensureLocalStore();
  store.orders.unshift(order);
  writeLocalStore(store);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('orders').insert({
        id: order.id,
        order_code: order.orderCode,
        customer_name: order.customerName,
        customer_phone: order.customerPhone,
        customer_email: order.customerEmail,
        shipping_address: order.shippingAddress,
        note: order.note,
        items: order.items,
        subtotal: order.subtotal,
        shipping_fee: order.shippingFee,
        total: order.total,
        status: order.status,
        payment_method: order.paymentMethod,
        created_at: order.createdAt,
      });
    } catch (e) {
      console.error('Supabase order insert failed:', e);
    }
  }

  return order;
}

export async function updateOrderStatus(orderCode: string, status: Order['status']): Promise<boolean> {
  const store = ensureLocalStore();
  const order = store.orders.find((o) => o.orderCode === orderCode);
  if (order) {
    order.status = status;
    writeLocalStore(store);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('orders')
          .update({ status })
          .eq('order_code', orderCode);
      } catch (e) {
        console.error('Supabase order status update failed:', e);
      }
    }
    return true;
  }
  return false;
}

// ---------------- SITE CONFIG ----------------
export async function getSiteConfig(): Promise<SiteConfig> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('site_config')
        .select('data')
        .eq('id', 'main')
        .single();
      if (!error && data?.data) {
        return data.data;
      }
    } catch (e) {
      console.warn('Supabase site_config fetch failed:', e);
    }
  }

  const store = ensureLocalStore();
  return store.config || initialSiteConfig;
}

export async function saveSiteConfig(config: SiteConfig): Promise<SiteConfig> {
  const store = ensureLocalStore();
  store.config = config;
  writeLocalStore(store);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('site_config').upsert({
        id: 'main',
        data: config,
        updated_at: new Date().toISOString(),
      });
    } catch (e) {
      console.error('Supabase site_config save failed:', e);
    }
  }

  return config;
}

// ---------------- ARTICLES ----------------
export async function getArticles(): Promise<Article[]> {
  const store = ensureLocalStore();
  return store.articles;
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const articles = await getArticles();
  return articles.find((a) => a.slug === slug) || null;
}
