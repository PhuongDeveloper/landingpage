import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import FloatingContactBubbles from '@/components/layout/FloatingContactBubbles';
import { initialSiteConfig } from '@/data/initialData';
import { getSiteConfig } from '@/lib/storage';

export const metadata: Metadata = {
  title: {
    default: 'Nam Mộc Hương — Lan tỏa hương thơm Thuần khiết từ thiên nhiên',
    template: '%s | Nam Mộc Hương',
  },
  description: initialSiteConfig.seoDescription,
  keywords: initialSiteConfig.seoKeywords.split(', '),
  authors: [{ name: 'Nam Mộc Hương' }],
  creator: 'Nam Mộc Hương',
  metadataBase: new URL('https://nammochuong.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Nam Mộc Hương — Lan tỏa hương thơm Thuần khiết từ thiên nhiên',
    description: initialSiteConfig.seoDescription,
    url: 'https://nammochuong.com',
    siteName: 'Nam Mộc Hương',
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&h=630&q=80',
        width: 1200,
        height: 630,
        alt: 'Nam Mộc Hương — Tinh Dầu Thiên Nhiên',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nam Mộc Hương — Tinh Dầu Thiên Nhiên',
    description: initialSiteConfig.seoDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteConfig = await getSiteConfig();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Nam Mộc Hương',
    url: 'https://nammochuong.com',
    logo: 'https://nammochuong.com/logo.png',
    description: siteConfig.seoDescription,
    telephone: siteConfig.hotline,
    email: siteConfig.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.address,
      addressLocality: 'Hà Nội',
      addressRegion: 'Hà Nội',
      addressCountry: 'VN',
    },
    sameAs: ['https://nammochuong.com'],
  };

  return (
    <html lang="vi" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-ivory text-charcoal antialiased selection:bg-botanical selection:text-ivory relative">
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <FloatingContactBubbles
            hotline={siteConfig.hotline}
            zalo={siteConfig.zalo}
            telegram={siteConfig.telegram}
          />
        </CartProvider>
      </body>
    </html>
  );
}
