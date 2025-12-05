import axios from "../helpers/axios";
import { 
  setCart, 
  setCartLoading, 
  setCartError, 
  addToCartLocal, 
  removeFromCartLocal 
} from "../Reducers/cartSlice";

export const getCartItems = () => {
  return async (dispatch) => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        dispatch(setCartLoading(true));
        const res = await axios.post("/cart/user/cart/getCartItems");
        if (res.status === 200) {
          const { cartItems } = res.data;
          if (cartItems && typeof cartItems === "object") {
             const cartArray = Object.keys(cartItems).map((key) => cartItems[key]);
             dispatch(setCart(cartArray));
          }
        }
      } catch (error) {
        console.log(error);
      }
    } 
  };
};

export const addItemToCart = (product, qty = 1) => {
  return async (dispatch) => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        dispatch(setCartLoading(true));
        const payload = {
          cartItems: {
            product: product._id,
            quantity: qty,
            price: product.price,
          },
        };
        const res = await axios.post("/cart/user/cart/addtocart", payload);
        if (res.status === 201) {
          dispatch(getCartItems());
        }
      } catch (error) {
        console.log(error);
        dispatch(setCartError(error));
      }
    } else {
      dispatch(addToCartLocal({ product, qty }));
    }
  };
};

export const removeCartItem = (productId) => {
  return async (dispatch) => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        dispatch(setCartLoading(true));
        const payload = { payload: { productId } };
        const res = await axios.post("/cart/user/cart/removeItem", payload);
        if (res.status === 202) {
          dispatch(getCartItems());
        }
      } catch (error) {
        console.log(error);
        dispatch(setCartError(error));
      }
    } else {
      dispatch(removeFromCartLocal(productId));
    }
  };
};