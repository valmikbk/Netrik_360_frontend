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
import Header from "../Header/Header";
import { useNavigate } from "react-router-dom";

function AddVillage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    approximateDistance: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleReset = () => {
    setForm({
      name: "",
      approximateDistance: "",
    });
  };

  const handleSubmit = async () => {
    const missing = [];

    if (!form.name) missing.push("Village Name");

    if (!form.approximateDistance || Number(form.approximateDistance) <= 0) {
      missing.push("Valid Approximate Distance");
    }

    if (missing.length > 0) {
      alert("Missing Fields: " + missing.join(", "));
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8000/api/vehicle-village/create/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "VILLAGE",
            nameOrNumber: form.name,
            approximateDistance: form.approximateDistance,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to save village");
        return;
      }

      alert(data.message || "Village added successfully");
      navigate("/invoice-generation");

      // setForm({
      //   name: "",
      //   approximateDistance: "",
      // });

    } catch (error) {
      console.error(error);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  /* ===== ERP LABEL STYLE ===== */
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
            minHeight: "70vh",
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
              ADD VILLAGE
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

              {/* VILLAGE NAME */}
              <Box display="flex" alignItems="center" gap={3}>
                <Box sx={labelStyle}>VILLAGE NAME *</Box>
                <TextField
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  fullWidth
                />
              </Box>

              {/* DISTANCE */}
              <Box display="flex" alignItems="center" gap={3}>
                <Box sx={labelStyle}>APPROX DISTANCE (KM) *</Box>
                <TextField
                  name="approximateDistance"
                  type="number"
                  value={form.approximateDistance}
                  onChange={handleChange}
                  fullWidth
                />
              </Box>

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
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Saving..." : "SAVE"}
              </Button>

              <Button
                variant="outlined"
                sx={{ px: 6 }}
                onClick={handleReset}
                disabled={loading}
              >
                RESET
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default AddVillage;