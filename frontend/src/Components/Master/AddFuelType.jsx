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
import Header from "../Header/Header";

function AddFuelType() {
  const [fuelName, setFuelName] = useState("");
  const [fuels, setFuels] = useState([]);
  const [loading, setLoading] = useState(false);

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
    if (!fuelName.trim()) {
      alert("Fuel name is required");
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
        alert("Error: " + JSON.stringify(err));
        return;
      }

      setFuelName("");
      fetchFuels(); // ✅ auto refresh list
      alert("Fuel added successfully");

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header />

      <Box sx={{ p: 3 }}>
        <Card
          sx={{
            maxWidth: 900,
            mx: "auto",
            borderRadius: 3,
            boxShadow: "0px 10px 30px rgba(0,0,0,0.25)",
          }}
        >
          {/* HEADER */}
          <Box
            sx={{
              px: 3,
              py: 2,
              background: "linear-gradient(90deg, #1a237e, #283593)",
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
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

          {/* FORM */}
          <CardContent>
            <Box display="flex" gap={2} mb={3}>
              <TextField
                label="Fuel Name *"
                value={fuelName}
                onChange={(e) => setFuelName(e.target.value)}
                fullWidth
              />

              <Button
                variant="contained"
                sx={{
                  px: 4,
                  backgroundColor: "#2962ff",
                  "&:hover": { backgroundColor: "#0039cb" },
                }}
                onClick={handleAddFuel}
                disabled={loading}
              >
                ADD
              </Button>
            </Box>

            {/* FUEL LIST */}
            {/* <TableContainer component={Paper}>
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
            </TableContainer> */}

          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default AddFuelType;
