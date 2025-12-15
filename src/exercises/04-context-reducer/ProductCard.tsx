// import { useCart } from './CartContext';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  // TODO: Use the useCart hook to get the addItem function
  // const { addItem } = useCart();

  const handleAddToCart = () => {
    // TODO: Call addItem with the product
    console.log('Add to cart:', product);
  };

  return (
    <div className="product-card">
      <div className="product-image">{product.image}</div>
      <h3>{product.name}</h3>
      <p className="price">${product.price.toFixed(2)}</p>
      <button onClick={handleAddToCart} className="add-to-cart-btn">
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
