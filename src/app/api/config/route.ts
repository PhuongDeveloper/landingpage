import { NextResponse } from 'next/server';
import { getSiteConfig, saveSiteConfig } from '@/lib/storage';
import { SiteConfig } from '@/types';
import { requireAdmin } from '@/lib/admin-auth';

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
  const denied = requireAdmin(); if (denied) return denied;
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
      bankName: (body.bankName || '').trim(),
      bankBin: (body.bankBin || '').trim(),
      bankAccountNo: (body.bankAccountNo || '').trim(),
      bankAccountName: (body.bankAccountName || '').trim(),
    };

    if (!/^\d{6}$/.test(sanitizedConfig.bankBin)) return NextResponse.json({error:'Mã BIN ngân hàng phải gồm 6 chữ số.'},{status:400,headers:NO_CACHE_HEADERS});
    if (!sanitizedConfig.bankName) return NextResponse.json({error:'Vui lòng nhập tên ngân hàng.'},{status:400,headers:NO_CACHE_HEADERS});
    if (Boolean(sanitizedConfig.bankAccountNo) !== Boolean(sanitizedConfig.bankAccountName)) return NextResponse.json({error:'Vui lòng nhập cả số tài khoản và tên chủ tài khoản, hoặc để trống cả hai.'},{status:400,headers:NO_CACHE_HEADERS});
    if (sanitizedConfig.bankAccountNo && !/^[A-Za-z0-9]{6,19}$/.test(sanitizedConfig.bankAccountNo)) return NextResponse.json({error:'Số tài khoản VietQR phải có 6–19 chữ hoặc số.'},{status:400,headers:NO_CACHE_HEADERS});
    if (sanitizedConfig.bankAccountName && sanitizedConfig.bankAccountName.length < 5) return NextResponse.json({error:'Tên chủ tài khoản cần ít nhất 5 ký tự.'},{status:400,headers:NO_CACHE_HEADERS});

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
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Lỗi lưu cấu hình' }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}
