import React, { useState, useEffect } from 'react';
import { Search, Eye } from 'lucide-react';
import { formatPrice, formatDateTime, getOrderStatusColor } from '../../utils/formatters';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import Modal from '../../components/Modal';

import useAdminAuthStore from '../../store/useAdminAuthStore';

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { token } = useAdminAuthStore();

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setOrders(data);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchOrders();
  }, [token]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchOrders();
      } else {
        alert('Gagal mengupdate status');
      }
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Manajemen Pesanan</h1>
      </div>

      <div className="glass" style={{ padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flexGrow: 1, minWidth: '250px', maxWidth: '400px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input 
              type="text" 
              placeholder="Cari no. pesanan atau nama..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '8px 12px 8px 36px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'rgba(0,0,0,0.2)', color: '#fff' }}
            />
          </div>
          <select style={{ padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-bg-elevated)', color: '#fff' }}>
            <option value="">Semua Status</option>
            <option value="Menunggu Pembayaran">Menunggu Pembayaran</option>
            <option value="Diproses">Diproses</option>
            <option value="Dikirim">Dikirim</option>
            <option value="Selesai">Selesai</option>
          </select>
          <select style={{ padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-bg-elevated)', color: '#fff' }}>
            <option value="">Semua Channel</option>
            <option value="online">Online (Web)</option>
            <option value="offline">Offline (POS)</option>
          </select>
        </div>
      </div>

      <div className="admin-table-container glass">
        <table className="admin-table">
          <thead>
            <tr>
              <th>No. Pesanan</th>
              <th>Tanggal</th>
              <th>Pelanggan</th>
              <th>Channel</th>
              <th>Total</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td style={{ fontWeight: 500 }}>{order.orderNumber}</td>
                <td>{formatDateTime(order.createdAt)}</td>
                <td>{order.customerName}</td>
                <td>
                  <Badge variant={order.channel === 'online' ? 'primary' : 'default'} size="sm">
                    {order.channel}
                  </Badge>
                </td>
                <td style={{ fontWeight: 600 }}>{formatPrice(order.total)}</td>
                <td>
                  <select 
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    style={{ 
                      padding: '4px 8px', 
                      borderRadius: 'var(--radius-sm)', 
                      border: '1px solid var(--color-border)', 
                      background: 'var(--color-bg-elevated)', 
                      color: 'var(--color-text)',
                      fontSize: '0.875rem'
                    }}
                  >
                    <option value="Menunggu Pembayaran">Menunggu</option>
                    <option value="Diproses">Diproses</option>
                    <option value="Dikirim">Dikirim</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Dibatalkan">Dibatalkan</option>
                  </select>
                </td>
                <td>
                  <button className="admin-action-btn" title="Lihat Detail" onClick={() => setSelectedOrder(order)}>
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal 
        isOpen={!!selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
        title={`Detail Pesanan: ${selectedOrder?.orderNumber}`}
      >
        {selectedOrder && (
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
              <div>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '4px' }}>Status</p>
                <Badge variant={getOrderStatusColor(selectedOrder.status)}>{selectedOrder.status}</Badge>
              </div>
              <div>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '4px' }}>Tanggal Pemesanan</p>
                <p style={{ fontWeight: 500 }}>{formatDateTime(selectedOrder.createdAt)}</p>
              </div>
            </div>

            <div style={{ marginBottom: '24px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
              <h4 style={{ margin: '0 0 16px 0', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>Informasi Pengiriman</h4>
              <p style={{ margin: '0 0 8px 0' }}><strong>Nama:</strong> {selectedOrder.customerName}</p>
              <p style={{ margin: '0 0 8px 0' }}><strong>Nomor HP:</strong> {selectedOrder.customerPhone || selectedOrder.user?.phone || 'Tidak ada'}</p>
              <p style={{ margin: 0 }}><strong>Alamat:</strong> {selectedOrder.shippingAddress || selectedOrder.user?.address || (selectedOrder.channel === 'offline' ? 'Tidak ada (Pesanan Offline)' : 'Belum diatur')}</p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ margin: '0 0 12px 0' }}>Daftar Produk</h4>
              {selectedOrder.items && selectedOrder.items.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid var(--color-border)' }}>
                      <div>
                        <p style={{ margin: '0 0 4px 0', fontWeight: 500 }}>{item.product?.name || 'Produk'}</p>
                        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{item.qty}x @ {formatPrice(item.price)}</p>
                      </div>
                      <span style={{ fontWeight: 600 }}>{formatPrice(item.price * item.qty)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--color-text-muted)' }}>Tidak ada detail produk (Pesanan Lama)</p>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px dashed var(--color-border)' }}>
              <span style={{ fontSize: '1.1rem' }}>Total Keseluruhan</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary-light)' }}>{formatPrice(selectedOrder.total)}</span>
            </div>
            
            <div style={{ marginTop: '24px' }}>
              <Button fullWidth onClick={() => setSelectedOrder(null)}>Tutup</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
