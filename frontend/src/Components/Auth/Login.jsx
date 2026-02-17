import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  LockRounded,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import MeghanaLogo from "../Logo/Meghana_stone_logo.png";


function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.username,
        password: form.password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Login failed");
      return;
    }

    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("isLoggedIn", "true");

    navigate("/");
  } catch {
    alert("Server not reachable");
  }
};



  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(120deg, #020617, #020617, #0f172a)",
      }}
    >
      {/* Animated gradient layer */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(270deg, #2563eb, #7c3aed, #2563eb)",
          backgroundSize: "600% 600%",
          opacity: 0.15,
          animation: "gradientMove 18s ease infinite",
        }}
      />

      {/* Floating glow blobs */}
      <Box
        sx={{
          position: "absolute",
          width: 420,
          height: 420,
          background: "radial-gradient(circle, #3b82f6, transparent 70%)",
          top: "-120px",
          left: "-120px",
          filter: "blur(80px)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: 420,
          height: 420,
          background: "radial-gradient(circle, #8b5cf6, transparent 70%)",
          bottom: "-140px",
          right: "-140px",
          filter: "blur(80px)",
        }}
      />

      {/* Login Card */}
      <Card
        sx={{
          width: 400,
          borderRadius: 4,
          position: "relative",
          zIndex: 2,
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(18px)",
          border: "1px solid rgba(255,255,255,0.15)",
          boxShadow:
            "0 30px 60px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.05)",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Icon */}
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              mx: "auto",
              mb: 2.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                "linear-gradient(135deg, #3b82f6, #7c3aed)",
              boxShadow: "0 0 35px rgba(99,102,241,0.8)",
              p: 1.2,
            }}
          >
            <Box
              component="img"
              src={MeghanaLogo}
              alt="Meghana Stone Crusher"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                borderRadius: "50%",
                backgroundColor: "#fff",
                p: 0.5,
              }}
            />
          </Box>

          <Typography
            variant="h5"
            fontWeight={800}
            textAlign="center"
            color="#fff"
          >
            Meghana Stone Crusher
          </Typography>

          <Typography
            variant="body2"
            textAlign="center"
            color="rgba(255,255,255,0.7)"
            mb={3}
          >
            Sign in to access your dashboard
          </Typography>

          <TextField
            fullWidth
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            sx={{
              mb: 2,
              input: { color: "#fff" },
              label: { color: "#c7d2fe" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "rgba(255,255,255,0.3)",
                },
                "&:hover fieldset": {
                  borderColor: "#818cf8",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#6366f1",
                },
              },
            }}
          />

          <TextField
            fullWidth
            type={showPassword ? "text" : "password"}
            label="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            sx={{
              mb: 3,
              input: { color: "#fff" },
              label: { color: "#c7d2fe" },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    sx={{ color: "#c7d2fe" }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            fullWidth
            size="large"
            onClick={handleLogin}
            sx={{
              py: 1.4,
              fontWeight: 800,
              letterSpacing: 1,
              borderRadius: 2,
              color: "#fff",
              background:
                "linear-gradient(90deg, #3b82f6, #7c3aed)",
              boxShadow:
                "0 15px 30px rgba(99,102,241,0.6)",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow:
                  "0 20px 40px rgba(99,102,241,0.9)",
              },
              transition: "0.3s",
            }}
          >
            LOGIN
          </Button>

          <Typography
            variant="caption"
            display="block"
            textAlign="center"
            mt={3}
            color="rgba(255,255,255,0.5)"
          >
            © {new Date().getFullYear()} Secure System
          </Typography>
        </CardContent>
      </Card>

      {/* Animations */}
      <style>
        {`
          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
    </Box>
  );
}

export default Login;
