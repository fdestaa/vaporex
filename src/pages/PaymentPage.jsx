import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import Button from '../components/Button';
import { formatPrice } from '../utils/formatters';

export default function PaymentPage() {
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/track/${orderNumber}`);
        if (!res.ok) {
          throw new Error('Pesanan tidak ditemukan');
        }
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderNumber]);

  const handlePaid = async () => {
    setIsPaying(true);
    try {
      const res = await fetch(`/api/orders/track/${orderNumber}/pay`, {
        method: 'POST'
      });
      if (res.ok) {
        navigate('/account?tab=orders');
      } else {
        alert('Gagal memproses pembayaran');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan sistem');
    } finally {
      setIsPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <p>Memuat detail pesanan...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <h2>{error || 'Pesanan tidak ditemukan'}</h2>
        <Button onClick={() => navigate('/shop')} style={{ marginTop: '20px' }}>
          Kembali ke Toko
        </Button>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '600px', padding: '60px 20px' }}>
      <div className="glass" style={{ padding: '32px', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
        <h1 style={{ marginBottom: '8px', color: 'var(--color-primary-light)' }}>Pembayaran QRIS</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '32px' }}>
          Pesanan <strong>{order.orderNumber}</strong> berhasil dibuat. Silakan scan QR code di bawah menggunakan aplikasi M-Banking atau e-Wallet Anda.
        </p>

        {/* Dummy QR Code Image */}
        <div style={{ background: '#fff', padding: '16px', borderRadius: 'var(--radius-md)', display: 'inline-block', marginBottom: '32px' }}>
          <img 
            src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=VAPOREX-${order.orderNumber}-${order.total}`} 
            alt="QRIS Payment" 
            style={{ width: '250px', height: '250px' }}
          />
        </div>

        <div style={{ background: 'var(--color-bg-elevated)', padding: '24px', borderRadius: 'var(--radius-md)', marginBottom: '32px', textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Nama Penerima</span>
            <span style={{ fontWeight: 500 }}>{order.customerName}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Item Pembelian</span>
            <span style={{ fontWeight: 500, textAlign: 'right' }}>
              {order.items?.map(i => `${i.product?.name} (${i.qty}x)`).join(', ')}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: '16px', marginTop: '16px' }}>
            <div>
              <span style={{ fontSize: '1.1rem', display: 'block' }}>Total Pembayaran</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>*Termasuk kode unik transfer</span>
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary-light)' }}>
              {formatPrice(order.total)}
            </span>
          </div>
        </div>

        <Button size="lg" fullWidth onClick={handlePaid} loading={isPaying}>
          Saya Sudah Bayar
        </Button>
        
        <p style={{ marginTop: '24px', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
          Pastikan nominal pembayaran sesuai dengan total yang tertera di atas.
        </p>
      </div>
    </div>
  );
}
