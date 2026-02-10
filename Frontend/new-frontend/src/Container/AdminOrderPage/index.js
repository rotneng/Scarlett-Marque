import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders, updateOrder } from "../../Actions/order.actions";
import {
  Box,
  Container,
  Typography,
  Paper,
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
        sx={{ fontWeight: 700, borderRadius: "6px" }}
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

const OrderCard = ({ order, onStatusChange, onViewDetails }) => {
  const isCancelled = order.orderStatus === "cancelled";
  const statusStyle = getStatusStyle(order.orderStatus);

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column ",
        borderRadius: "16px",
        border: "1px solid rgba(0,0,0,0.08)",
        transition: "all 0.3s ease",
        opacity: isCancelled ? 0.7 : 1,
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
        },
      }}
    >
      <Box sx={{ height: "6px", bgcolor: statusStyle.color }} />

      <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={2}
        >
          <Box>
            <Typography variant="caption" color="text.secondary">
              Order ID
            </Typography>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              fontFamily="monospace"
              sx={{ textDecoration: isCancelled ? "line-through" : "none" }}
            >
              #{order._id.substring(0, 8)}
            </Typography>
          </Box>
          <RenderOrderStatusBadge status={order.orderStatus} />
        </Stack>

        <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: isCancelled ? "#eee" : "#e0f2f1",
              color: isCancelled ? "#999" : PRIMARY_COLOR,
            }}
          >
            {order.user?.username?.charAt(0).toUpperCase() || <PersonIcon />}
          </Avatar>
          <Box overflow="hidden">
            <Typography
              variant="subtitle2"
              fontWeight="bold"
              noWrap
              sx={{ maxWidth: "100%" }}
            >
              {order.user?.username || "Guest User"}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              {formatDate(order.createdAt)}
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ borderStyle: "dashed", my: 2 }} />

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <Typography variant="body2" color="text.secondary">
            Payment:
          </Typography>
          <RenderPaymentStatus order={order} />
        </Stack>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="body2" color="text.secondary">
            Total Amount:
          </Typography>
          <Typography variant="h6" fontWeight="800" color={PRIMARY_COLOR}>
            {formatCurrency(order.totalAmount || order.totalPrice)}
          </Typography>
        </Stack>
      </CardContent>

      <Box
        sx={{
          p: 2,
          bgcolor: "#f9fafb",
          borderTop: "1px solid #eee",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Tooltip title="View Details">
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
        </Tooltip>

        <FormControl size="small" fullWidth>
          <Select
            value={order.orderStatus}
            onChange={(e) => onStatusChange(order._id, e.target.value)}
            disabled={isCancelled}
            sx={{
              bgcolor: "white",
              borderRadius: "8px",
              height: 36,
              fontSize: "0.85rem",
              fontWeight: 600,
            }}
          >
            <MenuItem value="ordered">Ordered</MenuItem>
            <MenuItem value="packed">Packed</MenuItem>
            <MenuItem value="shipped">Shipped</MenuItem>
            <MenuItem value="delivered">Delivered</MenuItem>
            <Divider />
            <MenuItem value="cancelled" sx={{ color: "error.main" }}>
              Cancelled
            </MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Card>
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
      <Stack direction="row" alignItems="center" spacing={4} mb={2}>
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
          <Grid container spacing={3} mb={5} sx={{ justifyContent: "center" }}>
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
            {orders.length > 0 ? (
              <>
                <Grid container spacing={3} sx={{ justifyContent: "center" }}>
                  {orders.map((order) => (
                    <Grid item xs={12} md={6} lg={4} key={order._id}>
                      <OrderCard
                        order={order}
                        onStatusChange={onStatusChange}
                        onViewDetails={handleOpenDetails}
                      />
                    </Grid>
                  ))}
                </Grid>
              </>
            ) : (
              <Box
                py={8}
                display="flex"
                flexDirection="column"
                alignItems="center"
              >
                <LocalShippingIcon
                  sx={{ fontSize: 60, color: "#e0e0e0", mb: 2 }}
                />
                <Typography
                  variant="h6"
                  color="text.secondary"
                  fontWeight="bold"
                >
                  No Orders Found
                </Typography>
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default AdminOrdersPage;
