import { configureStore, createReducer } from "@reduxjs/toolkit";
import rootReducer from "../Reducers";
import productReducer from "../Reducers/product.reducer";
import cartReducer from "../Reducers/cartSlice";
import authReducer from "../Reducers/auth.reducer";

const store = configureStore({
  reducer: {
    product: productReducer,
    cart: cartReducer,
    auth: authReducer,
  },
});

export default store;
