import { NextResponse } from 'next/server';
import { getProducts, createOrder, getOrders, updateOrderStatus } from '@/lib/storage';
import { generateOrderCode } from '@/lib/utils';
import { Order, OrderItem } from '@/types';

const FREE_SHIPPING_THRESHOLD = 499000;
const STANDARD_SHIPPING_FEE = 30000;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    const orders = await getOrders();
    if (code) {
      const order = orders.find((o) => o.orderCode === code);
      if (!order) {
        return NextResponse.json({ error: 'Không tìm thấy đơn hàng' }, { status: 404 });
      }
      return NextResponse.json(order);
    }

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error in GET /api/orders:', error);
    return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 });
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
        { status: 400 }
      );
    }

    // Phone validation Việt Nam
    const phoneClean = customerPhone.replace(/\D/g, '');
    if (phoneClean.length < 10 || phoneClean.length > 11) {
      return NextResponse.json(
        { error: 'Số điện thoại không hợp lệ, vui lòng kiểm tra lại' },
        { status: 400 }
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
          { status: 400 }
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

    const shippingFee = calculatedSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
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

    return NextResponse.json({
      success: true,
      order: savedOrder,
    });
  } catch (error) {
    console.error('Error in POST /api/orders:', error);
    return NextResponse.json(
      { error: 'Không thể tạo đơn hàng, vui lòng thử lại sau ít phút' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { orderCode, status } = body;

    if (!orderCode || !status) {
      return NextResponse.json({ error: 'Thiếu mã đơn hàng hoặc trạng thái' }, { status: 400 });
    }

    const updated = await updateOrderStatus(orderCode, status);
    if (!updated) {
      return NextResponse.json({ error: 'Không tìm thấy đơn hàng để cập nhật' }, { status: 404 });
    }

    return NextResponse.json({ success: true, orderCode, status });
  } catch (error) {
    console.error('Error in PATCH /api/orders:', error);
    return NextResponse.json({ error: 'Lỗi cập nhật đơn hàng' }, { status: 500 });
  }
}
