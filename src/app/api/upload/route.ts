import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Không tìm thấy file tải lên' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Kiểm tra API Key ImgBB từ biến môi trường
    const imgbbApiKey = process.env.IMGBB_API_KEY || process.env.NEXT_PUBLIC_IMGBB_API_KEY;

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
          console.warn('ImgBB API returned an error, falling back to local storage:', imgbbData);
        }
      } catch (imgbbErr) {
        console.error('ImgBB API upload request failed, falling back to local storage:', imgbbErr);
      }
    }

    // 2. NẾU CHƯA CÓ IMGBB KEY HOẶC LỖI MẠNG: DỰ PHÒNG LƯU TRỮ LOCAL
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
