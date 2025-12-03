import { createSlice } from "@reduxjs/toolkit";

const loadLocalCart = () => {
  try {
    const serializedCart = localStorage.getItem("cart");
    return serializedCart ? JSON.parse(serializedCart) : [];
  } catch (e) {
    return [];
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: loadLocalCart(),
    updatingCart: false,
    error: null,
  },
  reducers: {
    setCartLoading: (state, action) => {
      state.updatingCart = action.payload;
    },

    setCart: (state, action) => {
      state.cartItems = action.payload;
      state.updatingCart = false;
      state.error = null;
    },

    setCartError: (state, action) => {
      state.updatingCart = false;
      state.error = action.payload;
    },

    addToCartLocal: (state, action) => {
      const { product, qty } = action.payload;

      const existingIndex = state.cartItems.findIndex(
        (item) => item._id === product._id
      );

      if (existingIndex >= 0) {
        state.cartItems[existingIndex].qty += qty;
        if (state.cartItems[existingIndex].qty <= 0) {
          state.cartItems.splice(existingIndex, 1);
        }
      } else {
        if (qty > 0) {
          const newItem = {
            _id: product._id,
            title: product.title,
            image: product.image,
            price: product.price,
            category: product.category,
            qty: qty,
          };
          state.cartItems.push(newItem);
        }
      }

      localStorage.setItem("cart", JSON.stringify(state.cartItems));
      state.updatingCart = false;
    },

    removeFromCartLocal: (state, action) => {
      const productId = action.payload;
      state.cartItems = state.cartItems.filter(
        (item) => item._id !== productId
      );
      localStorage.setItem("cart", JSON.stringify(state.cartItems));
      state.updatingCart = false;
    },

    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem("cart");
      state.updatingCart = false;
    },
  },
});

export const {
  setCart,
  setCartLoading,
  setCartError,
  addToCartLocal,
  removeFromCartLocal,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
