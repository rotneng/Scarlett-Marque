import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  Avatar,
  CircularProgress,
} from "@mui/material";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";

const CheckoutPage = () => {
  const navigate = useNavigate();

  const { cartItems } = useSelector((state) => state.cart);
  const token = localStorage.getItem("token");

  const [hasAddress, setHasAddress] = useState(false);
  const [addressData, setAddressData] = useState(null);
  const [loadingAddress, setLoadingAddress] = useState(true);

  useEffect(() => {
    const fetchAddress = async () => {
      if (!token) {
        setLoadingAddress(false);
        return;
      }
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios.get(
          "http://localhost:3000/user/shipping",
          config
        );

        if (data && Object.keys(data).length > 0) {
          setAddressData(data);
          setHasAddress(true);
        }
      } catch (error) {
        console.error("Error fetching address:", error);
      } finally {
        setLoadingAddress(false);
      }
    };
    fetchAddress();
  }, [token]);

  const subTotal = cartItems
    ? cartItems.reduce((acc, item) => acc + item.qty * item.price, 0)
    : 0;
  const shippingCost = 1000;
  const total = subTotal + shippingCost;

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
          maxWidth: "1400px",
          display: "flex",
          justifyContent: "space-evenly",
          flexDirection: "column",
        }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Card
              elevation={3}
              sx={{
                borderRadius: "12px",
                height: "100%",
                minHeight: "500px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  p: 3,
                  borderBottom: "1px solid #eee",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6" fontWeight="bold" color="#0f2a1d">
                  Select Delivery Address
                </Typography>
                {hasAddress && !loadingAddress && (
                  <Button
                    startIcon={<EditIcon />}
                    onClick={() => navigate("/address")}
                    sx={{ color: "#0f2a1d", textTransform: "none" }}
                  >
                    Change
                  </Button>
                )}
              </Box>

              <CardContent
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: hasAddress ? "flex-start" : "center",
                  justifyContent: hasAddress ? "flex-start" : "center",
                  textAlign: hasAddress ? "left" : "center",
                  p: 4,
                }}
              >
                {loadingAddress ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      width: "100%",
                      py: 5,
                    }}
                  >
                    <CircularProgress sx={{ color: "#0f2a1d" }} />
                  </Box>
                ) : !hasAddress ? (
                  <>
                    <Box
                      sx={{
                        backgroundColor: "#eee",
                        borderRadius: "50%",
                        width: "120px",
                        height: "120px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "24px",
                      }}
                    >
                      <LocationOnIcon
                        sx={{ fontSize: "60px", color: "#999" }}
                      />
                    </Box>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                      No Address Found
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ maxWidth: "400px", mb: 4, lineHeight: 1.6 }}
                    >
                      You haven't added any delivery address yet. Add one to
                      continue with your order.
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "#0f2a1d",
                        padding: "12px 40px",
                        borderRadius: "30px",
                        textTransform: "none",
                        fontWeight: "bold",
                        fontSize: "1rem",
                        boxShadow: "0 4px 12px rgba(15, 42, 29, 0.2)",
                        "&:hover": { bgcolor: "#144430" },
                      }}
                      onClick={() => navigate("/address")}
                    >
                      + Add New Address
                    </Button>
                  </>
                ) : (
                  <Box sx={{ width: "100%" }}>
                    <Box
                      sx={{
                        p: 3,
                        border: "1px solid #e0e0e0",
                        borderRadius: "8px",
                        bgcolor: "#fafafa",
                        position: "relative",
                      }}
                    >
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{
                          mb: 2,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <LocationOnIcon color="primary" /> Delivery Address
                      </Typography>

                      <Divider sx={{ mb: 2 }} />

                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Box
                            sx={{
                              display: "flex",
                              gap: 1,
                              mb: 1,
                              color: "#555",
                            }}
                          >
                            <PersonIcon fontSize="small" />
                            <Typography variant="body1" fontWeight="500">
                              {addressData.fullName}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Box
                            sx={{
                              display: "flex",
                              gap: 1,
                              mb: 1,
                              color: "#555",
                            }}
                          >
                            <PhoneIcon fontSize="small" />
                            <Typography variant="body1">
                              {addressData.phone}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>

                      <Typography
                        variant="body1"
                        sx={{ mt: 2, lineHeight: 1.6 }}
                      >
                        {addressData.address}, <br />
                        {addressData.city}, {addressData.state}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card elevation={3} sx={{ borderRadius: "12px", p: 3 }}>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ mb: 3, color: "#0f2a1d" }}
              >
                Order Summary
              </Typography>

              <Box
                sx={{
                  maxHeight: "350px",
                  backgroundColor: "#ccc",
                  borderRadius: "4px",
                  overflowY: "auto",
                }}
              >
                {cartItems &&
                  cartItems.map((item) => (
                    <Box
                      key={item._id}
                      sx={{
                        display: "flex",
                        gap: 2,
                        mb: 2,
                        p: 1,
                        alignItems: "start",
                      }}
                    >
                      <Avatar
                        variant="rounded"
                        src={item.image}
                        alt={item.title}
                        sx={{ width: 60, height: 60, bgcolor: "#eee" }}
                      />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          sx={{
                            display: "-webkit-box",
                            overflow: "hidden",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 2,
                          }}
                        >
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
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography color="text.secondary">Subtotal:</Typography>
                <Typography fontWeight="bold">
                  ₦{subTotal.toLocaleString()}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Typography color="text.secondary">Shipping:</Typography>
                <Typography fontWeight="bold">
                  ₦{shippingCost.toLocaleString()}
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
                  ₦{total.toLocaleString()}
                </Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "30px",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/cart")}
            sx={{
              backgroundColor: "#0f2a1d",
              color: "white",
              padding: "12px 40px",
              borderRadius: "30px",
              textTransform: "none",
              fontWeight: "bold",
              fontSize: "1rem",
              boxShadow: "0 4px 12px rgba(15, 42, 29, 0.2)",
              "&:hover": { bgcolor: "#144430" },
            }}
          >
            Back to Cart
          </Button>

          <Button
            variant="contained"
            disabled={!hasAddress || loadingAddress}
            sx={{
              backgroundColor: "#0f2a1d",
              color: "white",
              padding: "12px 40px",
              borderRadius: "30px",
              textTransform: "none",
              fontWeight: "bold",
              fontSize: "1rem",
              boxShadow: "0 4px 12px rgba(15, 42, 29, 0.2)",
              "&:hover": { bgcolor: "#144430" },
              "&.Mui-disabled": {
                bgcolor: "#ccc",
                color: "#666",
              },
            }}
            onClick={() => navigate("/payment")}
          >
            Proceed to Payment →
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CheckoutPage;
