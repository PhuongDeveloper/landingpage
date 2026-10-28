import 'server-only';
import fs from 'node:fs';
import path from 'node:path';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { initialProducts, initialCategories, initialArticles, initialSiteConfig } from '@/data/initialData';
import type { Product, CategoryItem, Article, SiteConfig, Lead, Order } from '@/types';

type Store = { products: Product[]; categories: CategoryItem[]; articles: Article[]; orders: Order[]; leads: Lead[]; config: SiteConfig };
type Table = 'products' | 'categories' | 'articles' | 'orders' | 'leads' | 'site_config';
const file = path.join(process.cwd(), '.data', 'store.json');
const localMode = process.env.NODE_ENV !== 'production' && !isSupabaseConfigured;
const specimenBySlug: Record<string,{old:string;asset:string}> = {
  'tinh-dau-oai-huong':{old:'photo-1547887537-6158d64c35b3',asset:'/specimens/lavender.svg'},
  'tinh-dau-bac-ha':{old:'photo-1608571423902-eed4a5ad8108',asset:'/specimens/mint.svg'},
  'tinh-dau-tram-tra':{old:'photo-1540555700478-4be289fbecef',asset:'/specimens/tea-tree.svg'},
  'tinh-dau-cam-ngot':{old:'photo-1617897903246-719242758050',asset:'/specimens/orange.svg'},
  'tinh-dau-tram-huong-rung-gia':{old:'photo-1595981267035-7b04ca84a82d',asset:'/specimens/agarwood.svg'},
};
const specimenByCategory:Record<string,{old:string;asset:string}>={
  'thu-gian':{old:'photo-1547887537-6158d64c35b3',asset:'/specimens/lavender.svg'},
  'thanh-loc':{old:'photo-1608571423902-eed4a5ad8108',asset:'/specimens/tea-tree.svg'},
  'tap-trung':{old:'photo-1540555700478-4be289fbecef',asset:'/specimens/mint.svg'},
  'phong-thuy':{old:'photo-1595981267035-7b04ca84a82d',asset:'/specimens/agarwood.svg'},
};
function cleanProduct(p:Product):Product {const match=specimenBySlug[p.slug];return match&&p.image?.includes(match.old)?{...p,image:match.asset,gallery:[match.asset]}:p;}
function cleanCategory(c:CategoryItem):CategoryItem {const match=specimenByCategory[c.slug];return match&&c.image?.includes(match.old)?{...c,image:match.asset}:c;}
function client() { if (!supabase) throw new Error('Thiếu NEXT_PUBLIC_SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY trên máy chủ'); return supabase; }
function check(error: {message:string;code?:string}|null, action:string) { if (error) throw new Error(action + ': ' + error.message + (error.code ? ' ('+error.code+')' : '')); }
function readLocal(): Store {
  if (!fs.existsSync(file)) {
    fs.mkdirSync(path.dirname(file), {recursive:true});
    fs.writeFileSync(file, JSON.stringify({products:initialProducts,categories:initialCategories,articles:initialArticles,orders:[],leads:[],config:initialSiteConfig}));
  }
  return JSON.parse(fs.readFileSync(file,'utf8'));
}
function writeLocal(store:Store) { fs.writeFileSync(file,JSON.stringify(store,null,2)); }
function localSave<K extends keyof Store>(key:K, item:any, prepend=false) {
  const store=readLocal(); const list=(store[key] as any[]).filter(x=>x.id!==item.id);
  prepend ? list.unshift(item) : list.push(item); (store as any)[key]=list; writeLocal(store);
}
function localDelete<K extends keyof Store>(key:K, value:string, alias?:string) {
  const store=readLocal(); const list=store[key] as any[]; const next=list.filter(x=>x.id!==value&&(!alias||x[alias]!==value));
  (store as any)[key]=next; writeLocal(store); return next.length!==list.length;
}
async function list(table:Table, order='created_at', ascending=true) {
  const result=await client().from(table).select('*').order(order,{ascending});
  check(result.error,'Tải '+table); return result.data || [];
}
async function put(table:Table, row:Record<string,unknown>) {
  const result=await client().from(table).upsert(row).select('id').single();
  check(result.error,'Lưu '+table);
  if (!result.data?.id) throw new Error('Supabase chưa xác nhận lưu '+table);
}
async function remove(table:Table, value:string, alias?:string):Promise<boolean> {
  let found=await client().from(table).select('id').eq('id',value).maybeSingle();
  check(found.error,'Tìm '+table);
  if (!found.data && alias) { found=await client().from(table).select('id').eq(alias,value).maybeSingle(); check(found.error,'Tìm '+table); }
  if (!found.data) return false;
  const result=await client().from(table).delete().eq('id',found.data.id).select('id');
  check(result.error,'Xóa '+table);
  if (result.data?.length!==1) throw new Error('Supabase chưa xác nhận xóa '+table);
  return true;
}

