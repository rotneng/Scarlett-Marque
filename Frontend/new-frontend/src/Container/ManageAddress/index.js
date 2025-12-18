import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Container,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";

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
        backgroundColor: "#f4f4f4",
        minHeight: "100vh",
        padding: "40px 20px",
      }}
    >
      <Container maxWidth="md">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/checkout")}
          sx={{
            mb: 3,
            backgroundColor: "#0f2a1d",
            fontWeight: "bold",
            color: "white",
            padding: "10px 20px",
            borderRadius: "30px",
            textTransform: "none",
            "&:hover": { backgroundColor: "#144430" },
          }}
        >
          Back to Checkout
        </Button>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography variant="h4" fontWeight="bold" color="#0f2a1d">
            My Addresses
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddNew}
            sx={{
              bgcolor: "#0f2a1d",
              borderRadius: "30px",
              padding: "10px 20px",
              textTransform: "none",
              fontWeight: "bold",
              "&:hover": { bgcolor: "#144430" },
            }}
          >
            Add Address
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
            <CircularProgress sx={{ color: "#0f2a1d" }} />
          </Box>
        ) : error ? (
          <Typography color="error" align="center">
            {error}
          </Typography>
        ) : !addresses || addresses.length === 0 ? (
          <Card sx={{ p: 5, textAlign: "center", borderRadius: "12px" }}>
            <LocationOnIcon sx={{ fontSize: 60, color: "#ccc", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No addresses found.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Add a shipping address to speed up your checkout process.
            </Typography>
            <Button
              variant="outlined"
              onClick={handleAddNew}
              sx={{
                color: "#0f2a1d",
                borderColor: "#0f2a1d",
                borderRadius: "20px",
                "&:hover": { borderColor: "#144430", bgcolor: "#f0fdf4" },
              }}
            >
              Add New Address
            </Button>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {addresses.map((addr) => (
              <Grid item xs={12} key={addr._id}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: "16px",
                    border: "1px solid #e0e0e0",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
                      borderColor: "#0f2a1d",
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", md: "row" },
                      justifyContent: "space-between",
                      alignItems: { xs: "flex-start", md: "center" },
                      p: 3,
                      gap: 2,
                    }}
                  >
                    {/* Address Details */}
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                        {addr.fullName}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <LocationOnIcon
                          fontSize="small"
                          sx={{ color: "#777", mt: 0.3 }}
                        />
                        <Typography variant="body1" sx={{ color: "#555" }}>
                          {addr.address}, {addr.city}
                        </Typography>
                      </Box>

                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <PhoneIcon fontSize="small" sx={{ color: "#777" }} />
                        <Typography variant="body2" sx={{ color: "#555" }}>
                          {addr.phone || addr.phoneNumber}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Action Buttons */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "row", md: "column" },
                        alignItems: { xs: "center", md: "flex-end" },
                        width: { xs: "100%", md: "auto" },
                        gap: 1,
                        mt: { xs: 2, md: 0 },
                        borderTop: { xs: "1px solid #f0f0f0", md: "none" },
                        pt: { xs: 2, md: 0 },
                      }}
                    >
                      <Button
                        variant="contained"
                        onClick={() => handleSelectAddress(addr)}
                        fullWidth
                        sx={{
                          bgcolor: "#0f2a1d",
                          color: "white",
                          textTransform: "none",
                          borderRadius: "20px",
                          px: 4,
                          "&:hover": { bgcolor: "#144430" },
                        }}
                      >
                        Select
                      </Button>

                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={() => handleEdit(addr)}
                          sx={{
                            color: "#555",
                            textTransform: "none",
                            minWidth: "auto",
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
                            minWidth: "auto",
                          }}
                        >
                          Delete
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default ManageAddressPage;
