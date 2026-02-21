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

function TotalFuelIn() {
  const [fuels, setFuels] = useState([]);

  const [form, setForm] = useState({
    fuelId: "",
    date: new Date().toISOString().split("T")[0],
    liters: "",
    amount: "",
    billFile: null,
  });

  /* ---------------- FETCH MASTER DATA ---------------- */
  useEffect(() => {
    fetch("http://localhost:8000/api/fuels/")
      .then((res) => res.json())
      .then(setFuels)
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

  /* ---------------- SAVE ---------------- */
  const handleSave = async () => {
    if (!form.fuelId || !form.liters || !form.amount) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("fuel_id", form.fuelId);
      formData.append("date", form.date);
      formData.append("volume", form.liters);
      formData.append("total_amount", form.amount);

      const res = await fetch(
        "http://localhost:8000/api/fuel-purchase/create/",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        alert("Failed to save fuel entry");
        return;
      }

      alert("Fuel entry added successfully");

      setForm({
        fuelId: "",
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
          FUEL IN
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
            <Box sx={labelStyle}>LITERS *</Box>
            <TextField
              name="liters"
              value={form.liters}
              onChange={handleChange}
              type="number"
              fullWidth
            />
          </Box>

          {/* TOTAL AMOUNT */}
          <Box display="flex" alignItems="center" gap={3}>
            <Box sx={labelStyle}>TOTAL AMOUNT *</Box>
            <TextField
              name="amount"
              value={form.amount}
              onChange={handleChange}
              type="number"
              fullWidth
            />
          </Box>

          {/* OPTIONAL PRICE PER LITER (if you want back) */}
          {/* 
          <Box display="flex" alignItems="center" gap={3}>
            <Box sx={labelStyle}>PRICE / LITER</Box>
            <TextField
              value={pricePerLiter}
              InputProps={{ readOnly: true }}
              fullWidth
            />
          </Box> 
          */}

        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Box display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            sx={{
              px: 6,
              backgroundColor: "#2962ff",
              "&:hover": { backgroundColor: "#0039cb" },
            }}
            onClick={handleSave}
          >
            SAVE &gt;&gt;
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default TotalFuelIn;
