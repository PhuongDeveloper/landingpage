import Image from 'next/image';
import type { Metadata } from 'next';
import { getArticles, getSiteConfig } from '@/lib/storage';

export const metadata: Metadata = { title: 'Tạp chí mùi hương' };
export const dynamic = 'force-dynamic';

export default async function KnowledgePage() {
  const [articles, config] = await Promise.all([getArticles(), getSiteConfig()]);
  return <main className="studio-journal-page">
    <header className="studio-journal-header"><span className="studio-kicker">{config.homeJournalLabel}</span><h1>{config.homeJournalTitle}</h1></header>
    <div className="studio-journal-list">{articles.map((a, i) => <article className="studio-journal-row" id={a.slug} key={a.id}>
      <div className="studio-journal-row-image">{a.coverImage && <Image src={a.coverImage} alt="" fill sizes="(max-width: 700px) 100vw, 42vw" className="studio-cover" />}</div>
      <div className="studio-journal-row-copy"><span className="studio-kicker">{a.category}</span><h2>{a.title}</h2>{a.excerpt && <p className="studio-journal-excerpt">{a.excerpt}</p>}{a.content && <div className="studio-journal-content">{a.content}</div>}<div className="studio-journal-byline">{a.author && <span>{a.author}</span>}{a.publishedAt && <time>{a.publishedAt}</time>}</div></div>
    </article>)}</div>
    {!articles.length && <p className="studio-catalog-empty">Chưa có bài viết.</p>}
  </main>;
}
