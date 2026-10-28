import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { getProductBySlug, getProducts, getSiteConfig } from '@/lib/storage';
import ProductDetailClient from './ProductDetailClient';
import ProductCard from '@/components/product/ProductCard';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    return { title: 'Sản phẩm không tìm thấy' };
  }

  return {
    title: `${product.name} — ${product.categoryName}`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.image }],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    notFound();
  }

  const [allProducts, config] = await Promise.all([getProducts(), getSiteConfig()]);
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  const lowestPrice = product.variants.length ? Math.min(...product.variants.map((v) => v.salePrice || v.price)) : 0;
  const highestPrice = product.variants.length ? Math.max(...product.variants.map((v) => v.price)) : 0;

  // JSON-LD Structured Data Schema cho Product
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: [product.image, ...product.gallery],
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: config.siteName,
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'VND',
      lowPrice: lowestPrice,
      highPrice: highestPrice,
      offerCount: product.variants.length,
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <main className="studio-detail-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema).replace(/</g, '\\u003c') }}
      />

      <div className="studio-detail-wrap">
        <nav className="studio-detail-breadcrumb"><Link href="/">Trang chủ</Link><span>/</span><Link href="/san-pham">Sản phẩm</Link><span>/</span><span>{product.name}</span></nav>
        <ProductDetailClient product={product} />
        {relatedProducts.length > 0 && (
          <section className="studio-detail-related"><div className="studio-section-heading studio-section-heading-row"><div><span className="studio-kicker">{product.categoryName}</span><h2>Sản phẩm liên quan</h2></div><Link className="studio-text-link" href={`/san-pham?category=${encodeURIComponent(product.category)}`}>Xem danh mục →</Link></div><div className="studio-listing-grid">{relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}</div></section>
        )}
      </div>
    </main>
  );
}
