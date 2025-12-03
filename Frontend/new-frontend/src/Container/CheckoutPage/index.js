import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Card,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { placeOrder } from "../../Actions/order.actions";

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems } = useSelector((state) => state.cart);

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentType, setPaymentType] = useState("cod");

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.qty * item.price,
    0
  );

  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      navigate("/");
    }
  }, [cartItems, navigate]);

  const handleConfirmOrder = () => {
    if (address === "" || city === "" || phoneNumber === "") {
      alert("Please fill in all shipping details");
      return;
    }

    const orderData = {
      items: cartItems,
      totalAmount: totalPrice,
      paymentType,
      address,
      city,
      phoneNumber,
    };

    dispatch(placeOrder(orderData, navigate));
  };

  return (
    <Box
      sx={{ p: 3, maxWidth: "1200px", margin: "0 auto", minHeight: "100vh" }}
    >
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/cart")}
        sx={{
          mb: 3,
          backgroundColor: "#0f2a1d",
          color: "white",
          padding: "15px",
          borderRadius: "30px",
        }}
      >
        Back to Cart
      </Button>

      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{ mb: 4, color: "#0f2a1d" }}
      >
        Checkout
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <Card sx={{ p: 3, mb: 3 }} elevation={3}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
              Shipping Details
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Full Address"
                  fullWidth
                  variant="outlined"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="City / State"
                  fullWidth
                  variant="outlined"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone Number"
                  fullWidth
                  variant="outlined"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </Grid>
            </Grid>
          </Card>

          <Card sx={{ p: 3 }} elevation={3}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Payment Method
            </Typography>
            <FormControl>
              <RadioGroup
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
              >
                <FormControlLabel
                  value="cod"
                  control={
                    <Radio
                      sx={{
                        color: "#0f2a1d",
                        "&.Mui-checked": { color: "#0f2a1d" },
                      }}
                    />
                  }
                  label="Cash on Delivery"
                />
                <FormControlLabel
                  value="card"
                  control={
                    <Radio
                      sx={{
                        color: "#0f2a1d",
                        "&.Mui-checked": { color: "#0f2a1d" },
                      }}
                    />
                  }
                  label="Credit/Debit Card (Coming Soon)"
                  disabled
                />
              </RadioGroup>
            </FormControl>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card sx={{ p: 3, position: "sticky", top: 20 }} elevation={4}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Order Summary
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Box sx={{ maxHeight: "300px", overflowY: "auto", mb: 2 }}>
              {cartItems.map((item) => (
                <Box
                  key={item._id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {item.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Qty: {item.qty}
                    </Typography>
                  </Box>
                  <Typography variant="body2" fontWeight="bold">
                    ₦{(item.price * item.qty).toLocaleString()}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
            >
              <Typography variant="h5" fontWeight="bold">
                Total
              </Typography>
              <Typography variant="h5" color="green" fontWeight="bold">
                ₦{totalPrice.toLocaleString()}
              </Typography>
            </Box>

            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleConfirmOrder}
              sx={{
                bgcolor: "#0f2a1d",
                borderRadius: "30px",
                py: 1.5,
                fontSize: "1.1rem",
                "&:hover": { bgcolor: "#144430" },
              }}
            >
              Confirm Order
            </Button>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CheckoutPage;
