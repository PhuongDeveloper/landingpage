import { NextResponse } from 'next/server';
import { getCategories, saveCategory, deleteCategory } from '@/lib/storage';
import { CategoryItem } from '@/types';
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
    const categories = await getCategories();
    return NextResponse.json(categories, { headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error('Error in GET /api/categories:', error);
    return NextResponse.json({ error: 'Lỗi tải danh mục' }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function POST(request: Request) {
  const denied = requireAdmin(); if (denied) return denied;
  try {
    const body: CategoryItem = await request.json();
    if (!body.name || !body.slug) {
      return NextResponse.json(
        { error: 'Vui lòng nhập Tên và Slug danh mục' },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const saved = await saveCategory(body);
    return NextResponse.json(
      { success: true, category: saved, message: 'Lưu danh mục thành công' },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error) {
    console.error('Error in POST /api/categories:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Lỗi lưu danh mục' }, { status: 500, headers: NO_CACHE_HEADERS });
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
      return NextResponse.json({ error: 'Thiếu ID danh mục' }, { status: 400, headers: NO_CACHE_HEADERS });
    }

    const success = await deleteCategory(id);
    if (!success) return NextResponse.json({ error: 'Không tìm thấy danh mục để xóa' }, { status: 404, headers: NO_CACHE_HEADERS });
    return NextResponse.json(
      { success, message: 'Đã xóa danh mục thành công' },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error) {
    console.error('Error in DELETE /api/categories:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Lỗi xóa danh mục' }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}
