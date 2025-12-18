import axios from "../helpers/axios";
import { orderConstants, cartConstants } from "../Actions/constant";

export const createOrder = (order) => {
  return async (dispatch) => {
    dispatch({ type: orderConstants.ORDER_CREATE_REQUEST });
    try {
      console.log("👉 Sending Order to Backend:", order); // DEBUG LOG 1
      const res = await axios.post("/order", order);

      console.log("✅ Backend Response:", res); // DEBUG LOG 2
      if (res.status === 201) {
        dispatch({
          type: orderConstants.ORDER_CREATE_SUCCESS,
          payload: res.data,
        });
        // OPTIONAL: Clear cart immediately in Redux
        dispatch({ type: cartConstants.RESET_CART });
      }
    } catch (error) {
      // DEBUG LOG 3: This reveals the REAL error
      console.error("❌ ORDER SAVE FAILED:", error.response ? error.response.data : error);
      
      dispatch({
        type: orderConstants.ORDER_CREATE_FAILURE,
        payload: error.response && error.response.data.message
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

export const getAllOrders = () => async (dispatch, getState) => {
  try {
    dispatch({ type: "ORDER_LIST_REQUEST" });

    const {
      auth: { token },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.get("http://localhost:3000/order", config);

    dispatch({
      type: "ORDER_LIST_SUCCESS",
      payload: data,
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