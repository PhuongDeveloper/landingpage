import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { getProductBySlug, getProducts } from '@/lib/storage';
import ProductDetailClient from './ProductDetailClient';
import ProductCard from '@/components/product/ProductCard';
import { ChevronRight } from 'lucide-react';
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

  const allProducts = await getProducts();
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  const lowestPrice = Math.min(...product.variants.map((v) => v.salePrice || v.price));
  const highestPrice = Math.max(...product.variants.map((v) => v.price));

  // JSON-LD Structured Data Schema cho Product
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: [product.image, ...product.gallery],
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: 'Nam Mộc Hương',
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'VND',
      lowPrice: lowestPrice,
      highPrice: highestPrice,
      offerCount: product.variants.length,
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
  };

  return (
    <div className="py-10 lg:py-16 bg-ivory min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center text-xs text-charcoal/60 mb-8 space-x-1.5 flex-wrap">
          <Link href="/" className="hover:text-botanical transition-colors">
            Trang Chủ
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-charcoal/40" />
          <Link href="/san-pham" className="hover:text-botanical transition-colors">
            Sản Phẩm
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-charcoal/40" />
          <Link
            href={`/san-pham?category=${product.category}`}
            className="hover:text-botanical transition-colors capitalize"
          >
            {product.categoryName}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-charcoal/40" />
          <span className="text-botanical font-semibold truncate max-w-[200px] sm:max-w-none">
            {product.name}
          </span>
        </nav>

        {/* Client Interactive Component */}
        <ProductDetailClient product={product} />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-16 border-t border-clay/80">
            <div className="flex justify-between items-end mb-10">
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-earth font-bold block mb-1">
                  Gợi Ý Cùng Nhóm
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-botanical-dark">
                  Sản Phẩm Liên Quan
                </h3>
              </div>
              <Link
                href={`/san-pham?category=${product.category}`}
                className="text-xs font-semibold text-botanical hover:underline"
              >
                Xem thêm trong danh mục →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
