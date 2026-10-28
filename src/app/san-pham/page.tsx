import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getProducts, getCategories } from '@/lib/storage';
import ProductCard from '@/components/product/ProductCard';
import { ChevronRight, Filter } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Bộ Sưu Tập Tinh Dầu Thiên Nhiên Nguyên Chất',
  description: 'Khám phá trọn bộ tinh dầu đơn hương, phối hương, xông phòng và dầu massage chưng cất tự nhiên tại Nam Mộc Hương.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  searchParams: {
    category?: string;
  };
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const [allProducts, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);
  const selectedCategory = searchParams.category;

  const filteredProducts = selectedCategory
    ? allProducts.filter((p) => p.category === selectedCategory)
    : allProducts;

  const activeCategoryObj = categories.find((c) => c.slug === selectedCategory);

  return (
    <div className="py-10 lg:py-16 bg-ivory min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center text-xs text-charcoal/60 mb-6 space-x-1.5">
          <Link href="/" className="hover:text-botanical transition-colors">
            Trang Chủ
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-charcoal/40" />
          <span className="text-botanical font-semibold">Tất Cả Sản Phẩm</span>
          {selectedCategory && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-charcoal/40" />
              <span className="text-earth font-medium capitalize">
                {activeCategoryObj?.name || selectedCategory.replace('-', ' ')}
              </span>
            </>
          )}
        </nav>

        {/* Page Header */}
        <div className="max-w-3xl mb-10 space-y-3">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-botanical-dark">
            {activeCategoryObj ? activeCategoryObj.name : 'Bộ Sưu Tập Tinh Dầu Tự Nhiên'}
          </h1>
          <p className="text-sm text-charcoal/70 leading-relaxed">
            {activeCategoryObj?.subtitle ||
              'Chắt lọc trọn vẹn tinh túy từ thảo mộc nhiệt đới bản địa. Giúp thanh lọc không gian sống, xoa dịu thần kinh và mang lại giấc ngủ an lành.'}
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-6 border-b border-clay/80">
          <Link
            href="/san-pham"
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              !selectedCategory
                ? 'bg-botanical text-ivory shadow-xs'
                : 'bg-white text-charcoal/70 hover:bg-clay/60 border border-clay/80'
            }`}
          >
            Tất Cả ({allProducts.length})
          </Link>
          {categories.map((cat) => {
            const count = allProducts.filter((p) => p.category === cat.slug).length;
            const isActive = selectedCategory === cat.slug;
            return (
              <Link
                key={cat.id || cat.slug}
                href={`/san-pham?category=${cat.slug}`}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-botanical text-ivory shadow-xs'
                    : 'bg-white text-charcoal/70 hover:bg-clay/60 border border-clay/80'
                }`}
              >
                {cat.name} ({count})
              </Link>
            );
          })}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-clay/80 max-w-md mx-auto space-y-3">
            <p className="font-serif text-lg text-charcoal">Chưa có sản phẩm thuộc danh mục này.</p>
            <Link
              href="/san-pham"
              className="inline-block text-xs font-semibold text-botanical hover:underline"
            >
              Quay lại xem tất cả sản phẩm
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
