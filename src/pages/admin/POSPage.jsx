import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Printer } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import Button from '../../components/Button';
import QuantitySelector from '../../components/QuantitySelector';
import './POSPage.css';

export default function POSPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('Tunai');
  const [cashReceived, setCashReceived] = useState('');
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const searchResults = searchTerm.length > 0 
    ? products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || (p.slug && p.slug.toLowerCase().includes(searchTerm.toLowerCase()))).slice(0, 24)
    : products.slice(0, 24);

  const addToCart = (product) => {
    if (product.stock <= 0) {
      alert('Stok produk sudah habis!');
      return;
    }

    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      if (existing.qty >= product.stock) {
        alert('Maksimal stok tercapai!');
        return;
      }
      setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
    setSearchTerm('');
  };

  const updateQty = (id, qty) => {
    setCart(cart.map(item => item.id === id ? { ...item, qty } : item));
  };

  const removeItem = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.discountPrice || item.price) * item.qty, 0);
  const change = cashReceived ? Math.max(0, parseInt(cashReceived) - subtotal) : 0;

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsSubmitting(true);
    
    try {
      const payload = {
        items: cart.map(item => ({
          id: item.id,
          price: item.discountPrice || item.price,
          quantity: item.qty
        })),
        total: subtotal,
        customerName: 'Pesanan Offline',
        channel: 'offline'
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        alert('Transaksi Kasir Berhasil Disimpan di Database!');
        setCart([]);
        setCashReceived('');
        fetchProducts(); // Refresh stock
      } else {
        alert('Gagal menyimpan pesanan');
      }
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan server');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pos-page">
      <div className="pos-layout">
        {/* Left Side: Product Search */}
        <div className="pos-search-section glass">
          <div className="pos-search-header">
            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Kasir (POS)</h2>
            <div style={{ position: 'relative', flexGrow: 1, marginLeft: '1rem' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input 
                type="text" 
                placeholder="Cari produk/SKU..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'rgba(0,0,0,0.2)', color: '#fff', fontSize: '1rem' }}
                autoFocus
              />
            </div>
          </div>
          
          <div className="pos-search-results">
            {searchResults.map(product => (
              <div 
                key={product.id} 
                className={`pos-product-card ${product.stock <= 0 ? 'disabled' : ''}`} 
                onClick={() => product.stock > 0 && addToCart(product)}
                style={{ opacity: product.stock <= 0 ? 0.5 : 1, cursor: product.stock <= 0 ? 'not-allowed' : 'pointer' }}
              >
                <img src={product.images?.[0] || '/products/placeholder.jpg'} alt="" className="pos-product-img" />
                <div className="pos-product-info">
                  <div className="pos-product-name">{product.name}</div>
                  <div className="pos-product-price">{formatPrice(product.discountPrice || product.price)}</div>
                </div>
                <div className="pos-product-stock" style={{ color: product.stock <= 0 ? 'var(--color-error)' : '' }}>
                  {product.stock <= 0 ? 'Habis' : `Stok: ${product.stock}`}
                </div>
              </div>
            ))}
            {searchTerm.length > 0 && searchResults.length === 0 && (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                Produk tidak ditemukan
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Cart & Checkout */}
        <div className="pos-cart-section glass">
          <h3 style={{ margin: '0 0 1rem 0', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>Keranjang Kasir</h3>
          
          <div className="pos-cart-items">
            {cart.map(item => (
              <div key={item.id} className="pos-cart-item">
                <div className="pos-cart-item-info">
                  <div className="pos-cart-item-name">{item.name}</div>
                  <div className="pos-cart-item-price">{formatPrice(item.discountPrice || item.price)}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <QuantitySelector value={item.qty} onChange={(qty) => updateQty(item.id, qty)} size="sm" max={item.stock} />
                  <button onClick={() => removeItem(item.id)} className="admin-action-btn" style={{ color: 'var(--color-error)' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            {cart.length === 0 && (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                Keranjang kosong
              </div>
            )}
          </div>

          <div className="pos-checkout">
            <div className="pos-subtotal">
              <span>Total Tagihan</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary-light)' }}>{formatPrice(subtotal)}</span>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Metode Pembayaran</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {['Tunai', 'QRIS', 'Debit/Kredit'].map(method => (
                  <button 
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`pos-method-btn ${paymentMethod === method ? 'active' : ''}`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {paymentMethod === 'Tunai' && (
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Uang Diterima</label>
                <input 
                  type="number" 
                  value={cashReceived}
                  onChange={(e) => setCashReceived(e.target.value)}
                  placeholder="Misal: 100000"
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'rgba(0,0,0,0.2)', color: '#fff', fontSize: '1rem' }}
                />
                {cashReceived && parseInt(cashReceived) >= subtotal && (
                  <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', color: 'var(--color-success)' }}>
                    <span>Kembalian:</span>
                    <span style={{ fontWeight: 600 }}>{formatPrice(change)}</span>
                  </div>
                )}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
              <Button variant="secondary" icon={Printer} disabled={cart.length === 0} style={{ flex: 1 }}>Struk</Button>
              <Button variant="primary" onClick={handleCheckout} disabled={cart.length === 0} style={{ flex: 2 }}>Bayar & Selesai</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
