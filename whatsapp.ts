import { WHATSAPP_NUMBER } from '../data/products';
import type { CartLine, CheckoutForm } from '../types';
import { formatDZD } from './format';

export function buildOrderMessage(
  form: CheckoutForm,
  lines: CartLine[],
  total: number,
): string {
  const details = lines
    .map((l) => `${l.product.name} × ${l.quantity} = ${formatDZD(l.subtotal)}`)
    .join('\n');
  const notes = form.notes.trim() || 'لا توجد';

  return [
    'طلب جديد من KING FOOD',
    '',
    'معلومات الزبون:',
    '',
    `الاسم: ${form.fullName.trim()}`,
    `رقم الهاتف: ${form.phone.trim()}`,
    `العنوان: ${form.address.trim()}`,
    '',
    'تفاصيل الطلب:',
    '',
    details,
    '',
    `المجموع النهائي: ${formatDZD(total)}`,
    '',
    `ملاحظات: ${notes}`,
  ].join('\n');
}

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
