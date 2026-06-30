import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import useAdminAuthStore from '../../store/useAdminAuthStore';
import Button from '../../components/Button';
import './AdminPages.css';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const login = useAdminAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (res.ok) {
        if (data.user.role === 'customer') {
          alert('Akses ditolak: Akun ini bukan admin');
          setIsLoading(false);
          return;
        }
        login(data.user, data.token);
        setIsLoading(false);
        if (data.user.role === 'kasir') {
          navigate('/admin/pos');
        } else {
          navigate('/admin/dashboard');
        }
      } else {
        alert(data.error || 'Login gagal');
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      alert('Gagal menghubungi server');
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card glass scaleIn">
        <div className="admin-login-header">
          <h1 className="admin-login-logo text-gradient">VapoRex</h1>
          <p className="admin-login-subtitle">Admin & Kasir Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label>Email Admin</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="admin@vaporex.id"
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••"
              required 
            />
          </div>
          
          <Button type="submit" variant="primary" fullWidth loading={isLoading}>
            Masuk ke Panel
          </Button>
        </form>
      </div>
    </div>
  );
}
