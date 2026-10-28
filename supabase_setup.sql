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
create policy "Allow public read categories" on public.categories for select to anon, authenticated using (true);
create policy "Allow manage categories" on public.categories for all to anon, authenticated using (true) with check (true);

-- Products RLS
create policy "Allow public read products" on public.products for select to anon, authenticated using (true);
create policy "Allow manage products" on public.products for all to anon, authenticated using (true) with check (true);

-- Orders RLS
create policy "Allow guest create orders" on public.orders for insert to anon, authenticated with check (true);
create policy "Allow read orders" on public.orders for select to anon, authenticated using (true);
create policy "Allow update orders" on public.orders for update to anon, authenticated using (true) with check (true);

-- Leads RLS
create policy "Allow guest submit lead" on public.leads for insert to anon, authenticated with check (true);
create policy "Allow read and manage leads" on public.leads for all to anon, authenticated using (true) with check (true);

-- Articles RLS
create policy "Allow public read articles" on public.articles for select to anon, authenticated using (true);
create policy "Allow manage articles" on public.articles for all to anon, authenticated using (true) with check (true);

-- Site Config RLS
create policy "Allow public read site_config" on public.site_config for select to anon, authenticated using (true);
create policy "Allow update site_config" on public.site_config for all to anon, authenticated using (true) with check (true);

-- ====================================================================
-- SEED DATA BAN ĐẦU THEO ĐÚNG THIẾT KẾ NAM MỘC HƯƠNG
-- ====================================================================

