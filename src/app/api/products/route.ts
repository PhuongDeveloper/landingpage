import { NextResponse } from 'next/server';
import { getProducts, saveProduct } from '@/lib/storage';
import { Product } from '@/types';

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error in GET /api/products:', error);
    return NextResponse.json({ error: 'Lỗi tải sản phẩm' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: Product = await request.json();

    if (!body.name || !body.slug || !body.category || !body.variants || body.variants.length === 0) {
      return NextResponse.json(
        { error: 'Vui lòng cung cấp đầy đủ Tên, Đường dẫn slug, Danh mục và Giá biến thể' },
        { status: 400 }
      );
    }

    const saved = await saveProduct(body);

    return NextResponse.json({
      success: true,
      product: saved,
      message: 'Lưu sản phẩm thành công!',
    });
  } catch (error) {
    console.error('Error in POST /api/products:', error);
    return NextResponse.json({ error: 'Lỗi lưu sản phẩm' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body: Product = await request.json();
    if (!body.id || !body.name) {
      return NextResponse.json({ error: 'Thiếu ID hoặc Tên sản phẩm' }, { status: 400 });
    }
    const saved = await saveProduct(body);
    return NextResponse.json({ success: true, product: saved, message: 'Cập nhật thành công!' });
  } catch (error) {
    console.error('Error in PUT /api/products:', error);
    return NextResponse.json({ error: 'Lỗi cập nhật sản phẩm' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get('id');

    if (!id) {
      try {
        const body = await request.json();
        id = body.id;
      } catch {
        // no body
      }
    }

    if (!id) {
      return NextResponse.json({ error: 'Thiếu ID sản phẩm' }, { status: 400 });
    }

    const { deleteProduct } = await import('@/lib/storage');
    const success = await deleteProduct(id);
    return NextResponse.json({ success, message: 'Đã xóa sản phẩm' });
  } catch (error) {
    console.error('Error in DELETE /api/products:', error);
    return NextResponse.json({ error: 'Lỗi xóa sản phẩm' }, { status: 500 });
  }
}

