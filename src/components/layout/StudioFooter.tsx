import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { SiteConfig } from '@/types';

export default function StudioFooter({config}:{config:SiteConfig}) {
  return <footer id="lien-he" className="studio-footer">
    <div className="studio-footer-top">
      <div><span className="studio-footer-kicker">{config.brandTagline}</span><h2>{config.siteName}</h2><p>{config.footerDescription}</p></div>
      <div className="studio-footer-links">
        <div><span>Khám phá</span><Link href="/san-pham">{config.navProducts||'Sản phẩm'}</Link><Link href="/kien-thuc">{config.navJournal||'Tạp chí'}</Link><Link href="/#cau-chuyen">{config.navStory||'Câu chuyện'}</Link></div>
        <div><span>Liên hệ</span>{config.hotline&&<a href={`tel:${config.hotline.replace(/\D/g,'')}`}>{config.hotline}</a>}{config.email&&<a href={`mailto:${config.email}`}>{config.email}</a>}{config.facebook&&<a href={config.facebook} target="_blank" rel="noopener noreferrer">Facebook <ArrowUpRight size={15}/></a>}</div>
      </div>
    </div>
    <div className="studio-footer-bottom"><span>© {new Date().getFullYear()} {config.siteName}</span><Link href="/admin">Quản trị</Link></div>
  </footer>;
}
