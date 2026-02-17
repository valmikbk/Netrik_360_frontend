import React, { useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    IconButton,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Header from '../Header/Header';

function DailyPurchase() {
    const [date, setDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    const [itemForm, setItemForm] = useState({
        itemName: "",
        qty: "",
        price: "",
    });

    const [items, setItems] = useState([]);

    const handleItemChange = (e) => {
        setItemForm({ ...itemForm, [e.target.name]: e.target.value });
    };

    const handleAddItem = () => {
        if (!itemForm.itemName || !itemForm.qty || !itemForm.price) return;

        const amount =
            Number(itemForm.qty) * Number(itemForm.price);

        setItems([
            ...items,
            {
                ...itemForm,
                amount,
            },
        ]);

        setItemForm({
            itemName: "",
            qty: "",
            price: "",
        });
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
            const payload = {
                date,
                items,
            };

            const res = await fetch(
                "http://localhost:8000/api/daily-purchase/create/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                alert("Failed to save daily purchase");
                return;
            }

            alert("Daily purchase saved successfully");

            // Reset after save
            setItems([]);
        } catch (err) {
            console.error(err);
            alert("Server error");
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
            <Header />
            <Card
                sx={{
                    maxWidth: 1100,
                    mx: "auto",
                    borderRadius: 3,
                    boxShadow: "0px 10px 30px rgba(0,0,0,0.25)",
                    mt: 12
                }}
            >
                {/* Header */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        px: 3,
                        py: 2,
                        background: "linear-gradient(90deg, #1a237e, #283593)",
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: 600, textAlign: "center", width: "100%", color: "#fff" }}>
                        DAILY PURCHASES
                    </Typography>

                    {/* <IconButton>
          <CloseIcon />
        </IconButton> */}
                </Box>

                <Divider />

                <CardContent sx={{ px: 4, py: 3 }}>
                    {/* Date */}
                    <TextField
                        label="Date *"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                    />

                    {/* Item Entry */}
                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            mt: 3,
                            alignItems: "flex-end",
                        }}
                    >
                        <TextField
                            label="Item Name"
                            name="itemName"
                            value={itemForm.itemName}
                            onChange={handleItemChange}
                            fullWidth
                        />

                        <TextField
                            label="Qty."
                            name="qty"
                            type="number"
                            value={itemForm.qty}
                            onChange={handleItemChange}
                            inputProps={{ min: 0, step: "0.01" }}
                            fullWidth
                        />

                        <TextField
                            label="Price / Unit"
                            name="price"
                            type="number"
                            value={itemForm.price}
                            onChange={handleItemChange}
                            inputProps={{ min: 0, step: "0.01" }}
                            fullWidth
                        />


                        <Button
                            variant="contained"
                            sx={{
                                height: 56,
                                px: 3,
                                backgroundColor: "#2962ff",
                                "&:hover": { backgroundColor: "#0039cb" },
                            }}
                            onClick={handleAddItem}
                        >
                            Add
                        </Button>
                    </Box>

                    {/* Items Table */}
                    {items.length > 0 && (
                        <TableContainer component={Paper} sx={{ mt: 4 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell><b>Item Name</b></TableCell>
                                        <TableCell><b>Qty.</b></TableCell>
                                        <TableCell><b>Price / Unit</b></TableCell>
                                        <TableCell><b>Amount</b></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {items.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{item.itemName}</TableCell>
                                            <TableCell>{item.qty}</TableCell>
                                            <TableCell>{item.price}</TableCell>
                                            <TableCell>{item.amount.toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}

                                    {/* Total */}
                                    <TableRow>
                                        <TableCell colSpan={3} align="right">
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

                    {/* Action Buttons */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 2,
                            mt: 4,
                        }}
                    >
                        <Button
                            variant="contained"
                            sx={{
                                px: 4,
                                backgroundColor: "#2962ff",
                                "&:hover": { backgroundColor: "#0039cb" },
                            }}
                            onClick={handleSave}
                        >
                            SAVE &gt;&gt;
                        </Button>

                        {/* <Button variant="contained" color="inherit" sx={{ px: 4 }}>
            CLOSE
          </Button> */}
                    </Box>
                </CardContent>
            </Card>
        </Box>
    )
}

export default DailyPurchase
