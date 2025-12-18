import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  IconButton,
  CircularProgress,
  Divider,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import LoginIcon from "@mui/icons-material/Login";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

import {
  getCartItems,
  addItemToCart,
  removeCartItem,
} from "../../Actions/cartActions";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { cartItems, updatingCart } = useSelector((state) => state.cart);
  const token = localStorage.getItem("token");
  const { orderSuccess, orderId } = location.state || {};

  useEffect(() => {
    dispatch(getCartItems());
  }, [dispatch]);

  const onQuantityIncrement = (id) => {
    const item = cartItems.find((x) => x._id === id);
    if (item) dispatch(addItemToCart(item, 1));
  };

  const onQuantityDecrement = (id) => {
    const item = cartItems.find((x) => x._id === id);
    if (item && item.qty > 1) dispatch(addItemToCart(item, -1));
  };

  const onRemoveCartItem = (id) => {
    if (window.confirm("Remove this item?")) {
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
      <Box
        sx={{
          textAlign: "center",
          mt: { xs: 5, md: 10 },
          p: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CheckCircleIcon sx={{ fontSize: 80, color: "#2e7d32", mb: 2 }} />

        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ mb: 1, color: "#0f2a1d" }}
        >
          Order Placed Successfully!
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Thank you for your purchase. Your order ID is{" "}
          <strong>{orderId}</strong>
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: { xs: "column", sm: "row" },
          }}
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
            Track My Order
          </Button>

          <Button
            variant="outlined"
            onClick={() => {
              navigate("/", { state: {} });
            }}
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
        </Box>
      </Box>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <Box
        sx={{
          textAlign: "center",
          mt: { xs: 5, md: 10 },
          p: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <ShoppingBagIcon
          sx={{ fontSize: { xs: 60, md: 80 }, color: "#ccc", mb: 2 }}
        />
        <Typography
          variant="h5"
          sx={{
            mb: 1,
            fontWeight: "bold",
            fontSize: { xs: "1.25rem", md: "1.5rem" },
          }}
        >
          Your Cart is Empty
        </Typography>
        <Button
          onClick={() => navigate("/")}
          variant="contained"
          sx={{ bgcolor: "#0f2a1d", borderRadius: "30px", mt: 2, px: 4 }}
        >
          Start Shopping
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        maxWidth: "1200px",
        margin: "0 auto",
        minHeight: "90vh",
      }}
    >
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/")}
        variant="contained"
        sx={{
          mt: 2,
          bgcolor: "#0f2a1d",
          mb: 3,
          borderRadius: "20px",
          width: { xs: "100%", sm: "auto" },
        }}
      >
        Back to Store
      </Button>

      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{
          mb: 3,
          display: "flex",
          alignItems: "center",
          fontSize: { xs: "1.5rem", md: "2.125rem" },
        }}
      >
        Shopping Cart{" "}
        {updatingCart && (
          <CircularProgress size={24} sx={{ ml: 2, color: "#0f2a1d" }} />
        )}
      </Typography>

      <Grid container spacing={{ xs: 2, md: 4 }}>
        <Grid item xs={12} md={8}>
          {cartItems.map((item) => (
            <Card
              key={item._id}
              elevation={3}
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                mb: 2,
                p: 2,
                alignItems: "center",
                borderRadius: "12px",
                textAlign: { xs: "center", sm: "left" },
              }}
            >
              <CardMedia
                component="img"
                sx={{
                  width: { xs: 120, sm: 100 },
                  height: { xs: 120, sm: 100 },
                  objectFit: "contain",
                  borderRadius: "8px",
                  mb: { xs: 2, sm: 0 },
                }}
                image={item.image || "https://via.placeholder.com/100"}
                alt={item.title}
              />

              <Box
                sx={{
                  flexGrow: 1,
                  ml: { xs: 0, sm: 2 },
                  mb: { xs: 2, sm: 0 },
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
                >
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.category}
                </Typography>
                <Typography color="green" fontWeight="bold" sx={{ mt: 0.5 }}>
                  ₦{item.price ? item.price.toLocaleString() : 0}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  width: { xs: "100%", sm: "auto" },
                  justifyContent: { xs: "center", sm: "flex-end" },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mr: 3 }}>
                  <IconButton
                    onClick={() => onQuantityDecrement(item._id)}
                    disabled={item.qty <= 1 || updatingCart}
                    sx={{ border: "1px solid #ddd", width: 30, height: 30 }}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography sx={{ mx: 2, fontWeight: "bold" }}>
                    {item.qty}
                  </Typography>
                  <IconButton
                    onClick={() => onQuantityIncrement(item._id)}
                    disabled={updatingCart}
                    sx={{
                      border: "1px solid #0f2a1d",
                      width: 30,
                      height: 30,
                      color: "white",
                      bgcolor: "#0f2a1d",
                      "&:hover": { bgcolor: "#144430" },
                    }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>

                <IconButton
                  color="error"
                  onClick={() => onRemoveCartItem(item._id)}
                  disabled={updatingCart}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Card>
          ))}
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            sx={{ p: 3, position: "sticky", top: 100, borderRadius: "16px" }}
            elevation={4}
          >
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Order Summary
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 2,
                mb: 3,
              }}
            >
              <Typography variant="h6">Total Price:</Typography>
              <Typography variant="h6" color="green" fontWeight="bold">
                ₦{totalPrice.toLocaleString()}
              </Typography>
            </Box>

            <Button
              variant="contained"
              fullWidth
              size="large"
              startIcon={!token ? <LoginIcon /> : null}
              sx={{
                bgcolor: "#0f2a1d",
                borderRadius: "20px",
                py: 1.5,
                "&:hover": { bgcolor: "#144430" },
              }}
              onClick={handleCheckout}
            >
              Checkout
            </Button>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CartPage;
