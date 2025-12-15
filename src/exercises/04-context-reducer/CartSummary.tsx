// import { useCart } from './CartContext';

export const CartSummary = () => {
  // TODO: Use the useCart hook to get cart state and actions
  // const { state, removeItem, updateQuantity, clearCart } = useCart();

  // Placeholder state - replace with actual cart state
  const items: never[] = [];
  const total = 0;

  return (
    <div className="cart-summary">
      <h2>Shopping Cart</h2>

      {items.length === 0 ? (
        <p className="empty-cart">Your cart is empty</p>
      ) : (
        <>
          <ul className="cart-items">
            {/* TODO: Map through items and render each cart item */}
            {/* Each item should show:
                - Image
                - Name
                - Price
                - Quantity controls (+/-)
                - Remove button
                - Item subtotal
            */}
          </ul>

          <div className="cart-footer">
            <div className="cart-total">
              <span>Total:</span>
              <span className="total-amount">${total.toFixed(2)}</span>
            </div>

            <button
              className="clear-cart-btn"
              onClick={() => {
                // TODO: Call clearCart
              }}
            >
              Clear Cart
            </button>

            <button className="checkout-btn">Checkout</button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartSummary;
