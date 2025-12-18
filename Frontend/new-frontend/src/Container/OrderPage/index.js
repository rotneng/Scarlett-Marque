import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { usePaystackPayment } from "react-paystack";
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

import { getOrderDetails, payOrder } from "../../Actions/order.actions";

const OrderPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;

  const auth = useSelector((state) => state.auth);
  const user = auth.user;

  useEffect(() => {
    dispatch(getOrderDetails(id));
  }, [dispatch, id]);
  const rawAmount = order ? order.totalPrice : 0;
  const paystackAmount = Math.round(rawAmount * 100);
  const paystackEmail = user?.email || "error@example.com";
  const paystackPublicKey = "pk_live_5c17380713f611c0d5ea7af4e04a5165033fef8d";
  const config = {
    reference: new Date().getTime().toString(),
    email: paystackEmail,
    amount: paystackAmount,
    publicKey: paystackPublicKey,
    metadata: {
      name: user ? user.firstName : "",
      phone: order?.shippingAddress?.phoneNumber,
    },
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccess = (reference) => {
    console.log("Payment Complete! Reference:", reference);
    const paymentResult = {
      id: reference.reference,
      status: reference.status,
      update_time: String(new Date().getTime()),
      email_address: paystackEmail,
    };
    dispatch(payOrder(id, paymentResult));
  };

  const onClose = () => {
    console.log("Payment closed");
  };

  const handlePayClick = () => {
    console.log("Attempting Payment with config:", config);

    if (!paystackPublicKey || paystackPublicKey.includes("YOUR_KEY")) {
      alert("Error: Paystack Public Key is missing in code.");
      return;
    }
    if (paystackAmount <= 0) {
      alert("Error: Invalid Amount.");
      return;
    }

    try {
      initializePayment(onSuccess, onClose);
    } catch (e) {
      console.error("Paystack Error:", e);
      alert("Payment initialization failed. Check console for details.");
    }
  };

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

  return (
    <Box
      sx={{ padding: "40px", backgroundColor: "#f4f4f4", minHeight: "100vh" }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{ mb: 2, color: "#0f2a1d" }}
      >
        Order Details
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 4 }}>
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
              <strong>Address:</strong> {order.shippingAddress.address},{" "}
              {order.shippingAddress.city}
            </Typography>
            <Typography>
              <strong>Phone:</strong> {order.shippingAddress.phoneNumber}
            </Typography>
            <Alert
              severity={order.isDelivered ? "success" : "warning"}
              sx={{ mt: 2 }}
            >
              {order.isDelivered
                ? `Delivered at ${order.deliveredAt}`
                : "Not Delivered"}
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
              {order.isPaid ? `Paid on ${order.paidAt}` : "Not Paid"}
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
              <Typography>₦{order.itemsPrice.toLocaleString()}</Typography>
            </Box>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography>Shipping</Typography>
              <Typography>₦{order.shippingPrice.toLocaleString()}</Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
            >
              <Typography fontWeight="bold">Total</Typography>
              <Typography fontWeight="bold" variant="h6">
                ₦{order.totalPrice.toLocaleString()}
              </Typography>
            </Box>

            {order.isPaid ? (
              <Alert severity="success" variant="filled">
                Payment Successful!
              </Alert>
            ) : (
              <>
                {order.paymentMethod === "COD" ||
                order.paymentMethod === "POD" ? (
                  <Box>
                    <Alert severity="success" sx={{ mb: 2 }}>
                      <strong>Order Placed Successfully!</strong>
                    </Alert>
                    <Typography variant="body2">
                      Please have your cash or transfer ready upon delivery.
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    <Alert severity="info" sx={{ mb: 2 }}>
                      Order saved. Complete payment below.
                    </Alert>

                    <Button
                      variant="contained"
                      fullWidth
                      disabled={!order || paystackAmount <= 0}
                      onClick={handlePayClick}
                      sx={{
                        bgcolor: "#2c9f45",
                        color: "white",
                        fontWeight: "bold",
                        borderRadius: "30px",
                        padding: "12px",
                        "&:hover": { bgcolor: "#25863a" },
                      }}
                    >
                      Pay Now ₦{order.totalPrice.toLocaleString()}
                    </Button>
                  </Box>
                )}
              </>
            )}

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
