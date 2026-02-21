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
import PrintIcon from "@mui/icons-material/Print";

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

    const handlePrint = async () => {
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

        const blobUrl = doc.output("bloburl");
        const printWindow = window.open(blobUrl);
        printWindow.onload = () => {
            printWindow.print();
        };
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
                    SALARY SHEET REPORT
                </Typography>

                <Box>
                    <IconButton
                        onClick={handleDownload}
                        sx={{ color: "#fff" }}
                    >
                        <FileDownloadIcon />
                    </IconButton>

                    <IconButton
                        onClick={handlePrint}
                        sx={{ color: "#fff" }}
                    >
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
                <Box display="flex" gap={3} flexWrap="wrap" alignItems="center">

                    <TextField
                        label="SEARCH EMPLOYEE"
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

                    {/* <TextField
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

            {/* ================= SUMMARY ================= */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: 3,
                    mb: 3,
                }}
            >
                <Card sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                        TOTAL SALARY PAID
                    </Typography>
                    <Typography variant="h6" fontWeight={700} color="error.main">
                        ₹ {Number(summary.total_salary || 0).toLocaleString()}
                    </Typography>
                </Card>

                <Card sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                        EMPLOYEE COUNT
                    </Typography>
                    <Typography variant="h6" fontWeight={700}>
                        {summary.employee_count || 0}
                    </Typography>
                </Card>
            </Box>

            {/* ================= TABLE ================= */}
            <Card
                sx={{
                    borderRadius: 2,
                    boxShadow: "0px 4px 14px rgba(0,0,0,0.06)",
                }}
            >
                <TableContainer sx={{ maxHeight: 500 }}>
                    <Table stickyHeader size="small">

                        <TableHead>
                            <TableRow>
                                {["SR NO", "EMPLOYEE", "SALARY", "DAYS", "AMOUNT"].map(
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
                            {rows.map((r, i) => (
                                <TableRow
                                    key={r.id}
                                    hover
                                    sx={{
                                        "&:nth-of-type(even)": {
                                            backgroundColor: "#f9fafb",
                                        },
                                    }}
                                >
                                    <TableCell align="center" sx={{ borderRight: "1px solid #e5e7eb" }}>
                                        {i + 1}
                                    </TableCell>

                                    <TableCell align="center" sx={{ borderRight: "1px solid #e5e7eb" }}>
                                        {r.employee_name}
                                    </TableCell>

                                    <TableCell align="center" sx={{ borderRight: "1px solid #e5e7eb" }}>
                                        ₹ {Number(r.salary).toLocaleString()}
                                    </TableCell>

                                    <TableCell align="center" sx={{ borderRight: "1px solid #e5e7eb" }}>
                                        {r.working_days}
                                    </TableCell>

                                    <TableCell align="center">
                                        ₹ {Number(r.salary_amount).toLocaleString()}
                                    </TableCell>
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
