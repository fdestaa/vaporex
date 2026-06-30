import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, X } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import Button from '../../components/Button';
import Badge from '../../components/Badge';

import useAdminAuthStore from '../../store/useAdminAuthStore';

export default function ProductsPage() {
  const { token } = useAdminAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    discountPrice: '',
    stock: '',
    categoryId: '',
    images: ''
  });

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch('/api/products', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/categories', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      const [prodData, catData] = await Promise.all([
        prodRes.json(),
        catRes.json()
      ]);
      setProducts(prodData);
      setCategories(catData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Process formatting
    const payload = {
      ...formData,
      price: parseInt(formData.price) || 0,
      discountPrice: formData.discountPrice ? parseInt(formData.discountPrice) : null,
      stock: parseInt(formData.stock) || 0,
      categoryId: parseInt(formData.categoryId),
      images: formData.images ? [formData.images] : [] // Simplistic single image string to array
    };

    try {
      const url = isEditMode ? `/api/products/${editingId}` : '/api/products';
      const method = isEditMode ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setIsAddModalOpen(false);
        setFormData({ name: '', slug: '', description: '', price: '', discountPrice: '', stock: '', categoryId: '', images: '' });
        fetchData(); // Refresh list
      } else {
        alert('Gagal menyimpan produk');
      }
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan sistem');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (product) => {
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      discountPrice: product.discountPrice || '',
      stock: product.stock,
      categoryId: product.categoryId,
      images: product.images?.[0] || ''
    });
    setEditingId(product.id);
    setIsEditMode(true);
    setIsAddModalOpen(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Yakin ingin menghapus produk ini?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchData();
      } else {
        alert('Gagal menghapus produk');
      }
    } catch (error) {
      alert('Terjadi kesalahan sistem');
    }
  };

  const openAddModal = () => {
    setFormData({ name: '', slug: '', description: '', price: '', discountPrice: '', stock: '', categoryId: '', images: '' });
    setIsEditMode(false);
    setEditingId(null);
    setIsAddModalOpen(true);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Manajemen Produk</h1>
        <Button variant="primary" icon={Plus} onClick={openAddModal}>Tambah Produk</Button>
      </div>

      {isAddModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-strong" style={{ width: '100%', maxWidth: '600px', padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
              <h2>{isEditMode ? 'Edit Produk' : 'Tambah Produk Baru'}</h2>
              <button onClick={() => setIsAddModalOpen(false)} style={{ color: 'var(--color-text-muted)' }}><X /></button>
            </div>
            
            <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Nama Produk</label>
                  <input required name="name" value={formData.name} onChange={handleInputChange} className="input-field" placeholder="Cth: Caliburn G2" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Slug (URL)</label>
                  <input required name="slug" value={formData.slug} onChange={handleInputChange} className="input-field" placeholder="Cth: caliburn-g2" />
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Harga Normal (Rp)</label>
                  <input required type="number" name="price" value={formData.price} onChange={handleInputChange} className="input-field" placeholder="250000" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Harga Diskon (Rp) - Opsional</label>
                  <input type="number" name="discountPrice" value={formData.discountPrice} onChange={handleInputChange} className="input-field" placeholder="220000" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Stok Awal</label>
                  <input required type="number" name="stock" value={formData.stock} onChange={handleInputChange} className="input-field" placeholder="10" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Kategori</label>
                  <select required name="categoryId" value={formData.categoryId} onChange={handleInputChange} className="input-field">
                    <option value="">Pilih Kategori</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>URL Gambar Utama</label>
                <input name="images" value={formData.images} onChange={handleInputChange} className="input-field" placeholder="/products/example.png" />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Deskripsi</label>
                <textarea required name="description" value={formData.description} onChange={handleInputChange} className="input-field" rows="4" placeholder="Deskripsi lengkap produk..." />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: 'var(--space-4)' }}>
                <Button variant="outline" type="button" onClick={() => setIsAddModalOpen(false)}>Batal</Button>
                <Button variant="primary" type="submit" disabled={submitting}>
                  {submitting ? 'Menyimpan...' : 'Simpan Produk'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="glass" style={{ padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
          <div style={{ position: 'relative', flexGrow: 1, maxWidth: '400px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input 
              type="text" 
              placeholder="Cari produk berdasarkan nama atau slug..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '8px 12px 8px 36px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'rgba(0,0,0,0.2)', color: '#fff' }}
            />
          </div>
          <Button variant="outline">Filter</Button>
        </div>
      </div>

      <div className="admin-table-container glass">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Memuat data produk...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Produk</th>
                <th>Kategori</th>
                <th>Harga</th>
                <th>Stok</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product.id}>
                  <td style={{ color: 'var(--color-text-muted)', fontSize: '12px' }}>#{product.id}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '4px', overflow: 'hidden', background: 'var(--color-bg-elevated)' }}>
                        {product.images?.[0] && <img src={product.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                      </div>
                      <div>
                        <div style={{ fontWeight: 500 }}>{product.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--color-text-subtle)' }}>{product.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td>{product.category?.name || '-'}</td>
                  <td>
                    {product.discountPrice ? (
                      <div>
                        <div style={{ color: 'var(--color-accent)' }}>{formatPrice(product.discountPrice)}</div>
                        <div style={{ textDecoration: 'line-through', fontSize: '12px', color: 'var(--color-text-muted)' }}>{formatPrice(product.price)}</div>
                      </div>
                    ) : formatPrice(product.price)}
                  </td>
                  <td>
                    {product.stock <= 5 ? 
                      <span style={{ color: 'var(--color-warning)' }}>{product.stock} (Menipis)</span> : 
                      product.stock
                    }
                  </td>
                  <td>
                    <Badge variant={product.stock > 0 ? 'success' : 'default'}>
                      {product.stock > 0 ? 'Aktif' : 'Kosong'}
                    </Badge>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="admin-action-btn" title="Edit" onClick={() => handleEditClick(product)}>
                        <Edit size={16} />
                      </button>
                      <button className="admin-action-btn" title="Hapus" style={{ color: 'var(--color-error)' }} onClick={() => handleDeleteProduct(product.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
