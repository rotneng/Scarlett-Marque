import React, { useState } from "react";
import { Box, Paper, TextField, Button, Typography, Alert, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../../Actions/auth.actions";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams(); // Get token from URL
  const auth = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }
    setLocalError("");

    const success = await dispatch(resetPassword(token, password));
    if (success) {
      setTimeout(() => navigate("/signin"), 3000); // Redirect after 3s
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, width: "400px", textAlign: "center" }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
          Reset Password
        </Typography>

        {auth.message && <Alert severity="success" sx={{ mb: 2 }}>Password reset successfully! Redirecting...</Alert>}
        {(localError || auth.error) && <Alert severity="error" sx={{ mb: 2 }}>{localError || auth.error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{ mb: 3 }}
            required
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={auth.loading}
            sx={{ bgcolor: "#0f2a1d", "&:hover": { bgcolor: "#1a4d33" } }}
          >
            {auth.loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Set New Password"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default ResetPassword;