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
    km: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setForm({
      type: "VEHICLE",
      nameOrNumber: "",
      km: "",
    });
  };

  const handleSubmit = async () => {
    if (!form.nameOrNumber) {
      alert("Please fill required fields");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8000/api/vehicle-village/create/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to save");
        return;
      }

      alert(data.message);
      handleReset();
    } catch (error) {
      console.error(error);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  const isVehicle = form.type === "VEHICLE";

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
      <Box sx={{ px: 3, py: 2, background: "linear-gradient(90deg, #1a237e, #283593)", }}>
        <Typography variant="h6" color="#fff" fontWeight={600} textAlign="center">
          ADD VEHICLE / VILLAGES
        </Typography>
      </Box>

      <Divider />

      {/* Form */}
      <CardContent sx={{ px: 4, py: 3 }}>
        <Box display="flex" flexDirection="column" gap={3}>
          <TextField
            select
            label="Select Type *"
            name="type"
            value={form.type}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="VEHICLE">VEHICLE</MenuItem>
            <MenuItem value="VILLAGE">VILLAGE</MenuItem>
          </TextField>

          <TextField
            label={isVehicle ? "Vehicle Number *" : "Village Name *"}
            name="nameOrNumber"
            value={form.nameOrNumber}
            onChange={handleChange}
            fullWidth
          />

          {/* {isVehicle && (
            <TextField
              label="KM"
              name="km"
              value={form.km}
              onChange={handleChange}
              fullWidth
            />
          )} */}
        </Box>

        {/* Actions */}
        <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
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

export default AddVehicleVillages;
