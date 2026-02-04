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

  /* ---------------- FETCH FUELS ---------------- */
  useEffect(() => {
    fetch("http://localhost:8000/api/fuels/")
      .then((res) => res.json())
      .then((data) => setFuels(data))
      .catch(() => alert("Failed to load fuels"));
  }, []);

  /* ---------------- FETCH VEHICLES ---------------- */
  useEffect(() => {
    fetch("http://localhost:8000/api/vehicles/")
      .then((res) => res.json())
      .then((data) => setVehicles(data))
      .catch(() => alert("Failed to load vehicles"));
  }, []);

  /* ---------------- FETCH VILLAGES ---------------- */
  useEffect(() => {
    fetch("http://localhost:8000/api/villages/")
      .then((res) => res.json())
      .then((data) => setVillages(data))
      .catch(() => alert("Failed to load villages"));
  }, []);

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
          body: JSON.stringify({
            fuel_id,
            vehicle_id,
            village_id,
            entry_type,
            liters,
            distance_travelled,
            date: form.date,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to save");
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

  return (
    <Card
      sx={{
        maxWidth: 900,
        mx: "auto",
        borderRadius: 3,
        boxShadow: "0px 10px 30px rgba(0,0,0,0.25)",
      }}
    >
      {/* Header */}
      <Box sx={{ px: 3, py: 2, background: "linear-gradient(90deg, #1a237e, #283593)" }}>
        <Typography variant="h6" sx={{ fontWeight: 600, textAlign: "center", color: "#fff" }}>
          FUEL OUT
        </Typography>
      </Box>

      <Divider />

      {/* Form */}
      <CardContent sx={{ px: 4, py: 3 }}>
        <Box display="flex" flexDirection="column" gap={3}>

          {/* Fuel */}
          <TextField
            select
            label="Fuel *"
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

          {/* Date */}
          <TextField
            label="Date *"
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />

          {/* Liters */}
          <TextField
            label="Fuel Consumed (Liters) *"
            name="liters"
            value={form.liters}
            onChange={handleChange}
            type="number"
            fullWidth
          />

          {/* Distance */}
          <TextField
            label="Distance Travelled (km) *"
            name="distance_travelled"
            value={form.distance_travelled}
            onChange={handleChange}
            type="number"
            fullWidth
          />

          {/* Vehicle */}
          <TextField
            select
            label="Vehicle *"
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

          {/* Village */}
          <TextField
            select
            label="Village *"
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

          {/* Sale / Purchase */}
          <TextField
            select
            label="Entry Type *"
            name="entry_type"
            value={form.entry_type}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value=""><em>Select Type</em></MenuItem>
            <MenuItem value="sale">sale</MenuItem>
            <MenuItem value="purchase">purchase</MenuItem>
          </TextField>

        </Box>

        {/* Actions */}
        <Box display="flex" justifyContent="flex-end" mt={4}>
          <Button
            variant="contained"
            sx={{
              px: 4,
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
