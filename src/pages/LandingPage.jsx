import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { ChevronRight, Truck, ShieldCheck, Clock, Tag, Star } from 'lucide-react';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import { promos } from '../data/promos';
import { testimonials } from '../data/testimonials';
import './LandingPage.css';

const LandingPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories')
        ]);
        const prodData = await prodRes.json();
        const catData = await catRes.json();
        setProducts(prodData);
        setCategories(catData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const bestSellers = [...products].sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0)).slice(0, 4);
  const newProducts = [...products].sort((a, b) => b.id - a.id).slice(0, 4);
  const featuredCategories = categories.slice(0, 4);
  const activePromos = promos.filter(p => p.isActive);

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Memuat halaman...</div>;
  }

  return (
    <div className="landing-page">
      {/* Hero Banner */}
      <section className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '2rem', paddingBottom: '2rem' }}>
        <div style={{ width: '100%', maxWidth: '1200px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', marginBottom: '2rem' }}>
          <img src="/hero_vapes.png" alt="VapoRex Premium Collection" style={{ width: '100%', height: 'auto', display: 'block', border: '1px solid var(--color-border)' }} />
        </div>
        <div className="hero-actions" style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap', width: '100%' }}>
          <Link to="/shop" className="hero-btn-primary" style={{ minWidth: '200px', textAlign: 'center' }}>
            Belanja Sekarang
          </Link>
          <Link to="/shop?promo=true" className="hero-btn-secondary" style={{ minWidth: '200px', textAlign: 'center' }}>
            Promo Khusus
          </Link>
        </div>
      </section>

      {/* Keunggulan */}
      <section className="features-section container">
        <div className="feature-item">
          <div className="feature-icon"><Truck /></div>
          <div className="feature-text">
            <h3>Pengiriman Cepat</h3>
            <p>Ke seluruh Indonesia</p>
          </div>
        </div>
        <div className="feature-item">
          <div className="feature-icon"><ShieldCheck /></div>
          <div className="feature-text">
            <h3>100% Original</h3>
            <p>Jaminan barang asli</p>
          </div>
        </div>
        <div className="feature-item">
          <div className="feature-icon"><Clock /></div>
          <div className="feature-text">
            <h3>CS 24/7</h3>
            <p>Siap membantu Anda</p>
          </div>
        </div>
        <div className="feature-item">
          <div className="feature-icon"><Tag /></div>
          <div className="feature-text">
            <h3>Harga Terbaik</h3>
            <p>Diskon & promo menarik</p>
          </div>
        </div>
      </section>

      {/* Kategori Pilihan */}
      <section className="categories-section container">
        <div className="section-header">
          <h2 className="section-title">Kategori Pilihan</h2>
          <Link to="/shop" className="view-all-link">Lihat Semua <ChevronRight size={16} /></Link>
        </div>
        <div className="categories-grid">
          {featuredCategories.map(category => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* Promo Section */}
      {activePromos.length > 0 && (
        <section className="promos-section container">
          <div className="section-header">
            <h2 className="section-title">Promo Menarik</h2>
          </div>
          <div className="promos-grid">
            {activePromos.map(promo => (
              <div key={promo.id} className="promo-card">
                <img src={promo.image} alt={promo.title} className="promo-img" />
                <div className="promo-content">
                  <span className="promo-badge">Kode: {promo.code}</span>
                  <h3>{promo.title}</h3>
                  <p>{promo.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Produk Terlaris */}
      <section className="products-section container">
        <div className="section-header">
          <h2 className="section-title">Produk Terlaris</h2>
          <Link to="/shop?sort=best-selling" className="view-all-link">Lihat Semua <ChevronRight size={16} /></Link>
        </div>
        <div className="products-grid">
          {bestSellers.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Produk Terbaru */}
      <section className="products-section container">
        <div className="section-header">
          <h2 className="section-title">Produk Terbaru</h2>
          <Link to="/shop?sort=newest" className="view-all-link">Lihat Semua <ChevronRight size={16} /></Link>
        </div>
        <div className="products-grid">
          {newProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Testimoni */}
      <section className="testimonials-section container">
        <div className="section-header">
          <h2 className="section-title">Apa Kata Mereka</h2>
        </div>
        <div className="testimonials-grid">
          {testimonials.slice(0, 3).map(testimonial => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="testimonial-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={i < testimonial.rating ? "var(--color-warning)" : "none"} color={i < testimonial.rating ? "var(--color-warning)" : "var(--text-muted)"} />
                ))}
              </div>
              <p className="testimonial-text">"{testimonial.text}"</p>
              <div className="testimonial-author">
                <div className="author-avatar">{testimonial.name ? testimonial.name.charAt(0) : '?'}</div>
                <span>{testimonial.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
