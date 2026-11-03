import { ShoppingCart } from 'lucide-react';
import { LOGO_URL } from '../data/products';

interface Props {
  cartCount: number;
  onCartClick: () => void;
}

export default function Header({ cartCount, onCartClick }: Props) {
  return (
    <header className="header">
      <div className="container header__inner">
        <a className="brand" href="#top" aria-label="KING FOOD | كينغ فود">
          <img className="brand__logo" src={LOGO_URL} alt="شعار كينغ فود" width={48} height={48} />
          <span className="brand__names">
            <span className="brand__en">KING FOOD</span>
            <span className="brand__ar">كينغ فود</span>
          </span>
        </a>
        <button
          type="button"
          className="cart-btn"
          onClick={onCartClick}
          aria-label={`سلة المشتريات، ${cartCount} منتج`}
        >
          <ShoppingCart size={22} aria-hidden="true" />
          {cartCount > 0 && <span className="cart-btn__badge">{cartCount}</span>}
        </button>
      </div>
    </header>
  );
}
