import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { Filter, X, ChevronDown, ArrowLeft } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import './ShopPage.css';

const ITEMS_PER_PAGE = 12;

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories')
        ]);
        const prodData = await prodRes.json();
        const catData = await catRes.json();
        setProducts(prodData);
        setCategories(catData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Read filters from URL
  const searchQuery = searchParams.get('search') || '';
  let categoryFilter = searchParams.get('category');
  if (categoryFilter) {
    const parsed = parseInt(categoryFilter, 10);
    if (!isNaN(parsed)) {
      categoryFilter = parsed;
    } else {
      const cat = categories.find(c => c.slug === categoryFilter);
      categoryFilter = cat ? cat.id : '';
    }
  } else {
    categoryFilter = '';
  }
  const sortOption = searchParams.get('sort') || 'newest';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const inStockOnly = searchParams.get('inStock') === 'true';
  const promoFilter = searchParams.get('promo') === 'true';

  // Filter and sort logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) || 
        p.description.toLowerCase().includes(lowerQuery)
      );
    }

    if (categoryFilter) {
      result = result.filter(p => p.categoryId === categoryFilter);
    }

    if (promoFilter) {
      result = result.filter(p => p.discountPrice !== null && p.discountPrice < p.price);
    }

    if (minPrice) {
      result = result.filter(p => p.price >= parseInt(minPrice, 10));
    }

    if (maxPrice) {
      result = result.filter(p => p.price <= parseInt(maxPrice, 10));
    }

    if (inStockOnly) {
      result = result.filter(p => p.stock > 0);
    }

    // Sorting
    switch (sortOption) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'best-selling':
        result.sort((a, b) => b.sales - a.sales);
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    // Always push out-of-stock products to the very bottom
    result.sort((a, b) => {
      const aInStock = a.stock > 0 ? 1 : 0;
      const bInStock = b.stock > 0 ? 1 : 0;
      return bInStock - aInStock;
    });

    return result;
  }, [products, searchQuery, categoryFilter, sortOption, minPrice, maxPrice, inStockOnly, promoFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, sortOption, minPrice, maxPrice, inStockOnly, promoFilter]);

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const getPageTitle = () => {
    if (promoFilter) return 'Promo Khusus';
    if (searchQuery) return `Hasil Pencarian: "${searchQuery}"`;
    if (categoryFilter) {
      const cat = categories.find(c => c.id === categoryFilter);
      return cat ? cat.name : 'Kategori';
    }
    return 'Semua Produk';
  };

  return (
    <div className="shop-page container">
      <div className="shop-header">
        <button 
          onClick={() => navigate(-1)} 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            background: 'none', 
            border: 'none', 
            color: 'var(--color-primary)', 
            cursor: 'pointer',
            marginBottom: '1rem',
            fontWeight: 500,
            padding: 0
          }}
        >
          <ArrowLeft size={18} /> Kembali
        </button>
        <h1 className="shop-title">{getPageTitle()}</h1>
        <p className="shop-subtitle">Menampilkan {filteredProducts.length} produk</p>
      </div>

      <div className="shop-layout">
        {/* Mobile Filter Toggle */}
        <button 
          className="btn btn-outline mobile-filter-toggle"
          onClick={() => setIsFilterOpen(true)}
        >
          <Filter size={18} /> Filter Produk
        </button>

        {/* Sidebar Filters */}
        <aside className={`shop-sidebar ${isFilterOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <h3>Filter</h3>
            <button className="close-filter" onClick={() => setIsFilterOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="filter-group">
            <h4>Kategori</h4>
            <div className="filter-options">
              <label className="filter-label">
                <input 
                  type="radio" 
                  name="category" 
                  checked={categoryFilter === ''}
                  onChange={() => handleFilterChange('category', '')}
                />
                Semua Kategori
              </label>
              {categories.map(cat => (
                <label key={cat.id} className="filter-label">
                  <input 
                    type="radio" 
                    name="category" 
                    checked={categoryFilter === cat.id}
                    onChange={() => handleFilterChange('category', cat.id)}
                  />
                  {cat.name}
                </label>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h4>Rentang Harga</h4>
            <div className="price-inputs">
              <input 
                type="number" 
                placeholder="Min (Rp)" 
                value={minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="input-field"
              />
              <span>-</span>
              <input 
                type="number" 
                placeholder="Max (Rp)" 
                value={maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="input-field"
              />
            </div>
          </div>



          <div className="filter-group">
            <h4>Ketersediaan</h4>
            <div className="filter-options">
              <label className="filter-label">
                <input 
                  type="checkbox" 
                  checked={inStockOnly}
                  onChange={(e) => handleFilterChange('inStock', e.target.checked ? 'true' : '')}
                />
                Tersedia saja
              </label>
            </div>
          </div>
          
          <button 
            className="btn btn-outline reset-filters"
            onClick={() => setSearchParams(new URLSearchParams())}
          >
            Reset Filter
          </button>
        </aside>

        {/* Overlay for mobile filter */}
        {isFilterOpen && (
          <div className="filter-overlay" onClick={() => setIsFilterOpen(false)}></div>
        )}

        {/* Main Content */}
        <main className="shop-content">
          <div className="shop-topbar">
            <div className="result-count">
              {filteredProducts.length} Produk Ditemukan
            </div>
            <div className="sort-control">
              <label htmlFor="sort-select">Urutkan:</label>
              <div className="select-wrapper">
                <select 
                  id="sort-select"
                  value={sortOption}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className="input-field"
                >
                  <option value="newest">Terbaru</option>
                  <option value="price-asc">Termurah</option>
                  <option value="price-desc">Termahal</option>
                  <option value="best-selling">Terlaris</option>
                </select>
                <ChevronDown size={16} className="select-icon" />
              </div>
            </div>
          </div>

          {currentProducts.length > 0 ? (
            <>
              <div className="shop-grid">
                {currentProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              {totalPages > 1 && (
                <div className="shop-pagination">
                  <Pagination 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    onPageChange={setCurrentPage} 
                  />
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <h3>Tidak ada produk ditemukan</h3>
              <p>Coba sesuaikan filter atau kata kunci pencarian Anda.</p>
              <button 
                className="btn btn-primary"
                onClick={() => setSearchParams(new URLSearchParams())}
              >
                Hapus Semua Filter
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ShopPage;
