import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import Header from "../Header/Header";

function DailyPurchase() {
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [itemForm, setItemForm] = useState({
    itemName: "",
    amount: "",
  });

  const [items, setItems] = useState([]);

  const handleItemChange = (e) => {
    setItemForm({ ...itemForm, [e.target.name]: e.target.value });
  };

  const handleAddItem = () => {
    if (!itemForm.itemName || !itemForm.amount) return;

    setItems([
      ...items,
      {
        ...itemForm,
        amount: Number(itemForm.amount),
      },
    ]);

    setItemForm({ itemName: "", amount: "" });
  };

  const totalAmount = items.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const handleSave = async () => {
    if (items.length === 0) {
      alert("Add at least one item");
      return;
    }

    try {
      const payload = { date, items };
      console.log('payload', payload)

      const res = await fetch(
        "http://localhost:8000/api/daily-purchase/create/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
  const errorData = await res.json();
  console.log("Backend Error:", errorData);
  alert("Validation failed");
  return;
}

      alert("Daily purchase saved successfully");
      setItems([]);
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  /* ================= ERP LABEL STYLE ================= */
  const labelStyle = {
    width: 240,
    minWidth: 240,
    maxWidth: 240,
    flex: "0 0 240px",
    height: 56,
    background: "linear-gradient(145deg, #e3f2fd, #bbdefb)",
    border: "1px solid #90caf9",
    borderRadius: 1,
    px: 2,
    fontWeight: 600,
    fontSize: "0.9rem",
    display: "flex",
    alignItems: "center",
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header />

      <Box sx={{ flexGrow: 1, p: 3, mt:4 }}>
        <Card
          sx={{
            width: "98%",
            mx: "auto",
            minHeight: "80vh",
            borderRadius: 3,
            boxShadow: "0px 10px 30px rgba(0,0,0,0.25)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* HEADER */}
          <Box
            sx={{
              px: 3,
              py: 2,
              background: "linear-gradient(90deg, #1a237e, #283593)",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, textAlign: "center", color: "#fff" }}
            >
              DAILY PURCHASES
            </Typography>
          </Box>

          <Divider />

          <CardContent
            sx={{
              px: 8,
              py: 6,
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box display="flex" flexDirection="column" gap={4}>
              
              {/* DATE */}
              <Box display="flex" alignItems="center" gap={3}>
                <Box sx={labelStyle}>DATE *</Box>
                <TextField
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  fullWidth
                />
              </Box>

              {/* ITEM ENTRY */}
              <Box display="flex" alignItems="center" gap={3}>
                <Box sx={labelStyle}>ITEM NAME *</Box>
                <TextField
                  name="itemName"
                  value={itemForm.itemName}
                  onChange={handleItemChange}
                  fullWidth
                />
              </Box>

              <Box display="flex" alignItems="center" gap={3}>
                <Box sx={labelStyle}>AMOUNT *</Box>
                <TextField
                  name="amount"
                  type="number"
                  value={itemForm.amount}
                  onChange={handleItemChange}
                  fullWidth
                />
              </Box>

              <Box display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  sx={{
                    px: 5,
                    backgroundColor: "#2962ff",
                    "&:hover": { backgroundColor: "#0039cb" },
                  }}
                  onClick={handleAddItem}
                >
                  ADD ITEM
                </Button>
              </Box>

              {/* TABLE */}
              {items.length > 0 && (
                <TableContainer component={Paper} sx={{ mt: 3 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><b>Item Name</b></TableCell>
                        <TableCell><b>Amount</b></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.itemName}</TableCell>
                          <TableCell>{item.amount.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}

                      <TableRow>
                        <TableCell align="right">
                          <b>Total</b>
                        </TableCell>
                        <TableCell>
                          <b>{totalAmount.toFixed(2)}</b>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            <Box display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                sx={{
                  px: 6,
                  backgroundColor: "#2962ff",
                  "&:hover": { backgroundColor: "#0039cb" },
                }}
                onClick={handleSave}
              >
                SAVE &gt;&gt;
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default DailyPurchase;
