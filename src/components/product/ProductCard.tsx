'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Check } from 'lucide-react';
import type { Product, ProductCapacity } from '@/types';
import { useCart } from '@/context/CartContext';
import { formatVND } from '@/lib/utils';

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [capacity, setCapacity] = useState<ProductCapacity>(product.variants[0]?.capacity || '');
  const [added, setAdded] = useState(false);
  const variant = product.variants.find(v => v.capacity === capacity) || product.variants[0];

  return <article className="studio-listing-product">
    <Link href={`/san-pham/${product.slug}`} className="studio-listing-photo">
      {product.image && <Image src={product.image} alt={product.name} fill sizes="(max-width: 700px) 50vw, (max-width: 1100px) 33vw, 25vw" className="studio-cover" />}
      {product.isNew && <span className="studio-listing-badge">Mới</span>}
    </Link>
    <div className="studio-listing-meta">
      <span>{product.categoryName}</span>
      <h3><Link href={`/san-pham/${product.slug}`}>{product.name}</Link></h3>
      {product.subtitle && <p>{product.subtitle}</p>}
      <div className="studio-listing-variants" aria-label="Chọn dung tích">
        {product.variants.map(v => <button key={v.capacity} type="button" aria-pressed={capacity === v.capacity} className={capacity === v.capacity ? 'active' : ''} onClick={() => setCapacity(v.capacity)}>{v.capacity}</button>)}
      </div>
      <div className="studio-listing-bottom">
        <strong>{variant ? formatVND(variant.salePrice || variant.price) : 'Liên hệ'}</strong>
        <button type="button" disabled={!variant || variant.stock <= 0} aria-label={`Thêm ${product.name} vào giỏ`} onClick={() => { if (!variant) return; addToCart(product, capacity, 1); setAdded(true); window.setTimeout(() => setAdded(false), 1300); }}>{added ? <Check size={18} /> : <ShoppingBag size={18} />}</button>
      </div>
    </div>
  </article>;
}
