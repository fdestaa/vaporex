import React, { useEffect } from 'react';
import { ShieldAlert } from 'lucide-react';
import useAgeGateStore from '../store/useAgeGateStore';
import Button from './Button';
import './AgeGateModal.css';

export default function AgeGateModal() {
  const { isVerified, verify } = useAgeGateStore();

  useEffect(() => {
    if (!isVerified) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isVerified]);

  if (isVerified) return null;

  const handleDecline = () => {
    window.location.href = 'https://www.google.com';
  };

  return (
    <div className="age-gate">
      <div className="age-gate__backdrop"></div>
      
      <div className="age-gate__modal glass scaleIn">
        <div className="age-gate__header">
          <h1 className="age-gate__logo text-gradient">VapoRex</h1>
        </div>
        
        <div className="age-gate__icon-container">
          <ShieldAlert size={48} className="age-gate__icon" />
        </div>
        
        <h2 className="age-gate__title">Verifikasi Usia</h2>
        
        <p className="age-gate__text">
          Anda harus berusia minimal 18 tahun untuk mengakses situs ini. 
          Produk yang dijual mengandung nikotin yang bersifat adiktif.
          Dengan melanjutkan, Anda menyatakan bahwa Anda berusia 18 tahun atau lebih.
        </p>
        
        <div className="age-gate__actions">
          <Button variant="primary" fullWidth onClick={verify} size="lg">
            Ya, Saya 18+
          </Button>
          <Button variant="ghost" fullWidth onClick={handleDecline} size="md">
            Tidak, Saya Di Bawah 18
          </Button>
        </div>
      </div>
    </div>
  );
}
