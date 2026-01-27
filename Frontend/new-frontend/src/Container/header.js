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
          // REVERTED TO ROW: Ensures Logo and Icon are side-by-side on mobile
          flexDirection: "row", 
          alignItems: "center",
          justifyContent: "space-between",
          py: 1, // Reduced padding for mobile
        }}
      >
        {/* --- 1. LOGO SECTION (Always Visible) --- */}
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
              userSelect: "none",
              fontSize: { xs: "1.2rem", md: "1.5rem" } // Slightly smaller on mobile
            }}
          >
            Scarlett Marque
          </Typography>
        </Box>

        {/* --- 2. SEARCH SECTION (Desktop Only) --- */}
        {showSearch ? (
          <Box
            sx={{
              // HIDDEN ON MOBILE (xs: none), Visible on Desktop (md: flex)
              display: { xs: "none", md: "flex" }, 
              justifyContent: "center",
              flexGrow: 1,
              maxWidth: "600px",
              mx: 2
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
          // Spacer for desktop alignment when search is hidden
          <Box sx={{ display: { xs: "none", md: "block" }, flexGrow: 1 }} />
        )}

        {/* --- 3. ICONS & BUTTONS SECTION --- */}
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{
            justifyContent: "flex-end",
          }}
        >
          {/* WRAPPER FOR NAVIGATION BUTTONS 
             Hidden on Mobile, Visible on Desktop 
          */}
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}>
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
          </Box>

          {/* LOGIN / LOGOUT SECTION 
             Visible on BOTH Mobile and Desktop 
          */}
          {token ? (
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{
                ml: 1,
                // Add border only on desktop to separate from nav links
                borderLeft: { xs: "none", md: "1px solid rgba(255,255,255,0.2)" },
                pl: { xs: 0, md: 1 },
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  display: { xs: "none", md: "block" }, // Hide username text on mobile, show icon only
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