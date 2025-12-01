import { productConstants } from "../Actions/constant";

const initialState = {
  products: [],
  loading: false,
  error: null,
};
const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case productConstants.ADD_PRODUCT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case productConstants.ADD_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case productConstants.ADD_PRODUCT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.message,
      };
    case productConstants.GET_PRODUCTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case productConstants.GET_PRODUCTS_SUCCESS:
      return {
        ...state,
        products: action.payload,
        loading: false,
        error: null,
      };
    case productConstants.GET_PRODUCTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case productConstants.UPDATE_PRODUCT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case productConstants.UPDATE_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case productConstants.UPDATE_PRODUCT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.message,
      };
    case productConstants.DELETE_PRODUCT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case productConstants.DELETE_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case productConstants.DELETE_PRODUCT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    default:
      break;
  }
  return state;
};

export default productReducer;
