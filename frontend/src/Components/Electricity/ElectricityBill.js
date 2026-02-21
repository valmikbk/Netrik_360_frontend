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
import Header from "../Header/Header";

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

function Electricity() {
  const currentYear = new Date().getFullYear();

  const [form, setForm] = useState({
    year: currentYear,
    month: "",
    billAmount: "",
    billFile: null,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, billFile: e.target.files[0] });
  };

  const handleSave = async () => {
    const missingFields = [];

    if (!form.year) missingFields.push("Year");
    if (!form.month) missingFields.push("Month");
    if (!form.billAmount || Number(form.billAmount) <= 0)
      missingFields.push("Valid Bill Amount");

    if (missingFields.length > 0) {
      alert("Missing / Invalid Fields: " + missingFields.join(", "));
      return;
    }

    const formData = new FormData();
    formData.append("year", form.year);
    formData.append("month", form.month);
    formData.append("amount", form.billAmount);

    if (form.billFile) {
      formData.append("bill_doc", form.billFile);
    }

    try {
      const res = await fetch(
        "http://localhost:8000/api/electricity/create/",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        alert("Failed to save");
        return;
      }

      alert("Electricity bill saved successfully");

      setForm({
        year: currentYear,
        month: "",
        billAmount: "",
        billFile: null,
      });
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
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header />

      <Box sx={{ flexGrow: 1, p: 3, mt: 4 }}>
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
              sx={{ fontWeight: 600, textAlign: "center", color: "#fff" }}
            >
              ELECTRICITY ENTRY
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

              {/* YEAR */}
              <Box display="flex" alignItems="center" gap={3}>
                <Box sx={labelStyle}>YEAR *</Box>
                <TextField
                  select
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  fullWidth
                >
                  {[currentYear - 1, currentYear, currentYear + 1].map(
                    (y) => (
                      <MenuItem key={y} value={y}>
                        {y}
                      </MenuItem>
                    )
                  )}
                </TextField>
              </Box>

              {/* MONTH */}
              <Box display="flex" alignItems="center" gap={3}>
                <Box sx={labelStyle}>MONTH *</Box>
                <TextField
                  select
                  name="month"
                  value={form.month}
                  onChange={handleChange}
                  fullWidth
                >
                  {months.map((m) => (
                    <MenuItem key={m} value={m}>
                      {m}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              {/* BILL AMOUNT */}
              <Box display="flex" alignItems="center" gap={3}>
                <Box sx={labelStyle}>BILL AMOUNT *</Box>
                <TextField
                  name="billAmount"
                  value={form.billAmount}
                  onChange={handleChange}
                  type="number"
                  fullWidth
                />
              </Box>

              {/* FILE UPLOAD */}
              <Box display="flex" alignItems="center" gap={3}>
                <Box sx={labelStyle}>BILL FILE</Box>
                <Button variant="outlined" component="label">
                  Upload Electricity Bill
                  <input
                    type="file"
                    hidden
                    accept=".pdf,image/*"
                    onChange={handleFileChange}
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

export default Electricity;