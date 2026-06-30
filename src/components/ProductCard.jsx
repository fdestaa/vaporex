import React from 'react';
import { Package, Star, ShoppingCart } from 'lucide-react';
import useCartStore from '../store/useCartStore';
import useToastStore from '../store/useToastStore';
import { formatPrice, getDiscountPercentage } from '../utils/formatters';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const addItem = useCartStore((state) => state.addItem);
  const addToast = useToastStore((state) => state.addToast);

  const handleQuickAdd = (e) => {
    e.preventDefault(); // Prevent navigating to product detail
    
    if (product.stock <= 0) {
      addToast('Stok produk habis', 'error');
      return;
    }

    if (product.variants && product.variants.length > 0) {
      // If product has variants, navigating to details is better, but for quick add we can pick the first available variant
      const availableVariant = product.variants.find(v => v.stock > 0);
      if (availableVariant) {
        addItem(product, availableVariant, 1);
        addToast(`${product.name} (${availableVariant.name}) ditambahkan ke keranjang`, 'success');
      } else {
         addToast('Semua varian habis', 'error');
      }
    } else {
      addItem(product, null, 1);
      addToast(`${product.name} ditambahkan ke keranjang`, 'success');
    }
  };

  const discountPercent = getDiscountPercentage(product.price, product.discountPrice);

  const sales = product.salesCount || 0;
  const computedRating = sales > 0 ? (4.3 + ((product.id * 13) % 8) / 10).toFixed(1) : '0.0';
  const ratio = 0.3 + (((product.id * 7) % 7) / 10);
  const reviewCount = sales > 0 ? Math.max(1, Math.floor(sales * ratio)) : 0;

  return (
    <div className={`product-card glass ${product.stock <= 0 ? 'out-of-stock' : ''}`}>
      <div className="product-card__image-container">
        {product.images && product.images.length > 0 ? (
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="product-card__img" 
            onError={(e) => {
              e.target.onerror = null; 
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'flex';
            }} 
          />
        ) : null}
        <div className="product-card__placeholder" style={{ display: product.images && product.images.length > 0 ? 'none' : 'flex' }}>
          <Package size={48} color="var(--color-text-muted)" />
        </div>

        <div className="product-card__badges">
          {product.isNew && <span className="badge badge--success">Baru</span>}
          {discountPercent > 0 && <span className="badge badge--danger">Sale {discountPercent}%</span>}
          {product.stock <= 0 && <span className="badge badge--muted">Habis</span>}
        </div>

        <button 
          className="product-card__quick-add vpr-btn vpr-btn--primary vpr-btn--sm"
          onClick={handleQuickAdd}
          disabled={product.stock <= 0}
        >
          <ShoppingCart size={16} />
          {product.stock <= 0 ? 'Habis' : 'Tambah'}
        </button>
      </div>

      <div className="product-card__content">
        <div className="product-card__category">{product.category?.name || 'Uncategorized'}</div>
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__brand">{product.brand || 'VapoRex'}</p>
        
        <div className="product-card__footer">
          <div className="product-card__price-wrapper">
            {product.discountPrice ? (
              <>
                <span className="product-card__price product-card__price--discount">
                  {formatPrice(product.discountPrice)}
                </span>
                <span className="product-card__price-original">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="product-card__price">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          <div className="product-card__rating" style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
            {sales > 0 ? (
              <>
                <span style={{ color: 'var(--color-text-muted)' }}>{sales} Terjual</span>
                <span style={{ color: 'var(--color-border)' }}>•</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <Star size={12} fill="var(--color-warning)" color="var(--color-warning)" />
                  <span style={{ fontWeight: 500 }}>{computedRating}</span>
                  <span style={{ color: 'var(--color-text-muted)' }}>({reviewCount})</span>
                </div>
              </>
            ) : (
              <span style={{ color: 'var(--color-text-muted)' }}>Belum ada ulasan</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
