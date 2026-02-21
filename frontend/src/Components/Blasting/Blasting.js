import React, { useState, useMemo, useEffect } from "react";
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
import Header from "../Header/Header";

function Blasting() {
  const [form, setForm] = useState({
    supplierId: "",
    date: new Date().toISOString().split("T")[0],
    hole: "",
    feet: "",
    rate: "",
    billFile: null,
  });

  const [suppliers, setSuppliers] = useState([]);

  /* ================= FETCH SUPPLIERS ================= */
  useEffect(() => {
    fetch("http://localhost:8000/api/suppliers/")
      .then((res) => res.json())
      .then((data) => setSuppliers(data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, billFile: e.target.files[0] });
  };

  /* ================= AUTO GRAND TOTAL ================= */
  const grandTotal = useMemo(() => {
    const feet = Number(form.feet) || 0;
    const rate = Number(form.rate) || 0;
    const hole = Number(form.hole) || 0;
    return (feet * rate * hole).toFixed(2);
  }, [form.feet, form.rate, form.hole]);

  /* ================= SAVE ================= */
  const handleSave = async () => {
    const missingFields = [];

    if (!form.supplierId) missingFields.push("Supplier");
    if (!form.hole || Number(form.hole) <= 0) missingFields.push("Hole");
    if (!form.feet || Number(form.feet) <= 0) missingFields.push("Feet");
    if (!form.rate || Number(form.rate) <= 0) missingFields.push("Rate");

    if (missingFields.length > 0) {
      alert("Missing Fields: " + missingFields.join(", "));
      return;
    }

    try {
      const formData = new FormData();
      formData.append("supplier", form.supplierId);
      formData.append("hole", form.hole);
      formData.append("feet", form.feet);
      formData.append("rate", form.rate);
      formData.append("grandtotal_amount", grandTotal);
      formData.append("date", form.date);

      if (form.billFile) {
        formData.append("bill_doc", form.billFile);
      }

      const res = await fetch(
        "http://localhost:8000/api/blasting/create/",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        alert("Failed to save blasting entry");
        return;
      }

      alert("Blasting entry saved successfully");

      setForm({
        supplierId: "",
        date: new Date().toISOString().split("T")[0],
        hole: "",
        feet: "",
        rate: "",
        billFile: null,
      });
    } catch (error) {
      console.error("Save error:", error);
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
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />

      {/* ✅ Proper spacing below fixed header */}
      <Box
        sx={{
          flexGrow: 1,
          px: 5,
          mt: 6,   // 🔥 perfect spacing below 100px fixed header
          pb: 4,
        }}
      >
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
              BLASTING ENTRY
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
              
              <Box display="flex" alignItems="center" gap={3}>
                <Box sx={labelStyle}>SUPPLIER NAME *</Box>
                <TextField
                  select
                  name="supplierId"
                  value={form.supplierId}
                  onChange={handleChange}
                  fullWidth
                >
                  <MenuItem value="">
                    <em>Select Supplier</em>
                  </MenuItem>
                  {suppliers.map((sup) => (
                    <MenuItem key={sup.id} value={sup.id}>
                      {sup.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

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

              <Box display="flex" alignItems="center" gap={3}>
                <Box sx={labelStyle}>HOLE *</Box>
                <TextField name="hole" value={form.hole} onChange={handleChange} fullWidth />
              </Box>

              <Box display="flex" alignItems="center" gap={3}>
                <Box sx={labelStyle}>FEET *</Box>
                <TextField name="feet" value={form.feet} onChange={handleChange} fullWidth />
              </Box>

              <Box display="flex" alignItems="center" gap={3}>
                <Box sx={labelStyle}>RATE *</Box>
                <TextField name="rate" value={form.rate} onChange={handleChange} fullWidth />
              </Box>

              <Box display="flex" alignItems="center" gap={3}>
                <Box sx={labelStyle}>GRAND TOTAL</Box>
                <TextField value={grandTotal} fullWidth InputProps={{ readOnly: true }} />
              </Box>

              <Box display="flex" alignItems="center" gap={3}>
                <Box sx={labelStyle}>BILL</Box>
                <Button variant="outlined" component="label">
                  Upload Bill
                  <input type="file" hidden accept=".pdf,image/*" onChange={handleFileChange} />
                </Button>
              </Box>

              {form.billFile && (
                <Typography variant="body2">
                  Selected File: <b>{form.billFile.name}</b>
                </Typography>
              )}
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
      </Box>
    </Box>
  );
}

export default Blasting;
