import { createSlice } from "@reduxjs/toolkit";

// 1. Load initial cart from LocalStorage (if exists)
const loadCartFromStorage = () => {
  const savedCart = localStorage.getItem("cart");
  return savedCart ? JSON.parse(savedCart) : [];
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: loadCartFromStorage(),
  },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      // Check if item already exists in cart
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        // If exists, just increase quantity
        existItem.qty += 1;
      } else {
        // If new, add it with qty: 1
        state.cartItems.push({ ...item, qty: 1 });
      }
      
      // Save to local storage
      localStorage.setItem("cart", JSON.stringify(state.cartItems));
    },

    removeFromCart: (state, action) => {
      // Filter out the item with the specific ID
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      localStorage.setItem("cart", JSON.stringify(state.cartItems));
    },

    // Optional: Handle + and - buttons
    adjustQty: (state, action) => {
      const { id, type } = action.payload; // type is 'increase' or 'decrease'
      const item = state.cartItems.find((x) => x._id === id);
      
      if (item) {
        if (type === "increase") {
            item.qty += 1;
        } else if (type === "decrease" && item.qty > 1) {
            item.qty -= 1;
        }
      }
      localStorage.setItem("cart", JSON.stringify(state.cartItems));
    },

    clearCart: (state) => {
        state.cartItems = [];
        localStorage.removeItem("cart");
    }
  },
});

export const { addToCart, removeFromCart, adjustQty, clearCart } = cartSlice.actions;
export default cartSlice.reducer;