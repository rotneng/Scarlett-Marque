import { orderConstants } from "../Actions/constant";

export const orderCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case orderConstants.ORDER_CREATE_REQUEST:
      return { loading: true };
    case orderConstants.ORDER_CREATE_SUCCESS:
      return { loading: false, success: true, order: action.payload };
    case orderConstants.ORDER_CREATE_FAILURE:
    case orderConstants.ORDER_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case orderConstants.ORDER_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

export const orderDetailsReducer = (
  state = { loading: true, orderItems: [], shippingAddress: {} },
  action
) => {
  switch (action.type) {
    case orderConstants.GET_ORDER_DETAILS_REQUEST:
      return { ...state, loading: true };
    case orderConstants.GET_ORDER_DETAILS_SUCCESS:
      return { loading: false, order: action.payload };
    case orderConstants.GET_ORDER_DETAILS_FAILURE:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const orderPayReducer = (state = {}, action) => {
  switch (action.type) {
    case orderConstants.ORDER_PAY_REQUEST:
    case "ORDER_PAY_REQUEST":
      return { loading: true };
    case orderConstants.ORDER_PAY_SUCCESS:
    case "ORDER_PAY_SUCCESS":
      return { loading: false, success: true };
    case orderConstants.ORDER_PAY_FAILURE:
    case orderConstants.ORDER_PAY_FAIL:
    case "ORDER_PAY_FAIL":
      return { loading: false, error: action.payload };
    case orderConstants.ORDER_PAY_RESET:
      return {};
    default:
      return state;
  }
};

export const orderListMyReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case orderConstants.ORDER_MY_LIST_REQUEST:
      return { loading: true };
    case orderConstants.ORDER_MY_LIST_SUCCESS:
      return { loading: false, orders: action.payload };
    case orderConstants.ORDER_MY_LIST_FAILURE:
    case orderConstants.ORDER_MY_LIST_FAIL:
      return { loading: false, error: action.payload };
    case orderConstants.ORDER_MY_LIST_RESET:
      return { orders: [] };
    default:
      return state;
  }
};

export const orderListReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case "ORDER_LIST_REQUEST":
      return { loading: true };
    case "ORDER_LIST_SUCCESS":
      return {
        loading: false,
        orders: action.payload.orders || action.payload,
      };
    case "ORDER_LIST_FAIL":
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
