import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Header from "../Header/Header";

function Electricity() {
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    billNumber: "",
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
    const formData = new FormData();
    formData.append("date", form.date);
    formData.append("bill_number", form.billNumber);
    formData.append("amount", form.billAmount);
    formData.append("date", form.date);

    if (form.billFile) {
      formData.append("bill_doc", form.billFile);
    }

    try {
      const res = await fetch("http://localhost:8000/api/electricity/create/", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to save");
        return;
      }

      alert("Electricity bill saved successfully");
      setForm({
        date: new Date().toISOString().split("T")[0],
        billNumber: "",
        billAmount: "",
        billFile: null,
      });
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };


  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header />

      <Box sx={{ flexGrow: 1, overflow: "auto", p: 3, mt:10 }}>
        <Card
          sx={{
            maxWidth: 900,
            mx: "auto",
            borderRadius: 3,
            boxShadow: "0px 10px 30px rgba(0,0,0,0.25)",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 3,
              py: 2,
              background: "linear-gradient(90deg, #1a237e, #283593)",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, textAlign: "center", width: "100%", color: "#fff" }}>
              ELECTRICITY ENTRY
            </Typography>

            {/* <IconButton>
              <CloseIcon />
            </IconButton> */}
          </Box>

          <Divider />

          {/* Form */}
          <CardContent sx={{ px: 4, py: 3 }}>
            <Box display="flex" flexDirection="column" gap={3}>
              <TextField
                label="Date *"
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />

              <TextField
                label="Bill Number *"
                name="billNumber"
                value={form.billNumber}
                onChange={handleChange}
                fullWidth
              />

              <TextField
                label="Bill Amount *"
                name="billAmount"
                value={form.billAmount}
                onChange={handleChange}
                fullWidth
              />

              {/* Upload Electricity Bill */}
              <Box>
                <Button
                  variant="outlined"
                  component="label"
                >
                  Upload Electricity Bill
                  <input
                    type="file"
                    hidden
                    accept=".pdf,image/*"
                    onChange={handleFileChange}
                  />
                </Button>

                {form.billFile && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Selected File: <b>{form.billFile.name}</b>
                  </Typography>
                )}
              </Box>
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
                sx={{
                  px: 4,
                  backgroundColor: "#2962ff",
                  "&:hover": { backgroundColor: "#0039cb" },
                }}
                onClick={handleSave}
              >
                SAVE &gt;&gt;
              </Button>

              {/* <Button variant="contained" color="inherit" sx={{ px: 4 }}>
                CLOSE
              </Button> */}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default Electricity;
