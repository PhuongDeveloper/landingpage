import { NextResponse } from 'next/server';
import { adminConfigured, adminSessionValid, clearAdminCookie, passwordValid, setAdminCookie } from '@/lib/admin-auth';

export const dynamic='force-dynamic';
export async function GET() {
  return NextResponse.json({authenticated:adminSessionValid(),configured:adminConfigured()},{headers:{'Cache-Control':'no-store'}});
}
export async function POST(request:Request) {
  if(!adminConfigured()) return NextResponse.json({error:'Chưa cấu hình ADMIN_PASSWORD và ADMIN_SESSION_SECRET trên máy chủ.'},{status:503});
  const body=await request.json().catch(()=>({}));
  if(typeof body.password!=='string'||!passwordValid(body.password)) return NextResponse.json({error:'Mật khẩu không đúng.'},{status:401});
  const response=NextResponse.json({authenticated:true},{headers:{'Cache-Control':'no-store'}});
  setAdminCookie(response);return response;
}
export async function DELETE() {
  const response=NextResponse.json({authenticated:false},{headers:{'Cache-Control':'no-store'}});
  clearAdminCookie(response);return response;
}
