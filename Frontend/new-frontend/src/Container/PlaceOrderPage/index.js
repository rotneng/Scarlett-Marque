import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
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
  Container,
  Paper,
  Stack,
  Avatar,
  IconButton,
  alpha,
  useTheme,
} from "@mui/material";

import CreditCardIcon from "@mui/icons-material/CreditCard";
import LocalShippingIcon from "@mui/icons-material/LocalShippingOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocationOnIcon from "@mui/icons-material/LocationOnOutlined";
import EditIcon from "@mui/icons-material/EditOutlined";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBagOutlined";
import LockIcon from "@mui/icons-material/Lock";

import { createOrder } from "../../Actions/order.actions";
import { orderConstants } from "../../Actions/constant";
import { removeCartItem } from "../../Actions/cartActions";

const PlaceOrderPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const stateData = location.state || {};
  const finalAddress = stateData.shippingAddress || stateData.selectedAddress;

  const [paymentMethod, setPaymentMethod] = useState(
    stateData.paymentMethod || "Card"
  );

  const cart = useSelector((state) => state.cart);
  const finalCartItems =
    stateData.cartItems && stateData.cartItems.length > 0
      ? stateData.cartItems
      : cart.cartItems;

  const calculateTotal = (items) =>
    items.reduce((acc, item) => acc + item.price * item.qty, 0);
  const totalPrice = stateData.totalPrice || calculateTotal(finalCartItems);

  const user = useSelector((state) => state.auth.user);
  const orderCreate = useSelector((state) => state.orderCreate);
  const { loading, success, order, error } = orderCreate;

  useEffect(() => {
    if (success && order) {
      if (finalCartItems && finalCartItems.length > 0) {
        finalCartItems.forEach((item) => {
          const id = item._id || item.product;
          if (id) dispatch(removeCartItem(id));
        });
      }
      dispatch({ type: orderConstants.ORDER_CREATE_RESET });

      navigate("/cart", {
        state: {
          orderSuccess: true,
          orderId: order._id,
        },
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
    const cleanShippingAddress = {
      fullName: finalAddress.fullName || finalAddress.name || "Customer",
      address: finalAddress.address,
      city: finalAddress.city,
      postalCode: finalAddress.postalCode || "",
      country: finalAddress.country || "Nigeria",
      phoneNumber:
        finalAddress.phoneNumber || finalAddress.phone || "0000000000",
    };

    const orderPayload = {
      orderItems: mappedOrderItems,
      shippingAddress: cleanShippingAddress,
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

  const loadPaystackScript = () => {
    return new Promise((resolve) => {
      if (window.PaystackPop) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://js.paystack.co/v1/inline.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const payWithPaystack = async () => {
    const scriptLoaded = await loadPaystackScript();
    if (!scriptLoaded) return alert("Paystack SDK failed to load.");

    const handler = window.PaystackPop.setup({
      key: "pk_test_034ffa09d1ccc93fd7c2428df2803c28e83b5f5e",
      email: user?.email || "customer@example.com",
      amount: Math.round(Number(totalPrice) * 100),
      currency: "NGN",
      metadata: {
        custom_fields: [
          {
            display_name: "Customer Name",
            variable_name: "customer_name",
            value: finalAddress?.fullName,
          },
          {
            display_name: "Phone Number",
            variable_name: "phone_number",
            value: finalAddress?.phoneNumber,
          },
        ],
      },
      callback: (transaction) => {
        const paymentReceipt = {
          id: transaction.reference,
          status: transaction.status,
          update_time: new Date().toISOString(),
          email_address: user?.email,
          provider: "Paystack",
        };
        submitOrderToBackend(paymentReceipt, true);
      },
      onClose: () => alert("Payment process was cancelled."),
    });
    handler.openIframe();
  };

  const handleConfirmOrder = () => {
    if (paymentMethod === "Card") {
      payWithPaystack();
    } else {
      submitOrderToBackend(null, false);
    }
  };

  if (!finalAddress) {
    return (
      <Container maxWidth="sm" sx={{ mt: 10, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          Missing Order Data
        </Typography>
        <Button variant="contained" onClick={() => navigate("/cart")}>
          Return to Cart
        </Button>
      </Container>
    );
  }

  const SectionHeader = ({ icon, title, onEdit }) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        mb: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {icon}
        <Typography variant="h6" fontWeight="bold">
          {title}
        </Typography>
      </Box>
      {onEdit && (
        <IconButton size="small" onClick={onEdit}>
          <EditIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  );

  return (
    <Box sx={{ backgroundColor: "#f8f9fa", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2, color: "#666", "&:hover": { color: "#0f2a1d" } }}
        >
          Back
        </Button>
        <Typography
          variant="h4"
          fontWeight="800"
          sx={{ mb: 4, color: "#0f2a1d" }}
        >
          Review & Place Order
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper
              elevation={0}
              sx={{ p: 3, mb: 3, borderRadius: 3, border: "1px solid #e0e0e0" }}
            >
              <SectionHeader
                icon={<LocationOnIcon sx={{ color: "#0f2a1d" }} />}
                title="Shipping Details"
                onEdit={() => navigate("/checkout")}
              />
              <Box sx={{ ml: 4 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {finalAddress.fullName}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {finalAddress.address}, {finalAddress.city}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  {finalAddress.phoneNumber}
                </Typography>
              </Box>
            </Paper>
            <Paper
              elevation={0}
              sx={{ p: 3, mb: 3, borderRadius: 3, border: "1px solid #e0e0e0" }}
            >
              <SectionHeader
                icon={<ShoppingBagIcon sx={{ color: "#0f2a1d" }} />}
                title="Order Items"
              />
              <Stack spacing={2}>
                {finalCartItems.map((item, index) => (
                  <React.Fragment key={index}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        variant="rounded"
                        src={item.image || item.img}
                        sx={{ width: 56, height: 56, bgcolor: "#f0f0f0" }}
                      >
                        {item.name ? item.name.charAt(0) : "I"}
                      </Avatar>

                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="subtitle2"
                          fontWeight="600"
                          sx={{ lineHeight: 1.2 }}
                        >
                          {item.name || item.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Qty: {item.qty}
                        </Typography>
                      </Box>

                      <Typography fontWeight="bold">
                        ₦{(item.price * item.qty).toLocaleString()}
                      </Typography>
                    </Box>
                    {index < finalCartItems.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </Stack>
            </Paper>

            <Paper
              elevation={0}
              sx={{ p: 3, borderRadius: 3, border: "1px solid #e0e0e0" }}
            >
              <SectionHeader
                icon={<CreditCardIcon sx={{ color: "#0f2a1d" }} />}
                title="Payment Method"
              />
              <RadioGroup
                row
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                sx={{ gap: 2 }}
              >
                {["Card", "COD"].map((method) => {
                  const isSelected = paymentMethod === method;
                  const isCard = method === "Card";
                  return (
                    <Paper
                      key={method}
                      component="label"
                      elevation={0}
                      sx={{
                        flex: 1,
                        p: 2,
                        border: `2px solid ${isSelected ? "#0f2a1d" : "#eee"}`,
                        bgcolor: isSelected ? alpha("#0f2a1d", 0.04) : "#fff",
                        borderRadius: 2,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        transition: "all 0.2s",
                      }}
                    >
                      <Radio value={method} sx={{ display: "none" }} />
                      <Box
                        sx={{ mr: 1.5, color: isSelected ? "#0f2a1d" : "#999" }}
                      >
                        {isCard ? <CreditCardIcon /> : <LocalShippingIcon />}
                      </Box>
                      <Box>
                        <Typography
                          variant="subtitle2"
                          fontWeight="bold"
                          color={isSelected ? "#0f2a1d" : "text.primary"}
                        >
                          {isCard ? "Pay with Card" : "Pay on Delivery"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {isCard
                            ? "Secured by Paystack"
                            : "Cash/Transfer on arrival"}
                        </Typography>
                      </Box>
                    </Paper>
                  );
                })}
              </RadioGroup>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 3,
                position: { md: "sticky" },
                top: 24,
              }}
            >
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Order Summary
              </Typography>

              <Stack spacing={1.5} sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography color="text.secondary">Subtotal</Typography>
                  <Typography>
                    ₦{Number(totalPrice).toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography color="text.secondary">Delivery</Typography>
                  <Typography color="success.main" fontWeight="bold">
                    Free
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  Total
                </Typography>
                <Typography variant="h5" fontWeight="bold" color="#0f2a1d">
                  ₦{Number(totalPrice).toLocaleString()}
                </Typography>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                  {typeof error === "object" ? "An error occurred" : error}
                </Alert>
              )}

              <Button
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                onClick={handleConfirmOrder}
                sx={{
                  bgcolor: "#0f2a1d",
                  py: 1.5,
                  borderRadius: "50px",
                  fontWeight: "bold",
                  textTransform: "none",
                  fontSize: "1.1rem",
                  "&:hover": { bgcolor: "#144430" },
                  "&.Mui-disabled": { bgcolor: "#rgba(15, 42, 29, 0.5)" },
                }}
              >
                {loading ? (
                  <CircularProgress size={26} color="inherit" />
                ) : paymentMethod === "Card" ? (
                  "Pay Now"
                ) : (
                  "Confirm Order"
                )}
              </Button>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mt: 2,
                  opacity: 0.7,
                }}
              >
                <LockIcon sx={{ fontSize: 14, mr: 0.5 }} />
                <Typography variant="caption">Secure SSL Checkout</Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default PlaceOrderPage;
