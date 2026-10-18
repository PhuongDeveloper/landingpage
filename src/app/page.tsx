import React from 'react';
import Hero from '@/components/home/Hero';
import CategoryShowcase from '@/components/home/CategoryShowcase';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import BotanicalStory from '@/components/home/BotanicalStory';
import ProductRitual from '@/components/home/ProductRitual';
import SocialProofAndArticles from '@/components/home/SocialProofAndArticles';
import LeadCaptureSection from '@/components/home/LeadCaptureSection';
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
      {/* Hero Section (2D Cinematic) */}
      <Hero
        headline={siteConfig.heroHeadline}
        subheadline={siteConfig.heroSubheadline}
        ctaText={siteConfig.heroCtaText}
        ctaLink={siteConfig.heroCtaLink}
      />

      {/* Danh mục sản phẩm: Khám phá thế giới tinh dầu */}
      <CategoryShowcase categories={categories} />

      {/* Sản phẩm nổi bật: Tinh hoa thiên nhiên, nâng tầm cuộc sống */}
      <FeaturedProducts products={products} />

      {/* Câu chuyện thương hiệu: Hành trình mang hương thiên nhiên vào từng khoảnh khắc sống */}
      <BotanicalStory />

      {/* Cách sử dụng: Tinh dầu – đơn giản mà hiệu quả */}
      <ProductRitual />

      {/* Form lấy data khách hàng & đăng ký tư vấn */}
      <LeadCaptureSection />

      {/* Khách hàng nói gì & Bài viết gần đây */}
      <SocialProofAndArticles articles={articles} />
    </>
  );
}