export async function getCategories():Promise<CategoryItem[]> { return (localMode ? readLocal().categories : await list('categories') as CategoryItem[]).map(cleanCategory); }
export async function saveCategory(item:CategoryItem):Promise<CategoryItem> {
  if(localMode) localSave('categories',item);
  else await put('categories',{id:item.id,name:item.name,slug:item.slug,subtitle:item.subtitle,image:item.image});
  return item;
}
export async function deleteCategory(value:string):Promise<boolean> { return localMode ? localDelete('categories',value,'slug') : remove('categories',value,'slug'); }

function product(x:any):Product { return cleanProduct({...x,categoryName:x.category_name,extractionMethod:x.extraction_method,isFeatured:x.is_featured,isNew:x.is_new,reviewCount:x.review_count}); }
export async function getProducts():Promise<Product[]> { return localMode ? readLocal().products.map(cleanProduct) : (await list('products')).map(product); }
export async function getProductBySlug(slug:string):Promise<Product|null> { return (await getProducts()).find(x=>x.slug===slug||x.id===slug)||null; }
export async function saveProduct(p:Product):Promise<Product> {
  if(localMode) localSave('products',p);
  else await put('products',{id:p.id,name:p.name,slug:p.slug,category:p.category,category_name:p.categoryName,subtitle:p.subtitle,description:p.description,story:p.story,origin:p.origin,extraction_method:p.extractionMethod,image:p.image,gallery:p.gallery,variants:p.variants,notes:p.notes,benefits:p.benefits,ritual_guide:p.ritualGuide,is_featured:p.isFeatured??false,is_new:p.isNew??false,rating:p.rating,review_count:p.reviewCount});
  return p;
}
export async function deleteProduct(value:string):Promise<boolean> { return localMode ? localDelete('products',value,'slug') : remove('products',value,'slug'); }

function order(x:any):Order { return {id:x.id,orderCode:x.order_code,createdAt:x.created_at,customerName:x.customer_name,customerPhone:x.customer_phone,customerEmail:x.customer_email,shippingAddress:x.shipping_address,note:x.note,items:x.items,subtotal:Number(x.subtotal),shippingFee:Number(x.shipping_fee),total:Number(x.total),status:x.status,paymentMethod:x.payment_method}; }
export async function getOrders():Promise<Order[]> { return localMode ? readLocal().orders.sort((a,b)=>b.createdAt.localeCompare(a.createdAt)) : (await list('orders','created_at',false)).map(order); }
export async function getOrderByCode(code:string):Promise<Order|null> {
  if(localMode) return readLocal().orders.find(x=>x.orderCode===code||x.id===code)||null;
  const r=await client().from('orders').select('*').eq('order_code',code).maybeSingle(); check(r.error,'Tải đơn hàng'); return r.data?order(r.data):null;
}
export async function createOrder(o:Order):Promise<Order> {
  if(localMode) localSave('orders',o,true);
  else await put('orders',{id:o.id,order_code:o.orderCode,created_at:o.createdAt,customer_name:o.customerName,customer_phone:o.customerPhone,customer_email:o.customerEmail,shipping_address:o.shippingAddress,note:o.note,items:o.items,subtotal:o.subtotal,shipping_fee:o.shippingFee,total:o.total,status:o.status,payment_method:o.paymentMethod});
  return o;
}
export async function updateOrderStatus(code:string,status:Order['status']):Promise<boolean> {
  if(localMode) {const s=readLocal();const o=s.orders.find(x=>x.orderCode===code);if(!o)return false;o.status=status;writeLocal(s);return true;}
  const r=await client().from('orders').update({status}).eq('order_code',code).select('id');check(r.error,'Cập nhật đơn hàng');return r.data?.length===1;
}
export async function deleteOrder(value:string):Promise<boolean> { return localMode ? localDelete('orders',value,'orderCode') : remove('orders',value,'order_code'); }

