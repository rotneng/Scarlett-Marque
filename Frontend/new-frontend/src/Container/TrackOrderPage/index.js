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
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import InventoryIcon from "@mui/icons-material/Inventory";
import HomeIcon from "@mui/icons-material/Home";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";

const generatePublicUrl = (fileName) => {
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
      default:
        return 0;
    }
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  if (error)
    return (
      <Container sx={{ mt: 5 }}>
        <Alert severity="error">{error}</Alert>
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

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/account/orders")}
        sx={{ mb: 2 }}
      >
        Back to Orders
      </Button>

      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Order #{order._id?.substring(0, 10)}...
      </Typography>

      <Card sx={{ mb: 4, p: 3, borderRadius: "12px", boxShadow: 2 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                StepIconComponent={() => (
                  <Box
                    sx={{
                      color: activeStep >= index + 1 ? "green" : "#ccc",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    {activeStep > index + 1 ? (
                      <CheckCircleIcon fontSize="large" />
                    ) : (
                      step.icon
                    )}
                  </Box>
                )}
              >
                {step.label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Typography
            variant="h6"
            fontWeight="bold"
            color={pendingConfirmation ? "warning.main" : "primary"}
          >
            Current Status:{" "}
            {pendingConfirmation
              ? "ARRIVED (Action Required)"
              : order.orderStatus
              ? order.orderStatus.toUpperCase()
              : "PROCESSING"}
          </Typography>
        </Box>
      </Card>

      {pendingConfirmation && (
        <Alert
          severity="warning"
          icon={<PriorityHighIcon fontSize="inherit" />}
          sx={{ mb: 4, borderRadius: "12px", alignItems: "center" }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                Delivery Reported
              </Typography>
              <Typography variant="body2">
                Our driver says this order has arrived. Do you have it?
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                color="error"
                startIcon={<ReportProblemIcon />}
                onClick={onReportIssue}
                sx={{ bgcolor: "white" }}
              >
                No, Report Issue
              </Button>
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckCircleIcon />}
                onClick={onConfirmDelivery}
                sx={{ fontWeight: "bold" }}
              >
                Yes, I Received It
              </Button>
            </Box>
          </Box>
        </Alert>
      )}

      {order.isDelivered && (
        <Alert severity="success" variant="filled" sx={{ mb: 4 }}>
          Order successfully delivered on{" "}
          {new Date(order.deliveredAt).toDateString()}.
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: "12px", boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Items Ordered
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                {order.orderItems &&
                  order.orderItems.map((item, index) => (
                    <React.Fragment key={index}>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar
                            variant="square"
                            src={generatePublicUrl(item.img)}
                            sx={{
                              width: 60,
                              height: 60,
                              mr: 2,
                              borderRadius: 1,
                            }}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography fontWeight="bold">
                              {item.name}
                            </Typography>
                          }
                          secondary={
                            <>
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.primary"
                              >
                                {item.qty} x ₦{item.price.toLocaleString()}
                              </Typography>
                              <br />
                              <Typography
                                component="span"
                                variant="body2"
                                fontWeight="bold"
                                color="primary"
                              >
                                Total: ₦
                                {(item.qty * item.price).toLocaleString()}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                      {index < order.orderItems.length - 1 && (
                        <Divider variant="inset" component="li" />
                      )}
                    </React.Fragment>
                  ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: "12px", boxShadow: 2, mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Shipping Info
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="subtitle2" color="text.secondary">
                Name
              </Typography>
              <Typography variant="body1" gutterBottom>
                {order.user?.firstName || auth.user?.firstName}{" "}
                {order.user?.lastName || auth.user?.lastName}
              </Typography>

              <Typography variant="subtitle2" color="text.secondary" mt={2}>
                Address
              </Typography>
              <Typography variant="body1">
                {order.shippingAddress?.address}
                <br />
                {order.shippingAddress?.city}, {order.shippingAddress?.state}
              </Typography>

              <Typography variant="subtitle2" color="text.secondary" mt={2}>
                Phone
              </Typography>
              <Typography variant="body1">
                {order.shippingAddress?.phoneNumber ||
                  auth.user?.contactNumber ||
                  "N/A"}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: "12px", boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Order Summary
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography>Subtotal</Typography>
                <Typography>
                  ₦{(order.totalAmount || order.totalPrice).toLocaleString()}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography>Shipping</Typography>
                <Typography>₦0.00</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h6" fontWeight="bold">
                  Total
                </Typography>
                <Typography variant="h6" fontWeight="bold" color="green">
                  ₦{(order.totalAmount || order.totalPrice).toLocaleString()}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TrackOrderPage;
