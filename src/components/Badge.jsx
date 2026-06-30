import React from 'react';

export default function Badge({ children, variant = 'default', size = 'sm' }) {
  let bgColor, color;
  
  switch (variant) {
    case 'primary':
      bgColor = 'var(--color-primary)';
      color = '#fff';
      break;
    case 'success':
      bgColor = 'var(--color-success)';
      color = '#fff';
      break;
    case 'warning':
      bgColor = 'var(--color-warning)';
      color = '#fff';
      break;
    case 'error':
      bgColor = 'var(--color-error)';
      color = '#fff';
      break;
    case 'info':
      bgColor = 'var(--color-secondary)';
      color = '#fff';
      break;
    case 'default':
    default:
      bgColor = 'var(--color-bg-elevated)';
      color = 'var(--color-text-muted)';
      break;
  }

  const padding = size === 'sm' ? '2px 8px' : '4px 12px';
  const fontSize = size === 'sm' ? 'var(--text-xs)' : 'var(--text-sm)';

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: bgColor,
      color,
      padding,
      fontSize,
      fontWeight: 600,
      borderRadius: 'var(--radius-sm)',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    }}>
      {children}
    </span>
  );
}
