import React from 'react';
import './Button.css';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  loading = false,
  icon: Icon,
  className = '',
  type = 'button',
  fullWidth = false,
  ...props
}) {
  const baseClasses = 'vpr-btn';
  const variantClasses = `vpr-btn--${variant}`;
  const sizeClasses = `vpr-btn--${size}`;
  const widthClass = fullWidth ? 'vpr-btn--full' : '';
  const loadingClass = loading ? 'vpr-btn--loading' : '';

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${widthClass} ${loadingClass} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="vpr-spinner"></span>}
      {!loading && Icon && <Icon className="vpr-btn__icon" size={size === 'sm' ? 16 : 20} />}
      <span className="vpr-btn__content">{children}</span>
    </button>
  );
}
