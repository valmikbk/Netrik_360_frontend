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
const generatePurchaseReportPDF = async ({
  rows,
  fromDate,
  toDate,
  totalPurchase,
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
  doc.text("PURCHASE REPORT", 70, 18);

  doc.setTextColor(0);
  doc.setFontSize(10);
  doc.text(`From : ${fromDate}`, 14, 44);
  doc.text(`To : ${toDate}`, 80, 44);

  autoTable(doc, {
    startY: 52,
    head: [[
      "Date",
      "Bill No",
      "Supplier",
      "Village",
      "Item",
      "Brass",
      "Amount",
      "MR Name",
    ]],
    body: rows.map(r => [
      r.date,
      r.billNo,
      r.supplierName,
      r.village,
      r.item,
      r.brass,
      `₹ ${r.amount.toLocaleString("en-IN")}`,
      r.mrName,
    ]),
    theme: "grid",
    styles: { fontSize: 9 },
    headStyles: { fillColor: primary, textColor: 255 },
  });

  const y = doc.lastAutoTable.finalY + 8;
  doc.setFontøsetFont("helvetica", "bold");
  doc.text(
    `Total Purchase : ₹ ${totalPurchase.toLocaleString("en-IN")}`,
    14,
    y
  );

  return doc;
};

function PurchaseReport() {
  /* ------------------ STATES ------------------ */
  const [rows, setRows] = useState([]);
  const [totalPurchase, setTotalPurchase] = useState(0);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("This Month");

  const now = new Date();
  const [fromDate, setFromDate] = useState(
    formatDate(new Date(now.getFullYear(), now.getMonth(), 1))
  );
  const [toDate, setToDate] = useState(
    formatDate(new Date(now.getFullYear(), now.getMonth() + 1, 0))
  );

  /* ------------------ FETCH DATA ------------------ */
  const fetchPurchaseReport = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        from_date: fromDate,
        to_date: toDate,
        search: search,
      });

      const res = await fetch(
        `http://localhost:8000/api/purchase/report/?${params.toString()}`
      );

      const data = await res.json();

      setRows(data.results || []);
      setTotalPurchase(data.total_brass);
    } catch (err) {
      console.error("Purchase report error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchaseReport();
  }, [fromDate, toDate, search]);

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

  /* ------------------ ACTIONS ------------------ */
  const handleDownloadReport = async () => {
    const doc = await generatePurchaseReportPDF({
      rows,
      fromDate,
      toDate,
      totalPurchase,
    });
    doc.save("purchase_report.pdf");
  };

  const handlePrintReport = async () => {
    const doc = await generatePurchaseReportPDF({
      rows,
      fromDate,
      toDate,
      totalPurchase,
    });
    window.open(doc.output("bloburl")).print();
  };

  return (
    <Box p={2}>
      <Typography variant="h5" fontWeight={700} mb={2}>
        Purchase Report
      </Typography>

      {/* FILTERS */}
      <Card sx={{ p: 2, mb: 2 }}>
        <Box display="flex" gap={2} flexWrap="wrap">

          <TextField
            label="Search"
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
            size="small"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />

          <TextField
            label="To Date"
            size="small"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />

        </Box>
      </Card>

      {/* SUMMARY */}
      <Card sx={{ p: 2, mb: 3, maxWidth: 420 }}>
        <Typography>Total Purchase</Typography>
        <Typography variant="h5" fontWeight={700} color="error.main">
          {totalPurchase}
        </Typography>
        <Typography variant="body2" mt={1}>
          Entries: {rows.length}
        </Typography>
      </Card>

      {/* TABLE */}
      <Card sx={{ p: 2 }}>
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography variant="h6">Purchase Transactions</Typography>
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
                {[
                  "Date",
                //   "Bill No",
                //   "Supplier",
                //   "Village",
                  "Vehicle No",
                  "Quantity",
                //   "Amount",
                //   "MR Name",
                ].map(h => (
                  <TableCell key={h}><b>{h}</b></TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map((r, i) => (
                <TableRow key={i}>
                  <TableCell>{r.date}</TableCell>
                  {/* <TableCell>{r.billNo}</TableCell> */}
                  {/* <TableCell>{r.supplierName}</TableCell> */}
                  {/* <TableCell>{r.village}</TableCell> */}
                  <TableCell>{r.vehicle_number}</TableCell>
                  <TableCell>{r.brass}</TableCell>
                  {/* <TableCell>₹ {r.amount.toLocaleString("en-IN")}</TableCell> */}
                  {/* <TableCell>{r.mrName}</TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}

export default PurchaseReport;
