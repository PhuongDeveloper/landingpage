import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || '';
  let database: Record<string, { status: string; code?: string; message?: string }> = {};
  if (url && key) {
    try {
      const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
      const tables = ['products','categories','articles','leads','orders','site_config'] as const;
      const results = await Promise.all(tables.map(async table => {
        const result = await client.from(table).select('id', { head: true, count: 'exact' });
        return [table, result.error ? { status: 'error', code: result.error.code, message: result.error.message.slice(0,180) } : { status: 'ok' }] as const;
      }));
      database = Object.fromEntries(results);
    } catch {
      database = { connection: { status: 'error' } };
    }
  }
  return NextResponse.json({
    supabaseUrl: Boolean(url),
    urlLooksPlaceholder: /placeholder|your.project|example/i.test(url),
    anonKey: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    serverKey: Boolean(key),
    database,
  }, { headers: { 'Cache-Control': 'no-store' } });
}
