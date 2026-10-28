'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Check, Minus, Plus, ArrowRight } from 'lucide-react';
import type { Product, ProductCapacity } from '@/types';
import { useCart } from '@/context/CartContext';
import { formatVND } from '@/lib/utils';

export default function ProductDetailClient({ product }: { product: Product }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [capacity, setCapacity] = useState<ProductCapacity>(product.variants[0]?.capacity || '');
  const [quantity, setQuantity] = useState(1);
  const [image, setImage] = useState(product.image);
  const [added, setAdded] = useState(false);
  const variant = product.variants.find(v => v.capacity === capacity) || product.variants[0];
  const available = !!variant && variant.stock > 0;
  const gallery = Array.from(new Set([product.image, ...(product.gallery || [])].filter(Boolean)));

  function add(buyNow = false) {
    if (!available) return;
    addToCart(product, capacity, quantity);
    if (buyNow) router.push('/thanh-toan');
    else { setAdded(true); window.setTimeout(() => setAdded(false), 1800); }
  }

  return <div className="studio-detail">
    <div className="studio-detail-gallery">
      <div className="studio-detail-main-image">{image && <Image src={image} alt={product.name} fill priority sizes="(max-width: 900px) 100vw, 52vw" className="studio-cover" />}</div>
      {gallery.length > 1 && <div className="studio-detail-thumbs">{gallery.map((src, i) => <button key={src} type="button" onClick={() => setImage(src)} aria-label={`Xem ảnh sản phẩm ${i + 1}`} aria-pressed={image === src}><Image src={src} alt="" fill sizes="90px" className="studio-cover" /></button>)}</div>}
    </div>
    <div className="studio-detail-copy">
      <span className="studio-kicker">{product.categoryName}</span>
      <h1>{product.name}</h1>
      {product.subtitle && <p className="studio-detail-subtitle">{product.subtitle}</p>}
      <div className="studio-detail-purchase">
        <div className="studio-detail-price">{variant ? formatVND(variant.salePrice || variant.price) : 'Liên hệ'}{variant?.salePrice && <del>{formatVND(variant.price)}</del>}</div>
        <span className="studio-detail-stock">{available ? `Còn ${variant.stock} sản phẩm` : 'Hết hàng'}</span>
        <div className="studio-detail-variants"><span>Dung tích</span><div>{product.variants.map(v => <button key={v.capacity} type="button" aria-pressed={capacity === v.capacity} onClick={() => { setCapacity(v.capacity); setQuantity(1); }}>{v.capacity}</button>)}</div></div>
        <div className="studio-detail-actions"><div className="studio-detail-quantity"><button type="button" aria-label="Giảm số lượng" onClick={() => setQuantity(q => Math.max(1, q - 1))}><Minus size={16} /></button><span>{quantity}</span><button type="button" aria-label="Tăng số lượng" onClick={() => setQuantity(q => Math.min(variant?.stock || 1, q + 1))}><Plus size={16} /></button></div><button type="button" disabled={!available} className="studio-detail-add" onClick={() => add()}>{added ? <><Check size={17} /> Đã thêm vào giỏ</> : <>Thêm vào giỏ <ArrowRight size={17} /></>}</button></div>
        <button type="button" disabled={!available} className="studio-detail-buy" onClick={() => add(true)}>Mua ngay</button>
      </div>
      {product.description && <div className="studio-detail-text"><h2>Về sản phẩm</h2><p>{product.description}</p></div>}
      {product.story && <div className="studio-detail-text"><h2>Câu chuyện</h2><p>{product.story}</p></div>}
      {(product.origin || product.extractionMethod) && <dl className="studio-detail-facts">{product.origin && <div><dt>Xuất xứ</dt><dd>{product.origin}</dd></div>}{product.extractionMethod && <div><dt>Chiết xuất</dt><dd>{product.extractionMethod}</dd></div>}</dl>}
      {(product.notes?.top || product.notes?.middle || product.notes?.base) && <div className="studio-detail-text"><h2>Tầng hương</h2><dl className="studio-detail-facts">{product.notes.top && <div><dt>Hương đầu</dt><dd>{product.notes.top}</dd></div>}{product.notes.middle && <div><dt>Hương giữa</dt><dd>{product.notes.middle}</dd></div>}{product.notes.base && <div><dt>Hương cuối</dt><dd>{product.notes.base}</dd></div>}</dl></div>}
      {product.benefits?.length > 0 && <div className="studio-detail-text"><h2>Đặc điểm</h2><ul>{product.benefits.map((b, i) => <li key={i}>{b}</li>)}</ul></div>}
      {product.ritualGuide?.length > 0 && <div className="studio-detail-text"><h2>Cách sử dụng</h2><ol>{product.ritualGuide.map((r, i) => <li key={i}>{r}</li>)}</ol></div>}
    </div>
  </div>;
}
