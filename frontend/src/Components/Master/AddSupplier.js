import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Divider,
} from "@mui/material";

function AddSupplier() {
  const [form, setForm] = useState({
    supplierName: "",
    address: "",
    phone: "",
    gstin: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setForm({
      supplierName: "",
      address: "",
      phone: "",
      gstin: "",
    });
    setError("");
  };

  const handleSubmit = async () => {
    setError("");

    if (!form.supplierName || !form.address || !form.phone) {
      setError("Supplier name, address, and phone are required");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/suppliers/create/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.supplierName,
            contact: form.phone,
            address: form.address,
            gstin: form.gstin || null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data?.errors
            ? JSON.stringify(data.errors)
            : "Failed to create supplier"
        );
        setLoading(false);
        return;
      }

      alert("Supplier added successfully ✅");
      handleReset();
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* 🔥 FIXED INDUSTRIAL LABEL STYLE */
  const labelStyle = {
    width: 240,
    minWidth: 240,
    maxWidth: 240,
    flex: "0 0 240px",
    height: 56, // match default TextField height
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
          ADD SUPPLIER
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

          {/* SUPPLIER NAME */}
          <Box display="flex" alignItems="center" gap={2}>
            <Box sx={labelStyle}>SUPPLIER NAME *</Box>
            <TextField
              name="supplierName"
              value={form.supplierName}
              onChange={handleChange}
              fullWidth
            />
          </Box>

          {/* ADDRESS */}
          <Box display="flex" alignItems="center" gap={2}>
            <Box sx={labelStyle}>ADDRESS *</Box>
            <TextField
              name="address"
              value={form.address}
              onChange={handleChange}
              fullWidth
              multiline
              rows={2}
            />
          </Box>

          {/* PHONE */}
          <Box display="flex" alignItems="center" gap={2}>
            <Box sx={labelStyle}>PHONE NO *</Box>
            <TextField
              name="phone"
              value={form.phone}
              onChange={handleChange}
              fullWidth
            />
          </Box>

          {/* GSTIN */}
          <Box display="flex" alignItems="center" gap={2}>
            <Box sx={labelStyle}>GSTIN</Box>
            <TextField
              name="gstin"
              value={form.gstin}
              onChange={handleChange}
              fullWidth
            />
          </Box>

          {/* ERROR MESSAGE */}
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
          >
            RESET
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default AddSupplier;
