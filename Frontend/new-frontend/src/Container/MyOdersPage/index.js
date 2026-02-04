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
  Paper,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

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
      <Box sx={{ minHeight: "100vh", bgcolor: "#f8f9fa" }}>
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
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8f9fa" }}>
      <Header />
      <Container maxWidth="lg" sx={{ py: 8, minHeight: "85vh" }}>
        <Stack direction="row" alignItems="center" spacing={3} sx={{ mb: 6 }}>
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              bgcolor: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              border: "1px solid #eaeaea",
              width: 48,
              height: 48,
              "&:hover": { bgcolor: "#f5f5f5", transform: "translateX(-2px)" },
              transition: "all 0.2s",
            }}
          >
            <ArrowBackIcon fontSize="small" />
          </IconButton>
          <Box>
            <Typography variant="h4" fontWeight="800" color="#0f2a1d" mb={0.5}>
              My Orders
            </Typography>
            <Typography variant="body1" color="text.secondary">
              View and track your past purchases
            </Typography>
          </Box>
        </Stack>

        {orders && orders.length > 0 ? (
          <Grid container spacing={4} sx={{ justifyContent: "center" }}>
            {orders.map((order) => (
              <Grid item xs={12} md={6} lg={4} key={order._id}>
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: "20px",
                    border: "1px solid rgba(0,0,0,0.04)",
                    boxShadow: "0 10px 40px -10px rgba(0,0,0,0.08)",
                    transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                    display: "flex",
                    flexDirection: "column",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 20px 50px -12px rgba(15, 42, 29, 0.2)",
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      p: 4,
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      "&:last-child": { pb: 3 },
                    }}
                  >
                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 3,
                        }}
                      >
                        <Stack direction="row" spacing={1.5}>
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: "12px",
                              bgcolor: "#f0f7f4",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#0f2a1d",
                            }}
                          >
                            <ReceiptLongIcon fontSize="small" />
                          </Box>
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              fontWeight="600"
                              display="block"
                              letterSpacing={0.5}
                            >
                              ORDER ID
                            </Typography>
                            <Typography
                              variant="subtitle1"
                              fontWeight="800"
                              sx={{ fontFamily: "monospace", letterSpacing: 2 }}
                            >
                              #{order._id.substring(0, 6).toUpperCase()}
                            </Typography>
                          </Box>
                        </Stack>

                        <Chip
                          label={order.orderStatus || "Pending"}
                          color={getStatusColor(order.orderStatus)}
                          size="small"
                          sx={{
                            fontWeight: "700",
                            textTransform: "capitalize",
                            borderRadius: "8px",
                            height: 28,
                            px: 1,
                          }}
                        />
                      </Box>

                      <Paper
                        elevation={0}
                        sx={{
                          bgcolor: "#f8f9fa",
                          py: 1.5,
                          px: 2,
                          borderRadius: "12px",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 1.5,
                          mb: 2,
                          width: "100%",
                          boxSizing: "border-box",
                        }}
                      >
                        <AccessTimeIcon
                          sx={{ fontSize: 18, color: "text.secondary" }}
                        />
                        <Box>
                          <Typography
                            variant="caption"
                            display="block"
                            color="text.secondary"
                            lineHeight={1}
                            mb={0.3}
                          >
                            Order Date
                          </Typography>
                          <Typography
                            variant="body2"
                            fontWeight="500"
                            color="text.primary"
                          >
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
                        </Box>
                      </Paper>
                    </Box>

                    <Box>
                      <Divider
                        sx={{
                          my: 3,
                          borderStyle: "dashed",
                          borderColor: "#e0e0e0",
                        }}
                      />

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-end",
                        }}
                      >
                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            fontWeight="500"
                          >
                            Total Amount
                          </Typography>
                          <Typography
                            variant="h5"
                            fontWeight="800"
                            color="#0f2a1d"
                            sx={{ lineHeight: 1 }}
                          >
                            ₦{getOrderTotal(order).toLocaleString()}
                          </Typography>
                        </Box>

                        <Stack direction="row" spacing={1.5}>
                          {(order.orderStatus === "ordered" ||
                            order.orderStatus === "packed") && (
                            <IconButton
                              size="small"
                              onClick={() => handleCancelOrder(order._id)}
                              sx={{
                                border: "1px solid #ffebee",
                                color: "#d32f2f",
                                borderRadius: "10px",
                                p: 1,
                                "&:hover": {
                                  bgcolor: "#ffebee",
                                  borderColor: "#d32f2f",
                                },
                              }}
                              title="Cancel Order"
                            >
                              <Typography
                                variant="caption"
                                fontWeight="bold"
                                px={1}
                              >
                                Cancel
                              </Typography>
                            </IconButton>
                          )}

                          <Button
                            variant="contained"
                            endIcon={<ArrowForwardIcon fontSize="small" />}
                            onClick={() => navigate(`track-order/${order._id}`)}
                            sx={{
                              bgcolor: "#0f2a1d",
                              color: "#fff",
                              borderRadius: "10px",
                              textTransform: "none",
                              boxShadow: "0 4px 14px rgba(15, 42, 29, 0.3)",
                              px: 3,
                              py: 1,
                              fontWeight: "600",
                              "&:hover": {
                                bgcolor: "#1a4d35",
                                transform: "translateY(-1px)",
                                boxShadow: "0 6px 20px rgba(15, 42, 29, 0.4)",
                              },
                            }}
                          >
                            Details
                          </Button>
                        </Stack>
                      </Box>
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
              py: 15,
              bgcolor: "#fff",
              borderRadius: "32px",
              boxShadow: "0 10px 40px -10px rgba(0,0,0,0.05)",
            }}
          >
            <ShoppingBagOutlinedIcon
              sx={{ fontSize: 80, color: "#e0e0e0", mb: 3 }}
            />
            <Typography
              variant="h4"
              fontWeight="800"
              gutterBottom
              color="#0f2a1d"
            >
              No orders yet
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ mb: 5, maxWidth: 450, mx: "auto", fontSize: "1.1rem" }}
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
                px: 6,
                py: 1.8,
                fontSize: "1rem",
                fontWeight: "bold",
                boxShadow: "0 10px 30px rgba(15, 42, 29, 0.25)",
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
