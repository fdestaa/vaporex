import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { CheckCircle } from 'lucide-react';
import Button from '../components/Button';
import { formatPrice } from '../utils/formatters';

export default function OrderSuccessPage() {
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/track/${orderNumber}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <p>Memuat...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '60px 0', maxWidth: '600px', textAlign: 'center' }}>
      <div className="glass" style={{ padding: '40px', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ color: 'var(--color-success)', marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
          <CheckCircle size={64} />
        </div>
        
        <h1 style={{ marginBottom: '16px', color: 'var(--color-text)' }}>Terima Kasih!</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '32px' }}>
          Pesanan Anda berhasil dibuat dan sedang diproses. <br />
          Nomor Pesanan: <strong style={{ color: 'var(--color-primary-light)' }}>{orderNumber}</strong>
        </p>

        {order && (
          <div style={{ background: 'var(--color-bg-elevated)', padding: '24px', borderRadius: 'var(--radius-md)', marginBottom: '32px', textAlign: 'left' }}>
            <h3 style={{ marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>Ringkasan Pesanan</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              {order.items?.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{item.product?.name} x {item.qty}</span>
                  <span>{formatPrice(item.price * item.qty)}</span>
                </div>
              ))}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--color-border)', paddingTop: '16px' }}>
              <span style={{ fontWeight: 600 }}>Total Pembayaran</span>
              <span style={{ fontWeight: 700, color: 'var(--color-primary-light)' }}>{formatPrice(order.total)}</span>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Button variant="outline" onClick={() => navigate('/shop')}>Kembali Belanja</Button>
          <Button variant="primary" onClick={() => navigate('/account')}>Lihat Pesanan Saya</Button>
        </div>
      </div>
    </div>
  );
}
