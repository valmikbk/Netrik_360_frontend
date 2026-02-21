import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Divider,
  CircularProgress,
} from "@mui/material";

function UpdateRates() {
  const [ratesList, setRatesList] = useState([]);
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/rates/");
      const data = await res.json();

      if (!res.ok) {
        alert("Failed to load rates");
        return;
      }

      setRatesList(data);

      const rateMap = {};
      data.forEach((item) => {
        rateMap[item.id] = item.rate;
      });

      setRates(rateMap);
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (id, value) => {
    setRates((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSave = async () => {
    setError("");

    try {
      setLoading(true);

      const payload = {
        rates: ratesList.map((item) => ({
          id: item.id,
          rate: Number(rates[item.id]),
        })),
      };

      const res = await fetch(
        "http://localhost:8000/api/rates/update/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Update failed");
        return;
      }

      alert("Rates updated successfully");
      fetchRates();
    } catch (err) {
      console.error(err);
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
          UPDATE RATES
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
        {fetching ? (
          <Box
            sx={{ flexGrow: 1 }}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box display="flex" flexDirection="column" gap={4}>
              {ratesList.map((item) => (
                <Box
                  key={item.id}
                  display="flex"
                  alignItems="center"
                  gap={2}
                >
                  <Box sx={labelStyle}>{item.name}</Box>

                  <TextField
                    type="number"
                    value={rates[item.id] ?? ""}
                    onChange={(e) =>
                      handleChange(item.id, e.target.value)
                    }
                    fullWidth
                  />
                </Box>
              ))}

              {error && (
                <Typography color="error" fontSize={14}>
                  {error}
                </Typography>
              )}
            </Box>

            {/* PUSH BUTTON DOWN */}
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
                disabled={loading}
              >
                {loading ? "Saving..." : "SAVE"}
              </Button>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default UpdateRates;
