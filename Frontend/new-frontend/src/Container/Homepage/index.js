import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  Card,
  Typography,
  Grid,
  CardMedia,
  CardContent,
  IconButton,
  CircularProgress,
  Tooltip,
  AppBar,
  Toolbar,
  Container,
  Stack,
  Chip,
  Badge,
  alpha,
  Button,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LogoutIcon from "@mui/icons-material/Logout";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import InfoIcon from "@mui/icons-material/Info";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ListAltIcon from "@mui/icons-material/ListAlt";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import BlockIcon from "@mui/icons-material/Block";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getProducts, deleteProduct } from "../../Actions/product.actions";

const PRIMARY_COLOR = "#0f2a1d";
const PLACEHOLDER_IMG = "https://placehold.co/300x300?text=No+Image";
const API_BASE_URL = "http://localhost:5000";

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
  const products = productState?.products || [];
  const loading = productState?.loading || false;
  const cartItems = useSelector((state) => state.cart?.cartItems || []);

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
    const lowerCaseSearch = searchTerm.toLowerCase();

    return products.filter((product) => {
      const title = product.title ? product.title.toLowerCase() : "";
      const category = product.category ? product.category.toLowerCase() : "";
      return (
        title.includes(lowerCaseSearch) || category.includes(lowerCaseSearch)
      );
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
    navigate(`/product/edit/${id}`);
  };

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    if (
      window.confirm(
        "Are you sure you want to permanently delete this product?"
      )
    ) {
      dispatch(deleteProduct(id));
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/signIn";
  };

  const navButtonStyle = {
    color: "white",
    textTransform: "none",
    minWidth: "auto",
    paddingX: 1.5,
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
  };

  const labelStyle = {
    display: { xs: "none", md: "inline" },
    marginLeft: "4px",
  };

  return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh" }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: PRIMARY_COLOR,
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <Toolbar
          sx={{
            py: { xs: 2, md: 1 },
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: { xs: 2, md: 2 },
          }}
        >
          <Box
            onClick={() => navigate("/")}
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              width: { xs: "100%", md: "auto" },
              justifyContent: { xs: "center", md: "flex-start" },
              "&:hover": { opacity: 0.9 },
            }}
          >
            <Typography
              variant="h5"
              noWrap
              sx={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 700,
                letterSpacing: ".1rem",
                color: "white",
              }}
            >
              Scarlett Marque
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: { xs: "100%", md: "auto" },
              flexGrow: { md: 1 },
              maxWidth: "600px",
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search collections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              sx={{
                bgcolor: "white",
                borderRadius: "50px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "50px",
                  "& fieldset": { border: "none" },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: PRIMARY_COLOR }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{
              width: { xs: "100%", md: "auto" },
              justifyContent: { xs: "center", md: "flex-end" },
              flexWrap: "wrap",
            }}
          >
            {!isAdmin && (
              <Button
                onClick={() => navigate("/about")}
                sx={navButtonStyle}
                startIcon={<InfoIcon />}
              >
                <Box component="span" sx={labelStyle}>
                  About Us
                </Box>
              </Button>
            )}

            {isAdmin ? (
              <>
                <Button
                  onClick={() => navigate("/admin/orders")}
                  sx={navButtonStyle}
                  startIcon={<ListAltIcon />}
                >
                  <Box component="span" sx={labelStyle}>
                    Orders
                  </Box>
                </Button>
                <Button
                  onClick={() => navigate("/addproducts")}
                  sx={navButtonStyle}
                  startIcon={<AddIcon />}
                >
                  <Box component="span" sx={labelStyle}>
                    Add Product
                  </Box>
                </Button>
              </>
            ) : (
              <>
                {token && (
                  <Button
                    onClick={() => navigate("/account/orders")}
                    sx={navButtonStyle}
                    startIcon={<LocalShippingIcon />}
                  >
                    <Box component="span" sx={labelStyle}>
                      My Orders
                    </Box>
                  </Button>
                )}
                <Button
                  onClick={() => navigate("/cart")}
                  sx={navButtonStyle}
                  startIcon={
                    <Badge badgeContent={cartItems.length} color="warning">
                      <ShoppingCartIcon />
                    </Badge>
                  }
                >
                  <Box component="span" sx={labelStyle}>
                    Cart
                  </Box>
                </Button>
              </>
            )}

            {token ? (
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{
                  ml: 1,
                  pl: 1,
                  borderLeft: { md: "1px solid rgba(255,255,255,0.2)" }, // Divider only on desktop
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    display: { xs: "none", md: "block" },
                    opacity: 0.9,
                    color: "white",
                  }}
                >
                  {user?.username}
                </Typography>
                <Tooltip title="Logout">
                  <IconButton onClick={handleLogout} sx={{ color: "white" }}>
                    <LogoutIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
            ) : (
              <Button
                onClick={() => navigate("/signIn")}
                sx={navButtonStyle}
                startIcon={<AccountCircleIcon />}
              >
                <Box component="span" sx={labelStyle}>
                  Sign In
                </Box>
              </Button>
            )}
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 5 }}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "50vh",
            }}
          >
            <CircularProgress sx={{ color: PRIMARY_COLOR }} />
          </Box>
        ) : (
          <Grid container spacing={4}>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((item) => {
                const currentStock = getStock(item);
                const isOutOfStock = currentStock <= 0;
                const isLowStock = currentStock > 0 && currentStock < 5;
                const displayImage = getProductImage(item);

                return (
                  <Grid item key={item._id} xs={12} sm={6} md={4} lg={3}>
                    <Card
                      onClick={() => handleProductClick(item)}
                      elevation={0}
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: "16px",
                        position: "relative",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        border: "1px solid #eee",
                        opacity: isOutOfStock ? 0.85 : 1,
                        "&:hover": {
                          transform: "translateY(-8px)",
                          boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
                        },
                      }}
                    >
                      {isOutOfStock && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            bgcolor: "rgba(255,255,255,0.6)",
                            zIndex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            pointerEvents: "none",
                          }}
                        >
                          <Chip
                            label="SOLD OUT"
                            color="error"
                            sx={{
                              fontWeight: "bold",
                              fontSize: "1rem",
                              boxShadow: 2,
                            }}
                          />
                        </Box>
                      )}

                      {isAdmin && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: 12,
                            right: 12,
                            display: "flex",
                            gap: 1,
                            zIndex: 2,
                          }}
                        >
                          <Tooltip title="Edit Product">
                            <IconButton
                              onClick={(e) => handleEditClick(e, item._id)}
                              size="small"
                              sx={{
                                bgcolor: "white",
                                boxShadow: 1,
                                "&:hover": { bgcolor: "#f5f5f5" },
                              }}
                            >
                              <EditIcon fontSize="small" color="primary" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Product">
                            <IconButton
                              onClick={(e) => handleDeleteClick(e, item._id)}
                              size="small"
                              sx={{
                                bgcolor: "white",
                                boxShadow: 1,
                                "&:hover": { bgcolor: "#ffebee" },
                              }}
                            >
                              <DeleteIcon fontSize="small" color="error" />
                            </IconButton>
                          </Tooltip>
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
                          onError={(e) => {
                            e.target.src = PLACEHOLDER_IMG;
                          }}
                          alt={item.title}
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.5s",
                            filter: isOutOfStock ? "grayscale(100%)" : "none",
                            "&:hover": { transform: "scale(1.05)" },
                          }}
                        />
                      </Box>

                      <CardContent sx={{ flexGrow: 1, pt: 3, px: 2.5 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                          }}
                        >
                          <Chip
                            label={item.category || "General"}
                            size="small"
                            sx={{
                              mb: 1,
                              bgcolor: alpha(PRIMARY_COLOR, 0.05),
                              color: PRIMARY_COLOR,
                              fontWeight: 600,
                              fontSize: "0.7rem",
                              textTransform: "uppercase",
                            }}
                          />
                          {isLowStock && (
                            <Typography
                              variant="caption"
                              color="error"
                              fontWeight="bold"
                            >
                              Only {currentStock} left!
                            </Typography>
                          )}
                        </Box>

                        <Typography
                          gutterBottom
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            fontSize: "1rem",
                            lineHeight: 1.4,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            minHeight: "2.8em",
                          }}
                        >
                          {item.title}
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            mt: 2,
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{ color: PRIMARY_COLOR, fontWeight: "bold" }}
                          >
                            ₦{item.price?.toLocaleString() || "0"}
                          </Typography>
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: "50%",
                              bgcolor: isOutOfStock ? "#ffebee" : "#f5f5f5",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: isOutOfStock
                                ? "error.main"
                                : PRIMARY_COLOR,
                            }}
                          >
                            {isOutOfStock ? (
                              <BlockIcon fontSize="small" />
                            ) : (
                              <AddIcon fontSize="small" />
                            )}
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })
            ) : (
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  mt: 8,
                  opacity: 0.7,
                }}
              >
                <SearchOffIcon sx={{ fontSize: 60, mb: 2, color: "#ccc" }} />
                <Typography
                  variant="h5"
                  color="text.secondary"
                  fontWeight="bold"
                >
                  No products found
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Try adjusting your search terms or browse all categories.
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
