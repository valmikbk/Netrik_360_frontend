import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Divider,
  MenuItem,
} from "@mui/material";

function AddEmployee() {
  const [form, setForm] = useState({
    employeeName: "",
    type: "WORKER",
    salary: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setForm({
      employeeName: "",
      type: "WORKER",
      salary: "",
    });
    setError("");
  };

  const handleSubmit = async () => {
    setError("");

    if (!form.employeeName || !form.salary) {
      setError("Employee name and salary are required");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8000/api/employees/create/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.employeeName,
            type: form.type,
            salary: form.salary,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("API Error:", data);
        setError("Failed to add employee");
        return;
      }

      alert("Employee added successfully ✅");
      handleReset();
    } catch (error) {
      console.error("Network Error:", error);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* 🔥 INDUSTRIAL FIXED LABEL STYLE */
  const labelStyle = {
    width: 240,
    minWidth: 240,
    maxWidth: 240,
    flex: "0 0 240px",
    height: 56, // match default TextField height
    background: "linear-gradient(145deg, #e3f2fd, #bbdefb)",
    border: "1px solid #90caf9",
    borderRadius: 1,
    px: 2,
    fontWeight: 600,
    fontSize: "0.9rem",
    display: "flex",
    alignItems: "center",
  };

  return (
    <Card
      sx={{
        width: "98%",
        mx: "auto",
        minHeight: "80vh",
        borderRadius: 3,
        boxShadow: "0px 10px 30px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          px: 3,
          py: 2,
          background: "linear-gradient(90deg, #1a237e, #283593)",
        }}
      >
        <Typography
          variant="h6"
          sx={{ color: "#fff", fontWeight: 600, textAlign: "center" }}
        >
          ADD EMPLOYEE
        </Typography>
      </Box>

      <Divider />

      <CardContent
        sx={{
          px: 8,
          py: 6,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box display="flex" flexDirection="column" gap={4}>

          {/* EMPLOYEE NAME */}
          <Box display="flex" alignItems="center" gap={2}>
            <Box sx={labelStyle}>EMPLOYEE NAME *</Box>
            <TextField
              name="employeeName"
              value={form.employeeName}
              onChange={handleChange}
              fullWidth
            />
          </Box>

          {/* TYPE */}
          <Box display="flex" alignItems="center" gap={2}>
            <Box sx={labelStyle}>TYPE *</Box>
            <TextField
              select
              name="type"
              value={form.type}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="WORKER">WORKER</MenuItem>
              <MenuItem value="MR">MR</MenuItem>
            </TextField>
          </Box>

          {/* SALARY */}
          <Box display="flex" alignItems="center" gap={2}>
            <Box sx={labelStyle}>SALARY *</Box>
            <TextField
              name="salary"
              value={form.salary}
              onChange={handleChange}
              fullWidth
            />
          </Box>

          {/* ERROR */}
          {error && (
            <Typography color="error" fontSize={14}>
              {error}
            </Typography>
          )}
        </Box>

        {/* PUSH BUTTONS DOWN */}
        <Box sx={{ flexGrow: 1 }} />

        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button
            variant="contained"
            disabled={loading}
            sx={{
              px: 6,
              backgroundColor: "#2962ff",
              "&:hover": { backgroundColor: "#0039cb" },
            }}
            onClick={handleSubmit}
          >
            {loading ? "Saving..." : "ADD >>"}
          </Button>

          <Button
            variant="contained"
            color="inherit"
            sx={{ px: 6 }}
            onClick={handleReset}
            disabled={loading}
          >
            RESET
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default AddEmployee;
