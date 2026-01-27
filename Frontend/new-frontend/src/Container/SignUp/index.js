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
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { register } from "../../Actions/auth.actions";

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

  const handleInput = (setter) => (e) => {
    setter(e.target.value);
    if (localError) setLocalError("");
  };

  useEffect(() => {
    if (!auth.loading && auth.message && !auth.error) {
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
        pb: 5,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: { xs: "flex-start" },
        backgroundColor: "#f4f4f4",
      }}
    >
      <Box
        sx={{
          fontSize: { xs: "24px", md: "30px" },
          fontWeight: "600",
          textAlign: "center",
          backgroundColor: "#0f2a1d",
          color: "white",
          padding: { xs: "15px", md: "20px" },
          mb: { xs: 2, md: 4 },
          width: "100%",
          boxShadow: 2,
        }}
      >
        Sign Up Page
      </Box>

      <Paper
        elevation={3}
        sx={{
          width: { xs: "90%", sm: "500px" },
          p: { xs: 2, md: 4 },
          borderRadius: "12px",
          backgroundColor: "white",
        }}
      >
        <Box
          component="form"
          onSubmit={handleRegistration}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 3,
          }}
        >
          {(localError || (auth.error && !auth.loading)) && (
            <Alert sx={{ width: "100%" }} severity="error">
              {localError || auth.error}
            </Alert>
          )}

          <TextField
            label="Username"
            fullWidth
            value={username}
            onChange={handleInput(setUsername)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Email"
            type="email"
            fullWidth
            value={email}
            onChange={handleInput(setEmail)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            type={showPassword ? "text" : "password"}
            label="Password"
            fullWidth
            value={password}
            onChange={handleInput(setPassword)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            variant="contained"
            disabled={auth.loading}
            sx={{
              fontSize: 15,
              backgroundColor: "#0f2a1d",
              color: "white",
              padding: "12px 40px",
              marginTop: 2,
              borderRadius: "30px",
              width: { xs: "100%", sm: "50%" },
              "&:hover": { backgroundColor: "#1a4d33" },
            }}
          >
            {auth.loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Sign Up"
            )}
          </Button>

          <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
            Already have an account?
            <span
              style={{
                color: "#0f2a1d",
                fontWeight: "bold",
                cursor: "pointer",
                marginLeft: "5px",
              }}
              onClick={() => navigate("/signin")}
            >
              Sign In
            </span>
          </Typography>
        </Box>
      </Paper>

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
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: '"Playfair Display", serif',
            fontSize: "1.8rem",
            color: "#0f2a1d",
            fontWeight: "bold",
          }}
        >
          Welcome Aboard!
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="welcome-dialog-description"
            sx={{ fontSize: "1.1rem", color: "#555" }}
          >
            Welcome to <strong>Scarlett Marque</strong>.<br />
            We are thrilled to have you! Enjoy shopping our exclusive
            collections.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            onClick={handleCloseAndNavigate}
            variant="contained"
            sx={{
              backgroundColor: "#0f2a1d",
              borderRadius: "20px",
              px: 4,
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
