import { useState } from 'react';
import { Minus, Plus, ShoppingCart, UtensilsCrossed } from 'lucide-react';
import type { Product } from '../types';
import { formatDZD } from '../utils/format';

interface Props {
  product: Product;
  quantity: number;
  onAdd: () => void;
  onDecrease: () => void;
}

export default function ProductCard({ product, quantity, onAdd, onDecrease }: Props) {
  const [failed, setFailed] = useState(false);

  return (
    <article className="card">
      <div className="card__media">
        {failed ? (
          <div className="card__fallback" role="img" aria-label={product.name}>
            <UtensilsCrossed size={40} aria-hidden="true" />
          </div>
        ) : (
          <img
            src={product.image}
            alt={product.name}
            width={600}
            height={450}
            loading="lazy"
            onError={() => setFailed(true)}
          />
        )}
      </div>
      <div className="card__body">
        <h3 className="card__name">{product.name}</h3>
        <p className="card__price">{formatDZD(product.price)}</p>
        {quantity > 0 ? (
          <div className="qty" role="group" aria-label={`كمية ${product.name}`}>
            <button type="button" className="qty__btn" onClick={onDecrease} aria-label="إنقاص الكمية">
              <Minus size={18} aria-hidden="true" />
            </button>
            <span className="qty__value" aria-live="polite">{quantity}</span>
            <button type="button" className="qty__btn" onClick={onAdd} aria-label="زيادة الكمية">
              <Plus size={18} aria-hidden="true" />
            </button>
          </div>
        ) : (
          <button type="button" className="btn btn--primary btn--block" onClick={onAdd}>
            <ShoppingCart size={18} aria-hidden="true" />
            أضف إلى السلة
          </button>
        )}
      </div>
    </article>
  );
}
