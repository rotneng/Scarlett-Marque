import axios from "axios";
import { messageConstants } from "./constant";

export const addMessage = (message) => {
  return async (dispatch) => {
    dispatch({ type: messageConstants.ADD_MESSAGE_REQUEST });
    try {
      const res = await axios.post("/api/addMessage", {
        name: message.name,
        email: message.email,
        subject: message.subject,
        message: message.message,
      });
      if (res.status === 200) {
        dispatch({
          type: messageConstants.ADD_MESSAGE_SUCCESS,
          payload: { message: res.data.message, data: res.data.data },
        });
      } else {
        dispatch({
          type: messageConstants.ADD_MESSAGE_FAILURE,
          payload: { message: res.data.message },
        });
      }
    } catch (error) {
      console.log(error);
      dispatch({
        type: messageConstants.ADD_MESSAGE_FAILURE,
        payload: { message: error.message },
      });
    }
  };
};

export const getMessages = () => {
  return async (dispatch) => {
    dispatch({ type: messageConstants.GET_MESSAGES_REQUEST });
    try {
      const res = await axios.get("/api/getMessages");
      if (res.status === 200) {
        dispatch({
          type: messageConstants.GET_MESSAGES_SUCCESS,
          payload: { message: res.data.message, data: res.data.data },
        });
      } else {
        dispatch({
          type: messageConstants.GET_MESSAGES_FAILURE,
          payload: { message: res.data.message },
        });
      }
    } catch (error) {
      console.log(error);
      dispatch({
        type: messageConstants.GET_MESSAGES_FAILURE,
        payload: { message: error.message },
      });
    }
  };
};

export const deleteMessage = (id) => {
  return async (dispatch) => {
    dispatch({ type: messageConstants.DELETE_MESSAGE_REQUEST });
    try {
      const res = await axios.delete(`/api/deleteMessages/${id}`);
      if (res.status === 200) {
        dispatch({
          type: messageConstants.DELETE_MESSAGE_SUCCESS,
          payload: { message: res.data.message },
        });
      } else {
        dispatch({
          type: messageConstants.DELETE_MESSAGE_FAILURE,
          payload: { message: res.data.message },
        });
      }
    } catch (error) {
      console.log(error);
      dispatch({
        type: messageConstants.DELETE_MESSAGE_FAILURE,
        payload: { message: error.message },
      });
    }
  };
};
