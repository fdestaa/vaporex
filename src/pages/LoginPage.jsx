import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import useAuthStore from '../store/useAuthStore';
import useToastStore from '../store/useToastStore';
import Button from '../components/Button';
import { X } from 'lucide-react';
import './AuthPages.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  
  const login = useAuthStore((state) => state.login);
  const addToast = useToastStore((state) => state.addToast);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

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
        login(data.user, data.token);
        setIsLoading(false);
        const redirect = searchParams.get('redirect') || '/account';
        navigate(redirect);
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
    <div className="auth-page">
      <div className="auth-card glass scaleIn">
        <div className="auth-header">
          <h1 className="auth-title">Selamat Datang</h1>
          <p className="auth-subtitle">Login untuk melanjutkan ke VapoRex</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email atau Nomor HP</label>
            <input 
              type="text" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="rex@vaporex.id"
              required 
            />
          </div>
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label>Password</label>
              <button type="button" onClick={() => setIsForgotModalOpen(true)} className="auth-link text-sm" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>Lupa password?</button>
            </div>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Masukkan password"
              required 
            />
          </div>
          
          <Button type="submit" variant="primary" fullWidth loading={isLoading}>
            Masuk
          </Button>
        </form>

        <div className="auth-footer">
          <p>Belum punya akun? <Link to={`/register${searchParams.get('redirect') ? `?redirect=${searchParams.get('redirect')}` : ''}`} className="auth-link">Daftar sekarang</Link></p>
        </div>
      </div>

      {isForgotModalOpen && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="modal-content glass scaleIn" style={{ width: '100%', maxWidth: '400px', padding: '2rem', borderRadius: '16px', position: 'relative' }}>
            <button onClick={() => setIsForgotModalOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
              <X size={20} />
            </button>
            <h2 style={{ marginTop: 0, marginBottom: '8px' }}>Reset Password</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginBottom: '1.5rem' }}>Masukkan alamat email Anda untuk menerima link reset password.</p>
            <form onSubmit={(e) => {
              e.preventDefault();
              addToast('Link reset password telah dikirim ke email Anda!', 'success');
              setIsForgotModalOpen(false);
              setForgotEmail('');
            }}>
              <div className="form-group">
                <input 
                  type="email" 
                  value={forgotEmail} 
                  onChange={(e) => setForgotEmail(e.target.value)} 
                  placeholder="Alamat Email"
                  required 
                  className="input-field"
                  style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-border)', borderRadius: '8px', color: 'white', marginBottom: '1rem' }}
                />
              </div>
              <Button type="submit" variant="primary" fullWidth>Kirim Link Reset</Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
