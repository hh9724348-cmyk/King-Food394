import { useEffect } from 'react';
import { Minus, Plus, Trash2, X } from 'lucide-react';
import type { CartApi } from '../hooks/useCart';
import { formatDZD } from '../utils/format';

interface Props {
  open: boolean;
  cart: CartApi;
  onClose: () => void;
  onCheckout: () => void;
}

export default function Cart({ open, cart, onClose, onCheckout }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  const isEmpty = cart.lines.length === 0;

  return (
    <>
      <div
        className={`overlay ${open ? 'overlay--open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`drawer ${open ? 'drawer--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="سلة المشتريات"
        aria-hidden={!open}
      >
        <div className="drawer__head">
          <h2>سلة المشتريات ({cart.totalItems})</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="إغلاق السلة">
            <X size={22} aria-hidden="true" />
          </button>
        </div>

        <div className="drawer__body">
          {isEmpty ? (
            <p className="empty">سلتك فارغة. أضف وجباتك المفضلة من قائمة الطعام.</p>
          ) : (
            <ul className="lines">
              {cart.lines.map((l) => (
                <li key={l.product.id} className="line">
                  <div className="line__info">
                    <strong>{l.product.name}</strong>
                    <span className="muted">{formatDZD(l.product.price)} للوحدة</span>
                    <span className="line__subtotal">{formatDZD(l.subtotal)}</span>
                  </div>
                  <div className="line__actions">
                    <div className="qty qty--sm">
                      <button type="button" className="qty__btn" onClick={() => cart.decrease(l.product.id)} aria-label={`إنقاص كمية ${l.product.name}`}>
                        <Minus size={16} aria-hidden="true" />
                      </button>
                      <span className="qty__value">{l.quantity}</span>
                      <button type="button" className="qty__btn" onClick={() => cart.add(l.product.id)} aria-label={`زيادة كمية ${l.product.name}`}>
                        <Plus size={16} aria-hidden="true" />
                      </button>
                    </div>
                    <button type="button" className="icon-btn icon-btn--danger" onClick={() => cart.remove(l.product.id)} aria-label={`حذف ${l.product.name}`}>
                      <Trash2 size={18} aria-hidden="true" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {!isEmpty && (
          <div className="drawer__foot">
            <div className="total">
              <span>المجموع</span>
              <strong>{formatDZD(cart.totalPrice)}</strong>
            </div>
            <button type="button" className="btn btn--primary btn--block" onClick={onCheckout}>
              إتمام الطلب
            </button>
            <button type="button" className="btn btn--ghost btn--block" onClick={cart.clear}>
              تفريغ السلة
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
