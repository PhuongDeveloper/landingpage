import React from 'react';
import Hero from '@/components/home/Hero';
import BrandIntro from '@/components/home/BrandIntro';
import CategoryShowcase from '@/components/home/CategoryShowcase';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import BotanicalStory from '@/components/home/BotanicalStory';
import ProductRitual from '@/components/home/ProductRitual';
import BrandValues from '@/components/home/BrandValues';
import Testimonials from '@/components/home/Testimonials';
import JournalSection from '@/components/home/JournalSection';
import NewsletterSection from '@/components/home/NewsletterSection';
import { getProducts, getArticles, getSiteConfig } from '@/lib/storage';

export const revalidate = 60; // ISR 60s

export default async function HomePage() {
  const [products, articles, siteConfig] = await Promise.all([
    getProducts(),
    getArticles(),
    getSiteConfig(),
  ]);

  return (
    <>
      {/* Section B — Hero */}
      <Hero
        headline={siteConfig.heroHeadline}
        subheadline={siteConfig.heroSubheadline}
        ctaText={siteConfig.heroCtaText}
        ctaLink={siteConfig.heroCtaLink}
      />

      {/* Section C — Brand Introduction */}
      <BrandIntro />

      {/* Section D — Product Categories */}
      <CategoryShowcase />

      {/* Section E — Featured Products */}
      <FeaturedProducts products={products} />

      {/* Section F — Botanical Story */}
      <BotanicalStory />

      {/* Section G — Product Ritual / How to use */}
      <ProductRitual />

      {/* Section H — Brand Values */}
      <BrandValues />

      {/* Section I — Testimonials */}
      <Testimonials />

      {/* Section J — Journal / Blog */}
      <JournalSection articles={articles} />

      {/* Section Newsletter */}
      <NewsletterSection />
    </>
  );
}
