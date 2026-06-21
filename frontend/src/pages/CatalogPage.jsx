import   { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import { SlidersHorizontal } from 'lucide-react';

export const CatalogPage = () => {
  const { searchQuery, setSearchQuery, selectedCategory, setSelectedCategory } = useApp();

  // Filter States
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState('');
  
  // Data States
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Mobile sidebar visibility
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Fetch Categories once on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        if (!res.ok) throw new Error('Failed to fetch categories');
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Products with debounce for search, price, filters
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const queryParams = new URLSearchParams();
        if (searchQuery) queryParams.append('search', searchQuery);
        if (selectedCategory) queryParams.append('category', selectedCategory);
        if (priceMin) queryParams.append('priceMin', priceMin);
        if (priceMax) queryParams.append('priceMax', priceMax);
        if (inStockOnly) queryParams.append('inStock', 'true');
        if (sort) queryParams.append('sort', sort);

        const res = await fetch(`/api/products?${queryParams.toString()}`);
        if (!res.ok) throw new Error('Failed to load products');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError('Unable to load products. Please check your connection.');
        console.error('Products fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    const handler = setTimeout(() => {
      fetchProducts();
    }, 250);

    return () => clearTimeout(handler);
  }, [searchQuery, selectedCategory, priceMin, priceMax, inStockOnly, sort]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setPriceMin('');
    setPriceMax('');
    setInStockOnly(false);
    setSort('');
  };

  return (
    <main id="main-content" className="main-content" tabIndex="-1">
      <div className="catalog-layout">
        {/* Filter Sidebar (Desktop) */}
        <FilterSidebar
          categories={categories}
          priceMin={priceMin}
          setPriceMin={setPriceMin}
          priceMax={priceMax}
          setPriceMax={setPriceMax}
          inStockOnly={inStockOnly}
          setInStockOnly={setInStockOnly}
          onReset={handleResetFilters}
        />

        {/* Products Section */}
        <section aria-labelledby="catalog-title" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <h1 id="catalog-title" className="sr-only">Product Catalog</h1>

          {/* Catalog Controls and Info */}
          <div className="catalog-header">
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                {selectedCategory === 'All' ? 'All Products' : selectedCategory}
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'hsl(var(--text-muted))', marginTop: '4px' }}>
                Showing {products.length} {products.length === 1 ? 'product' : 'products'}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              {/* Mobile Filter Button */}
              <button
                type="button"
                className="btn btn-secondary"
                style={{ display: 'none' }} /* Hidden on desktop, toggled via media queries */
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                aria-label="Toggle filters list"
              >
                <SlidersHorizontal size={18} aria-hidden="true" />
                <span>Filters</span>
              </button>

              {/* Sort Control */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label htmlFor="catalog-sort" style={{ fontSize: '0.9rem', fontWeight: 500 }}>Sort:</label>
                <select
                  id="catalog-sort"
                  className="sort-select"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  aria-label="Sort products by"
                >
                  <option value="">Featured</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating_desc">Top Rated</option>
                  <option value="name_asc">Name: A to Z</option>
                  <option value="name_desc">Name: Z to A</option>
                </select>
              </div>
            </div>
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="loading-container" aria-live="polite" aria-busy="true">
              <div className="spinner"></div>
              <p>Refreshing product list...</p>
            </div>
          )}

          {/* Error Message */}
          {!loading && error && (
            <div className="empty-state" role="alert">
              <p style={{ color: 'hsl(var(--error))', fontWeight: 600 }}>{error}</p>
              <button type="button" className="btn" onClick={handleResetFilters}>
                Retry Loading
              </button>
            </div>
          )}

          {/* Products Grid / Empty State */}
          {!loading && !error && (
            <>
              {products.length === 0 ? (
                <div className="empty-state">
                  <p style={{ fontSize: '1.2rem', fontWeight: 500 }}>No products match your filters.</p>
                  <p>Try refining your search terms or resetting filters.</p>
                  <button type="button" className="btn btn-secondary" onClick={handleResetFilters}>
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="products-grid">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
};
export default CatalogPage;
