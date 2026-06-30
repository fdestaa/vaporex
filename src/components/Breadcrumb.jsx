import React from 'react';
import { Link } from 'react-router';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumb({ items }) {
  return (
    <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <React.Fragment key={index}>
            {isLast ? (
              <span style={{ color: 'var(--color-text)' }} aria-current="page">
                {item.label}
              </span>
            ) : (
              <>
                <Link 
                  to={item.path} 
                  style={{ color: 'var(--color-text-muted)', textDecoration: 'none', transition: 'color var(--transition-fast)' }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--color-primary)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--color-text-muted)'}
                >
                  {item.label}
                </Link>
                <ChevronRight size={14} style={{ color: 'var(--color-text-subtle)' }} />
              </>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
