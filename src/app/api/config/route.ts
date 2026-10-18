import { NextResponse } from 'next/server';
import { getSiteConfig, saveSiteConfig } from '@/lib/storage';
import { SiteConfig } from '@/types';

export async function GET() {
  try {
    const config = await getSiteConfig();
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error in GET /api/config:', error);
    return NextResponse.json({ error: 'Lỗi tải cấu hình' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: SiteConfig = await request.json();

    // Sanitize text inputs chống XSS
    const sanitizedConfig: SiteConfig = {
      ...body,
      heroHeadline: body.heroHeadline.replace(/<[^>]*>?/gm, ''),
      heroSubheadline: body.heroSubheadline.replace(/<[^>]*>?/gm, ''),
      heroCtaText: body.heroCtaText.replace(/<[^>]*>?/gm, ''),
      hotline: body.hotline.replace(/<[^>]*>?/gm, ''),
      zalo: body.zalo.replace(/<[^>]*>?/gm, ''),
      email: body.email.replace(/<[^>]*>?/gm, ''),
      seoTitle: body.seoTitle.replace(/<[^>]*>?/gm, ''),
      seoDescription: body.seoDescription.replace(/<[^>]*>?/gm, ''),
    };

    const saved = await saveSiteConfig(sanitizedConfig);

    return NextResponse.json({
      success: true,
      config: saved,
      message: 'Cập nhật cấu hình website thành công!',
    });
  } catch (error) {
    console.error('Error in POST /api/config:', error);
    return NextResponse.json({ error: 'Lỗi lưu cấu hình' }, { status: 500 });
  }
}
