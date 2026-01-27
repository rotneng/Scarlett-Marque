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
  Container,
  Paper,
  Stack,
  Avatar,
  IconButton,
  alpha,
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
import { getProducts } from "../../Actions/product.actions";

const PlaceOrderPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const stateData = location.state || {};
  const finalAddress = stateData.shippingAddress || stateData.selectedAddress;

  const [paymentMethod, setPaymentMethod] = useState(
    stateData.paymentMethod || "Card"
  );

  const cart = useSelector((state) => state.cart);
  const { products } = useSelector((state) => state.product);

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
    if (!products || products.length === 0) {
      dispatch(getProducts());
    }
  }, [dispatch, products]);

  useEffect(() => {
    if (success && order) {
      if (finalCartItems && finalCartItems.length > 0) {
        finalCartItems.forEach((item) => {
          const id = item._id || item.product;
          if (id) dispatch(removeCartItem(id));
        });
      }

      dispatch({ type: orderConstants.ORDER_CREATE_RESET });
      dispatch(getProducts());

      navigate("/cart", {
        state: {
          orderSuccess: true,
          orderId: order._id,
        },
      });
    }
  }, [success, order, navigate, dispatch, finalCartItems]);

  const getProductImage = (item) => {
    if (!item) return "https://via.placeholder.com/150";

    const extractUrl = (data) => {
      if (!data) return null;
      if (typeof data === "string") return data;
      if (typeof data === "object") {
        return data.img || data.url || data.image || data.filename || data.path;
      }
      return null;
    };

    let url = extractUrl(item.image) || extractUrl(item.img);

    if (
      !url &&
      item.images &&
      Array.isArray(item.images) &&
      item.images.length > 0
    ) {
      url = extractUrl(item.images[0]);
    }

    if (!url && item.product && typeof item.product === "object") {
      const p = item.product;
      url = extractUrl(p.image) || extractUrl(p.img);
      if (!url && p.images && p.images.length > 0)
        url = extractUrl(p.images[0]);
      if (!url && p.productPictures && p.productPictures.length > 0)
        url = extractUrl(p.productPictures[0]);
    }

    if (url) {
      if (url.startsWith("http") || url.startsWith("data:")) return url;
      const baseUrl = "http://localhost:5000";
      let cleanPath = url.replace(/\\/g, "/");
      if (cleanPath.startsWith("/")) cleanPath = cleanPath.substring(1);
      if (cleanPath.startsWith("public/")) cleanPath = cleanPath.substring(7);
      return `${baseUrl}/public/${cleanPath}`;
    }

    return "https://via.placeholder.com/150";
  };

  const submitOrderToBackend = (paymentResult = null, isPaid = false) => {
    if (!finalAddress) return alert("Shipping address is missing");

    const safeTotal = Number(totalPrice);

    const mappedOrderItems = finalCartItems.map((item) => {
      const productId = item.product?._id || item.product || item._id;
      const realProduct = products
        ? products.find((p) => p._id === productId)
        : null;
      let finalImage = getProductImage(item);

      if (finalImage === "https://via.placeholder.com/150") {
        finalImage = getProductImage(realProduct);
      }

      return {
        product: productId,
        title: item.name || item.title || "Item",
        image: finalImage,
        price: Number(item.price),
        qty: Number(item.qty || item.quantity || 1),
      };
    });

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

    const paystackKey = process.env.REACT_APP_PAYSTACK_KEY;

    if (!paystackKey) {
      alert("Payment setup incomplete. Please contact support.");
      return;
    }

    const handler = window.PaystackPop.setup({
      key: paystackKey,
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
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}
        >
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
    <Box
      sx={{
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        py: { xs: 2, md: 4 },
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, md: 3 }, }}>
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
          sx={{
            mb: { xs: 2, md: 4 },
            color: "#0f2a1d",
            fontSize: { xs: "1.75rem", md: "2.125rem" },
          }}
        >
          Review & Place Order
        </Typography>

        <Grid container spacing={{ xs: 2, md: 4 }} sx={{justifyContent: "center"}}>
          <Grid item xs={12} md={8}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, md: 3 },
                mb: 3,
                borderRadius: 3,
                border: "1px solid #e0e0e0",
              }}
            >
              <SectionHeader
                icon={<LocationOnIcon sx={{ color: "#0f2a1d" }} />}
                title="Shipping Details"
                onEdit={() => navigate("/checkout")}
              />
              <Box sx={{ ml: { xs: 0, md: 4 }, pl: { xs: 4, md: 0 } }}>
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
              sx={{
                p: { xs: 2, md: 3 },
                mb: 3,
                borderRadius: 3,
                border: "1px solid #e0e0e0",
              }}
            >
              <SectionHeader
                icon={<ShoppingBagIcon sx={{ color: "#0f2a1d" }} />}
                title="Order Items"
              />
              <Stack spacing={2}>
                {finalCartItems.map((item, index) => {
                  const productId =
                    item.product?._id || item.product || item._id;
                  const realProduct = products
                    ? products.find((p) => p._id === productId)
                    : null;
                  const imageSrc =
                    getProductImage(item) !== "https://via.placeholder.com/150"
                      ? getProductImage(item)
                      : getProductImage(realProduct);

                  return (
                    <React.Fragment key={index}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 2,
                        }}
                      >
                        <Avatar
                          variant="rounded"
                          src={imageSrc}
                          imgProps={{
                            onError: (e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://via.placeholder.com/150?text=Error";
                            },
                          }}
                          sx={{
                            width: { xs: 50, md: 64 },
                            height: { xs: 50, md: 64 },
                            bgcolor: "#f0f0f0",
                          }}
                        >
                          {item.name ? item.name.charAt(0) : "I"}
                        </Avatar>

                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="subtitle2"
                            fontWeight="600"
                            sx={{
                              lineHeight: 1.2,
                              fontSize: { xs: "0.9rem", md: "1rem" },
                            }}
                          >
                            {item.name || item.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Qty: {item.qty}
                          </Typography>
                        </Box>

                        <Typography
                          fontWeight="bold"
                          sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}
                        >
                          ₦{(item.price * item.qty).toLocaleString()}
                        </Typography>
                      </Box>
                      {index < finalCartItems.length - 1 && <Divider />}
                    </React.Fragment>
                  );
                })}
              </Stack>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, md: 3 },
                borderRadius: 3,
                border: "1px solid #e0e0e0",
              }}
            >
              <SectionHeader
                icon={<CreditCardIcon sx={{ color: "#0f2a1d" }} />}
                title="Payment Method"
              />
              <RadioGroup
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
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
                          border: `2px solid ${
                            isSelected ? "#0f2a1d" : "#eee"
                          }`,
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
                          sx={{
                            mr: 1.5,
                            color: isSelected ? "#0f2a1d" : "#999",
                          }}
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
                </Stack>
              </RadioGroup>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              elevation={3}
              sx={{
                p: { xs: 2, md: 3 },
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
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  color="#0f2a1d"
                  sx={{ fontSize: { xs: "1.3rem", md: "1.5rem" } }}
                >
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
                  fontSize: { xs: "1rem", md: "1.1rem" },
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
