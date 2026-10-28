import { NextResponse } from 'next/server';
import { getProducts, createOrder, getOrders, getSiteConfig, updateOrderStatus, deleteOrder } from '@/lib/storage';
import { generateOrderCode } from '@/lib/utils';
import { Order, OrderItem } from '@/types';
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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    if (!code) { const denied = requireAdmin(); if (denied) return denied; }

    const orders = await getOrders();
    if (code) {
      const order = orders.find((o) => o.orderCode === code || o.id === code);
      if (!order) {
        return NextResponse.json({ error: 'Không tìm thấy đơn hàng' }, { status: 404, headers: NO_CACHE_HEADERS });
      }
      return NextResponse.json(order, { headers: NO_CACHE_HEADERS });
    }

    return NextResponse.json(orders, { headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error('Error in GET /api/orders:', error);
    return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerPhone,
      customerEmail,
      shippingAddress,
      note,
      items,
      paymentMethod,
    } = body;

    // Validation cơ bản
    if (!customerName || !customerPhone || !shippingAddress || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Vui lòng cung cấp đầy đủ họ tên, số điện thoại, địa chỉ và sản phẩm' },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    // Phone validation Việt Nam
    const phoneClean = customerPhone.replace(/\D/g, '');
    if (phoneClean.length < 10 || phoneClean.length > 11) {
      return NextResponse.json(
        { error: 'Số điện thoại không hợp lệ, vui lòng kiểm tra lại' },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    // Server-side Price Validation chống gian lận client
    const catalogProducts = await getProducts();
    const validatedItems: OrderItem[] = [];
    let calculatedSubtotal = 0;

    for (const item of items) {
      const product = catalogProducts.find((p) => p.id === item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Sản phẩm ${item.name || item.productId} không tồn tại trong hệ thống` },
          { status: 400, headers: NO_CACHE_HEADERS }
        );
      }

      const variant = product.variants.find((v) => v.capacity === item.capacity) || product.variants[0];
      const verifiedPrice = variant.salePrice || variant.price;
      const quantity = Math.max(1, Math.floor(Number(item.quantity) || 1));

      validatedItems.push({
        productId: product.id,
        name: product.name,
        capacity: item.capacity,
        price: verifiedPrice,
        quantity,
      });

      calculatedSubtotal += verifiedPrice * quantity;
    }

    const config = await getSiteConfig();
    const shippingFee = calculatedSubtotal >= config.freeShippingThreshold ? 0 : config.standardShippingFee;
    const total = calculatedSubtotal + shippingFee;
    const orderCode = generateOrderCode();

    const newOrder: Order = {
      id: crypto.randomUUID(),
      orderCode,
      createdAt: new Date().toISOString(),
      customerName: customerName.trim(),
      customerPhone: phoneClean,
      customerEmail: customerEmail ? customerEmail.trim() : undefined,
      shippingAddress: shippingAddress.trim(),
      note: note ? note.trim() : undefined,
      items: validatedItems,
      subtotal: calculatedSubtotal,
      shippingFee,
      total,
      status: 'pending',
      paymentMethod: paymentMethod === 'bank_transfer' ? 'bank_transfer' : 'cod',
    };

    const savedOrder = await createOrder(newOrder);

    return NextResponse.json(
      {
        success: true,
        order: savedOrder,
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error) {
    console.error('Error in POST /api/orders:', error);
    return NextResponse.json(
      { error: 'Không thể tạo đơn hàng, vui lòng thử lại sau ít phút' },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

export async function PATCH(request: Request) {
  const denied = requireAdmin(); if (denied) return denied;
  try {
    const body = await request.json();
    const { orderCode, status } = body;

    if (!orderCode || !status) {
      return NextResponse.json({ error: 'Thiếu mã đơn hàng hoặc trạng thái' }, { status: 400, headers: NO_CACHE_HEADERS });
    }

    const updated = await updateOrderStatus(orderCode, status);
    if (!updated) {
      return NextResponse.json({ error: 'Không tìm thấy đơn hàng để cập nhật' }, { status: 404, headers: NO_CACHE_HEADERS });
    }

    return NextResponse.json({ success: true, orderCode, status }, { headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error('Error in PATCH /api/orders:', error);
    return NextResponse.json({ error: 'Lỗi cập nhật đơn hàng' }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function DELETE(request: Request) {
  const denied = requireAdmin(); if (denied) return denied;
  try {
    const { searchParams } = new URL(request.url);
    let code = searchParams.get('code') || searchParams.get('id');

    if (!code) {
      try {
        const body = await request.json();
        code = body.code || body.orderCode || body.id;
      } catch {
        // no body
      }
    }

    if (!code) {
      return NextResponse.json({ error: 'Thiếu mã đơn hàng hoặc ID' }, { status: 400, headers: NO_CACHE_HEADERS });
    }

    const success = await deleteOrder(code);
    if (!success) return NextResponse.json({ error: 'Không tìm thấy đơn hàng để xóa' }, { status: 404, headers: NO_CACHE_HEADERS });
    return NextResponse.json(
      { success, message: 'Đã xóa đơn hàng thành công' },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error) {
    console.error('Error in DELETE /api/orders:', error);
    return NextResponse.json({ error: 'Lỗi xóa đơn hàng' }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}
