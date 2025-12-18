import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { usePaystackPayment } from "react-paystack";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CircularProgress,
  Alert,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

import { createOrder } from "../../Actions/order.actions";
import { orderConstants } from "../../Actions/constant";
import { removeCartItem } from "../../Actions/cartActions"; 

const PlaceOrderPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const stateData = location.state || {};
  const finalAddress = stateData.shippingAddress || stateData.selectedAddress;

  const [paymentMethod, setPaymentMethod] = useState(stateData.paymentMethod || "Card");
  const cart = useSelector((state) => state.cart);
  const finalCartItems = (stateData.cartItems && stateData.cartItems.length > 0) 
    ? stateData.cartItems 
    : cart.cartItems;
  const calculateTotal = (items) => items.reduce((acc, item) => acc + item.price * item.qty, 0);
  const totalPrice = stateData.totalPrice || calculateTotal(finalCartItems);
  const user = useSelector((state) => state.auth.user);
  const orderCreate = useSelector((state) => state.orderCreate);
  const { loading, success, order, error } = orderCreate;

  useEffect(() => {
    if (success && order) {
      console.log("✅ Order Successful! Redirecting to Cart...");
      
      if (finalCartItems && finalCartItems.length > 0) {
        finalCartItems.forEach((item) => {
          const id = item._id || item.product; 
          if(id) dispatch(removeCartItem(id));
        });
      }
      dispatch({ type: orderConstants.ORDER_CREATE_RESET });
      
      navigate("/cart", { 
        state: { 
          orderSuccess: true, 
          orderId: order._id 
        } 
      });
    }
  }, [success, order, navigate, dispatch, finalCartItems]);

  const submitOrderToBackend = (paymentResult = null, isPaid = false) => {
    if (!finalAddress) return alert("Shipping address is missing");
    
    const safeTotal = Number(totalPrice);

    const mappedOrderItems = finalCartItems.map((item) => ({
      product: item.product?._id || item.product || item._id,
      title: item.name || item.title || "Item",
      image: item.img || item.image || "",
      price: Number(item.price), 
      qty: Number(item.qty || item.quantity || 1), 
    }));

    const orderPayload = {
      orderItems: mappedOrderItems,
      shippingAddress: finalAddress,
      paymentMethod: paymentMethod === "Card" ? "Paystack" : "COD",
      itemsPrice: safeTotal,
      taxPrice: 0,
      shippingPrice: 0,
      totalPrice: safeTotal,
      isPaid: isPaid,
      paidAt: isPaid ? new Date().toISOString() : null,
      paymentResult: paymentResult, 
    };

    dispatch(createOrder(orderPayload));
  };

  const paystackConfig = {
    reference: new Date().getTime().toString(),
    email: user?.email || "customer@example.com",
    amount: Math.round(Number(totalPrice) * 100), 
    publicKey: "pk_test_034ffa09d1ccc93fd7c2428df2803c28e83b5f5e", 
    metadata: {
      name: finalAddress?.fullName,
      phone: finalAddress?.phoneNumber,
    },
  };

  const initializePayment = usePaystackPayment(paystackConfig);

  const onPaystackSuccess = (reference) => {
    const result = {
      id: reference.reference,
      status: "success",
      update_time: String(Date.now()),
      email_address: user?.email,
    };
    submitOrderToBackend(result, true);
  };

  const onPaystackClose = () => { console.log("Payment closed"); };

  const handleConfirmOrder = () => {
    if (paymentMethod === "Card") {
      initializePayment(onPaystackSuccess, onPaystackClose);
    } else {
      submitOrderToBackend(null, false);
    }
  };

  if (!finalAddress) {
    return (
      <Box sx={{ p: 5, textAlign: "center" }}>
        <Typography variant="h6">Order Data Missing</Typography>
        <Button onClick={() => navigate("/cart")} sx={{ mt: 2 }} variant="contained">Return to Cart</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: { xs: 2, md: "40px" }, backgroundColor: "#f4f4f4", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4, color: "#0f2a1d" }}>Confirm Order</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight="bold">Shipping Information</Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle1" fontWeight="bold">{finalAddress.fullName}</Typography>
            <Typography>{finalAddress.address}, {finalAddress.city}</Typography>
            <Typography>{finalAddress.phoneNumber}</Typography>
          </Card>

          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight="bold">Payment Method</Typography>
            <Divider sx={{ mb: 2 }} />
            <FormControl component="fieldset">
              <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <FormControlLabel
                  value="Card"
                  control={<Radio sx={{ color: "#0f2a1d", '&.Mui-checked': { color: "#0f2a1d" } }} />}
                  label={<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}><CreditCardIcon /> <Typography>Pay with Card (Paystack)</Typography></Box>}
                  sx={{ mb: 1 }}
                />
                <FormControlLabel
                  value="COD"
                  control={<Radio sx={{ color: "#0f2a1d", '&.Mui-checked': { color: "#0f2a1d" } }} />}
                  label={<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}><LocalShippingIcon /> <Typography>Pay on Delivery</Typography></Box>}
                />
              </RadioGroup>
            </FormControl>
          </Card>

          <Card sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold">Items</Typography>
            <Divider sx={{ mb: 2 }} />
            {finalCartItems.map((item, index) => (
              <Box key={index} sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography>{item.name || item.title} (x{item.qty})</Typography>
                <Typography fontWeight="bold">₦{(item.price * item.qty).toLocaleString()}</Typography>
              </Box>
            ))}
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Summary</Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography color="text.secondary">Subtotal</Typography>
              <Typography>₦{Number(totalPrice).toLocaleString()}</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Typography color="text.secondary">Delivery</Typography>
              <Typography color="green">Free</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Typography variant="h6" fontWeight="bold">Total Amount</Typography>
              <Typography variant="h6" fontWeight="bold" color="#0f2a1d">₦{Number(totalPrice).toLocaleString()}</Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{typeof error === 'object' ? "Check Console" : error}</Alert>}

            <Button
              fullWidth
              variant="contained"
              disabled={loading}
              onClick={handleConfirmOrder}
              sx={{ bgcolor: "#0f2a1d", py: 1.5, borderRadius: "30px", fontWeight: "bold", "&:hover": { bgcolor: "#144430" } }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : paymentMethod === "Card" ? "Pay Now" : "Place Order"}
            </Button>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PlaceOrderPage;