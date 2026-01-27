import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  CircularProgress,
  Divider,
  Container,
  Stack,
  Avatar,
  Tooltip,
} from "@mui/material";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import LoginIcon from "@mui/icons-material/Login";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";

import {
  getCartItems,
  addItemToCart,
  removeCartItem,
} from "../../Actions/cartActions";
import { getProducts } from "../../Actions/product.actions";
import Header from "../header";

const API_BASE_URL = "http://localhost:5000";
const PLACEHOLDER_IMG = "https://placehold.co/300x300?text=No+Image";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { cartItems, updatingCart } = useSelector((state) => state.cart);
  const { products } = useSelector((state) => state.product);

  const token = localStorage.getItem("token");
  const { orderSuccess, orderId } = location.state || {};

  useEffect(() => {
    dispatch(getCartItems());
    if (!products || products.length === 0) {
      dispatch(getProducts());
    }
  }, [dispatch, products]);

  const getProductImage = (item) => {
    if (!item) return PLACEHOLDER_IMG;
    const isFullUrl = (path) =>
      path && (path.startsWith("http") || path.startsWith("data:"));
    const extractPath = (obj) => {
      if (!obj) return null;
      if (typeof obj === "string") return obj;
      if (obj.img) return obj.img;
      if (obj.image) return obj.image;
      if (obj.url) return obj.url;
      if (obj.filename) return obj.filename;
      return null;
    };

    let rawPath = null;
    const targets = [item, item.product || {}];

    for (const target of targets) {
      if (rawPath) break;
      if (target.productPictures && target.productPictures.length > 0) {
        rawPath = extractPath(target.productPictures[0]);
      }
      if (!rawPath && target.images && target.images.length > 0) {
        rawPath = extractPath(target.images[0]);
      }

      if (!rawPath) rawPath = extractPath(target.image);
      if (!rawPath) rawPath = extractPath(target.img);
    }
    if (!rawPath) return PLACEHOLDER_IMG;
    if (isFullUrl(rawPath)) return rawPath;
    const cleanBase = API_BASE_URL.replace(/\/$/, "");
    const cleanPath = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;

    return `${cleanBase}${cleanPath}`;
  };

  const getStock = (p) => {
    if (!p) return null;
    if (p.quantity !== undefined) return p.quantity;
    if (p.stock !== undefined) return p.stock;
    if (p.countInStock !== undefined) return p.countInStock;
    return null;
  };

  const onQuantityIncrement = (item) => {
    const productId = item.product?._id || item.product || item._id;
    const realProduct = products.find((p) => p._id === productId);

    const productStock = getStock(realProduct);
    const itemStock = getStock(item);

    const availableStock =
      productStock !== null
        ? productStock
        : itemStock !== null
          ? itemStock
          : 1000;

    if (item.qty >= availableStock) {
      return;
    }
    dispatch(addItemToCart(item, 1));
  };

  const onQuantityDecrement = (item) => {
    if (item && item.qty > 1) dispatch(addItemToCart(item, -1));
  };

  const onRemoveCartItem = (id) => {
    if (window.confirm("Are you sure you want to remove this item?")) {
      dispatch(removeCartItem(id));
    }
  };

  const handleCheckout = () => {
    if (token) {
      navigate("/checkout");
    } else {
      navigate("/signin", { state: { from: "/cart" } });
    }
  };

  const totalPrice =
    cartItems && Array.isArray(cartItems)
      ? cartItems.reduce((acc, item) => acc + item.qty * item.price, 0)
      : 0;

  if (orderSuccess) {
    return (
      <Box sx={{ bgcolor: "#f4f6f8", minHeight: "100vh" }}>
        <Header />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "80vh",
          }}
        >
          <Card
            sx={{
              maxWidth: 600,
              width: "100%",
              textAlign: "center",
              p: 5,
              borderRadius: 4,
              boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
            }}
          >
            <CheckCircleOutlineIcon
              sx={{ fontSize: 100, color: "#2e7d32", mb: 2 }}
            />
            <Typography
              variant="h4"
              fontWeight="800"
              gutterBottom
              color="#0f2a1d"
            >
              Order Confirmed!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Thank you for your purchase. We have received your order.
              <br />
              Order ID: <strong>{orderId}</strong>
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="center"
            >
              <Button
                variant="contained"
                startIcon={<LocalShippingIcon />}
                onClick={() => navigate(`/track-order/${orderId}`)}
                sx={{
                  bgcolor: "#0f2a1d",
                  borderRadius: "30px",
                  px: 4,
                  py: 1.5,
                  "&:hover": { bgcolor: "#144430" },
                }}
              >
                Track Order
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate("/", { state: {} })}
                sx={{
                  borderColor: "#0f2a1d",
                  color: "#0f2a1d",
                  borderRadius: "30px",
                  px: 4,
                  py: 1.5,
                }}
              >
                Continue Shopping
              </Button>
            </Stack>
          </Card>
        </Box>
      </Box>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <Box sx={{ bgcolor: "#f9fafb", minHeight: "100vh" }}>
        <Header />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "calc(100vh - 80px)",
          }}
        >
          <Avatar sx={{ width: 120, height: 120, bgcolor: "#e0e0e0", mb: 3 }}>
            <ShoppingBagOutlinedIcon sx={{ fontSize: 60, color: "#9e9e9e" }} />
          </Avatar>
          <Typography
            variant="h5"
            fontWeight="bold"
            gutterBottom
            color="#424242"
          >
            Your cart is currently empty
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={4}>
            Looks like you haven't added anything to your cart yet.
          </Typography>
          <Button
            onClick={() => navigate("/")}
            variant="contained"
            size="large"
            sx={{
              bgcolor: "#0f2a1d",
              borderRadius: "30px",
              px: 6,
              "&:hover": { bgcolor: "#144430" },
            }}
          >
            Start Shopping
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "#f4f6f8", minHeight: "100vh" }}>
      <Header />
      <Box sx={{ py: 4 }}>
        <Container maxWidth="lg">
          <Stack direction="row" alignItems="center" spacing={2} mb={4}>
            <IconButton
              onClick={() => navigate("/")}
              sx={{ bgcolor: "white", boxShadow: 1 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" fontWeight="800" color="#0f2a1d">
              Shopping Cart
            </Typography>
            {updatingCart && (
              <CircularProgress size={24} sx={{ color: "#0f2a1d" }} />
            )}
          </Stack>

          <Grid
            container
            spacing={4}
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Grid item xs={12} md={8}>
              {cartItems.map((item) => {
                const productId = item.product?._id || item.product || item._id;
                const realProduct = products.find((p) => p._id === productId);

                const productStock = getStock(realProduct);
                const itemStock = getStock(item);
                const stockLimit =
                  productStock !== null
                    ? productStock
                    : itemStock !== null
                      ? itemStock
                      : 1000;
                const isMaxedOut = item.qty >= stockLimit;

                const displayImage = getProductImage(realProduct || item);

                return (
                  <Card
                    key={item._id || productId}
                    elevation={0}
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      mb: 2,
                      p: 2,
                      borderRadius: "16px",
                      border: "1px solid #e0e0e0",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
                      },
                    }}
                  >
                    <Box
                      onClick={() => navigate(`/product/${productId}`)}
                      sx={{
                        width: { xs: "100%", sm: 140 },
                        height: 140,
                        flexShrink: 0,
                        borderRadius: "12px",
                        overflow: "hidden",
                        bgcolor: "#fff",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid #f0f0f0",
                      }}
                    >
                      <img
                        src={displayImage}
                        alt={item.title || item.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                        onError={(e) => {
                          e.target.src = PLACEHOLDER_IMG;
                        }}
                      />
                    </Box>
                    <CardContent
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        py: { xs: 2, sm: 1 },
                      }}
                    >
                      <Box>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="flex-start"
                        >
                          <Box>
                            <Typography
                              variant="h6"
                              fontWeight="bold"
                              onClick={() => navigate(`/product/${productId}`)}
                              sx={{
                                cursor: "pointer",
                                "&:hover": {
                                  color: "#0f2a1d",
                                  textDecoration: "underline",
                                },
                              }}
                            >
                              {item.title || item.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                textTransform: "uppercase",
                                fontSize: "0.75rem",
                                letterSpacing: 0.5,
                                mt: 0.5,
                              }}
                            >
                              {item.category}
                            </Typography>
                          </Box>
                          <Tooltip title="Remove Item">
                            <IconButton
                              onClick={() =>
                                onRemoveCartItem(item._id || productId)
                              }
                              color="error"
                              size="small"
                            >
                              <DeleteOutlineIcon />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </Box>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        alignItems={{ xs: "flex-start", sm: "center" }}
                        spacing={2}
                        mt={2}
                      >
                        <Typography
                          variant="h6"
                          color="#0f2a1d"
                          fontWeight="bold"
                        >
                          ₦{item.price ? item.price.toLocaleString() : 0}
                        </Typography>
                        <Box>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                            sx={{
                              bgcolor: "#f5f5f5",
                              borderRadius: "50px",
                              px: 1,
                              py: 0.5,
                            }}
                          >
                            <IconButton
                              size="small"
                              onClick={() => onQuantityDecrement(item)}
                              disabled={item.qty <= 1 || updatingCart}
                            >
                              <RemoveIcon fontSize="small" />
                            </IconButton>
                            <Typography
                              fontWeight="bold"
                              sx={{ minWidth: "20px", textAlign: "center" }}
                            >
                              {item.qty}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => onQuantityIncrement(item)}
                              disabled={updatingCart || isMaxedOut}
                              sx={{
                                bgcolor: isMaxedOut ? "transparent" : "white",
                                boxShadow: isMaxedOut ? "none" : 1,
                                "&:hover": { bgcolor: "white" },
                              }}
                            >
                              <AddIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                          {isMaxedOut && (
                            <Typography
                              variant="caption"
                              color="error"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mt: 0.5,
                                fontSize: "0.7rem",
                              }}
                            >
                              <ProductionQuantityLimitsIcon
                                fontSize="inherit"
                                sx={{ mr: 0.5 }}
                              />{" "}
                              Max Stock
                            </Typography>
                          )}
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                );
              })}
            </Grid>

            <Grid item xs={12} md={4}>
              <Card
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: "16px",
                  border: "1px solid #e0e0e0",
                  position: "sticky",
                  top: 20,
                }}
              >
                <Typography variant="h6" fontWeight="800" gutterBottom>
                  Order Summary
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Stack direction="row" justifyContent="space-between" mb={1}>
                  <Typography color="text.secondary">Subtotal</Typography>
                  <Typography fontWeight="500">
                    ₦{totalPrice.toLocaleString()}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" mb={3}>
                  <Typography color="text.secondary">Shipping</Typography>
                  <Typography variant="caption" color="text.disabled">
                    Calculated at checkout
                  </Typography>
                </Stack>
                <Divider sx={{ mb: 2, borderStyle: "dashed" }} />
                <Stack direction="row" justifyContent="space-between" mb={4}>
                  <Typography variant="h6" fontWeight="bold">
                    Total
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="#0f2a1d">
                    ₦{totalPrice.toLocaleString()}
                  </Typography>
                </Stack>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  startIcon={!token ? <LoginIcon /> : null}
                  onClick={handleCheckout}
                  sx={{
                    bgcolor: "#0f2a1d",
                    borderRadius: "30px",
                    py: 1.5,
                    fontWeight: "bold",
                    fontSize: "1rem",
                    textTransform: "none",
                    boxShadow: "0 8px 16px rgba(15, 42, 29, 0.2)",
                    "&:hover": {
                      bgcolor: "#144430",
                      boxShadow: "0 10px 20px rgba(15, 42, 29, 0.3)",
                    },
                  }}
                >
                  {token ? "Proceed to Checkout" : "Login to Checkout"}
                </Button>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default CartPage;
