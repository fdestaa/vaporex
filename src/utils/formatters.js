export const formatPrice = (price) => {
  return `Rp ${price.toLocaleString('id-ID')}`;
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getDiscountPercentage = (originalPrice, discountPrice) => {
  if (!discountPrice || discountPrice >= originalPrice) return 0;
  return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
};

export const getStockStatus = (stock) => {
  if (stock <= 0) return { label: 'Habis', color: 'error' };
  if (stock <= 5) return { label: 'Stok Terbatas', color: 'warning' };
  return { label: 'Tersedia', color: 'success' };
};

export const getInitials = (name) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const getOrderStatusColor = (status) => {
  const colors = {
    'Menunggu Pembayaran': 'warning',
    'Dibayar': 'info',
    'Diproses': 'info',
    'Dikirim': 'primary',
    'Selesai': 'success',
    'Dibatalkan': 'error',
    'Kedaluwarsa': 'error',
  };
  return colors[status] || 'default';
};
