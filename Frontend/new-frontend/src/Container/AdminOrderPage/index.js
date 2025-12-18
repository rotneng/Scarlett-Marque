import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  CircularProgress,
  Container,
  Alert,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { getAllOrders } from "../../Actions/order.actions"; 

const AdminOrdersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orderList = useSelector((state) => state.orderList);
  const { loading, error, orders } = orderList || {};
  const authState = useSelector((state) => state.auth);
  const currentUser = authState.user || authState.userInfo; 

  useEffect(() => {
    if (currentUser && currentUser.role === "admin") {
      dispatch(getAllOrders());
    } else if (!currentUser) {
      navigate("/signIn");
    }
  }, [dispatch, navigate, currentUser]);

  const customerOrders = orders
    ? orders.filter((order) => order.user && order.user.role !== "admin")
    : [];

  return (
    <Box sx={{ backgroundColor: "#f4f4f4", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 4, color: "#0f2a1d" }}>
          Customer Orders
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <CircularProgress sx={{ color: "#0f2a1d" }} />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ backgroundColor: "#0f2a1d" }}>
                <TableRow>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>ID</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>User</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Date</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Total</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Paid</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Delivered</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {customerOrders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>{order._id.substring(0, 10)}...</TableCell>
                    <TableCell>{order.user ? order.user.firstName : "Deleted User"}</TableCell>
                    <TableCell>{order.createdAt ? order.createdAt.substring(0, 10) : "N/A"}</TableCell>
                    <TableCell>₦{order.totalPrice ? order.totalPrice.toLocaleString() : 0}</TableCell>
                    <TableCell>
                      {order.isPaid ? (
                        <Chip icon={<CheckIcon style={{ color: "white" }} />} label="Paid" sx={{ bgcolor: "#2e7d32", color: "white" }} size="small" />
                      ) : (
                        <Chip icon={<CloseIcon style={{ color: "white" }} />} label="Not Paid" sx={{ bgcolor: "#d32f2f", color: "white" }} size="small" />
                      )}
                    </TableCell>
                    <TableCell>
                      {order.isDelivered ? (
                        <Chip icon={<CheckIcon style={{ color: "white" }} />} label="Delivered" sx={{ bgcolor: "#2e7d32", color: "white" }} size="small" />
                      ) : (
                        <Chip icon={<CloseIcon style={{ color: "white" }} />} label="Pending" sx={{ bgcolor: "#ed6c02", color: "white" }} size="small" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Button variant="outlined" size="small" onClick={() => navigate(`/order/${order._id}`)}>
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {customerOrders.length === 0 && (
                   <TableRow>
                     <TableCell colSpan={7} align="center">
                       <Typography sx={{ py: 3 }}>No customer orders found.</Typography>
                     </TableCell>
                   </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </Box>
  );
};

export default AdminOrdersPage;