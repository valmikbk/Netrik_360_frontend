import React, { useState, useEffect, useMemo } from "react";
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
const generateFuelKmPDF = async ({
  rows,
  fromDate,
  toDate,
  totalFuel,
  totalKm,
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
  doc.text("FUEL VS KILOMETER REPORT", 45, 18);

  doc.setTextColor(0);
  doc.setFontSize(10);
  doc.text(`From : ${fromDate}`, 14, 44);
  doc.text(`To : ${toDate}`, 80, 44);

  autoTable(doc, {
    startY: 52,
    head: [[
      "Date",
      "Vehicle No",
      "Fuel (Ltr)",
      "Production KM",
      "From",
      "Sales KM",
      "To",
      "Total KM",
    ]],
    body: rows.map(r => [
      r.date,
      r.vehicleNo,
      r.fuelLiters,
      r.productionKm,
      r.destinationFrom,
      r.salesKm,
      r.destinationTo,
      r.totalKm,
    ]),
    theme: "grid",
    styles: { fontSize: 9 },
    headStyles: { fillColor: primary, textColor: 255 },
  });

  const y = doc.lastAutoTable.finalY + 8;
  doc.setFont("helvetica", "bold");
  doc.text(`Total Fuel : ${totalFuel} L`, 14, y);
  doc.text(`Total Distance : ${totalKm} KM`, 90, y);

  return doc;
};

function FuelVsKilometer() {
  /* ------------------ STATES ------------------ */
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [fuelType, setFuelType] = useState("All");
  const [vehicleId, setVehicleId] = useState("All");
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
  useEffect(() => {
    let start, end;

    if (period === "This Month") {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    } else if (period === "Last Month") {
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      end = new Date(now.getFullYear(), now.getMonth(), 0);
    } else if (period === "Last Year") {
      start = new Date(now.getFullYear() - 1, 0, 1);
      end = new Date(now.getFullYear() - 1, 11, 31);
    }

    setFromDate(formatDate(start));
    setToDate(formatDate(end));
  }, [period]);

  /* ------------------ FETCH DATA ------------------ */
  const fetchReport = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        from_date: fromDate,
        to_date: toDate,
        fuel_type: fuelType,
        vehicle_id: vehicleId,
        search,
      });

      const res = await fetch(
        `http://localhost:8000/api/reports/fuel-vs-kilometer/?${params.toString()}`
      );

      const data = await res.json();
      setRows(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fuel vs KM fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [fromDate, toDate, fuelType, vehicleId, search]);

  /* ------------------ SUMMARY ------------------ */
  const totalFuel = rows.reduce((s, r) => s + Number(r.fuelLiters || 0), 0);
  const totalKm = rows.reduce((s, r) => s + Number(r.totalKm || 0), 0);

  /* ------------------ ACTIONS ------------------ */
  const handleDownloadReport = async () => {
    const doc = await generateFuelKmPDF({
      rows,
      fromDate,
      toDate,
      totalFuel,
      totalKm,
    });
    doc.save("fuel_vs_kilometer_report.pdf");
  };

  const handlePrintReport = async () => {
    const doc = await generateFuelKmPDF({
      rows,
      fromDate,
      toDate,
      totalFuel,
      totalKm,
    });
    window.open(doc.output("bloburl")).print();
  };

  return (
    <Box p={2}>
      <Typography variant="h5" fontWeight={700} mb={2}>
        Fuel vs Kilometer
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
            label="Vehicle"
            size="small"
            value={vehicleId}
            onChange={(e) => setVehicleId(e.target.value)}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="All">All Vehicles</MenuItem>
          </TextField>

          <TextField
            select
            label="Fuel Type"
            size="small"
            value={fuelType}
            onChange={(e) => setFuelType(e.target.value)}
            sx={{ minWidth: 140 }}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Diesel">Diesel</MenuItem>
            <MenuItem value="Adblue">Adblue</MenuItem>
          </TextField>

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
            size="small"
            label="From Date"
            InputLabelProps={{ shrink: true }}
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />

          <TextField
            type="date"
            size="small"
            label="To Date"
            InputLabelProps={{ shrink: true }}
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />

        </Box>
      </Card>

      {/* SUMMARY */}
      <Card sx={{ p: 2, mb: 3, maxWidth: 520 }}>
        <Typography fontWeight={600}>
          Fuel & Distance Summary
        </Typography>
        <Typography variant="h6">
          {totalFuel} Liters / {totalKm} KM
        </Typography>
      </Card>

      {/* TABLE */}
      <Card sx={{ p: 2 }}>
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography variant="h6">Fuel & Distance Records</Typography>
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
                  "Vehicle No",
                  "Fuel (ltr)",
                  "Production KM",
                  "From",
                  "Sales KM",
                  "To",
                  "Total KM",
                ].map(h => (
                  <TableCell key={h}><b>{h}</b></TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map((r, i) => (
                <TableRow key={i}>
                  <TableCell>{r.date}</TableCell>
                  <TableCell>{r.vehicleNo}</TableCell>
                  <TableCell>{r.fuelLiters}</TableCell>
                  <TableCell>{r.productionKm}</TableCell>
                  <TableCell>{r.destinationFrom}</TableCell>
                  <TableCell>{r.salesKm}</TableCell>
                  <TableCell>{r.destinationTo}</TableCell>
                  <TableCell>{r.totalKm}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}

export default FuelVsKilometer;
