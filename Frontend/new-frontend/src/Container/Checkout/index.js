import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
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

import { getAddresses } from "../../Actions/address.actions";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { cartItems } = useSelector((state) => state.cart);
  const addressState = useSelector((state) => state.addressList || {});
  const { addresses, loading: loadingAddress } = addressState;

  const token = localStorage.getItem("token");

  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    if (token) {
      dispatch(getAddresses());
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (location.state?.selectedAddress) {
      setSelectedAddress(location.state.selectedAddress);
    } else if (addresses && addresses.length > 0) {
      setSelectedAddress(addresses[0]);
    } else {
      setSelectedAddress(null);
    }
  }, [addresses, location.state]);

  const subTotal = cartItems
    ? cartItems.reduce((acc, item) => acc + item.qty * item.price, 0)
    : 0;
  const total = subTotal;

  const handleProceedToPayment = () => {
    if (selectedAddress) {
      navigate("/payment", {
        state: {
          shippingAddress: selectedAddress,
          cartItems: cartItems,
          totalPrice: total,
          itemsPrice: subTotal,
        },
      });
    }
  };

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

                <Button
                  startIcon={<EditIcon />}
                  onClick={() => navigate("/manageAddress")}
                  sx={{
                    color: "#0f2a1d",
                    textTransform: "none",
                    fontWeight: "bold",
                  }}
                >
                  {selectedAddress ? "Change Address" : "Add Address"}
                </Button>
              </Box>

              <CardContent
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: selectedAddress ? "flex-start" : "center",
                  justifyContent: selectedAddress ? "flex-start" : "center",
                  textAlign: selectedAddress ? "left" : "center",
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
                ) : !selectedAddress ? (
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
                      You haven't added any delivery address yet.
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
                      onClick={() => navigate("/manageAddress")}
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
                              {selectedAddress.fullName}
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
                              {selectedAddress.phone}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>

                      <Typography
                        variant="body1"
                        sx={{ mt: 2, lineHeight: 1.6 }}
                      >
                        {selectedAddress.address}, <br />
                        {selectedAddress.city}, {selectedAddress.state}
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
                  borderRadius: "4px",
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
            disabled={!selectedAddress || loadingAddress}
            onClick={handleProceedToPayment}
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
              "&.Mui-disabled": { bgcolor: "#ccc", color: "#666" },
            }}
          >
            Proceed →
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CheckoutPage;
