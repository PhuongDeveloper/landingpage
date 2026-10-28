'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDownRight, ArrowRight, ShoppingBag } from 'lucide-react';
import type { Product, CategoryItem, Article, SiteConfig } from '@/types';
import { formatVND } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

type Props = { products:Product[]; categories:CategoryItem[]; articles:Article[]; config:SiteConfig };

export default function StudioHome({products,categories,articles,config}:Props) {
  const scope=useRef<HTMLDivElement>(null);
  const {addToCart}=useCart();
  useEffect(()=>{
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx=gsap.context(()=>{
      gsap.fromTo('.studio-hero-copy > *',{opacity:0,y:24},{opacity:1,y:0,stagger:0.11,duration:0.9,ease:'power3.out',delay:0.1});
      gsap.fromTo('.studio-hero-image',{opacity:0,scale:1.035},{opacity:1,scale:1,duration:1.35,ease:'power2.out'});
      gsap.utils.toArray<HTMLElement>('.studio-reveal').forEach((element)=>{
        gsap.fromTo(element,{opacity:0,y:32},{opacity:1,y:0,duration:0.85,ease:'power2.out',scrollTrigger:{trigger:element,start:'top 88%',once:true}});
      });
    },scope);
    return ()=>ctx.revert();
  },[]);
  const picks=products.filter(p=>p.isFeatured).length ? products.filter(p=>p.isFeatured).slice(0,4) : products.slice(0,4);
  return <div ref={scope} className="studio-home">
    <section className="studio-hero" aria-labelledby="studio-hero-title">
      <div className="studio-hero-copy">
        {config.heroBadge && <span className="studio-kicker"><span className="studio-kicker-mark" />{config.heroBadge}</span>}
        <h1 id="studio-hero-title">{config.heroHeadline}</h1>
        {config.heroSubheadline && <p>{config.heroSubheadline}</p>}
        <Link className="studio-primary-link" href={config.heroCtaLink||'/san-pham'}>{config.heroCtaText||'Xem sản phẩm'}<ArrowRight size={19}/></Link>
      </div>
      <div className="studio-hero-image">
        {config.heroImage && <Image src={config.heroImage} alt={config.siteName} fill priority sizes="(max-width: 900px) 100vw, 52vw" className="studio-cover" />}
        <span className="studio-image-label">{config.siteName}</span>
      </div>
      <div className="studio-hero-side" aria-hidden="true">{config.brandTagline}</div>
    </section>

    {categories.length>0 && <section id="danh-muc" className="studio-section studio-categories">
      <div className="studio-section-heading studio-reveal">
        <span className="studio-kicker">{config.homeCategoryLabel}</span>
        <h2>{config.homeCategoryTitle}</h2>
      </div>
      <div className="studio-category-grid">
        {categories.slice(0,4).map((cat,i)=><Link className="studio-category studio-reveal" href={`/san-pham?category=${cat.slug}`} key={cat.id}>
          <div className="studio-category-photo">{cat.image && <Image src={cat.image} alt="" fill sizes="(max-width: 760px) 100vw, 25vw" className="studio-cover" />}</div>
          <div className="studio-category-info"><span className="studio-category-index">{String(i+1).padStart(2,'0')}</span><div><h3>{cat.name}</h3>{cat.subtitle && <p>{cat.subtitle}</p>}</div><ArrowDownRight size={23}/></div>
        </Link>)}
      </div>
    </section>}

    {picks.length>0 && <section id="san-pham" className="studio-section studio-products">
      <div className="studio-section-heading studio-section-heading-row studio-reveal">
        <div><span className="studio-kicker">{config.homeProductLabel}</span><h2>{config.homeProductTitle}</h2></div>
        <Link className="studio-text-link" href="/san-pham">{config.homeProductLinkText}<ArrowRight size={18}/></Link>
      </div>
      <div className="studio-product-grid">
        {picks.map((p)=><article className="studio-product studio-reveal" key={p.id}>
          <Link href={`/san-pham/${p.slug}`} className="studio-product-photo">{p.image && <Image src={p.image} alt={p.name} fill sizes="(max-width: 760px) 100vw, 50vw" className="studio-cover" />}</Link>
          <div className="studio-product-line"><div><span className="studio-product-category">{p.categoryName}</span><h3><Link href={`/san-pham/${p.slug}`}>{p.name}</Link></h3><p>{p.subtitle}</p></div><button type="button" className="studio-add" aria-label={`Thêm ${p.name} vào giỏ hàng`} onClick={()=>{const v=p.variants?.[0];if(v) addToCart(p,v.capacity);}}><ShoppingBag size={19}/></button></div>
          <div className="studio-price">{formatVND(p.variants?.[0]?.salePrice||p.variants?.[0]?.price||0)}</div>
        </article>)}
      </div>
    </section>}

    {(config.homeStoryTitle||config.homeStoryBody) && <section id="cau-chuyen" className="studio-story">
      <div className="studio-story-visual studio-reveal">{config.homeStoryImage && <Image src={config.homeStoryImage} alt="" fill sizes="(max-width: 900px) 100vw, 50vw" className="studio-cover" />}</div>
      <div className="studio-story-copy studio-reveal"><span className="studio-kicker">{config.homeStoryLabel}</span><h2>{config.homeStoryTitle}</h2><p>{config.homeStoryBody}</p><Link className="studio-primary-link studio-primary-link-light" href="/san-pham">{config.homeStoryLinkText}<ArrowRight size={19}/></Link></div>
    </section>}

    {articles.length>0 && <section className="studio-section studio-journal">
      <div className="studio-section-heading studio-section-heading-row studio-reveal"><div><span className="studio-kicker">{config.homeJournalLabel}</span><h2>{config.homeJournalTitle}</h2></div><Link className="studio-text-link" href="/kien-thuc">Xem tất cả<ArrowRight size={18}/></Link></div>
      <div className="studio-journal-grid">{articles.slice(0,3).map(a=><Link className="studio-journal-card studio-reveal" href={`/kien-thuc#${a.slug}`} key={a.id}><div className="studio-journal-photo">{a.coverImage && <Image src={a.coverImage} alt="" fill sizes="(max-width: 760px) 100vw, 33vw" className="studio-cover" />}</div><span>{a.category}</span><h3>{a.title}</h3><ArrowRight size={20}/></Link>)}</div>
    </section>}
  </div>;
}
