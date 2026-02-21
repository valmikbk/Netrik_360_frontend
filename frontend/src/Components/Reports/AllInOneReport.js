import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  MenuItem,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PrintIcon from "@mui/icons-material/Print";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const months = ["Jan","Feb","Mar","Apr","May","June","July","Aug","Sep","Oct","Nov","Dec","Total"]

function AllInOneReport() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [rows, setRows] = useState([]);

  const fetchReport = async () => {
    const res = await fetch(
      `http://localhost:8000//api/reports/all-in-one/?year=${year}`
    );
    const data = await res.json();
    setRows(data.rows || []);
  };

  useEffect(() => {
    fetchReport();
  }, [year]);

  const totalProfit =
    rows.find((r) => r.label === "Profit")?.values.at(-1) || 0;

  const generateAllInOnePDF = async ({
  rows,
  year,
  totalProfit,
}) => {
  const doc = new jsPDF("p", "mm", "a4");
  const primary = [41, 98, 255];

  // Header background
  doc.setFillColor(...primary);
  doc.rect(0, 0, 210, 25, "F");

  doc.setTextColor(255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("ALL IN ONE REPORT", 70, 16);

  doc.setTextColor(0);
  doc.setFontSize(10);
  doc.text(`Year : ${year}`, 14, 36);

  autoTable(doc, {
    startY: 42,
    head: [
      [
        "Description",
        ...months,
      ],
    ],
    body: rows.map((row) => [
      row.label,
      ...row.values.map((v) =>
        Number(v || 0).toLocaleString("en-IN")
      ),
    ]),
    theme: "grid",
    headStyles: {
      fillColor: primary,
      textColor: 255,
      halign: "center",
    },
    styles: {
      fontSize: 8,
      halign: "center",
    },
  });

  const y = doc.lastAutoTable.finalY + 8;

  doc.setFont("helvetica", "bold");
  doc.text(
    `Total Profit : ₹ ${Number(totalProfit || 0).toLocaleString("en-IN")}`,
    14,
    y
  );

  return doc;
};

const handleDownload = async () => {
  const doc = await generateAllInOnePDF({
    rows,
    year,
    totalProfit,
  });

  doc.save("all_in_one_report.pdf");
};

const handlePrint = async () => {
  const doc = await generateAllInOnePDF({
    rows,
    year,
    totalProfit,
  });

  window.open(doc.output("bloburl")).print();
};

  return (
  <Box sx={{ width: "100%" }}>

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
    ALL IN ONE REPORT
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

    {/* ================= FILTER CARD ================= */}
    <Card
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 2,
        boxShadow: "0px 4px 14px rgba(0,0,0,0.06)",
      }}
    >
      <TextField
  select
  label="YEAR"
  size="small"
  value={year}
  onChange={(e) => setYear(e.target.value)}
  sx={{ minWidth: 200 }}
>
  <MenuItem value={2023}>2023</MenuItem>
  <MenuItem value={2024}>2024</MenuItem>
  <MenuItem value={2025}>2025</MenuItem>
  <MenuItem value={2026}>2026</MenuItem>
</TextField>
    </Card>

    {/* ================= SUMMARY ================= */}
    <Card sx={{ p: 3, mb: 3, borderRadius: 2, maxWidth: 420 }}>
      <Typography variant="caption" fontWeight={600} color="text.secondary">
        TOTAL PROFIT
      </Typography>

      <Typography
        variant="h6"
        fontWeight={700}
        color={totalProfit >= 0 ? "success.main" : "error.main"}
      >
        ₹ {Number(totalProfit || 0).toLocaleString("en-IN")}
      </Typography>
    </Card>

    {/* ================= TABLE ================= */}
    <Card sx={{ borderRadius: 2 }}>
      <TableContainer component={Paper}>
        <Table size="small">

          <TableHead>
            <TableRow>
              <TableCell
                align="center"
                sx={{
                  fontWeight: 700,
                  backgroundColor: "#f1f5f9",
                  borderRight: "1px solid #e5e7eb",
                }}
              >
                DESCRIPTION
              </TableCell>

              {months.map((m, index) => (
                <TableCell
                  key={m}
                  align="center"
                  sx={{
                    fontWeight: 700,
                    backgroundColor: "#f1f5f9",
                    borderRight:
                      index !== months.length - 1
                        ? "1px solid #e5e7eb"
                        : "none",
                  }}
                >
                  {m.toUpperCase()}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={months.length + 1} align="center">
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, i) => (
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
                    sx={{
                      fontWeight: 600,
                      borderRight: "1px solid #e5e7eb",
                    }}
                  >
                    {row.label}
                  </TableCell>

                  {row.values.map((v, idx) => (
                    <TableCell
                      key={idx}
                      align="center"
                      sx={{
                        borderRight:
                          idx !== row.values.length - 1
                            ? "1px solid #e5e7eb"
                            : "none",
                      }}
                    >
                      {Number(v || 0).toLocaleString("en-IN")}
                    </TableCell>
                  ))}
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

export default AllInOneReport;
