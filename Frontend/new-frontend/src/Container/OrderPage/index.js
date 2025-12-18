import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Card,
  Divider,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";

import { getOrderDetails } from "../../Actions/order.actions";

const OrderPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;

  useEffect(() => {
    dispatch(getOrderDetails(id));
  }, [dispatch, id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!order) {
    return <Typography sx={{ p: 4 }}>Order not found</Typography>;
  }

  const getDeliveryStatus = () => {
    if (order.isDelivered) {
      return { text: `Delivered at ${order.deliveredAt}`, severity: "success" };
    } else if (order.isPaid || order.paymentMethod === "COD") {
      return { text: "Delivering (Processing)", severity: "info" };
    } else {
      return { text: "Not Delivered", severity: "warning" };
    }
  };

  const deliveryStatus = getDeliveryStatus();

  return (
    <Box
      sx={{
        padding: { xs: 2, md: "40px" },
        backgroundColor: "#f4f4f4",
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{ mb: 2, color: "#0f2a1d" }}
      >
        Order Details
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 4, wordBreak: "break-all" }}>
        ID: {order._id}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight="bold">
              Shipping Status
            </Typography>
            <Typography>
              <strong>Name:</strong>{" "}
              {order.user ? order.user.firstName : "User"}
            </Typography>
            <Typography>
              <strong>Address:</strong> {order.shippingAddress?.address},{" "}
              {order.shippingAddress?.city}
            </Typography>
            <Typography>
              <strong>Phone:</strong> {order.shippingAddress?.phoneNumber}
            </Typography>

            <Alert severity={deliveryStatus.severity} sx={{ mt: 2 }}>
              {deliveryStatus.text}
            </Alert>
          </Card>
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight="bold">
              Payment Status
            </Typography>
            <Typography>
              <strong>Method:</strong> {order.paymentMethod}
            </Typography>

            <Alert
              severity={order.isPaid ? "success" : "warning"}
              sx={{ mt: 2 }}
            >
              {order.isPaid
                ? `Paid on ${new Date(order.paidAt).toLocaleDateString()}`
                : "Not Paid"}
            </Alert>
          </Card>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Items Ordered
            </Typography>
            {order.orderItems.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                  borderBottom: "1px solid #eee",
                  pb: 1,
                }}
              >
                <Typography>{item.title}</Typography>
                <Typography>
                  {item.qty} x ₦{item.price.toLocaleString()} ={" "}
                  <strong>₦{(item.qty * item.price).toLocaleString()}</strong>
                </Typography>
              </Box>
            ))}
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Summary
            </Typography>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography>Subtotal</Typography>
              <Typography>₦{order.itemsPrice?.toLocaleString()}</Typography>
            </Box>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography>Shipping</Typography>
              <Typography>Free</Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
            >
              <Typography fontWeight="bold">Total</Typography>
              <Typography fontWeight="bold" variant="h6">
                ₦{order.totalPrice?.toLocaleString()}
              </Typography>
            </Box>

            <Alert severity="success" variant="filled" sx={{ mb: 2 }}>
              {order.isPaid
                ? "Payment Successful!"
                : "Order Placed Successfully"}
            </Alert>

            <Button
              variant="outlined"
              fullWidth
              onClick={() => navigate(`/track-order/${order._id}`)}
              sx={{
                mt: 2,
                borderRadius: "30px",
                padding: "12px",
                borderColor: "#0f2a1d",
                color: "#0f2a1d",
                fontWeight: "bold",
                "&:hover": { borderColor: "#2c9f45", color: "#2c9f45" },
              }}
            >
              Track Order Status
            </Button>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrderPage;
