import { createSlice } from "@reduxjs/toolkit";

const loadCart = () => {
  const savedCart = localStorage.getItem("cart");
  return savedCart ? JSON.parse(savedCart) : [];
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: loadCart(),
  },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        existItem.qty += item.qty;
      } else {
        state.cartItems.push(item);
      }

      localStorage.setItem("cart", JSON.stringify(state.cartItems));
    },

    removeFromCart: (state, action) => {
      const idToRemove = action.payload;
      state.cartItems = state.cartItems.filter((x) => x._id !== idToRemove);
      localStorage.setItem("cart", JSON.stringify(state.cartItems));
    },

    increaseQty: (state, action) => {
      const item = state.cartItems.find((x) => x._id === action.payload);
      if (item) {
        item.qty += 1;
        localStorage.setItem("cart", JSON.stringify(state.cartItems));
      }
    },

    decreaseQty: (state, action) => {
      const item = state.cartItems.find((x) => x._id === action.payload);
      if (item && item.qty > 1) {
        item.qty -= 1;
        localStorage.setItem("cart", JSON.stringify(state.cartItems));
      }
    },

    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem("cart");
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQty,
  decreaseQty,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
