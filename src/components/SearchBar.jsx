import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router';
import { products } from '../data/products';
import { formatPrice } from '../utils/formatters';
import './SearchBar.css';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.trim().length > 1) {
      const filtered = products
        .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()) || p.brand.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5);
      setResults(filtered);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query)}`);
      setIsOpen(false);
    }
  };

  const handleResultClick = (slug) => {
    navigate(`/shop/${slug}`);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div className="search-bar" ref={wrapperRef}>
      <form onSubmit={handleSubmit} className="search-bar__form">
        <Search className="search-bar__icon" size={20} />
        <input
          type="text"
          className="search-bar__input"
          placeholder="Cari produk..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
        />
      </form>

      {isOpen && results.length > 0 && (
        <div className="search-bar__dropdown glass fadeInDown">
          <ul className="search-bar__results">
            {results.map((product) => (
              <li 
                key={product.id} 
                className="search-bar__result-item"
                onClick={() => handleResultClick(product.slug)}
              >
                <div className="search-bar__result-img-wrapper">
                  <img src={product.images[0] || '/products/placeholder.jpg'} alt={product.name} />
                </div>
                <div className="search-bar__result-info">
                  <div className="search-bar__result-name">{product.name}</div>
                  <div className="search-bar__result-brand">{product.brand}</div>
                </div>
                <div className="search-bar__result-price">
                  {formatPrice(product.discountPrice || product.price)}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
