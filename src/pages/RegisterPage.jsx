import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import useAuthStore from '../store/useAuthStore';
import Button from '../components/Button';
import './AuthPages.css';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    dob: '',
  });
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) return;
    
    setIsLoading(true);
    
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: formData.name, 
          email: formData.email, 
          phone: formData.phone,
          password: formData.password,
          role: 'customer'
        })
      });
      const data = await res.json();
      
      if (res.ok) {
        login(data.user, data.token);
        setIsLoading(false);
        const redirect = searchParams.get('redirect') || '/account';
        navigate(redirect);
      } else {
        alert(data.error || 'Pendaftaran gagal');
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      alert('Gagal menghubungi server');
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass scaleIn">
        <div className="auth-header">
          <h1 className="auth-title">Daftar Akun Baru</h1>
          <p className="auth-subtitle">Bergabung dengan VapoRex hari ini</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Nama Lengkap</label>
            <input 
              type="text" 
              name="name"
              value={formData.name} 
              onChange={handleChange} 
              placeholder="Nama sesuai KTP"
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              name="email"
              value={formData.email} 
              onChange={handleChange} 
              placeholder="Alamat email aktif"
              required 
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Nomor HP</label>
              <input 
                type="tel" 
                name="phone"
                value={formData.phone} 
                onChange={handleChange} 
                placeholder="08xxxxxxxxxx"
                required 
              />
            </div>
            <div className="form-group">
              <label>Tanggal Lahir</label>
              <input 
                type="date" 
                name="dob"
                value={formData.dob} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              name="password"
              value={formData.password} 
              onChange={handleChange} 
              placeholder="Minimal 8 karakter"
              required 
              minLength={8}
            />
          </div>
          
          <div className="auth-checkbox">
            <label>
              <input 
                type="checkbox" 
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                required
              />
              <span>Saya menyatakan bahwa saya berusia 18 tahun ke atas dan menyetujui Syarat & Ketentuan.</span>
            </label>
          </div>
          
          <Button type="submit" variant="primary" fullWidth loading={isLoading} disabled={!agreed}>
            Daftar
          </Button>
        </form>

        <div className="auth-footer">
          <p>Sudah punya akun? <Link to={`/login${searchParams.get('redirect') ? `?redirect=${searchParams.get('redirect')}` : ''}`} className="auth-link">Masuk di sini</Link></p>
        </div>
      </div>
    </div>
  );
}
