import {
  Box,
  TextField,
  InputAdornment,
  Button,
  Alert,
  IconButton,
  Typography,
  CircularProgress,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Slide,
  Avatar,
  Container,
  Grid,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import { register } from "../../Actions/auth.actions";
import { authConstants } from "../../Actions/constant";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const auth = useSelector((state) => state.auth);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    dispatch({
      type: authConstants.LOGIN_FAILURE,
      payload: { error: null },
    });
  }, [dispatch]);

  const handleInput = (setter) => (e) => {
    setter(e.target.value);
    if (localError) setLocalError("");
  };

  useEffect(() => {
    if (
      !auth.loading &&
      auth.message === "Registration Successful" &&
      !auth.error
    ) {
      setOpenDialog(true);
    }
  }, [auth.loading, auth.message, auth.error]);

  const handleCloseAndNavigate = () => {
    setOpenDialog(false);
    navigate("/signIn", {
      state: { email: email },
      replace: true,
    });
  };

  const handleRegistration = (e) => {
    if (e) e.preventDefault();

    if (!username || !email || !password) {
      setLocalError("All fields are required");
      return;
    }

    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters long");
      return;
    }

    const user = { username, email, password, role: "user" };
    dispatch(register(user));
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        py: 4,
      }}
    >
      <Container component="main" maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            p: { xs: 3, md: 6 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: "20px",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            transition: "transform 0.3s ease-in-out",
            "&:hover": {
              boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
            },
          }}
        >
          <Avatar
            sx={{
              m: 1,
              bgcolor: "#0f2a1d",
              width: 56,
              height: 56,
              boxShadow: "0 4px 10px rgba(15, 42, 29, 0.3)",
            }}
          >
            <AppRegistrationIcon fontSize="large" />
          </Avatar>

          <Typography
            component="h1"
            variant="h4"
            sx={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 700,
              color: "#0f2a1d",
              mb: 1,
              textAlign: "center",
            }}
          >
            Create Account
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Join Scarlett Marque for exclusive collections
          </Typography>

          <Box
            component="form"
            onSubmit={handleRegistration}
            sx={{
              width: "100%",
              mt: 1,
              display: "flex",
              flexDirection: "column",
              gap: 2.5,
            }}
          >
            {(localError || (auth.error && !auth.loading)) && (
              <Slide direction="down" in={true} mountOnEnter unmountOnExit>
                <Alert
                  severity="error"
                  sx={{ width: "100%", borderRadius: "10px" }}
                >
                  {localError || auth.error}
                </Alert>
              </Slide>
            )}

            <TextField
              label="Username"
              fullWidth
              variant="outlined"
              value={username}
              onChange={handleInput(setUsername)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: "#0f2a1d" }} />
                  </InputAdornment>
                ),
                sx: { borderRadius: "12px" },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": { borderColor: "#0f2a1d" },
                },
                "& .MuiInputLabel-root.Mui-focused": { color: "#0f2a1d" },
              }}
            />

            <TextField
              label="Email Address"
              type="email"
              fullWidth
              variant="outlined"
              value={email}
              onChange={handleInput(setEmail)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: "#0f2a1d" }} />
                  </InputAdornment>
                ),
                sx: { borderRadius: "12px" },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": { borderColor: "#0f2a1d" },
                },
                "& .MuiInputLabel-root.Mui-focused": { color: "#0f2a1d" },
              }}
            />

            <TextField
              type={showPassword ? "text" : "password"}
              label="Password"
              fullWidth
              variant="outlined"
              value={password}
              onChange={handleInput(setPassword)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: "#0f2a1d" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { borderRadius: "12px" },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": { borderColor: "#0f2a1d" },
                },
                "& .MuiInputLabel-root.Mui-focused": { color: "#0f2a1d" },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={auth.loading}
              sx={{
                mt: 2,
                mb: 2,
                py: 1.5,
                fontSize: "1rem",
                fontWeight: 600,
                backgroundColor: "#0f2a1d",
                borderRadius: "30px",
                textTransform: "none",
                boxShadow: "0 4px 12px rgba(15, 42, 29, 0.2)",
                "&:hover": {
                  backgroundColor: "#1a4d33",
                  boxShadow: "0 6px 16px rgba(15, 42, 29, 0.3)",
                },
              }}
            >
              {auth.loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Create Account"
              )}
            </Button>

            <Grid container justifyContent="center">
              <Grid item>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Already have an account?{" "}
                  <span
                    style={{
                      color: "#0f2a1d",
                      fontWeight: "bold",
                      cursor: "pointer",
                      textDecoration: "underline",
                      textUnderlineOffset: "3px",
                    }}
                    onClick={() => navigate("/signIn")}
                  >
                    Log In
                  </span>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>

      {/* Success Dialog */}
      <Dialog
        open={openDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseAndNavigate}
        aria-describedby="welcome-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 2,
            minWidth: { xs: "300px", sm: "400px" },
            textAlign: "center",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: '"Playfair Display", serif',
            fontSize: "1.8rem",
            color: "#0f2a1d",
            fontWeight: "bold",
            pb: 1,
          }}
        >
          Welcome Aboard!
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="welcome-dialog-description"
            sx={{ fontSize: "1.05rem", color: "#555", lineHeight: 1.6 }}
          >
            Welcome to <strong>Scarlett Marque</strong>.<br />
            We are thrilled to have you! Enjoy shopping our exclusive
            collections.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3, pt: 1 }}>
          <Button
            onClick={handleCloseAndNavigate}
            variant="contained"
            sx={{
              backgroundColor: "#0f2a1d",
              borderRadius: "20px",
              px: 5,
              py: 1,
              textTransform: "none",
              fontSize: "1rem",
              "&:hover": { backgroundColor: "#1a4d33" },
            }}
          >
            Go to Login
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SignUp;
