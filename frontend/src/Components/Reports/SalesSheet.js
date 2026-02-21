import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Stack,
  CircularProgress,
  Card,
  TextField,
} from "@mui/material";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function SalesSheet() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const allowedItems = ["20MM", "40MM", "ALL MIX", "M SAND", "DUST"];

  /* ---------------- FETCH STOCK DATA ---------------- */
  const fetchData = () => {
    setLoading(true);

    const params = new URLSearchParams({
      from_date: fromDate,
      to_date: toDate,
    });

    fetch(`http://127.0.0.1:8000/api/reports/sales-sheet/?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setRows(data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch stocks", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ---------------- FILTER + ABSOLUTE ---------------- */
  const filteredRows = rows
    .filter((r) => allowedItems.includes(r.item))
    .map((r) => ({
      ...r,
      stock: Math.abs(Number(r.stock)),
    }));

  /* ---------------- PDF DOWNLOAD ---------------- */
  const handleDownloadPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("ALL STOCK REPORT", 105, 20, { align: "center" });

    autoTable(doc, {
      startY: 30,
      head: [["Item Name", "Total Stock"]],
      body: filteredRows.map((r) => [
        r.item,
        Number(r.stock).toFixed(2),
      ]),
      theme: "grid",
      styles: {
        fontSize: 11,
        halign: "center",
        valign: "middle",
      },
    });

    doc.save("all_stock_report.pdf");
  };

  /* ---------------- PRINT ---------------- */
  const handlePrint = () => {
    const printWindow = window.open("", "", "width=800,height=600");

    printWindow.document.write(`
      <html>
        <head>
          <title>All Stock Report</title>
          <style>
            body { font-family: Arial; padding: 40px; }
            h2 { text-align: center; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #000; padding: 8px; text-align: center; }
            th { font-weight: bold; }
          </style>
        </head>
        <body>
          <h2>ALL STOCK REPORT</h2>
          <table>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Total Stock</th>
              </tr>
            </thead>
            <tbody>
              ${filteredRows
                .map(
                  (r) => `
                <tr>
                  <td>${r.item}</td>
                  <td>${Number(r.stock).toFixed(2)}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

 return (
  <Box sx={{ width: "100%" }}>

    {/* ================= PAGE HEADER ================= */}
<Box
  sx={{
    mb: 3,
    py: 2,
    px: 3,
    borderRadius: 2,
    background: "linear-gradient(90deg, #1a237e, #283593)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  }}
>
  {/* Empty left spacer to balance center alignment */}
  <Box sx={{ width: 120 }} />

  {/* Center Title */}
  <Typography
    variant="h6"
    fontWeight={700}
    sx={{ textAlign: "center", flex: 1 }}
  >
    SALES SHEET
  </Typography>

  {/* Right Side Actions */}
  <Stack direction="row" spacing={1}>
    <Button
      size="small"
      variant="outlined"
      onClick={handlePrint}
      disabled={filteredRows.length === 0}
      sx={{
        color: "#fff",
        borderColor: "rgba(255,255,255,0.6)",
        "&:hover": {
          borderColor: "#fff",
          backgroundColor: "rgba(255,255,255,0.1)",
        },
      }}
    >
      PRINT
    </Button>

    <Button
      size="small"
      variant="contained"
      onClick={handleDownloadPDF}
      disabled={filteredRows.length === 0}
      sx={{
        backgroundColor: "#1565c0",
        "&:hover": { backgroundColor: "#0d47a1" },
      }}
    >
      DOWNLOAD
    </Button>
  </Stack>
</Box>

    {/* ================= FILTER SECTION ================= */}
    <Card sx={{ p: 3, mb: 3 }}>
      <Box display="flex" gap={3} flexWrap="wrap">

        <TextField
          type="date"
          label="FROM"
          size="small"
          InputLabelProps={{ shrink: true }}
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          sx={{ width: 220 }}
        />

        <TextField
          type="date"
          label="TO"
          size="small"
          InputLabelProps={{ shrink: true }}
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          sx={{ width: 220 }}
        />

        <Button
          variant="contained"
          size="small"
          onClick={fetchData}
          sx={{ height: 40 }}
        >
          APPLY
        </Button>

      </Box>
    </Card>

   

    {/* ================= LOADING ================= */}
    {loading && (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    )}

    {/* ================= TABLE ================= */}
    {!loading && filteredRows.length > 0 && (
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                ITEM NAME
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                TOTAL STOCK
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredRows.map((row, index) => (
              <TableRow key={index}>
                <TableCell align="center">{row.item}</TableCell>
                <TableCell align="center">
                  {Number(row.stock).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )}

  </Box>
);
}

export default SalesSheet;