import axios from "../helpers/axios";
import { orderConstants, cartConstants } from "../Actions/constant";

export const createOrder = (order) => {
  return async (dispatch) => {
    dispatch({ type: orderConstants.ORDER_CREATE_REQUEST });
    try {
      console.log("👉 Sending Order to Backend:", order);
      const res = await axios.post("/order", order);

      console.log("✅ Backend Response:", res);
      if (res.status === 201) {
        dispatch({
          type: orderConstants.ORDER_CREATE_SUCCESS,
          payload: res.data,
        });
        dispatch({ type: cartConstants.RESET_CART });
      }
    } catch (error) {
      console.error(
        "❌ ORDER SAVE FAILED:",
        error.response ? error.response.data : error
      );
      dispatch({
        type: orderConstants.ORDER_CREATE_FAILURE,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
};

export const createOrderAfterPayment = (paymentResult, orderData) => {
  return async (dispatch) => {
    try {
      dispatch({ type: orderConstants.ORDER_CREATE_REQUEST });

      const payload = {
        ...orderData,
        paymentResult,
        isPaid: true,
        paidAt: Date.now(),
        paymentMethod: "Card",
      };

      const res = await axios.post("/order/create-after-payment", payload);

      if (res.status === 201) {
        dispatch({
          type: orderConstants.ORDER_CREATE_SUCCESS,
          payload: res.data,
        });
        dispatch({ type: cartConstants.RESET_CART });
      }
    } catch (error) {
      console.log("Create Order After Payment Error:", error);
      dispatch({
        type: orderConstants.ORDER_CREATE_FAILURE,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
};

export const getOrderDetails = (id) => {
  return async (dispatch) => {
    try {
      dispatch({ type: orderConstants.GET_ORDER_DETAILS_REQUEST });

      const res = await axios.get(`/order/${id}`);

      dispatch({
        type: orderConstants.GET_ORDER_DETAILS_SUCCESS,
        payload: res.data,
      });
    } catch (error) {
      dispatch({
        type: orderConstants.GET_ORDER_DETAILS_FAILURE,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
};

export const payOrder = (orderId, paymentResult) => async (dispatch) => {
  try {
    dispatch({ type: "ORDER_PAY_REQUEST" });

    const { data } = await axios.put(`/order/${orderId}/pay`, paymentResult);

    dispatch({ type: "ORDER_PAY_SUCCESS", payload: data });

    dispatch(getOrderDetails(orderId));
  } catch (error) {
    dispatch({
      type: "ORDER_PAY_FAIL",
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listMyOrders = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: orderConstants.ORDER_MY_LIST_REQUEST });

      const res = await axios.get("/order/myorders");

      dispatch({
        type: orderConstants.ORDER_MY_LIST_SUCCESS,
        payload: res.data,
      });
    } catch (error) {
      dispatch({
        type: orderConstants.ORDER_MY_LIST_FAILURE,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
};

export const getAllOrders = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: "ORDER_LIST_REQUEST" });

      const res = await axios.get("/order");

      dispatch({
        type: "ORDER_LIST_SUCCESS",
        payload: res.data.orders || res.data,
      });
    } catch (error) {
      dispatch({
        type: "ORDER_LIST_FAIL",
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
};

export const updateOrder = (payload) => {
  return async (dispatch) => {
    dispatch({ type: orderConstants.UPDATE_CUSTOMER_ORDER_REQUEST });
    try {
      const res = await axios.post("/order/update", payload);

      if (res.status === 201) {
        dispatch({ type: orderConstants.UPDATE_CUSTOMER_ORDER_SUCCESS });
        dispatch(getAllOrders());
      }
    } catch (error) {}
  };
};

export const confirmDelivery = (orderId) => {
  return async (dispatch) => {
    try {
      dispatch({ type: orderConstants.UPDATE_CUSTOMER_ORDER_REQUEST });

      const res = await axios.put(`/order/${orderId}/confirm-delivery`);

      if (res.status === 200) {
        dispatch({ type: orderConstants.UPDATE_CUSTOMER_ORDER_SUCCESS });
        dispatch(getOrderDetails(orderId));
      }
    } catch (error) {
      dispatch({
        type: orderConstants.UPDATE_CUSTOMER_ORDER_FAILURE,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
};

export const reportOrderIssue = (orderId) => {
  return async (dispatch) => {
    try {
      dispatch({ type: orderConstants.UPDATE_CUSTOMER_ORDER_REQUEST });

      const res = await axios.put(`/order/${orderId}/report-issue`);

      if (res.status === 200) {
        dispatch({ type: orderConstants.UPDATE_CUSTOMER_ORDER_SUCCESS });
        dispatch(getOrderDetails(orderId));
      }
    } catch (error) {
      dispatch({
        type: orderConstants.UPDATE_CUSTOMER_ORDER_FAILURE,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
};
