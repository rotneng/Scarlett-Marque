import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Grid,
  CardMedia,
  CardContent,
  IconButton,
  CircularProgress,
  Container,
  Chip,
  Avatar,
  Paper,
  Card,
} from "@mui/material";

import SearchOffIcon from "@mui/icons-material/SearchOff";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SecurityIcon from "@mui/icons-material/Security";

import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import Face3Icon from "@mui/icons-material/Face3";
import Face6Icon from "@mui/icons-material/Face6";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import DiamondIcon from "@mui/icons-material/Diamond";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getProducts, deleteProduct } from "../../Actions/product.actions";
import Header from "../header";

const PRIMARY_COLOR = "#0f2a1d";
const PLACEHOLDER_IMG = "https://placehold.co/300x300?text=No+Image";
const BANNER_IMG =
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop";
const API_BASE_URL = "http://localhost:5000";

const categories = [
  { label: "New Arrivals", value: "new", icon: <AutoAwesomeIcon /> },
  { label: "Women", value: "women", icon: <Face3Icon /> },
  { label: "Men", value: "men", icon: <Face6Icon /> },
  { label: "Kids & Baby", value: "kids", icon: <ChildCareIcon /> },
  { label: "Dresses", value: "dresses", icon: <CheckroomIcon /> },
  { label: "Accessories", value: "accessories", icon: <DiamondIcon /> },
  { label: "Summer/Swim", value: "summer", icon: <BeachAccessIcon /> },
  { label: "Clearance", value: "sale", icon: <LocalOfferIcon /> },
];

const getProductImage = (product) => {
  if (!product) return PLACEHOLDER_IMG;

  const isFullUrl = (path) =>
    path && (path.startsWith("http") || path.startsWith("data:"));

  const extractPath = (obj) => {
    if (!obj) return null;
    if (typeof obj === "string") return obj;
    if (obj.img) return obj.img;
    if (obj.url) return obj.url;
    return null;
  };

  let rawPath = null;
  if (product.images && product.images.length > 0) {
    rawPath = extractPath(product.images[0]);
  }
  if (!rawPath) rawPath = extractPath(product.image);
  if (!rawPath) rawPath = extractPath(product.productPictures?.[0]);

  if (!rawPath) return PLACEHOLDER_IMG;
  if (isFullUrl(rawPath)) return rawPath;
  const cleanBase = API_BASE_URL.endsWith("/")
    ? API_BASE_URL.slice(0, -1)
    : API_BASE_URL;
  const cleanPath = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;

  return `${cleanBase}${cleanPath}`;
};

