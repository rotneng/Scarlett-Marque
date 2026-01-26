import React, { useEffect, useState } from "react";
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
  Container,
  Stack,
  Chip,
  Paper,
  IconButton,
  Tooltip,
  Avatar,
} from "@mui/material";

import LocalShippingIcon from "@mui/icons-material/LocalShippingOutlined";
import CreditCardIcon from "@mui/icons-material/CreditCardOutlined";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLongOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import MapIcon from "@mui/icons-material/MapOutlined";

import { getOrderDetails } from "../../Actions/order.actions";

const OrderPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    dispatch(getOrderDetails(id));
  }, [dispatch, id]);

  const handleCopyId = () => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress sx={{ color: "#0f2a1d" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 5 }}>
        <Alert severity="error" variant="filled" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
        <Button onClick={() => navigate("/")} sx={{ mt: 2 }}>
          Go Home
        </Button>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container maxWidth="md" sx={{ mt: 5, textAlign: "center" }}>
        <Typography variant="h5">Order not found</Typography>
        <Button onClick={() => navigate("/")} sx={{ mt: 2 }}>
          Continue Shopping
        </Button>
      </Container>
    );
  }

  const getDeliveryStatus = () => {
    if (order.isDelivered)
      return {
        label: "Delivered",
        color: "success",
        icon: <LocalShippingIcon />,
      };
    if (order.isPaid || order.paymentMethod === "COD")
      return {
        label: "Processing",
        color: "info",
        icon: <LocalShippingIcon />,
      };
    return { label: "Pending", color: "warning", icon: <LocalShippingIcon /> };
  };

  const deliveryStatus = getDeliveryStatus();

  return (
    <Box sx={{ backgroundColor: "#f8f9fa", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/account/orders")}
            sx={{
              color: "#666",
              textTransform: "none",
              mb: 2,
              "&:hover": { color: "#0f2a1d" },
            }}
          >
            Back to Orders
          </Button>

          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "center" }}
            spacing={2}
          >
            <Box>
              <Typography variant="h4" fontWeight="800" color="#0f2a1d">
                Order Details
              </Typography>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ mt: 0.5 }}
              >
                <Typography variant="body1" color="text.secondary">
                  Order ID:{" "}
                  <span style={{ fontFamily: "monospace", fontWeight: 600 }}>
                    #{order._id}
                  </span>
                </Typography>
                <Tooltip title={copied ? "Copied!" : "Copy ID"}>
                  <IconButton size="small" onClick={handleCopyId}>
                    <ContentCopyIcon
                      fontSize="inherit"
                      color={copied ? "success" : "action"}
                    />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Box>
            <Box>
              <Typography
                variant="caption"
                display="block"
                color="text.secondary"
                align={window.innerWidth > 900 ? "right" : "left"}
              >
                Placed on
              </Typography>
              <Typography variant="subtitle1" fontWeight="bold">
                {new Date(order.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper
              elevation={0}
              sx={{ p: 3, mb: 3, borderRadius: 3, border: "1px solid #e0e0e0" }}
            >
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ mb: 3 }}
              >
                <ReceiptLongIcon sx={{ color: "#0f2a1d" }} />
                <Typography variant="h6" fontWeight="bold">
                  Items Ordered
                </Typography>
              </Stack>

              <Stack spacing={3}>
                {order.orderItems.map((item, index) => (
                  <Box key={index}>
                    <Grid container alignItems="center" spacing={2}>
                      <Grid item>
                        <Avatar
                          variant="rounded"
                          src={item.image}
                          sx={{ width: 64, height: 64, bgcolor: "#f0f0f0" }}
                        >
                          {item.title.charAt(0)}
                        </Avatar>
                      </Grid>
                      <Grid item xs>
                        <Typography
                          variant="subtitle1"
                          fontWeight="600"
                          sx={{ lineHeight: 1.2, mb: 0.5 }}
                        >
                          {item.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Unit Price: ₦{item.price.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item sx={{ textAlign: "right" }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 0.5 }}
                        >
                          Qty: {item.qty}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          color="#0f2a1d"
                        >
                          ₦{(item.qty * item.price).toLocaleString()}
                        </Typography>
                      </Grid>
                    </Grid>
                    {index < order.orderItems.length - 1 && (
                      <Divider sx={{ mt: 3 }} />
                    )}
                  </Box>
                ))}
              </Stack>
            </Paper>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    height: "100%",
                    borderRadius: 3,
                    border: "1px solid #e0e0e0",
                  }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{ mb: 2 }}
                  >
                    <MapIcon sx={{ color: "#0f2a1d" }} />
                    <Typography variant="h6" fontWeight="bold">
                      Shipping
                    </Typography>
                  </Stack>

                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    gutterBottom
                  >
                    {order.user ? order.user.firstName : "Guest User"}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.6, mb: 2 }}
                  >
                    {order.shippingAddress?.address}
                    <br />
                    {order.shippingAddress?.city}
                    <br />
                    {order.shippingAddress?.phoneNumber}
                  </Typography>

                  <Chip
                    label={deliveryStatus.label}
                    color={deliveryStatus.color}
                    size="small"
                    variant="outlined"
                    icon={deliveryStatus.icon}
                  />
                  {order.isDelivered && (
                    <Typography
                      variant="caption"
                      display="block"
                      sx={{ mt: 1, color: "success.main" }}
                    >
                      Delivered at {order.deliveredAt}
                    </Typography>
                  )}
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    height: "100%",
                    borderRadius: 3,
                    border: "1px solid #e0e0e0",
                  }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{ mb: 2 }}
                  >
                    <CreditCardIcon sx={{ color: "#0f2a1d" }} />
                    <Typography variant="h6" fontWeight="bold">
                      Payment
                    </Typography>
                  </Stack>

                  <Typography variant="body2" gutterBottom>
                    Method: <strong>{order.paymentMethod}</strong>
                  </Typography>

                  <Box sx={{ mt: 2 }}>
                    <Chip
                      label={
                        order.isPaid ? "Payment Successful" : "Payment Pending"
                      }
                      color={order.isPaid ? "success" : "warning"}
                      size="small"
                      variant={order.isPaid ? "filled" : "outlined"}
                    />
                  </Box>
                  {order.isPaid && (
                    <Typography
                      variant="caption"
                      display="block"
                      sx={{ mt: 1, color: "text.secondary" }}
                    >
                      Paid on {new Date(order.paidAt).toLocaleDateString()}
                    </Typography>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 3,
                position: { md: "sticky" },
                top: { md: 24 },
              }}
            >
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                Order Summary
              </Typography>

              <Stack spacing={2} sx={{ mb: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography color="text.secondary">Subtotal</Typography>
                  <Typography fontWeight="500">
                    ₦{order.itemsPrice?.toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography color="text.secondary">Shipping</Typography>
                  <Typography color="success.main" fontWeight="500">
                    Free
                  </Typography>
                </Box>
                <Divider />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h6" fontWeight="bold">
                    Total
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="#0f2a1d">
                    ₦{order.totalPrice?.toLocaleString()}
                  </Typography>
                </Box>
              </Stack>

              <Alert
                severity={order.isPaid ? "success" : "info"}
                sx={{ mb: 3, borderRadius: 2 }}
                iconMapping={{
                  success: <CheckCircleIcon fontSize="inherit" />,
                }}
              >
                {order.isPaid ? "Order is confirmed." : "Order placed."}
              </Alert>

              <Button
                variant="contained"
                fullWidth
                size="large"
                startIcon={<LocalShippingIcon />}
                onClick={() => navigate(`/track-order/${order._id}`)}
                sx={{
                  bgcolor: "#0f2a1d",
                  borderRadius: "50px",
                  py: 1.5,
                  textTransform: "none",
                  fontWeight: "bold",
                  "&:hover": { bgcolor: "#144430" },
                }}
              >
                Track Shipment
              </Button>

              <Button
                variant="text"
                fullWidth
                sx={{ mt: 1, color: "#666", textTransform: "none" }}
                onClick={() => window.print()}
              >
                Print Invoice
              </Button>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

const CheckCircleIcon = (props) => (
  <svg
    {...props}
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
  </svg>
);

export default OrderPage;
