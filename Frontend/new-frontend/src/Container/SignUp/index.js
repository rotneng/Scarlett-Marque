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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useState, useEffect } from "react";
import { register } from "../../Actions/auth.actions";

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const auth = useSelector((state) => state.auth || state.user);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleInput = (setter) => (e) => {
    setter(e.target.value);
    if (localError) setLocalError("");
  };
  useEffect(() => {
    if (!auth.loading && (auth.message || auth.authenticate)) {
      alert("Registration Successful! Please Sign In.");
      navigate("/signin", { replace: true });
    }
  }, [auth.loading, auth.message, auth.authenticate, navigate]);

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
    </Box>
  );
};

export default SignUp;
