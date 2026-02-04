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

/* ------------------ DATE FORMAT ------------------ */
const formatDate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

/* ------------------ IMAGE TO BASE64 ------------------ */
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

/* ------------------ PDF ------------------ */
const generatePDF = async ({
  rows,
  fromDate,
  toDate,
  totalSale,
  totalPurchase,
}) => {
  const doc = new jsPDF("p", "mm", "a4");
  const logoBase64 = await loadImageAsBase64(logo);
  const primary = [41, 98, 255];

  doc.setFillColor(...primary);
  doc.rect(0, 0, 210, 28, "F");
  doc.addImage(logoBase64, "PNG", 14, 6, 20, 16);

  doc.setTextColor(255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("SALES VS PURCHASE REPORT", 50, 18);

  doc.setTextColor(0);
  doc.setFontSize(10);
  doc.text(`From : ${fromDate}`, 14, 44);
  doc.text(`To : ${toDate}`, 80, 44);

  autoTable(doc, {
    startY: 52,
    head: [["Date", "Sale Amount (₹)", "Purchase Amount (₹)"]],
    body: rows.map((r) => [
      r.date,
      r.saleAmount.toLocaleString("en-IN"),
      r.purchaseAmount.toLocaleString("en-IN"),
    ]),
    theme: "grid",
    headStyles: { fillColor: primary, textColor: 255 },
    styles: { fontSize: 9 },
    columnStyles: {
      1: { halign: "right" },
      2: { halign: "right" },
    },
  });

  const y = doc.lastAutoTable.finalY + 8;
  doc.setFont("helvetica", "bold");
  doc.text(`Total Sale : ₹ ${totalSale.toLocaleString("en-IN")}`, 14, y);
  doc.text(
    `Total Purchase : ₹ ${totalPurchase.toLocaleString("en-IN")}`,
    110,
    y
  );

  return doc;
};

function SalesVsPurchases() {
  /* ------------------ STATE ------------------ */
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

  /* ------------------ PERIOD HANDLER ------------------ */
  const handlePeriodChange = (value) => {
    setPeriod(value);
    let start, end;

    switch (value) {
      case "This Month":
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case "Last Month":
        start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        end = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
      case "Last Year":
        start = new Date(now.getFullYear() - 1, 0, 1);
        end = new Date(now.getFullYear() - 1, 11, 31);
        break;
      default:
        return;
    }

    setFromDate(formatDate(start));
    setToDate(formatDate(end));
  };

  /* ------------------ FETCH DATA ------------------ */
  const fetchReport = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        from_date: fromDate,
        to_date: toDate,
        search: search,
      });

      const res = await fetch(
        `http://localhost:8000/api/reports/sales-vs-purchase/?${params.toString()}`
      );

      const data = await res.json();
      console.log("Sales vs Purchase data:", data);

      setRows(data);
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [fromDate, toDate, search]);

  /* ------------------ SUMMARY ------------------ */
  const totalSale = useMemo(
    () => rows.reduce((s, r) => s + r.saleAmount, 0),
    [rows]
  );

  const totalPurchase = useMemo(
    () => rows.reduce((s, r) => s + r.purchaseAmount, 0),
    [rows]
  );

  /* ------------------ ACTIONS ------------------ */
  const handleDownload = async () => {
    const doc = await generatePDF({
      rows,
      fromDate,
      toDate,
      totalSale,
      totalPurchase,
    });
    doc.save("sales_vs_purchase_report.pdf");
  };

  const handlePrint = async () => {
    const doc = await generatePDF({
      rows,
      fromDate,
      toDate,
      totalSale,
      totalPurchase,
    });
    window.open(doc.output("bloburl")).print();
  };

  return (
    <Box p={2}>
      <Typography variant="h5" fontWeight={700} mb={2}>
        Sales vs Purchases
      </Typography>

      {/* FILTERS */}
      <Card sx={{ p: 2, mb: 2 }}>
        <Box display="flex" gap={2} flexWrap="wrap">
          <TextField
            label="Search Date"
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
            sx={{ minWidth: 140 }}
            onChange={(e) => handlePeriodChange(e.target.value)}
          >
            <MenuItem value="This Month">This Month</MenuItem>
            <MenuItem value="Last Month">Last Month</MenuItem>
            <MenuItem value="Last Year">Last Year</MenuItem>
          </TextField>

          <TextField
            label="From Date"
            type="date"
            size="small"
            InputLabelProps={{ shrink: true }}
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />

          <TextField
            label="To Date"
            type="date"
            size="small"
            InputLabelProps={{ shrink: true }}
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </Box>
      </Card>

      {/* SUMMARY */}
      <Box display="flex" gap={2} flexWrap="wrap" mb={3}>
        <Card sx={{ p: 2, minWidth: 240 }}>
          <Typography>Total Sale</Typography>
          <Typography variant="h5" color="success.main">
            ₹ {totalSale.toLocaleString("en-IN")}
          </Typography>
        </Card>

        <Card sx={{ p: 2, minWidth: 240 }}>
          <Typography>Total Purchase</Typography>
          <Typography variant="h5" color="error.main">
            ₹ {totalPurchase.toLocaleString("en-IN")}
          </Typography>
        </Card>
      </Box>

      {/* TABLE */}
      <Card sx={{ p: 2 }}>
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography variant="h6">Report</Typography>
          <Box>
            <IconButton onClick={handleDownload}>
              <FileDownloadIcon />
            </IconButton>
            <IconButton onClick={handlePrint}>
              <PrintIcon />
            </IconButton>
          </Box>
        </Box>

        <Divider sx={{ mb: 1 }} />

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Date</b></TableCell>
                <TableCell><b>Sale Amount</b></TableCell>
                <TableCell><b>Purchase Amount</b></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No data found
                  </TableCell>
                </TableRow>
              )}

              {rows.map((r, i) => (
                <TableRow key={i}>
                  <TableCell>{r.date}</TableCell>
                  <TableCell>
                    ₹ {r.saleAmount.toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell>
                    ₹ {r.purchaseAmount.toLocaleString("en-IN")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}

export default SalesVsPurchases;
