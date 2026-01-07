import axios from "axios";
import { authConstants } from "./constant";

const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://scarlett-marque.onrender.com";

// --- Helper: Merge Cart ---
const mergeCart = async (token) => {
  const localCart = localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [];

  if (localCart.length > 0) {
    const mergeRequests = localCart.map((item) => {
      return axios.post(
        `${BASE_URL}/cart/user/cart/addtocart`,
        {
          cartItems: {
            product: item._id,
            quantity: item.qty,
            price: item.price,
          },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    });

    await Promise.all(mergeRequests);
    localStorage.removeItem("cart");
  }
};

// --- 1. Login Action ---
export const login = (loginData) => {
  return async (dispatch) => {
    try {
      dispatch({ type: authConstants.LOGIN_REQUEST });

      const cleanLoginData = {
        ...loginData,
        username: loginData.username ? loginData.username.trim() : "",
      };

      const res = await axios.post(
        `${BASE_URL}/user/loginUser`,
        cleanLoginData
      );

      if (res.status === 200) {
        const { token, username, role } = res.data;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify({ username, role }));

        await mergeCart(token);

        dispatch({
          type: authConstants.LOGIN_SUCCESS,
          payload: {
            token,
            user: { username, role },
          },
        });
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

// --- 2. Verify OTP Action ---
export const verifyOtp = (otpData) => {
  return async (dispatch) => {
    try {
      const res = await axios.post(`${BASE_URL}/user/verify-email`, otpData);

      if (res.status === 200) {
        // Clearing errors upon success
        dispatch({
          type: authConstants.LOGIN_FAILURE,
          payload: { error: null },
        });

        return true;
      }
    } catch (error) {
      console.log("error in verify otp", error);
      dispatch({
        type: authConstants.LOGIN_FAILURE,
        payload: { error: "Invalid or expired OTP" },
      });
      return false;
    }
  };
};

// --- 3. Resend OTP Action ---
export const resendOtp = (data) => {
  return async (dispatch) => {
    try {
      await axios.post(`${BASE_URL}/user/resend-otp`, data);
    } catch (error) {
      console.log("Error resending OTP", error);
    }
  };
};

// --- 4. Register Action ---
export const register = (signUpData) => {
  return async (dispatch) => {
    try {
      dispatch({ type: authConstants.REGISTER_REQUEST });

      const cleanSignUpData = {
        ...signUpData,
        username: signUpData.username ? signUpData.username.trim() : "",
        email: signUpData.email ? signUpData.email.trim().toLowerCase() : "",
      };

      const res = await axios.post(
        `${BASE_URL}/user/registerUser`,
        cleanSignUpData
      );

      if (res.status === 201 || res.status === 200) {
        dispatch({
          type: authConstants.REGISTER_SUCCESS,
          payload: { message: res.data.message },
        });
        return true;
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
      return false;
    }
  };
};

// --- 5. Logout Action ---
export const logout = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: authConstants.LOGOUT_REQUEST });
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("cart");
      dispatch({ type: authConstants.LOGOUT_SUCCESS });

      window.location.href = "/signin";
    } catch (error) {
      console.log("error in logout action", error);
    }
  };
};

// ForgotPassword and ResetPassword have been removed.