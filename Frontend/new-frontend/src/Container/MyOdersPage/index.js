import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  IconButton,
  Divider,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

import { listMyOrders, cancelMyOrder } from "../../Actions/order.actions";
import Header from "../header";

const MyOrdersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { orders, loading } = useSelector((state) => state.orderMyList);
  const { success: successCancel } = useSelector(
    (state) => state.orderCancel || {},
  );

  useEffect(() => {
    dispatch(listMyOrders());
  }, [dispatch, successCancel]);

  const getOrderTotal = (order) => {
    return order.totalAmount || order.totalPrice || order.amount || 0;
  };

  const handleCancelOrder = (orderId) => {
    if (
      window.confirm(
        "Are you sure you want to cancel this order? This will refund the items to stock.",
      )
    ) {
      dispatch(cancelMyOrder(orderId));
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "success";
      case "shipped":
        return "info";
      case "cancelled":
        return "error";
      case "processing":
      case "packed":
      case "ordered":
        return "warning";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#f9fafb" }}>
        <Header />
        <Box
          sx={{
            minHeight: "80vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" color="text.secondary">
            Loading your orders...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f9fafb" }}>
      <Header />
      <Container maxWidth="lg" sx={{ py: 6, minHeight: "85vh" }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 5 }}>
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              bgcolor: "#fff",
              boxShadow: 1,
              "&:hover": { bgcolor: "#f0f0f0" },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h4" fontWeight="800" color="#0f2a1d">
              My Orders
            </Typography>
            <Typography variant="body2" color="text.secondary">
              View and track your past purchases
            </Typography>
          </Box>
        </Stack>

        {orders && orders.length > 0 ? (
          <Grid container spacing={2} sx={{ justifyContent: "center" }}>
            {orders.map((order) => (
              <Grid item xs={12} md={6} lg={4} key={order._id}>
                <Card
                  sx={{
                    borderRadius: "16px",
                    border: "1px solid #e0e0e0",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
                      borderColor: "#0f2a1d",
                    },
                  }}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 2,
                      }}
                    >
                      <Box>
                        <Typography
                          variant="overline"
                          color="text.secondary"
                          fontWeight="bold"
                          display="block"
                          lineHeight={1}
                        >
                          ORDER ID
                        </Typography>
                        <Typography variant="h6" fontWeight="bold">
                          #{order._id.substring(0, 8).toUpperCase()}
                        </Typography>
                      </Box>
                      <Chip
                        label={order.orderStatus || "Pending"}
                        color={getStatusColor(order.orderStatus)}
                        variant={
                          order.orderStatus === "delivered"
                            ? "filled"
                            : "outlined"
                        }
                        size="small"
                        sx={{
                          fontWeight: "bold",
                          textTransform: "capitalize",
                        }}
                      />
                    </Box>

                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      mb={2}
                    >
                      <AccessTimeIcon
                        sx={{ fontSize: 16, color: "text.secondary" }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString(
                              undefined,
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )
                          : "Date N/A"}
                      </Typography>
                    </Stack>

                    <Divider sx={{ my: 2, borderStyle: "dashed" }} />

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Total Amount
                        </Typography>
                        <Typography
                          variant="h6"
                          fontWeight="800"
                          color="#0f2a1d"
                        >
                          ₦{getOrderTotal(order).toLocaleString()}
                        </Typography>
                      </Box>

                      <Stack direction="row" spacing={1}>
                        {(order.orderStatus === "ordered" ||
                          order.orderStatus === "packed") && (
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => handleCancelOrder(order._id)}
                            sx={{
                              borderRadius: "8px",
                              textTransform: "none",
                              borderColor: "#d32f2f",
                            }}
                          >
                            Cancel
                          </Button>
                        )}

                        <Button
                          variant="contained"
                          size="small"
                          endIcon={<ArrowForwardIcon />}
                          onClick={() => navigate(`track-order/${order._id}`)}
                          sx={{
                            bgcolor: "#0f2a1d",
                            color: "#fff",
                            borderRadius: "8px",
                            textTransform: "none",
                            boxShadow: "none",
                            px: 2,
                            "&:hover": {
                              bgcolor: "#1a4d35",
                              boxShadow: "0 4px 12px rgba(15, 42, 29, 0.2)",
                            },
                          }}
                        >
                          Details
                        </Button>
                      </Stack>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box
            sx={{
              textAlign: "center",
              py: 10,
              bgcolor: "#fff",
              borderRadius: "24px",
              border: "1px dashed #ccc",
            }}
          >
            <ShoppingBagOutlinedIcon
              sx={{ fontSize: 80, color: "#ccc", mb: 2 }}
            />
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              No orders yet
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ mb: 4, maxWidth: 400, mx: "auto" }}
            >
              Looks like you haven't made your choice yet. Explore our
              collection and find something you love.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/")}
              sx={{
                bgcolor: "#0f2a1d",
                borderRadius: "50px",
                px: 5,
                py: 1.5,
                "&:hover": { bgcolor: "#1a4d35" },
              }}
            >
              Start Shopping
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default MyOrdersPage;
