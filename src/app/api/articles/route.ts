import { NextResponse } from 'next/server';
import { getArticles, saveArticle, deleteArticle } from '@/lib/storage';
import { Article } from '@/types';
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
    const articles = await getArticles();
    return NextResponse.json(articles, { headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error('Error in GET /api/articles:', error);
    return NextResponse.json({ error: 'Lỗi tải bài viết' }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function POST(request: Request) {
  const denied = requireAdmin(); if (denied) return denied;
  try {
    const body: Article = await request.json();
    if (!body.title || !body.slug) {
      return NextResponse.json(
        { error: 'Vui lòng nhập Tiêu đề và Slug bài viết' },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const saved = await saveArticle(body);
    return NextResponse.json(
      { success: true, article: saved, message: 'Lưu bài viết thành công' },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error) {
    console.error('Error in POST /api/articles:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Lỗi lưu bài viết' }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function DELETE(request: Request) {
  const denied = requireAdmin(); if (denied) return denied;
  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get('id');

    if (!id) {
      try {
        const body = await request.json();
        id = body.id || body.slug;
      } catch {
        // no body
      }
    }

    if (!id) {
      return NextResponse.json({ error: 'Thiếu ID bài viết' }, { status: 400, headers: NO_CACHE_HEADERS });
    }

    const success = await deleteArticle(id);
    if (!success) return NextResponse.json({ error: 'Không tìm thấy bài viết để xóa' }, { status: 404, headers: NO_CACHE_HEADERS });
    return NextResponse.json(
      { success, message: 'Đã xóa bài viết thành công' },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error) {
    console.error('Error in DELETE /api/articles:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Lỗi xóa bài viết' }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}
