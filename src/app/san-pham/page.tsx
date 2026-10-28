import Link from 'next/link';
import type { Metadata } from 'next';
import { getProducts, getCategories, getSiteConfig } from '@/lib/storage';
import ProductCard from '@/components/product/ProductCard';

export const metadata: Metadata = { title: 'Sản phẩm', description: 'Bộ sưu tập tinh dầu Nam Mộc Hương.' };
export const dynamic = 'force-dynamic';

export default async function ProductsPage({ searchParams }: { searchParams: { category?: string } }) {
  const [products, categories, config] = await Promise.all([getProducts(), getCategories(), getSiteConfig()]);
  const selected = categories.find(c => c.slug === searchParams.category);
  const shown = selected ? products.filter(p => p.category === selected.slug) : products;
  return <main className="studio-catalog">
    <header className="studio-catalog-header">
      <div><span className="studio-kicker">{config.homeProductLabel}</span><h1>{selected?.name || config.homeProductTitle}</h1>{selected?.subtitle && <p>{selected.subtitle}</p>}</div>
      <span className="studio-catalog-count">{shown.length} sản phẩm</span>
    </header>
    <nav className="studio-catalog-filters" aria-label="Danh mục sản phẩm">
      <Link href="/san-pham" aria-current={!selected ? 'page' : undefined}>Tất cả <span>{products.length}</span></Link>
      {categories.map(c => <Link key={c.id} href={`/san-pham?category=${encodeURIComponent(c.slug)}`} aria-current={selected?.slug === c.slug ? 'page' : undefined}>{c.name} <span>{products.filter(p => p.category === c.slug).length}</span></Link>)}
    </nav>
    {shown.length ? <div className="studio-listing-grid">{shown.map(p => <ProductCard key={p.id} product={p} />)}</div> : <p className="studio-catalog-empty">Chưa có sản phẩm trong danh mục này.</p>}
  </main>;
}