const Homepage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const productState = useSelector((state) => state.product);

  const products = useMemo(() => productState?.products || [], [productState]);
  const loading = productState?.loading || false;

  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const isAdmin = token && user && user.role === "admin";

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;

    const lowerCaseSearch = searchTerm.toLowerCase().trim();
    const cleanSearch = lowerCaseSearch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${cleanSearch}`, "i");

    return products.filter((product) => {
      const title = product.title ? product.title.toLowerCase() : "";
      const category = product.category ? product.category.toLowerCase() : "";

      if (lowerCaseSearch === "kids") {
        return (
          title.includes("kids") ||
          title.includes("baby") ||
          category.includes("kids") ||
          category.includes("baby")
        );
      }

      return regex.test(title) || regex.test(category);
    });
  }, [products, searchTerm]);

  const getStock = (p) => {
    if (!p) return 0;
    if (p.quantity !== undefined) return p.quantity;
    if (p.stock !== undefined) return p.stock;
    if (p.countInStock !== undefined) return p.countInStock;
    return 0;
  };

  const handleProductClick = (item) => {
    navigate(`/product/${item._id}`);
  };

  const handleEditClick = (e, id) => {
    e.stopPropagation();
    navigate(`/product/update/${id}`);
  };

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    if (
      window.confirm(
        "Are you sure you want to permanently delete this product?",
      )
    ) {
      dispatch(deleteProduct(id));
    }
  };

  const handleCategoryClick = (categoryLabel) => {
    setSearchTerm(categoryLabel);
  };

  return (
    <Box sx={{ bgcolor: "#f1f1f1", minHeight: "100vh" }}>
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {!isAdmin && (
        <Container maxWidth="lg" sx={{ mt: 2 }}>
          <Box
            sx={{
              width: "100%",
              mx: "auto",
              height: { xs: "200px", md: "400px" },
              backgroundImage: `url(${BANNER_IMG})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
              borderRadius: 2,
              overflow: "hidden",
              mb: 4,
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                bgcolor: "rgba(0,0,0,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            ></Box>
          </Box>
        </Container>
      )}
      {!isAdmin && (
        <Paper elevation={0} sx={{ py: 3, mb: 2, borderRadius: 0 }}>
          <Container maxWidth="lg">
            <Grid
              container
              spacing={2}
              justifyContent="space-around"
              alignItems="center"
            >
              <Grid item xs={12} sm={6} md={5}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: { xs: "center", md: "flex-start" },
                  }}
                >
                  <LocalShippingIcon
                    sx={{ fontSize: 35, color: "#0f2a1d", mr: 2 }}
                  />
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Free Shipping
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      On orders over ₦50,000
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={5}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: { xs: "center", md: "flex-start" },
                  }}
                >
                  <SecurityIcon
                    sx={{ fontSize: 25, color: "#0f2a1d", mr: 2 }}
                  />
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Secure Payment
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      100% secure payment
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Paper>
      )}

      <Container maxWidth="lg" sx={{ py: 2 }}>
        {!isAdmin && (
          <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Box>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  sx={{ color: "#000" }}
                >
                  Shop by Category
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Browse products by category
                </Typography>
              </Box>
            </Box>

            <Grid container spacing={4} justifyContent="center">
              {categories.map((cat, index) => (
                <Grid item xs={4} sm={3} md={2} lg={1.5} key={index}>
                  <Box
                    onClick={() => handleCategoryClick(cat.value)}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      cursor: "pointer",
                      "&:hover .cat-avatar": {
                        transform: "scale(1.1)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      },
                    }}
                  >
                    <Avatar
                      className="cat-avatar"
                      sx={{
                        width: { xs: 50, md: 70 },
                        height: { xs: 50, md: 70 },
                        mb: 1,
                        bgcolor: "#f5f5f5",
                        color: "#333",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {cat.icon}
                    </Avatar>
                    <Typography
                      variant="caption"
                      align="center"
                      sx={{
                        fontWeight: 500,
                        color: "#333",
                        fontSize: "0.8rem",
                      }}
                    >
                      {cat.label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        )}

        {!isAdmin && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Box>
              <Typography variant="h5" fontWeight="bold">
                Featured Products
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Handpicked selections just for you
              </Typography>
            </Box>
          </Box>
        )}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
            <CircularProgress sx={{ color: PRIMARY_COLOR }} />
          </Box>
        ) : (
          <Grid container spacing={4} sx={{ justifyContent: "center" }}>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((item) => {
                const currentStock = getStock(item);
                const isOutOfStock = currentStock <= 0;
                const displayImage = getProductImage(item);

                return (
                  <Grid item key={item._id} xs={6} sm={6} md={4} lg={3}>
                    <Card
                      onClick={() => handleProductClick(item)}
                      elevation={0}
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: 1,
                        cursor: "pointer",
                        bgcolor: "white",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                        },
                      }}
                    >
                      {isAdmin && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            zIndex: 10,
                            bgcolor: "rgba(255,255,255,0.8)",
                            borderRadius: 1,
                          }}
                        >
                          <IconButton
                            onClick={(e) => handleEditClick(e, item._id)}
                            size="small"
                          >
                            <EditIcon fontSize="small" color="primary" />
                          </IconButton>
                          <IconButton
                            onClick={(e) => handleDeleteClick(e, item._id)}
                            size="small"
                          >
                            <DeleteIcon fontSize="small" color="error" />
                          </IconButton>
                        </Box>
                      )}

                      <Box
                        sx={{
                          position: "relative",
                          pt: "100%",
                          overflow: "hidden",
                        }}
                      >
                        <CardMedia
                          component="img"
                          image={displayImage}
                          alt={item.title}
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        {isOutOfStock && (
                          <Box
                            sx={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              bgcolor: "rgba(255,255,255,0.7)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Chip label="SOLD OUT" size="small" color="error" />
                          </Box>
                        )}
                      </Box>

                      <CardContent sx={{ p: 2, flexGrow: 1 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 600,
                            fontSize: "0.95rem",
                            lineHeight: 1.2,
                            mb: 0.5,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.title}
                        </Typography>

                        <Typography
                          variant="caption"
                          display="block"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          by {item.brand || "Fashion Store"}
                        </Typography>

                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 800,
                            fontSize: "1.1rem",
                            color: "#000",
                          }}
                        >
                          ₦{Number(item.price).toLocaleString()}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })
            ) : (
              <Box sx={{ width: "100%", textAlign: "center", py: 8 }}>
                <SearchOffIcon sx={{ fontSize: 50, color: "#ccc", mb: 1 }} />
                <Typography color="text.secondary">
                  No products found
                </Typography>
              </Box>
            )}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Homepage;
