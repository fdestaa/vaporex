import { Link } from 'react-router';
import { MapPin, Phone, Mail, Clock, Camera, Globe, MessageCircle } from 'lucide-react';
import './Footer.css';

const MENU_LINKS = [
  { label: 'Beranda', to: '/' },
  { label: 'Produk', to: '/shop' },
];

const INFO_LINKS = [
  { label: 'Kebijakan Privasi', to: '/privacy' },
  { label: 'Syarat & Ketentuan', to: '/terms' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Cara Pemesanan', to: '/how-to-order' },
  { label: 'Tentang Kami', to: '/about' },
  { label: 'Kontak', to: '/contact' },
];

const SOCIALS = [
  { Icon: Camera, label: 'Instagram', url: 'https://instagram.com/' },
  { Icon: MessageCircle, label: 'WhatsApp', url: 'https://wa.me/6281234567890' },
];

export default function Footer() {
  return (
    <footer className="footer">
      {/* ---- Main 4-column content ---- */}
      <div className="footer__main">
        {/* Col 1 — Brand */}
        <div>
          <div className="footer__brand-logo">VapoRex</div>
          <p className="footer__tagline">
            Toko vape online terpercaya dengan produk original dan harga terbaik.
          </p>
          <div className="footer__socials">
            {SOCIALS.map(({ Icon, label, url }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social-btn"
                aria-label={label}
                title={label}
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* Col 2 — Menu */}
        <div>
          <h4 className="footer__heading">Menu</h4>
          <ul className="footer__list">
            {MENU_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="footer__link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 — Informasi */}
        <div>
          <h4 className="footer__heading">Informasi</h4>
          <ul className="footer__list">
            {INFO_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="footer__link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4 — Kontak */}
        <div>
          <h4 className="footer__heading">Hubungi Kami</h4>

          <div className="footer__contact-item">
            <MapPin className="footer__contact-icon" />
            <span>Jl. Vape Street No. 42, Jakarta Selatan</span>
          </div>

          <div className="footer__contact-item">
            <Phone className="footer__contact-icon" />
            <span>+62 812-3456-7890</span>
          </div>

          <div className="footer__contact-item">
            <Mail className="footer__contact-icon" />
            <span>hello@vaporex.id</span>
          </div>

          <div className="footer__contact-item">
            <Clock className="footer__contact-icon" />
            <span>Senin – Sabtu, 10:00 – 21:00</span>
          </div>
        </div>
      </div>

      {/* ---- Health Disclaimer ---- */}
      <div className="footer__disclaimer">
        <div className="footer__disclaimer-inner">
          <span className="footer__disclaimer-icon" aria-hidden="true"></span>
          <p>
            <strong>Peringatan:</strong> Produk ini mengandung nikotin yang bersifat adiktif.
            Hanya untuk pengguna berusia 18 tahun ke atas.
          </p>
        </div>
      </div>

      {/* ---- Bottom Bar ---- */}
      <div className="footer__bottom">
        © {new Date().getFullYear()} VapoRex. Semua hak dilindungi.
      </div>
    </footer>
  );
}
