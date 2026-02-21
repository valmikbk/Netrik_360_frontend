import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Card,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper,
  InputAdornment,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PrintIcon from "@mui/icons-material/Print";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* ---------- DATE FORMAT ---------- */
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-GB");
};

function FuelPurchaseReport() {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);

  /* ---------- FETCH DATA ---------- */
  const fetchReport = async () => {
    try {
      const params = new URLSearchParams({
        from_date: fromDate,
        to_date: toDate,
        search: search,
      });

      const res = await fetch(
        `http://localhost:8000/api/reports/fuel-purchase/?${params.toString()}`
      );

      const data = await res.json();

      setRows(Array.isArray(data.rows) ? data.rows : []);
      setTotalAmount(data.totalAmount || 0);

    } catch (error) {
      console.error("Fuel purchase fetch error:", error);
      setRows([]);
      setTotalAmount(0);
    }
  };

  useEffect(() => {
    if (fromDate && toDate) {
      fetchReport();
    }
  }, [fromDate, toDate, search]);

  /* ---------- FILTERED (EXTRA SAFETY) ---------- */
  const filteredRows = useMemo(() => {
    if (!Array.isArray(rows)) return [];
    return rows;
  }, [rows]);

  /* ---------- PDF ---------- */
  const generatePDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    const primary = [41, 98, 255];

    doc.setFillColor(...primary);
    doc.rect(0, 0, 210, 25, "F");

    doc.setTextColor(255);
    doc.setFontSize(16);
    doc.text("FUEL PURCHASE REPORT", 60, 16);

    doc.setTextColor(0);
    doc.text(`From : ${fromDate}`, 14, 35);
    doc.text(`To : ${toDate}`, 80, 35);

    autoTable(doc, {
      startY: 42,
      head: [["Date", "Fuel", "Volume", "Amount"]],
      body: filteredRows.map((r) => [
        formatDate(r.date),
        r.fuelName,
        r.volume,
        Number(r.amount).toLocaleString("en-IN"),
      ]),
      theme: "grid",
      headStyles: { fillColor: primary, textColor: 255 },
      styles: { halign: "center" },
    });

    doc.text(
      `Total : ₹ ${Number(totalAmount).toLocaleString("en-IN")}`,
      14,
      doc.lastAutoTable.finalY + 8
    );

    doc.save("fuel_purchase_report.pdf");
  };

  const handlePrint = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["Date", "Fuel", "Volume", "Amount"]],
      body: filteredRows.map((r) => [
        formatDate(r.date),
        r.fuelName,
        r.volume,
        Number(r.amount).toLocaleString("en-IN"),
      ]),
    });

    window.open(doc.output("bloburl")).print();
  };

  return (
    <Box sx={{ width: "100%" }}>

      {/* ================= HEADER ================= */}
      <Box
        sx={{
          mb: 3,
          px: 3,
          py: 2,
          borderRadius: 2,
          background: "linear-gradient(90deg, #1a237e, #283593)",
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          FUEL PURCHASE REPORT
        </Typography>

        <Box>
          <IconButton onClick={generatePDF} sx={{ color: "#fff" }}>
            <FileDownloadIcon />
          </IconButton>

          <IconButton onClick={handlePrint} sx={{ color: "#fff" }}>
            <PrintIcon />
          </IconButton>
        </Box>
      </Box>

      {/* ================= FILTER CARD ================= */}
      <Card sx={{ p: 3, mb: 3 }}>
  <Box display="flex" gap={3} flexWrap="wrap">

    {/* SEARCH */}
    <TextField
      label="SEARCH FUEL"
      size="small"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      sx={{
        width: 260,
        "& .MuiOutlinedInput-root": {
          height: 40,
        },
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />

    {/* FROM DATE */}
    <TextField
      type="date"
      label="FROM"
      size="small"
      InputLabelProps={{ shrink: true }}
      value={fromDate}
      onChange={(e) => setFromDate(e.target.value)}
      sx={{
        width: 260,
        "& .MuiOutlinedInput-root": {
          height: 40,
        },
      }}
    />

    {/* TO DATE */}
    <TextField
      type="date"
      label="TO"
      size="small"
      InputLabelProps={{ shrink: true }}
      value={toDate}
      onChange={(e) => setToDate(e.target.value)}
      sx={{
        width: 260,
        "& .MuiOutlinedInput-root": {
          height: 40,
        },
      }}
    />

  </Box>
</Card>

      {/* ================= SUMMARY ================= */}
      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="caption" fontWeight={600}>
          TOTAL FUEL PURCHASE
        </Typography>

        <Typography variant="h6" fontWeight={700} color="error.main">
          ₹ {Number(totalAmount).toLocaleString("en-IN")}
        </Typography>

        <Typography variant="body2">
          Entries: {filteredRows.length}
        </Typography>
      </Card>

      {/* ================= TABLE ================= */}
      <Card>
        <TableContainer component={Paper}>
          <Table size="small">

            <TableHead>
              <TableRow>
                {["DATE", "FUEL TYPE", "VOLUME", "AMOUNT (₹)"].map((h) => (
                  <TableCell
                    key={h}
                    align="center"
                    sx={{ fontWeight: 700 }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No data found
                  </TableCell>
                </TableRow>
              ) : (
                filteredRows.map((r, i) => (
                  <TableRow key={i}>
                    <TableCell align="center">
                      {formatDate(r.date)}
                    </TableCell>
                    <TableCell align="center">
                      {r.fuelName}
                    </TableCell>
                    <TableCell align="center">
                      {r.volume}
                    </TableCell>
                    <TableCell align="center">
                      ₹ {Number(r.amount).toLocaleString("en-IN")}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>

          </Table>
        </TableContainer>
      </Card>

    </Box>
  );
}

export default FuelPurchaseReport;