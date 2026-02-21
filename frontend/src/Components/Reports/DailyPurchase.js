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
const generateDailyPurchasePDF = async ({
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
  doc.text("DAILY PURCHASE REPORT", 55, 18);

  doc.setTextColor(0);
  doc.setFontSize(10);
  doc.text(`From : ${fromDate}`, 14, 44);
  doc.text(`To : ${toDate}`, 80, 44);

  autoTable(doc, {
  startY: 52,
  head: [["Date", "Item Name", "Amount (₹)"]],
  body: rows.map((r) => [
    new Date(r.date).toLocaleDateString("en-GB"),
    r.itemName,
    Number(r.amount || 0).toLocaleString("en-IN"),
  ]),
  theme: "grid",
  styles: { fontSize: 9 },
  headStyles: { fillColor: primary, textColor: 255 },
  columnStyles: { 2: { halign: "right" } },
});

  doc.setFont("helvetica", "bold");
  doc.text(
    `Total Purchase : ₹ ${totalPurchase.toLocaleString("en-IN")}`,
    14,
    doc.lastAutoTable.finalY + 8
  );

  return doc;
};

function DailyPurchase() {
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

  /* ------------------ PERIOD FILTER ------------------ */
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
  const fetchPurchases = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        from_date: fromDate,
        to_date: toDate,
        search,
      });

      const res = await fetch(
        `http://localhost:8000/api/daily-purchase/?${params.toString()}`
      );
      const data = await res.json();
      setRows(data);
    } catch (err) {
      console.error("Daily purchase fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, [fromDate, toDate, search]);

  /* ------------------ SUMMARY ------------------ */
 const totalPurchase = useMemo(
  () =>
    rows.reduce((s, r) => s + Number(r.amount || 0), 0),
  [rows]
);

  /* ------------------ ACTIONS ------------------ */
  const handleDownload = async () => {
    const doc = await generateDailyPurchasePDF({
      rows,
      fromDate,
      toDate,
      totalPurchase,
    });
    doc.save("daily_purchase_report.pdf");
  };

  const handlePrint = async () => {
    const doc = await generateDailyPurchasePDF({
      rows,
      fromDate,
      toDate,
      totalPurchase,
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
        DAILY PURCHASE REPORT
      </Typography>

      <Box>
         <IconButton onClick={handleDownload} sx={{ color: "#fff" }}>
          <FileDownloadIcon />
        </IconButton>

        <IconButton onClick={handlePrint} sx={{ color: "#fff" }}>
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
          label="SEARCH ITEM"
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
        TOTAL PURCHASE
      </Typography>

      <Typography variant="h6" fontWeight={700} color="error.main">
        ₹ {totalPurchase.toLocaleString("en-IN")}
      </Typography>

      <Typography variant="body2" mt={1}>
        Entries: {rows.length}
      </Typography>
    </Card>

    {/* ================= TABLE ================= */}
    <Card sx={{ borderRadius: 2 }}>
      <TableContainer>
        <Table size="small">

          <TableHead>
            <TableRow>
              {[
                "DATE",
                "ITEM NAME",
                // "QTY",
                // "PRICE / UNIT",
                "AMOUNT (₹)",
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
                <TableCell colSpan={3} align="center">
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
                    {r.date
                      ? new Date(r.date).toLocaleDateString("en-GB")
                      : ""}
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{ borderRight: "1px solid #e5e7eb" }}
                  >
                    {r.itemName}
                  </TableCell>

                  {/* <TableCell
                    align="center"
                    sx={{ borderRight: "1px solid #e5e7eb" }}
                  >
                    {r.qty}
                  </TableCell> */}

                  {/* <TableCell
                    align="center"
                    sx={{ borderRight: "1px solid #e5e7eb" }}
                  >
                    ₹ {r.pricePerUnit}
                  </TableCell> */}

                  <TableCell align="center">
                    ₹ {Number(r.amount || 0).toLocaleString("en-IN")}
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

export default DailyPurchase;
