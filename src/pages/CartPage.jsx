import React from 'react';
import { useNavigate } from 'react-router';
import useCartStore from '../store/useCartStore';
import QuantitySelector from '../components/QuantitySelector';
import Button from '../components/Button';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import './CartPage.css';

const CartPage = () => {
  const navigate = useNavigate();
  const { items, removeItem, updateQty, getSubtotal, getTotalDiscount } = useCartStore();
  
  const discount = getTotalDiscount();
  const subtotal = getSubtotal();
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price).replace(/\s/g, ' ');
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const totalOriginal = items.reduce((sum, item) => sum + item.originalPrice * item.qty, 0);

  if (items.length === 0) {
    return (
      <div className="cart-page empty">
        <div className="container">
          <div className="empty-cart-content">
            <ShoppingBag size={64} className="empty-icon" />
            <h2>Keranjang Belanja Kosong</h2>
            <p>Sepertinya Anda belum menambahkan produk apapun ke keranjang.</p>
            <Button onClick={() => navigate('/products')} size="large">
              Mulai Belanja
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="page-title">Keranjang Belanja</h1>
        
        <div className="cart-layout">
          <div className="cart-items-section">
            <div className="cart-items-header">
              <div className="col-product">Produk</div>
              <div className="col-price">Harga</div>
              <div className="col-qty">Kuantitas</div>
              <div className="col-total">Total</div>
              <div className="col-action"></div>
            </div>
            
            <div className="cart-items-list">
              {items.map((item) => (
                <div key={`${item.productId}-${item.variantId}`} className="cart-item">
                  <div className="item-product">
                    <img src={item.image || '/products/placeholder.jpg'} alt={item.name} className="item-image" />
                    <div className="item-info">
                      <h3 className="item-name">{item.name}</h3>
                      {item.variant && <span className="item-variant">Varian: {item.variant}</span>}
                    </div>
                  </div>
                  
                  <div className="item-price">
                    {item.originalPrice > item.price && (
                      <span className="price-original">{formatPrice(item.originalPrice)}</span>
                    )}
                    <span className="price-current">{formatPrice(item.price)}</span>
                  </div>
                  
                  <div className="item-qty">
                    <QuantitySelector 
                      value={item.qty} 
                      onChange={(newQty) => updateQty(item.productId, item.variantId, newQty)} 
                      max={item.stock} 
                    />
                  </div>
                  
                  <div className="item-total">
                    {formatPrice(item.price * item.qty)}
                  </div>
                  
                  <div className="item-action">
                    <button 
                      className="remove-btn"
                      onClick={() => removeItem(item.productId, item.variantId)}
                      title="Hapus item"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="order-summary-section">
            <div className="summary-card">
              <h2>Ringkasan Pesanan</h2>
              
              <div className="summary-row">
                <span>Subtotal ({items.reduce((acc, item) => acc + item.qty, 0)} barang)</span>
                <span>{formatPrice(totalOriginal)}</span>
              </div>
              
              {discount > 0 && (
                <div className="summary-row discount">
                  <span>Total Diskon</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              
              <div className="summary-divider"></div>
              
              <div className="summary-row total">
                <span>Total Estimasi</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              
              <Button 
                variant="primary" 
                fullWidth 
                size="large" 
                className="checkout-btn"
                onClick={handleCheckout}
                icon={<ArrowRight size={20} />}
                iconPosition="right"
              >
                Lanjut ke Pembayaran
              </Button>
              
              <Button 
                variant="outline" 
                fullWidth 
                onClick={() => navigate('/products')}
                style={{ marginTop: '1rem' }}
              >
                Lanjut Belanja
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
