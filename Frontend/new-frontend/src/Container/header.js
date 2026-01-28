import React, { useState } from "react";
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
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddIcon from "@mui/icons-material/Add";
import InfoIcon from "@mui/icons-material/Info";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ListAltIcon from "@mui/icons-material/ListAlt";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PersonIcon from "@mui/icons-material/Person";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LogoutIcon from "@mui/icons-material/Logout";

import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../../src/assets/Logo.png";

import { logout } from "../Actions/auth.actions";

const PRIMARY_COLOR = "#0f2a1d";

const Header = ({ searchTerm = "", setSearchTerm }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart?.cartItems || []);
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const isAdmin = token && user && user.role === "admin";

  const showSearch = location.pathname === "/";

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigateAndClose = (path) => {
    handleMenuClose();
    navigate(path);
  };

  const handleLogout = () => {
    handleMenuClose();

    dispatch(logout());

    localStorage.clear();
    navigate("/");
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
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          py: 1,
          gap: 2,
        }}
      >
        <Box
          onClick={() => navigate("/")}
          sx={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            flexShrink: 0,
            "&:hover": { opacity: 0.9 },
          }}
        >
          <Box
            component="img"
            src={Logo}
            alt="Scarlett Marque Logo"
            sx={{
              height: { xs: 40, md: 50 },
              width: "auto",
              mr: 1,
            }}
          ></Box>
          <Typography
            variant="h5"
            noWrap
            sx={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 700,
              letterSpacing: ".1rem",
              color: "white",
              userSelect: "none",
              fontSize: { xs: "1.2rem", md: "1.5rem" },
              display: { xs: "none", sm: "block" },
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
              flexGrow: 1,
              flexShrink: 1,
              maxWidth: "700px",
              minWidth: "150px",
              transition: "all 0.3s ease-in-out",
            }}
          >
            <TextField
              variant="outlined"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm && setSearchTerm(e.target.value)}
              size="small"
              sx={{
                bgcolor: "white",
                width: "100%",
                borderRadius: "40px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "40px",
                  "& fieldset": { border: "none" },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
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
            justifyContent: "flex-end",
            flexShrink: 0,
          }}
        >
          <Box
            sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}
          >
            {!isAdmin && (
              <Button
                onClick={() => navigate("/about")}
                startIcon={<InfoIcon />}
                sx={navButtonStyle}
              >
                <span style={labelStyle}>About</span>
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
                  <span style={labelStyle}>Add Products</span>
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
                    <span style={labelStyle}>Orders</span>
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

          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{
              ml: 1,
              borderLeft: {
                xs: "none",
                md: "1px solid rgba(255,255,255,0.2)",
              },
              pl: { xs: 0, md: 1 },
            }}
          >
            {token && (
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
            )}

            <Tooltip title={token ? "Account Settings" : "Sign In / Sign Up"}>
              <IconButton
                onClick={handleProfileClick}
                sx={{ color: "white", ml: 1 }}
              >
                <AccountCircleIcon fontSize="large" />
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={anchorEl}
              open={openMenu}
              onClose={handleMenuClose}
              PaperProps={{
                elevation: 3,
                sx: {
                  mt: 1.5,
                  minWidth: 180,
                  borderRadius: 2,
                  "& .MuiMenuItem-root": {
                    px: 2,
                    py: 1.5,
                    gap: 1.5,
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              {!token && (
                <MenuItem onClick={() => handleNavigateAndClose("/signIn")}>
                  <ListItemIcon>
                    <LoginIcon fontSize="small" />
                  </ListItemIcon>
                  <Typography variant="body2">Sign In</Typography>
                </MenuItem>
              )}

              {!token && (
                <MenuItem onClick={() => handleNavigateAndClose("/signUp")}>
                  <ListItemIcon>
                    <PersonAddIcon fontSize="small" />
                  </ListItemIcon>
                  <Typography variant="body2">Sign Up</Typography>
                </MenuItem>
              )}

              {token && !isAdmin && (
                <MenuItem onClick={() => handleNavigateAndClose("/profile")}>
                  <ListItemIcon>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  <Typography variant="body2">My Profile</Typography>
                </MenuItem>
              )}

              {token && !isAdmin && (
                <MenuItem
                  onClick={() => handleNavigateAndClose("/account/orders")}
                >
                  <ListItemIcon>
                    <LocalShippingIcon fontSize="small" />
                  </ListItemIcon>
                  <Typography variant="body2">My Orders</Typography>
                </MenuItem>
              )}

              {token && !isAdmin && <Divider />}

              {token && (
                <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" color="error" />
                  </ListItemIcon>
                  <Typography variant="body2">Logout</Typography>
                </MenuItem>
              )}
            </Menu>
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
