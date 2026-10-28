-- ====================================================================
-- NAM MỘC HƯƠNG — TOÀN BỘ CẤU TRÚC DATABASE SUPABASE POSTGRESQL
-- File duy nhất: supabase_setup.sql
-- Hướng dẫn: Copy toàn bộ nội dung file này dán vào SQL Editor của Supabase và bấm "RUN"
-- ====================================================================

-- 1. BẬT EXTENSION UUID
create extension if not exists "uuid-ossp";

-- 2. BẢNG DANH MỤC SẢN PHẨM (CATEGORIES)
create table if not exists public.categories (
  id text primary key,
  name text not null,
  slug text unique not null,
  subtitle text not null default '',
  image text not null default '',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. BẢNG SẢN PHẨM (PRODUCTS)
create table if not exists public.products (
  id text primary key,
  name text not null,
  slug text unique not null,
  category text not null,
  category_name text not null,
  subtitle text not null,
  description text not null,
  story text not null default '',
  origin text not null default 'Việt Nam',
  extraction_method text not null default 'Chưng cất lôi cuốn hơi nước',
  image text not null,
  gallery jsonb not null default '[]'::jsonb,
  variants jsonb not null default '[]'::jsonb,
  notes jsonb not null default '{}'::jsonb,
  benefits jsonb not null default '[]'::jsonb,
  ritual_guide jsonb not null default '[]'::jsonb,
  is_featured boolean not null default false,
  is_new boolean not null default false,
  rating numeric(3,2) not null default 5.0,
  review_count integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index cho Products
create index if not exists idx_products_slug on public.products(slug);
create index if not exists idx_products_category on public.products(category);
create index if not exists idx_products_featured on public.products(is_featured);

-- 4. BẢNG ĐƠN HÀNG (ORDERS)
create table if not exists public.orders (
  id uuid default uuid_generate_v4() primary key,
  order_code text unique not null,
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  shipping_address text not null,
  note text,
  items jsonb not null default '[]'::jsonb,
  subtotal numeric(12,2) not null,
  shipping_fee numeric(12,2) not null default 0,
  total numeric(12,2) not null,
  status text not null default 'pending',
  payment_method text not null default 'cod',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index cho Orders
create index if not exists idx_orders_code on public.orders(order_code);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_created_at on public.orders(created_at desc);

-- 5. BẢNG DATA KHÁCH HÀNG TƯ VẤN (LEADS)
create table if not exists public.leads (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  phone text not null,
  email text,
  interest text not null default 'Tư vấn mùi hương',
  message text,
  status text not null default 'new',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_leads_created_at on public.leads(created_at desc);

-- 6. BẢNG BÀI VIẾT (ARTICLES / JOURNAL)
create table if not exists public.articles (
  id text primary key,
  title text not null,
  slug text unique not null,
  excerpt text not null,
  content text not null,
  cover_image text not null,
  category text not null,
  published_at date not null default current_date,
  read_time text not null default '4 phút đọc',
  author text not null default 'Nam Mộc Hương Editorial',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_articles_slug on public.articles(slug);

-- 7. BẢNG CẤU HÌNH THƯƠNG HIỆU & WEBSITE (SITE_CONFIG)
create table if not exists public.site_config (
  id text primary key default 'main',
  data jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.leads enable row level security;
alter table public.articles enable row level security;
alter table public.site_config enable row level security;

-- Categories RLS

-- Products RLS

-- Orders RLS

-- Leads RLS

-- Articles RLS

-- Site Config RLS
-- All public access remains denied. The Next.js server uses a server-only key.

-- Dữ liệu mẫu không được tự nạp vào database đang vận hành.
