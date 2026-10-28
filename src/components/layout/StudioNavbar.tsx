'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import type { SiteConfig } from '@/types';

export default function StudioNavbar({config}:{config:SiteConfig}) {
  const [open,setOpen]=useState(false);
  const {totalItems,openCart}=useCart();
  const links=[{href:'/san-pham',label:config.navProducts||'Sản phẩm'},{href:'/#cau-chuyen',label:config.navStory||'Câu chuyện'},{href:'/kien-thuc',label:config.navJournal||'Tạp chí'}];
  return <header className="studio-header">
    <div className="studio-header-inner">
      <Link href="/" className="studio-brand" onClick={()=>setOpen(false)}><span className="studio-brand-mark">M</span><span>{config.siteName}</span></Link>
      <nav className={open?'studio-nav studio-nav-open':'studio-nav'} aria-label="Điều hướng chính">{links.map(l=><Link href={l.href} onClick={()=>setOpen(false)} key={l.href}>{l.label}</Link>)}</nav>
      <div className="studio-header-actions">
        {config.hotline && <a className="studio-header-contact" href={`tel:${config.hotline.replace(/\D/g,'')}`}>Liên hệ <ArrowUpRight size={16}/></a>}
        <button type="button" className="studio-cart-button" onClick={openCart} aria-label={`Giỏ hàng có ${totalItems} sản phẩm`}><ShoppingBag size={20}/>{totalItems>0&&<span>{totalItems}</span>}</button>
        <button type="button" className="studio-menu-button" aria-label={open?'Đóng menu':'Mở menu'} aria-expanded={open} onClick={()=>setOpen(!open)}>{open?<X size={23}/>:<Menu size={23}/>}</button>
      </div>
    </div>
  </header>;
}
