import {
  Box,
  Alert,
  InputAdornment,
  TextField,
  Button,
  IconButton,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PersonIcon from "@mui/icons-material/Person";
import { login } from "../../Actions/auth.actions";

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const auth = useSelector((state) => state.auth);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [localError, setLocalError] = useState("");

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
    <Box sx={{ pb: 5 }}>
      <Box
        sx={{
          fontSize: "30px",
          fontWeight: "bolder",
          backgroundColor: "#0f2a1d",
          color: "white",
          padding: "20px",
          textAlign: "center",
          mb: 4,
        }}
      >
        Sign In Page
      </Box>

      <Box
        component="form"
        onSubmit={handleSignIn}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
          maxWidth: "500px",
          margin: "0 auto",
          padding: "20px",
        }}
      >
        {(localError || auth.error) && (
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
          disabled={auth.authenticating}
          sx={{
            fontSize: 16,
            backgroundColor: "#0f2a1d",
            color: "white",
            padding: "12px 40px",
            marginTop: 2,
            borderRadius: "30px",
            "&:hover": { backgroundColor: "#1a4d33" },
            width: "50%",
          }}
        >
          {auth.authenticating ? (
            <CircularProgress size={24} style={{ color: "white" }} />
          ) : (
            "Sign In"
          )}
        </Button>

        <Typography variant="body2" sx={{ mt: 2 }}>
          Don't have an account?
          <span
            style={{
              color: "#0f2a1d",
              fontWeight: "bold",
              cursor: "pointer",
              marginLeft: "5px",
            }}
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </Typography>
      </Box>
    </Box>
  );
};

export default SignIn;
