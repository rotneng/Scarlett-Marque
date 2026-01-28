import React, { useState, useEffect } from "react";
import {
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  Badge,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AddIcon from "@mui/icons-material/Add";
import LoginIcon from "@mui/icons-material/Login";

const MobileFooter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const cartItems = useSelector((state) => state.cart?.cartItems || []);
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const isAdmin = token && user && user.role === "admin";

  const [value, setValue] = useState(0);

  useEffect(() => {
    const path = location.pathname;

    if (path === "/") {
      setValue(0);
      return;
    }

    if (isAdmin) {
      if (path === "/addproducts") {
        setValue(1);
      } else if (path === "/admin/orders") {
        setValue(2);
      }
    } else {
      if (path === "/about") {
        setValue(1);
      } else if (path === "/cart") {
        setValue(2);
      } else if (path === "/account/orders" || path === "/signIn") {
        setValue(3);
      }
    }
  }, [location.pathname, isAdmin]);

  if (!isMobile) return null;

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        borderTop: "1px solid rgba(0,0,0,0.1)",
      }}
      elevation={3}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        sx={{
          bgcolor: "white",
          height: 65,
          "& .MuiBottomNavigationAction-root": { color: "gray" },
          "& .Mui-selected": {
            color: "#0f2a1d",
            "& .MuiSvgIcon-root": { color: "#0f2a1d" },
          },
        }}
      >
        <BottomNavigationAction
          label="Home"
          icon={<HomeIcon />}
          onClick={() => navigate("/")}
        />

        {!isAdmin && (
          <BottomNavigationAction
            label="About"
            icon={<InfoIcon />}
            onClick={() => navigate("/about")}
          />
        )}

        {isAdmin
          ? [
              <BottomNavigationAction
                key="add"
                label="Add"
                icon={<AddIcon />}
                onClick={() => navigate("/addproducts")}
              />,
              <BottomNavigationAction
                key="orders"
                label="Orders"
                icon={<ListAltIcon />}
                onClick={() => navigate("/admin/orders")}
              />,
            ]
          : [
              <BottomNavigationAction
                key="cart"
                label="Cart"
                icon={
                  <Badge
                    badgeContent={cartItems.length}
                    color="error"
                    max={99}
                    sx={{
                      "& .MuiBadge-badge": {
                        fontSize: "0.7rem",
                        height: "18px",
                        minWidth: "18px",
                      },
                    }}
                  >
                    <ShoppingCartIcon />
                  </Badge>
                }
                onClick={() => navigate("/cart")}
              />,
              token ? (
                <BottomNavigationAction
                  key="orders"
                  label="Orders"
                  icon={<LocalShippingIcon />}
                  onClick={() => navigate("/account/orders")}
                />
              ) : (
                <BottomNavigationAction
                  key="login"
                  label="Login"
                  icon={<LoginIcon />}
                  onClick={() => navigate("/signIn")}
                />
              ),
            ]}
      </BottomNavigation>
    </Paper>
  );
};

export default MobileFooter;
