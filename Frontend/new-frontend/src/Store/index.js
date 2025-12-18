import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../Reducers/product.reducer";
import cartReducer from "../Reducers/cartSlice";
import authReducer from "../Reducers/auth.reducer";
import addressReducer from "../Reducers/address.reducer";

import {
  orderCreateReducer,
  orderDetailsReducer,
  orderPayReducer,
  orderListMyReducer,
  orderListReducer,
} from "../Reducers/orderReducer";

const store = configureStore({
  reducer: {
    product: productReducer,
    cart: cartReducer,
    auth: authReducer,
    addressList: addressReducer,

    orderCreate: orderCreateReducer,
    orderDetails: orderDetailsReducer,
    orderPay: orderPayReducer,
    orderMyList: orderListMyReducer,
    orderList: orderListReducer
  },
});

export default store;