import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { LogOut, Package, User, MapPin, Eye } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import { getInitials, formatPrice, formatDateTime, getOrderStatusColor } from '../utils/formatters';
import './AccountPage.css';

export default function AccountPage() {
  const { user, token, logout, updateProfile } = useAuthStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const defaultTab = queryParams.get('tab') || 'profile';
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isEditAddressOpen, setIsEditAddressOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ name: '', email: '', phone: '', address: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const res = await fetch(`/api/orders/user/${user.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, [user, token]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleViewDetails = async (orderNumber) => {
    setSelectedOrder(orderNumber);
    setLoadingDetails(true);
    try {
      const res = await fetch(`/api/orders/track/${orderNumber}`);
      if (res.ok) {
        const data = await res.json();
        setOrderDetails(data);
      }
    } catch (error) {
      console.error('Failed to fetch order details', error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setOrderDetails(null);
  };

  const openEditProfile = () => {
    setEditFormData({ name: user.name || '', email: user.email || '', phone: user.phone || '', address: user.address || '' });
    setIsEditProfileOpen(true);
  };

  const openEditAddress = () => {
    setEditFormData({ name: user.name || '', email: user.email || '', phone: user.phone || '', address: user.address || '' });
    setIsEditAddressOpen(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editFormData)
      });
      const data = await res.json();
      if (res.ok) {
        updateProfile(data);
        setIsEditProfileOpen(false);
        setIsEditAddressOpen(false);
      } else {
        alert(data.error || 'Gagal menyimpan profil');
      }
    } catch (err) {
      alert('Terjadi kesalahan sistem');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="account-page container">
      <h1 className="account-page__title">Akun Saya</h1>
      
      <div className="account-page__layout">
        <aside className="account-sidebar glass">
          <div className="account-profile-summary">
            <div className="account-avatar">
              {getInitials(user.name)}
            </div>
            <div>
              <h3>{user.name}</h3>
              <p>{user.email}</p>
            </div>
          </div>
          
          <nav className="account-nav">
            <button 
              onClick={() => setActiveTab('profile')} 
              className={`account-nav__link ${activeTab === 'profile' ? 'active' : ''}`}
            >
              <User size={18} /> Profil Saya
            </button>
            <button 
              onClick={() => setActiveTab('orders')} 
              className={`account-nav__link ${activeTab === 'orders' ? 'active' : ''}`}
            >
              <Package size={18} /> Pesanan Saya
            </button>
            <button 
              onClick={() => setActiveTab('address')} 
              className={`account-nav__link ${activeTab === 'address' ? 'active' : ''}`}
            >
              <MapPin size={18} /> Alamat Pengiriman
            </button>
            <button onClick={handleLogout} className="account-nav__link text-error">
              <LogOut size={18} /> Keluar
            </button>
          </nav>
        </aside>
        
        <main className="account-content glass">
          {activeTab === 'profile' && (
            <section className="account-section">
              <h2>Profil Saya</h2>
              <div className="account-info-grid">
                <div className="info-group">
                  <label>Nama Lengkap</label>
                  <p>{user.name}</p>
                </div>
                <div className="info-group">
                  <label>Email</label>
                  <p>{user.email}</p>
                </div>
                <div className="info-group">
                  <label>Nomor HP</label>
                  <p>{user.phone || '-'}</p>
                </div>
              </div>
              <Button variant="outline" className="mt-4" onClick={openEditProfile}>Edit Profil</Button>
            </section>
          )}
          
          {activeTab === 'orders' && (
            <section className="account-section">
               <h2>Pesanan Terakhir</h2>
               {loadingOrders ? (
                 <div style={{ padding: '2rem', textAlign: 'center' }}>Memuat pesanan...</div>
               ) : orders.length === 0 ? (
                 <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-text-muted)' }}>
                   <Package size={48} style={{ opacity: 0.2, margin: '0 auto 16px' }} />
                   <p>Belum ada pesanan.</p>
                   <Button onClick={() => navigate('/shop')} variant="primary" style={{ marginTop: '16px' }}>Mulai Belanja</Button>
                 </div>
               ) : (
                 <div className="account-orders-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                   {orders.map(order => (
                     <div key={order.id} className="glass" style={{ padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
                         <div>
                           <h4 style={{ margin: '0 0 4px 0' }}>{order.orderNumber}</h4>
                           <p style={{ margin: 0, fontSize: '14px', color: 'var(--color-text-muted)' }}>{formatDateTime(order.createdAt)}</p>
                         </div>
                         <Badge variant={getOrderStatusColor(order.status)}>{order.status}</Badge>
                       </div>
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <div>
                           <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.875rem' }}>Total Belanja</span>
                           <span style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--color-primary-light)' }}>{formatPrice(order.total)}</span>
                         </div>
                         <Button variant="outline" size="sm" icon={Eye} onClick={() => handleViewDetails(order.orderNumber)}>
                           Lihat Detail
                         </Button>
                       </div>
                     </div>
                   ))}
                 </div>
               )}
            </section>
          )}

          {activeTab === 'address' && (
            <section className="account-section">
              <h2>Alamat Pengiriman</h2>
              {user.address ? (
                <div className="glass" style={{ padding: '24px', borderRadius: 'var(--radius-md)' }}>
                  <p style={{ margin: 0, lineHeight: 1.6 }}>{user.address}</p>
                  <Button variant="outline" size="sm" className="mt-4" onClick={openEditAddress}>Ubah Alamat</Button>
                </div>
              ) : (
                <div className="glass" style={{ padding: '24px', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                  <p>Belum ada alamat tersimpan.</p>
                  <Button variant="outline" className="mt-4" onClick={openEditAddress}>Tambah Alamat</Button>
                </div>
              )}
            </section>
          )}
        </main>
      </div>

      <Modal isOpen={!!selectedOrder} onClose={closeModal} title={`Detail Pesanan ${selectedOrder || ''}`}>
        {loadingDetails ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>Memuat detail...</div>
        ) : orderDetails ? (
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Status</p>
                <Badge variant={getOrderStatusColor(orderDetails.status)} style={{ marginTop: '4px' }}>{orderDetails.status}</Badge>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Tanggal Pemesanan</p>
                <p style={{ margin: '4px 0 0 0', fontWeight: 500 }}>{formatDateTime(orderDetails.createdAt)}</p>
              </div>
            </div>

            <h4 style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '8px', marginBottom: '16px' }}>Daftar Produk</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {orderDetails.items?.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--color-bg-card)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Package size={24} color="var(--color-text-muted)" />
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 500 }}>{item.product?.name || 'Produk Dihapus'}</p>
                      <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{formatPrice(item.price)} x {item.qty}</p>
                    </div>
                  </div>
                  <span style={{ fontWeight: 600 }}>{formatPrice(item.price * item.qty)}</span>
                </div>
              ))}
            </div>

            <h4 style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '8px', marginBottom: '16px' }}>Rincian Pembayaran</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: 'var(--color-text-muted)' }}>
              <span>Metode Pembayaran</span>
              <span style={{ color: 'var(--color-text)' }}>QRIS</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', paddingTop: '16px', borderTop: '1px dashed var(--color-border)' }}>
              <span style={{ fontWeight: 600 }}>Total Pembayaran</span>
              <span style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--color-primary-light)' }}>{formatPrice(orderDetails.total)}</span>
            </div>
          </div>
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-error)' }}>
            Gagal memuat detail pesanan.
          </div>
        )}
      </Modal>

      {/* Edit Profile Modal */}
      <Modal isOpen={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)} title="Edit Profil">
        <form onSubmit={handleSaveProfile} style={{ padding: '20px' }}>
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Nama Lengkap</label>
            <input 
              type="text" 
              required 
              value={editFormData.name} 
              onChange={e => setEditFormData({...editFormData, name: e.target.value})} 
              style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', background: 'var(--color-bg-card)', color: 'var(--color-text)' }}
            />
          </div>
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Email</label>
            <input 
              type="email" 
              required 
              value={editFormData.email} 
              onChange={e => setEditFormData({...editFormData, email: e.target.value})} 
              style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', background: 'var(--color-bg-card)', color: 'var(--color-text)' }}
            />
          </div>
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Nomor HP</label>
            <input 
              type="tel" 
              value={editFormData.phone} 
              onChange={e => setEditFormData({...editFormData, phone: e.target.value})} 
              style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', background: 'var(--color-bg-card)', color: 'var(--color-text)' }}
              placeholder="Contoh: 08123456789"
            />
          </div>
          <Button type="submit" variant="primary" fullWidth loading={isSaving}>Simpan Perubahan</Button>
        </form>
      </Modal>

      {/* Edit Address Modal */}
      <Modal isOpen={isEditAddressOpen} onClose={() => setIsEditAddressOpen(false)} title="Alamat Pengiriman">
        <form onSubmit={handleSaveProfile} style={{ padding: '20px' }}>
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Alamat Lengkap</label>
            <textarea 
              required 
              rows={4}
              value={editFormData.address} 
              onChange={e => setEditFormData({...editFormData, address: e.target.value})} 
              style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', background: 'var(--color-bg-card)', color: 'var(--color-text)', resize: 'vertical' }}
              placeholder="Masukkan alamat lengkap beserta kode pos..."
            />
          </div>
          <Button type="submit" variant="primary" fullWidth loading={isSaving}>Simpan Alamat</Button>
        </form>
      </Modal>
    </div>
  );
}
