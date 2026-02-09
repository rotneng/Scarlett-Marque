import React, { useEffect, useMemo, useState } from "react";
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
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FilterListIcon from "@mui/icons-material/FilterList";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility"; 
import CloseIcon from "@mui/icons-material/Close";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import Header from "../header";

const PRIMARY_COLOR = "#0f2a1d";
const BG_COLOR = "#f4f6f8";

const STATUS_CONFIG = {
  ordered: { bg: "#e3f2fd", color: "#1565c0", text: "Ordered", icon: null },
  packed: { bg: "#f3e5f5", color: "#7b1fa2", text: "Packed", icon: null },
  shipped: {
    bg: "#fff3e0",
    color: "#e65100",
    text: "Shipped",
    icon: LocalShippingIcon,
  },
  delivered: {
    bg: "#e8f5e9",
    color: "#2e7d32",
    text: "Delivered",
    icon: CheckCircleIcon,
  },
  issue_reported: {
    bg: "#fff8e1",
    color: "#f57c00",
    text: "Issue",
    icon: ReportProblemIcon,
  },
  cancelled: {
    bg: "#ffebee",
    color: "#c62828",
    text: "Cancelled",
    icon: CancelIcon,
  },
  default: { bg: "#f5f5f5", color: "#616161", text: "Unknown", icon: null },
};

