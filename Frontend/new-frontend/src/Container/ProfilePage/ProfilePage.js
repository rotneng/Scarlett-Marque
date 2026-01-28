import React, { useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  Button,
  Grid,
  Divider,
  Stack,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import Header from "../header";

const PRIMARY_COLOR = "#0f2a1d";

const ProfilePage = () => {
  const navigate = useNavigate();

  const userString = localStorage.getItem("user");
  let user = null;
  try {
    user = userString ? JSON.parse(userString) : null;
  } catch (error) {
    console.error("Error parsing user from localstorage", error);
    user = null;
  }

  const isAdmin = user && user.role === "admin";

  useEffect(() => {
    if (!userString) {
      navigate("/signIn");
    }
  }, [userString, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/signIn";
  };

  const getInitials = (name) => (name ? name.charAt(0).toUpperCase() : "U");

  if (!user) return null;

  return (
    <Box sx={{ bgcolor: "#f5f7fa", minHeight: "100vh" }}>
      <Header />

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography
          variant="h4"
          sx={{ mb: 4, fontWeight: "bold", color: "#333" }}
        >
          My Account
        </Typography>

        <Grid container spacing={4} sx={{ justifyContent: "center" }}>
          <Grid item xs={12} md={4} lg={3}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                borderRadius: "24px",
                border: "1px solid #eee",
                bgcolor: "white",
                position: "sticky",
                top: 100,
              }}
            >
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: PRIMARY_COLOR,
                  fontSize: "2.5rem",
                  mb: 2,
                  boxShadow: "0 8px 16px rgba(15, 42, 29, 0.2)",
                }}
              >
                {getInitials(user.username)}
              </Avatar>

              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {user.username}
              </Typography>

              <Typography variant="body2" color="text.secondary" gutterBottom>
                {user.email}
              </Typography>

              {isAdmin && (
                <Chip
                  icon={<AdminPanelSettingsIcon fontSize="small" />}
                  label="Administrator"
                  color="primary"
                  size="small"
                  sx={{ mt: 1, mb: 3, fontWeight: "bold" }}
                />
              )}

              <Divider sx={{ width: "100%", my: 3 }} />

              <Button
                variant="outlined"
                color="error"
                startIcon={<LogoutIcon />}
                fullWidth
                onClick={handleLogout}
                sx={{
                  borderRadius: "50px",
                  textTransform: "none",
                  fontWeight: "bold",
                }}
              >
                Sign Out
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} md={8} lg={9}>
            <Stack spacing={3}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Paper
                    elevation={0}
                    onClick={() => navigate("/account/orders")}
                    sx={{
                      p: 3,
                      borderRadius: "24px",
                      border: "1px solid #eee",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 12px 24px rgba(0,0,0,0.05)",
                        borderColor: PRIMARY_COLOR,
                      },
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mb: 2 }}
                    >
                      <Box
                        sx={{
                          p: 1.5,
                          bgcolor: "#e3f2fd",
                          borderRadius: "12px",
                          color: "#1976d2",
                        }}
                      >
                        <ShoppingBagIcon />
                      </Box>
                      <ArrowForwardIcon sx={{ color: "text.secondary" }} />
                    </Stack>
                    <Typography variant="h6" fontWeight="bold">
                      My Orders
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      View, track, and manage your orders.
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Paper
                    elevation={0}
                    onClick={() =>
                      navigate("/manageAddress", {
                        state: { previousUrl: "/account" },
                      })
                    }
                    sx={{
                      p: 3,
                      borderRadius: "24px",
                      border: "1px solid #eee",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 12px 24px rgba(0,0,0,0.05)",
                        borderColor: PRIMARY_COLOR,
                      },
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mb: 2 }}
                    >
                      <Box
                        sx={{
                          p: 1.5,
                          bgcolor: "#e8f5e9",
                          borderRadius: "12px",
                          color: "#2e7d32",
                        }}
                      >
                        <LocationOnIcon />
                      </Box>
                      <ArrowForwardIcon sx={{ color: "text.secondary" }} />
                    </Stack>
                    <Typography variant="h6" fontWeight="bold">
                      Address Book
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Manage shipping addresses for checkout.
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProfilePage;
