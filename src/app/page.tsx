import React from 'react';
import Hero from '@/components/home/Hero';
import CategoryShowcase from '@/components/home/CategoryShowcase';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import BotanicalStory from '@/components/home/BotanicalStory';
import ProductRitual from '@/components/home/ProductRitual';
import SocialProofAndArticles from '@/components/home/SocialProofAndArticles';
import { getProducts, getArticles, getSiteConfig, getCategories } from '@/lib/storage';

export const revalidate = 60;

export default async function HomePage() {
  const [products, articles, siteConfig, categories] = await Promise.all([
    getProducts(),
    getArticles(),
    getSiteConfig(),
    getCategories(),
  ]);

  return (
    <>
      {/* 1. Hero Section */}
      <Hero
        headline={siteConfig.heroHeadline}
        subheadline={siteConfig.heroSubheadline}
        ctaText={siteConfig.heroCtaText}
        ctaLink={siteConfig.heroCtaLink}
      />

      {/* 2. Danh mục sản phẩm: Khám phá thế giới tinh dầu */}
      <CategoryShowcase categories={categories} />

      {/* 3. Sản phẩm nổi bật: Tinh hoa thiên nhiên, nâng tầm cuộc sống */}
      <FeaturedProducts products={products} />

      {/* 4. Câu chuyện thương hiệu: Hành trình mang hương thiên nhiên vào từng khoảnh khắc sống */}
      <BotanicalStory />

      {/* 5. Cách sử dụng: Tinh dầu – đơn giản mà hiệu quả */}
      <ProductRitual />

      {/* 6. Khách hàng nói gì về Nam Mộc Hương? & Bài viết gần đây */}
      <SocialProofAndArticles articles={articles} />
    </>
  );
}
