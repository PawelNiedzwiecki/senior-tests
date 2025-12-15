import { createContext, useContext, useReducer, ReactNode } from 'react';

// Types
export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  total: number;
}

// TODO 1: Define the action types using a discriminated union
// Actions needed: ADD_ITEM, REMOVE_ITEM, UPDATE_QUANTITY, CLEAR_CART
type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  // Add more action types here
  ;

// TODO 2: Implement the cart reducer
// Handle each action type:
// - ADD_ITEM: Add item to cart or increment quantity if exists
// - REMOVE_ITEM: Remove item from cart by id
// - UPDATE_QUANTITY: Update quantity of an item
// - CLEAR_CART: Remove all items
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      // YOUR CODE HERE
      return state;
    }
    // Add more cases here
    default:
      return state;
  }
};

// Helper function to calculate total
const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

// TODO 3: Define the context type
interface CartContextType {
  state: CartState;
  // Add methods: addItem, removeItem, updateQuantity, clearCart
}

// TODO 4: Create the context with proper default value
const CartContext = createContext<CartContextType | undefined>(undefined);

// TODO 5: Implement the CartProvider component
interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const initialState: CartState = {
    items: [],
    total: 0,
  };

  // TODO: Use useReducer hook here
  // const [state, dispatch] = useReducer(...)

  // TODO: Create helper functions that dispatch actions
  // const addItem = (item: Omit<CartItem, 'quantity'>) => { ... }
  // const removeItem = (id: number) => { ... }
  // const updateQuantity = (id: number, quantity: number) => { ... }
  // const clearCart = () => { ... }

  // TODO: Create the context value object
  // Consider using useMemo to prevent unnecessary re-renders

  return (
    <CartContext.Provider value={{ state: initialState }}>
      {children}
    </CartContext.Provider>
  );
};

// TODO 6: Implement the useCart hook
// Should throw an error if used outside of CartProvider
export const useCart = () => {
  const context = useContext(CartContext);
  // YOUR CODE HERE
  return context;
};

export default CartContext;
