import React, { useState, useEffect, useMemo } from "react";
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

function FuelIn() {
  const [fuels, setFuels] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  const [form, setForm] = useState({
    fuelId: "",
    vehicleId: "",
    date: new Date().toISOString().split("T")[0],
    liters: "",
    amount: "",
    billFile: null,
  });

  /* ---------------- FETCH MASTER DATA ---------------- */
  useEffect(() => {
    fetch("http://localhost:8000/api/fuels/")
      .then(res => res.json())
      .then(setFuels)
      .catch(console.error);

    fetch("http://localhost:8000/api/vehicles/")
      .then(res => res.json())
      .then(setVehicles)
      .catch(console.error);
  }, []);

  /* ---------------- AUTO CALCULATE PRICE/LITER ---------------- */
  const pricePerLiter = useMemo(() => {
    const liters = Number(form.liters);
    const amount = Number(form.amount);
    if (!liters || !amount) return "";
    return (amount / liters).toFixed(2);
  }, [form.liters, form.amount]);

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, billFile: e.target.files[0] });
  };

  /* ---------------- SAVE ---------------- */
  const handleSave = async () => {
    if (!form.fuelId || !form.vehicleId || !form.liters || !form.amount) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("fuel_id", form.fuelId);
      formData.append("vehicle_id", form.vehicleId);
      formData.append("date", form.date); // ✅ DATE INCLUDED
      formData.append("volume", form.liters);
      formData.append("price_per_liter", pricePerLiter);
      formData.append("total_amount", form.amount);

      if (form.billFile) {
        formData.append("bill_doc", form.billFile);
      }

      const res = await fetch(
        "http://localhost:8000/api/vehicle-fuel/create/",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to save fuel entry");
        return;
      }

      alert("Fuel entry added successfully");

      // Reset form
      setForm({
        fuelId: "",
        vehicleId: "",
        date: new Date().toISOString().split("T")[0],
        liters: "",
        amount: "",
        billFile: null,
      });

    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <Card sx={{ maxWidth: 900, mx: "auto", borderRadius: 3 }}>
      <Box px={3} py={2} sx={{ background: "linear-gradient(90deg, #1a237e, #283593)" }}>
        <Typography variant="h6" color="#fff" fontWeight={600} textAlign="center">
          FUEL IN
        </Typography>
      </Box>

      <Divider />

      <CardContent sx={{ px: 4, py: 3 }}>
        <Box display="flex" flexDirection="column" gap={3}>
          {/* Fuel */}
          <TextField
            select
            label="Fuel *"
            name="fuelId"
            value={form.fuelId}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="">
              <em>Select Fuel</em>
            </MenuItem>
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

          {/* Vehicle */}
          <TextField
            select
            label="Vehicle *"
            name="vehicleId"
            value={form.vehicleId}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="">
              <em>Select Vehicle</em>
            </MenuItem>
            {vehicles.map((v) => (
              <MenuItem key={v.id} value={v.id}>
                {v.vehicle_number}
              </MenuItem>
            ))}
          </TextField>

          {/* Liters */}
          <TextField
            label="Liters *"
            name="liters"
            value={form.liters}
            onChange={handleChange}
            fullWidth
          />

          {/* Total Amount */}
          <TextField
            label="Total Amount *"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            fullWidth
          />

          {/* Auto-calculated */}
          {/* <TextField
            label="Price / Liter"
            value={pricePerLiter}
            InputProps={{ readOnly: true }}
            fullWidth
          /> */}

          {/* Bill Upload */}
          <Box>
            <Button variant="outlined" component="label">
              Upload Fuel Bill
              <input
                type="file"
                hidden
                accept=".pdf,image/*"
                onChange={handleFileChange}
              />
            </Button>

            {form.billFile && (
              <Typography variant="body2" mt={1}>
                Selected File: <b>{form.billFile.name}</b>
              </Typography>
            )}
          </Box>
        </Box>

        <Box display="flex" justifyContent="flex-end" mt={4}>
          <Button variant="contained" sx={{ px: 4 }} onClick={handleSave}>
            SAVE &gt;&gt;
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default FuelIn;