const getStatusStyle = (status) =>
  STATUS_CONFIG[status] || STATUS_CONFIG.default;

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount || 0);
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const OrderDetailsDialog = ({ open, onClose, order }) => {
  if (!order) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ borderBottom: "1px solid #eee", pb: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="bold">
            Order Details #{order._id.substring(0, 8)}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ pt: 3, bgcolor: "#fafafa" }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 3, height: "100%", borderRadius: 3 }}>
              <Typography
                variant="subtitle2"
                fontWeight="bold"
                textTransform="uppercase"
                color="text.secondary"
                mb={2}
              >
                Customer Information
              </Typography>

              <Stack spacing={2}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: PRIMARY_COLOR }}>
                    <PersonIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {order.user?.username || order.user?.name || "Guest"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      User ID: {order.user?._id || "N/A"}
                    </Typography>
                  </Box>
                </Box>

                <Divider />

                <Box display="flex" alignItems="flex-start" gap={2}>
                  <EmailIcon color="action" fontSize="small" sx={{ mt: 0.5 }} />
                  <Typography variant="body2">
                    {order.user?.email || "No Email Provided"}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="flex-start" gap={2}>
                  <PhoneIcon color="action" fontSize="small" sx={{ mt: 0.5 }} />
                  <Typography variant="body2">
                    {order.shippingAddress?.phone ||
                      order.shippingAddress?.phoneNumber ||
                      "No Phone Provided"}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="flex-start" gap={2}>
                  <LocationOnIcon
                    color="action"
                    fontSize="small"
                    sx={{ mt: 0.5 }}
                  />
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      Shipping Address:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {order.shippingAddress?.address},{" "}
                      {order.shippingAddress?.city}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {order.shippingAddress?.postalCode},{" "}
                      {order.shippingAddress?.country}
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 3, height: "100%", borderRadius: 3 }}>
              <Typography
                variant="subtitle2"
                fontWeight="bold"
                textTransform="uppercase"
                color="text.secondary"
                mb={2}
              >
                Order Summary
              </Typography>

              <Stack spacing={2}>
                {order.orderItems?.map((item, index) => (
                  <Box
                    key={index}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar
                        variant="rounded"
                        src={item.image}
                        alt={item.name}
                        sx={{ width: 50, height: 50 }}
                      >
                        <ShoppingBagIcon />
                      </Avatar>
                      <Box>
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          sx={{
                            maxWidth: 150,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Qty: {item.qty || item.quantity}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" fontWeight="bold">
                      {formatCurrency(item.price * (item.qty || item.quantity))}
                    </Typography>
                  </Box>
                ))}

                <Divider sx={{ my: 2 }} />

                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body1">Total</Typography>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color={PRIMARY_COLOR}
                  >
                    {formatCurrency(order.totalAmount || order.totalPrice)}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const RenderPaymentStatus = ({ order }) => {
  if (order.isPaid) {
    return (
      <Chip
        label="PAID"
        color="success"
        size="small"
        variant="filled"
        sx={{ fontWeight: 700, borderRadius: "6px", minWidth: 60 }}
      />
    );
  }
  const method = order.paymentMethod?.toLowerCase();
  if (method === "cod" || method === "pay on delivery") {
    return (
      <Chip
        label="COD"
        color="warning"
        size="small"
        variant="outlined"
        sx={{ fontWeight: 700, borderRadius: "6px", minWidth: 60 }}
      />
    );
  }
  return (
    <Chip
      label="UNPAID"
      color="error"
      size="small"
      variant="outlined"
      sx={{ fontWeight: 700, borderRadius: "6px", minWidth: 60 }}
    />
  );
};

const RenderOrderStatusBadge = ({ status }) => {
  const style = getStatusStyle(status);
  const Icon = style.icon;
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
        whiteSpace: "nowrap",
      }}
    >
      {Icon && <Icon sx={{ fontSize: 14, mr: 0.5 }} />}
      {style.text}
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

const MobileOrderCard = ({ order, onStatusChange, onViewDetails }) => {
  const isIssue = order.orderStatus === "issue_reported";
  const isCancelled = order.orderStatus === "cancelled";
  const statusStyle = getStatusStyle(order.orderStatus);

  return (
    <Paper
      elevation={0}
      sx={{
        mb: 2,
        p: 2,
        borderRadius: 3,
        border: isIssue
          ? "1px solid #ffb74d"
          : isCancelled
            ? "1px solid #ef5350"
            : "1px solid #e0e0e0",
        bgcolor: isCancelled ? "#fafafa" : "white",
        position: "relative",
        overflow: "hidden",
        opacity: isCancelled ? 0.8 : 1,
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
        alignItems="flex-start"
        mb={2}
        pl={1.5}
      >
        <Box>
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            gutterBottom
          >
            Order ID
          </Typography>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            fontFamily="monospace"
            sx={{
              letterSpacing: 1,
              textDecoration: isCancelled ? "line-through" : "none",
            }}
          >
            #{order._id.substring(0, 8)}
          </Typography>
        </Box>
        <Box textAlign="right">
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            gutterBottom
          >
            Total Amount
          </Typography>
          <Typography variant="h6" fontWeight="800" color={PRIMARY_COLOR}>
            {formatCurrency(order.totalAmount || order.totalPrice)}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 2, borderStyle: "dashed" }} />

      <Stack direction="row" spacing={2} alignItems="center" mb={2} pl={1.5}>
        <Avatar
          sx={{
            bgcolor: isCancelled ? "#ffebee" : "#e0f2f1",
            color: isCancelled ? "error.main" : PRIMARY_COLOR,
          }}
        >
          <PersonIcon />
        </Avatar>
        <Box>
          <Typography variant="subtitle2" fontWeight="bold">
            {order.user?.username || order.user?.firstName || "Guest User"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatDate(order.createdAt)} • {order.paymentMethod}
          </Typography>
        </Box>
      </Stack>

      <Box
        bgcolor="#f9fafb"
        mx={-2}
        mb={-2}
        p={2}
        borderTop="1px solid #f0f0f0"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <RenderOrderStatusBadge status={order.orderStatus} />

        <Stack direction="row" spacing={1}>
          <IconButton
            size="small"
            onClick={() => onViewDetails(order)}
            sx={{
              bgcolor: "white",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
            }}
          >
            <VisibilityIcon fontSize="small" color="primary" />
          </IconButton>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={order.orderStatus}
              onChange={(e) => onStatusChange(order._id, e.target.value)}
              disabled={isCancelled}
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

const StatCard = ({ title, value, icon, color, bg, subtitle }) => (
  <Card
    elevation={0}
    sx={{
      borderRadius: "16px",
      border: "none",
      boxShadow: "0px 10px 30px rgba(0,0,0,0.04)",
      height: "100%",
      transition: "transform 0.2s ease-in-out",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0px 15px 35px rgba(0,0,0,0.06)",
      },
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" spacing={2} mb={2}>
        <Avatar
          variant="rounded"
          sx={{
            bgcolor: bg,
            color: color,
            width: 48,
            height: 48,
            borderRadius: "12px",
          }}
        >
          {icon}
        </Avatar>
        <Typography
          variant="subtitle2"
          fontWeight="700"
          color="text.secondary"
          sx={{ textTransform: "uppercase", letterSpacing: "1px" }}
        >
          {title}
        </Typography>
      </Stack>

      <Typography
        variant="h4"
        fontWeight="800"
        sx={{
          color: "#0f2a1d",
          fontFamily: "'Roboto', sans-serif",
          ml: 0.5,
        }}
      >
        {value}
      </Typography>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mt: 1, display: "block", ml: 0.5 }}
      >
        {subtitle}
      </Typography>
    </CardContent>
  </Card>
);

const AdminOrdersPage = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [openDetails, setOpenDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { orders = [], loading } = useSelector(
    (state) => state.orderList || {},
  );

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

  const handleOpenDetails = (order) => {
    setSelectedOrder(order);
    setOpenDetails(true);
  };

  const handleCloseDetails = () => {
    setOpenDetails(false);
    setTimeout(() => setSelectedOrder(null), 200);
  };

  const stats = useMemo(() => {
    if (!orders || orders.length === 0)
      return { total: 0, revenue: 0, issues: 0 };
    return {
      total: orders.length,
      revenue: orders.reduce((acc, order) => {
        if (order.orderStatus === "cancelled") return acc;
        return acc + (order.totalAmount || order.totalPrice || 0);
      }, 0),
      issues: orders.filter((o) => o.orderStatus === "issue_reported").length,
    };
  }, [orders]);

  return (
    <Box sx={{ bgcolor: BG_COLOR, minHeight: "100vh" }}>
      <Header />

      <OrderDetailsDialog
        open={openDetails}
        onClose={handleCloseDetails}
        order={selectedOrder}
      />

      <Container maxWidth="xl" sx={{ pt: 4, pb: 8 }}>
        <Box
          mb={4}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
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
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Chip
                icon={<CalendarTodayIcon sx={{ fontSize: 16 }} />}
                label={new Date().toLocaleDateString("en-GB", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
                sx={{
                  bgcolor: "white",
                  fontWeight: 600,
                  boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                }}
              />
            </Box>
            <Tooltip title="Filter Orders (Coming Soon)">
              <IconButton sx={{ bgcolor: "white" }}>
                <FilterListIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>

        {!loading && (
          <Grid container spacing={3} mb={5}>
            <Grid item xs={12} md={4}>
              <StatCard
                title="Total Orders"
                value={stats.total}
                icon={<ShoppingBagIcon />}
                color="#1976d2"
                bg="#e3f2fd"
                subtitle="All time orders"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StatCard
                title="Total Revenue"
                value={formatCurrency(stats.revenue)}
                icon={<AttachMoneyIcon />}
                color="#2e7d32"
                bg="#e8f5e9"
                subtitle="Excluding cancelled"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StatCard
                title="Active Issues"
                value={stats.issues}
                icon={<ReportProblemIcon />}
                color="#d32f2f"
                bg="#ffebee"
                subtitle="Requires attention"
              />
            </Grid>
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
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <MobileOrderCard
                      key={order._id}
                      order={order}
                      onStatusChange={onStatusChange}
                      onViewDetails={handleOpenDetails}
                    />
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
                  <Table sx={{ minWidth: 900 }}>
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
                      {orders.length > 0 ? (
                        orders.map((order) => {
                          const isIssue =
                            order.orderStatus === "issue_reported";
                          const isCancelled = order.orderStatus === "cancelled";

                          return (
                            <TableRow
                              key={order._id}
                              hover
                              sx={{
                                transition: "all 0.2s",
                                bgcolor: isIssue
                                  ? "#fff8e1"
                                  : isCancelled
                                    ? "#fafafa"
                                    : "inherit",
                                opacity: isCancelled ? 0.6 : 1,
                              }}
                            >
                              <TableCell>
                                <Typography
                                  variant="body2"
                                  fontFamily="monospace"
                                  fontWeight="bold"
                                  color="text.primary"
                                  sx={{
                                    textDecoration: isCancelled
                                      ? "line-through"
                                      : "none",
                                  }}
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
                                      width: 32,
                                      height: 32,
                                      fontSize: "0.85rem",
                                      bgcolor: isCancelled
                                        ? "#bdbdbd"
                                        : PRIMARY_COLOR,
                                    }}
                                  >
                                    {(order.user?.username || "G")
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
                                      {order.user?.email || "No Email"}
                                    </Typography>
                                  </Box>
                                </Stack>
                              </TableCell>

                              <TableCell>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {formatDate(order.createdAt)}
                                </Typography>
                              </TableCell>

                              <TableCell>
                                <Typography fontWeight="700" color="#333">
                                  {formatCurrency(
                                    order.totalAmount || order.totalPrice,
                                  )}
                                </Typography>
                              </TableCell>

                              <TableCell>
                                <RenderPaymentStatus order={order} />
                              </TableCell>

                              <TableCell>
                                <RenderOrderStatusBadge
                                  status={order.orderStatus}
                                />
                              </TableCell>

                              <TableCell>
                                <Stack
                                  direction="row"
                                  spacing={1}
                                  alignItems="center"
                                >
                                  <Tooltip title="View Order Details">
                                    <IconButton
                                      onClick={() => handleOpenDetails(order)}
                                      size="small"
                                      sx={{
                                        bgcolor: "#f5f5f5",
                                        "&:hover": { bgcolor: "#e0e0e0" },
                                      }}
                                    >
                                      <VisibilityIcon
                                        fontSize="small"
                                        color="primary"
                                      />
                                    </IconButton>
                                  </Tooltip>

                                  <FormControl
                                    size="small"
                                    fullWidth
                                    sx={{ maxWidth: 140 }}
                                  >
                                    <Select
                                      value={order.orderStatus}
                                      onChange={(e) =>
                                        onStatusChange(
                                          order._id,
                                          e.target.value,
                                        )
                                      }
                                      disabled={isCancelled}
                                      sx={{
                                        fontSize: "0.85rem",
                                        bgcolor: "white",
                                        borderRadius: "8px",
                                        height: 35,
                                        "& .MuiOutlinedInput-notchedOutline": {
                                          borderColor: "#e0e0e0",
                                        },
                                        "&:hover .MuiOutlinedInput-notchedOutline":
                                          {
                                            borderColor: PRIMARY_COLOR,
                                          },
                                        "&.Mui-disabled": {
                                          bgcolor: "#f5f5f5",
                                        },
                                      }}
                                    >
                                      <MenuItem value="ordered">
                                        Ordered
                                      </MenuItem>
                                      <MenuItem value="packed">Packed</MenuItem>
                                      <MenuItem value="shipped">
                                        Shipped
                                      </MenuItem>
                                      <MenuItem value="delivered">
                                        Delivered
                                      </MenuItem>
                                      <Divider />
                                      <MenuItem
                                        value="issue_reported"
                                        disabled
                                        sx={{ color: "error.main" }}
                                      >
                                        Issue Reported
                                      </MenuItem>
                                    </Select>
                                  </FormControl>
                                </Stack>
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

export default AdminOrdersPage;
