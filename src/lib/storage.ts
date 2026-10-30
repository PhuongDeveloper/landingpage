import fs from 'fs';
import path from 'path';
import { Product, Order, Article, SiteConfig, CategoryItem, Lead } from '@/types';
import {
  initialProducts,
  initialArticles,
  initialSiteConfig,
  initialCategories,
} from '@/data/initialData';
import { supabase, isSupabaseConfigured } from './supabaseClient';

interface StoreData {
  products: Product[];
  categories: CategoryItem[];
  orders: Order[];
  leads: Lead[];
  articles: Article[];
  config: SiteConfig;
}

const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

// In-memory store singleton: acts as primary runtime source of truth.
// Eliminates disk race conditions, EBUSY Windows file-locking on concurrent requests,
// and ensures deleted products/categories/leads/orders NEVER get resurrected by fallback reads.
let memoryStore: StoreData | null = null;

function ensureLocalStore(): StoreData {
  if (memoryStore) {
    return memoryStore;
  }

  if (typeof window !== 'undefined') {
    memoryStore = {
      products: [],
      categories: [],
      orders: [],
      leads: [],
      articles: [],
      config: initialSiteConfig,
    };
    return memoryStore;
  }

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(DATA_FILE)) {
      const initialData: StoreData = {
        products: [...initialProducts],
        categories: [...initialCategories],
        orders: [],
        leads: [],
        articles: [...initialArticles],
        config: { ...initialSiteConfig },
      };
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
      memoryStore = initialData;
      return memoryStore;
    }

    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    memoryStore = {
      products: Array.isArray(parsed.products) ? parsed.products : [],
      categories: Array.isArray(parsed.categories) ? parsed.categories : [],
      orders: Array.isArray(parsed.orders) ? parsed.orders : [],
      leads: Array.isArray(parsed.leads) ? parsed.leads : [],
      articles: Array.isArray(parsed.articles) ? parsed.articles : [],
      config: parsed.config || { ...initialSiteConfig },
    };
    return memoryStore;
  } catch (err) {
    console.error('Error reading local store from disk:', err);
    if (!memoryStore) {
      memoryStore = {
        products: [...initialProducts],
        categories: [...initialCategories],
        orders: [],
        leads: [],
        articles: [...initialArticles],
        config: { ...initialSiteConfig },
      };
    }
    return memoryStore;
  }
}

function commitLocalStore(data: StoreData) {
  memoryStore = data;
  if (typeof window !== 'undefined') return;

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing local store to disk:', err);
  }
}

// ---------------- CATEGORIES ----------------
export async function getCategories(): Promise<CategoryItem[]> {
  const store = ensureLocalStore();
  return Array.isArray(store.categories) ? store.categories : [];
}

export async function saveCategory(category: CategoryItem): Promise<CategoryItem> {
  const store = ensureLocalStore();
  if (!Array.isArray(store.categories)) store.categories = [];

  const cleanId = String(category.id).trim().toLowerCase();
  const cleanSlug = String(category.slug).trim().toLowerCase();

  const index = store.categories.findIndex((c) => {
    const cId = c.id ? String(c.id).trim().toLowerCase() : '';
    const cSlug = c.slug ? String(c.slug).trim().toLowerCase() : '';
    return cId === cleanId || cSlug === cleanSlug;
  });

  if (index >= 0) {
    store.categories[index] = category;
  } else {
    store.categories.push(category);
  }
  commitLocalStore(store);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('categories').upsert({
        id: category.id,
        name: category.name,
        slug: category.slug,
        subtitle: category.subtitle,
        image: category.image,
      });
    } catch (e) {
      console.error('Supabase category upsert failed:', e);
    }
  }

  return category;
}

