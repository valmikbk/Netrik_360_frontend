import React, { useState, useEffect } from "react";
import {
    Box,
    Grid,
    Typography,
    Paper,
    TextField,
    Button,
    MenuItem,
} from "@mui/material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import MeghanaLogo from "../Logo/Meghana_stone_logo.png";
import Header from "../Header/Header";

const generateNextBillNumber = (lastBill) => {
    const today = new Date()
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "");

    if (!lastBill) {
        return `INV-${today}-0001`;
    }

    const parts = lastBill.split("-");
    const lastDate = parts[1];
    const lastSeq = parseInt(parts[2], 10);

    if (lastDate === today) {
        const nextSeq = String(lastSeq + 1).padStart(4, "0");
        return `INV-${today}-${nextSeq}`;
    }

    // New day → reset count
    return `INV-${today}-0001`;
};



function InvoicePage() {

    const [isSaved, setIsSaved] = useState(false);
    const [saving, setSaving] = useState(false);


    const [billNumber, setBillNumber] = useState("");
    const [customers, setCustomers] = useState([]);
    const [selectedCustomerId, setSelectedCustomerId] = useState("");
    const [selectedVillageId, setSelectedVillageId] = useState("");
    const [selectedVillageName, setSelectedVillageName] = useState("");
    const [selectedMaterialId, setSelectedMaterialId] = useState("");
    const [materials, setMaterials] = useState([]);
    const [villages, setVillages] = useState([])

    const [mrs, setMrs] = useState([]);
    const [selectedMrId, setSelectedMrId] = useState("");

    const [saved, setSaved] = useState(false);
    const [pdfBlob, setPdfBlob] = useState(null);




    const [invoiceData, setInvoiceData] = useState({
        customerName: "",
        customerContact: "",
        customerAddress: "",
        item: "20MM",
        brass: 6,
        rate: 18000,
        vehicleNo: "SWARAJ",
        paymentType: "Paid", // ✅ NEW
    });


    useEffect(() => {
        fetch("http://localhost:8000/api/sales/last-bill/")
            .then(res => res.json())
            .then(data => {
                const nextBill = generateNextBillNumber(data.last_bill_number);
                setBillNumber(nextBill);
            })
            .catch(err => console.error(err));
        fetch("http://localhost:8000/api/materials/")
            .then(res => res.json())
            .then(setMaterials);

        fetch("http://localhost:8000/api/villages/")
            .then(res => res.json())
            .then(data => setVillages(data));


        fetch("http://localhost:8000/api/customers/")
            .then(res => res.json())
            .then(data => setCustomers(data))
            .catch(err => console.error(err));

        fetch("http://localhost:8000/api/employees/mr/")
            .then(res => res.json())
            .then(data => setMrs(data))
            .catch(err => console.error("MR fetch error", err));
    }, []);


    const handleCustomerSelect = (e) => {
        const selectedId = e.target.value;
        const selectedCustomer = customers.find(c => c.id === selectedId);

        if (!selectedCustomer) return;

        setInvoiceData(prev => ({
            ...prev,
            customerName: selectedCustomer.name,
            customerContact: selectedCustomer.contact,
            customerAddress: selectedCustomer.address,
        }));
    };


    const handleChange = (e) => {
        setInvoiceData({ ...invoiceData, [e.target.name]: e.target.value });
    };

    const amount = invoiceData.brass * invoiceData.rate;

    const generatePDF = async () => {
        const input = document.getElementById("invoice");
        const canvas = await html2canvas(input, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

        const blob = pdf.output("blob");
        setPdfBlob(blob);

        return { pdf, blob };
    };


    const handleSave = async () => {
  try {
    // 1️⃣ Generate PDF ONCE
    const { blob } = await generatePDF();

    // 2️⃣ Prepare backend payload
    const formData = new FormData();
    formData.append("bill_number", billNumber);
    formData.append("customer", selectedCustomerId);
    formData.append("village", selectedVillageId);
    formData.append("material", selectedMaterialId);
    formData.append("quantity", invoiceData.brass);
    formData.append("amount", amount);
    formData.append("mr", selectedMrId);
    formData.append("payment_type", invoiceData.paymentType);
    formData.append("bill_doc", blob, `${billNumber}.pdf`);

    // 3️⃣ Save to backend
    const res = await fetch("http://localhost:8000/api/sales/create/", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Save failed");
      return;
    }

    alert("Invoice saved successfully");
    setSaved(true);

  } catch (err) {
    console.error(err);
    alert("Server error");
  }
};


const handleDownload = async () => {
  if (!pdfBlob) return;

  const pdf = new jsPDF("p", "mm", "a4");
  const url = URL.createObjectURL(pdfBlob);
  window.open(url);
};

const handlePrint = () => {
  if (!pdfBlob) return;

  const url = URL.createObjectURL(pdfBlob);
  const win = window.open(url);
  win.print();
};


    return (
        <Box sx={{ p: 4, backgroundColor: "#f2f2f2" }}>
            <Header />

            {/* FORM */}
            <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" fontWeight={600} mb={2}>
                    Enter Invoice Details
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            select
                            fullWidth
                            label="Customer Name"
                            value={selectedCustomerId}
                            onChange={(e) => {
                                const id = e.target.value;
                                const customer = customers.find(c => c.id === id);

                                setSelectedCustomerId(id);

                                setInvoiceData(prev => ({
                                    ...prev,
                                    customerName: customer.name,
                                    customerContact: customer.contact,
                                    customerAddress: customer.address,
                                }));
                            }}
                        >
                            {customers.map(c => (
                                <MenuItem key={c.id} value={c.id}>
                                    {c.name}
                                </MenuItem>
                            ))}
                        </TextField>


                    </Grid>

                    {/* <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Customer Contact"
                            name="customerContact"
                            value={invoiceData.customerContact}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Customer Address"
                            name="customerAddress"
                            value={invoiceData.customerAddress}
                            onChange={handleChange}
                        />
                    </Grid> */}
                    <Grid item xs={3}>
                        <TextField
                            select
                            fullWidth
                            label="Village"
                            value={selectedVillageId}
                            onChange={(e) => {
                                const id = e.target.value;
                                const village = villages.find(v => v.id === id);

                                setSelectedVillageId(id);
                                setSelectedVillageName(village?.name || "");
                            }}
                        >
                            {villages.map(v => (
                                <MenuItem key={v.id} value={v.id}>
                                    {v.name}
                                </MenuItem>
                            ))}
                        </TextField>

                    </Grid>


                    <Grid item xs={3}>
                        <TextField
                            fullWidth
                            label="Item"
                            name="item"
                            value={invoiceData.item}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid item xs={3}>
                        <TextField
                            fullWidth
                            label="Brass"
                            type="number"
                            name="brass"
                            value={invoiceData.brass}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid item xs={3}>
                        <TextField
                            fullWidth
                            label="Rate"
                            type="number"
                            name="rate"
                            value={invoiceData.rate}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid item xs={3}>
                        <TextField
                            fullWidth
                            label="Vehicle No"
                            name="vehicleNo"
                            value={invoiceData.vehicleNo}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid item xs={3}>
                        <TextField
                            select
                            fullWidth
                            label="MR Name"
                            value={selectedMrId}
                            onChange={(e) => setSelectedMrId(e.target.value)}
                        >
                            <MenuItem value="">
                                <em>Select MR</em>
                            </MenuItem>

                            {mrs.map((mr) => (
                                <MenuItem key={mr.id} value={mr.id}>
                                    {mr.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>


                    {/* ✅ PAYMENT TYPE */}
                    <Grid item xs={3}>
                        <TextField
                            select
                            fullWidth
                            label="Payment Type"
                            name="paymentType"
                            value={invoiceData.paymentType}
                            onChange={handleChange}
                        >
                            <MenuItem value="Paid">Paid</MenuItem>
                            <MenuItem value="Credit">Credit</MenuItem>
                        </TextField>
                    </Grid>
                </Grid>
            </Paper>

            {/* INVOICE PREVIEW */}
            <Paper
                id="invoice"
                sx={{
                    p: 3,
                    maxWidth: 900,
                    mx: "auto",
                    backgroundColor: "#fff",
                    border: "1px solid #000",
                }}
            >
                {/* HEADER */}
                <Box textAlign="center" mb={1}>
                    <Typography variant="h5" fontWeight={800}>
                        MEGHANA CONSTRUCTIONS
                    </Typography>
                    <Typography fontWeight={600}>
                        STONE CRUSHER & M SAND
                    </Typography>
                    <Typography variant="body2">
                        Manufacturer of Stone M5, M10, M20, M40, All Mix & M Sand
                    </Typography>
                    <Typography variant="caption" display="block">
                        Chimegaon, Tq. Kamalanagar, Dist. Bidar, Karnataka - 585417
                    </Typography>
                    <Typography variant="caption" display="block">
                        Email: meghanaconstructions12@gmail.com &nbsp; Contact No: 6360589990
                    </Typography>
                </Box>

                <Box sx={{ borderBottom: "2px solid #000", my: 1 }} />

                {/* BILL INFO */}
                <Box display="flex" border="1px solid #000">
                    <Box flex={1} p={1} borderRight="1px solid #000">
                        <Typography fontWeight={600}>To,</Typography>
                        <Typography>{invoiceData.customerName || "Customer Name"}</Typography>
                        <Typography>{selectedVillageName || "Village Name"}</Typography>
                        {/* <Typography>{villages.customerAddress || "Customer Address"}</Typography> */}
                    </Box>

                    <Box flex={1} p={1}>
                        <Typography>
                            Bill No : <b>{billNumber}</b>
                        </Typography>
                        <Typography>Date : {new Date().toLocaleDateString()}</Typography>
                        <Typography>Vehicle No : {invoiceData.vehicleNo}</Typography>
                        <Typography>GST No : 29AZVPB1008H1ZG</Typography>

                        {/* ✅ PAYMENT TYPE SHOWN IN BILL */}
                        <Typography fontWeight={600}>
                            Payment Type : {invoiceData.paymentType}
                        </Typography>
                    </Box>
                </Box>

                {/* ITEMS TABLE */}
                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        marginTop: 8,
                    }}
                >
                    <thead>
                        <tr>
                            {["Sr.No", "Particulars", "Brass", "Rate", "Amount"].map((h) => (
                                <th
                                    key={h}
                                    style={{
                                        border: "1px solid #000",
                                        padding: 6,
                                        textAlign: "center",
                                    }}
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ border: "1px solid #000", textAlign: "center" }}>1</td>
                            <td style={{ border: "1px solid #000", textAlign: "center" }}>
                                {invoiceData.item}
                            </td>
                            <td style={{ border: "1px solid #000", textAlign: "center" }}>
                                {invoiceData.brass}
                            </td>
                            <td style={{ border: "1px solid #000", textAlign: "center" }}>
                                {invoiceData.rate}
                            </td>
                            <td style={{ border: "1px solid #000", textAlign: "center" }}>
                                {amount}
                            </td>
                        </tr>
                    </tbody>
                </table>

                {/* TOTALS */}
                <Box display="flex" justifyContent="flex-end" mt={1}>
                    <table style={{ width: "40%", borderCollapse: "collapse" }}>
                        {[
                            ["Sub Total", amount],
                            ["CGST", 0],
                            ["SGST", 0],
                            ["IGST", 0],
                            ["Grand Total", amount],
                        ].map(([label, value]) => (
                            <tr key={label}>
                                <td style={{ border: "1px solid #000", padding: 6 }}>
                                    {label}
                                </td>
                                <td
                                    style={{
                                        border: "1px solid #000",
                                        padding: 6,
                                        textAlign: "right",
                                        fontWeight: label === "Grand Total" ? 700 : 400,
                                    }}
                                >
                                    {value}
                                </td>
                            </tr>
                        ))}
                    </table>
                </Box>

                {/* SIGNATURES */}
                <Box display="flex" justifyContent="space-between" mt={6}>
                    <Box textAlign="center">
                        <Box sx={{ borderTop: "1px solid #000", width: 200 }} />
                        <Typography>Receiver Signature</Typography>
                    </Box>

                    <Box textAlign="center">
                        <Typography fontWeight={600}>For MEGHANA CONSTRUCTION</Typography>
                        <Box sx={{ borderTop: "1px solid #000", width: 200, mt: 2 }} />
                        <Typography>Authorised Signature</Typography>
                    </Box>
                </Box>
            </Paper>

            <Box textAlign="right" mt={3} display="flex" gap={2} justifyContent="flex-end">
                <Button
                    variant="contained"
                    onClick={handleSave}
                >
                    SAVE
                </Button>


                <Button
                    variant="contained"
                    disabled={!saved}
                    onClick={handleDownload}
                >
                    Download PDF
                </Button>


<Button
  variant="outlined"
  disabled={!saved}
  onClick={handlePrint}
>
  Print
</Button>

            </Box>

        </Box>
    );
}

export default InvoicePage;
