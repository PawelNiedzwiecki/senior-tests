import { Product } from './ProductList';

interface ProductItemProps {
  product: Product;
  isSelected: boolean;
  onToggle: (id: number) => void;
}

// TODO 7: Wrap this component with React.memo to prevent unnecessary re-renders
// The component should only re-render when its props actually change
// You may need to implement a custom comparison function
export const ProductItem = ({ product, isSelected, onToggle }: ProductItemProps) => {
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
};

export default ProductItem;
