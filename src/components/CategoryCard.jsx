import React from 'react';
import { Link } from 'react-router';
import { Box, Cpu, Droplets, CircuitBoard, Wrench, Zap } from 'lucide-react';
import './CategoryCard.css';

const iconMap = { Box, Cpu, Droplets, CircuitBoard, Wrench, Zap };

export default function CategoryCard({ category }) {
  const IconComponent = iconMap[category.icon] || Box;

  return (
    <Link to={`/shop?category=${category.slug}`} className="category-card glass">
      <h3 className="category-card__name">{category.name}</h3>
      <span className="category-card__count">{category.productCount} Produk</span>
    </Link>
  );
}
