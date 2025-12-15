import { useState, useMemo, useCallback } from 'react';
import { ProductItem } from './ProductItem';
import './ProductList.css';

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  rating: number;
}

const generateProducts = (): Product[] => {
  const categories = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports'];
  return Array.from({ length: 1000 }, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    price: Math.round(Math.random() * 1000 * 100) / 100,
    category: categories[Math.floor(Math.random() * categories.length)],
    rating: Math.round(Math.random() * 5 * 10) / 10,
  }));
};

// Expensive calculation - simulates complex data processing
const calculateStats = (products: Product[]) => {
  console.log('Calculating stats... (this is expensive!)');
  // Simulate expensive operation
  let total = 0;
  for (let i = 0; i < 1000000; i++) {
    total += Math.random();
  }

  return {
    totalProducts: products.length,
    averagePrice: products.reduce((sum, p) => sum + p.price, 0) / products.length,
    averageRating: products.reduce((sum, p) => sum + p.rating, 0) / products.length,
    categories: [...new Set(products.map((p) => p.category))],
  };
};

export const ProductList = () => {
  const [products] = useState<Product[]>(generateProducts);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'rating'>('name');

  // SOLUTION 1: Memoize the filtered products
  const filteredProducts = useMemo(() => {
    console.log('Filtering products...');
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(filter.toLowerCase()) ||
        product.category.toLowerCase().includes(filter.toLowerCase())
    );
  }, [products, filter]);

  // SOLUTION 2: Memoize the sorted products
  const sortedProducts = useMemo(() => {
    console.log('Sorting products...');
    return [...filteredProducts].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'price') return a.price - b.price;
      return b.rating - a.rating;
    });
  }, [filteredProducts, sortBy]);

  // SOLUTION 3: Memoize the stats calculation
  const stats = useMemo(() => {
    return calculateStats(filteredProducts);
  }, [filteredProducts]);

  // SOLUTION 4: Memoize the toggle function with useCallback
  const toggleSelect = useCallback((productId: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  }, []);

  // SOLUTION 5: Memoize the select all function
  const selectAll = useCallback(() => {
    setSelectedIds(new Set(sortedProducts.map((p) => p.id)));
  }, [sortedProducts]);

  // SOLUTION 6: Memoize the clear selection function
  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  return (
    <div className="product-list">
      <h1>Product List (Performance Exercise)</h1>

      <div className="controls">
        <input
          type="text"
          placeholder="Filter products..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-input"
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'rating')}
          className="sort-select"
        >
          <option value="name">Sort by Name</option>
          <option value="price">Sort by Price</option>
          <option value="rating">Sort by Rating</option>
        </select>

        <button onClick={selectAll}>Select All</button>
        <button onClick={clearSelection}>Clear Selection</button>
      </div>

      <div className="stats">
        <h3>Statistics</h3>
        <p>Total: {stats.totalProducts} products</p>
        <p>Avg Price: ${stats.averagePrice.toFixed(2)}</p>
        <p>Avg Rating: {stats.averageRating.toFixed(1)} ⭐</p>
        <p>Categories: {stats.categories.join(', ')}</p>
        <p>Selected: {selectedIds.size} items</p>
      </div>

      <div className="products-grid">
        {sortedProducts.slice(0, 50).map((product) => (
          <ProductItem
            key={product.id}
            product={product}
            isSelected={selectedIds.has(product.id)}
            onToggle={toggleSelect}
          />
        ))}
      </div>

      {sortedProducts.length > 50 && (
        <p className="truncation-notice">
          Showing 50 of {sortedProducts.length} products
        </p>
      )}
    </div>
  );
};

export default ProductList;
