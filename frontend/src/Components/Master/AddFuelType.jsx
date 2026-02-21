import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

function AddFuelType() {
  const [fuelName, setFuelName] = useState("");
  const [fuels, setFuels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---------------- FETCH FUELS ---------------- */
  const fetchFuels = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/fuels/");
      const data = await res.json();
      setFuels(data);
    } catch (err) {
      console.error("Error fetching fuels", err);
    }
  };

  useEffect(() => {
    fetchFuels();
  }, []);

  /* ---------------- ADD FUEL ---------------- */
  const handleAddFuel = async () => {
    setError("");

    if (!fuelName.trim()) {
      setError("Fuel name is required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:8000/api/fuels/create/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fuelName }),
      });

      if (!res.ok) {
        const err = await res.json();
        setError("Error: " + JSON.stringify(err));
        return;
      }

      setFuelName("");
      fetchFuels();
      alert("Fuel added successfully");
    } catch (error) {
      console.error(error);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  /* 🔥 INDUSTRIAL FIXED LABEL STYLE */
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
          ADD FUEL
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
        {/* FORM FIELD */}
        <Box display="flex" flexDirection="column" gap={3}>

          {/* FUEL NAME */}
          <Box display="flex" alignItems="center" gap={2}>
            <Box sx={labelStyle}>FUEL NAME *</Box>

            <TextField
              value={fuelName}
              onChange={(e) => setFuelName(e.target.value)}
              fullWidth
            />
          </Box>

          {error && (
            <Typography color="error" fontSize={14}>
              {error}
            </Typography>
          )}

          {/* ADD BUTTON BELOW INPUT */}
          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              sx={{
                px: 6,
                backgroundColor: "#2962ff",
                "&:hover": { backgroundColor: "#0039cb" },
              }}
              onClick={handleAddFuel}
              disabled={loading}
            >
              {loading ? "Saving..." : "ADD"}
            </Button>
          </Box>
        </Box>

        {/* TABLE BELOW */}
        {fuels.length > 0 && (
          <Box mt={5}>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#1976d2" }}>
                    <TableCell sx={{ color: "#fff", fontWeight: 700 }}>
                      Sr No
                    </TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: 700 }}>
                      Fuel Name
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {fuels.map((fuel, index) => (
                    <TableRow key={fuel.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{fuel.name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default AddFuelType;
