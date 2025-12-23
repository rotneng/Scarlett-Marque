import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders, updateOrder } from "../../Actions/order.actions";
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  Chip,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Avatar,
  Stack,
  Divider,
} from "@mui/material";

import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PersonIcon from "@mui/icons-material/Person";

const AdminOrdersPage = () => {
  const dispatch = useDispatch();

  const orderList = useSelector((state) => state.orderList || {});
  const { orders, loading } = orderList;

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  const onStatusChange = (orderId, newStatus) => {
    const payload = {
      orderId: orderId,
      type: newStatus,
    };
    dispatch(updateOrder(payload));
  };

  const stats = useMemo(() => {
    if (!orders) return { total: 0, revenue: 0, issues: 0 };
    return {
      total: orders.length,
      revenue: orders.reduce(
        (acc, order) => acc + (order.totalAmount || order.totalPrice || 0),
        0
      ),
      issues: orders.filter((o) => o.orderStatus === "issue_reported").length,
    };
  }, [orders]);

  const renderPaymentStatus = (order) => {
    if (order.isPaid) {
      return (
        <Chip
          label="Paid"
          color="success"
          size="small"
          variant="filled"
          icon={<AttachMoneyIcon />}
        />
      );
    }
    if (
      order.paymentMethod === "COD" ||
      order.paymentMethod === "Pay on Delivery"
    ) {
      return (
        <Chip label="COD" color="warning" size="small" variant="outlined" />
      );
    }
    return (
      <Chip label="Unpaid" color="error" size="small" variant="outlined" />
    );
  };

  const renderOrderStatusChip = (status) => {
    let color = "default";
    let icon = null;

    switch (status) {
      case "ordered":
        color = "default";
        break;
      case "packed":
        color = "secondary";
        break;
      case "shipped":
        color = "info";
        icon = <LocalShippingIcon fontSize="small" />;
        break;
      case "delivered":
        color = "success";
        break;
      case "issue_reported":
        return (
          <Chip
            icon={<ReportProblemIcon />}
            label="ISSUE REPORTED"
            color="error"
            size="small"
            sx={{ fontWeight: "bold" }}
          />
        );
      default:
        color = "default";
    }

    return (
      <Chip
        label={status.toUpperCase()}
        color={color}
        size="small"
        icon={icon}
        sx={{ minWidth: "80px" }}
      />
    );
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 5, mb: 8 }}>
      <Box mb={5}>
        <Typography
          variant="h4"
          fontWeight="800"
          gutterBottom
          sx={{ color: "#0f2a1d" }}
        >
          Order Management
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          Overview of all customer orders and their delivery status.
        </Typography>

        {!loading && (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Card
                sx={{
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                }}
              >
                <CardContent
                  sx={{ display: "flex", alignItems: "center", gap: 2 }}
                >
                  <Avatar sx={{ bgcolor: "#e3f2fd", color: "#1976d2" }}>
                    <ShoppingCartIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Total Orders
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {stats.total}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card
                sx={{
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                }}
              >
                <CardContent
                  sx={{ display: "flex", alignItems: "center", gap: 2 }}
                >
                  <Avatar sx={{ bgcolor: "#e8f5e9", color: "#2e7d32" }}>
                    <AttachMoneyIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Total Revenue
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      ₦{stats.revenue.toLocaleString()}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card
                sx={{
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  border: stats.issues > 0 ? "1px solid red" : "none",
                }}
              >
                <CardContent
                  sx={{ display: "flex", alignItems: "center", gap: 2 }}
                >
                  <Avatar sx={{ bgcolor: "#ffebee", color: "#d32f2f" }}>
                    <ReportProblemIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Active Issues
                    </Typography>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      color={stats.issues > 0 ? "error" : "text.primary"}
                    >
                      {stats.issues}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={10} minHeight="40vh">
          <CircularProgress size={60} thickness={4} sx={{ color: "#0f2a1d" }} />
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            borderRadius: "16px",
            border: "1px solid #e0e0e0",
            overflow: "hidden",
            boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
          }}
        >
          <Table sx={{ minWidth: 700 }}>
            <TableHead sx={{ backgroundColor: "#f9fafb" }}>
              <TableRow>
                {[
                  "Order ID",
                  "Customer",
                  "Items",
                  "Amount",
                  "Payment",
                  "Current Status",
                  "Update Action",
                ].map((head) => (
                  <TableCell
                    key={head}
                    sx={{
                      fontWeight: "bold",
                      color: "#6b7280",
                      textTransform: "uppercase",
                      fontSize: "0.75rem",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {orders && orders.length > 0 ? (
                orders.map((order) => {
                  const isIssue = order.orderStatus === "issue_reported";
                  return (
                    <TableRow
                      key={order._id}
                      hover
                      sx={{
                        backgroundColor: isIssue ? "#fff5f5" : "inherit",
                        "&:hover": {
                          backgroundColor: isIssue
                            ? "#ffebeb !important"
                            : "#f5f5f5 !important",
                        },
                      }}
                    >
                      <TableCell>
                        <Typography
                          variant="body2"
                          fontFamily="monospace"
                          fontWeight="bold"
                          color="text.primary"
                        >
                          #{order._id.substring(0, 8)}...
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              fontSize: "14px",
                              bgcolor: isIssue ? "error.main" : "#0f2a1d",
                            }}
                          >
                            {order.user?.firstName ? (
                              order.user.firstName.charAt(0)
                            ) : (
                              <PersonIcon fontSize="small" />
                            )}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="500">
                              {order.user
                                ? `${order.user.firstName} ${
                                    order.user.lastName || ""
                                  }`
                                : "Deleted User"}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {order.orderItems.length}{" "}
                          {order.orderItems.length === 1 ? "Item" : "Items"}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography fontWeight="bold" color="#0f2a1d">
                          ₦
                          {(
                            order.totalAmount || order.totalPrice
                          ).toLocaleString()}
                        </Typography>
                      </TableCell>

                      <TableCell>{renderPaymentStatus(order)}</TableCell>

                      <TableCell>
                        {renderOrderStatusChip(order.orderStatus)}
                      </TableCell>

                      <TableCell>
                        <FormControl size="small" fullWidth>
                          <Select
                            value={order.orderStatus}
                            onChange={(e) =>
                              onStatusChange(order._id, e.target.value)
                            }
                            sx={{
                              fontSize: "13px",
                              backgroundColor: "white",
                              borderRadius: "8px",
                              height: "35px",
                              "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                {
                                  border: "2px solid #0f2a1d",
                                },
                            }}
                          >
                            <MenuItem value="ordered">Ordered</MenuItem>
                            <MenuItem value="packed">Packed</MenuItem>
                            <MenuItem value="shipped">Shipped</MenuItem>
                            <MenuItem value="delivered">Delivered</MenuItem>
                            <Divider />
                            <MenuItem
                              value="issue_reported"
                              disabled
                              sx={{
                                color: "error.main",
                                fontSize: "12px",
                                opacity: 0.7,
                              }}
                            >
                              <ReportProblemIcon
                                fontSize="inherit"
                                sx={{ mr: 1, verticalAlign: "middle" }}
                              />
                              Reported by User
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                    >
                      <LocalShippingIcon
                        sx={{ fontSize: 48, color: "#ccc", mb: 2 }}
                      />
                      <Typography variant="h6" color="text.secondary">
                        No orders found
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default AdminOrdersPage;
