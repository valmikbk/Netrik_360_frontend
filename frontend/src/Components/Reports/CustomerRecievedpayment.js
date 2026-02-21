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
const generateReceivedPDF = async ({
  rows,
  fromDate,
  toDate,
  totalReceived,
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
  doc.text("CUSTOMER RECEIVED PAYMENT REPORT", 32, 18);

  doc.setTextColor(0);
  doc.setFontSize(10);
  doc.text(`From : ${fromDate}`, 14, 44);
  doc.text(`To : ${toDate}`, 80, 44);

  autoTable(doc, {
    startY: 52,
    head: [[
      "Sr No",
      "Date",
      "Customer Name",
      "Phone No",
      "Received Amount (₹)",
    ]],
    body: rows.map((r, i) => [
      i + 1,
      r.date,
      r.customerName,
      r.phone,
      r.receivedAmount.toLocaleString("en-IN"),
    ]),
    theme: "grid",
    styles: { fontSize: 9 },
    headStyles: { fillColor: primary, textColor: 255 },
    columnStyles: { 4: { halign: "right" } },
  });

  doc.setFont("helvetica", "bold");
  doc.text(
    `Total Received : ₹ ${totalReceived.toLocaleString("en-IN")}`,
    14,
    doc.lastAutoTable.finalY + 8
  );

  return doc;
};

function CustomerReceivedPayment() {
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

  /* ------------------ PERIOD LOGIC ------------------ */
  useEffect(() => {
    const d = new Date();

    if (period === "This Month") {
      setFromDate(formatDate(new Date(d.getFullYear(), d.getMonth(), 1)));
      setToDate(formatDate(new Date(d.getFullYear(), d.getMonth() + 1, 0)));
    }

    if (period === "Last Month") {
      setFromDate(formatDate(new Date(d.getFullYear(), d.getMonth() - 1, 1)));
      setToDate(formatDate(new Date(d.getFullYear(), d.getMonth(), 0)));
    }

    if (period === "Last Year") {
      setFromDate(formatDate(new Date(d.getFullYear() - 1, 0, 1)));
      setToDate(formatDate(new Date(d.getFullYear() - 1, 11, 31)));
    }
  }, [period]);

  /* ------------------ FETCH DATA ------------------ */
  const fetchPayments = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        from_date: fromDate,
        to_date: toDate,
        search: search,
      });

      const res = await fetch(
        `http://localhost:8000/api/customer/received-payments/?${params.toString()}`
      );
      const data = await res.json();
      setRows(data);
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [fromDate, toDate, search]);

  /* ------------------ SUMMARY ------------------ */
  const totalReceived = useMemo(
    () => rows.reduce((s, r) => s + r.receivedAmount, 0),
    [rows]
  );

  /* ------------------ ACTIONS ------------------ */
  const handleDownloadReport = async () => {
    const doc = await generateReceivedPDF({
      rows,
      fromDate,
      toDate,
      totalReceived,
    });
    doc.save("customer_received_payment_report.pdf");
  };

  const handlePrintReport = async () => {
    const doc = await generateReceivedPDF({
      rows,
      fromDate,
      toDate,
      totalReceived,
    });
    window.open(doc.output("bloburl")).print();
  };

 return (
  <Box sx={{ width: "100%" }}>

    {/* ================= HEADER STRIP ================= */}
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
        CUSTOMER RECEIVED PAYMENT REPORT
      </Typography>

      <Box>
        <IconButton onClick={handleDownloadReport} sx={{ color: "#fff" }}>
          <FileDownloadIcon />
        </IconButton>
        
        <IconButton onClick={handlePrintReport} sx={{ color: "#fff" }}>
          <PrintIcon />
        </IconButton>
      </Box>
    </Box>

    {/* ================= FILTER SECTION ================= */}
    <Card
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 2,
        boxShadow: "0px 4px 14px rgba(0,0,0,0.06)",
      }}
    >
      <Box display="flex" gap={3} flexWrap="wrap">

        <TextField
          label="SEARCH CUSTOMER / PHONE"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 240 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {/* <TextField
          select
          label="Period"
          size="small"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
        >
          <MenuItem value="This Month">This Month</MenuItem>
          <MenuItem value="Last Month">Last Month</MenuItem>
          <MenuItem value="Last Year">Last Year</MenuItem>
        </TextField> */}

        <TextField
          label="FROM"
          type="date"
          size="small"
          InputLabelProps={{ shrink: true }}
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />

        <TextField
          label="TO"
          type="date"
          size="small"
          InputLabelProps={{ shrink: true }}
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
      </Box>
    </Card>

    {/* ================= SUMMARY ================= */}
    <Card sx={{ p: 3, mb: 3, borderRadius: 2 }}>
      <Typography variant="caption" fontWeight={600} color="text.secondary">
        TOTAL RECEIVED
      </Typography>

      <Typography variant="h6" fontWeight={700} color="success.main">
        ₹ {totalReceived.toLocaleString("en-IN")}
      </Typography>

      <Typography variant="body2" mt={1}>
        Transactions: {rows.length}
      </Typography>
    </Card>

    {/* ================= TABLE ================= */}
    <Card sx={{ borderRadius: 2 }}>
      <TableContainer>
        <Table size="small">

          <TableHead>
            <TableRow>
              {[
                "SR NO",
                "DATE",
                "CUSTOMER NAME",
                "PHONE",
                "RECEIVED AMOUNT (₹)",
              ].map((header, index, arr) => (
                <TableCell
                  key={header}
                  align="center"
                  sx={{
                    fontWeight: 700,
                    backgroundColor: "#f1f5f9",
                    borderRight:
                      index !== arr.length - 1
                        ? "1px solid #e5e7eb"
                        : "none",
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              rows.map((r, i) => (
                <TableRow
                  key={i}
                  hover
                  sx={{
                    "&:nth-of-type(even)": {
                      backgroundColor: "#f9fafb",
                    },
                  }}
                >
                  <TableCell
                    align="center"
                    sx={{ borderRight: "1px solid #e5e7eb" }}
                  >
                    {i + 1}
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{ borderRight: "1px solid #e5e7eb" }}
                  >
                    {r.date
                      ? new Date(r.date)
                          .toLocaleDateString("en-GB")
                      : ""}
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{ borderRight: "1px solid #e5e7eb" }}
                  >
                    {r.customerName}
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{ borderRight: "1px solid #e5e7eb" }}
                  >
                    {r.phone}
                  </TableCell>

                  <TableCell align="center">
                    ₹ {r.receivedAmount.toLocaleString("en-IN")}
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

export default CustomerReceivedPayment;
