import React, { useState, useEffect } from 'react';
import useAdminAuthStore from '../../store/useAdminAuthStore';
import { formatPrice } from '../../utils/formatters';
import { Calendar, DollarSign, ShoppingBag, Package } from 'lucide-react';

export default function ReportsPage() {
  const { token } = useAdminAuthStore();
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Default to this month
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  
  const [startDate, setStartDate] = useState(firstDay.getFullYear() + '-' + String(firstDay.getMonth() + 1).padStart(2, '0') + '-' + String(firstDay.getDate()).padStart(2, '0'));
  const [endDate, setEndDate] = useState(today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0'));

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reports/sales?startDate=${startDate}&endDate=${endDate}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setReportData(data);
      }
    } catch (error) {
      console.error('Failed to fetch reports', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchReports();
  }, [token, startDate, endDate]);

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Laporan Penjualan</h1>
      </div>

      <div className="glass" style={{ padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-6)', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Calendar size={18} className="text-muted" />
          <span style={{ fontWeight: 500 }}>Filter Tanggal:</span>
        </div>
        <input 
          type="date" 
          className="input-field" 
          value={startDate} 
          onChange={(e) => setStartDate(e.target.value)}
        />
        <span>sampai</span>
        <input 
          type="date" 
          className="input-field" 
          value={endDate} 
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button className="btn btn--primary" onClick={fetchReports}>Terapkan</button>
      </div>

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center' }}>Memuat laporan...</div>
      ) : reportData ? (
        <>
          <div className="dashboard-stats-grid" style={{ marginBottom: 'var(--space-6)' }}>
            <div className="stat-card glass" style={{ borderLeft: '4px solid var(--color-success)' }}>
              <div className="stat-card__icon text-success bg-success-light">
                <DollarSign size={24} />
              </div>
              <div className="stat-card__content">
                <p className="stat-card__label">Total Pendapatan</p>
                <h3 className="stat-card__value text-success">{formatPrice(reportData.totalRevenue)}</h3>
              </div>
            </div>
            
            <div className="stat-card glass" style={{ borderLeft: '4px solid var(--color-primary)' }}>
              <div className="stat-card__icon text-primary bg-primary-light">
                <ShoppingBag size={24} />
              </div>
              <div className="stat-card__content">
                <p className="stat-card__label">Total Pesanan</p>
                <h3 className="stat-card__value text-primary">{reportData.totalOrders}</h3>
              </div>
            </div>
            
            <div className="stat-card glass" style={{ borderLeft: '4px solid var(--color-info)' }}>
              <div className="stat-card__icon text-info bg-info-light">
                <Package size={24} />
              </div>
              <div className="stat-card__content">
                <p className="stat-card__label">Total Produk Terjual</p>
                <h3 className="stat-card__value text-info">{reportData.totalItemsSold}</h3>
              </div>
            </div>
          </div>

          <div className="dashboard-card glass">
            <h3 className="dashboard-card__title">Produk Terlaris</h3>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Peringkat</th>
                    <th>Nama Produk</th>
                    <th>Terjual (Qty)</th>
                    <th>Total Pendapatan</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.topProducts && reportData.topProducts.map((product, idx) => (
                    <tr key={product.id}>
                      <td style={{ fontWeight: 600, color: 'var(--color-primary)' }}>#{idx + 1}</td>
                      <td>{product.name}</td>
                      <td>{product.qty} pcs</td>
                      <td style={{ color: 'var(--color-success)', fontWeight: 500 }}>{formatPrice(product.revenue)}</td>
                    </tr>
                  ))}
                  {(!reportData.topProducts || reportData.topProducts.length === 0) && (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>Belum ada data penjualan pada rentang tanggal ini.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
