import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Paper,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";

function PurchaseBillEntry() {
  const navigate = useNavigate();

  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState("");

  const [villages, setVillages] = useState([]);
  const [selectedVillegeId, setSelectedVillegeId] = useState("");

  const [mrs, setMrs] = useState([]);
  const [selectedMrId, setSelectedMrId] = useState("");

  const [form, setForm] = useState({
    date: "",
    billNo: "",
    supplierName: "",
    village: "",
    item: "",
    brass: "",
    amount: "",
    mrName: "",
    billFile: null,
  });

  useEffect(() => {
    fetch("http://localhost:8000/api/suppliers/")
      .then(res => res.json())
      .then(data => setSuppliers(data))
      .catch(err => console.error(err));

    fetch("http://localhost:8000/api/villages/")
      .then(res => res.json())
      .then(data => setVillages(data))
      .catch(err => console.error(err));

    fetch("http://localhost:8000/api/employees/mr/")
      .then(res => res.json())
      .then(data => setMrs(data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  const handleSave = async () => {
    try {
      if (!selectedSupplierId || !form.billNo) {
        alert("Please fill required fields");
        return;
      }

      const formData = new FormData();

      formData.append("bill_number", form.billNo);
      formData.append("supplier", selectedSupplierId); // UUID
      formData.append("village", selectedVillegeId);   // UUID
      formData.append("material", form.item); // UUID
      formData.append("quantity", form.brass);
      formData.append("amount", form.amount);
      formData.append("mr", selectedMrId);              // UUID
      // formData.append("bill_doc", form.billFile);// UUID

      if (form.billFile) {
      formData.append("bill_doc", form.billFile);        // FILE ✅
    }

      const res = await fetch("http://localhost:8000/api/purchase/create/", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(JSON.stringify(data));
        return;
      }

      alert("Purchase Bill Saved Successfully");
      navigate(-1);

    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };


  // const formData = new FormData();

  // formData.append("bill_number", form.billNo);
  // formData.append("supplier", selectedSupplierId); // UUID
  // formData.append("village", selectedVillegeId);   // UUID
  // formData.append("material", form.item); // UUID
  // formData.append("quantity", form.brass);
  // formData.append("amount", form.amount);
  // formData.append("mr", selectedMrId);              // UUID
  // formData.append("bill_doc", form.billFile);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f4f6f8",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Header />
      <Paper
        elevation={6}
        sx={{
          width: "100%",
          maxWidth: 1000,
          borderRadius: 3,
          overflow: "hidden",
          mt: 15

        }}
      >
        {/* HEADER */}
        <Box
          sx={{
            backgroundColor: "#1e3a8a",
            color: "#fff",
            px: 3,
            py: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            PURCHASE BILL ENTRY
          </Typography>
          <IconButton onClick={() => navigate(-1)}>
            <CloseIcon sx={{ color: "#fff" }} />
          </IconButton>
        </Box>

        {/* FORM */}
        <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Supplier Name"
            required
            select
            value={selectedSupplierId}
            onChange={(e) => setSelectedSupplierId(e.target.value)}
          >
            <MenuItem value="">Select Supplier</MenuItem>
            {suppliers.map((s) => (
              <MenuItem key={s.id} value={s.id}>
                {s.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Date"
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
          />

          <TextField
            label="Bill No"
            name="billNo"
            value={form.billNo}
            onChange={handleChange}
            required
          />

          <TextField
            label="Villege"
            required
            select
            value={selectedVillegeId}
            onChange={(e) => setSelectedVillegeId(e.target.value)}
          >
            <MenuItem value="">Select Villege</MenuItem>
            {villages.map((s) => (
              <MenuItem key={s.id} value={s.id}>
                {s.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Item"
            name="item"
            value={form.item}
            onChange={handleChange}
            required
          />

          <TextField
            label="Brass"
            name="brass"
            value={form.brass}
            onChange={handleChange}
            type="number"
            required
          />

          <TextField
            label="Amount"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            type="number"
            required
          />

          <TextField
            label="Mr Name"
            required
            select
            value={selectedMrId}
            onChange={(e) => setSelectedMrId(e.target.value)}
          >
            <MenuItem value="">Select Mr</MenuItem>
            {mrs.map((s) => (
              <MenuItem key={s.id} value={s.id}>
                {s.name}
              </MenuItem>
            ))}
          </TextField>

          <Button
            variant="outlined"
            component="label"
            sx={{ width: 160, textTransform: "none" }}
          >
            Upload Bill
            <input
              hidden
              type="file"
              name="billFile"
              accept=".pdf,image/*"
              onChange={handleChange}
            />
          </Button>



          {/* ACTIONS */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              mt: 2,
            }}
          >
            <Button
              variant="contained"
              sx={{ backgroundColor: "#2563eb" }}
              onClick={handleSave}
            >
              SAVE
            </Button>
            <Button variant="outlined" onClick={() => navigate(-1)}>
              CLOSE
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default PurchaseBillEntry;
