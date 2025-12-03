import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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

import {
  getCartItems,
  addItemToCart,
  removeCartItem,
} from "../../Actions/cartActions";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems, updatingCart } = useSelector((state) => state.cart);

  const token = localStorage.getItem("token");

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
      alert("You must be logged in to checkout!");
      navigate("/signin", { state: { from: "/cart" } });
    }
  };

  const totalPrice =
    cartItems && Array.isArray(cartItems)
      ? cartItems.reduce((acc, item) => acc + item.qty * item.price, 0)
      : 0;

  if (!cartItems || cartItems.length === 0) {
    return (
      <Box
        sx={{
          textAlign: "center",
          mt: 10,
          p: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <ShoppingBagIcon sx={{ fontSize: 80, color: "#ccc", mb: 2 }} />
        <Typography variant="h5" sx={{ mb: 1, fontWeight: "bold" }}>
          Your Cart is Empty
        </Typography>
        <Button
          onClick={() => navigate("/")}
          variant="contained"
          sx={{ bgcolor: "#0f2a1d", borderRadius: "30px", mt: 2 }}
        >
          Start Shopping
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: "1200px", margin: "0 auto", minHeight: "90vh" }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/")}
        variant="contained"
        sx={{ mt: 2, bgcolor: "#0f2a1d", mb: 3, borderRadius: "20px" }}
      >
        Back to Store
      </Button>

      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{ mb: 3, display: "flex", alignItems: "center" }}
      >
        Shopping Cart{" "}
        {updatingCart && (
          <CircularProgress size={24} sx={{ ml: 2, color: "#0f2a1d" }} />
        )}
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {cartItems.map((item) => (
            <Card
              key={item._id}
              elevation={3}
              sx={{
                display: "flex",
                mb: 2,
                p: 2,
                alignItems: "center",
                borderRadius: "12px",
              }}
            >
              <CardMedia
                component="img"
                sx={{
                  width: 100,
                  height: 100,
                  objectFit: "contain",
                  borderRadius: "8px",
                }}
                image={item.image || "https://via.placeholder.com/100"}
                alt={item.title}
              />
              <Box sx={{ flexGrow: 1, ml: 2 }}>
                <Typography variant="h6">{item.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.category}
                </Typography>
                <Typography color="green" fontWeight="bold" sx={{ mt: 0.5 }}>
                  ₦{item.price ? item.price.toLocaleString() : 0}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mr: 3 }}>
                <IconButton
                  onClick={() => onQuantityDecrement(item._id)}
                  disabled={item.qty <= 1 || updatingCart}
                >
                  <RemoveIcon fontSize="small" />
                </IconButton>
                <Typography sx={{ mx: 2, fontWeight: "bold" }}>
                  {item.qty}
                </Typography>
                <IconButton
                  onClick={() => onQuantityIncrement(item._id)}
                  disabled={updatingCart}
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
              {token ? "Checkout" : "Checkout"}
            </Button>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CartPage;
