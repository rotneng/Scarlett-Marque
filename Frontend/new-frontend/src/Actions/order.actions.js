import axios from "axios";
import { clearCart } from "../Reducers/cartSlice"; 

export const placeOrder = (orderData, navigate) => {
  return async (dispatch) => {
    try {

      const res = await axios.post(
        "http://172.20.10.4:3000/order/addOrder", 
        orderData,
        {
           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }
      );

      if (res.status === 201 || res.status === 200) {
        alert("Order Placed Successfully!");
        
        dispatch(clearCart()); 
        localStorage.removeItem("cart");

        navigate("/");
      }
    } catch (error) {
      console.log("Order Error:", error);
      alert("Failed to place order. Please try again.");
    }
  };
};