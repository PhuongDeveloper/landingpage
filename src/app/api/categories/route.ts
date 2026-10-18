import { NextResponse } from 'next/server';
import { getCategories, saveCategory, deleteCategory } from '@/lib/storage';
import { CategoryItem } from '@/types';

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error in GET /api/categories:', error);
    return NextResponse.json({ error: 'Lỗi tải danh mục' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: CategoryItem = await request.json();
    if (!body.name || !body.slug) {
      return NextResponse.json({ error: 'Vui lòng nhập Tên và Slug danh mục' }, { status: 400 });
    }

    const saved = await saveCategory(body);
    return NextResponse.json({ success: true, category: saved });
  } catch (error) {
    console.error('Error in POST /api/categories:', error);
    return NextResponse.json({ error: 'Lỗi lưu danh mục' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Thiếu ID danh mục' }, { status: 400 });
    }
    const success = await deleteCategory(id);
    return NextResponse.json({ success });
  } catch (error) {
    console.error('Error in DELETE /api/categories:', error);
    return NextResponse.json({ error: 'Lỗi xóa danh mục' }, { status: 500 });
  }
}
