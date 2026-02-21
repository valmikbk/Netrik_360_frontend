import React, { useEffect, useState } from "react";
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

function FuelOut() {
  const [form, setForm] = useState({
    fuel_id: "",
    vehicle_id: "",
    village_id: "",
    entry_type: "",
    date: new Date().toISOString().split("T")[0],
    liters: "",
    distance_travelled: "",
  });

  const [fuels, setFuels] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [villages, setVillages] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    fetch("http://localhost:8000/api/fuels/")
      .then((res) => res.json())
      .then(setFuels)
      .catch(() => alert("Failed to load fuels"));

    fetch("http://localhost:8000/api/vehicles/")
      .then((res) => res.json())
      .then(setVehicles)
      .catch(() => alert("Failed to load vehicles"));

    fetch("http://localhost:8000/api/villages/")
      .then((res) => res.json())
      .then(setVillages)
      .catch(() => alert("Failed to load villages"));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ---------------- SAVE ---------------- */
  const handleSave = async () => {
    const {
      fuel_id,
      vehicle_id,
      village_id,
      entry_type,
      liters,
      distance_travelled,
    } = form;

    if (
      !fuel_id ||
      !vehicle_id ||
      !village_id ||
      !entry_type ||
      !liters ||
      !distance_travelled
    ) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:8000/api/fuel-out/create/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form }),
        }
      );

      if (!res.ok) {
        alert("Failed to save");
        return;
      }

      alert("Fuel out entry saved successfully");

      setForm({
        fuel_id: "",
        vehicle_id: "",
        village_id: "",
        entry_type: "",
        date: new Date().toISOString().split("T")[0],
        liters: "",
        distance_travelled: "",
      });
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= INDUSTRIAL LABEL STYLE ================= */
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
        boxShadow: "0px 10px 30px rgba(0,0,0,0.25)",
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
          FUEL OUT
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
          
          {/* FUEL */}
          <Box display="flex" alignItems="center" gap={3}>
            <Box sx={labelStyle}>FUEL *</Box>
            <TextField
              select
              name="fuel_id"
              value={form.fuel_id}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value=""><em>Select Fuel</em></MenuItem>
              {fuels.map((fuel) => (
                <MenuItem key={fuel.id} value={fuel.id}>
                  {fuel.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {/* DATE */}
          <Box display="flex" alignItems="center" gap={3}>
            <Box sx={labelStyle}>DATE *</Box>
            <TextField
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              fullWidth
            />
          </Box>

          {/* LITERS */}
          <Box display="flex" alignItems="center" gap={3}>
            <Box sx={labelStyle}>FUEL CONSUMED (LITERS) *</Box>
            <TextField
              name="liters"
              value={form.liters}
              onChange={handleChange}
              type="number"
              fullWidth
            />
          </Box>

          {/* DISTANCE */}
          <Box display="flex" alignItems="center" gap={3}>
            <Box sx={labelStyle}>DISTANCE TRAVELLED (KM) *</Box>
            <TextField
              name="distance_travelled"
              value={form.distance_travelled}
              onChange={handleChange}
              type="number"
              fullWidth
            />
          </Box>

          {/* VEHICLE */}
          <Box display="flex" alignItems="center" gap={3}>
            <Box sx={labelStyle}>VEHICLE *</Box>
            <TextField
              select
              name="vehicle_id"
              value={form.vehicle_id}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value=""><em>Select Vehicle</em></MenuItem>
              {vehicles.map((vehicle) => (
                <MenuItem key={vehicle.id} value={vehicle.id}>
                  {vehicle.vehicle_number}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {/* VILLAGE */}
          <Box display="flex" alignItems="center" gap={3}>
            <Box sx={labelStyle}>VILLAGE *</Box>
            <TextField
              select
              name="village_id"
              value={form.village_id}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value=""><em>Select Village</em></MenuItem>
              {villages.map((village) => (
                <MenuItem key={village.id} value={village.id}>
                  {village.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {/* ENTRY TYPE */}
          <Box display="flex" alignItems="center" gap={3}>
            <Box sx={labelStyle}>ENTRY TYPE *</Box>
            <TextField
              select
              name="entry_type"
              value={form.entry_type}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value=""><em>Select Type</em></MenuItem>
              <MenuItem value="sale">SALE</MenuItem>
              <MenuItem value="purchase">RAW MATERIAL</MenuItem>
            </TextField>
          </Box>
        </Box>

        <Box sx={{ flexGrow: 1, mt:2 }} />

        <Box display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            sx={{
              px: 6,
              backgroundColor: "#2962ff",
              "&:hover": { backgroundColor: "#0039cb" },
            }}
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "SAVE >>"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default FuelOut;
