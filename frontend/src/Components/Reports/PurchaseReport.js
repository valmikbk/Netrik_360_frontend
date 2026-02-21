import React, { useState, useEffect } from "react";
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
  InputAdornment,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PrintIcon from "@mui/icons-material/Print";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* ---------------- DATE FORMAT ---------------- */
const formatDate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

/* ---------------- SAFE NUMBER ---------------- */
const safeNumber = (value) =>
  Number(value || 0).toLocaleString("en-IN");

/* ---------------- PDF GENERATOR ---------------- */
const generatePurchaseReportPDF = async ({
  rows,
  fromDate,
  toDate,
  totalPurchase,
}) => {
  const doc = new jsPDF("p", "mm", "a4");
  const primary = [41, 98, 255];

  doc.setFillColor(...primary);
  doc.rect(0, 0, 210, 28, "F");

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
    head: [["Date", "Vehicle No", "Quantity (Brass)"]],
    body: rows.map((r) => [
      r.date
        ? new Date(r.date).toLocaleDateString("en-GB")
        : "",
      r.vehicle_number || "",
      r.brass || 0,
    ]),
    theme: "grid",
    styles: { fontSize: 9 },
    headStyles: { fillColor: primary, textColor: 255 },
  });

  const y = doc.lastAutoTable.finalY + 8;

  doc.setFont("helvetica", "bold");
  doc.text(
    `Total Purchase : ${safeNumber(totalPurchase)}`,
    14,
    y
  );

  return doc;
};

function PurchaseReport() {
  const [rows, setRows] = useState([]);
  const [totalPurchase, setTotalPurchase] = useState(0);
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("This Month");

  const now = new Date();
  const [fromDate, setFromDate] = useState(
    formatDate(new Date(now.getFullYear(), now.getMonth(), 1))
  );
  const [toDate, setToDate] = useState(
    formatDate(new Date(now.getFullYear(), now.getMonth() + 1, 0))
  );

  /* ---------------- FETCH DATA ---------------- */
  const fetchPurchaseReport = async () => {
    try {
      const params = new URLSearchParams({
        from_date: fromDate,
        to_date: toDate,
        search,
      });

      const res = await fetch(
        `http://localhost:8000/api/purchase/report/?${params}`
      );

      const data = await res.json();

      setRows(data.results || []);
      setTotalPurchase(data.total_brass || 0);
    } catch (err) {
      console.error("Purchase report error", err);
    }
  };

  useEffect(() => {
    fetchPurchaseReport();
  }, [fromDate, toDate, search]);

  /* ---------------- PERIOD HANDLER ---------------- */
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

  /* ---------------- ACTIONS ---------------- */
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
    <Box sx={{ width: "100%" }}>

      {/* HEADER */}
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
          RAW MATERIALS REPORT
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

      {/* FILTERS */}
      <Card sx={{ p: 3, mb: 3 }}>
        <Box display="flex" gap={3} flexWrap="wrap">
          <TextField
            label="SEARCH ITEM"
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

          {/* <TextField
            select
            label="PERIOD"
            size="small"
            value={period}
            onChange={(e) => handlePeriodChange(e.target.value)}
          >
            <MenuItem value="This Month">This Month</MenuItem>
            <MenuItem value="Last Month">Last Month</MenuItem>
            <MenuItem value="Last Year">Last Year</MenuItem>
          </TextField> */}

          <TextField
            label="FROM"
            size="small"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />

          <TextField
            label="TO"
            size="small"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </Box>
      </Card>

      {/* SUMMARY */}
      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="caption" fontWeight={600} color="text.secondary">
          TOTAL PURCHASE (BRASS)
        </Typography>

        <Typography variant="h6" fontWeight={700} color="error.main">
          {safeNumber(totalPurchase)}
        </Typography>

        <Typography variant="body2" mt={1}>
          Entries: {rows.length}
        </Typography>
      </Card>

      {/* TABLE */}
      <Card>
        <TableContainer>
          <Table size="small">

            <TableHead>
              <TableRow>
                {["DATE", "VEHICLE NO", "QUANTITY (BRASS)"].map(
                  (header, index, arr) => (
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
                  )
                )}
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No data found
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((r, i) => (
                  <TableRow key={i} hover>
                    <TableCell
                      align="center"
                      sx={{ borderRight: "1px solid #e5e7eb" }}
                    >
                      {r.date
                        ? new Date(r.date).toLocaleDateString("en-GB")
                        : ""}
                    </TableCell>

                    <TableCell
                      align="center"
                      sx={{ borderRight: "1px solid #e5e7eb" }}
                    >
                      {r.vehicle_number || ""}
                    </TableCell>

                    <TableCell align="center">
                      {r.brass || 0}
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

export default PurchaseReport;