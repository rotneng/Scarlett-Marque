import React, { useState } from "react";
import { Box, Paper, TextField, Button, Typography, Alert, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../../Actions/auth.actions";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, width: "400px", textAlign: "center" }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
          Forgot Password
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
          Enter your email address and we'll send you a link to reset your password.
        </Typography>

        {auth.message && <Alert severity="success" sx={{ mb: 2 }}>{auth.message}</Alert>}
        {auth.error && <Alert severity="error" sx={{ mb: 2 }}>{auth.error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            {auth.loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Send Reset Link"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default ForgotPassword;