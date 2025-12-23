import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  TextField,
  InputAdornment,
  CircularProgress,
  Container,
  Alert,
  Stack,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MapIcon from "@mui/icons-material/Map";
import SaveIcon from "@mui/icons-material/Save";

import { addAddress, updateAddress } from "../../Actions/address.actions";

const AddressPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const token = localStorage.getItem("token");
  const addressToEdit = location.state?.addressToEdit;

  const addressState = useSelector((state) => state.addressList || {});
  const { loading, error } = addressState;

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
  });

  useEffect(() => {
    if (addressToEdit) {
      setFormData({
        fullName: addressToEdit.fullName,
        phone: addressToEdit.phone,
        address: addressToEdit.address,
        city: addressToEdit.city,
        state: addressToEdit.state,
      });
    }
  }, [addressToEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveAndProceed = async () => {
    if (!token) {
      alert("Please login to save your address.");
      navigate("/signin");
      return;
    }

    if (addressToEdit) {
      await dispatch(updateAddress(addressToEdit._id, formData));
    } else {
      await dispatch(addAddress(formData));
    }

    navigate("/checkout");
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f4f6f8",
        minHeight: "100vh",
        py: 6,
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography variant="h4" fontWeight="800" color="#0f2a1d">
            {addressToEdit ? "Edit Address" : "New Address"}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {addressToEdit
              ? "Update your existing delivery details below."
              : "Where should we send your order?"}
          </Typography>
        </Box>

        <Card
          elevation={0}
          sx={{
            borderRadius: "16px",
            border: "1px solid #e0e0e0",
            boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
            overflow: "visible",
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 5 } }}>
            <Box component="form" noValidate autoComplete="off">
              {error && (
                <Alert severity="error" sx={{ mb: 4, borderRadius: "8px" }}>
                  {typeof error === "object" ? JSON.stringify(error) : error}
                </Alert>
              )}

              <Typography
                variant="h6"
                sx={{
                  color: "#0f2a1d",
                  fontWeight: "bold",
                  mb: 3,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <PersonIcon color="primary" /> Contact Information
              </Typography>

              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="action" fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon color="action" fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ mb: 4, borderStyle: "dashed" }} />

              <Typography
                variant="h6"
                sx={{
                  color: "#0f2a1d",
                  fontWeight: "bold",
                  mb: 3,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <HomeIcon color="primary" /> Delivery Details
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Street Address"
                    name="address"
                    placeholder="e.g. 12 Scarlett Avenue, Flat 4B"
                    value={formData.address}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <HomeIcon color="action" fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationCityIcon color="action" fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="State / Province"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MapIcon color="action" fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
        <Stack
          direction={{ xs: "column-reverse", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          sx={{ mt: 4 }}
        >
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/checkout")}
            variant="outlined"
            size="large"
            fullWidth
            sx={{
              borderColor: "#0f2a1d",
              color: "#0f2a1d",
              borderRadius: "30px",
              textTransform: "none",
              fontWeight: "bold",
              maxWidth: { sm: "200px" },
              "&:hover": {
                borderColor: "#144430",
                bgcolor: "rgba(15, 42, 29, 0.05)",
              },
            }}
          >
            Back to Checkout
          </Button>

          <Button
            variant="contained"
            onClick={handleSaveAndProceed}
            disabled={loading}
            startIcon={!loading && <SaveIcon />}
            size="large"
            fullWidth
            sx={{
              backgroundColor: "#0f2a1d",
              color: "white",
              borderRadius: "30px",
              textTransform: "none",
              fontWeight: "bold",
              boxShadow: "0 8px 16px rgba(15, 42, 29, 0.2)",
              maxWidth: { sm: "250px" },
              "&:hover": {
                bgcolor: "#144430",
                boxShadow: "0 10px 20px rgba(15, 42, 29, 0.3)",
              },
              "&.Mui-disabled": { bgcolor: "#ccc" },
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : addressToEdit ? (
              "Update Address"
            ) : (
              "Save & Proceed"
            )}
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};

export default AddressPage;
