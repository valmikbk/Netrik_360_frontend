import React, { useState, useEffect } from "react";
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

function BlastingPayments() {
  const [form, setForm] = useState({
    partyId: "",
    date: new Date().toISOString().split("T")[0],
    paidAmount: "",
  });

  const [suppliers, setSuppliers] = useState([]);
  const [outstanding, setOutstanding] = useState(null);

  /* ================= FETCH SUPPLIERS ================= */
  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/suppliers/");
      const data = await res.json();
      setSuppliers(data);
    } catch (err) {
      console.error("Failed to fetch suppliers", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSupplierChange = async (supplierId) => {
    setForm((prev) => ({ ...prev, partyId: supplierId }));

    if (!supplierId) {
      setOutstanding(null);
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8000/api/blasting/outstanding/${supplierId}/`
      );
      const data = await res.json();
      setOutstanding(data);
    } catch (err) {
      console.error("Outstanding fetch error", err);
    }
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    const missingFields = [];

    if (!form.partyId) missingFields.push("Supplier");
    if (!form.date) missingFields.push("Date");
    if (!form.paidAmount || Number(form.paidAmount) <= 0)
      missingFields.push("Valid Paid Amount");

    if (missingFields.length > 0) {
      alert("Missing Fields: " + missingFields.join(", "));
      return;
    }

    if (!outstanding || Number(outstanding.total_blasting) <= 0) {
      alert("Payment not allowed. Total blasting amount is zero.");
      return;
    }

    if (Number(outstanding.outstanding) <= 0) {
      alert("No outstanding amount for this supplier.");
      return;
    }

    if (Number(form.paidAmount) > Number(outstanding.outstanding)) {
      alert("Payment amount cannot exceed outstanding balance.");
      return;
    }

    try {
      const payload = {
        supplier: form.partyId,
        paid_amount: Number(form.paidAmount),
        date: form.date,
      };

      const res = await fetch(
        "http://localhost:8000/api/blasting-payments/create/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        alert("Failed to save payment");
        return;
      }

      alert("Blasting payment saved successfully");

      setForm({
        partyId: "",
        date: new Date().toISOString().split("T")[0],
        paidAmount: "",
      });

      setOutstanding(null);
    } catch (error) {
      console.error("Payment error:", error);
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
          BLASTING PAID PAYMENTS
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
          
          {/* SUPPLIER */}
          <Box display="flex" alignItems="center" gap={3}>
            <Box sx={labelStyle}>SUPPLIER NAME *</Box>
            <TextField
              select
              value={form.partyId}
              onChange={(e) => handleSupplierChange(e.target.value)}
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

          {/* OUTSTANDING INFO */}
          {outstanding && (
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                backgroundColor: "#f8fafc",
                border: "1px solid #e2e8f0",
              }}
            >
              <Typography variant="body2">
                TOTAL BLASTING AMOUNT: <b>₹ {outstanding.total_blasting}</b>
              </Typography>

              <Typography variant="body2" color="success.main">
                TOTAL PAID: <b>₹ {outstanding.total_paid}</b>
              </Typography>

              <Typography
                variant="h6"
                fontWeight={700}
                color={
                  outstanding.outstanding > 0
                    ? "error.main"
                    : "success.main"
                }
              >
                OUTSTANDING: ₹ {outstanding.outstanding}
              </Typography>
            </Box>
          )}

          {/* PAID AMOUNT */}
          <Box display="flex" alignItems="center" gap={3}>
            <Box sx={labelStyle}>PAID AMOUNT *</Box>
            <TextField
              name="paidAmount"
              value={form.paidAmount}
              onChange={handleChange}
              fullWidth
            />
          </Box>
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

export default BlastingPayments;
