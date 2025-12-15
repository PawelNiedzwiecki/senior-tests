import { memo } from 'react';
import { Product } from './ProductList';

interface ProductItemProps {
  product: Product;
  isSelected: boolean;
  onToggle: (id: number) => void;
}

// SOLUTION 7: Wrap this component with React.memo
// Using a custom comparison function for fine-grained control
export const ProductItem = memo(
  ({ product, isSelected, onToggle }: ProductItemProps) => {
    // This log helps you see when the component re-renders
    console.log(`Rendering ProductItem ${product.id}`);

    return (
      <div
        className={`product-item ${isSelected ? 'selected' : ''}`}
        onClick={() => onToggle(product.id)}
      >
        <h3>{product.name}</h3>
        <p className="category">{product.category}</p>
        <p className="price">${product.price.toFixed(2)}</p>
        <p className="rating">{'⭐'.repeat(Math.round(product.rating))} ({product.rating})</p>
        {isSelected && <span className="checkmark">✓</span>}
      </div>
    );
  },
  // Custom comparison function (optional but recommended for complex props)
  (prevProps, nextProps) => {
    return (
      prevProps.product.id === nextProps.product.id &&
      prevProps.product.name === nextProps.product.name &&
      prevProps.product.price === nextProps.product.price &&
      prevProps.product.category === nextProps.product.category &&
      prevProps.product.rating === nextProps.product.rating &&
      prevProps.isSelected === nextProps.isSelected &&
      prevProps.onToggle === nextProps.onToggle
    );
  }
);

export default ProductItem;
