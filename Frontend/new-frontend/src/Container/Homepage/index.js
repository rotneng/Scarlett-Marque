import React, { useEffect, useState } from "react";
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
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LogoutIcon from "@mui/icons-material/Logout";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import InfoIcon from "@mui/icons-material/Info";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getProducts, deleteProduct } from "../../Actions/product.actions";

const Homepage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const productState = useSelector((state) => state.product);
  const products = productState?.products || [];
  const loading = productState?.loading || false;

  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const isAdmin = token && user && user.role === "admin";

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const filteredProducts = products.filter((product) => {
    if (searchTerm === "") return true;
    const lowerCaseSearch = searchTerm.toLowerCase();
    return (
      product.title.toLowerCase().includes(lowerCaseSearch) ||
      product.category.toLowerCase().includes(lowerCaseSearch)
    );
  });

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
    <Box>
      <Box
        style={{
          display: "flex",
          padding: "20px",
          backgroundColor: "#0f2a1d",
          color: "white",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          boxShadow: "0px 2px 10px rgba(0,0,0,0.3)",
        }}
      >
        <Box
          onClick={() => navigate("/")}
          style={{
            color: "white",
            fontWeight: "bolder",
            fontSize: "28px",
            cursor: "pointer",
            marginRight: "20px",
          }}
        >
          Scarlett Marque
        </Box>

        <TextField
          style={{
            backgroundColor: "white",
            borderRadius: "150px",
            width: "30%",
            minWidth: "200px",
          }}
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon style={{ color: "#888" }} />
              </InputAdornment>
            ),
            style: { borderRadius: "150px" },
          }}
        />

        <Box style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {!isAdmin && (
            <Tooltip title="About">
              <InfoIcon onClick={() => navigate("/about")} />
            </Tooltip>
          )}
          {isAdmin && (
            <Tooltip title=" Add Products">
              <AddIcon onClick={() => navigate("/addproducts")} />
            </Tooltip>
          )}

          {!isAdmin && (
            <Tooltip title="View Cart">
              <IconButton
                onClick={() => navigate("/cart")}
                style={{ color: "white" }}
              >
                <ShoppingCartIcon />
              </IconButton>
            </Tooltip>
          )}

          {token ? (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {user && (
                <Typography
                  sx={{
                    mr: 1,
                    fontSize: "0.9rem",
                    display: { xs: "none", sm: "block" },
                  }}
                >
                  Hi, {user.username}
                </Typography>
              )}
              <Tooltip title="Logout">
                <IconButton onClick={handleLogout} style={{ color: "white" }}>
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
            </Box>
          ) : (
            <Tooltip title="Sign In">
              <IconButton
                onClick={() => navigate("/signIn")}
                style={{ color: "white" }}
              >
                <AccountCircleIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      <Box
        style={{
          padding: "40px 20px",
          backgroundColor: "#f4f4f4",
          minHeight: "90vh",
        }}
      >
        {loading ? (
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "100px",
            }}
          >
            <CircularProgress style={{ color: "#0f2a1d" }} />
          </Box>
        ) : (
          <Grid container spacing={4}>
            {filteredProducts && filteredProducts.length > 0 ? (
              filteredProducts.map((item) => (
                <Grid item key={item._id} xs={12} sm={6} md={4} lg={3}>
                  <Card
                    onClick={() => handleProductClick(item._id)}
                    elevation={3}
                    style={{
                      cursor: "pointer",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: "12px",
                      position: "relative",
                      transition: "0.3s",
                    }}
                  >
                    {isAdmin && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 10,
                          right: 10,
                          display: "flex",
                          gap: 1,
                          zIndex: 10,
                        }}
                      >
                        <Tooltip title="Edit">
                          <IconButton
                            onClick={(e) => handleEditClick(e, item._id)}
                            size="small"
                            sx={{
                              bgcolor: "rgba(255,255,255,0.9)",
                              "&:hover": { bgcolor: "#fff" },
                            }}
                          >
                            <EditIcon fontSize="small" color="primary" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={(e) => handleDeleteClick(e, item._id)}
                            size="small"
                            sx={{
                              bgcolor: "rgba(255,255,255,0.9)",
                              "&:hover": { bgcolor: "#ffebee" },
                            }}
                          >
                            <DeleteIcon fontSize="small" color="error" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )}

                    <CardMedia
                      component="img"
                      height="250"
                      image={item.image || "https://via.placeholder.com/250"}
                      alt={item.title}
                      style={{ objectFit: "cover" }}
                    />

                    <CardContent style={{ flexGrow: 1 }}>
                      <Typography variant="overline" color="text.secondary">
                        {item.category}
                      </Typography>
                      <Typography
                        gutterBottom
                        variant="h6"
                        component="div"
                        style={{ fontWeight: 700, lineHeight: 1.2 }}
                      >
                        {item.title}
                      </Typography>
                      <Typography
                        variant="h6"
                        style={{
                          color: "#0f2a1d",
                          fontWeight: "bold",
                          marginTop: "10px",
                        }}
                      >
                        ₦{item.price}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Box
                style={{
                  width: "100%",
                  textAlign: "center",
                  marginTop: "50px",
                }}
              >
                <Typography variant="h5" color="text.secondary">
                  {searchTerm
                    ? `No results for "${searchTerm}"`
                    : "No Products Found"}
                </Typography>
              </Box>
            )}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default Homepage;
