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
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  removeFromCart,
  increaseQty,
  decreaseQty,
} from "../../Reducers/cartSlice";

const CartPage = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.qty * item.price,
    0
  );

  if (cartItems.length === 0) {
    return (
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <Typography variant="h5">Your Cart is Empty</Typography>
        <Button onClick={() => navigate("/")} sx={{ mt: 2 }}>
          Start Shopping
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: "1200px", margin: "0 auto" }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/")}
        sx={{ mb: 3 }}
      >
        Back to Store
      </Button>

      <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
        Shopping Cart
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {cartItems.map((item) => (
            <Card
              key={item._id}
              sx={{ display: "flex", mb: 2, p: 2, alignItems: "center" }}
            >
              <CardMedia
                component="img"
                sx={{ width: 100, height: 100, objectFit: "contain" }}
                image={item.image || "https://via.placeholder.com/100"}
                alt={item.title}
              />
              <Box sx={{ flexGrow: 1, ml: 2 }}>
                <Typography variant="h6">{item.title}</Typography>
                <Typography color="green" fontWeight="bold">
                  ${item.price}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mr: 3 }}>
                <IconButton
                  onClick={() => dispatch(decreaseQty(item._id))}
                  disabled={item.qty === 1}
                >
                  <RemoveIcon />
                </IconButton>
                <Typography sx={{ mx: 2 }}>{item.qty}</Typography>
                <IconButton onClick={() => dispatch(increaseQty(item._id))}>
                  <AddIcon />
                </IconButton>
              </Box>

              <IconButton
                color="error"
                onClick={() => dispatch(removeFromCart(item._id))}
              >
                <DeleteIcon />
              </IconButton>
            </Card>
          ))}
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6">
              Total: ${totalPrice.toFixed(2)}
            </Typography>
            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2, bgcolor: "#0f2a1d" }}
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
