import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";

import CreditCardIcon from "@mui/icons-material/CreditCard";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    shippingAddress,
    selectedAddress: oldAddressName,
    totalPrice,
    total: oldTotalName,
    itemsPrice,
    cartItems: stateCartItems,
  } = location.state || {};

  const address = shippingAddress || oldAddressName;
  const finalTotal = totalPrice || oldTotalName;

  const { cartItems: reduxCartItems } = useSelector((state) => state.cart);
  const finalCartItems = stateCartItems || reduxCartItems;

  const [paymentMethod, setPaymentMethod] = useState("Card");
  useEffect(() => {
    if (!address || !finalCartItems || finalCartItems.length === 0) {
      navigate("/cart");
    }
  }, [address, finalCartItems, navigate]);

  const handleContinue = () => {
    if (!address) {
      alert("Address is missing. Please go back and select an address.");
      return;
    }
    navigate("/place-order", {
      state: {
        shippingAddress: address,
        paymentMethod,
        totalPrice: finalTotal,
        itemsPrice: itemsPrice,
        cartItems: finalCartItems,
      },
    });
  };

  if (!address) return null;

  return (
    <Box
      sx={{
        padding: { xs: 2, md: "40px" },
        backgroundColor: "#f4f4f4",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <Box
        sx={{
          maxWidth: "1200px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/checkout")}
          sx={{
            mb: 3,
            backgroundColor: "#0f2a1d",
            color: "white",
            padding: "12px 24px",
            borderRadius: "40px",
            fontWeight: "bold",
            width: "fit-content",
            "&:hover": { backgroundColor: "#144430" },
          }}
        >
          Back to Address
        </Button>

        <Typography
          variant="h4"
          fontWeight="bold"
          color="#0f2a1d"
          sx={{ mb: 4 }}
        >
          Payment Method
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Card elevation={3} sx={{ borderRadius: "12px", mb: 3 }}>
              <Box sx={{ p: 3, borderBottom: "1px solid #eee" }}>
                <Typography variant="h6" fontWeight="bold">
                  Select Payment Option
                </Typography>
              </Box>
              <CardContent sx={{ p: 3 }}>
                <FormControl component="fieldset" fullWidth>
                  <RadioGroup
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <Box
                      onClick={() => setPaymentMethod("Card")}
                      sx={{
                        border:
                          paymentMethod === "Card"
                            ? "2px solid #0f2a1d"
                            : "1px solid #e0e0e0",
                        borderRadius: "8px",
                        mb: 2,
                        p: 2,
                        bgcolor: paymentMethod === "Card" ? "#f0fdf4" : "white",
                        cursor: "pointer",
                      }}
                    >
                      <FormControlLabel
                        value="Card"
                        control={
                          <Radio
                            sx={{
                              color: "#0f2a1d",
                              "&.Mui-checked": { color: "#0f2a1d" },
                            }}
                          />
                        }
                        label={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <CreditCardIcon sx={{ color: "#0f2a1d" }} />
                            <Typography fontWeight="bold">
                              Pay with Card (Paystack)
                            </Typography>
                          </Box>
                        }
                      />
                    </Box>
                    <Box
                      onClick={() => setPaymentMethod("Pay On Delivery")}
                      sx={{
                        border:
                          paymentMethod === "Pay On Delivery"
                            ? "2px solid #0f2a1d"
                            : "1px solid #e0e0e0",
                        borderRadius: "8px",
                        p: 2,
                        bgcolor:
                          paymentMethod === "Pay On Delivery"
                            ? "#f0fdf4"
                            : "white",
                        cursor: "pointer",
                      }}
                    >
                      <FormControlLabel
                        value="Pay On Delivery"
                        control={
                          <Radio
                            sx={{
                              color: "#0f2a1d",
                              "&.Mui-checked": { color: "#0f2a1d" },
                            }}
                          />
                        }
                        label={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <LocalShippingIcon sx={{ color: "#0f2a1d" }} />
                            <Typography fontWeight="bold">
                              Pay on Delivery
                            </Typography>
                          </Box>
                        }
                      />
                    </Box>
                  </RadioGroup>
                </FormControl>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              elevation={3}
              sx={{
                borderRadius: "12px",
                p: 3,
                position: "sticky",
                top: 20,
              }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ mb: 3, color: "#0f2a1d" }}
              >
                Order Preview
              </Typography>
              <Box
                sx={{
                  mb: 3,
                  p: 2,
                  bgcolor: "#f9f9f9",
                  borderRadius: "8px",
                }}
              >
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Delivering to:
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {address.fullName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {address.address}, {address.city}
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography color="text.secondary">
                  Items ({finalCartItems ? finalCartItems.length : 0}):
                </Typography>
                <Typography fontWeight="bold">
                  ₦{finalTotal?.toLocaleString()}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Typography color="text.secondary">Delivery Fee:</Typography>
                <Typography fontWeight="bold" color="success.main">
                  Free
                </Typography>
              </Box>
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
                  Total:
                </Typography>
                <Typography variant="h5" fontWeight="bold" color="#0f2a1d">
                  ₦{finalTotal?.toLocaleString()}
                </Typography>
              </Box>

              <Button
                fullWidth
                variant="contained"
                onClick={handleContinue}
                sx={{
                  bgcolor: "#0f2a1d",
                  py: 1.5,
                  borderRadius: "30px",
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  "&:hover": { bgcolor: "#144430" },
                }}
              >
                Continue to Confirm
              </Button>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default PaymentPage;