-- Seed Danh Mục
insert into public.categories (id, name, slug, subtitle, image)
values
  ('cat-01', 'Tinh dầu Thư giãn', 'thu-gian', 'Xua tan căng thẳng, vỗ về giấc ngủ sâu', 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80'),
  ('cat-02', 'Tinh dầu Thanh lọc', 'thanh-loc', 'Thanh sạch không khí, kháng khuẩn tự nhiên', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80'),
  ('cat-03', 'Tinh dầu Tập trung', 'tap-trung', 'Khơi nguồn cảm hứng, tăng cường tỉnh táo', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80'),
  ('cat-04', 'Tinh dầu Phong thủy', 'phong-thuy', 'Chiêu tài sinh khí, an gia vượng tài', 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&w=800&q=80')
on conflict (id) do nothing;

-- Seed Sản Phẩm Nổi Bật
insert into public.products (id, name, slug, category, category_name, subtitle, description, story, origin, extraction_method, image, variants, notes, is_featured, rating, review_count)
values
  (
    'nmh-01', 'Tinh dầu oải hương', 'tinh-dau-oai-huong', 'thu-gian', 'Tinh dầu Thư giãn',
    'Thư giãn, giảm căng thẳng',
    'Chưng cất từ những nhành hoa oải hương (Lavender) tím ngát, mang lại nốt hương thảo mộc dịu dàng, xoa dịu các cơn căng thẳng thần kinh và giúp bạn dễ dàng chìm vào giấc ngủ an lành.',
    'Mỗi bông hoa oải hương được chọn lọc kỹ càng, chưng cất ở nhiệt độ kiểm soát dưới 95°C để giữ trọn nốt hương ngọt mát đặc trưng.',
    'Đà Lạt & Cao nguyên Mộc Châu', 'Chưng cất lôi cuốn hơi nước áp suất thấp',
    'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80',
    '[{"capacity":"10ml","price":195000,"salePrice":175000,"stock":45,"sku":"NMH-OH-10"},{"capacity":"30ml","price":420000,"salePrice":380000,"stock":30,"sku":"NMH-OH-30"}]'::jsonb,
    '{"top":"Hoa oải hương tươi, Cam thảo thoang thoảng","middle":"Hương thảo mộc dịu, Cúc La Mã","base":"Gỗ mộc ấm, Xạ hương thực vật"}'::jsonb,
    true, 4.9, 168
  ),
  (
    'nmh-02', 'Tinh dầu bạc hà', 'tinh-dau-bac-ha', 'tap-trung', 'Tinh dầu Tập trung',
    'Thanh mát, tỉnh táo',
    'Chiết xuất từ lá bạc hà tươi giàu menthol tự nhiên. Nốt hương the mát bùng nổ giúp đánh thức mọi giác quan, xua tan cơn buồn ngủ và gia tăng sự tập trung cao độ.',
    'Lá bạc hà được thu hoạch vào sáng sớm tinh mơ khi còn đọng sương, chưng cất ngay trong ngày.',
    'Vùng đồi thảo mộc Lâm Đồng', 'Chưng cất lôi cuốn hơi nước truyền thống',
    'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
    '[{"capacity":"10ml","price":165000,"salePrice":145000,"stock":60,"sku":"NMH-BH-10"},{"capacity":"30ml","price":350000,"salePrice":310000,"stock":35,"sku":"NMH-BH-30"}]'::jsonb,
    '{"top":"Lá bạc hà the mát, Băng tuyết nhẹ","middle":"Cỏ non sau mưa, Khuynh diệp mát lành","base":"Nhựa cây thông dịu nhẹ"}'::jsonb,
    true, 4.8, 142
  ),
  (
    'nmh-03', 'Tinh dầu tràm trà', 'tinh-dau-tram-tra', 'thanh-loc', 'Tinh dầu Thanh lọc',
    'Làm sạch, bảo vệ',
    'Kháng khuẩn tự nhiên vượt trội. Tinh dầu tràm trà Nam Mộc Hương giúp thanh lọc bầu không khí, bảo vệ hệ hô hấp cho cả gia đình trong mùa thời tiết giao mùa.',
    'Chiết xuất từ những cành lá tràm trà hữu cơ giàu terpineol, giữ trọn đặc tính an toàn.',
    'Quảng Trị & Thừa Thiên Huế', 'Chưng cất phân đoạn hơi nước',
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    '[{"capacity":"10ml","price":180000,"salePrice":155000,"stock":50,"sku":"NMH-TT-10"},{"capacity":"30ml","price":390000,"salePrice":340000,"stock":40,"sku":"NMH-TT-30"}]'::jsonb,
    '{"top":"Lá tràm trà tươi cay nhẹ, Khí trời ban mai","middle":"Thảo mộc thanh khiết, Bạch đàn dịu","base":"Gỗ thông khô"}'::jsonb,
    true, 4.9, 95
  ),
  (
    'nmh-04', 'Tinh dầu cam ngọt', 'tinh-dau-cam-ngot', 'thanh-loc', 'Tinh dầu Thanh lọc',
    'Lan tỏa năng lượng tích cực',
    'Chưng cất từ vỏ cam mọng nắng miền sông Tiền. Hương thơm ngọt ngào, ấm áp như ánh nắng sớm, lập tức xua tan u ám và mang lại cảm giác vui vẻ, ấm cúng.',
    'Cam được trồng trên dải đất phù sa màu mỡ, thu hái thủ công và bóc vỏ trong vòng 4 giờ.',
    'Bến Tre & Vĩnh Long', 'Ép lạnh kết hợp lôi cuốn hơi nước',
    'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80',
    '[{"capacity":"10ml","price":155000,"salePrice":135000,"stock":75,"sku":"NMH-CN-10"},{"capacity":"30ml","price":320000,"salePrice":280000,"stock":45,"sku":"NMH-CN-30"}]'::jsonb,
    '{"top":"Vỏ cam ngọt mọng nước, Ánh nắng ban mai","middle":"Hoa cam thoảng nhẹ, Mật ong ngọt lành","base":"Xạ hương cỏ non"}'::jsonb,
    true, 5.0, 189
  ),
  (
    'nmh-05', 'Tinh Dầu Trầm Hương Rừng Già', 'tinh-dau-tram-huong-rung-gia', 'phong-thuy', 'Tinh dầu Phong thủy',
    'Nốt trầm cổ kính, sâu lắng, chiêu tài sinh khí',
    'Chưng cất từ mộc trầm tích tụ nhựa thơm tự nhiên qua nhiều năm tháng nơi đại ngàn xứ Quảng. Mang lại không gian uy nghiêm, trang trọng và nguồn năng lượng bình an.',
    'Nguồn trầm được canh tác bảo tồn bền vững, tôn trọng hệ sinh thái rừng.',
    'Tiên Phước, Quảng Nam', 'Chưng cất phân đoạn truyền thống chu kỳ dài 72 giờ',
    'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&w=800&q=80',
    '[{"capacity":"10ml","price":680000,"salePrice":590000,"stock":20,"sku":"NMH-TH-10"},{"capacity":"30ml","price":1550000,"stock":8,"sku":"NMH-TH-30"}]'::jsonb,
    '{"top":"Nhựa trầm thoang thoảng, Khói thông nhẹ","middle":"Gỗ cổ thụ ẩm sương, Thảo mộc khô","base":"Hổ phách tự nhiên, Đất ấm sau mưa"}'::jsonb,
    true, 5.0, 94
  )
on conflict (id) do nothing;

-- Seed Cấu Hình Website Mặc Định
insert into public.site_config (id, data)
values (
  'main',
  '{
    "siteName": "Nam Mộc Hương",
    "brandTagline": "Tinh hoa từ thiên nhiên – Cho cuộc sống an lành",
    "heroHeadline": "Lan tỏa hương thơm\\nThuần khiết từ thiên nhiên",
    "heroSubheadline": "Nam Mộc Hương – tinh hoa từ thiên nhiên, cho một cuộc sống an yên và cân bằng.",
    "heroCtaText": "Khám phá sản phẩm",
    "heroCtaLink": "#san-pham",
    "announcementText": "Tinh dầu thiên nhiên nguyên chất 100%",
    "hotline": "0968 123 456",
    "zalo": "0968123456",
    "telegram": "nammochuong_support",
    "facebook": "https://facebook.com/nammochuong",
    "email": "hello@nammochuong.com",
    "address": "Số 123 Đường Hoa Sen, Hà Nội",
    "distilleryAddress": "Xưởng chưng cất: Xã Lộc Tân, Huyện Bảo Lâm, Tỉnh Lâm Đồng",
    "freeShippingThreshold": 499000,
    "standardShippingFee": 30000,
    "seoTitle": "Nam Mộc Hương — Lan tỏa hương thơm Thuần khiết từ thiên nhiên",
    "seoDescription": "Nam Mộc Hương – tinh dầu thiên nhiên nguyên chất chưng cất từ hoa oải hương, bạc hà, tràm trà, cam ngọt và trầm hương.",
    "seoKeywords": "nam mộc hương, tinh dầu thiên nhiên, tinh dầu oải hương, tinh dầu bạc hà, tinh dầu tràm trà, tinh dầu cam ngọt"
  }'::jsonb
)
on conflict (id) do nothing;
