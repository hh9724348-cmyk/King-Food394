import { MessageCircle } from 'lucide-react';
import { LOGO_URL, WHATSAPP_NUMBER } from '../data/products';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <img className="brand__logo" src={LOGO_URL} alt="شعار كينغ فود" width={56} height={56} loading="lazy" />
        <div className="footer__text">
          <strong>KING FOOD | كينغ فود</strong>
          <p>وجبات سريعة بنكهة لا تُنسى. اختر وجبتك وأرسل طلبك عبر واتساب.</p>
          <a
            className="footer__wa"
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={18} aria-hidden="true" />
            واتساب: <span dir="ltr">+{WHATSAPP_NUMBER}</span>
          </a>
        </div>
      </div>
      <p className="footer__copy">© {new Date().getFullYear()} KING FOOD. جميع الحقوق محفوظة.</p>
    </footer>
  );
}
