import { products } from '../data/products';
import type { CartApi } from '../hooks/useCart';
import ProductCard from './ProductCard';

export default function Menu({ cart }: { cart: CartApi }) {
  return (
    <section id="menu" className="section">
      <div className="container">
        <h2 className="section__title">قائمة الطعام</h2>
        <p className="section__subtitle">اختار وجبتك المفضلة</p>
        <div className="grid">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              quantity={cart.getQuantity(p.id)}
              onAdd={() => cart.add(p.id)}
              onDecrease={() => cart.decrease(p.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
