import {
  Box,
  Alert,
  InputAdornment,
  TextField,
  Button,
  IconButton,
  Typography,
  CircularProgress,
  Paper,
  Container,
  Avatar,
  Grid,
  Slide,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PersonIcon from "@mui/icons-material/Person";
import { login } from "../../Actions/auth.actions";
import { authConstants } from "../../Actions/constant";

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const auth = useSelector((state) => state.auth);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [localError, setLocalError] = useState("");

  useEffect(() => {
    dispatch({
      type: authConstants.LOGIN_FAILURE,
      payload: { error: null },
    });
  }, [dispatch]);

  const handleSignIn = (e) => {
    e.preventDefault();

    setLocalError("");

    if (!username || !password) {
      setLocalError("All fields are required");
      return;
    }
    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters long");
      return;
    }

    const user = { username, password };

    dispatch(login(user, navigate));
  };

  const handleInput = (setter) => (e) => {
    setter(e.target.value);
    if (localError) setLocalError("");
  };

  useEffect(() => {
    if (auth.authenticate) {
      navigate("/");
    }
  }, [auth.authenticate, navigate]);

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
            <LockOutlinedIcon fontSize="large" />
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
            Welcome Back
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Sign in to access your account
          </Typography>

          <Box
            component="form"
            onSubmit={handleSignIn}
            sx={{
              width: "100%",
              mt: 1,
              display: "flex",
              flexDirection: "column",
              gap: 2.5,
            }}
          >
            {(localError || auth.error) && (
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
              disabled={auth.authenticating}
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
              {auth.authenticating ? (
                <CircularProgress size={24} style={{ color: "white" }} />
              ) : (
                "Sign In"
              )}
            </Button>

            <Grid container justifyContent="center">
              <Grid item>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Don't have an account?
                  <span
                    style={{
                      color: "#0f2a1d",
                      fontWeight: "bold",
                      cursor: "pointer",
                      textDecoration: "underline",
                      textUnderlineOffset: "3px",
                      marginLeft: "5px",
                    }}
                    onClick={() => navigate("/signup")}
                  >
                    Sign Up
                  </span>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default SignIn;
