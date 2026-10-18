import { NextResponse } from 'next/server';
import { getSiteConfig, saveSiteConfig } from '@/lib/storage';
import { SiteConfig } from '@/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  Pragma: 'no-cache',
  Expires: '0',
  'Surrogate-Control': 'no-store',
};

export async function GET() {
  try {
    const config = await getSiteConfig();
    return NextResponse.json(config, { headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error('Error in GET /api/config:', error);
    return NextResponse.json({ error: 'Lỗi tải cấu hình' }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function POST(request: Request) {
  try {
    const body: SiteConfig = await request.json();

    // Sanitize text inputs chống XSS
    const sanitizedConfig: SiteConfig = {
      ...body,
      heroHeadline: (body.heroHeadline || '').replace(/<[^>]*>?/gm, ''),
      heroSubheadline: (body.heroSubheadline || '').replace(/<[^>]*>?/gm, ''),
      heroCtaText: (body.heroCtaText || '').replace(/<[^>]*>?/gm, ''),
      heroCtaLink: (body.heroCtaLink || '#san-pham').trim(),
      heroImage: (body.heroImage || '').trim(),
      heroBadge: (body.heroBadge || '').replace(/<[^>]*>?/gm, '').trim(),
      heroBgImage: (body.heroBgImage || '').trim(),
      announcementText: (body.announcementText || '').replace(/<[^>]*>?/gm, ''),
      hotline: (body.hotline || '').replace(/<[^>]*>?/gm, ''),
      zalo: (body.zalo || '').replace(/<[^>]*>?/gm, ''),
      email: (body.email || '').replace(/<[^>]*>?/gm, ''),
      seoTitle: (body.seoTitle || '').replace(/<[^>]*>?/gm, ''),
      seoDescription: (body.seoDescription || '').replace(/<[^>]*>?/gm, ''),
    };

    const saved = await saveSiteConfig(sanitizedConfig);

    return NextResponse.json(
      {
        success: true,
        config: saved,
        message: 'Cập nhật cấu hình website thành công!',
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error) {
    console.error('Error in POST /api/config:', error);
    return NextResponse.json({ error: 'Lỗi lưu cấu hình' }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}
