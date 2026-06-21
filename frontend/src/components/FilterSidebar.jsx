import React from 'react';
import { useApp } from '../context/AppContext';
import { RefreshCw } from 'lucide-react';

export const FilterSidebar = ({
  categories,
  priceMin,
  setPriceMin,
  priceMax,
  setPriceMax,
  inStockOnly,
  setInStockOnly,
  onReset
}) => {
  const { selectedCategory, setSelectedCategory } = useApp();

  return (
    <aside className="sidebar-aside" aria-label="Filters">
      <div className="filter-card">
        {/* Category Section */}
        <div className="filter-section">
          <h3>Category</h3>
          <nav className="category-pills" aria-label="Product categories">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`pill-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
                aria-current={selectedCategory === cat ? 'true' : 'false'}
              >
                {cat}
              </button>
            ))}
          </nav>
        </div>

        {/* Price Range Section */}
        <div className="filter-section">
          <h3 id="price-range-heading">Price Range</h3>
          <div className="price-range-inputs" role="group" aria-labelledby="price-range-heading">
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="price-min" className="sr-only">Minimum price</label>
              <input
                id="price-min"
                type="number"
                min="0"
                placeholder="Min"
                className="price-input"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
              />
            </div>
            <span aria-hidden="true" style={{ color: 'hsl(var(--text-muted))' }}>&mdash;</span>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="price-max" className="sr-only">Maximum price</label>
              <input
                id="price-max"
                type="number"
                min="0"
                placeholder="Max"
                className="price-input"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Availability Section */}
        <div className="filter-section">
          <h3>Availability</h3>
          <label className="checkbox-label" htmlFor="stock-checkbox">
            <input
              id="stock-checkbox"
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
            />
            <span>In stock only</span>
          </label>
        </div>

        {/* Reset Button */}
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onReset}
          style={{ width: '100%', gap: '8px', marginTop: '8px' }}
        >
          <RefreshCw size={16} aria-hidden="true" />
          <span>Reset Filters</span>
        </button>
      </div>
    </aside>
  );
};
export default FilterSidebar;
