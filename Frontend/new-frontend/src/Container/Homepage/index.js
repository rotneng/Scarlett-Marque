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
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getProducts, deleteProduct } from "../../Actions/product.actions";

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
    return products.filter(
      (product) =>
        product.title.toLowerCase().includes(lowerCaseSearch) ||
        product.category.toLowerCase().includes(lowerCaseSearch)
    );
  }, [products, searchTerm]);

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
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
    window.location.reload();
  };

  return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh" }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "#0f2a1d",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <Toolbar
          sx={{
            py: 1,
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box
            onClick={() => navigate("/")}
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
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
              flexGrow: 1,
              display: "flex",
              justifyContent: "center",
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
                    <SearchIcon sx={{ color: "#0f2a1d" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Stack direction="row" spacing={1} alignItems="center">
            {!isAdmin && (
              <Tooltip title="About Us">
                <IconButton
                  onClick={() => navigate("/about")}
                  sx={{ color: "white" }}
                >
                  <InfoIcon />
                </IconButton>
              </Tooltip>
            )}

            {isAdmin ? (
              <>
                <Tooltip title="Orders">
                  <IconButton
                    onClick={() => navigate("/admin/orders")}
                    sx={{ color: "white" }}
                  >
                    <ListAltIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Add Product">
                  <IconButton
                    onClick={() => navigate("/addproducts")}
                    sx={{ color: "white" }}
                  >
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <>
                {token && (
                  <Tooltip title="My Orders">
                    <IconButton
                      onClick={() => navigate("/account/orders")}
                      sx={{ color: "white" }}
                    >
                      <LocalShippingIcon />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="Cart">
                  <IconButton
                    onClick={() => navigate("/cart")}
                    sx={{ color: "white" }}
                  >
                    <Badge badgeContent={cartItems.length} color="warning">
                      <ShoppingCartIcon />
                    </Badge>
                  </IconButton>
                </Tooltip>
              </>
            )}

            {token ? (
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ ml: 1 }}
              >
                <Typography
                  variant="body2"
                  sx={{ display: { xs: "none", md: "block" }, opacity: 0.9 }}
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
              <Tooltip title="Sign In">
                <IconButton
                  onClick={() => navigate("/signIn")}
                  sx={{ color: "white" }}
                >
                  <AccountCircleIcon fontSize="large" />
                </IconButton>
              </Tooltip>
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
            <CircularProgress sx={{ color: "#0f2a1d" }} />
          </Box>
        ) : (
          <Grid container spacing={4}>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((item) => (
                <Grid item key={item._id} xs={12} sm={6} md={4} lg={3}>
                  <Card
                    onClick={() => handleProductClick(item._id)}
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
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
                      },
                    }}
                  >
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
                        image={item.image || "https://via.placeholder.com/300"}
                        alt={item.title}
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "transform 0.5s",
                          "&:hover": { transform: "scale(1.05)" },
                        }}
                      />
                    </Box>

                    <CardContent sx={{ flexGrow: 1, pt: 3, px: 2.5 }}>
                      <Chip
                        label={item.category}
                        size="small"
                        sx={{
                          mb: 1,
                          bgcolor: alpha("#0f2a1d", 0.05),
                          color: "#0f2a1d",
                          fontWeight: 600,
                          fontSize: "0.7rem",
                          textTransform: "uppercase",
                        }}
                      />

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
                          sx={{ color: "#0f2a1d", fontWeight: "bold" }}
                        >
                          ₦{item.price?.toLocaleString()}
                        </Typography>
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            bgcolor: "#f5f5f5",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#0f2a1d",
                          }}
                        >
                          <AddIcon fontSize="small" />
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
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
