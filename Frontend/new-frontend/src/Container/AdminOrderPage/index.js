import React, { useEffect } from "react";
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
} from "@mui/material";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";

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

  return (
    <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Manage Orders
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          sx={{ boxShadow: 3, borderRadius: 2 }}
        >
          <Table>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell>
                  <strong>ID</strong>
                </TableCell>
                <TableCell>
                  <strong>Customer</strong>
                </TableCell>
                <TableCell>
                  <strong>Items</strong>
                </TableCell>
                <TableCell>
                  <strong>Amount</strong>
                </TableCell>
                <TableCell>
                  <strong>Payment</strong>
                </TableCell>
                <TableCell>
                  <strong>Current Status</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Action (Update)</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders && orders.length > 0 ? (
                orders.map((order) => (
                  <TableRow key={order._id} hover>
                    <TableCell>{order._id.substring(0, 6)}...</TableCell>
                    <TableCell>
                      {order.user ? order.user.firstName : "Deleted"}
                    </TableCell>
                    <TableCell>{order.orderItems.length} Items</TableCell>
                    <TableCell fontWeight="bold">
                      ₦
                      {(order.totalAmount || order.totalPrice).toLocaleString()}
                    </TableCell>

                    <TableCell>
                      {order.isPaid ? (
                        <Chip
                          label="Paid"
                          color="success"
                          size="small"
                          variant="filled"
                        />
                      ) : order.paymentMethod === "COD" ||
                        order.paymentMethod === "Pay on Delivery" ? (
                        <Chip
                          label="Pay on Delivery"
                          color="warning"
                          size="small"
                          variant="outlined"
                        />
                      ) : (
                        <Chip
                          label="Unpaid"
                          color="error"
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </TableCell>

                    <TableCell>
                      {order.orderStatus === "issue_reported" ? (
                        <Chip
                          icon={<ReportProblemIcon />}
                          label="ISSUE IN DELIVERY"
                          color="error"
                          size="small"
                          sx={{ fontWeight: "bold" }}
                        />
                      ) : (
                        <Chip
                          label={order.orderStatus.toUpperCase()}
                          color={
                            order.orderStatus === "delivered"
                              ? "success"
                              : order.orderStatus === "shipped"
                              ? "info"
                              : order.orderStatus === "packed"
                              ? "secondary"
                              : "default"
                          }
                          size="small"
                        />
                      )}
                    </TableCell>

                    <TableCell align="center">
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <Select
                          value={order.orderStatus}
                          onChange={(e) =>
                            onStatusChange(order._id, e.target.value)
                          }
                          sx={{
                            backgroundColor: "#fff",
                            fontSize: "14px",
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              border: "1px solid green",
                            },
                          }}
                        >
                          <MenuItem value="ordered">Ordered</MenuItem>
                          <MenuItem value="packed">Packed</MenuItem>
                          <MenuItem value="shipped">Shipped</MenuItem>
                          <MenuItem value="delivered">Delivered</MenuItem>
                          <MenuItem
                            value="issue_reported"
                            disabled
                            sx={{ color: "red", fontStyle: "italic" }}
                          >
                            Issue Reported
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No orders found.
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
