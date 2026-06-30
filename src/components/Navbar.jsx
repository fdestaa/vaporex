import { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router';
import { ShoppingCart, Search, User, Menu, X, LogOut, ChevronDown } from 'lucide-react';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import './Navbar.css';

const NAV_ITEMS = [
  { label: 'Home', to: '/' },
  { label: 'Produk', to: '/shop' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  const totalItems = useCartStore((s) => s.getTotalItems());
  const openCart = useCartStore((s) => s.openCart);

  const { user, isAuthenticated, logout } = useAuthStore();

  /* ---- scroll detection ---- */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ---- close dropdown on outside click ---- */
  useEffect(() => {
    const onClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  /* ---- lock body scroll when mobile menu is open ---- */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
        <div className="navbar__inner">
          {/* --- Logo --- */}
          <Link to="/" className="navbar__logo" aria-label="VapoRex Beranda">
            VapoRex
          </Link>

          {/* --- Desktop nav links (center) --- */}
          <ul className="navbar__links">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `navbar__link ${isActive ? 'active' : ''}`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* --- Right actions --- */}
          <div className="navbar__actions">
            {/* Login / User Profile */}
            {isAuthenticated ? (
              <div className="navbar__user-menu" ref={dropdownRef}>
                <button
                  className="navbar__icon-btn"
                  onClick={() => setDropdownOpen((v) => !v)}
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  <User />
                </button>

                {dropdownOpen && (
                  <div className="navbar__dropdown" role="menu">
                    <Link
                      to="/account"
                      className="navbar__dropdown-link"
                      role="menuitem"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <User /> Profil
                    </Link>
                    <div className="navbar__dropdown-divider" />
                    <button
                      className="navbar__dropdown-link navbar__dropdown-link--danger"
                      role="menuitem"
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                      }}
                    >
                      <LogOut /> Keluar
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="navbar__icon-btn" aria-label="Masuk">
                <User />
              </Link>
            )}

            {/* Cart */}
            <button
              className="navbar__icon-btn"
              onClick={openCart}
              aria-label="Keranjang belanja"
            >
              <ShoppingCart />
              {totalItems > 0 && (
                <span className="navbar__badge">{totalItems > 99 ? '99+' : totalItems}</span>
              )}
            </button>

            {/* Hamburger (mobile) */}
            <button
              className="navbar__icon-btn navbar__hamburger"
              onClick={() => setMobileOpen(true)}
              aria-label="Buka menu"
            >
              <Menu />
            </button>
          </div>
        </div>
      </nav>

      {/* ============================================================
          Mobile Menu Drawer
          ============================================================ */}
      {mobileOpen && (
        <>
          <div className="mobile-menu__backdrop" onClick={closeMobile} />

          <aside className="mobile-menu" aria-label="Menu navigasi">
            {/* header */}
            <div className="mobile-menu__header">
              <span className="mobile-menu__logo">VapoRex</span>
              <button
                className="mobile-menu__close"
                onClick={closeMobile}
                aria-label="Tutup menu"
              >
                <X size={22} />
              </button>
            </div>

            {/* nav links */}
            <nav className="mobile-menu__nav">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `mobile-menu__link ${isActive ? 'active' : ''}`
                  }
                  onClick={closeMobile}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* auth area */}
            <div className="mobile-menu__footer">
              {isAuthenticated ? (
                <>
                  <div className="mobile-menu__user">
                    <span className="mobile-menu__user-avatar">
                      {getInitials(user?.name)}
                    </span>
                    <div className="mobile-menu__user-info">
                      <span className="mobile-menu__user-name">{user?.name}</span>
                      <span className="mobile-menu__user-email">{user?.email}</span>
                    </div>
                  </div>

                  <NavLink
                    to="/account"
                    className="mobile-menu__link"
                    onClick={closeMobile}
                  >
                    Profil Saya
                  </NavLink>

                  <button
                    className="mobile-menu__logout-btn"
                    onClick={() => {
                      logout();
                      closeMobile();
                    }}
                  >
                    <LogOut /> Keluar
                  </button>
                </>
              ) : (
                <Link to="/login" className="mobile-menu__auth-link" onClick={closeMobile}>
                  <User size={18} /> Masuk / Daftar
                </Link>
              )}
            </div>
          </aside>
        </>
      )}
    </>
  );
}
