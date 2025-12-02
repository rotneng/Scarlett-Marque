import axios from "axios";
import { productConstants } from "./constant";

export const addProduct = (form, navigate) => {
  return async (dispatch) => {
    dispatch({ type: productConstants.ADD_PRODUCT_REQUEST });
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://172.20.10.4:3000/product/addProducts",
        form,
        {
          headers: { Authorization: `Bearer ${token}` }, 
        }
      );

      if (response.status === 201 || response.status === 200) {
        dispatch({
          type: productConstants.ADD_PRODUCT_SUCCESS,
          payload: response.data,
        });
        navigate("/");
      } 
    } catch (error) {
      console.log("error in adding product action", error);
      dispatch({
        type: productConstants.ADD_PRODUCT_FAILURE,
        payload: { errorMessage: error.response?.data?.message || "Add Failed" },
      });
    }
  };
};

export const getProducts = () => {
  return async (dispatch) => {
    dispatch({ type: productConstants.GET_PRODUCTS_REQUEST });
    try {
      const response = await axios.get(
        "http://172.20.10.4:3000/product/getProducts"
      );

      if (response.status === 200) {
        const productData = response.data.products
          ? response.data.products
          : response.data;

        dispatch({
          type: productConstants.GET_PRODUCTS_SUCCESS,
          payload: productData,
        });
      }
    } catch (error) {
      console.log("error in getProducts Action", error);
      dispatch({
        type: productConstants.GET_PRODUCTS_FAILURE,
        payload: { message: error.response?.data?.message },
      });
    }
  };
};

export const deleteProduct = (id) => {
  return async (dispatch) => {
    dispatch({ type: productConstants.DELETE_PRODUCT_REQUEST });

    try {
      const token = localStorage.getItem("token");

      const res = await axios.delete(
        `http://172.20.10.4:3000/product/deleteProducts/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }, 
        }
      );

      if (res.status === 200) {
        dispatch({
          type: productConstants.DELETE_PRODUCT_SUCCESS,
          payload: { id },
        });
        alert("Product Deleted Succesfully");
      }
    } catch (error) {
      console.log("error in deleting products action", error);
      dispatch({
        type: productConstants.DELETE_PRODUCT_FAILURE,
        payload: { error: error.response?.data?.message || "Delete Failed" },
      });
    }
  };
};

export const updateProduct = (id, form, navigate) => {
  return async (dispatch) => {
    dispatch({ type: productConstants.UPDATE_PRODUCT_REQUEST });

    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `http://172.20.10.4:3000/product/updateProducts/${id}`,
        form,
        {
          headers: { Authorization: `Bearer ${token}` }, 
        }
      );

      if (res.status === 200) {
        dispatch({
          type: productConstants.UPDATE_PRODUCT_SUCCESS,
          payload: res.data.product,
        });

        alert("Product Updated Succesfully");
        navigate("/");
      }
    } catch (error) {
      console.log("error in updating products action", error);
      dispatch({
        type: productConstants.UPDATE_PRODUCT_FAILURE,
        payload: { error: error.response?.data?.message || "Update Failed" },
      });
    }
  };
};