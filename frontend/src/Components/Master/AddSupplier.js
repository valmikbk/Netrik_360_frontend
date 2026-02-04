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
  const [success, setSuccess] = useState("");

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
    setSuccess("");
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!form.supplierName || !form.phone) {
      setError("Supplier name and phone are required");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/suppliers/create/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
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

      setSuccess("Supplier added successfully ✅");
      handleReset();
    } catch (err) {
      setError("Server error. Please try again.");
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
        boxShadow: "0px 10px 30px rgba(0,0,0,0.2)",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 3,
          py: 2,
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
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

      {/* Form */}
      <CardContent sx={{ px: 4, py: 3 }}>
        <Box display="flex" flexDirection="column" gap={3}>
          <TextField
            label="Supplier Name *"
            name="supplierName"
            value={form.supplierName}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Address"
            name="address"
            value={form.address}
            onChange={handleChange}
            fullWidth
            multiline
            rows={2}
          />

          <TextField
            label="Phone No *"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="GSTIN"
            name="gstin"
            value={form.gstin}
            onChange={handleChange}
            fullWidth
          />

          {/* ERROR / SUCCESS */}
          {error && (
            <Typography color="error" fontSize={14}>
              {error}
            </Typography>
          )}

          {success && (
            <Typography color="success.main" fontSize={14}>
              {success}
            </Typography>
          )}
        </Box>

        {/* Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            mt: 4,
          }}
        >
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
          >
            RESET
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default AddSupplier;
