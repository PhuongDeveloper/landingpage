import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/layout/StudioNavbar';
import Footer from '@/components/layout/StudioFooter';
import CartDrawer from '@/components/cart/CartDrawer';
import { getSiteConfig } from '@/lib/storage';

export const dynamic='force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const config=await getSiteConfig();
  const title=config.seoTitle||config.siteName;
  return {
    title:{default:title,template:`%s | ${config.siteName}`},
    description:config.seoDescription,
    keywords:config.seoKeywords.split(',').map(x=>x.trim()).filter(Boolean),
    authors:[{name:config.siteName}],
    metadataBase:new URL(process.env.NEXT_PUBLIC_SITE_URL||'https://nammochuong.com'),
    alternates:{canonical:'/'},
    openGraph:{title,description:config.seoDescription,siteName:config.siteName,locale:'vi_VN',type:'website',images:config.heroImage?[{url:config.heroImage,alt:config.siteName}]:[]},
    twitter:{card:'summary_large_image',title,description:config.seoDescription},
    robots:{index:true,follow:true},
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteConfig = await getSiteConfig();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.siteName,
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://nammochuong.com',
    description: siteConfig.seoDescription,
    telephone: siteConfig.hotline,
    email: siteConfig.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.address,
      addressCountry: 'VN',
    },
    sameAs: siteConfig.facebook ? [siteConfig.facebook] : [],
  };

  return (
    <html lang="vi" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-ivory text-charcoal antialiased selection:bg-botanical selection:text-ivory relative">
        <CartProvider>
          <Navbar config={siteConfig} />
          <main className="flex-1">{children}</main>
          <Footer config={siteConfig} />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
