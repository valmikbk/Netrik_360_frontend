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

function AddVehicleVillages() {
  const [form, setForm] = useState({
    type: "VEHICLE",
    nameOrNumber: "",
    approximateDistance: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setForm({
      type: "VEHICLE",
      nameOrNumber: "",
      approximateDistance: "",
    });
    setError("");
  };

  const handleSubmit = async () => {
    setError("");

    if (!form.nameOrNumber) {
      setError("Please fill required fields");
      return;
    }

    if (form.type === "VILLAGE" && !form.approximateDistance) {
      setError("Please enter approximate distance");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8000/api/vehicle-village/create/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to save");
        return;
      }

      alert(data.message);
      handleReset();
    } catch (error) {
      console.error(error);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  const isVehicle = form.type === "VEHICLE";
  const isVillage = form.type === "VILLAGE";

  /* 🔥 INDUSTRIAL FIXED LABEL STYLE */
  const labelStyle = {
    width: 240,
    minWidth: 240,
    maxWidth: 240,
    flex: "0 0 240px",
    height: 56,
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
          ADD VEHICLE / VILLAGES
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

          {/* TYPE */}
          <Box display="flex" alignItems="center" gap={2}>
            <Box sx={labelStyle}>SELECT TYPE *</Box>
            <TextField
              select
              name="type"
              value={form.type}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="VEHICLE">VEHICLE</MenuItem>
              <MenuItem value="VILLAGE">VILLAGE</MenuItem>
            </TextField>
          </Box>

          {/* NAME / NUMBER */}
          <Box display="flex" alignItems="center" gap={2}>
            <Box sx={labelStyle}>
              {isVehicle ? "VEHICLE NUMBER *" : "VILLAGE NAME *"}
            </Box>
            <TextField
              name="nameOrNumber"
              value={form.nameOrNumber}
              onChange={handleChange}
              fullWidth
            />
          </Box>

          {/* APPROX DISTANCE (ONLY IF VILLAGE) */}
          {isVillage && (
            <Box display="flex" alignItems="center" gap={2}>
              <Box sx={labelStyle}>APPROX DISTANCE (KM) *</Box>
              <TextField
                name="approximateDistance"
                value={form.approximateDistance}
                onChange={handleChange}
                type="number"
                fullWidth
              />
            </Box>
          )}

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

export default AddVehicleVillages;
