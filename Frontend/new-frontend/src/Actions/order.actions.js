import axios from "axios"; // Change: Import standard axios, not the helper
import { orderConstants, cartConstants } from "../Actions/constant";

// --- SMART URL SWITCH ---
const BASE_URL = window.location.hostname === "localhost" 
  ? "http://localhost:3000" 
  : "https://scarlett-marque.onrender.com";

// --- HELPER FOR HEADERS ---
// This ensures every request sends your login token
const getAuthConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

export const createOrder = (order) => {
  return async (dispatch) => {
    dispatch({ type: orderConstants.ORDER_CREATE_REQUEST });
    try {
      // UPDATED: Use BASE_URL and Explicit Auth Config
      const res = await axios.post(
        `${BASE_URL}/order`, 
        order, 
        getAuthConfig()
      );

      if (res.status === 201) {
        dispatch({
          type: orderConstants.ORDER_CREATE_SUCCESS,
          payload: res.data,
        });
        dispatch({ type: cartConstants.RESET_CART });
      }
    } catch (error) {
      console.error(
        "ORDER SAVE FAILED:",
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

      // UPDATED: Use BASE_URL and Explicit Auth Config
      const res = await axios.post(
        `${BASE_URL}/order/create-after-payment`, 
        payload,
        getAuthConfig()
      );

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

      // UPDATED: Use BASE_URL and Explicit Auth Config
      const res = await axios.get(
        `${BASE_URL}/order/${id}`, 
        getAuthConfig()
      );

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

    // UPDATED: Use BASE_URL and Explicit Auth Config
    const { data } = await axios.put(
      `${BASE_URL}/order/${orderId}/pay`, 
      paymentResult,
      getAuthConfig()
    );

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

      // UPDATED: Use BASE_URL and Explicit Auth Config
      const res = await axios.get(
        `${BASE_URL}/order/myorders`, 
        getAuthConfig()
      );

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

      // UPDATED: Use BASE_URL and Explicit Auth Config
      const res = await axios.get(
        `${BASE_URL}/order`, 
        getAuthConfig()
      );

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
      // UPDATED: Use BASE_URL and Explicit Auth Config
      const res = await axios.post(
        `${BASE_URL}/order/update`, 
        payload, 
        getAuthConfig()
      );

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

      // UPDATED: Use BASE_URL and Explicit Auth Config
      const res = await axios.put(
        `${BASE_URL}/order/${orderId}/confirm-delivery`, 
        {}, // Empty body for put request
        getAuthConfig()
      );

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

      // UPDATED: Use BASE_URL and Explicit Auth Config
      const res = await axios.put(
        `${BASE_URL}/order/${orderId}/report-issue`, 
        {}, // Empty body
        getAuthConfig()
      );

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