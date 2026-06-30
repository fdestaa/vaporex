import React from 'react';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import useCartStore from '../store/useCartStore';
import Button from './Button';
import QuantitySelector from './QuantitySelector';
import { formatPrice } from '../utils/formatters';
import './CartDrawer.css';

export default function CartDrawer() {
  const { isCartOpen, closeCart, items, removeItem, updateQty, getSubtotal } = useCartStore();
  const navigate = useNavigate();
  const subtotal = getSubtotal();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  const handleViewCart = () => {
    closeCart();
    navigate('/cart');
  };

  return (
    <>
      <div className="cart-drawer__backdrop fadeIn" onClick={closeCart}></div>
      <div className="cart-drawer glass slideInRight">
        <div className="cart-drawer__header">
          <h2 className="cart-drawer__title">Keranjang Belanja</h2>
          <button className="cart-drawer__close" onClick={closeCart}>
            <X size={24} />
          </button>
        </div>

        <div className="cart-drawer__content">
          {items.length === 0 ? (
            <div className="cart-drawer__empty">
              <div className="cart-drawer__empty-icon">
                <ShoppingBag size={48} />
              </div>
              <h3>Keranjang Anda Kosong</h3>
              <p>Temukan produk vapor favorit Anda sekarang!</p>
              <Button onClick={() => { closeCart(); navigate('/shop'); }}>
                Belanja Sekarang
              </Button>
            </div>
          ) : (
            <ul className="cart-drawer__list">
              {items.map((item) => (
                <li key={`${item.productId}-${item.variantId}`} className="cart-drawer__item">
                  <img src={item.image || '/products/placeholder.jpg'} alt={item.name} className="cart-drawer__item-img" />
                  
                  <div className="cart-drawer__item-details">
                    <h4 className="cart-drawer__item-name">{item.name}</h4>
                    {item.variant && <span className="cart-drawer__item-variant">{item.variant}</span>}
                    <div className="cart-drawer__item-price">{formatPrice(item.price)}</div>
                    
                    <div className="cart-drawer__item-actions">
                      <QuantitySelector 
                        value={item.qty} 
                        onChange={(qty) => updateQty(item.productId, item.variantId, qty)} 
                        max={item.stock}
                        size="sm"
                      />
                      <button 
                        className="cart-drawer__item-remove"
                        onClick={() => removeItem(item.productId, item.variantId)}
                        title="Hapus"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-drawer__footer">
            <div className="cart-drawer__subtotal">
              <span>Subtotal</span>
              <span className="cart-drawer__subtotal-value">{formatPrice(subtotal)}</span>
            </div>
            <div className="cart-drawer__footer-actions">
              <Button variant="primary" fullWidth onClick={handleCheckout}>
                Checkout
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
