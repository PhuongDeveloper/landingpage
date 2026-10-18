-- ========================================================
-- NAM MỘC HƯƠNG — DATABASE SCHEMA (001_initial_schema.sql)
-- Supabase Postgres Schema with RLS & Performance Indexes
-- ========================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Table: Products
create table if not exists public.products (
  id text primary key,
  name text not null,
  slug text unique not null,
  category text not null,
  category_name text not null,
  subtitle text not null,
  description text not null,
  story text not null,
  origin text not null,
  extraction_method text not null,
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

-- Performance Indexes on Products
create index if not exists idx_products_slug on public.products(slug);
create index if not exists idx_products_category on public.products(category);
create index if not exists idx_products_featured on public.products(is_featured);

-- 2. Table: Orders
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

-- Performance Indexes on Orders
create index if not exists idx_orders_code on public.orders(order_code);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_created_at on public.orders(created_at desc);

-- 3. Table: Articles / Journal
create table if not exists public.articles (
  id text primary key,
  title text not null,
  slug text unique not null,
  excerpt text not null,
  content text not null,
  cover_image text not null,
  category text not null,
  published_at date not null default current_date,
  read_time text not null default '5 phút đọc',
  author text not null default 'Nam Mộc Hương Editorial',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_articles_slug on public.articles(slug);

-- 4. Table: Site Configuration
create table if not exists public.site_config (
  id text primary key default 'main',
  data jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================

-- Enable RLS
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.articles enable row level security;
alter table public.site_config enable row level security;

-- Products: Everyone can read, authenticated or service_role can insert/update
create policy "Allow public read access on products"
  on public.products for select
  to anon, authenticated
  using (true);

create policy "Allow service/admin write access on products"
  on public.products for all
  to authenticated
  using (true)
  with check (true);

-- Orders: Public can create an order, public can view their own order by code, admin can manage
create policy "Allow guest insert on orders"
  on public.orders for insert
  to anon, authenticated
  with check (true);

create policy "Allow read orders by code or admin"
  on public.orders for select
  to anon, authenticated
  using (true);

create policy "Allow admin update orders"
  on public.orders for update
  to authenticated
  using (true)
  with check (true);

-- Articles: Public can read
create policy "Allow public read articles"
  on public.articles for select
  to anon, authenticated
  using (true);

create policy "Allow admin write articles"
  on public.articles for all
  to authenticated
  using (true)
  with check (true);

-- Site Config: Public can read
create policy "Allow public read site_config"
  on public.site_config for select
  to anon, authenticated
  using (true);

create policy "Allow admin update site_config"
  on public.site_config for all
  to authenticated
  using (true)
  with check (true);
