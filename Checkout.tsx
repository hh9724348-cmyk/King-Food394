import { useState } from 'react';
import type { FormEvent } from 'react';
import { MessageCircle } from 'lucide-react';
import type { CartApi } from '../hooks/useCart';
import type { CheckoutForm } from '../types';
import { formatDZD } from '../utils/format';
import { buildOrderMessage, buildWhatsAppUrl } from '../utils/whatsapp';

type Errors = Partial<Record<keyof CheckoutForm | 'cart', string>>;
type Status = 'editing' | 'awaiting' | 'done';

const EMPTY_FORM: CheckoutForm = { fullName: '', phone: '', address: '', notes: '' };

function validate(form: CheckoutForm, itemCount: number): Errors {
  const errors: Errors = {};
  if (itemCount === 0) errors.cart = 'السلة فارغة. أضف منتجاً واحداً على الأقل قبل إتمام الطلب.';
  if (!form.fullName.trim()) errors.fullName = 'الرجاء إدخال الاسم الكامل.';
  const digits = form.phone.replace(/[\s\-+()]/g, '');
  if (!form.phone.trim()) {
    errors.phone = 'الرجاء إدخال رقم الهاتف.';
  } else if (!/^\d{8,15}$/.test(digits)) {
    errors.phone = 'رقم الهاتف غير صالح. أدخل أرقاماً فقط (8 إلى 15 رقماً).';
  }
  if (!form.address.trim()) errors.address = 'الرجاء إدخال العنوان.';
  return errors;
}

export default function Checkout({ cart }: { cart: CartApi }) {
  const [form, setForm] = useState<CheckoutForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>('editing');
  const [waUrl, setWaUrl] = useState('');

  const setField = (key: keyof CheckoutForm, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const found = validate(form, cart.lines.length);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const message = buildOrderMessage(form, cart.lines, cart.totalPrice);
    const url = buildWhatsAppUrl(message);
    setWaUrl(url);
    setStatus('awaiting');
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const confirmSent = () => {
    cart.clear();
    setForm(EMPTY_FORM);
    setErrors({});
    setWaUrl('');
    setStatus('done');
  };

  if (status === 'done') {
    return (
      <section id="checkout" className="section section--alt">
        <div className="container container--narrow">
          <div className="panel panel--center">
            <h2 className="section__title">شكراً لكم</h2>
            <p>تم تفريغ السلة. يمكنكم طلب وجبات جديدة من قائمة الطعام في أي وقت.</p>
            <button type="button" className="btn btn--primary" onClick={() => setStatus('editing')}>
              طلب جديد
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (status === 'awaiting') {
    return (
      <section id="checkout" className="section section--alt">
        <div className="container container--narrow">
          <div className="panel panel--center">
            <h2 className="section__title">أكمل الطلب في واتساب</h2>
            <p>
              فتحنا واتساب مع رسالة الطلب جاهزة. راجع الرسالة ثم اضغط «إرسال» بنفسك.
              لم يُرسل الطلب بعد، وسلتك ما زالت محفوظة.
            </p>
            <a className="btn btn--whatsapp btn--block" href={waUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={18} aria-hidden="true" />
              لم يفتح واتساب؟ افتحه من هنا
            </a>
            <button type="button" className="btn btn--primary btn--block" onClick={confirmSent}>
              نعم، أرسلت الطلب
            </button>
            <button type="button" className="btn btn--ghost btn--block" onClick={() => setStatus('editing')}>
              العودة لتعديل الطلب
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="checkout" className="section section--alt">
      <div className="container container--narrow">
        <h2 className="section__title">إتمام الطلب</h2>
        <p className="section__subtitle">
          {cart.lines.length > 0
            ? `${cart.totalItems} منتج، المجموع ${formatDZD(cart.totalPrice)}`
            : 'أضف وجباتك من القائمة ثم أكمل بياناتك.'}
        </p>

        <form className="panel form" onSubmit={onSubmit} noValidate>
          {errors.cart && <p className="error error--banner" role="alert">{errors.cart}</p>}

          <div className="field">
            <label htmlFor="fullName">الاسم الكامل</label>
            <input
              id="fullName"
              type="text"
              autoComplete="name"
              value={form.fullName}
              onChange={(e) => setField('fullName', e.target.value)}
              aria-invalid={!!errors.fullName}
            />
            {errors.fullName && <p className="error" role="alert">{errors.fullName}</p>}
          </div>

          <div className="field">
            <label htmlFor="phone">رقم الهاتف</label>
            <input
              id="phone"
              type="tel"
              inputMode="tel"
              dir="ltr"
              autoComplete="tel"
              value={form.phone}
              onChange={(e) => setField('phone', e.target.value)}
              aria-invalid={!!errors.phone}
            />
            {errors.phone && <p className="error" role="alert">{errors.phone}</p>}
          </div>

          <div className="field">
            <label htmlFor="address">العنوان</label>
            <input
              id="address"
              type="text"
              autoComplete="street-address"
              value={form.address}
              onChange={(e) => setField('address', e.target.value)}
              aria-invalid={!!errors.address}
            />
            {errors.address && <p className="error" role="alert">{errors.address}</p>}
          </div>

          <div className="field">
            <label htmlFor="notes">ملاحظات إضافية (اختياري)</label>
            <textarea
              id="notes"
              rows={3}
              value={form.notes}
              onChange={(e) => setField('notes', e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn--whatsapp btn--block btn--lg">
            <MessageCircle size={20} aria-hidden="true" />
            اطلب عبر واتساب
          </button>
          <p className="muted small">
            سيفتح واتساب برسالة جاهزة. عليك مراجعتها والضغط على «إرسال» لإتمام الطلب.
          </p>
        </form>
      </div>
    </section>
  );
}
