import { Outlet, NavLink, useNavigate } from 'react-router';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Monitor,
  BarChart3,
  Users,
  LogOut,
  Menu,
  X,
  Bell,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import useAdminAuthStore from '../store/useAdminAuthStore';
import { formatPrice } from '../utils/formatters';
import Toast from '../components/Toast';
import { getInitials } from '../utils/formatters';
import './AdminLayout.css';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true, role: 'admin' },
  { to: '/admin/products', icon: Package, label: 'Produk', role: 'all' },
  { to: '/admin/orders', icon: ShoppingBag, label: 'Pesanan', role: 'all' },
  { to: '/admin/pos', icon: Monitor, label: 'Kasir / POS', role: 'all' },
  { to: '/admin/reports', icon: BarChart3, label: 'Laporan', role: 'admin' },
  { to: '/admin/users', icon: Users, label: 'Pengguna', role: 'admin' },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [lastReadTime, setLastReadTime] = useState(
    parseInt(localStorage.getItem('vaporex_notif_read') || '0', 10)
  );
  const { user, logout, token } = useAdminAuthStore();
  const navigate = useNavigate();
  const notifRef = useRef(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch('/api/notifications', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setNotifications(data);
        }
      } catch (error) {
        console.error('Gagal mengambil notifikasi', error);
      }
    };
    if (token) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000); // Check every 30s
      return () => clearInterval(interval);
    }
  }, [token]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleMarkAsRead = () => {
    const now = Date.now();
    setLastReadTime(now);
    localStorage.setItem('vaporex_notif_read', now.toString());
  };

  const unreadCount = notifications.filter(n => new Date(n.createdAt).getTime() > lastReadTime).length;

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="admin-layout">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="admin-sidebar-overlay" onClick={closeSidebar} />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar--open' : ''}`}>
        <div className="admin-sidebar__header">
          <div className="admin-sidebar__brand">
            <span className="admin-sidebar__logo">VapoRex</span>
            <span className="admin-sidebar__subtitle">Admin Panel</span>
          </div>
          <button
            className="admin-sidebar__close"
            onClick={closeSidebar}
            aria-label="Tutup sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="admin-sidebar__nav">
          {navItems
            .filter(item => item.role === 'all' || item.role === user?.role)
            .map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `admin-nav-link ${isActive ? 'admin-nav-link--active' : ''}`
              }
              onClick={closeSidebar}
            >
              <Icon size={20} className="admin-nav-link__icon" />
              <span className="admin-nav-link__label">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <button className="admin-logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="admin-main">
        {/* Top bar */}
        <header className="admin-topbar">
          <div className="admin-topbar__left">
            <button
              className="admin-menu-toggle"
              onClick={() => setSidebarOpen(true)}
              aria-label="Buka menu"
            >
              <Menu size={22} />
            </button>
          </div>

          <div className="admin-topbar__right">
            <div style={{ position: 'relative' }} ref={notifRef}>
              <button 
                className="admin-topbar__bell" 
                aria-label="Notifikasi"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
              >
                <Bell size={20} />
                {unreadCount > 0 && <span className="admin-topbar__bell-dot" />}
              </button>
              
              {notificationsOpen && (
                <div className="admin-notifications-dropdown">
                  <div className="admin-notifications-header">
                    <h4>Notifikasi Pesanan</h4>
                    {unreadCount > 0 && (
                      <button onClick={handleMarkAsRead} style={{ fontSize: '11px', color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer' }}>
                        Tandai dibaca
                      </button>
                    )}
                  </div>
                  <div className="admin-notifications-list">
                    {notifications.length > 0 ? (
                      notifications.map(notif => {
                        const isUnread = new Date(notif.createdAt).getTime() > lastReadTime;
                        return (
                          <div key={notif.id} className="admin-notification-item" style={{ background: isUnread ? 'rgba(34, 211, 238, 0.05)' : 'transparent' }} onClick={() => { setNotificationsOpen(false); navigate('/admin/orders'); }}>
                            <div className="admin-notification-icon bg-primary-light text-primary">
                              <ShoppingBag size={16} />
                            </div>
                            <div className="admin-notification-content">
                              <p className="admin-notification-title">Pesanan {notif.orderNumber} {isUnread && <span style={{ color: 'var(--color-primary)', fontSize: '10px', marginLeft: '4px' }}>• Baru</span>}</p>
                              <p className="admin-notification-desc">Baru saja masuk sebesar {formatPrice(notif.total)}</p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="admin-notification-empty">Tidak ada pesanan online baru</div>
                    )}
                  </div>
                  <button className="admin-notifications-footer" onClick={() => { setNotificationsOpen(false); navigate('/admin/orders'); }}>
                    Lihat Semua Pesanan
                  </button>
                </div>
              )}
            </div>

            <div className="admin-topbar__user">
              <div className="admin-topbar__avatar">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} />
                ) : (
                  <span>{getInitials(user?.name || 'Admin')}</span>
                )}
              </div>
              <div className="admin-topbar__user-info">
                <span className="admin-topbar__user-name">
                  {user?.name || 'Admin'}
                </span>
                <span className="admin-topbar__user-role">
                  {user?.role || 'Administrator'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="admin-content">
          <Outlet />
        </div>
      </div>

      <Toast />
    </div>
  );
}
