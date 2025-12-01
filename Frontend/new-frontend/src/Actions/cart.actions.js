import { cartConstants } from "./constant";


export const addToCart = (product, qty = 1) => {
  return (dispatch) => {
    dispatch({
      type: cartConstants.ADD_TO_CART,
      payload: { 
        ...product, 
        quantityToAdd: qty 
      },
    });
  };
};

export const removeFromCart = (id) => {
  return (dispatch) => {
    dispatch({
      type: cartConstants.REMOVE_FROM_CART,
      payload: { id },
    });
  };
};

export const increaseQty = (id) => {
  return (dispatch) => {
    dispatch({
      type: cartConstants.INCREASE_QTY,
      payload: { id },
    });
  };
};

export const decreaseQty = (id) => {
  return (dispatch) => {
    dispatch({
      type: cartConstants.DECREASE_QTY,
      payload: { id },
    });
  };
};

export const clearCart = () => {
  return (dispatch) => {
    dispatch({
      type: cartConstants.RESET_CART,
    });
  };
};