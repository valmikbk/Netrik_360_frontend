import React, { useState, useEffect } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    IconButton,
    Divider,
    MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Header from "../Header/Header";

function BlastingPayments() {
    const [form, setForm] = useState({
        partyId: "",
        date: new Date().toISOString().split("T")[0],
        paidAmount: "",
    });

    // Mock suppliers / parties (replace with API later)
    const [suppliers, setSuppliers] = useState([]);
    const [outstanding, setOutstanding] = useState(null);



    useEffect(() => {
        fetch("http://localhost:8000/api/suppliers/")
            .then(res => res.json())
            .then(data => setSuppliers(data))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        try {
            const res = await fetch("http://localhost:8000/api/suppliers/");
            const data = await res.json();
            setSuppliers(data);
        } catch (err) {
            console.error("Failed to fetch suppliers", err);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            const payload = {
                supplier: form.partyId,
                paid_amount: Number(form.paidAmount),
                date: form.date
            };
            console.log('payload', payload)

            const res = await fetch("http://localhost:8000/api/blasting-payments/create/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const err = await res.json();
                console.error(err);
                alert("Failed to save payment");
                return;
            }

            // ✅ Reset form
            setForm({
                partyId: "",
                date: new Date().toISOString().split("T")[0],
                paidAmount: "",
            });

            alert("Blasting payment saved successfully");

        } catch (error) {
            console.error("Payment error:", error);
        }
    };

    const handleSupplierChange = async (supplierId) => {
        setForm(prev => ({
            ...prev,
            partyId: supplierId,
        }));

        if (!supplierId) {
            setOutstanding(null);
            return;
        }

        try {
            const res = await fetch(
                `http://localhost:8000/api/blasting/outstanding/${supplierId}/`
            );
            const data = await res.json();
            setOutstanding(data);

        } catch (err) {
            console.error("Outstanding fetch error", err);
        }
    };



    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
            <Header />

            <Box sx={{ flexGrow: 1, overflow: "auto", p: 3 }}>
                <Card
                    sx={{
                        maxWidth: 900,
                        mx: "auto",
                        borderRadius: 3,
                        boxShadow: "0px 10px 30px rgba(0,0,0,0.25)",
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
                            borderTopLeftRadius: 12,
                            borderTopRightRadius: 12,
                        }}
                    >
                        <Typography variant="h6" sx={{ color: "#fff", fontWeight: 600, textAlign: "center", width: "100%" }}>
                            BLASTING PAYMENT
                        </Typography>

                        {/* <IconButton sx={{ color: "#fff" }}>
              <CloseIcon />
            </IconButton> */}
                    </Box>

                    <Divider />

                    {/* Form */}
                    <CardContent sx={{ px: 4, py: 3 }}>
                        <Box display="flex" flexDirection="column" gap={3}>
                            <TextField
                                select
                                label="Supplier Name *"
                                name="partyId"
                                value={form.partyId}
                                onChange={(e) => handleSupplierChange(e.target.value)}
                                fullWidth
                            >
                                <MenuItem value="">
                                    <em>Select Supplier</em>
                                </MenuItem>

                                {suppliers.map((sup) => (
                                    <MenuItem key={sup.id} value={sup.id}>
                                        {sup.name}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                label="Date *"
                                name="date"
                                type="date"
                                value={form.date}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                            />

                            {outstanding && (
                                <Box
                                    sx={{
                                        mt: 1,
                                        p: 2,
                                        borderRadius: 2,
                                        backgroundColor: "#f8fafc",
                                        border: "1px solid #e2e8f0",
                                    }}
                                >
                                    <Typography variant="body2">
                                        Total Blasting Amount: <b>₹ {outstanding.total_blasting}</b>
                                    </Typography>

                                    <Typography variant="body2" color="success.main">
                                        Total Paid: <b>₹ {outstanding.total_paid}</b>
                                    </Typography>

                                    <Typography
                                        variant="h6"
                                        fontWeight={700}
                                        color={outstanding.outstanding > 0 ? "error.main" : "success.main"}
                                    >
                                        Outstanding: ₹ {outstanding.outstanding}
                                    </Typography>
                                </Box>
                            )}

                            <TextField
                                label="Paid Amount *"
                                name="paidAmount"
                                value={form.paidAmount}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Box>

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
        </Box>
    );
}

export default BlastingPayments;
