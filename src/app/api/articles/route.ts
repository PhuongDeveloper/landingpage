import { NextResponse } from 'next/server';
import { getArticles, saveArticle, deleteArticle } from '@/lib/storage';
import { Article } from '@/types';

export async function GET() {
  try {
    const articles = await getArticles();
    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error in GET /api/articles:', error);
    return NextResponse.json({ error: 'Lỗi tải bài viết' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: Article = await request.json();
    if (!body.title || !body.slug) {
      return NextResponse.json({ error: 'Vui lòng nhập Tiêu đề và Slug bài viết' }, { status: 400 });
    }

    const saved = await saveArticle(body);
    return NextResponse.json({ success: true, article: saved });
  } catch (error) {
    console.error('Error in POST /api/articles:', error);
    return NextResponse.json({ error: 'Lỗi lưu bài viết' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Thiếu ID bài viết' }, { status: 400 });
    }
    const success = await deleteArticle(id);
    return NextResponse.json({ success });
  } catch (error) {
    console.error('Error in DELETE /api/articles:', error);
    return NextResponse.json({ error: 'Lỗi xóa bài viết' }, { status: 500 });
  }
}
