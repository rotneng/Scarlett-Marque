import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Stack,
  IconButton,
  Divider,
  Paper,
  alpha,
} from "@mui/material";

import EditIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import HomeIcon from "@mui/icons-material/HomeWorkOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { getAddresses, deleteAddress } from "../../Actions/address.actions";

const ManageAddressPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = localStorage.getItem("token");
  const addressState = useSelector((state) => state.addressList || {});
  const { addresses, loading, error } = addressState;

  useEffect(() => {
    if (!token) {
      navigate("/signin");
    } else {
      dispatch(getAddresses());
    }
  }, [dispatch, navigate, token]);

  const handleAddNew = () => {
    navigate("/address");
  };

  const handleEdit = (address) => {
    navigate("/address", { state: { addressToEdit: address } });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      dispatch(deleteAddress(id));
    }
  };

  const handleSelectAddress = (address) => {
    navigate("/checkout", { state: { selectedAddress: address } });
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        pb: 8,
        pt: 4,
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/checkout")}
            sx={{
              mb: 2,
              color: "#555",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": { backgroundColor: "transparent", color: "#0f2a1d" },
            }}
          >
            Return to Checkout
          </Button>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={2}
          >
            <Box>
              <Typography variant="h4" fontWeight="800" color="#0f2a1d">
                Shipping Addresses
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Manage your delivery locations
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddNew}
              sx={{
                bgcolor: "#0f2a1d",
                borderRadius: "50px",
                padding: "10px 24px",
                textTransform: "none",
                fontWeight: "bold",
                boxShadow: "0 4px 12px rgba(15, 42, 29, 0.3)",
                "&:hover": { bgcolor: "#144430" },
              }}
            >
              Add New Address
            </Button>
          </Stack>
        </Box>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
            <CircularProgress size={50} sx={{ color: "#0f2a1d" }} />
          </Box>
        ) : error ? (
          <Paper
            sx={{
              p: 4,
              textAlign: "center",
              bgcolor: "#fff0f0",
              color: "#d32f2f",
            }}
          >
            <Typography variant="h6">Error Loading Addresses</Typography>
            <Typography>{error}</Typography>
          </Paper>
        ) : !addresses || addresses.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 6,
              textAlign: "center",
              borderRadius: "24px",
              border: "2px dashed #e0e0e0",
              bgcolor: "white",
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                bgcolor: "#f5f5f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 3,
              }}
            >
              <LocationOnIcon sx={{ fontSize: 40, color: "#999" }} />
            </Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              No addresses found
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 4, maxWidth: "400px", mx: "auto" }}
            >
              It looks like you haven't saved any shipping addresses yet. Add
              one to speed up your checkout.
            </Typography>
            <Button
              variant="outlined"
              onClick={handleAddNew}
              sx={{
                color: "#0f2a1d",
                borderColor: "#0f2a1d",
                borderWidth: 2,
                borderRadius: "50px",
                px: 4,
                fontWeight: "bold",
                "&:hover": {
                  borderColor: "#144430",
                  borderWidth: 2,
                  bgcolor: "#f0fdf4",
                },
              }}
            >
              Create Address
            </Button>
          </Paper>
        ) : (
          <Stack spacing={2}>
            {addresses.map((addr) => (
              <Card
                key={addr._id}
                elevation={0}
                sx={{
                  borderRadius: "16px",
                  border: "1px solid #e0e0e0",
                  transition: "all 0.2s ease",
                  overflow: "visible",
                  "&:hover": {
                    borderColor: "#0f2a1d",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", md: "center" }}
                    spacing={3}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{ mb: 1 }}
                      >
                        <HomeIcon sx={{ color: "#0f2a1d", fontSize: 28 }} />
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          sx={{ color: "#333" }}
                        >
                          {addr.fullName}
                        </Typography>
                      </Stack>

                      <Typography
                        variant="body1"
                        sx={{
                          ml: 4.5,
                          mb: 0.5,
                          color: "#555",
                          fontWeight: 500,
                        }}
                      >
                        {addr.address}, {addr.city}
                      </Typography>

                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{ ml: 4.5 }}
                      >
                        <PhoneIcon sx={{ fontSize: 16, color: "#888" }} />
                        <Typography variant="body2" color="text.secondary">
                          {addr.phone || addr.phoneNumber}
                        </Typography>
                      </Stack>
                    </Box>

                    <Divider
                      sx={{
                        display: { xs: "block", md: "none" },
                        width: "100%",
                      }}
                    />

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "row", md: "column" },
                        alignItems: { xs: "center", md: "flex-end" },
                        width: { xs: "100%", md: "auto" },
                        gap: 1.5,
                      }}
                    >
                      <Button
                        variant="contained"
                        onClick={() => handleSelectAddress(addr)}
                        startIcon={<CheckCircleIcon />}
                        sx={{
                          bgcolor: alpha("#0f2a1d", 0.9),
                          color: "white",
                          textTransform: "none",
                          borderRadius: "10px",
                          px: 3,
                          width: { xs: "100%", md: "160px" },
                          boxShadow: "none",
                          "&:hover": {
                            bgcolor: "#0f2a1d",
                            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                          },
                        }}
                      >
                        Deliver Here
                      </Button>

                      <Stack direction="row" spacing={1}>
                        <Button
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={() => handleEdit(addr)}
                          sx={{
                            color: "#666",
                            textTransform: "none",
                            "&:hover": {
                              color: "#0f2a1d",
                              bgcolor: "transparent",
                            },
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDelete(addr._id)}
                          sx={{
                            color: "#d32f2f",
                            textTransform: "none",
                            "&:hover": { bgcolor: "#ffebee" },
                          }}
                        >
                          Delete
                        </Button>
                      </Stack>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Container>
    </Box>
  );
};

export default ManageAddressPage;
