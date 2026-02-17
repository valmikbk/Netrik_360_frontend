import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import Header from "../Header/Header";
import { useNavigate } from "react-router-dom";


function HomeAddCutomer() {

    const navigate = useNavigate();

  const [form, setForm] = useState({
    customerName: "",
    address: "",
    phone: "",
    gstin: "",
    // mrName: "",
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setForm({
      customerName: "",
      address: "",
      phone: "",
      gstin: "",
    //   mrName: "",
    });
  };

  const handleSubmit = async () => {
  // Basic validation
  if (!form.customerName || !form.phone || !form.address) {
    setToast({
      open: true,
      message: "Please fill all required fields",
      severity: "error",
    });
    return;
  }

  try {
    setLoading(true);

    const payload = {
      name: form.customerName,
      contact: form.phone,
      address: form.address,
      gstin: form.gstin || null,
    //   mr_name: form.mrName,
    };

    const res = await axios.post(
      "http://localhost:8000/api/customers/create/",
      payload
    );

    setToast({
      open: true,
      message: res.data.message || "Customer created successfully",
      severity: "success",
    });

    handleReset();

    // ✅ REDIRECT TO INVOICE PAGE AFTER SUCCESS
    setTimeout(() => {
      navigate("/invoice-generation");   // 🔁 change route if needed
    }, 800);

  } catch (error) {
    console.error(error);

    setToast({
      open: true,
      message:
        error?.response?.data?.message ||
        "Failed to create customer",
      severity: "error",
    });
  } finally {
    setLoading(false);
  }
};


  return (
    <Box sx={{ minHeight: "100vh", py: 4, backgroundColor: "#f5f5f5" }}>
    <Header />
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
            ADD CUSTOMER
          </Typography>
        </Box>

        <Divider />

        {/* Form */}
        <CardContent sx={{ px: 4, py: 3 }}>
          <Box display="flex" flexDirection="column" gap={3}>
            <TextField
              label="Customer Name *"
              name="customerName"
              value={form.customerName}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Address *"
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

            {/* <TextField
              label="MR Name *"
              name="mrName"
              value={form.mrName}
              onChange={handleChange}
              fullWidth
            /> */}
          </Box>

          {/* Action Buttons */}
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
              disabled={loading}
              sx={{
                px: 4,
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
              sx={{ px: 4 }}
              onClick={handleReset}
            >
              RESET
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={toast.severity}
          onClose={() => setToast({ ...toast, open: false })}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default HomeAddCutomer;
