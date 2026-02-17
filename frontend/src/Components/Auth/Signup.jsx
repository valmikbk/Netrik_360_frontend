import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import MeghanaLogo from "../Logo/Meghana_stone_logo.png";

const inputStyle = {
  mb: 2,
  input: { color: "#fff" },
  label: { color: "#c7d2fe" },
  "& label.Mui-focused": { color: "#a5b4fc" },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "rgba(255,255,255,0.35)",
    },
    "&:hover fieldset": {
      borderColor: "#818cf8",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#6366f1",
    },
    "& input:-webkit-autofill": {
      WebkitBoxShadow: "0 0 0 1000px #020617 inset",
      WebkitTextFillColor: "#fff",
      transition: "background-color 5000s ease-in-out 0s",
    },
  },
};

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    contact: "",
    role: "user",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    if (Object.values(form).some((v) => v.trim() === "")) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/signup/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Signup failed");
        return;
      }

      alert("Signup successful!");
    //   navigate("/login");
    } catch {
      alert("Server not reachable");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        px: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(120deg, #020617, #0f172a)",
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 440,
          borderRadius: 4,
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.15)",
          boxShadow: "0 30px 60px rgba(0,0,0,0.6)",
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          {/* Logo */}
          <Box
            sx={{
              width: 80,
              height: 80,
              mx: "auto",
              mb: 2,
              borderRadius: "50%",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={MeghanaLogo}
              alt="Meghana Stone Crusher"
              style={{ width: "90%", height: "90%", objectFit: "contain" }}
            />
          </Box>

          <Typography
            variant="h5"
            fontWeight={800}
            textAlign="center"
            color="#fff"
            mb={0.5}
          >
            Create Account
          </Typography>

          <Typography
            variant="body2"
            textAlign="center"
            color="rgba(255,255,255,0.65)"
            mb={3}
          >
            Register new user
          </Typography>

          <TextField
            fullWidth
            label="Full Name"
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            sx={inputStyle}
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            sx={inputStyle}
          />

          <TextField
            fullWidth
            label="Contact Number"
            name="contact"
            value={form.contact}
            onChange={handleChange}
            sx={inputStyle}
          />

          <TextField
            fullWidth
            type="password"
            label="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            sx={inputStyle}
          />

          <TextField
            select
            fullWidth
            label="Role"
            name="role"
            value={form.role}
            onChange={handleChange}
            sx={{
              ...inputStyle,
              "& .MuiSelect-icon": { color: "#c7d2fe" },
            }}
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="user">User</MenuItem>
          </TextField>

          <Button
            fullWidth
            size="large"
            onClick={handleSignup}
            sx={{
              mt: 1,
              py: 1.4,
              fontWeight: 800,
              borderRadius: 2,
              color: "#fff",
              background: "linear-gradient(90deg, #3b82f6, #7c3aed)",
              boxShadow: "0 15px 30px rgba(99,102,241,0.6)",
              "&:hover": {
                boxShadow: "0 20px 40px rgba(99,102,241,0.85)",
              },
            }}
          >
            SIGN UP
          </Button>

          {/* <Typography
            variant="caption"
            display="block"
            textAlign="center"
            mt={3}
            color="rgba(255,255,255,0.6)"
            sx={{ cursor: "pointer" }}
            onClick={() => navigate("/login")}
          >
            Already have an account? Login
          </Typography> */}
        </CardContent>
      </Card>
    </Box>
  );
}

export default Signup;
