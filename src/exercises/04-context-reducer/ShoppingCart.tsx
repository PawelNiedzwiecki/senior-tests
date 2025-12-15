import { CartProvider } from './CartContext';
import { ThemeProvider, useTheme } from './ThemeContext';
import { ProductCard } from './ProductCard';
import { CartSummary } from './CartSummary';
import './ShoppingCart.css';

const products = [
  { id: 1, name: 'Wireless Headphones', price: 99.99, image: '🎧' },
  { id: 2, name: 'Smart Watch', price: 249.99, image: '⌚' },
  { id: 3, name: 'Laptop Stand', price: 49.99, image: '💻' },
  { id: 4, name: 'Mechanical Keyboard', price: 149.99, image: '⌨️' },
  { id: 5, name: 'USB-C Hub', price: 79.99, image: '🔌' },
  { id: 6, name: 'Webcam HD', price: 89.99, image: '📷' },
];

const ShoppingCartContent = () => {
  // TODO: Use the useTheme hook to get theme and toggleTheme
  const theme = 'light'; // Replace with useTheme()
  const toggleTheme = () => {}; // Replace with useTheme()

  return (
    <div className={`shopping-cart ${theme}`}>
      <header className="header">
        <h1>Tech Store</h1>
        <button onClick={toggleTheme} className="theme-toggle">
          {theme === 'light' ? '🌙' : '☀️'} Toggle Theme
        </button>
      </header>

      <div className="main-content">
        <div className="products-section">
          <h2>Products</h2>
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        <CartSummary />
      </div>
    </div>
  );
};

export const ShoppingCart = () => {
  return (
    <ThemeProvider>
      <CartProvider>
        <ShoppingCartContent />
      </CartProvider>
    </ThemeProvider>
  );
};

export default ShoppingCart;
