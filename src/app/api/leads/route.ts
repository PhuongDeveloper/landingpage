import { NextResponse } from 'next/server';
import { getLeads, createLead, updateLeadStatus, deleteLead } from '@/lib/storage';
import { Lead } from '@/types';
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
  const denied = requireAdmin(); if (denied) return denied;
  try {
    const leads = await getLeads();
    return NextResponse.json(leads, { headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error('Error in GET /api/leads:', error);
    return NextResponse.json({ error: 'Lỗi tải danh sách khách hàng' }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, interest, message } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Vui lòng cung cấp Họ tên và Số điện thoại' },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return NextResponse.json(
        { error: 'Số điện thoại không hợp lệ (cần ít nhất 10 số)' },
        { status: 400, headers: NO_CACHE_HEADERS }
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

    return NextResponse.json(
      {
        success: true,
        lead: saved,
        message: 'Gửi yêu cầu tư vấn thành công! Nam Mộc Hương sẽ liên hệ bạn sớm nhất.',
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error) {
    console.error('Error in POST /api/leads:', error);
    return NextResponse.json({ error: 'Lỗi gửi yêu cầu' }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function PATCH(request: Request) {
  const denied = requireAdmin(); if (denied) return denied;
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Thiếu ID hoặc trạng thái' }, { status: 400, headers: NO_CACHE_HEADERS });
    }

    const updated = await updateLeadStatus(id, status);
    if (!updated) {
      return NextResponse.json({ error: 'Không tìm thấy khách hàng' }, { status: 404, headers: NO_CACHE_HEADERS });
    }

    return NextResponse.json({ success: true, id, status }, { headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error('Error in PATCH /api/leads:', error);
    return NextResponse.json({ error: 'Lỗi cập nhật' }, { status: 500, headers: NO_CACHE_HEADERS });
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
        id = body.id;
      } catch {
        // no body
      }
    }

    if (!id) {
      return NextResponse.json({ error: 'Thiếu ID khách hàng' }, { status: 400, headers: NO_CACHE_HEADERS });
    }

    const success = await deleteLead(id);
    if (!success) return NextResponse.json({ error: 'Không tìm thấy khách hàng để xóa' }, { status: 404, headers: NO_CACHE_HEADERS });
    return NextResponse.json(
      { success, message: 'Đã xóa dữ liệu khách hàng thành công' },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error) {
    console.error('Error in DELETE /api/leads:', error);
    return NextResponse.json({ error: 'Lỗi xóa dữ liệu khách hàng' }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}
