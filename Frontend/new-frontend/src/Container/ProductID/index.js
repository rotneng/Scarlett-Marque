import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  CircularProgress,
  IconButton,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import EditIcon from "@mui/icons-material/Edit";

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

  useEffect(() => {
    if (products.length > 0) {
      const foundProduct = products.find((p) => p._id === id);
      setProduct(foundProduct);
    } else {
      dispatch(getProducts());
    }
  }, [id, products, dispatch]);

  const handleIncreaseQty = () => {
    setQty((prev) => prev + 1);
  };

  const handleDecreaseQty = () => {
    if (qty > 1) {
      setQty((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    dispatch(addItemToCart(product, qty));
    alert(`Added ${qty} ${product.title} to cart`);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress sx={{ color: "#0f2a1d" }} />
      </Box>
    );
  }

  if (!product) {
    return (
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <Typography variant="h5">Product not found</Typography>
        <Button onClick={() => navigate("/")} sx={{ mt: 2 }}>
          Back to Home
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{ p: 4, maxWidth: "1200px", margin: "0 auto", minHeight: "100vh" }}
    >
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/")}
        variant="contained"
        sx={{
          mt: 2,
          bgcolor: "#0f2a1d",
          mb: 3,
          borderRadius: "20px",
          "&:hover": { bgcolor: "#144430" },
        }}
      >
        Back to Store
      </Button>

      <Paper elevation={0} sx={{ p: 0, borderRadius: 2 }}>
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={product.image || "https://via.placeholder.com/500"}
              alt={product.title}
              sx={{ width: "100%", maxHeight: "500px", objectFit: "contain" }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h3" fontWeight="bold">
              {product.title}
            </Typography>
            <Typography
              variant="h4"
              sx={{ color: "#0f2a1d", fontWeight: "bold", my: 2 }}
            >
              ₦{product.price.toLocaleString()}
            </Typography>
            <Typography sx={{ mb: 4, color: "#555", lineHeight: 1.6 }}>
              {product.description}
            </Typography>

            {!isAdmin && (
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}
              >
                <Typography fontWeight="bold">Quantity:</Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    border: "1px solid #ddd",
                    borderRadius: "50px",
                    px: 1,
                  }}
                >
                  <IconButton onClick={handleDecreaseQty} disabled={qty <= 1}>
                    <RemoveIcon />
                  </IconButton>
                  <Typography sx={{ mx: 2, fontWeight: "bold" }}>
                    {qty}
                  </Typography>
                  <IconButton onClick={handleIncreaseQty}>
                    <AddIcon />
                  </IconButton>
                </Box>
              </Box>
            )}

            {isAdmin ? (
              <Button
                variant="contained"
                size="large"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/product/edit/${product._id}`)}
                fullWidth
                sx={{ bgcolor: "#1976d2", py: 1.5, borderRadius: "30px" }}
              >
                Edit Product
              </Button>
            ) : (
              <Button
                variant="contained"
                size="large"
                startIcon={<ShoppingCartIcon />}
                onClick={handleAddToCart}
                fullWidth
                sx={{
                  bgcolor: "#0f2a1d",
                  py: 1.5,
                  borderRadius: "30px",
                  "&:hover": { bgcolor: "#144430" },
                }}
              >
                Add to Cart
              </Button>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ProductDetails;
