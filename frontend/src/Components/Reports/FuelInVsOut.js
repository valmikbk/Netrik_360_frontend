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
const generateFuelPDF = async ({
  rows,
  fromDate,
  toDate,
  totalFuel,
  totalAmount,
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
  doc.text("FUEL IN / OUT REPORT", 55, 18);

  doc.setTextColor(0);
  doc.setFontSize(10);
  doc.text(`From : ${fromDate}`, 14, 44);
  doc.text(`To : ${toDate}`, 80, 44);

  autoTable(doc, {
    startY: 52,
    head: [[
      "Vehicle No",
      "Fuel Type",
      "Initial Fuel",
      "Fuel In",
      "Total Fuel",
      "Fuel Out",
    ]],
    body: rows.map((r) => [
      r.vehicleNo,
      r.fuelType,
      r.initialFuel,
      r.fuelIn,
      r.totalFuel,
      r.fuelOut,
    ]),
    theme: "grid",
    styles: { fontSize: 9 },
    headStyles: { fillColor: primary, textColor: 255 },
  });

  const y = doc.lastAutoTable.finalY + 8;
  doc.setFont("helvetica", "bold");
  doc.text(`Total Fuel : ${totalFuel} L`, 14, y);
  doc.text(`Total Amount : ₹ ${totalAmount}`, 90, y);

  return doc;
};

function FuelInVsOut() {
  /* ------------------ STATES ------------------ */
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [fuelType, setFuelType] = useState("All");
  const [loading, setLoading] = useState(false);

  const now = new Date();
  const [fromDate, setFromDate] = useState(
    formatDate(new Date(now.getFullYear(), now.getMonth(), 1))
  );
  const [toDate, setToDate] = useState(
    formatDate(new Date(now.getFullYear(), now.getMonth() + 1, 0))
  );

  /* ------------------ FETCH DATA ------------------ */
  const fetchFuelReport = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        from_date: fromDate,
        to_date: toDate,
        fuel_type: fuelType,
      });

      const res = await fetch(
        `http://localhost:8000/api/fuel/in-out/?${params.toString()}`
      );

      const data = await res.json();
      setRows(data || []);
    } catch (err) {
      console.error("Fuel report fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFuelReport();
  }, [fromDate, toDate, fuelType]);

  /* ------------------ FILTER ------------------ */
  const filteredRows = useMemo(() => {
    const q = search.toLowerCase();
    return rows.filter((r) =>
      Object.values(r).join(" ").toLowerCase().includes(q)
    );
  }, [rows, search]);

  /* ------------------ TOTALS ------------------ */
  const totalFuel = filteredRows.reduce((s, r) => s + r.totalFuel, 0);
  const totalAmount = filteredRows.reduce((s, r) => s + r.fuelAmount, 0);

  /* ------------------ ACTIONS ------------------ */
  const handleDownload = async () => {
    const doc = await generateFuelPDF({
      rows: filteredRows,
      fromDate,
      toDate,
      totalFuel,
      totalAmount,
    });
    doc.save("fuel_in_out_report.pdf");
  };

  const handlePrint = async () => {
    const doc = await generateFuelPDF({
      rows: filteredRows,
      fromDate,
      toDate,
      totalFuel,
      totalAmount,
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
        FUEL IN / OUT REPORT
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
          label="SEARCH"
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

        <TextField
          select
          label="FUEL TYPE"
          size="small"
          value={fuelType}
          onChange={(e) => setFuelType(e.target.value)}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Diesel">Diesel</MenuItem>
          <MenuItem value="Adblue">Adblue</MenuItem>
        </TextField>

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
        TOTAL FUEL
      </Typography>

      <Typography variant="h6" fontWeight={700} color="success.main">
        {Number(totalFuel || 0).toLocaleString("en-IN")} Liters
      </Typography>

      <Typography variant="body2" mt={1}>
        Total Amount: ₹ {Number(totalAmount || 0).toLocaleString("en-IN")}
      </Typography>
    </Card>

    {/* ================= TABLE ================= */}
    <Card sx={{ borderRadius: 2 }}>
      <TableContainer>
        <Table size="small">

          <TableHead>
            <TableRow>
              {[
                "VEHICLE NO",
                "FUEL TYPE",
                "INITIAL FUEL",
                "FUEL IN",
                "TOTAL FUEL",
                "FUEL OUT",
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
            {filteredRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              filteredRows.map((r, i) => (
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
                    {r.vehicleNo || ""}
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{ borderRight: "1px solid #e5e7eb" }}
                  >
                    {r.fuelType || ""}
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{ borderRight: "1px solid #e5e7eb" }}
                  >
                    {r.initialFuel || 0}
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{ borderRight: "1px solid #e5e7eb" }}
                  >
                    {r.fuelIn || 0}
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{ borderRight: "1px solid #e5e7eb" }}
                  >
                    {r.totalFuel || 0}
                  </TableCell>

                  <TableCell align="center">
                    {r.fuelOut || 0}
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

export default FuelInVsOut;
