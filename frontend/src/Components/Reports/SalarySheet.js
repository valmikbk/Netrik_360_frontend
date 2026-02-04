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

/* ---------------- DATE FORMAT ---------------- */
const formatDate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

/* ---------------- IMAGE TO BASE64 ---------------- */
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

/* ---------------- PDF ---------------- */
const generateSalaryPDF = async ({ rows, fromDate, toDate, summary }) => {
  const doc = new jsPDF("p", "mm", "a4");
  const primary = [41, 98, 255];
  const logoBase64 = await loadImageAsBase64(logo);

  doc.setFillColor(...primary);
  doc.rect(0, 0, 210, 28, "F");
  doc.addImage(logoBase64, "PNG", 14, 6, 20, 16);

  doc.setTextColor(255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("SALARY SHEET REPORT", 60, 18);

  doc.setTextColor(0);
  doc.setFontSize(10);
  doc.text(`From : ${fromDate}`, 14, 44);
  doc.text(`To : ${toDate}`, 80, 44);

  autoTable(doc, {
    startY: 52,
    head: [["Sr No", "Employee", "Salary", "Days", "Amount"]],
    body: rows.map((r, i) => [
      i + 1,
      r.employee_name,
      r.salary,
      r.working_days,
      r.salary_amount,
    ]),
    theme: "grid",
    headStyles: { fillColor: primary, textColor: 255 },
  });

  doc.text(
    `Total Salary Paid : ₹ ${summary.total_salary}`,
    14,
    doc.lastAutoTable.finalY + 10
  );

  return doc;
};

function SalarySheet() {
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState({
    total_salary: 0,
    employees: 0,
  });

  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("This Month");

  const now = new Date();
  const [fromDate, setFromDate] = useState(
    formatDate(new Date(now.getFullYear(), now.getMonth(), 1))
  );
  const [toDate, setToDate] = useState(
    formatDate(new Date(now.getFullYear(), now.getMonth() + 1, 0))
  );

  /* ---------------- PERIOD HANDLER ---------------- */
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
  }, [period]);

  /* ---------------- FETCH ---------------- */
  const fetchSalary = async () => {
    const params = new URLSearchParams({
      from_date: fromDate,
      to_date: toDate,
      search,
    });

    const res = await fetch(
      `http://localhost:8000/api/salary-sheet/?${params}`
    );

    const data = await res.json();
    setRows(data.results || []);
    setSummary(data.summary || { total_salary: 0, employees: 0 });
  };

  useEffect(() => {
    fetchSalary();
  }, [fromDate, toDate, search]);

  /* ---------------- PDF ---------------- */
  const handleDownload = async () => {
    const doc = await generateSalaryPDF({
      rows,
      fromDate,
      toDate,
      summary,
    });
    doc.save("salary_sheet.pdf");
  };

  return (
    <Box p={2}>
      <Typography variant="h5" fontWeight={700} mb={2}>
        Salary Sheet
      </Typography>

      {/* FILTERS */}
      <Card sx={{ p: 2, mb: 2 }}>
        <Box display="flex" gap={2} flexWrap="wrap">
          <TextField
            label="Search Employee"
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
          >
            <MenuItem value="This Month">This Month</MenuItem>
            <MenuItem value="Last Month">Last Month</MenuItem>
          </TextField>
        </Box>
      </Card>

      {/* SUMMARY */}
      <Card sx={{ p: 2, mb: 3, maxWidth: 420 }}>
        <Typography>Total Salary Paid</Typography>
        <Typography variant="h5" fontWeight={700} color="error.main">
          ₹ {summary.total_salary}
        </Typography>
        <Typography variant="body2">
          Employees: {summary.employees}
        </Typography>
      </Card>

      {/* TABLE */}
      <Card sx={{ p: 2 }}>
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography variant="h6">Salary Details</Typography>
          <IconButton onClick={handleDownload}>
            <FileDownloadIcon />
          </IconButton>
        </Box>

        <Divider />

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sr No</TableCell>
                <TableCell>Employee</TableCell>
                <TableCell>Salary</TableCell>
                <TableCell>Days</TableCell>
                <TableCell>Amount</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map((r, i) => (
                <TableRow key={r.id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{r.employee_name}</TableCell>
                  <TableCell>₹ {r.salary}</TableCell>
                  <TableCell>{r.working_days}</TableCell>
                  <TableCell>₹ {r.salary_amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}

export default SalarySheet;
