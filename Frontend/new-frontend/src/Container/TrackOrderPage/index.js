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
  IconButton,
  StepConnector,
  stepConnectorClasses,
  styled,
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
import PhoneIcon from "@mui/icons-material/Phone";
import ReceiptIcon from "@mui/icons-material/Receipt";

const generatePublicUrl = (fileName) => {
  if (!fileName) return "";
  if (fileName.startsWith("http")) return fileName;
  return `http://localhost:2000/public/${fileName}`;
};

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(15, 42, 29) 0%,rgb(26, 77, 53) 50%,rgb(136, 224, 186) 100%)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(15, 42, 29) 0%,rgb(15, 42, 29) 100%)",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: "#eaeaf0",
    borderRadius: 1,
  },
}));

const steps = [
  { label: "Order Placed", icon: <InventoryIcon fontSize="small" /> },
  { label: "Packed", icon: <InventoryIcon fontSize="small" /> },
  { label: "Shipped", icon: <LocalShippingIcon fontSize="small" /> },
  { label: "Delivered", icon: <HomeIcon fontSize="small" /> },
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

  const onConfirmDelivery = () => {
    if (
      window.confirm(
        "Are you sure you have received this order? This cannot be undone.",
      )
    ) {
      dispatch(confirmDelivery(order._id));
    }
  };

  const onReportIssue = () => {
    if (
      window.confirm(
        "Has the order NOT arrived? We will notify the admin immediately.",
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
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "#f8f9fa",
        }}
      >
        <CircularProgress size={60} thickness={4} sx={{ color: "#0f2a1d" }} />
      </Box>
    );

  if (error)
    return (
      <Container sx={{ mt: 10 }}>
        <Alert severity="error" variant="filled" sx={{ borderRadius: "12px" }}>
          {error}
        </Alert>
      </Container>
    );

  if (!order)
    return (
      <Container sx={{ mt: 10 }}>
        <Typography>Order not found.</Typography>
      </Container>
    );

  const activeStep = getActiveStep(order.orderStatus, order.isDelivered);
  const pendingConfirmation =
    order.orderStatus === "delivered" && !order.isDelivered;
  const isIssueReported = order.orderStatus === "issue_reported";

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8f9fa" }}>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Stack direction="row" alignItems="center" spacing={3} sx={{ mb: 6 }}>
          <IconButton
            onClick={() => navigate("/account/orders")}
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
          <Box flexGrow={1}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={2}
            >
              <Typography
                variant="h4"
                fontWeight="800"
                sx={{ color: "#0f2a1d" }}
              >
                Track Order
              </Typography>
              <Chip
                label={`#${order._id?.substring(0, 8).toUpperCase()}`}
                sx={{
                  bgcolor: "#e8f5e9",
                  color: "#0f2a1d",
                  fontWeight: "bold",
                  borderRadius: "8px",
                  fontFamily: "monospace",
                }}
              />
            </Stack>
          </Box>
        </Stack>

        <Card
          sx={{
            mb: 5,
            borderRadius: "24px",
            border: "1px solid rgba(0,0,0,0.04)",
            boxShadow: "0 10px 40px -10px rgba(0,0,0,0.08)",
            overflow: "visible",
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 5 } }}>
            {isIssueReported && (
              <Alert
                severity="error"
                variant="standard"
                icon={<ReportProblemIcon fontSize="inherit" />}
                sx={{
                  mb: 5,
                  borderRadius: "12px",
                  border: "1px solid #ef5350",
                }}
              >
                <Typography variant="subtitle2" fontWeight="bold">
                  ISSUE REPORTED
                </Typography>
                We are investigating the delivery issue with this order.
              </Alert>
            )}

            <Stepper
              activeStep={activeStep}
              alternativeLabel
              connector={<ColorlibConnector />}
              sx={{ mb: 4 }}
            >
              {steps.map((step, index) => {
                const isCompleted = activeStep > index + 1;
                const isActive = activeStep === index + 1;
                let stepColor = "#e0e0e0";

                if (isIssueReported) stepColor = "#ff9800";
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
                            bgcolor: isActive ? stepColor : "#fff",
                            border: `2px solid ${
                              isActive || isCompleted ? stepColor : "#eaeaea"
                            }`,
                            color: isActive
                              ? "#fff"
                              : isCompleted
                                ? stepColor
                                : "#9e9e9e",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.3s ease",
                            boxShadow: isActive
                              ? "0 4px 14px rgba(15, 42, 29, 0.4)"
                              : "none",
                            zIndex: 1,
                          }}
                        >
                          {isCompleted && !isIssueReported ? (
                            <CheckCircleIcon fontSize="small" />
                          ) : (
                            step.icon
                          )}
                        </Box>
                      )}
                    >
                      <Typography
                        variant="body2"
                        fontWeight={isActive ? "700" : "500"}
                        color={isActive ? "text.primary" : "text.secondary"}
                        sx={{ mt: 1 }}
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
                mt: 4,
                p: 2,
                bgcolor: isIssueReported ? "#fff3e0" : "#f1f8f5",
                borderRadius: "16px",
                maxWidth: "500px",
                mx: "auto",
              }}
            >
              <Typography variant="body2" color="text.secondary" mb={0.5}>
                Current Status
              </Typography>
              <Typography
                variant="h6"
                fontWeight="800"
                color={isIssueReported ? "error.main" : "#0f2a1d"}
                sx={{ letterSpacing: 0.5 }}
              >
                {isIssueReported
                  ? "ISSUE IN DELIVERY"
                  : pendingConfirmation
                    ? "ARRIVED (Action Required)"
                    : order.orderStatus
                      ? order.orderStatus.toUpperCase()
                      : "PROCESSING"}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {pendingConfirmation && !isIssueReported && (
          <Paper
            elevation={0}
            sx={{
              mb: 5,
              p: 4,
              borderRadius: "24px",
              background: "linear-gradient(to right, #fff4e5, #fff)",
              border: "1px solid #ffe0b2",
              boxShadow: "0 8px 30px rgba(237, 108, 2, 0.1)",
            }}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid item>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    bgcolor: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 12px rgba(237, 108, 2, 0.2)",
                    color: "#ed6c02",
                  }}
                >
                  <PriorityHighIcon fontSize="large" />
                </Box>
              </Grid>
              <Grid item xs>
                <Typography variant="h6" fontWeight="800" color="#e65100">
                  Delivery Confirmation Needed
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  Our driver has marked this order as arrived. Please confirm if
                  you have received the package securely.
                </Typography>
              </Grid>
              <Grid item>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<ReportProblemIcon />}
                    onClick={onReportIssue}
                    sx={{
                      bgcolor: "white",
                      borderRadius: "12px",
                      textTransform: "none",
                      fontWeight: "bold",
                      border: "1px solid #ffcdd2",
                      "&:hover": {
                        bgcolor: "#ffebee",
                        border: "1px solid #ef5350",
                      },
                    }}
                  >
                    Report Issue
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircleIcon />}
                    onClick={onConfirmDelivery}
                    sx={{
                      borderRadius: "12px",
                      fontWeight: "bold",
                      textTransform: "none",
                      boxShadow: "0 8px 20px rgba(46, 125, 50, 0.3)",
                      px: 3,
                    }}
                  >
                    Yes, Received
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        )}

        {order.isDelivered && (
          <Alert
            severity="success"
            variant="filled"
            sx={{
              mb: 5,
              borderRadius: "16px",
              bgcolor: "#0f2a1d",
              color: "#fff",
              fontWeight: "500",
              boxShadow: "0 8px 20px rgba(15, 42, 29, 0.2)",
            }}
          >
            Order successfully delivered on{" "}
            <span style={{ fontWeight: "bold" }}>
              {new Date(order.deliveredAt).toDateString()}
            </span>
            .
          </Alert>
        )}

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Card
              sx={{
                height: "100%",
                borderRadius: "24px",
                border: "1px solid rgba(0,0,0,0.04)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: "10px",
                      bgcolor: "#e8f5e9",
                      color: "#0f2a1d",
                    }}
                  >
                    <ShoppingBagIcon />
                  </Box>
                  <Typography variant="h6" fontWeight="bold">
                    Items Ordered
                  </Typography>
                </Stack>

                <Stack spacing={3}>
                  {order.orderItems &&
                    order.orderItems.map((item, index) => (
                      <React.Fragment key={index}>
                        <Box
                          display="flex"
                          alignItems="center"
                          gap={3}
                          sx={{
                            p: 2,
                            borderRadius: "16px",
                            transition: "background 0.2s",
                            "&:hover": { bgcolor: "#fafafa" },
                          }}
                        >
                          <Avatar
                            variant="rounded"
                            src={generatePublicUrl(item.image || item.img)}
                            sx={{
                              width: 80,
                              height: 80,
                              bgcolor: "#fff",
                              border: "1px solid #eee",
                              borderRadius: "12px",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                            }}
                          >
                            {item.name ? item.name.charAt(0) : "?"}
                          </Avatar>

                          <Box flexGrow={1}>
                            <Typography
                              variant="subtitle1"
                              fontWeight="700"
                              color="#2d3436"
                              sx={{ mb: 0.5 }}
                            >
                              {item.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Quantity:{" "}
                              <span
                                style={{ fontWeight: "bold", color: "#000" }}
                              >
                                {item.qty}
                              </span>
                            </Typography>
                          </Box>

                          <Box textAlign="right">
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                            >
                              Unit Price
                            </Typography>
                            <Typography
                              variant="subtitle1"
                              fontWeight="bold"
                              color="#0f2a1d"
                            >
                              ₦{(item.price || 0).toLocaleString()}
                            </Typography>
                          </Box>
                        </Box>
                        {index < order.orderItems.length - 1 && (
                          <Divider sx={{ borderStyle: "dashed" }} />
                        )}
                      </React.Fragment>
                    ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack spacing={4}>
              <Card
                sx={{
                  borderRadius: "24px",
                  border: "1px solid rgba(0,0,0,0.04)",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                }}
              >
                <CardContent sx={{ p: 3.5 }}>
                  <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: "10px",
                        bgcolor: "#e3f2fd",
                        color: "#1976d2",
                      }}
                    >
                      <LocationOnIcon />
                    </Box>
                    <Typography variant="h6" fontWeight="bold">
                      Delivery Details
                    </Typography>
                  </Stack>

                  <Stack spacing={2.5}>
                    <Box display="flex" gap={2}>
                      <PersonIcon
                        sx={{ color: "text.secondary", mt: 0.5, fontSize: 20 }}
                      />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Receiver
                        </Typography>
                        <Typography variant="body2" fontWeight="600">
                          {order.user?.firstName || auth.user?.firstName}{" "}
                          {order.user?.lastName || auth.user?.lastName}
                        </Typography>
                      </Box>
                    </Box>

                    <Box display="flex" gap={2}>
                      <LocationOnIcon
                        sx={{ color: "text.secondary", mt: 0.5, fontSize: 20 }}
                      />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Address
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight="500"
                          sx={{ lineHeight: 1.6 }}
                        >
                          {order.shippingAddress?.address}
                          <br />
                          {order.shippingAddress?.city},{" "}
                          {order.shippingAddress?.state}
                        </Typography>
                      </Box>
                    </Box>

                    <Box display="flex" gap={2}>
                      <PhoneIcon
                        sx={{ color: "text.secondary", mt: 0.5, fontSize: 20 }}
                      />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Contact
                        </Typography>
                        <Typography variant="body2" fontWeight="500">
                          {order.shippingAddress?.phoneNumber ||
                            auth.user?.contactNumber ||
                            "N/A"}
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>

              <Card
                sx={{
                  borderRadius: "24px",
                  border: "1px solid rgba(0,0,0,0.04)",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                  bgcolor: "#fcfcfc",
                }}
              >
                <CardContent sx={{ p: 3.5 }}>
                  <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: "10px",
                        bgcolor: "#fff3e0",
                        color: "#ed6c02",
                      }}
                    >
                      <ReceiptIcon />
                    </Box>
                    <Typography variant="h6" fontWeight="bold">
                      Payment Summary
                    </Typography>
                  </Stack>

                  <Box display="flex" justifyContent="space-between" mb={1.5}>
                    <Typography variant="body2" color="text.secondary">
                      Subtotal
                    </Typography>
                    <Typography variant="body2" fontWeight="600">
                      ₦
                      {(order.totalAmount || order.totalPrice).toLocaleString()}
                    </Typography>
                  </Box>

                  <Box display="flex" justifyContent="space-between" mb={3}>
                    <Typography variant="body2" color="text.secondary">
                      Shipping Fee
                    </Typography>
                    <Chip
                      label="Free"
                      color="success"
                      size="small"
                      variant="soft"
                      sx={{
                        height: 20,
                        fontSize: "0.7rem",
                        fontWeight: "bold",
                        bgcolor: "#e8f5e9",
                        color: "#2e7d32",
                      }}
                    />
                  </Box>

                  <Divider sx={{ mb: 3, borderStyle: "dashed" }} />

                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography
                      variant="h6"
                      fontWeight="800"
                      color="text.primary"
                    >
                      Total
                    </Typography>
                    <Typography variant="h4" fontWeight="800" color="#0f2a1d">
                      ₦
                      {(order.totalAmount || order.totalPrice).toLocaleString()}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default TrackOrderPage;
