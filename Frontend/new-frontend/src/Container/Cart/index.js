import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardMedia, 
  IconButton, 
  Divider 
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { removeFromCart, increaseQty, decreaseQty } from "../../Actions/cart.actions";

const CartPage = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Calculate Total Price
  const totalPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

  // --- Handlers ---
  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleIncrease = (id) => {
    dispatch(increaseQty(id));
  };

  const handleDecrease = (id) => {
    dispatch(decreaseQty(id));
  };

  // --- Empty Cart State ---
  if (!cartItems || cartItems.length === 0) {
    return (
      <Box sx={{ textAlign: "center", mt: 10, p: 2 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">Your Cart is Empty</Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
            Looks like you haven't added anything yet.
        </Typography>
        <Button 
            variant="contained" 
            onClick={() => navigate("/")}
            sx={{ bgcolor: "#0f2a1d", "&:hover": { bgcolor: "#1a4d33" }, py: 1.5, px: 4 }}
        >
          Start Shopping
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: "1200px", margin: "0 auto", minHeight: "100vh" }}>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate("/")} 
        sx={{ mb: 3, color: "#0f2a1d", fontWeight: "bold" }}
      >
        Continue Shopping
      </Button>

      <Typography variant="h4" fontWeight="bold" sx={{ mb: 3, color: "#0f2a1d" }}>
        Shopping Cart ({cartItems.length} items)
      </Typography>

      <Grid container spacing={4}>
        {/* --- LEFT SIDE: CART ITEMS --- */}
        <Grid item xs={12} md={8}>
          {cartItems.map((item) => (
            <Card key={item._id} sx={{ display: "flex", mb: 2, p: 2, alignItems: "center" }} elevation={2}>
              {/* Image */}
              <CardMedia
                component="img"
                sx={{ width: 100, height: 100, borderRadius: 2, objectFit: "contain", bgcolor: "#f9f9f9" }}
                image={item.image || "https://via.placeholder.com/100"}
                alt={item.title}
              />

              {/* Details */}
              <Box sx={{ flexGrow: 1, ml: 2 }}>
                <Typography variant="h6" fontWeight="bold">{item.title}</Typography>
                <Typography variant="body2" color="text.secondary">{item.category}</Typography>
                <Typography variant="h6" color="#0f2a1d" sx={{ mt: 1 }}>
                  ${item.price}
                </Typography>
              </Box>

              {/* Quantity Controls */}
              <Box 
                sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    mr: 3, 
                    border: '1px solid #ddd', 
                    borderRadius: '50px',
                    padding: '2px'
                }}
              >
                <IconButton 
                    onClick={() => handleDecrease(item._id)} 
                    disabled={item.qty === 1}
                    size="small"
                >
                  <RemoveIcon fontSize="small" />
                </IconButton>
                
                <Typography sx={{ mx: 2, fontWeight: "bold", minWidth: '20px', textAlign: 'center' }}>
                    {item.qty}
                </Typography>
                
                <IconButton 
                    onClick={() => handleIncrease(item._id)}
                    size="small"
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </Box>

              {/* Delete Button */}
              <IconButton color="error" onClick={() => handleRemove(item._id)}>
                <DeleteIcon />
              </IconButton>
            </Card>
          ))}
        </Grid>

        {/* --- RIGHT SIDE: SUMMARY --- */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, bgcolor: "#fff", position: 'sticky', top: '100px' }} elevation={3}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Order Summary
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Typography color="text.secondary">Subtotal</Typography>
              <Typography fontWeight="bold">${totalPrice.toFixed(2)}</Typography>
            </Box>
            
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
              <Typography color="text.secondary">Shipping</Typography>
              <Typography color="green" fontWeight="bold">Free</Typography>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
              <Typography variant="h6">Total</Typography>
              <Typography variant="h5" fontWeight="bold" color="#0f2a1d">
                ${totalPrice.toFixed(2)}
              </Typography>
            </Box>

            <Button 
              fullWidth 
              variant="contained" 
              size="large"
              sx={{ 
                bgcolor: "#0f2a1d", 
                py: 1.5,
                borderRadius: '30px',
                "&:hover": { bgcolor: "#1a4d33" } 
              }}
              onClick={() => alert("Proceeding to Checkout...")}
            >
              Checkout Now
            </Button>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CartPage;