import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  getOrderDetails,
  confirmDelivery,
  reportOrderIssue,
} from "../../Actions/order.actions";
import {
  Box,
  Container,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  CircularProgress,
  Button,
  Grid,
  Divider,
  Alert,
  Avatar,
  Stack,
  Chip,
  Paper,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import InventoryIcon from "@mui/icons-material/Inventory";
import HomeIcon from "@mui/icons-material/Home";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const generatePublicUrl = (fileName) => {
  if (!fileName) return "";
  if (fileName.startsWith("http")) return fileName;
  return `http://localhost:2000/public/${fileName}`;
};

const steps = [
  { label: "Order Placed", icon: <InventoryIcon /> },
  { label: "Packed", icon: <InventoryIcon /> },
  { label: "Shipped", icon: <LocalShippingIcon /> },
  { label: "Delivered", icon: <HomeIcon /> },
];

const TrackOrderPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const auth = useSelector((state) => state.auth);
  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;

  useEffect(() => {
    if (id) {
      dispatch(getOrderDetails(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (order && order.orderItems) {
      console.log("DEBUG ORDER ITEMS:", order.orderItems);
    }
  }, [order]);

  const onConfirmDelivery = () => {
    if (
      window.confirm(
        "Are you sure you have received this order? This cannot be undone."
      )
    ) {
      dispatch(confirmDelivery(order._id));
    }
  };

  const onReportIssue = () => {
    if (
      window.confirm(
        "Has the order NOT arrived? We will notify the admin immediately."
      )
    ) {
      dispatch(reportOrderIssue(order._id));
      alert("Admin has been notified.");
    }
  };

  const getActiveStep = (status, isDelivered) => {
    switch (status) {
      case "ordered":
        return 1;
      case "packed":
        return 2;
      case "shipped":
        return 3;
      case "delivered":
        return isDelivered ? 4 : 3;
      case "issue_reported":
        return 2;
      default:
        return 0;
    }
  };

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 10,
          minHeight: "80vh",
        }}
      >
        <CircularProgress size={60} thickness={4} sx={{ color: "#0f2a1d" }} />
      </Box>
    );

  if (error)
    return (
      <Container sx={{ mt: 5 }}>
        <Alert severity="error" variant="filled">
          {error}
        </Alert>
      </Container>
    );

  if (!order)
    return (
      <Container sx={{ mt: 5 }}>
        <Typography>Order not found.</Typography>
      </Container>
    );

  const activeStep = getActiveStep(order.orderStatus, order.isDelivered);
  const pendingConfirmation =
    order.orderStatus === "delivered" && !order.isDelivered;
  const isIssueReported = order.orderStatus === "issue_reported";

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/account/orders")}
          sx={{ color: "text.secondary", fontWeight: "bold" }}
        >
          Back
        </Button>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" fontWeight="800" sx={{ color: "#0f2a1d" }}>
            Track Order
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body1" color="text.secondary">
              ID: #{order._id?.substring(0, 10).toUpperCase()}
            </Typography>
            <Chip
              label={order.orderStatus || "Processing"}
              size="small"
              color={
                isIssueReported
                  ? "error"
                  : pendingConfirmation
                  ? "warning"
                  : "success"
              }
              variant="outlined"
              sx={{ fontWeight: "bold", textTransform: "capitalize" }}
            />
          </Stack>
        </Box>
      </Stack>

      <Card
        sx={{
          mb: 4,
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          overflow: "visible",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {isIssueReported && (
            <Alert
              severity="error"
              variant="filled"
              icon={<ReportProblemIcon fontSize="inherit" />}
              sx={{ mb: 4, fontWeight: "bold", borderRadius: "8px" }}
            >
              ISSUE REPORTED: We are investigating the delivery issue with this
              order.
            </Alert>
          )}

          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 2 }}>
            {steps.map((step, index) => {
              const isCompleted = activeStep > index + 1;
              const isActive = activeStep === index + 1;
              let stepColor = "#e0e0e0";
              if (isIssueReported) stepColor = "orange";
              else if (isCompleted || isActive) stepColor = "#0f2a1d"; // Brand Green

              return (
                <Step key={step.label}>
                  <StepLabel
                    StepIconComponent={() => (
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          borderRadius: "50%",
                          bgcolor: isActive ? stepColor : "transparent",
                          border: `2px solid ${stepColor}`,
                          color: isActive ? "#fff" : stepColor,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.3s ease",
                          boxShadow: isActive
                            ? "0 4px 10px rgba(15, 42, 29, 0.3)"
                            : "none",
                        }}
                      >
                        {isCompleted && !isIssueReported ? (
                          <CheckCircleIcon />
                        ) : (
                          step.icon
                        )}
                      </Box>
                    )}
                  >
                    <Typography
                      variant="body2"
                      fontWeight={isActive ? "bold" : "normal"}
                      color={isActive ? "text.primary" : "text.secondary"}
                    >
                      {step.label}
                    </Typography>
                  </StepLabel>
                </Step>
              );
            })}
          </Stepper>

          <Box
            sx={{
              textAlign: "center",
              mt: 2,
              p: 2,
              bgcolor: "#f9f9f9",
              borderRadius: "8px",
            }}
          >
            <Typography variant="body1">
              Current Status:{" "}
              <Box
                component="span"
                fontWeight="bold"
                color={isIssueReported ? "error.main" : "#0f2a1d"}
              >
                {isIssueReported
                  ? "ISSUE IN DELIVERY"
                  : pendingConfirmation
                  ? "ARRIVED (Action Required)"
                  : order.orderStatus
                  ? order.orderStatus.toUpperCase()
                  : "PROCESSING"}
              </Box>
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {pendingConfirmation && !isIssueReported && (
        <Paper
          elevation={3}
          sx={{
            mb: 4,
            p: 3,
            borderRadius: "16px",
            borderLeft: "6px solid #ed6c02",
            bgcolor: "#fff4e5",
          }}
        >
          <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            alignItems="center"
            gap={3}
          >
            <PriorityHighIcon sx={{ fontSize: 40, color: "#ed6c02" }} />
            <Box flexGrow={1}>
              <Typography variant="h6" fontWeight="bold" color="#ed6c02">
                Delivery Confirmation Needed
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Our driver has marked this order as arrived. Please confirm if
                you have received the package.
              </Typography>
            </Box>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                color="error"
                startIcon={<ReportProblemIcon />}
                onClick={onReportIssue}
                sx={{ bgcolor: "white", borderRadius: "8px" }}
              >
                No, Report Issue
              </Button>
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckCircleIcon />}
                onClick={onConfirmDelivery}
                sx={{
                  borderRadius: "8px",
                  fontWeight: "bold",
                  boxShadow: "0 4px 12px rgba(46, 125, 50, 0.2)",
                }}
              >
                Yes, Received
              </Button>
            </Stack>
          </Box>
        </Paper>
      )}

      {order.isDelivered && (
        <Alert
          severity="success"
          variant="standard"
          sx={{ mb: 4, borderRadius: "8px", border: "1px solid green" }}
        >
          Order successfully delivered on{" "}
          {new Date(order.deliveredAt).toDateString()}.
        </Alert>
      )}

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            <CardContent>
              <Stack direction="row" alignItems="center" gap={1} mb={2}>
                <ShoppingBagIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Items Ordered
                </Typography>
              </Stack>
              <Divider sx={{ mb: 2 }} />

              <Stack spacing={3}>
                {order.orderItems &&
                  order.orderItems.map((item, index) => (
                    <Box
                      key={index}
                      display="flex"
                      alignItems="flex-start"
                      gap={2}
                    >
                      <Avatar
                        variant="rounded"
                        src={generatePublicUrl(item.image || item.img)}
                        sx={{
                          width: 80,
                          height: 80,
                          bgcolor: "#f5f5f5",
                          border: "1px solid #eee",
                        }}
                      >
                        {item.name ? item.name.charAt(0) : "?"}
                      </Avatar>

                      <Box flexGrow={1}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {item.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Qty: {item.qty} &times; ₦
                          {(item.price || 0).toLocaleString()}
                        </Typography>
                      </Box>

                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        color="#0f2a1d"
                      >
                        ₦{(item.qty * (item.price || 0)).toLocaleString()}
                      </Typography>
                    </Box>
                  ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Card
              sx={{
                borderRadius: "16px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              }}
            >
              <CardContent>
                <Stack direction="row" alignItems="center" gap={1} mb={2}>
                  <LocationOnIcon color="primary" />
                  <Typography variant="h6" fontWeight="bold">
                    Shipping Details
                  </Typography>
                </Stack>
                <Divider sx={{ mb: 2 }} />

                <Box display="flex" gap={1} mb={2}>
                  <PersonIcon fontSize="small" color="action" />
                  <Typography variant="body2" fontWeight="500">
                    {order.user?.firstName || auth.user?.firstName}{" "}
                    {order.user?.lastName || auth.user?.lastName}
                  </Typography>
                </Box>

                <Box display="flex" gap={1} mb={2}>
                  <LocationOnIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {order.shippingAddress?.address}
                    <br />
                    {order.shippingAddress?.city},{" "}
                    {order.shippingAddress?.state}
                  </Typography>
                </Box>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  Phone:{" "}
                  {order.shippingAddress?.phoneNumber ||
                    auth.user?.contactNumber ||
                    "N/A"}
                </Typography>
              </CardContent>
            </Card>

            <Card
              sx={{
                borderRadius: "16px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                bgcolor: "#fcfcfc",
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Summary
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" color="text.secondary">
                    Subtotal
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    ₦{(order.totalAmount || order.totalPrice).toLocaleString()}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    Shipping
                  </Typography>
                  <Typography variant="body2" color="green">
                    Free
                  </Typography>
                </Box>

                <Divider sx={{ mb: 2, borderStyle: "dashed" }} />

                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="h6" fontWeight="800">
                    Total
                  </Typography>
                  <Typography variant="h5" fontWeight="800" color="#0f2a1d">
                    ₦{(order.totalAmount || order.totalPrice).toLocaleString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TrackOrderPage;
