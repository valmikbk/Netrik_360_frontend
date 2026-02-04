import React from "react";
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
} from "@mui/material";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function AllStocks() {
  const rows = [
    { item: "10MM", stock: 4072.7 },
    { item: "20MM", stock: 5980.8 },
    { item: "40MM", stock: -30.0 },
    { item: "ADBLUE", stock: 8.0 },
    { item: "ALL MIX", stock: -1.0 },
    { item: "DIESEL", stock: 403.0 },
  ];

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
        r.stock.toFixed(2),
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
                    ${r.stock.toFixed(2)}
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
    <Box sx={{ p: 4, backgroundColor: "#fff", minHeight: "100vh" }}>
      {/* ACTION BUTTONS */}
      <Stack direction="row" spacing={2} justifyContent="flex-end" mb={2}>
        <Button variant="outlined" onClick={handlePrint}>
          Print
        </Button>
        <Button variant="contained" onClick={handleDownloadPDF}>
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
        ALL STOCK REPORT
      </Typography>

      {/* TABLE */}
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
            {rows.map((row, index) => (
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
                    color: row.stock < 0 ? "error.main" : "text.primary",
                    fontWeight: row.stock < 0 ? 600 : 400,
                  }}
                >
                  {row.stock.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default AllStocks;
