import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  MenuItem,
} from "@mui/material";

const months = [
  "June","July","Aug","Sep","Oct","Nov",
  "Dec","Jan","Feb","Mar","Apr","May","Total"
];

function AllInOneReport() {
  const [financialYear, setFinancialYear] = useState("2024-2025");
  const [rows, setRows] = useState([]);

  const fetchReport = async () => {
    const res = await fetch(
      `http://localhost:8000/api/reports/all-in-one/?financial_year=${financialYear}`
    );
    const data = await res.json();
    setRows(data.rows || []);
  };

  useEffect(() => {
    fetchReport();
  }, [financialYear]);

  const totalProfit =
    rows.find((r) => r.label === "Profit")?.values.at(-1) || 0;

  return (
    <Box p={2}>
      <Typography variant="h5" fontWeight={800} mb={2}>
        All In One Report
      </Typography>

      {/* FILTER */}
      <Card sx={{ p: 2, mb: 2 }}>
        <TextField
          select
          label="Financial Year"
          size="small"
          value={financialYear}
          onChange={(e) => setFinancialYear(e.target.value)}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="2023-2024">2023-2024</MenuItem>
          <MenuItem value="2024-2025">2024-2025</MenuItem>
          <MenuItem value="2025-2026">2025-2026</MenuItem>
        </TextField>
      </Card>

      {/* SUMMARY */}
      <Card sx={{ p: 2, mb: 3, maxWidth: 420 }}>
        <Typography>Total Profit</Typography>
        <Typography variant="h5" fontWeight={700} color="success.main">
          ₹ {totalProfit.toLocaleString("en-IN")}
        </Typography>
      </Card>

      {/* TABLE */}
      <Card sx={{ p: 2 }}>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#1976d2" }}>
                <TableCell sx={{ color: "#fff", fontWeight: 700 }}>
                  Description
                </TableCell>
                {months.map((m) => (
                  <TableCell
                    key={m}
                    align="right"
                    sx={{ color: "#fff", fontWeight: 700 }}
                  >
                    {m}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map((row, i) => (
                <TableRow key={i} hover>
                  <TableCell sx={{ fontWeight: 600 }}>
                    {row.label}
                  </TableCell>
                  {row.values.map((v, idx) => (
                    <TableCell key={idx} align="right">
                      {v.toLocaleString("en-IN")}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}

export default AllInOneReport;
