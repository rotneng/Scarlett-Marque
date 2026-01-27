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
import BlockIcon from "@mui/icons-material/Block";
import { getProducts } from "../../Actions/product.actions";
import { addItemToCart } from "../../Actions/cartActions";
import Header from "../header";

const API_BASE_URL = "http://localhost:5000/public/";
const PLACEHOLDER_IMG = "https://placehold.co/600x600?text=No+Image";

const getValidImageUrl = (imagePath) => {
  if (!imagePath) return PLACEHOLDER_IMG;
  if (imagePath.startsWith("http") || imagePath.startsWith("data:")) {
    return imagePath;
  }
  const cleanPath = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;
  return `${API_BASE_URL}${cleanPath}`;
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const product = useSelector((state) =>
    state.product.products.find((p) => p._id === id)
  );
  const loading = useSelector((state) => state.product.loading);

  const [qty, setQty] = useState(1);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [selectedImage, setSelectedImage] = useState("");

  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const isAdmin = user && user.role === "admin";

  useEffect(() => {
    if (!product) {
      dispatch(getProducts());
    }
  }, [dispatch, id, product]);

  useEffect(() => {
    if (product) {
      if (product.images && product.images.length > 0) {
        setSelectedImage(
          getValidImageUrl(product.images[0].img || product.images[0])
        );
      } else if (product.image) {
        setSelectedImage(getValidImageUrl(product.image));
      } else {
        setSelectedImage(PLACEHOLDER_IMG);
      }
    }
  }, [product]);

  const getAllImages = () => {
    if (!product) return [];
    let rawImages = [];
    if (product.images && product.images.length > 0) {
      rawImages = product.images.map((img) => img.img || img);
    } else if (product.image) {
      rawImages = [product.image];
    }
    return rawImages.map((path) => getValidImageUrl(path));
  };

  const productImages = getAllImages();

  const stockCount = product
    ? Number(product.quantity || product.countInStock || product.stock || 0)
    : 0;

  const isOutOfStock = stockCount === 0;

  const stockLabel =
    stockCount > 10
      ? "In Stock"
      : stockCount > 0
      ? `Low Stock: Only ${stockCount} left`
      : "Out of Stock";

  const stockColor =
    stockCount > 10 ? "success" : stockCount > 0 ? "warning" : "error";

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  const handleIncreaseQty = () => {
    if (product && qty < stockCount) {
      setQty((prev) => prev + 1);
    } else {
      setToast({
        open: true,
        message: `Only ${stockCount} items available in stock`,
        severity: "warning",
      });
    }
  };

  const handleDecreaseQty = () => {
    if (qty > 1) {
      setQty((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    if (isOutOfStock) {
      setToast({
        open: true,
        message: "This item is currently out of stock",
        severity: "error",
      });
      return;
    }

    if (qty > stockCount) {
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

  if (loading || !product) {
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

  return (
    <Box sx={{ bgcolor: "#fff", minHeight: "100vh", pb: 8 }}>
      <Header />

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
          <Typography color="text.primary" fontWeight="500">
            {product.title}
          </Typography>
        </Breadcrumbs>

        <Grid container spacing={6} sx={{justifyContent: "center" }}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Paper
                elevation={0}
                sx={{
                  bgcolor: "#f8f9fa",
                  borderRadius: "24px",
                  height: { xs: "350px", md: "500px" },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  border: "1px solid #eee",
                  position: "relative",
                }}
              >
                {isOutOfStock && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      bgcolor: "rgba(255,255,255,0.6)",
                      zIndex: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Chip
                      label="SOLD OUT"
                      color="error"
                      sx={{
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        py: 3,
                        px: 2,
                      }}
                    />
                  </Box>
                )}
                <Box
                  component="img"
                  src={selectedImage}
                  alt={product.title}
                  onError={(e) => {
                    e.target.src = PLACEHOLDER_IMG;
                  }}
                  sx={{
                    maxWidth: "95%",
                    maxHeight: "95%",
                    objectFit: "contain",
                    transition: "transform 0.3s ease",
                    filter: isOutOfStock ? "grayscale(100%)" : "none",
                    "&:hover": { transform: "scale(1.05)" },
                  }}
                />
              </Paper>

              {productImages.length > 1 && (
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{
                    justifyContent: "center",
                    overflowX: "auto",
                    py: 1,
                    px: 1,
                  }}
                >
                  {productImages.map((img, index) => (
                    <Box
                      key={index}
                      onClick={() => setSelectedImage(img)}
                      sx={{
                        width: 70,
                        height: 70,
                        cursor: "pointer",
                        borderRadius: "12px",
                        border:
                          selectedImage === img
                            ? "2px solid #0f2a1d"
                            : "1px solid #eee",
                        overflow: "hidden",
                        opacity: selectedImage === img ? 1 : 0.6,
                        transition: "all 0.2s",
                        flexShrink: 0,
                        "&:hover": { opacity: 1, borderColor: "#0f2a1d" },
                      }}
                    >
                      <img
                        src={img}
                        alt={`thumb-${index}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                  ))}
                </Stack>
              )}
            </Box>
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

                {!isOutOfStock && !isAdmin && (
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
              {!isAdmin && (
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ mb: 3 }}
                >
                  <Rating value={4.5} precision={0.5} readOnly size="small" />
                  <Typography variant="caption" color="text.secondary">
                    (Verified Reviews)
                  </Typography>
                </Stack>
              )}

              <Typography
                variant="h4"
                color="#0f2a1d"
                fontWeight="bold"
                sx={{ mb: 3 }}
              >
                {formatCurrency(product.price)}
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
                        border: "1px solid #e0e0e0",
                        borderRadius: "50px",
                        p: "4px",
                        bgcolor: isOutOfStock ? "#f5f5f5" : "transparent",
                      }}
                    >
                      <IconButton
                        onClick={handleDecreaseQty}
                        disabled={qty <= 1 || isOutOfStock}
                        size="small"
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <Typography
                        sx={{
                          mx: 2,
                          fontWeight: "bold",
                          minWidth: "20px",
                          textAlign: "center",
                          color: isOutOfStock ? "#ccc" : "inherit",
                        }}
                      >
                        {qty}
                      </Typography>
                      <IconButton
                        onClick={handleIncreaseQty}
                        disabled={isOutOfStock || qty >= stockCount}
                        size="small"
                        sx={{
                          bgcolor: isOutOfStock ? "transparent" : "#0f2a1d",
                          color: isOutOfStock ? "#999" : "white",
                          "&:hover": { bgcolor: "#144430" },
                        }}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    <Button
                      variant="contained"
                      size="large"
                      startIcon={
                        isOutOfStock ? <BlockIcon /> : <ShoppingCartIcon />
                      }
                      onClick={handleAddToCart}
                      disabled={isOutOfStock}
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
                      }}
                    >
                      {isOutOfStock ? "Out of Stock" : "Add to Cart"}
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
