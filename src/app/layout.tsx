import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import { initialSiteConfig } from '@/data/initialData';

export const metadata: Metadata = {
  title: {
    default: 'Nam Mộc Hương — Tinh Dầu Thiên Nhiên & Liệu Pháp Mùi Hương',
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
    title: 'Nam Mộc Hương — Hơi Thở Thiên Nhiên Trong Từng Giọt Hương',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Nam Mộc Hương',
    url: 'https://nammochuong.com',
    logo: 'https://nammochuong.com/logo.png',
    description: initialSiteConfig.seoDescription,
    telephone: initialSiteConfig.hotline,
    email: initialSiteConfig.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Số 48 Đường Thảo Mộc, Phường An Phú',
      addressLocality: 'TP. Thủ Đức',
      addressRegion: 'TP. Hồ Chí Minh',
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
      <body className="min-h-screen flex flex-col bg-ivory text-charcoal antialiased selection:bg-botanical selection:text-ivory">
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
