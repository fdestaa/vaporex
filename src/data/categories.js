export const categories = [
  { id: 1, name: 'Pod System', slug: 'pod-system', icon: 'Box', description: 'Perangkat pod portabel & praktis', productCount: 24 },
  { id: 2, name: 'Mod Kit', slug: 'mod-kit', icon: 'Cpu', description: 'Box mod & starter kit lengkap', productCount: 18 },
  { id: 3, name: 'Liquid', slug: 'liquid', icon: 'Droplets', description: 'E-liquid premium berbagai rasa', productCount: 56 },
  { id: 4, name: 'Coil & Cartridge', slug: 'coil-cartridge', icon: 'CircuitBoard', description: 'Coil pengganti & cartridge pod', productCount: 32 },
  { id: 5, name: 'Aksesoris', slug: 'aksesoris', icon: 'Wrench', description: 'Baterai, charger, drip tip & lainnya', productCount: 15 },
  { id: 6, name: 'Disposable', slug: 'disposable', icon: 'Zap', description: 'Vape sekali pakai, praktis dibawa', productCount: 20 },
];

export const getCategoryById = (id) => categories.find((c) => c.id === id);
export const getCategoryBySlug = (slug) => categories.find((c) => c.slug === slug);
