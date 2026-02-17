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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setForm({
      employeeName: "",
      type: "WORKER",
      salary: "",
    });
  };

  const handleSubmit = async () => {
    if (!form.employeeName || !form.salary) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8000/api/employees/create/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
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
        alert("Failed to add employee");
        return;
      }

      alert("Employee added successfully✅");
      handleReset();
    } catch (error) {
      console.error("Network Error:", error);
      alert("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      sx={{
        maxWidth: 900,
        mx: "auto",
        borderRadius: 3,
        boxShadow: "0px 10px 30px rgba(0,0,0,0.2)",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 3,
          py: 2,
          background: "linear-gradient(90deg, #1a237e, #283593)",
        }}
      >
        <Typography variant="h6"  fontWeight={600} color="#fff">
          ADD EMPLOYEE
        </Typography>
      </Box>

      <Divider />

      {/* Form */}
      <CardContent sx={{ px: 4, py: 3 }}>
        <Box display="flex" flexDirection="column" gap={3}>
          <TextField
            label="Employee Name *"
            name="employeeName"
            value={form.employeeName}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            select
            label="Type *"
            name="type"
            value={form.type}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="WORKER">WORKER</MenuItem>
            <MenuItem value="MR">MR</MenuItem>
          </TextField>

          <TextField
            label="Salary *"
            name="salary"
            value={form.salary}
            onChange={handleChange}
            fullWidth
          />
        </Box>

        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            mt: 4,
          }}
        >
          <Button
            variant="contained"
            sx={{
              px: 4,
              backgroundColor: "#2962ff",
              "&:hover": { backgroundColor: "#0039cb" },
            }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : "ADD >>"}
          </Button>

          <Button
            variant="contained"
            color="inherit"
            sx={{ px: 4 }}
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
