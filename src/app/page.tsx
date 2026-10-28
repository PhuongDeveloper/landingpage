import StudioHome from '@/components/home/StudioHome';
import { getProducts, getArticles, getSiteConfig, getCategories } from '@/lib/storage';

export const dynamic='force-dynamic';
export const revalidate=0;

export default async function HomePage() {
  const [products,articles,config,categories]=await Promise.all([getProducts(),getArticles(),getSiteConfig(),getCategories()]);
  return <StudioHome products={products} articles={articles} config={config} categories={categories}/>;
}
