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
            "Vehicle Number",
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
            r.VehicleNo,
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
                    SALES DETAILS REPORT
                </Typography>

                <Box display="flex" gap={1}>
                    <IconButton
                        size="small"
                        onClick={handleDownloadReport}
                        sx={{ color: "#fff" }}
                    >
                        <FileDownloadIcon />
                    </IconButton>

                    <IconButton
                        size="small"
                        onClick={handlePrintReport}
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

            {/* ================= KPI SUMMARY ================= */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: 3,
                    mb: 3,
                }}
            >
                <Card sx={{ p: 3, borderRadius: 2 }}>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight={700}
                        letterSpacing={0.5}
                    >
                        TOTAL SALES
                    </Typography>
                    <Typography variant="h6" fontWeight={700}>
                        ₹ {totalSales.toLocaleString()}
                    </Typography>
                </Card>

                <Card sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="caption"
                        color="text.secondary"
                        fontWeight={700}
                        letterSpacing={0.5}>
                        RECEIVED
                    </Typography>
                    <Typography
                        variant="h6"
                        fontWeight={700}
                        color="success.main"
                    >
                        ₹ {received.toLocaleString()}
                    </Typography>
                </Card>

                <Card sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="caption"
                        color="text.secondary"
                        fontWeight={700}
                        letterSpacing={0.5}>
                        OUTSTANDING
                    </Typography>
                    <Typography
                        variant="h6"
                        fontWeight={700}
                        color="error.main"
                    >
                        ₹ {balance.toLocaleString()}
                    </Typography>
                </Card>
            </Box>

            {/* ================= DATA TABLE ================= */}
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
                                {[
                                    "DATE", "BILL NO", "CUSTOMER", "VILLAGE",
                                    "VEHICLE NO", "ITEM", "BRASS",
                                    "AMOUNT", "BALANCE", "MR NAME"
                                ].map((header, index, arr) => (
                                    <TableCell
                                        key={header}
                                        sx={{
                                            fontWeight: 700,
                                            backgroundColor: "#f1f5f9",
                                            border: index !== arr.length - 1
                                                ? "1px solid #e0e0e0"
                                                : "none",
                                        }}
                                    >
                                        {header}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {rows.map((r, i) => (
                                <TableRow key={i} hover>
                                    {[
                                        formatDisplayDate(r.date),
                                        r.billNo,
                                        r.customerName,
                                        r.village,
                                        r.vehicleNumber,
                                        r.item,
                                        r.brass,
                                        `₹ ${Number(r.amount).toLocaleString()}`,
                                        `₹ ${Number(r.balance).toLocaleString()}`,
                                        r.mrName,
                                    ].map((cell, index, arr) => (
                                        <TableCell
                                            key={index}
                                            sx={{
                                                border: index !== arr.length - 1
                                                    ? "1px solid #e0e0e0"
                                                    : "none",
                                            }}
                                        >
                                            {cell}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>

                    </Table>
                </TableContainer>
            </Card>
        </Box>
    );
}

export default SalesDetails;