function lead(x:any):Lead {return {id:x.id,name:x.name,phone:x.phone,email:x.email,interest:x.interest,message:x.message,status:x.status,createdAt:x.created_at};}
export async function getLeads():Promise<Lead[]> { return localMode ? readLocal().leads.sort((a,b)=>b.createdAt.localeCompare(a.createdAt)) : (await list('leads','created_at',false)).map(lead); }
export async function createLead(l:Lead):Promise<Lead> {
  if(localMode) localSave('leads',l,true);
  else await put('leads',{id:l.id,name:l.name,phone:l.phone,email:l.email,interest:l.interest,message:l.message,status:l.status,created_at:l.createdAt});
  return l;
}
export async function updateLeadStatus(id:string,status:Lead['status']):Promise<boolean> {
  if(localMode) {const s=readLocal();const l=s.leads.find(x=>x.id===id);if(!l)return false;l.status=status;writeLocal(s);return true;}
  const r=await client().from('leads').update({status}).eq('id',id).select('id');check(r.error,'Cập nhật khách hàng');return r.data?.length===1;
}
export async function deleteLead(value:string):Promise<boolean> {return localMode ? localDelete('leads',value) : remove('leads',value);}

export async function getSiteConfig():Promise<SiteConfig> {
  if(localMode) return {...initialSiteConfig,...readLocal().config};
  const r=await client().from('site_config').select('data').eq('id','main').maybeSingle();check(r.error,'Tải cấu hình');
  return r.data?.data ? {...initialSiteConfig,...r.data.data} : initialSiteConfig;
}
export async function saveSiteConfig(c:SiteConfig):Promise<SiteConfig> {
  if(localMode){const s=readLocal();s.config=c;writeLocal(s);}
  else await put('site_config',{id:'main',data:c,updated_at:new Date().toISOString()});
  return c;
}

function article(x:any):Article {return {id:x.id,title:x.title,slug:x.slug,excerpt:x.excerpt,content:x.content,coverImage:x.cover_image,category:x.category,publishedAt:x.published_at,readTime:x.read_time,author:x.author};}
export async function getArticles():Promise<Article[]> {return localMode?readLocal().articles:(await list('articles','published_at',false)).map(article);}
export async function getArticleBySlug(slug:string):Promise<Article|null> {return (await getArticles()).find(x=>x.slug===slug||x.id===slug)||null;}
export async function saveArticle(a:Article):Promise<Article> {
  if(localMode) localSave('articles',a,true);
  else await put('articles',{id:a.id,title:a.title,slug:a.slug,excerpt:a.excerpt,content:a.content,cover_image:a.coverImage,category:a.category,published_at:a.publishedAt,read_time:a.readTime,author:a.author});
  return a;
}
export async function deleteArticle(value:string):Promise<boolean> {return localMode?localDelete('articles',value,'slug'):remove('articles',value,'slug');}
