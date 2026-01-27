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
  Container,
  Stack,
  Paper,
  Chip,
  IconButton,
} from "@mui/material";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { getAddresses } from "../../Actions/address.actions";
import { getProducts } from "../../Actions/product.actions";

const steps = ["Cart", "Shipping Address", "Payment"];

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { cartItems } = useSelector((state) => state.cart);
  const addressState = useSelector((state) => state.addressList || {});
  const { addresses, loading: loadingAddress } = addressState;
  const { products } = useSelector((state) => state.product);

  const token = localStorage.getItem("token");
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    if (token) {
      dispatch(getAddresses());
      if (!products || products.length === 0) {
        dispatch(getProducts());
      }
    }
  }, [dispatch, token, products]);

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
      navigate("/place-order", {
        state: {
          shippingAddress: selectedAddress,
          cartItems: cartItems,
          totalPrice: total,
          itemsPrice: subTotal,
        },
      });
    }
  };

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
      const baseUrl = "http://localhost:3000";
      let cleanPath = url.replace(/\\/g, "/");
      if (cleanPath.startsWith("/")) cleanPath = cleanPath.substring(1);
      if (cleanPath.startsWith("public/")) cleanPath = cleanPath.substring(7);

      return `${baseUrl}/public/${cleanPath}`;
    }

    return "https://via.placeholder.com/150";
  };

  return (
    <Box sx={{ bgcolor: "#f4f6f8", minHeight: "100vh", pb: 8 }}>
      <Container maxWidth="lg">
        <Box sx={{ py: 4, mb: 1, display: "flex", alignItems: "center", gap: 2 }}>
           <IconButton
              onClick={() => navigate("/cart")}
              sx={{ bgcolor: "white", boxShadow: 1 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" fontWeight="800" color="#0f2a1d">
              Checkout
            </Typography>
        </Box>

        <Grid container spacing={4} sx={{justifyContent:"center"}}> 
          <Grid item xs={12} md={8}>
            <Card
              elevation={0}
              sx={{
                borderRadius: "16px",
                border: "1px solid #e0e0e0",
                minHeight: "400px",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflow: "visible",
              }}
            >
              <Box
                sx={{
                  p: 3,
                  borderBottom: "1px solid #f0f0f0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  bgcolor: "#fff",
                  borderTopLeftRadius: "16px",
                  borderTopRightRadius: "16px",
                }}
              >
                <Typography variant="h6" fontWeight="800" color="#0f2a1d">
                  Shipping Details
                </Typography>
                <Button
                  startIcon={selectedAddress ? <EditIcon /> : null}
                  onClick={() => navigate("/manageAddress")}
                  variant="outlined"
                  size="small"
                  sx={{
                    color: "#0f2a1d",
                    borderColor: "#0f2a1d",
                    borderRadius: "20px",
                    textTransform: "none",
                  }}
                >
                  {selectedAddress ? "Change Address" : "Add Address"}
                </Button>
              </Box>

              <CardContent sx={{ flexGrow: 1, p: 4 }}>
                {loadingAddress ? (
                  <Stack
                    justifyContent="center"
                    alignItems="center"
                    sx={{ height: "100%", minHeight: 200 }}
                  >
                    <CircularProgress sx={{ color: "#0f2a1d" }} />
                  </Stack>
                ) : !selectedAddress ? (
                  <Stack
                    alignItems="center"
                    justifyContent="center"
                    sx={{ height: "100%", py: 4, textAlign: "center" }}
                  >
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        bgcolor: "#f5f5f5",
                        mb: 2,
                      }}
                    >
                      <LocationOnIcon sx={{ fontSize: 40, color: "#bdbdbd" }} />
                    </Avatar>
                    <Typography
                      variant="h6"
                      gutterBottom
                      color="text.secondary"
                    >
                      No delivery address found
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.disabled"
                      sx={{ mb: 3, maxWidth: 300 }}
                    >
                      Please add a shipping address to verify delivery
                      availability and costs.
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => navigate("/manageAddress")}
                      sx={{
                        bgcolor: "#0f2a1d",
                        borderRadius: "30px",
                        px: 4,
                        "&:hover": { bgcolor: "#144430" },
                      }}
                    >
                      Add New Address
                    </Button>
                  </Stack>
                ) : (
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      border: "2px solid #0f2a1d",
                      borderRadius: "12px",
                      bgcolor: "#fcfdfc",
                      position: "relative",
                    }}
                  >
                    <Chip
                      icon={
                        <CheckCircleIcon sx={{ "&&": { color: "white" } }} />
                      }
                      label="Deliver Here"
                      sx={{
                        position: "absolute",
                        top: -16,
                        left: 24,
                        bgcolor: "#0f2a1d",
                        color: "white",
                        fontWeight: "bold",
                        height: 32,
                      }}
                    />

                    <Stack spacing={2} mt={1}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <PersonOutlineIcon color="action" />
                        <Typography variant="h6" fontWeight="bold">
                          {selectedAddress.fullName}
                        </Typography>
                      </Stack>

                      <Stack direction="row" spacing={1} alignItems="center">
                        <PhoneIphoneIcon color="action" />
                        <Typography variant="body1">
                          {selectedAddress.phone}
                        </Typography>
                      </Stack>

                      <Divider sx={{ borderStyle: "dashed" }} />

                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="flex-start"
                      >
                        <LocationOnIcon color="action" sx={{ mt: 0.5 }} />
                        <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                          {selectedAddress.address}
                          <br />
                          {selectedAddress.city}, {selectedAddress.state}
                          <br />
                          {selectedAddress.pinCode}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Paper>
                )}
              </CardContent>

              <Box sx={{ p: 3, display: { xs: "none", md: "flex" }, gap: 2 }}>
                <Button
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate("/cart")}
                  sx={{ color: "text.secondary" }}
                >
                  Back to Cart
                </Button>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              elevation={0}
              sx={{
                borderRadius: "16px",
                border: "1px solid #e0e0e0",
                position: "sticky",
                top: 20,
              }}
            >
              <Box
                sx={{
                  p: 3,
                  bgcolor: "#fafafa",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <Typography variant="h6" fontWeight="800">
                  Order Summary
                </Typography>
              </Box>

              <Box sx={{ p: 3, maxHeight: "40vh", overflowY: "auto" }}>
                {cartItems &&
                  cartItems.map((item) => {
                    const productId =
                      item.product?._id || item.product || item._id;
                    const realProduct = products
                      ? products.find((p) => p._id === productId)
                      : null;
                    const imageSrc =
                      getProductImage(item) !==
                      "https://via.placeholder.com/150"
                        ? getProductImage(item)
                        : getProductImage(realProduct);

                    return (
                      <Stack
                        key={item._id}
                        direction="row"
                        spacing={2}
                        sx={{ mb: 2 }}
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
                            width: 56,
                            height: 56,
                            bgcolor: "#fff",
                            border: "1px solid #eee",
                          }}
                        />
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography
                            variant="body2"
                            fontWeight="600"
                            sx={{
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {item.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Qty: {item.qty} × ₦{item.price.toLocaleString()}
                          </Typography>
                        </Box>
                        <Typography variant="body2" fontWeight="bold">
                          ₦{(item.price * item.qty).toLocaleString()}
                        </Typography>
                      </Stack>
                    );
                  })}
              </Box>

              <Divider />

              <Box sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" mb={1}>
                  <Typography color="text.secondary">Subtotal</Typography>
                  <Typography fontWeight="500">
                    ₦{subTotal.toLocaleString()}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" mb={2}>
                  <Typography color="text.secondary">Shipping</Typography>
                  <Typography color="#2e7d32" fontWeight="500">
                    Free
                  </Typography>
                </Stack>

                <Divider sx={{ borderStyle: "dashed", mb: 2 }} />

                <Stack direction="row" justifyContent="space-between" mb={3}>
                  <Typography variant="h6" fontWeight="bold">
                    Total
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="#0f2a1d">
                    ₦{total.toLocaleString()}
                  </Typography>
                </Stack>

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={!selectedAddress || loadingAddress}
                  onClick={handleProceedToPayment}
                  endIcon={<LocalShippingIcon />}
                  sx={{
                    bgcolor: "#0f2a1d",
                    borderRadius: "30px",
                    py: 1.5,
                    fontSize: "1rem",
                    textTransform: "none",
                    "&:hover": { bgcolor: "#144430" },
                    "&.Mui-disabled": { bgcolor: "#e0e0e0" },
                  }}
                >
                  Proceed to Payment
                </Button>
                <Button
                  fullWidth
                  onClick={() => navigate("/cart")}
                  sx={{
                    mt: 2,
                    display: { xs: "block", md: "none" },
                    color: "text.secondary",
                  }}
                >
                  Back to Cart
                </Button>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CheckoutPage;
