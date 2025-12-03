import axios from "axios";
import { authConstants } from "./constant";

export const login = (loginData, navigate) => {
  return async (dispatch) => {
    try {
      dispatch({ type: authConstants.LOGIN_REQUEST });

      // 1. Login using your specific IP
      const res = await axios.post(
        "http://172.20.10.4:3000/user/loginUser",
        loginData
      );

      if (res.status === 200) {
        const { token, username, role } = res.data;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify({ username, role }));

        // ---------------------------------------------------------
        // START: CART MERGE LOGIC (Updated with your IP)
        // ---------------------------------------------------------
        const localCart = localStorage.getItem("cart")
          ? JSON.parse(localStorage.getItem("cart"))
          : [];

        if (localCart.length > 0) {
          console.log("Merging guest cart...");

          const mergeRequests = localCart.map((item) => {
            const payload = {
              cartItems: {
                product: item._id,
                quantity: item.qty,
                price: item.price,
              },
            };
            
            // We use the same IP address here
            return axios.post(
              "http://172.20.10.4:3000/cart/user/cart/addtocart", 
              payload, 
              {
                headers: { Authorization: `Bearer ${token}` }
              }
            );
          });

          await Promise.all(mergeRequests);
          
          localStorage.removeItem("cart");
          console.log("Cart merged successfully.");
        }
        // ---------------------------------------------------------
        // END: CART MERGE LOGIC
        // ---------------------------------------------------------

        dispatch({
          type: authConstants.LOGIN_SUCCESS,
          payload: {
            token,
            user: { username, role },
          },
        });

        window.location.href = "/";
      }
    } catch (error) {
      console.log("error in login action", error);

      const errorMessage =
        error.response && error.response.data.message
          ? error.response.data.message
          : "Login Failed";

      dispatch({
        type: authConstants.LOGIN_FAILURE,
        payload: { message: errorMessage },
      });
    }
  };
};

export const logout = (navigate) => {
  return async (dispatch) => {
    try {
      dispatch({ type: authConstants.LOGOUT_REQUEST });

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      dispatch({ type: authConstants.LOGOUT_SUCCESS });

      window.location.href = "/signin";
    } catch (error) {
      console.log("error in logout action", error);
    }
  };
};

export const register = (signUpData, navigate) => {
  return async (dispatch) => {
    try {
      dispatch({ type: authConstants.REGISTER_REQUEST });

      const res = await axios.post(
        "http://172.20.10.4:3000/user/registerUser",
        signUpData
      );

      if (res.status === 201 || res.status === 200) {
        dispatch({
          type: authConstants.REGISTER_SUCCESS,
          payload: { message: res.data.message },
        });

        alert("Registration Successful! Please Sign In.");
        navigate("/signin");
      }
    } catch (error) {
      console.log("error in register action", error);

      const errorMessage =
        error.response && error.response.data.message
          ? error.response.data.message
          : "Registration Failed";

      dispatch({
        type: authConstants.REGISTER_FAILURE,
        payload: { message: errorMessage },
      });
    }
  };
};