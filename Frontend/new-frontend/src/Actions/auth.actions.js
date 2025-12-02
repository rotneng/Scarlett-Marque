import axios from "axios";
import { authConstants } from "./constant";

export const login = (loginData, navigate) => {
  return async (dispatch) => {
    try {
      dispatch({ type: authConstants.LOGIN_REQUEST });
      
      const res = await axios.post("http://172.20.10.4:3000/user/loginUser", loginData);

      if (res.status === 200) {
        const { token, username, role } = res.data;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify({ username, role }));

        dispatch({
          type: authConstants.LOGIN_SUCCESS,
          payload: {
            token,
            user: { username, role }, 
          },
        });

        navigate("/", { replace: true });
      } 
    } catch (error) {
      console.log("error in login action", error);
      
      const errorMessage = error.response && error.response.data.message 
        ? error.response.data.message 
        : error.message;

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

      localStorage.clear(); 

      dispatch({ type: authConstants.LOGOUT_SUCCESS });
      
      navigate("/signin"); 
      
    } catch (error) {
      console.log("error in logout action", error);
    }
  };
};

export const register = (signUpData, navigate) => {
  return async (dispatch) => {
    try {
      dispatch({ type: authConstants.REGISTER_REQUEST });
      
      const res = await axios.post("http://localhost:3000/user/registerUser", signUpData);
      
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
      
      const errorMessage = error.response && error.response.data.message 
      //   ? error.response.data.message 
      //   : "Registration Failed";

      dispatch({
        type: authConstants.REGISTER_FAILURE,
        payload: { message: errorMessage },
      });
    }
  };
};