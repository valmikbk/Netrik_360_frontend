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
  const [vehicles, setVehicles] = useState([]);

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
      vehicle_id: vehicleId === "All" ? "" : vehicleId,
      search,
    });

    const res = await fetch(
      `http://localhost:8000/api/reports/fuel-vs-kilometer/?${params.toString()}`
    );

    const data = await res.json();
    const reportData = Array.isArray(data) ? data : [];

    setRows(reportData);

    // ✅ Extract unique vehicles (ID + Number)
    const uniqueVehicles = [
      ...new Map(
        reportData.map((item) => [
          item.vehicleId,
          { id: item.vehicleId, number: item.vehicleNo },
        ])
      ).values(),
    ];

    setVehicles(uniqueVehicles);

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

  const formatDisplayDate = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

 return (
  <Box sx={{ width: "100%" }}>

    {/* ================= ERP HEADER ================= */}
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
        FUEL VS KILOMETER REPORT
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

    {/* ================= FILTER CARD ================= */}
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
          sx={{ minWidth: 220 }}
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
          label="VEHICLE"
          size="small"
          value={vehicleId}
          onChange={(e) => setVehicleId(e.target.value)}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="All">All Vehicles</MenuItem>
          {vehicles.map((v) => (
            <MenuItem key={v.id} value={v.id}>
              {v.number}
            </MenuItem>
          ))}
        </TextField>

        {/* <TextField
          select
          label="FUEL TYPE"
          size="small"
          value={fuelType}
          onChange={(e) => setFuelType(e.target.value)}
          sx={{ minWidth: 140 }}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Diesel">Diesel</MenuItem>
          <MenuItem value="Adblue">Adblue</MenuItem>
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

    {/* ================= SUMMARY CARD ================= */}
    <Card sx={{ p: 3, mb: 3, borderRadius: 2 }}>
      <Typography variant="caption" fontWeight={600} color="text.secondary">
        FUEL & DISTANCE SUMMARY
      </Typography>

      <Typography variant="h6" fontWeight={700} color="success.main">
        {Number(totalFuel || 0).toLocaleString("en-IN")} Ltr
      </Typography>

      <Typography variant="body2" mt={1}>
        Total Distance: {Number(totalKm || 0).toLocaleString("en-IN")} KM
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
                "VEHICLE NO",
                "FUEL (LTR)",
                "PRODUCTION KM",
                "FROM",
                "SALES KM",
                "TO",
                "TOTAL KM",
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
                <TableCell colSpan={8} align="center">
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
                    {formatDisplayDate(r.date)}
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{ borderRight: "1px solid #e5e7eb" }}
                  >
                    {r.vehicleNo ?? "-"}
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{ borderRight: "1px solid #e5e7eb" }}
                  >
                    {Number(r.fuelLiters || 0).toLocaleString("en-IN")}
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{ borderRight: "1px solid #e5e7eb" }}
                  >
                    {Number(r.productionKm || 0).toLocaleString("en-IN")}
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{ borderRight: "1px solid #e5e7eb" }}
                  >
                    {r.destinationFrom || "-"}
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{ borderRight: "1px solid #e5e7eb" }}
                  >
                    {Number(r.salesKm || 0).toLocaleString("en-IN")}
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{ borderRight: "1px solid #e5e7eb" }}
                  >
                    {r.destinationTo || "-"}
                  </TableCell>

                  <TableCell align="center">
                    {Number(r.totalKm || 0).toLocaleString("en-IN")}
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

export default FuelVsKilometer;
