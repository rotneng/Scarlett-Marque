import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  CircularProgress,
  IconButton,
  Chip,
  Breadcrumbs,
  Link,
  Rating,
  Stack,
  Snackbar,
  Alert,
  Divider,
  Container,
} from "@mui/material";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCartOutlined";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import EditIcon from "@mui/icons-material/EditOutlined";
import HomeIcon from "@mui/icons-material/HomeOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUserOutlined";
import LocalShippingIcon from "@mui/icons-material/LocalShippingOutlined";

import { getProducts } from "../../Actions/product.actions";
import { addItemToCart } from "../../Actions/cartActions";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const productState = useSelector((state) => state.product);
  const products = productState?.products || [];
  const loading = productState?.loading || false;

  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const isAdmin = user && user.role === "admin";

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (products.length > 0) {
      const foundProduct = products.find((p) => p._id === id);
      setProduct(foundProduct);
    } else {
      dispatch(getProducts());
    }
  }, [id, products, dispatch]);

  const handleIncreaseQty = () => {
    if (product && qty < product.stock) {
      setQty((prev) => prev + 1);
    }
  };

  const handleDecreaseQty = () => {
    if (qty > 1) {
      setQty((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    if (qty > product.stock) {
      setToast({
        open: true,
        message: "Cannot add more items than available in stock",
        severity: "error",
      });
      return;
    }

    dispatch(addItemToCart(product, qty));
    setToast({
      open: true,
      message: `Added ${qty} ${product.title} to cart`,
      severity: "success",
    });
  };

  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <CircularProgress sx={{ color: "#0f2a1d" }} />
      </Box>
    );
  }

  if (!product) {
    return (
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <Typography variant="h5" color="text.secondary">
          Product not found
        </Typography>
        <Button onClick={() => navigate("/")} sx={{ mt: 2 }} variant="outlined">
          Return Home
        </Button>
      </Box>
    );
  }

  const stockColor =
    product.stock > 10 ? "success" : product.stock > 0 ? "warning" : "error";
  const stockLabel =
    product.stock > 10
      ? "In Stock"
      : product.stock > 0
      ? `Low Stock: ${product.stock} left`
      : "Out of Stock";

  return (
    <Box sx={{ bgcolor: "#fff", minHeight: "100vh", pb: 8 }}>
      <Container maxWidth="lg" sx={{ pt: 4 }}>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ mb: 4 }}
        >
          <Link
            component={RouterLink}
            to="/"
            color="inherit"
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              "&:hover": { color: "#0f2a1d" },
            }}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Home
          </Link>
          <Link
            component={RouterLink}
            to="/"
            color="inherit"
            sx={{ textDecoration: "none", "&:hover": { color: "#0f2a1d" } }}
          >
            Shop
          </Link>
          <Typography color="text.primary" fontWeight="500">
            {product.title}
          </Typography>
        </Breadcrumbs>

        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                bgcolor: "#f8f9fa",
                borderRadius: "24px",
                height: { xs: "350px", md: "550px" },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                border: "1px solid #eee",
              }}
            >
              <Box
                component="img"
                src={product.image || "https://via.placeholder.com/500"}
                alt={product.title}
                sx={{
                  maxWidth: "90%",
                  maxHeight: "90%",
                  objectFit: "contain",
                  transition: "transform 0.3s ease",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
              >
                <Chip
                  label={stockLabel}
                  color={stockColor}
                  size="small"
                  variant="filled"
                  sx={{ fontWeight: "bold", borderRadius: "8px" }}
                />
                {product.stock > 0 && (
                  <Chip
                    label="Ready to Ship"
                    size="small"
                    variant="outlined"
                    sx={{ borderRadius: "8px" }}
                  />
                )}
              </Box>

              <Typography
                variant="h3"
                fontWeight="800"
                sx={{
                  mb: 1,
                  color: "#1a1a1a",
                  fontSize: { xs: "2rem", md: "2.5rem" },
                }}
              >
                {product.title}
              </Typography>

              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ mb: 3 }}
              >
                <Rating value={4.5} precision={0.5} readOnly size="small" />
                <Typography variant="caption" color="text.secondary">
                  (45 verified reviews)
                </Typography>
              </Stack>

              <Typography
                variant="h4"
                color="#0f2a1d"
                fontWeight="bold"
                sx={{ mb: 3 }}
              >
                ₦{product.price.toLocaleString()}
              </Typography>

              <Divider sx={{ mb: 3 }} />
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 4, lineHeight: 1.8 }}
              >
                {product.description}
              </Typography>
              {!isAdmin ? (
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 3,
                      mb: 4,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        border: "2px solid #e0e0e0",
                        borderRadius: "50px",
                        p: "4px",
                        width: "fit-content",
                      }}
                    >
                      <IconButton
                        onClick={handleDecreaseQty}
                        disabled={qty <= 1}
                        size="small"
                        sx={{ bgcolor: "#f5f5f5" }}
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <Typography
                        sx={{
                          mx: 2.5,
                          fontWeight: "bold",
                          minWidth: "20px",
                          textAlign: "center",
                        }}
                      >
                        {qty}
                      </Typography>
                      <IconButton
                        onClick={handleIncreaseQty}
                        disabled={qty >= product.stock}
                        size="small"
                        sx={{
                          bgcolor: "#0f2a1d",
                          color: "white",
                          "&:hover": { bgcolor: "#144430" },
                        }}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<ShoppingCartIcon />}
                      onClick={handleAddToCart}
                      disabled={product.stock === 0}
                      sx={{
                        flexGrow: 1,
                        bgcolor: "#0f2a1d",
                        py: 1.5,
                        borderRadius: "50px",
                        textTransform: "none",
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                        boxShadow: "0 8px 16px rgba(15, 42, 29, 0.2)",
                        "&:hover": {
                          bgcolor: "#144430",
                          boxShadow: "0 10px 20px rgba(15, 42, 29, 0.3)",
                        },
                        "&.Mui-disabled": { bgcolor: "#e0e0e0", color: "#999" },
                      }}
                    >
                      {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                    </Button>
                  </Box>

                  <Stack direction="row" spacing={3} sx={{ mt: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "text.secondary",
                      }}
                    >
                      <VerifiedUserIcon sx={{ mr: 1, fontSize: 20 }} />
                      <Typography variant="caption">
                        Secure Transaction
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "text.secondary",
                      }}
                    >
                      <LocalShippingIcon sx={{ mr: 1, fontSize: 20 }} />
                      <Typography variant="caption">Fast Delivery</Typography>
                    </Box>
                  </Stack>
                </Box>
              ) : (
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<EditIcon />}
                  onClick={() => navigate(`/product/edit/${product._id}`)}
                  fullWidth
                  sx={{
                    py: 1.5,
                    borderRadius: "50px",
                    borderColor: "#1976d2",
                    color: "#1976d2",
                    borderWidth: 2,
                    "&:hover": { borderWidth: 2, bgcolor: "#f0f7ff" },
                  }}
                >
                  Edit Product (Admin)
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toast.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductDetails;
