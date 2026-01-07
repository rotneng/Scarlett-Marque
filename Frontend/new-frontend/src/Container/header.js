import React from "react";
import {
  Box,
  TextField,
  InputAdornment,
  Typography,
  IconButton,
  Tooltip,
  AppBar,
  Toolbar,
  Stack,
  Badge,
  Button,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LogoutIcon from "@mui/icons-material/Logout";
import AddIcon from "@mui/icons-material/Add";
import InfoIcon from "@mui/icons-material/Info";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ListAltIcon from "@mui/icons-material/ListAlt";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const PRIMARY_COLOR = "#0f2a1d";

const Header = ({ showSearch = false, searchTerm = "", setSearchTerm }) => {
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart?.cartItems || []);
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const isAdmin = token && user && user.role === "admin";

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/signIn";
  };

  const navButtonStyle = {
    color: "white",
    textTransform: "none",
    fontSize: "0.9rem",
    minWidth: "auto",
    px: 1.5,
    "& .MuiButton-startIcon": {
      mr: { xs: 0, md: 1 },
    },
  };

  const labelStyle = {
    display: { xs: "none", md: "inline" },
  };

  return (
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
              userSelect: "none",
            }}
          >
            Scarlett Marque
          </Typography>
        </Box>

        {showSearch ? (
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
              onChange={(e) => setSearchTerm && setSearchTerm(e.target.value)}
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
        ) : (
          <Box sx={{ flexGrow: 1 }} />
        )}

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
              startIcon={<InfoIcon />}
              sx={navButtonStyle}
            >
              <span style={labelStyle}>About Us</span>
            </Button>
          )}

          {isAdmin ? (
            <>
              <Button
                onClick={() => navigate("/admin/orders")}
                startIcon={<ListAltIcon />}
                sx={navButtonStyle}
              >
                <span style={labelStyle}>Orders</span>
              </Button>
              <Button
                onClick={() => navigate("/addproducts")}
                startIcon={<AddIcon />}
                sx={navButtonStyle}
              >
                <span style={labelStyle}>Add Product</span>
              </Button>
            </>
          ) : (
            <>
              {token && (
                <Button
                  onClick={() => navigate("/account/orders")}
                  startIcon={<LocalShippingIcon />}
                  sx={navButtonStyle}
                >
                  <span style={labelStyle}>My Orders</span>
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
                <span style={labelStyle}>Cart</span>
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
                borderLeft: "1px solid rgba(255,255,255,0.2)",
                pl: 1,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  display: { xs: "none", md: "block" },
                  opacity: 0.9,
                  color: "white",
                  maxWidth: "100px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
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
            <Tooltip title="Sign In">
              <IconButton
                onClick={() => navigate("/signIn")}
                sx={{ color: "white", ml: 1 }}
              >
                <AccountCircleIcon fontSize="large" />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
