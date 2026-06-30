import React from 'react';
import { Minus, Plus } from 'lucide-react';
import Button from './Button';

export default function QuantitySelector({ value, onChange, min = 1, max = 99, size = 'md' }) {
  const handleDecrease = () => {
    if (value > min) onChange(value - 1);
  };

  const handleIncrease = () => {
    if (value < max) onChange(value + 1);
  };

  const btnSize = size === 'sm' ? '32px' : size === 'lg' ? '48px' : '40px';
  const fontSize = size === 'sm' ? 'var(--text-sm)' : size === 'lg' ? 'var(--text-lg)' : 'var(--text-base)';

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', background: 'var(--color-bg-elevated)', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
      <button 
        type="button"
        onClick={handleDecrease}
        disabled={value <= min}
        style={{ width: btnSize, height: btnSize, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', color: 'var(--color-text)', cursor: value <= min ? 'not-allowed' : 'pointer', opacity: value <= min ? 0.5 : 1 }}
      >
        <Minus size={size === 'sm' ? 14 : 16} />
      </button>
      
      <div style={{ width: btnSize, textAlign: 'center', fontSize, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {value}
      </div>
      
      <button 
        type="button"
        onClick={handleIncrease}
        disabled={value >= max}
        style={{ width: btnSize, height: btnSize, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', color: 'var(--color-text)', cursor: value >= max ? 'not-allowed' : 'pointer', opacity: value >= max ? 0.5 : 1 }}
      >
        <Plus size={size === 'sm' ? 14 : 16} />
      </button>
    </div>
  );
}
