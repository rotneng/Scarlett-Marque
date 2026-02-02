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
  useTheme,
  useMediaQuery,
} from "@mui/material";

import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Header from "../header";

const PRIMARY_COLOR = "#0f2a1d";
const BG_COLOR = "#f4f6f8";

const AdminOrdersPage = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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
        0,
      ),
      issues: orders.filter((o) => o.orderStatus === "issue_reported").length,
    };
  }, [orders]);

  const renderPaymentStatus = (order) => {
    if (order.isPaid) {
      return (
        <Chip
          label="PAID"
          color="success"
          size="small"
          variant="filled"
          sx={{ fontWeight: 700, borderRadius: "6px" }}
        />
      );
    }
    if (
      order.paymentMethod === "COD" ||
      order.paymentMethod === "Pay on Delivery"
    ) {
      return (
        <Chip
          label="COD"
          color="warning"
          size="small"
          variant="outlined"
          sx={{ fontWeight: 700, borderRadius: "6px" }}
        />
      );
    }
    return (
      <Chip
        label="UNPAID"
        color="error"
        size="small"
        variant="outlined"
        sx={{ fontWeight: 700, borderRadius: "6px" }}
      />
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "ordered":
        return { bg: "#e3f2fd", color: "#1565c0", text: "Ordered" };
      case "packed":
        return { bg: "#f3e5f5", color: "#7b1fa2", text: "Packed" };
      case "shipped":
        return { bg: "#fff3e0", color: "#e65100", text: "Shipped" };
      case "delivered":
        return { bg: "#e8f5e9", color: "#2e7d32", text: "Delivered" };
      case "issue_reported":
        return { bg: "#ffebee", color: "#c62828", text: "Issue" };
      default:
        return { bg: "#f5f5f5", color: "#616161", text: status };
    }
  };

  const renderOrderStatusBadge = (status) => {
    const style = getStatusColor(status);
    return (
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          px: 1.5,
          py: 0.5,
          borderRadius: "20px",
          bgcolor: style.bg,
          color: style.color,
          fontSize: "0.75rem",
          fontWeight: 700,
          textTransform: "uppercase",
          border: `1px solid ${style.bg}`,
        }}
      >
        {status === "issue_reported" && (
          <ReportProblemIcon sx={{ fontSize: 14, mr: 0.5 }} />
        )}
        {status === "delivered" && (
          <CheckCircleIcon sx={{ fontSize: 14, mr: 0.5 }} />
        )}
        {status === "shipped" && (
          <LocalShippingIcon sx={{ fontSize: 14, mr: 0.5 }} />
        )}
        {style.text}
      </Box>
    );
  };

  const MobileOrderCard = ({ order }) => {
    const isIssue = order.orderStatus === "issue_reported";
    const statusStyle = getStatusColor(order.orderStatus);

    return (
      <Paper
        elevation={0}
        sx={{
          mb: 2,
          p: 2,
          borderRadius: 3,
          border: isIssue ? "1px solid #ef5350" : "1px solid #e0e0e0",
          bgcolor: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "6px",
            bgcolor: statusStyle.color,
          }}
        />

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
          pl={1}
        >
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              Order ID
            </Typography>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              fontFamily="monospace"
            >
              #{order._id.substring(0, 8)}
            </Typography>
          </Box>
          <Box textAlign="right">
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              Total Amount
            </Typography>
            <Typography variant="h6" fontWeight="800" color={PRIMARY_COLOR}>
              ₦{(order.totalAmount || order.totalPrice).toLocaleString()}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 2, borderStyle: "dashed" }} />

        <Stack direction="row" spacing={2} alignItems="center" mb={2} pl={1}>
          <Avatar
            sx={{
              bgcolor: isIssue ? "#ffebee" : "#e0f2f1",
              color: isIssue ? "error.main" : PRIMARY_COLOR,
            }}
          >
            <PersonIcon />
          </Avatar>
          <Box>
            <Typography variant="subtitle2" fontWeight="bold">
              {order.user?.username || order.user?.firstName || "Guest User"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(order.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </Typography>
          </Box>
        </Stack>

        <Box
          bgcolor="#f9fafb"
          mx={-2}
          mb={-2}
          p={2}
          borderTop="1px solid #f0f0f0"
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            {renderOrderStatusBadge(order.orderStatus)}

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={order.orderStatus}
                onChange={(e) => onStatusChange(order._id, e.target.value)}
                variant="standard"
                disableUnderline
                sx={{
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "text.primary",
                  "& .MuiSelect-select": { py: 0.5, pr: 2 },
                }}
                IconComponent={(props) => (
                  <ArrowForwardIosIcon {...props} style={{ fontSize: 12 }} />
                )}
              >
                <MenuItem value="ordered">Ordered</MenuItem>
                <MenuItem value="packed">Packed</MenuItem>
                <MenuItem value="shipped">Shipped</MenuItem>
                <MenuItem value="delivered">Delivered</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Box>
      </Paper>
    );
  };

  return (
    <Box sx={{ bgcolor: BG_COLOR, minHeight: "100vh" }}>
      <Header />

      <Container maxWidth="xl" sx={{ pt: 4, pb: 8 }}>
        <Box
          mb={4}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
        >
          <Box>
            <Typography
              variant="h4"
              fontWeight="800"
              sx={{ color: PRIMARY_COLOR, letterSpacing: "-0.5px" }}
            >
              Order Management
            </Typography>
            <Typography variant="body1" color="text.secondary" mt={0.5}>
              Track and manage all customer orders in one place.
            </Typography>
          </Box>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <Chip
              icon={<CalendarTodayIcon sx={{ fontSize: 16 }} />}
              label={new Date().toLocaleDateString()}
              sx={{ bgcolor: "white", fontWeight: 600 }}
            />
          </Box>
        </Box>

        {!loading && (
          <Grid container spacing={3} mb={5}>
            {[
              {
                title: "Total Orders",
                value: stats.total,
                icon: <ShoppingBagIcon />,
                color: "#1976d2", 
                bg: "#e3f2fd",
              },
              {
                title: "Total Revenue",
                value: `₦${stats.revenue.toLocaleString()}`,
                icon: <AttachMoneyIcon />,
                color: "#2e7d32", 
                bg: "#e8f5e9",
              },
              {
                title: "Active Issues",
                value: stats.issues,
                icon: <ReportProblemIcon />,
                color: "#d32f2f", 
                bg: "#ffebee",
              },
            ].map((stat, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0px 10px 30px rgba(0,0,0,0.04)",
                    height: "100%",
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      mb={2}
                    >
                      <Typography
                        variant="subtitle2"
                        fontWeight="700"
                        color="text.secondary"
                        sx={{
                          textTransform: "uppercase",
                          letterSpacing: "1px",
                        }}
                      >
                        {stat.title}
                      </Typography>

                      <Avatar
                        variant="rounded"
                        sx={{
                          bgcolor: stat.bg,
                          color: stat.color,
                          width: 48,
                          height: 48,
                          borderRadius: "12px",
                        }}
                      >
                        {stat.icon}
                      </Avatar>
                    </Stack>

                    <Typography
                      variant="h4"
                      fontWeight="800"
                      sx={{
                        color: "#0f2a1d",
                        fontFamily:
                          "'Roboto', 'Helvetica', 'Arial', sans-serif",
                      }}
                    >
                      {stat.value}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 1, display: "block" }}
                    >
                      {index === 0
                        ? "All time orders"
                        : index === 1
                          ? "Total earnings"
                          : "Requires attention"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="40vh"
          >
            <CircularProgress
              size={60}
              thickness={4}
              sx={{ color: PRIMARY_COLOR }}
            />
          </Box>
        ) : (
          <>
            {isMobile ? (
              <Box>
                {orders && orders.length > 0 ? (
                  orders.map((order) => (
                    <MobileOrderCard key={order._id} order={order} />
                  ))
                ) : (
                  <EmptyState />
                )}
              </Box>
            ) : (
              <Paper
                elevation={0}
                sx={{
                  borderRadius: "16px",
                  border: "1px solid rgba(0,0,0,0.08)",
                  boxShadow: "0px 4px 24px rgba(0,0,0,0.02)",
                  overflow: "hidden",
                }}
              >
                <TableContainer>
                  <Table sx={{ minWidth: 800 }}>
                    <TableHead>
                      <TableRow sx={{ bgcolor: "#fafafa" }}>
                        {[
                          "Order ID",
                          "Customer",
                          "Date",
                          "Amount",
                          "Payment",
                          "Status",
                          "Action",
                        ].map((head) => (
                          <TableCell
                            key={head}
                            sx={{
                              fontWeight: "700",
                              color: "text.secondary",
                              textTransform: "uppercase",
                              fontSize: "0.75rem",
                              letterSpacing: "0.5px",
                              py: 2.5,
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
                          const isIssue =
                            order.orderStatus === "issue_reported";
                          return (
                            <TableRow
                              key={order._id}
                              hover
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                                transition: "all 0.2s",
                                bgcolor: isIssue ? "#fff5f5" : "inherit",
                              }}
                            >
                              <TableCell>
                                <Typography
                                  variant="body2"
                                  fontFamily="monospace"
                                  fontWeight="bold"
                                >
                                  #{order._id.substring(0, 8)}
                                </Typography>
                              </TableCell>

                              <TableCell>
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  spacing={1.5}
                                >
                                  <Avatar
                                    sx={{
                                      width: 30,
                                      height: 30,
                                      fontSize: "0.8rem",
                                      bgcolor: PRIMARY_COLOR,
                                    }}
                                  >
                                    {(order.user?.username || "U")
                                      .charAt(0)
                                      .toUpperCase()}
                                  </Avatar>
                                  <Box>
                                    <Typography
                                      variant="body2"
                                      fontWeight="600"
                                    >
                                      {order.user?.username || "Guest"}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                    >
                                      {order.user?.email}
                                    </Typography>
                                  </Box>
                                </Stack>
                              </TableCell>

                              <TableCell>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {new Date(
                                    order.createdAt,
                                  ).toLocaleDateString()}
                                </Typography>
                              </TableCell>

                              <TableCell>
                                <Typography fontWeight="700" color="#333">
                                  ₦
                                  {(
                                    order.totalAmount || order.totalPrice
                                  ).toLocaleString()}
                                </Typography>
                              </TableCell>

                              <TableCell>
                                {renderPaymentStatus(order)}
                              </TableCell>

                              <TableCell>
                                {renderOrderStatusBadge(order.orderStatus)}
                              </TableCell>

                              <TableCell>
                                <FormControl
                                  size="small"
                                  fullWidth
                                  sx={{ maxWidth: 140 }}
                                >
                                  <Select
                                    value={order.orderStatus}
                                    onChange={(e) =>
                                      onStatusChange(order._id, e.target.value)
                                    }
                                    sx={{
                                      fontSize: "0.85rem",
                                      bgcolor: "white",
                                      borderRadius: "8px",
                                      "& .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "#e0e0e0",
                                      },
                                      "&:hover .MuiOutlinedInput-notchedOutline":
                                        {
                                          borderColor: PRIMARY_COLOR,
                                        },
                                    }}
                                  >
                                    <MenuItem value="ordered">Ordered</MenuItem>
                                    <MenuItem value="packed">Packed</MenuItem>
                                    <MenuItem value="shipped">Shipped</MenuItem>
                                    <MenuItem value="delivered">
                                      Delivered
                                    </MenuItem>
                                    <Divider />
                                    <MenuItem
                                      value="issue_reported"
                                      disabled
                                      sx={{
                                        color: "error.main",
                                        fontSize: "0.8rem",
                                      }}
                                    >
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
                          <TableCell
                            colSpan={7}
                            align="center"
                            sx={{ borderBottom: "none" }}
                          >
                            <EmptyState />
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

const EmptyState = () => (
  <Box py={8} display="flex" flexDirection="column" alignItems="center">
    <LocalShippingIcon sx={{ fontSize: 60, color: "#e0e0e0", mb: 2 }} />
    <Typography variant="h6" color="text.secondary" fontWeight="bold">
      No Orders Found
    </Typography>
    <Typography variant="body2" color="text.secondary">
      When customers place orders, they will appear here.
    </Typography>
  </Box>
);

export default AdminOrdersPage;
