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

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* ---------------- DATE FORMAT ---------------- */
const formatDate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

function SalarySheet() {
  const today = new Date();

  /* ---------------- STATES ---------------- */
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState({
    total_salary: 0,
    employee_count: 0,
  });

  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("This Month");

  const [fromDate, setFromDate] = useState(
    formatDate(new Date(today.getFullYear(), today.getMonth(), 1))
  );

  const [toDate, setToDate] = useState(
    formatDate(new Date(today.getFullYear(), today.getMonth() + 1, 0))
  );

  /* ---------------- PERIOD SYNC ---------------- */
  useEffect(() => {
    const now = new Date();

    if (period === "Today") {
      const d = formatDate(now);
      setFromDate(d);
      setToDate(d);
    }

    else if (period === "This Week") {
      const firstDay = new Date(now);
      firstDay.setDate(now.getDate() - now.getDay());

      const lastDay = new Date(firstDay);
      lastDay.setDate(firstDay.getDate() + 6);

      setFromDate(formatDate(firstDay));
      setToDate(formatDate(lastDay));
    }

    else if (period === "This Month") {
      setFromDate(formatDate(new Date(now.getFullYear(), now.getMonth(), 1)));
      setToDate(formatDate(new Date(now.getFullYear(), now.getMonth() + 1, 0)));
    }

    else if (period === "Last Month") {
      setFromDate(formatDate(new Date(now.getFullYear(), now.getMonth() - 1, 1)));
      setToDate(formatDate(new Date(now.getFullYear(), now.getMonth(), 0)));
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
    setSummary(data.summary || {});
  };

  useEffect(() => {
    fetchSalary();
  }, [fromDate, toDate, search]);

  /* ---------------- PDF ---------------- */
  const handleDownload = async () => {
    const doc = new jsPDF("p", "mm", "a4");

    doc.setFontSize(16);
    doc.text("SALARY SHEET REPORT", 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [["Sr No", "Employee", "Salary", "Days", "Amount"]],
      body: rows.map((r, i) => [
        i + 1,
        r.employee_name,
        r.salary,
        r.working_days,
        r.salary_amount,
      ]),
    });

    doc.save("salary_sheet.pdf");
  };

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={700} mb={2}>
        Salary Sheet
      </Typography>

      {/* ---------------- FILTERS ---------------- */}
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
            <MenuItem value="Today">Today</MenuItem>
            <MenuItem value="This Week">This Week</MenuItem>
            <MenuItem value="This Month">This Month</MenuItem>
            <MenuItem value="Last Month">Last Month</MenuItem>
          </TextField>

          {/* Always Visible Date Range */}
          <TextField
            label="From Date"
            type="date"
            size="small"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="To Date"
            type="date"
            size="small"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />

        </Box>
      </Card>

      {/* ---------------- SUMMARY ---------------- */}
      <Card sx={{ p: 2, mb: 3, maxWidth: 420 }}>
        <Typography>Total Salary Paid</Typography>
        <Typography variant="h5" fontWeight={700} color="error.main">
          ₹ {summary.total_salary || 0}
        </Typography>
        <Typography variant="body2">
          Employees: {summary.employee_count || 0}
        </Typography>
      </Card>

      {/* ---------------- TABLE ---------------- */}
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
