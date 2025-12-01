import { cartConstants } from "../Actions/constant";

// 1. Load initial state from LocalStorage
const initialCart = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : [];

const initialState = {
  cartItems: initialCart,
};

export const cartReducer = (state = initialState, action) => {
  let updatedCartItems = [];

  switch (action.type) {
    // --- ADD TO CART ---
    case cartConstants.ADD_TO_CART:
      const itemToAdd = action.payload;
      // Use the quantity sent from Product Page, or default to 1
      const quantityToAdd = itemToAdd.quantityToAdd || 1;

      // Check if item already exists
      const existItem = state.cartItems.find((x) => x._id === itemToAdd._id);

      if (existItem) {
        // If it exists, update the quantity (Old Qty + New Qty)
        updatedCartItems = state.cartItems.map((x) =>
          x._id === existItem._id
            ? { ...x, qty: x.qty + quantityToAdd }
            : x
        );
      } else {
        // If it's new, add it with the initial quantity
        updatedCartItems = [
            ...state.cartItems, 
            { ...itemToAdd, qty: quantityToAdd }
        ];
      }

      // Save to Storage
      localStorage.setItem("cart", JSON.stringify(updatedCartItems));

      return {
        ...state,
        cartItems: updatedCartItems,
      };

    // --- REMOVE FROM CART ---
    case cartConstants.REMOVE_FROM_CART:
      // Filter out the item with the matching ID
      updatedCartItems = state.cartItems.filter(
        (x) => x._id !== action.payload.id
      );

      localStorage.setItem("cart", JSON.stringify(updatedCartItems));

      return {
        ...state,
        cartItems: updatedCartItems,
      };

    // --- INCREASE QUANTITY (+1) ---
    case cartConstants.INCREASE_QTY:
      updatedCartItems = state.cartItems.map((item) => {
        if (item._id === action.payload.id) {
            // Optional: Check stock limit if you have item.stock
            return { ...item, qty: item.qty + 1 };
        }
        return item;
      });

      localStorage.setItem("cart", JSON.stringify(updatedCartItems));

      return {
        ...state,
        cartItems: updatedCartItems,
      };

    // --- DECREASE QUANTITY (-1) ---
    case cartConstants.DECREASE_QTY:
      updatedCartItems = state.cartItems.map((item) => {
        // Decrease only if qty is greater than 1
        if (item._id === action.payload.id && item.qty > 1) {
          return { ...item, qty: item.qty - 1 };
        }
        return item;
      });

      localStorage.setItem("cart", JSON.stringify(updatedCartItems));

      return {
        ...state,
        cartItems: updatedCartItems,
      };

    // --- RESET CART (Clear All) ---
    case cartConstants.RESET_CART:
      localStorage.removeItem("cart");
      return {
        ...state,
        cartItems: [],
      };

    default:
      return state;
  }
};

export default cartReducer;