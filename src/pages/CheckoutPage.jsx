import React from 'react';
import { useNavigate } from 'react-router';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import Button from '../components/Button';
import { formatPrice } from '../utils/formatters';
import './CheckoutPage.css';

export default function CheckoutPage() {
  const { items, getSubtotal, getTotalDiscount, clearCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [shippingMethod, setShippingMethod] = React.useState('jne');
  const [paymentMethod, setPaymentMethod] = React.useState('qris');

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '40px 0', textAlign: 'center' }}>
        <h2>Keranjang Anda kosong</h2>
        <Button onClick={() => navigate('/shop')}>Kembali ke Toko</Button>
      </div>
    );
  }

  const subtotal = getSubtotal();
  const discount = getTotalDiscount();
  const isFreeShipping = subtotal >= 150000;
  const shippingCost = isFreeShipping ? 0 : (shippingMethod === 'jne' ? 15000 : 22000);
  
  // Generate a random 3-digit unique code for manual bank transfers
  const uniqueCode = React.useMemo(() => Math.floor(100 + Math.random() * 900), []);
  const baseTotal = subtotal + shippingCost - discount;
  const total = baseTotal + uniqueCode;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Silakan login terlebih dahulu untuk checkout');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Safely extract customer details
      let custName = 'Pelanggan Online';
      let custPhone = '';
      let shipAddress = '';

      if (e.target && e.target.elements) {
        custName = e.target.elements[0]?.value || 'Pelanggan Online';
        custPhone = e.target.elements[2]?.value || '';
        shipAddress = e.target.elements[3]?.value || '';
      } else if (user) {
        custName = user.name || 'Pelanggan Online';
        custPhone = user.phone || '';
        shipAddress = user.address || '';
      }

      const payload = {
        userId: user?.id || null,
        items: items.map(item => ({
          id: parseInt(item.productId || item.id, 10) || 0,
          price: parseInt(item.price, 10) || 0,
          quantity: parseInt(item.qty, 10) || 1
        })),
        total: parseInt(total, 10) || 0,
        customerName: custName,
        customerPhone: custPhone,
        shippingAddress: shipAddress,
        channel: 'online',
        shippingMethod: shippingMethod,
        paymentMethod: paymentMethod
      };
      
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (res.ok) {
        clearCart();
        navigate(`/payment/${data.orderNumber}`);
      } else {
        alert(data.error || 'Gagal membuat pesanan');
      }
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan pada sistem');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="checkout-page container">
      <div className="checkout-page__header">
        <h1>Checkout</h1>
        <p>Selesaikan pesanan Anda</p>
      </div>
      
      <div className="checkout-page__layout">
        <div className="checkout-page__form-section">
          {!isAuthenticated && (
            <div className="glass" style={{ padding: '24px', marginBottom: '24px', borderRadius: 'var(--radius-md)' }}>
              <h3>Belum login?</h3>
              <p style={{ marginBottom: '16px', color: 'var(--color-text-muted)' }}>Login sekarang untuk pengalaman checkout yang lebih cepat dan mudah.</p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <Button onClick={() => navigate('/login?redirect=/checkout')} variant="primary" size="sm">Login</Button>
                <Button onClick={() => navigate('/register?redirect=/checkout')} variant="outline" size="sm">Daftar</Button>
              </div>
            </div>
          )}
          
          <form id="checkout-form" className="glass" onSubmit={handlePlaceOrder}>
            <h3>Informasi Pengiriman</h3>
            <div className="form-group">
              <label>Nama Lengkap</label>
              <input type="text" required defaultValue={user?.name || ''} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input type="email" required defaultValue={user?.email || ''} />
              </div>
              <div className="form-group">
                <label>Nomor HP</label>
                <input type="tel" required defaultValue={user?.phone || ''} />
              </div>
            </div>
            <div className="form-group">
              <label>Alamat Lengkap</label>
              <textarea required rows={3} defaultValue={user?.address || ''}></textarea>
            </div>
            
            <h3 style={{ marginTop: '32px' }}>Metode Pengiriman</h3>
            {isFreeShipping ? (
              <div style={{ marginBottom: '16px', padding: '12px', background: 'rgba(34, 211, 238, 0.1)', color: 'var(--color-primary-light)', borderRadius: '8px', border: '1px solid rgba(34, 211, 238, 0.3)' }}>
                🎉 Selamat! Anda mendapatkan Gratis Ongkir karena belanja di atas Rp 150.000.
              </div>
            ) : (
              <div style={{ marginBottom: '16px', padding: '12px', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--color-text-muted)', borderRadius: '8px', border: '1px dashed var(--color-border)' }}>
                💡 Tambah <strong>{formatPrice(150000 - subtotal)}</strong> lagi ke keranjang Anda untuk mendapatkan <strong>Gratis Ongkir!</strong>
              </div>
            )}
            <div className="checkout-page__methods">
              <label className={`method-card ${shippingMethod === 'jne' ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  name="shipping" 
                  checked={shippingMethod === 'jne'}
                  onChange={() => setShippingMethod('jne')}
                />
                <span>JNE Reguler {isFreeShipping ? '(Gratis)' : '- Rp 15.000'}</span>
              </label>
              <label className={`method-card ${shippingMethod === 'sicepat' ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  name="shipping" 
                  checked={shippingMethod === 'sicepat'}
                  onChange={() => setShippingMethod('sicepat')}
                />
                <span>SiCepat BEST {isFreeShipping ? '(Gratis)' : '- Rp 22.000'}</span>
              </label>
            </div>

            <h3 style={{ marginTop: '32px' }}>Metode Pembayaran</h3>
            <div className="checkout-page__methods">
              <label className="method-card selected" style={{ cursor: 'default' }}>
                <input 
                  type="radio" 
                  name="payment" 
                  checked={true}
                  readOnly
                />
                <span>QRIS (Sistem Pembayaran Default)</span>
              </label>
            </div>
          </form>
        </div>
        
        <div className="checkout-page__summary-section">
          <div className="checkout-page__summary glass">
            <h3>Ringkasan Pesanan</h3>
            <div className="checkout-page__summary-items">
              {items.map((item, idx) => (
                <div key={idx} className="checkout-summary-item">
                  <div className="checkout-summary-item__name">
                    {item.name} {item.variant && `(${item.variant})`} x {item.qty}
                  </div>
                  <div className="checkout-summary-item__price">{formatPrice(item.price * item.qty)}</div>
                </div>
              ))}
            </div>
            
            <div className="checkout-page__summary-totals">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="summary-row text-success">
                  <span>Diskon</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="summary-row">
                <span>Ongkos Kirim</span>
                <span>{shippingCost === 0 ? 'Gratis' : formatPrice(shippingCost)}</span>
              </div>
              <div className="summary-row" style={{ color: 'var(--color-primary-light)' }}>
                <span>Kode Unik Pembayaran</span>
                <span>+ {uniqueCode}</span>
              </div>
              <div className="summary-row summary-total" style={{ borderTop: '1px dashed var(--color-border)', paddingTop: '16px', marginTop: '16px' }}>
                <span>Total Pembayaran</span>
                <span className="text-glow-cyan">{formatPrice(total)}</span>
              </div>
            </div>
            
            <Button 
              type="submit" 
              form="checkout-form" 
              variant="primary" 
              fullWidth 
              size="lg"
            >
              Buat Pesanan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
