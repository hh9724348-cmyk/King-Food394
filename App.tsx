import { useState } from 'react';
import { useCart } from './hooks/useCart';
import Header from './components/Header';
import Hero from './components/Hero';
import Menu from './components/Menu';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Footer from './components/Footer';

export default function App() {
  const cart = useCart();
  const [cartOpen, setCartOpen] = useState(false);

  const goToCheckout = () => {
    setCartOpen(false);
    window.setTimeout(() => {
      document
        .getElementById('checkout')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  return (
    <>
      <Header cartCount={cart.totalItems} onCartClick={() => setCartOpen(true)} />
      <main>
        <Hero />
        <Menu cart={cart} />
        <Checkout cart={cart} />
      </main>
      <Footer />
      <Cart
        open={cartOpen}
        cart={cart}
        onClose={() => setCartOpen(false)}
        onCheckout={goToCheckout}
      />
    </>
  );
}
