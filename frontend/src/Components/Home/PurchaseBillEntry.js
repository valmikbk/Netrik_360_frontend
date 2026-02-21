import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";

function PurchaseBillEntry() {
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState("");

  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    brass: "",
    billFile: null,
  });

  useEffect(() => {
    fetch("http://localhost:8000/api/vehicles/")
      .then((res) => res.json())
      .then((data) => setVehicles(data))
      .catch((err) => console.error("Vehicle fetch error", err));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  const handleSave = async () => {
    if (!form.date || !selectedVehicleId || !form.brass) {
      alert("Please fill required fields");
      return;
    }

    const formData = new FormData();
    formData.append("date", form.date);
    formData.append("vehicle", selectedVehicleId);
    formData.append("quantity", form.brass);
    formData.append("is_active", true);

    if (form.billFile) {
      formData.append("bill_doc", form.billFile);
    }

    try {
      const res = await fetch(
        "http://localhost:8000/api/purchase/create/",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        alert("Failed to save");
        return;
      }

      alert("Purchase Bill Saved Successfully");
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  /* ================= ERP LABEL STYLE ================= */
  const labelStyle = {
    width: 240,
    minWidth: 240,
    maxWidth: 240,
    height: 56,
    flex: "0 0 240px",
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
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />

      <Box sx={{ flexGrow: 1, p: 3, mt: 4 }}>
        <Card
          sx={{
            width: "98%",
            mx: "auto",
            minHeight: "80vh",
            borderRadius: 3,
            boxShadow: "0px 10px 30px rgba(0,0,0,0.15)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* HEADER STRIP */}
          <Box
            sx={{
              px: 3,
              py: 2,
              background: "linear-gradient(90deg, #1a237e, #283593)",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, textAlign: "center", color: "#fff" }}
            >
              RAW MATERIAL ENTRY
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

              {/* DATE */}
              <Box display="flex" alignItems="center" gap={3}>
                <Box sx={labelStyle}>DATE *</Box>
                <TextField
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  fullWidth
                  sx={{ height: 56 }}
                />
              </Box>

              {/* VEHICLE */}
              <Box display="flex" alignItems="center" gap={3}>
                <Box sx={labelStyle}>VEHICLE *</Box>
                <TextField
                  select
                  value={selectedVehicleId}
                  onChange={(e) => setSelectedVehicleId(e.target.value)}
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
              </Box>

              {/* QUANTITY */}
              <Box display="flex" alignItems="center" gap={3}>
                <Box sx={labelStyle}>BRASS *</Box>
                <TextField
                  name="brass"
                  value={form.brass}
                  onChange={handleChange}
                  type="number"
                  fullWidth
                />
              </Box>

              {/* FILE */}
              <Box display="flex" alignItems="center" gap={3}>
                <Box sx={labelStyle}>BILL FILE</Box>
                <Button variant="outlined" component="label">
                  Upload Bill
                  <input
                    hidden
                    type="file"
                    name="billFile"
                    accept=".pdf,image/*"
                    onChange={handleChange}
                  />
                </Button>
              </Box>

              {form.billFile && (
                <Typography variant="body2">
                  Selected File: <b>{form.billFile.name}</b>
                </Typography>
              )}

            </Box>

            <Box sx={{ flexGrow: 1 }} />

            {/* ACTION BUTTONS */}
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button
                variant="contained"
                sx={{
                  px: 6,
                  backgroundColor: "#2962ff",
                  "&:hover": { backgroundColor: "#0039cb" },
                }}
                onClick={handleSave}
              >
                SAVE
              </Button>

              <Button
                variant="outlined"
                sx={{ px: 6 }}
                onClick={() => navigate(-1)}
              >
                CLOSE
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default PurchaseBillEntry;