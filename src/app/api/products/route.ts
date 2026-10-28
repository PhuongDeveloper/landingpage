import { NextResponse } from 'next/server';
import { getProducts, saveProduct, deleteProduct } from '@/lib/storage';
import { Product } from '@/types';
import { requireAdmin } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
};

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json(products, { headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error('Error in GET /api/products:', error);
    return NextResponse.json({ error: 'Lỗi tải sản phẩm' }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function POST(request: Request) {
  const denied = requireAdmin(); if (denied) return denied;
  try {
    const body: Product = await request.json();

    if (!body.name || !body.slug || !body.category || !body.variants || body.variants.length === 0) {
      return NextResponse.json(
        { error: 'Vui lòng cung cấp đầy đủ Tên, Đường dẫn slug, Danh mục và Giá biến thể' },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const saved = await saveProduct(body);

    return NextResponse.json(
      {
        success: true,
        product: saved,
        message: 'Lưu sản phẩm thành công!',
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error) {
    console.error('Error in POST /api/products:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Lỗi lưu sản phẩm' }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function PUT(request: Request) {
  const denied = requireAdmin(); if (denied) return denied;
  try {
    const body: Product = await request.json();
    if (!body.id || !body.name) {
      return NextResponse.json({ error: 'Thiếu ID hoặc Tên sản phẩm' }, { status: 400, headers: NO_CACHE_HEADERS });
    }
    const saved = await saveProduct(body);
    return NextResponse.json(
      { success: true, product: saved, message: 'Cập nhật thành công!' },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error) {
    console.error('Error in PUT /api/products:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Lỗi cập nhật sản phẩm' }, { status: 500, headers: NO_CACHE_HEADERS });
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
      return NextResponse.json({ error: 'Thiếu ID hoặc Slug sản phẩm' }, { status: 400, headers: NO_CACHE_HEADERS });
    }

    const success = await deleteProduct(id);
    if (!success) return NextResponse.json({ error: 'Không tìm thấy sản phẩm để xóa' }, { status: 404, headers: NO_CACHE_HEADERS });
    return NextResponse.json(
      { success, message: 'Đã xóa sản phẩm thành công' },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error) {
    console.error('Error in DELETE /api/products:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Lỗi xóa sản phẩm' }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}
