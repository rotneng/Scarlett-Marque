import { cartConstants } from "../Actions/cart.constants";

const initState = {
  cartItems: [],
  updatingCart: false,
  error: null,
};

export default (state = initState, action) => {
  switch (action.type) {
    case cartConstants.GET_CART_ITEMS_REQUEST:
      return {
        ...state,
        updatingCart: true,
      };
    case cartConstants.GET_CART_ITEMS_SUCCESS:
      return {
        ...state,
        cartItems: action.payload.cartItems,
        updatingCart: false,
      };
    case cartConstants.GET_CART_ITEMS_FAILURE:
      return {
        ...state,
        updatingCart: false,
        error: action.payload.error,
      };
    case cartConstants.ADD_TO_CART_REQUEST:
      return {
        ...state,
        updatingCart: true,
      };
    case cartConstants.ADD_TO_CART_SUCCESS:
      return {
        ...state,
        updatingCart: false,
      };
    case cartConstants.ADD_TO_CART_FAILURE:
      return {
        ...state,
        updatingCart: false,
        error: action.payload.error,
      };
    case cartConstants.REMOVE_CART_ITEM_REQUEST:
      return {
        ...state,
        updatingCart: true,
      };
    case cartConstants.REMOVE_CART_ITEM_SUCCESS:
      return {
        ...state,
        updatingCart: false,
      };
    case cartConstants.REMOVE_CART_ITEM_FAILURE:
      return {
        ...state,
        updatingCart: false,
        error: action.payload.error,
      };

    default:
      return state;
  }
};
