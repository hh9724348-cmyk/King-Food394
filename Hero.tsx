import { HERO_IMAGE_URL } from '../data/products';

export default function Hero() {
  const scrollToMenu = () => {
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      id="top"
      className="hero"
      style={{ backgroundImage: `url("${HERO_IMAGE_URL}")` }}
    >
      <div className="hero__overlay" />
      <div className="container hero__content">
        <h1 className="hero__title">مرحباً بكم في KING FOOD</h1>
        <p className="hero__text">أشهى الوجبات السريعة، طعم لا يُنسى.</p>
        <button type="button" className="btn btn--primary btn--lg" onClick={scrollToMenu}>
          اكتشف القائمة
        </button>
      </div>
    </section>
  );
}
