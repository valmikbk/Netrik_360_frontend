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

function SalesSheet() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const allowedItems = ["20MM", "40MM", "ALL MIX", "M SAND", "DUST"];

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

  /* ---------------- FILTER + ABSOLUTE ---------------- */
  const filteredRows = rows
    .filter((r) => allowedItems.includes(r.item))
    .map((r) => ({
      ...r,
      stock: Math.abs(Number(r.stock)),
    }));

  /* ---------------- PDF DOWNLOAD ---------------- */
  const handleDownloadPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("ALL STOCK REPORT", 105, 20, { align: "center" });

    autoTable(doc, {
      startY: 30,
      head: [["Item Name", "Total Stock"]],
      body: filteredRows.map((r) => [
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
              ${filteredRows
                .map(
                  (r) => `
                <tr>
                  <td>${r.item}</td>
                  <td>${Number(r.stock).toFixed(2)}</td>
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
    <Box sx={{ p: 4, backgroundColor: "#fff", minHeight: "100vh" }}>
      {/* ACTION BUTTONS */}
      <Stack direction="row" spacing={2} justifyContent="flex-end" mb={2}>
        <Button
          variant="outlined"
          onClick={handlePrint}
          disabled={filteredRows.length === 0}
        >
          Print
        </Button>
        <Button
          variant="contained"
          onClick={handleDownloadPDF}
          disabled={filteredRows.length === 0}
        >
          Download PDF
        </Button>
      </Stack>

      {/* TITLE */}
      <Typography
        variant="h5"
        fontWeight={800}
        textAlign="center"
        mb={3}
      >
        SHALES SHEET
      </Typography>

      {/* LOADING */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {/* EMPTY STATE */}
      {!loading && filteredRows.length === 0 && (
        <Typography textAlign="center" color="text.secondary">
          No stock data available
        </Typography>
      )}

      {/* TABLE */}
      {!loading && filteredRows.length > 0 && (
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            maxWidth: 700,
            mx: "auto",
            border: "1px solid #000",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    border: "1px solid #000",
                    textAlign: "center",
                  }}
                >
                  Item Name
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    border: "1px solid #000",
                    textAlign: "center",
                  }}
                >
                  Total Stock
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredRows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell
                    sx={{
                      border: "1px solid #000",
                      textAlign: "center",
                    }}
                  >
                    {row.item}
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid #000",
                      textAlign: "center",
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

export default SalesSheet;
