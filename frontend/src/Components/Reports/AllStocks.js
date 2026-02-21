import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function AllStocks() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH STOCK DATA ---------------- */
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/stocks/")
      .then((res) => res.json())
      .then((data) => {
        setRows(data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch stocks", err);
        setLoading(false);
      });
  }, []);

  /* ---------------- PDF DOWNLOAD ---------------- */
  const handleDownloadPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("ALL STOCK REPORT", 105, 20, { align: "center" });

    autoTable(doc, {
      startY: 30,
      head: [["Item Name", "Total Stock"]],
      body: rows.map((r) => [
        r.item,
        Number(r.stock).toFixed(2),
      ]),
      theme: "grid",
      styles: {
        fontSize: 11,
        halign: "center",
        valign: "middle",
      },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: 0,
        lineWidth: 0.5,
        lineColor: 0,
        fontStyle: "bold",
      },
      bodyStyles: {
        lineWidth: 0.5,
        lineColor: 0,
      },
      columnStyles: {
        1: {
          textColor: (data) =>
            parseFloat(data.cell.raw) < 0 ? [200, 0, 0] : [0, 0, 0],
        },
      },
    });

    doc.save("all_stock_report.pdf");
  };

  /* ---------------- PRINT ---------------- */
  const handlePrint = () => {
    const printWindow = window.open("", "", "width=800,height=600");

    printWindow.document.write(`
      <html>
        <head>
          <title>All Stock Report</title>
          <style>
            body {
              font-family: Arial;
              padding: 40px;
            }
            h2 {
              text-align: center;
              margin-bottom: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid #000;
              padding: 8px;
              text-align: center;
            }
            th {
              font-weight: bold;
            }
            .negative {
              color: red;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <h2>ALL STOCK REPORT</h2>
          <table>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Total Stock</th>
              </tr>
            </thead>
            <tbody>
              ${rows
                .map(
                  (r) => `
                <tr>
                  <td>${r.item}</td>
                  <td class="${r.stock < 0 ? "negative" : ""}">
                    ${Number(r.stock).toFixed(2)}
                  </td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
  <Box sx={{ width: "100%" }}>

    {/* ACTION BUTTONS */}
    <Stack
      direction="row"
      spacing={2}
      justifyContent="flex-end"
      mb={3}
    >
      <Button
        size="small"
        variant="outlined"
        onClick={handlePrint}
        disabled={rows.length === 0}
        sx={{
          fontWeight: 600,
          borderColor: "#cbd5e1",
          "&:hover": {
            borderColor: "#94a3b8",
            backgroundColor: "#f8fafc",
          },
        }}
      >
        PRINT
      </Button>

      <Button
        size="small"
        variant="contained"
        onClick={handleDownloadPDF}
        disabled={rows.length === 0}
        sx={{
          fontWeight: 600,
          backgroundColor: "#1e40af",
          "&:hover": { backgroundColor: "#1d4ed8" },
        }}
      >
        DOWNLOAD PDF
      </Button>
    </Stack>

    {/* INDUSTRY STANDARD PAGE HEADER */}
    <Box
      sx={{
        mb: 3,
        py: 2,
        px: 3,
        borderRadius: 2,
        background: "linear-gradient(90deg, #1a237e, #283593)",
        color: "#ffffff",
        textAlign: "center",
      }}
    >
      <Typography
        variant="h6"
        fontWeight={700}
        letterSpacing={1}
      >
        ALL STOCK REPORT
      </Typography>
    </Box>

    {/* LOADING */}
    {loading && (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    )}

    {/* EMPTY STATE */}
    {!loading && rows.length === 0 && (
      <Typography textAlign="center" color="text.secondary">
        No stock data available
      </Typography>
    )}

    {/* TABLE */}
    {!loading && rows.length > 0 && (
      <TableContainer
        component={Paper}
        sx={{
          width: "100%",
          border: "1px solid #d1d5db",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Table size="small">

          <TableHead>
            <TableRow>
              {["ITEM NAME", "TOTAL STOCK"].map((header, index, arr) => (
                <TableCell
                  key={header}
                  align="center"
                  sx={{
                    fontWeight: 700,
                    backgroundColor: "#f3f4f6",
                    borderBottom: "1px solid #d1d5db",
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
            {rows.map((row, index) => (
              <TableRow
                key={index}
                sx={{
                  "&:nth-of-type(even)": {
                    backgroundColor: "#f9fafb",
                  },
                  "&:hover": {
                    backgroundColor: "#eef2ff",
                  },
                }}
              >
                <TableCell
                  align="center"
                  sx={{
                    borderBottom: "1px solid #e5e7eb",
                    borderRight: "1px solid #e5e7eb",
                  }}
                >
                  {row.item}
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    borderBottom: "1px solid #e5e7eb",
                    fontWeight:
                      Number(row.stock) < 0 ? 600 : 500,
                    color:
                      Number(row.stock) < 0
                        ? "error.main"
                        : "text.primary",
                  }}
                >
                  {Number(row.stock).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </TableContainer>
    )}
  </Box>
);
}

export default AllStocks;
