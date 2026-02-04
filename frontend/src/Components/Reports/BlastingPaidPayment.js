import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Card,
  Typography,
  MenuItem,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper,
  Divider,
  InputAdornment,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PrintIcon from "@mui/icons-material/Print";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../Logo/Meghana_stone_logo.png";

/* ================= DATE FORMAT ================= */
const formatDate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

/* ================= IMAGE TO BASE64 ================= */
const loadImageAsBase64 = (src) =>
  new Promise((resolve) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext("2d").drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
  });

/* ================= PDF ================= */
const generatePaidPaymentPDF = async ({
  rows,
  fromDate,
  toDate,
  totalPaid,
}) => {
  const doc = new jsPDF("p", "mm", "a4");
  const primary = [41, 98, 255];
  const logoBase64 = await loadImageAsBase64(logo);

  doc.setFillColor(...primary);
  doc.rect(0, 0, 210, 28, "F");
  doc.addImage(logoBase64, "PNG", 14, 6, 20, 16);

  doc.setTextColor(255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("BLASTING PAID PAYMENT REPORT", 35, 18);

  doc.setTextColor(0);
  doc.setFontSize(10);
  doc.text(`From : ${fromDate}`, 14, 44);
  doc.text(`To : ${toDate}`, 80, 44);

  autoTable(doc, {
    startY: 52,
    head: [["Sr No", "Date", "Supplier Name", "Paid Amount (₹)"]],
    body: rows.map((r, i) => [
      i + 1,
      r.date,
      r.supplierName,
      r.paidAmount.toLocaleString("en-IN"),
    ]),
    theme: "grid",
    styles: { fontSize: 9 },
    headStyles: { fillColor: primary, textColor: 255 },
    columnStyles: { 3: { halign: "right" } },
  });

  doc.setFont("helvetica", "bold");
  doc.text(
    `Total Paid Amount : ₹ ${totalPaid.toLocaleString("en-IN")}`,
    14,
    doc.lastAutoTable.finalY + 8
  );

  return doc;
};

function BlastingPaidPayment() {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("This Month");
  const [loading, setLoading] = useState(false);

  const now = new Date();
  const [fromDate, setFromDate] = useState(
    formatDate(new Date(now.getFullYear(), now.getMonth(), 1))
  );
  const [toDate, setToDate] = useState(
    formatDate(new Date(now.getFullYear(), now.getMonth() + 1, 0))
  );

  /* ================= PERIOD HANDLER ================= */
  useEffect(() => {
    const today = new Date();

    if (period === "This Month") {
      setFromDate(formatDate(new Date(today.getFullYear(), today.getMonth(), 1)));
      setToDate(formatDate(new Date(today.getFullYear(), today.getMonth() + 1, 0)));
    }

    if (period === "Last Month") {
      setFromDate(formatDate(new Date(today.getFullYear(), today.getMonth() - 1, 1)));
      setToDate(formatDate(new Date(today.getFullYear(), today.getMonth(), 0)));
    }

    if (period === "Last Year") {
      setFromDate(formatDate(new Date(today.getFullYear() - 1, 0, 1)));
      setToDate(formatDate(new Date(today.getFullYear() - 1, 11, 31)));
    }
  }, [period]);

  /* ================= FETCH DATA ================= */
  const fetchPaidPayments = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        from_date: fromDate,
        to_date: toDate,
        search,
      });

      const res = await fetch(
        `http://localhost:8000/api/blasting/paid-payments/?${params}`
      );

      const data = await res.json();
      setRows(data);
    } catch (err) {
      console.error("Paid payment fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaidPayments();
  }, [fromDate, toDate, search]);

  /* ================= SUMMARY ================= */
  const totalPaid = useMemo(
    () => rows.reduce((s, r) => s + r.paidAmount, 0),
    [rows]
  );

  /* ================= ACTIONS ================= */
  const handleDownloadReport = async () => {
    const doc = await generatePaidPaymentPDF({
      rows,
      fromDate,
      toDate,
      totalPaid,
    });
    doc.save("blasting_paid_payment_report.pdf");
  };

  const handlePrintReport = async () => {
    const doc = await generatePaidPaymentPDF({
      rows,
      fromDate,
      toDate,
      totalPaid,
    });
    window.open(doc.output("bloburl")).print();
  };

  return (
    <Box p={2}>
      <Typography variant="h5" fontWeight={700} mb={2}>
        Blasting Paid Payments
      </Typography>

      {/* FILTERS */}
      <Card sx={{ p: 2, mb: 2 }}>
        <Box display="flex" gap={2} flexWrap="wrap">
          <TextField
            label="Search Supplier"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            select
            label="Period"
            size="small"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            sx={{ minWidth: 140 }}
          >
            <MenuItem value="This Month">This Month</MenuItem>
            <MenuItem value="Last Month">Last Month</MenuItem>
            <MenuItem value="Last Year">Last Year</MenuItem>
          </TextField>

          <TextField
            type="date"
            label="From Date"
            size="small"
            InputLabelProps={{ shrink: true }}
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />

          <TextField
            type="date"
            label="To Date"
            size="small"
            InputLabelProps={{ shrink: true }}
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </Box>
      </Card>

      {/* SUMMARY */}
      <Card sx={{ p: 2, mb: 3, maxWidth: 420 }}>
        <Typography>Total Paid Amount</Typography>
        <Typography variant="h5" fontWeight={700} color="error.main">
          ₹ {totalPaid.toLocaleString("en-IN")}
        </Typography>
        <Typography variant="body2">
          Payments: {rows.length}
        </Typography>
      </Card>

      {/* TABLE */}
      <Card sx={{ p: 2 }}>
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography variant="h6">Paid Payments List</Typography>
          <Box>
            <IconButton onClick={handleDownloadReport}>
              <FileDownloadIcon />
            </IconButton>
            <IconButton onClick={handlePrintReport}>
              <PrintIcon />
            </IconButton>
          </Box>
        </Box>

        <Divider sx={{ mb: 1 }} />

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {["Sr No.", "Date", "Supplier Name", "Paid Amount"].map(h => (
                  <TableCell key={h}><b>{h}</b></TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map((r, i) => (
                <TableRow key={i}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{r.date}</TableCell>
                  <TableCell>{r.supplierName}</TableCell>
                  <TableCell>
                    ₹ {r.paidAmount.toLocaleString("en-IN")}
                  </TableCell>
                </TableRow>
              ))}
              {!rows.length && !loading && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No data found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}

export default BlastingPaidPayment;
