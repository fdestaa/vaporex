import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router';
import { TrendingUp, Package, ShoppingBag, AlertTriangle } from 'lucide-react';
import { formatPrice, getOrderStatusColor } from '../../utils/formatters';
import useAdminAuthStore from '../../store/useAdminAuthStore';
import './DashboardPage.css';

export default function DashboardPage() {
  const { token, user } = useAdminAuthStore();

  if (user?.role === 'kasir') {
    return <Navigate to="/admin/pos" replace />;
  }
  const [stats, setStats] = useState({
    revenue: 0,
    newOrders: 0,
    totalProducts: 0,
    lowStock: 0,
    recentOrders: [],
    salesChart: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/dashboard/stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      }
    };
    if (token) fetchStats();
  }, [token]);

  return (
    <div className="dashboard-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Dashboard</h1>
      </div>

      <div className="dashboard-stats-grid">
        <div className="stat-card glass">
          <div className="stat-card__icon text-success bg-success-light">
            <TrendingUp size={24} />
          </div>
          <div className="stat-card__content">
            <p className="stat-card__label">Pendapatan (Bulan Ini)</p>
            <h3 className="stat-card__value">{formatPrice(stats.revenue)}</h3>
          </div>
        </div>
        
        <div className="stat-card glass">
          <div className="stat-card__icon text-primary bg-primary-light">
            <ShoppingBag size={24} />
          </div>
          <div className="stat-card__content">
            <p className="stat-card__label">Pesanan Baru</p>
            <h3 className="stat-card__value">{stats.newOrders}</h3>
          </div>
        </div>
        
        <div className="stat-card glass">
          <div className="stat-card__icon text-info bg-info-light">
            <Package size={24} />
          </div>
          <div className="stat-card__content">
            <p className="stat-card__label">Total Produk</p>
            <h3 className="stat-card__value">{stats.totalProducts}</h3>
          </div>
        </div>
        
        <div className="stat-card glass border-warning">
          <div className="stat-card__icon text-warning bg-warning-light">
            <AlertTriangle size={24} />
          </div>
          <div className="stat-card__content">
            <p className="stat-card__label">Stok Menipis</p>
            <h3 className="stat-card__value text-warning">{stats.lowStock}</h3>
          </div>
        </div>
      </div>

      <div className="dashboard-content-grid">
        <div className="dashboard-card glass">
          <h3 className="dashboard-card__title">Grafik Penjualan</h3>
          <div className="dashboard-card__chart-placeholder">
            <p className="text-muted">Pendapatan Per Hari</p>
            <div className="mock-chart">
              {stats.salesChart && stats.salesChart.length > 0 ? (
                stats.salesChart.map((day, idx) => {
                  const maxRev = Math.max(...stats.salesChart.map(d => d.revenue), 1);
                  const heightPct = Math.max((day.revenue / maxRev) * 100, 5); // at least 5% height for visibility
                  return (
                    <div className="chart-bar-container" key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%', gap: '8px' }}>
                      <div 
                        className="mock-bar" 
                        style={{ height: `${heightPct}%`, width: '100%', minWidth: '30px', position: 'relative' }}
                        title={`${day.label}: ${formatPrice(day.revenue)}`}
                      >
                        <span className="tooltip-text">{formatPrice(day.revenue)}</span>
                      </div>
                      <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{day.label}</span>
                    </div>
                  );
                })
              ) : (
                <div style={{ alignSelf: 'center', width: '100%', textAlign: 'center', color: 'var(--color-text-muted)' }}>Belum ada data penjualan 7 hari terakhir</div>
              )}
            </div>
          </div>
        </div>

        <div className="dashboard-card glass">
          <h3 className="dashboard-card__title">Pesanan Terbaru</h3>
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>No. Pesanan</th>
                  <th>Status</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map(order => (
                  <tr key={order.id}>
                    <td>{order.orderNumber}</td>
                    <td><span className={`badge badge--${getOrderStatusColor(order.status)}`}>{order.status}</span></td>
                    <td>{formatPrice(order.total)}</td>
                  </tr>
                ))}
                {stats.recentOrders.length === 0 && (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center', padding: '1rem' }}>Belum ada pesanan</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
