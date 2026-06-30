import React from 'react';
import { formatPrice } from '../utils/formatters';

export default function PriceDisplay({ price, discountPrice, size = 'md' }) {
  const mainSize = size === 'sm' ? 'var(--text-base)' : size === 'lg' ? 'var(--text-2xl)' : 'var(--text-lg)';
  const origSize = size === 'sm' ? 'var(--text-xs)' : size === 'lg' ? 'var(--text-base)' : 'var(--text-sm)';

  if (discountPrice && discountPrice < price) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: mainSize, fontWeight: 700, color: 'var(--color-accent)' }}>
          {formatPrice(discountPrice)}
        </span>
        <span style={{ fontSize: origSize, color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>
          {formatPrice(price)}
        </span>
      </div>
    );
  }

  return (
    <div style={{ fontSize: mainSize, fontWeight: 700, color: 'var(--color-text)' }}>
      {formatPrice(price)}
    </div>
  );
}