export async function deleteCategory(idOrSlug: string): Promise<boolean> {
  const cleanTarget = decodeURIComponent(idOrSlug).trim().toLowerCase();
  const store = ensureLocalStore();
  if (!Array.isArray(store.categories)) return false;

  store.categories = store.categories.filter((c) => {
    const cId = c.id ? String(c.id).trim().toLowerCase() : '';
    const cSlug = c.slug ? String(c.slug).trim().toLowerCase() : '';
    return cId !== cleanTarget && cSlug !== cleanTarget;
  });
  commitLocalStore(store);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('categories').delete().or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`);
    } catch (e) {
      console.error('Supabase category delete failed:', e);
    }
  }

  return true;
}

// ---------------- PRODUCTS ----------------
export async function getProducts(): Promise<Product[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('products').select('*');
      if (!error && data) {
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
  return Array.isArray(store.products) ? store.products : [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts();
  const cleanSlug = decodeURIComponent(slug).trim().toLowerCase();
  return (
    products.find((p) => {
      const pSlug = p.slug ? String(p.slug).trim().toLowerCase() : '';
      const pId = p.id ? String(p.id).trim().toLowerCase() : '';
      return pSlug === cleanSlug || pId === cleanSlug;
    }) || null
  );
}

export async function saveProduct(product: Product): Promise<Product> {
  const store = ensureLocalStore();
  if (!Array.isArray(store.products)) store.products = [];

  const cleanId = String(product.id).trim().toLowerCase();
  const cleanSlug = String(product.slug).trim().toLowerCase();

  const index = store.products.findIndex((p) => {
    const pId = p.id ? String(p.id).trim().toLowerCase() : '';
    const pSlug = p.slug ? String(p.slug).trim().toLowerCase() : '';
    return pId === cleanId || pSlug === cleanSlug;
  });

  if (index >= 0) {
    store.products[index] = product;
  } else {
    store.products.push(product);
  }
  commitLocalStore(store);

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

export async function deleteProduct(productIdOrSlug: string): Promise<boolean> {
  const cleanTarget = decodeURIComponent(productIdOrSlug).trim().toLowerCase();
  const store = ensureLocalStore();
  if (!Array.isArray(store.products)) return false;

  store.products = store.products.filter((p) => {
    const pId = p.id ? String(p.id).trim().toLowerCase() : '';
    const pSlug = p.slug ? String(p.slug).trim().toLowerCase() : '';
    return pId !== cleanTarget && pSlug !== cleanTarget;
  });
  commitLocalStore(store);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from('products')
        .delete()
        .or(`id.eq.${productIdOrSlug},slug.eq.${productIdOrSlug}`);
    } catch (e) {
      console.error('Supabase product delete failed:', e);
    }
  }

  return true;
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
  const orders = Array.isArray(store.orders) ? store.orders : [];
  return orders.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getOrderByCode(code: string): Promise<Order | null> {
  const orders = await getOrders();
  const clean = decodeURIComponent(code).trim().toLowerCase();
  return (
    orders.find((o) => {
      const oCode = o.orderCode ? String(o.orderCode).trim().toLowerCase() : '';
      const oId = o.id ? String(o.id).trim().toLowerCase() : '';
      return oCode === clean || oId === clean;
    }) || null
  );
}

export async function createOrder(order: Order): Promise<Order> {
  const store = ensureLocalStore();
  if (!Array.isArray(store.orders)) store.orders = [];
  store.orders.unshift(order);
  commitLocalStore(store);

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
  if (!Array.isArray(store.orders)) return false;
  const cleanCode = decodeURIComponent(orderCode).trim().toLowerCase();

  const order = store.orders.find((o) => {
    const oCode = o.orderCode ? String(o.orderCode).trim().toLowerCase() : '';
    const oId = o.id ? String(o.id).trim().toLowerCase() : '';
    return oCode === cleanCode || oId === cleanCode;
  });

  if (order) {
    order.status = status;
    commitLocalStore(store);

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

export async function deleteOrder(idOrCode: string): Promise<boolean> {
  const cleanTarget = decodeURIComponent(idOrCode).trim().toLowerCase();
  const store = ensureLocalStore();
  if (!Array.isArray(store.orders)) return false;

  store.orders = store.orders.filter((o) => {
    const oId = o.id ? String(o.id).trim().toLowerCase() : '';
    const oCode = o.orderCode ? String(o.orderCode).trim().toLowerCase() : '';
    return oId !== cleanTarget && oCode !== cleanTarget;
  });
  commitLocalStore(store);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('orders').delete().or(`id.eq.${idOrCode},order_code.eq.${idOrCode}`);
    } catch (e) {
      console.error('Supabase order delete failed:', e);
    }
  }

  return true;
}

// ---------------- LEADS / CUSTOMER DATA ----------------
export async function getLeads(): Promise<Lead[]> {
  const store = ensureLocalStore();
  const leads = Array.isArray(store.leads) ? store.leads : [];
  return leads.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function createLead(lead: Lead): Promise<Lead> {
  const store = ensureLocalStore();
  if (!Array.isArray(store.leads)) store.leads = [];
  store.leads.unshift(lead);
  commitLocalStore(store);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('leads').insert({
        id: lead.id,
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
        interest: lead.interest,
        message: lead.message,
        status: lead.status,
        created_at: lead.createdAt,
      });
    } catch (e) {
      console.error('Supabase lead insert failed:', e);
    }
  }

  return lead;
}

export async function updateLeadStatus(id: string, status: Lead['status']): Promise<boolean> {
  const store = ensureLocalStore();
  if (!Array.isArray(store.leads)) return false;
  const cleanId = decodeURIComponent(id).trim().toLowerCase();

  const lead = store.leads.find((l) => {
    const lId = l.id ? String(l.id).trim().toLowerCase() : '';
    return lId === cleanId;
  });

  if (lead) {
    lead.status = status;
    commitLocalStore(store);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('leads').update({ status }).eq('id', id);
      } catch (e) {
        console.error('Supabase lead update failed:', e);
      }
    }
    return true;
  }
  return false;
}

export async function deleteLead(id: string): Promise<boolean> {
  const cleanTarget = decodeURIComponent(id).trim().toLowerCase();
  const store = ensureLocalStore();
  if (!Array.isArray(store.leads)) return false;

  store.leads = store.leads.filter((l) => {
    const lId = l.id ? String(l.id).trim().toLowerCase() : '';
    return lId !== cleanTarget;
  });
  commitLocalStore(store);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('leads').delete().eq('id', id);
    } catch (e) {
      console.error('Supabase lead delete failed:', e);
    }
  }

  return true;
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
  commitLocalStore(store);

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
  return Array.isArray(store.articles) ? store.articles : [];
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const articles = await getArticles();
  const clean = decodeURIComponent(slug).trim().toLowerCase();
  return (
    articles.find((a) => {
      const aSlug = a.slug ? String(a.slug).trim().toLowerCase() : '';
      const aId = a.id ? String(a.id).trim().toLowerCase() : '';
      return aSlug === clean || aId === clean;
    }) || null
  );
}

export async function saveArticle(article: Article): Promise<Article> {
  const store = ensureLocalStore();
  if (!Array.isArray(store.articles)) store.articles = [];

  const cleanId = String(article.id).trim().toLowerCase();
  const cleanSlug = String(article.slug).trim().toLowerCase();

  const index = store.articles.findIndex((a) => {
    const aId = a.id ? String(a.id).trim().toLowerCase() : '';
    const aSlug = a.slug ? String(a.slug).trim().toLowerCase() : '';
    return aId === cleanId || aSlug === cleanSlug;
  });

  if (index >= 0) {
    store.articles[index] = article;
  } else {
    store.articles.unshift(article);
  }
  commitLocalStore(store);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('articles').upsert({
        id: article.id,
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        cover_image: article.coverImage,
        category: article.category,
        published_at: article.publishedAt,
        read_time: article.readTime,
        author: article.author,
      });
    } catch (e) {
      console.error('Supabase article upsert failed:', e);
    }
  }

  return article;
}

export async function deleteArticle(idOrSlug: string): Promise<boolean> {
  const cleanTarget = decodeURIComponent(idOrSlug).trim().toLowerCase();
  const store = ensureLocalStore();
  if (!Array.isArray(store.articles)) return false;

  store.articles = store.articles.filter((a) => {
    const aId = a.id ? String(a.id).trim().toLowerCase() : '';
    const aSlug = a.slug ? String(a.slug).trim().toLowerCase() : '';
    return aId !== cleanTarget && aSlug !== cleanTarget;
  });
  commitLocalStore(store);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('articles').delete().or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`);
    } catch (e) {
      console.error('Supabase article delete failed:', e);
    }
  }

  return true;
}
