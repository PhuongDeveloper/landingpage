-- Run once in Supabase SQL Editor for the existing live project.
-- Public storefront data is read by the Next.js server using a server-only key.
-- Orders and leads contain customer data and must not be accessible through the public Data API.
begin;

drop policy if exists "Allow public read categories" on public.categories;
drop policy if exists "Allow manage categories" on public.categories;
drop policy if exists "Allow public read products" on public.products;
drop policy if exists "Allow manage products" on public.products;
drop policy if exists "Allow guest create orders" on public.orders;
drop policy if exists "Allow read orders" on public.orders;
drop policy if exists "Allow update orders" on public.orders;
drop policy if exists "Allow read and manage leads" on public.leads;
drop policy if exists "Allow guest submit lead" on public.leads;
drop policy if exists "Allow public read articles" on public.articles;
drop policy if exists "Allow manage articles" on public.articles;
drop policy if exists "Allow public read site_config" on public.site_config;
drop policy if exists "Allow update site_config" on public.site_config;

-- Also remove the older migration's policy names, if that migration ran.
drop policy if exists "Allow public read access on products" on public.products;
drop policy if exists "Allow service/admin write access on products" on public.products;
drop policy if exists "Allow guest insert on orders" on public.orders;
drop policy if exists "Allow read orders by code or admin" on public.orders;
drop policy if exists "Allow admin update orders" on public.orders;
drop policy if exists "Allow public read articles" on public.articles;
drop policy if exists "Allow admin write articles" on public.articles;
drop policy if exists "Allow public read site_config" on public.site_config;
drop policy if exists "Allow admin update site_config" on public.site_config;

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.leads enable row level security;
alter table public.articles enable row level security;
alter table public.site_config enable row level security;

revoke all on public.categories, public.products, public.orders, public.leads, public.articles, public.site_config from anon, authenticated;
commit;
