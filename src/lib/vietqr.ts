import 'server-only';
import type { Order, SiteConfig } from '@/types';

// VietQR Quick Link allows up to 50 unaccented letters in addInfo.
// Keep the immutable order code and phone intact, then use the remaining space for the address.
export function vietQrTransfer(order: Order, config: SiteConfig) {
  const bankBin = (config.bankBin || '').trim();
  const accountNo = (config.bankAccountNo || '').trim();
  const accountName = (config.bankAccountName || '').trim();
  if (!/^\d{6}$/.test(bankBin) || !/^[A-Za-z0-9]{6,19}$/.test(accountNo) || !accountName) return null;
  const normalize = (value:string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/gi,'d').replace(/[^A-Za-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
  const code = normalize(order.orderCode).replace(/ /g,'');
  const phone = normalize(order.customerPhone).replace(/ /g,'');
  const prefix = `${code} ${phone}`;
  const room = Math.max(0, 50 - prefix.length - 1);
  const address = normalize(order.shippingAddress).slice(0,room).trimEnd();
  const transferNote = address ? `${prefix} ${address}` : prefix;
  const url = new URL(`https://img.vietqr.io/image/${bankBin}-${accountNo}-compact2.png`);
  url.searchParams.set('amount', String(Math.round(order.total)));
  url.searchParams.set('addInfo', transferNote);
  url.searchParams.set('accountName', accountName);
  return { imageUrl:url.toString(), transferNote, fullReference:`${order.orderCode} - ${order.customerPhone} - ${order.shippingAddress}` };
}
