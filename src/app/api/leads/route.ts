import { NextResponse } from 'next/server';
import { getLeads, createLead, updateLeadStatus } from '@/lib/storage';
import { Lead } from '@/types';

export async function GET() {
  try {
    const leads = await getLeads();
    return NextResponse.json(leads);
  } catch (error) {
    console.error('Error in GET /api/leads:', error);
    return NextResponse.json({ error: 'Lỗi tải danh sách khách hàng' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, interest, message } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Vui lòng cung cấp Họ tên và Số điện thoại' },
        { status: 400 }
      );
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return NextResponse.json(
        { error: 'Số điện thoại không hợp lệ (cần ít nhất 10 số)' },
        { status: 400 }
      );
    }

    const newLead: Lead = {
      id: crypto.randomUUID(),
      name: name.trim(),
      phone: cleanPhone,
      email: email ? email.trim() : undefined,
      interest: interest || 'Tư vấn mùi hương thư giãn',
      message: message ? message.trim() : undefined,
      createdAt: new Date().toISOString(),
      status: 'new',
    };

    const saved = await createLead(newLead);

    return NextResponse.json({
      success: true,
      lead: saved,
      message: 'Gửi yêu cầu tư vấn thành công! Nam Mộc Hương sẽ liên hệ bạn sớm nhất.',
    });
  } catch (error) {
    console.error('Error in POST /api/leads:', error);
    return NextResponse.json({ error: 'Lỗi gửi yêu cầu' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Thiếu ID hoặc trạng thái' }, { status: 400 });
    }

    const updated = await updateLeadStatus(id, status);
    if (!updated) {
      return NextResponse.json({ error: 'Không tìm thấy khách hàng' }, { status: 404 });
    }

    return NextResponse.json({ success: true, id, status });
  } catch (error) {
    console.error('Error in PATCH /api/leads:', error);
    return NextResponse.json({ error: 'Lỗi cập nhật' }, { status: 500 });
  }
}
