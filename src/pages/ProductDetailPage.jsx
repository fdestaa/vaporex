import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import Breadcrumb from '../components/Breadcrumb';
import Button from '../components/Button';
import PriceDisplay from '../components/PriceDisplay';
import QuantitySelector from '../components/QuantitySelector';
import Badge from '../components/Badge';
import ProductCard from '../components/ProductCard';
import useCartStore from '../store/useCartStore';
import useToastStore from '../store/useToastStore';
import { Star, ShoppingCart, CreditCard } from 'lucide-react';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState('');
  
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);
  const addToast = useToastStore((state) => state.addToast);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const res = await fetch('/api/products');
        const allProducts = await res.json();
        const found = allProducts.find(p => p.slug === slug);
        setProduct(found || null);
        
        if (found) {
          setRelatedProducts(
            allProducts.filter(p => p.categoryId === found.categoryId && p.id !== found.id).slice(0, 4)
          );
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [slug]);

  useEffect(() => {
    if (product) {
      setMainImage(product.images?.[0] || '');
      setSelectedVariant(null);
      setQuantity(1);
    }
  }, [product]);

  if (loading) {
    return <div style={{ padding: '4rem', textAlign: 'center' }}>Memuat produk...</div>;
  }

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Produk Tidak Ditemukan</h2>
        <Button onClick={() => navigate('/shop')}>Kembali Belanja</Button>
      </div>
    );
  }


  const handleAddToCart = () => {
    if (product.variants?.length > 0 && !selectedVariant) {
      addToast('Pilih varian terlebih dahulu', 'warning');
      return;
    }
    addItem(product, selectedVariant, quantity);
    addToast('Produk ditambahkan ke keranjang', 'success');
    openCart();
  };

  const handleBuyNow = () => {
    if (product.variants?.length > 0 && !selectedVariant) {
      addToast('Pilih varian terlebih dahulu', 'warning');
      return;
    }
    addItem(product, selectedVariant, quantity);
    navigate('/checkout');
  };

  const breadcrumbItems = [
    { label: 'Beranda', href: '/' },
    { label: product.category, href: `/category/${product.categoryId}` },
    { label: product.name }
  ];

  const maxStock = selectedVariant ? selectedVariant.stock : product.stock;
  const isOutOfStock = maxStock === 0;

  const sales = product.salesCount || 0;
  const computedRating = sales > 0 ? (4.3 + ((product.id * 13) % 8) / 10).toFixed(1) : '0.0';
  const ratio = 0.3 + (((product.id * 7) % 7) / 10);
  const reviewCount = sales > 0 ? Math.max(1, Math.floor(sales * ratio)) : 0;

  return (
    <div className="product-detail-page">
      <div className="container">
        <Breadcrumb items={breadcrumbItems} />
        
        <div className="product-detail-grid">
          <div className="product-gallery">
            <div className="main-image">
              {product.isNew && <Badge variant="primary" className="detail-badge-new">Baru</Badge>}
              {product.discountPrice && <Badge variant="danger" className="detail-badge-sale">Diskon</Badge>}
              <img src={mainImage || '/products/placeholder.jpg'} alt={product.name} />
            </div>
            {product.images.length > 1 && (
              <div className="thumbnail-list">
                {product.images.map((img, idx) => (
                  <button 
                    key={idx} 
                    className={`thumbnail-btn ${mainImage === img ? 'active' : ''}`}
                    onClick={() => setMainImage(img)}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="product-info">
            <div className="brand-name">{product.brand}</div>
            <h1 className="product-title">{product.name}</h1>
            
            <div className="product-meta">
              <div className="rating">
                <Star size={16} className="star-icon" color={sales > 0 ? 'var(--color-warning)' : 'var(--color-text-muted)'} fill={sales > 0 ? 'var(--color-warning)' : 'var(--color-text-muted)'} />
                {sales > 0 ? (
                  <>
                    <span>{computedRating}</span>
                    <span className="review-count">({reviewCount} ulasan)</span>
                  </>
                ) : (
                  <span className="review-count" style={{ marginLeft: 0 }}>Belum ada ulasan</span>
                )}
              </div>
              <div className="divider"></div>
              <div className="sold-count">{sales} Terjual</div>
            </div>

            <div className="price-section">
              <PriceDisplay 
                price={product.price} 
                discountPrice={product.discountPrice} 
                size="large" 
              />
            </div>

            {product.variants?.length > 0 && (
              <div className="variant-section">
                <div className="section-label">
                  Varian: <span>{selectedVariant ? selectedVariant.name : 'Pilih varian'}</span>
                </div>
                <div className="variant-grid">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      className={`variant-btn ${selectedVariant?.id === v.id ? 'active' : ''} ${v.stock === 0 ? 'disabled' : ''}`}
                      onClick={() => v.stock > 0 && setSelectedVariant(v)}
                      disabled={v.stock === 0}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="quantity-section">
              <div className="section-label">Kuantitas:</div>
              <div className="quantity-wrapper">
                <QuantitySelector 
                  value={quantity} 
                  onChange={setQuantity} 
                  max={maxStock} 
                  disabled={isOutOfStock}
                />
                <span className="stock-info">
                  {isOutOfStock ? 'Stok Habis' : `Tersedia ${maxStock} item`}
                </span>
              </div>
            </div>

            <div className="action-section">
              <Button 
                variant="outline" 
                fullWidth 
                size="large" 
                icon={<ShoppingCart size={20} />}
                onClick={handleAddToCart}
                disabled={isOutOfStock}
              >
                Tambah ke Keranjang
              </Button>
              <Button 
                variant="primary" 
                fullWidth 
                size="large" 
                icon={<CreditCard size={20} />}
                onClick={handleBuyNow}
                disabled={isOutOfStock}
              >
                Beli Sekarang
              </Button>
            </div>

            <div className="description-section">
              <h3>Deskripsi Produk</h3>
              <p>{product.description}</p>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="related-products">
            <div className="section-header">
              <h2>Produk Terkait</h2>
            </div>
            <div className="related-grid">
              {relatedProducts.map(rp => (
                <ProductCard key={rp.id} product={rp} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
