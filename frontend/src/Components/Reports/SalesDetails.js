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
import VisibilityIcon from "@mui/icons-material/Visibility";

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

/* ------------------ PERIOD DATE RANGE ------------------ */
const getDateRangeByPeriod = (period) => {
  const now = new Date();

  if (period === "This Month") {
    return {
      from: formatDate(new Date(now.getFullYear(), now.getMonth(), 1)),
      to: formatDate(new Date(now.getFullYear(), now.getMonth() + 1, 0)),
    };
  }

  if (period === "Last Month") {
    return {
      from: formatDate(new Date(now.getFullYear(), now.getMonth() - 1, 1)),
      to: formatDate(new Date(now.getFullYear(), now.getMonth(), 0)),
    };
  }

  if (period === "Last Year") {
    return {
      from: formatDate(new Date(now.getFullYear() - 1, 0, 1)),
      to: formatDate(new Date(now.getFullYear() - 1, 11, 31)),
    };
  }

  return {};
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

/* ------------------ SALES REPORT PDF ------------------ */
const generateSalesDetailsPDF = async ({
  rows,
  fromDate,
  toDate,
  totalSales,
  received,
  balance,
}) => {
  const doc = new jsPDF("p", "mm", "a4");
  const primary = [41, 98, 255];
  const logoBase64 = await loadImageAsBase64(logo);

  doc.setFillColor(...primary);
  doc.rect(0, 0, 210, 28, "F");
  doc.addImage(logoBase64, "PNG", 14, 6, 20, 16);

  doc.setTextColor(255);
  doc.setFontSize(16);
  doc.text("SALES DETAILS REPORT", 70, 18);

  doc.setTextColor(0);
  doc.setFontSize(10);
  doc.text(`From : ${fromDate}`, 14, 44);
  doc.text(`To : ${toDate}`, 80, 44);

  autoTable(doc, {
    startY: 52,
    head: [[
      "Date",
      "Bill No",
      "Customer",
      "Village",
      "Item",
      "Brass",
      "Amount",
      "Balance",
      "MR Name",
    ]],
    body: rows.map(r => [
      r.date,
      r.billNo,
      r.customerName,
      r.village,
      r.item,
      r.brass,
      r.amount,
      r.balance,
      r.mrName,
    ]),
    theme: "grid",
    styles: { fontSize: 9 },
    headStyles: { fillColor: primary, textColor: 255 },
  });

  const y = doc.lastAutoTable.finalY + 8;
  doc.text(`Total Sales : ₹ ${totalSales}`, 14, y);
  doc.text(`Received : ₹ ${received}`, 80, y);
  doc.text(`Balance : ₹ ${balance}`, 150, y);

  return doc;
};

function SalesDetails() {
  /* ------------------ STATES ------------------ */
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

  /* ------------------ PERIOD CHANGE ------------------ */
  useEffect(() => {
    const { from, to } = getDateRangeByPeriod(period);
    if (from && to) {
      setFromDate(from);
      setToDate(to);
    }
  }, [period]);

  /* ------------------ FETCH SALES ------------------ */
  const fetchSales = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        from_date: fromDate,
        to_date: toDate,
        search: search,
      });

      const res = await fetch(
        `http://localhost:8000/api/sales/?${params.toString()}`
      );
      const data = await res.json();
      setRows(data);
    } catch (err) {
      console.error("Sales fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, [fromDate, toDate, search]);

  /* ------------------ SUMMARY ------------------ */
  const totalSales = rows.reduce((s, r) => s + r.amount, 0);
  const received = rows.reduce((s, r) => s + (r.amount - r.balance), 0);
  const balance = rows.reduce((s, r) => s + r.balance, 0);

  /* ------------------ REPORT ACTIONS ------------------ */
  const handleDownloadReport = async () => {
    const doc = await generateSalesDetailsPDF({
      rows,
      fromDate,
      toDate,
      totalSales,
      received,
      balance,
    });
    doc.save("sales_details_report.pdf");
  };

  const handlePrintReport = async () => {
    const doc = await generateSalesDetailsPDF({
      rows,
      fromDate,
      toDate,
      totalSales,
      received,
      balance,
    });
    window.open(doc.output("bloburl")).print();
  };

  return (
    <Box p={2}>
      <Typography variant="h5" fontWeight={700} mb={2}>
        Sales Details
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
            label="Period"
            select
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
      <Card sx={{ p: 2, mb: 3, maxWidth: 520 }}>
        <Typography>Total Sales</Typography>
        <Typography variant="h5" fontWeight={700} color="success.main">
          ₹ {totalSales}
        </Typography>
        <Box mt={1} display="flex" gap={3}>
          <Typography color="success.main">Received: ₹ {received}</Typography>
          <Typography color="error.main">Balance: ₹ {balance}</Typography>
        </Box>
      </Card>

      {/* TABLE */}
      <Card sx={{ p: 2 }}>
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography variant="h6">Transactions</Typography>
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
                  "Date","Bill No","Customer","Village","Item",
                  "Brass","Amount","Balance","MR Name"
                ].map(h => (
                  <TableCell key={h}><b>{h}</b></TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map((r, i) => (
                <TableRow key={i}>
                  <TableCell>{r.date}</TableCell>
                  <TableCell>{r.billNo}</TableCell>
                  <TableCell>{r.customerName}</TableCell>
                  <TableCell>{r.village}</TableCell>
                  <TableCell>{r.item}</TableCell>
                  <TableCell>{r.brass}</TableCell>
                  <TableCell>₹ {r.amount}</TableCell>
                  <TableCell>₹ {r.balance}</TableCell>
                  <TableCell>{r.mrName}</TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    No records found
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

export default SalesDetails;
