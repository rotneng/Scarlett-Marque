import axios from "axios";
import { authConstants } from "./constant";

const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://scarlett-marque.onrender.com";

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

export const verifyOtp = (otpData) => {
  return async (dispatch) => {
    try {
      const res = await axios.post(`${BASE_URL}/user/verify-email`, otpData);

      if (res.status === 200) {
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

export const resendOtp = (data) => {
  return async (dispatch) => {
    try {
      await axios.post(`${BASE_URL}/user/resend-otp`, data);
    } catch (error) {
      console.log("Error resending OTP", error);
    }
  };
};

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

export const logout = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: authConstants.LOGOUT_REQUEST });
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("cart");
      dispatch({ type: authConstants.LOGOUT_SUCCESS });

      window.location.href = "/signinz";
    } catch (error) {
      console.log("error in logout action", error);
    }
  };
};

export const forgotPassword = (email) => {
  return async (dispatch) => {
    dispatch({ type: authConstants.FORGOT_PASSWORD_REQUEST });

    try {
      const res = await axios.post(`${BASE_URL}/user/forgot-password`, {
        email,
      });

      if (res.status === 200) {
        dispatch({
          type: authConstants.FORGOT_PASSWORD_SUCCESS,
          payload: { message: res.data.message },
        });
        return true;
      }
    } catch (error) {
      const errorMessage =
        error.response && error.response.data.message
          ? error.response.data.message
          : "Something went wrong";

      dispatch({
        type: authConstants.FORGOT_PASSWORD_FAILURE,
        payload: { error: errorMessage },
      });
      return false;
    }
  };
};

export const resetPassword = (token, password) => {
  return async (dispatch) => {
    dispatch({ type: authConstants.RESET_PASSWORD_REQUEST });

    try {
      const res = await axios.post(`${BASE_URL}/user/reset-password/${token}`, {
        password,
      });

      if (res.status === 200) {
        dispatch({
          type: authConstants.RESET_PASSWORD_SUCCESS,
          payload: { message: res.data.message },
        });
      } else {
        dispatch({
          type: authConstants.RESET_PASSWORD_FAILURE,
          payload: { error: res.data.message },
        });
      }
    } catch (error) {
      const errorMessage =
        error.response && error.response.data
          ? error.response.data.message
          : "Something went wrong";

      dispatch({
        type: authConstants.RESET_PASSWORD_FAILURE,
        payload: { error: errorMessage },
      });
    }
  };
};
