import 'server-only';
import { createHmac, createHash, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const cookieName = 'nmh_admin';
const lifetime = 60 * 60 * 12;
const secret = () => process.env.ADMIN_SESSION_SECRET || '';
const password = () => process.env.ADMIN_PASSWORD || '';
const sign = (value:string) => createHmac('sha256',secret()).update(value).digest('hex');
const equal = (a:string,b:string) => {
  const aa=Buffer.from(createHash('sha256').update(a).digest('hex'));
  const bb=Buffer.from(createHash('sha256').update(b).digest('hex'));
  return timingSafeEqual(aa,bb);
};

export function adminConfigured() { return password().length>=12 && secret().length>=32; }
export function passwordValid(value:string) { return adminConfigured() && equal(value,password()); }
export function adminSessionValid() {
  if(!adminConfigured()) return false;
  const raw=cookies().get(cookieName)?.value || '';
  const [stamp,mac]=raw.split('.');
  if(!stamp||!mac||!/^[0-9]+$/.test(stamp)) return false;
  const time=Number(stamp);
  if(time>Date.now()||Date.now()-time>lifetime*1000) return false;
  const expected=sign(stamp);
  return mac.length===expected.length && timingSafeEqual(Buffer.from(mac),Buffer.from(expected));
}
export function requireAdmin():NextResponse|null {
  return adminSessionValid()?null:NextResponse.json({error:'Phiên quản trị không hợp lệ. Vui lòng đăng nhập lại.'},{status:401});
}
export function setAdminCookie(response:NextResponse) {
  const stamp=String(Date.now());
  response.cookies.set(cookieName,stamp+'.'+sign(stamp),{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/',maxAge:lifetime});
}
export function clearAdminCookie(response:NextResponse) {response.cookies.set(cookieName,'',{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/',maxAge:0});}
