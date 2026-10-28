import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { requireAdmin } from '@/lib/admin-auth';

export async function POST(request: Request) {
  const denied = requireAdmin(); if (denied) return denied;
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Không tìm thấy file tải lên' }, { status: 400 });
    }
    if (!file.type.startsWith('image/') || file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'Chỉ nhận ảnh dưới 10 MB' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Kiểm tra API Key ImgBB từ biến môi trường
    const imgbbApiKey = process.env.IMGBB_API_KEY;

    // 1. NẾU CÓ IMGBB API KEY: UPLOAD TRỰC TIẾP LÊN IMGBB
    if (imgbbApiKey && imgbbApiKey !== 'your_imgbb_api_key_here') {
      try {
        const base64Data = buffer.toString('base64');
        const imgbbBody = new FormData();
        imgbbBody.append('image', base64Data);
        imgbbBody.append('name', file.name.replace(/\.[^/.]+$/, ''));

        const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
          method: 'POST',
          body: imgbbBody,
        });

        const imgbbData = await imgbbRes.json();

        if (imgbbRes.ok && imgbbData?.success && imgbbData?.data?.url) {
          return NextResponse.json({
            success: true,
            provider: 'imgbb',
            url: imgbbData.data.url,
            displayUrl: imgbbData.data.display_url,
            thumbUrl: imgbbData.data.thumb?.url,
            deleteUrl: imgbbData.data.delete_url,
            title: imgbbData.data.title,
          });
        } else {
          console.error('ImgBB API returned an error:', imgbbData);
        }
      } catch (imgbbErr) {
        console.error('ImgBB API upload request failed:', imgbbErr);
      }
    }

    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Không tải được ảnh lên dịch vụ lưu trữ. Kiểm tra IMGBB_API_KEY.' }, { status: 503 });
    }

    // Local development only.
    // (Đảm bảo người dùng có thể test giao diện ngay trước khi add env key)
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '')}`;
    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      provider: 'local_fallback',
      url: publicUrl,
      note: 'Đã lưu local (Thêm IMGBB_API_KEY vào .env để kích hoạt upload ImgBB Cloud)',
    });
  } catch (error) {
    console.error('Error in POST /api/upload:', error);
    return NextResponse.json({ error: 'Lỗi tải ảnh lên máy chủ' }, { status: 500 });
  }
}
