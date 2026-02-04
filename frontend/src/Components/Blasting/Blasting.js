import React, { useState, useMemo, useEffect } from "react";
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

function Blasting() {
    const [form, setForm] = useState({
        supplierId: "",
        date: new Date().toISOString().split("T")[0],
        hole: 0,
        feet: "",
        rate: "",
    });

    const [suppliers, setSuppliers] = useState([]);


    useEffect(() => {
        fetch("http://localhost:8000/api/suppliers/")
            .then(res => res.json())
            .then(data => setSuppliers(data))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
  fetchSuppliers();
}, []);


    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Auto calculate grand total
    const grandTotal = useMemo(() => {
        const feet = Number(form.feet) || 0;
        const rate = Number(form.rate) || 0;
        return (feet * rate).toFixed(2);
    }, [form.feet, form.rate]);

    const handleFileChange = (e) => {
        setForm({ ...form, billFile: e.target.files[0] });
    };

    const fetchSuppliers = async () => {
  try {
    const res = await fetch("http://localhost:8000/api/suppliers/");
    const data = await res.json();
    setSuppliers(data);
  } catch (err) {
    console.error("Failed to fetch suppliers", err);
  }
};


    const handleSave = async () => {
        try {
            const formData = new FormData();
            formData.append("supplier", form.supplierId);
            formData.append("hole", form.hole);
            formData.append("feet", form.feet);
            formData.append("rate", form.rate);
            formData.append("grandtotal_amount", grandTotal);

            if (form.billFile) {
                formData.append("bill_doc", form.billFile);
            }

            const res = await fetch("http://localhost:8000/api/blasting/create/", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const err = await res.json();
                console.error(err);
                alert("Failed to save blasting entry");
                return;
            }

            // ✅ RESET FORM
            setForm({
                supplierId: "",
                date: new Date().toISOString().split("T")[0],
                hole: 0,
                feet: "",
                rate: "",
                billFile: null,
            });

            // ✅ AUTO REFRESH SUPPLIERS
            fetchSuppliers();

            alert("Blasting entry saved successfully");

        } catch (error) {
            console.error("Save error:", error);
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
                            BLASTING ENTRY
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
                                name="supplierId"
                                value={form.supplierId}
                                onChange={handleChange}
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

                            <TextField
                                label="Hole *"
                                name="hole"
                                value={form.hole}
                                onChange={handleChange}
                                fullWidth
                            />

                            <TextField
                                label="Feet *"
                                name="feet"
                                value={form.feet}
                                onChange={handleChange}
                                fullWidth
                            />

                            <TextField
                                label="Rate *"
                                name="rate"
                                value={form.rate}
                                onChange={handleChange}
                                fullWidth
                            />

                            <TextField
                                label="Grand Total"
                                value={grandTotal}
                                fullWidth
                                InputProps={{ readOnly: true }}
                            />

                            {/* Upload Electricity Bill */}
                            <Box>
                                <Button
                                    variant="outlined"
                                    component="label"
                                >
                                    Upload Bill
                                    <input
                                        type="file"
                                        hidden
                                        accept=".pdf,image/*"
                                        onChange={handleFileChange}
                                    />
                                </Button>

                                {form.billFile && (
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        Selected File: <b>{form.billFile.name}</b>
                                    </Typography>
                                )}
                            </Box>
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

export default Blasting;
