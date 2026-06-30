import React, { useState, useEffect } from 'react';
import useAdminAuthStore from '../../store/useAdminAuthStore';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import { Search, Trash2, Shield, User, DollarSign } from 'lucide-react';

export default function UsersPage() {
  const { token } = useAdminAuthStore();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchUsers();
  }, [token]);

  const handleRoleChange = async (userId, newRole) => {
    if (!window.confirm(`Ubah role pengguna menjadi ${newRole}?`)) return;
    try {
      const res = await fetch(`/api/users/${userId}/role`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        fetchUsers();
      } else {
        alert('Gagal mengubah role');
      }
    } catch (error) {
      alert('Terjadi kesalahan sistem');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Yakin ingin menghapus pengguna ini secara permanen?')) return;
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchUsers();
      } else {
        const data = await res.json();
        alert(data.error || 'Gagal menghapus pengguna');
      }
    } catch (error) {
      alert('Terjadi kesalahan sistem');
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin': return <Badge variant="danger"><div style={{display: 'flex', alignItems: 'center'}}><Shield size={12} style={{marginRight: '4px'}}/> Admin</div></Badge>;
      case 'kasir': return <Badge variant="warning"><div style={{display: 'flex', alignItems: 'center'}}><DollarSign size={12} style={{marginRight: '4px'}}/> Kasir</div></Badge>;
      default: return <Badge variant="success"><div style={{display: 'flex', alignItems: 'center'}}><User size={12} style={{marginRight: '4px'}}/> Customer</div></Badge>;
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Manajemen Pengguna</h1>
      </div>

      <div className="glass" style={{ padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
          <div style={{ position: 'relative', flexGrow: 1, maxWidth: '400px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input 
              type="text" 
              placeholder="Cari pengguna berdasarkan nama atau email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '36px' }}
            />
          </div>
        </div>
      </div>

      <div className="admin-table-container glass">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Memuat data pengguna...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama</th>
                <th>Email / No. HP</th>
                <th>Role Saat Ini</th>
                <th>Ganti Role</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td style={{ color: 'var(--color-text-muted)', fontSize: '12px' }}>#{user.id}</td>
                  <td style={{ fontWeight: 500 }}>{user.name || 'User Anonim'}</td>
                  <td>
                    <div>{user.email}</div>
                    {user.phone && <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{user.phone}</div>}
                  </td>
                  <td>{getRoleBadge(user.role)}</td>
                  <td>
                    <select 
                      className="input-field" 
                      style={{ width: '120px', padding: '4px 8px', minWidth: '0' }}
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    >
                      <option value="customer">Customer</option>
                      <option value="kasir">Kasir</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>
                    <button className="admin-action-btn" title="Hapus" style={{ color: 'var(--color-error)' }} onClick={() => handleDelete(user.id)}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Tidak ada pengguna ditemukan</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
