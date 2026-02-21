import React, { useState, useEffect } from "react";
import {
    Box,
    Grid,
    Typography,
    Paper,
    TextField,
    Button,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
} from "@mui/material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import MeghanaLogo from "../Logo/Meghana_stone_logo.png";
import Header from "../Header/Header";
import { useNavigate } from "react-router-dom";


const generateNextBillNumber = (lastBill) => {
    if (!lastBill) return "01";

    const lastSeq = parseInt(lastBill, 10);

    if (isNaN(lastSeq)) return "01";

    return String(lastSeq + 1).padStart(2, "0");
};



// const generateNextBillNumber = (lastBill) => {
//     const today = new Date()
//         .toISOString()
//         .slice(0, 10)
//         .replace(/-/g, "");

//     if (!lastBill) {
//         // return `INV-${today}-0001`;
//         return `INV-${today}-0001`;
//     }

//     const parts = lastBill.split("-");
//     const lastDate = parts[1];
//     const lastSeq = parseInt(parts[2], 10);

//     if (lastDate === today) {
//         const nextSeq = String(lastSeq + 1).padStart(4, "0");
//         return `INV-${today}-${nextSeq}`;
//     }

//     // New day → reset count
//     return `INV-${today}-0001`;
// };



function InvoicePage() {
    const navigate = useNavigate();


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
    const [selectedVillageDistance, setSelectedVillageDistance] = useState("");


    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicleId, setSelectedVehicleId] = useState("");


    const [mrs, setMrs] = useState([]);
    const [selectedMrId, setSelectedMrId] = useState("");
    const [selectedMrName, setSelectedMrName] = useState("");

    const [saved, setSaved] = useState(false);
    const [pdfBlob, setPdfBlob] = useState(null);

    const [rates, setRates] = useState({});
    // 🔥 ADD THIS STATE (place with other states)
    const [amountError, setAmountError] = useState("");






    const [invoiceData, setInvoiceData] = useState({
        customerName: "",
        customerContact: "",
        customerAddress: "",
        item: "20MM",
        brass: 0,
        amount: 0,
        vehicleNo: "SWARAJ",
        paymentType: "Credit", // ✅ NEW
    });


    useEffect(() => {
        fetch("http://localhost:8000/api/sales/last-bill/")
            .then(res => res.json())
            .then(data => {
                console.log("Last bill from backend:", data.last_bill_number);
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
        fetch("http://localhost:8000/api/vehicles/")
            .then((res) => res.json())
            .then((data) => setVehicles(data))
            .catch(() => alert("Failed to load vehicles"));
        fetch("http://localhost:8000/api/rates/")
            .then(res => res.json())
            .then(data => {
                const rateMap = {};
                data.forEach(r => {
                    rateMap[r.name] = Number(r.rate);
                });
                setRates(rateMap);
            });


    }, []);

    const materialRate = rates[invoiceData.item] || 0;
    const kmRate = rates["KILO METER"] || 0;

    const brassValue = Number(invoiceData.brass || 0);
    const distanceValue = Number(selectedVillageDistance || 0);

    const materialAmount = brassValue * materialRate;
    const transportAmount = distanceValue * kmRate;

    const minimumAmount = materialAmount + transportAmount;




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
        const { name, value } = e.target;

        let updatedData = {
            ...invoiceData,
            [name]: value,
        };

        const materialRate = rates[
            name === "item" ? value : updatedData.item
        ] || 0;

        const kmRate = rates["KILO METER"] || 0;

        const brassValue =
            name === "brass"
                ? Number(value || 0)
                : Number(updatedData.brass || 0);

        const distanceValue = Number(selectedVillageDistance || 0);

        const materialAmount = brassValue * materialRate;
        const transportAmount = distanceValue * kmRate;

        updatedData.amount = materialAmount + transportAmount;

        setAmountError(""); // clear error on recalculation
        setInvoiceData(updatedData);
    };



    // const amount = invoiceData.brass * invoiceData.rate;

    const generatePDF = async () => {
        const input = document.getElementById("invoice");

        const canvas = await html2canvas(input, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        // Each copy height = half page
        const copyHeight = pdfHeight / 2;

        // Calculate image height maintaining aspect ratio
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;

        // First copy (TOP)
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, Math.min(imgHeight, copyHeight));

        // Divider line (optional)
        pdf.setLineWidth(0.5);
        pdf.line(0, copyHeight, pdfWidth, copyHeight);

        // Second copy (BOTTOM)
        pdf.addImage(
            imgData,
            "PNG",
            0,
            copyHeight,
            pdfWidth,
            Math.min(imgHeight, copyHeight)
        );

        const blob = pdf.output("blob");
        setPdfBlob(blob);

        return { pdf, blob };
    };



    const handleSave = async () => {
        try {

            const missingFields = [];

            if (!billNumber) missingFields.push("Bill Number");
            if (!selectedCustomerId) missingFields.push("Customer");
            if (!selectedVillageId) missingFields.push("Village");
            if (!selectedVehicleId) missingFields.push("Vehicle");
            if (!invoiceData.item) missingFields.push("Material");
            if (!invoiceData.brass) missingFields.push("Quantity");
            if (!invoiceData.amount) missingFields.push("Amount");
            if (!selectedMrId) missingFields.push("MR");
            if (!invoiceData.paymentType) missingFields.push("Payment Type");

            if (missingFields.length > 0) {
                alert("Missing Fields: " + missingFields.join(", "));
                return;
            }

            // 🔴 Final Amount Validation
            if (Number(invoiceData.amount) < minimumAmount) {
                setAmountError(`Minimum amount should be ₹ ${minimumAmount}`);
                alert(`Amount cannot be less than ₹ ${minimumAmount}`);
                return;
            }

            // 1️⃣ Generate PDF ONCE
            const { blob } = await generatePDF();

            // 2️⃣ Prepare backend payload
            const formData = new FormData();
            formData.append("bill_number", billNumber);
            formData.append("customer", selectedCustomerId);
            formData.append("village", selectedVillageId);
            formData.append("vehicle", selectedVehicleId);
            formData.append("material", invoiceData.item);
            formData.append("quantity", invoiceData.brass);
            formData.append("amount", invoiceData.amount);
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
                    ENTER INVOICE DETAILS
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
  select
  fullWidth
  label="CUSTOMER NAME"
  value={selectedCustomerId || ""}
  onChange={(e) => {
    const value = e.target.value;

    if (value === "__add_customer__") {
      navigate("home/add-customer");
      return;
    }

    const customer = customers.find(c => c.id === value);
    if (!customer) return;

    setSelectedCustomerId(value);
    setInvoiceData(prev => ({
      ...prev,
      customerName: customer.name,
      customerContact: customer.contact,
      customerAddress: customer.address,
    }));
  }}
  InputLabelProps={{ shrink: true }}   // ✅ SAME AS VILLAGE
  SelectProps={{ displayEmpty: true }} // ✅ SAME AS VILLAGE
  sx={{
    "& .MuiOutlinedInput-root": {
      minHeight: 56,                  // ✅ SAME HEIGHT
    },
    "& .MuiInputLabel-root": {
      fontWeight: 700,                // ✅ BOLD LABEL
    },
  }}
>
  <MenuItem value="">
    <em>Select Customer</em>
  </MenuItem>

  <MenuItem
    value="__add_customer__"
    sx={{ fontWeight: 600, color: "primary.main" }}
  >
    ➕ Add New Customer
  </MenuItem>

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
                            label="VILLAGE"
                            value={selectedVillageId || ""}
                            onChange={(e) => {
                                const value = e.target.value;

                                // ➕ Redirect to Add Village page
                                if (value === "__add_village__") {
                                    navigate("/add-village");
                                    return;
                                }

                                const village = villages.find(v => v.id === value);
                                if (!village) return;

                                setSelectedVillageId(value);
                                setSelectedVillageName(village.name);

                                const distance = Number(village.approx_distance || 0);
                                setSelectedVillageDistance(distance);

                                const materialRate = rates[invoiceData.item] || 0;
                                const kmRate = rates["KILO METER"] || 0;
                                const brassValue = Number(invoiceData.brass || 0);

                                const materialAmount = brassValue * materialRate;
                                const transportAmount = distance * kmRate;

                                setInvoiceData(prev => ({
                                    ...prev,
                                    amount: materialAmount + transportAmount
                                }));

                                setAmountError("");
                            }}
                            InputLabelProps={{ shrink: true }}
                            SelectProps={{ displayEmpty: true }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    minHeight: 56,
                                },
                                "& .MuiInputLabel-root": {
                                    fontWeight: 700,
                                },
                            }}
                        >
                            {/* Default Placeholder */}
                            <MenuItem value="">
                                <em>Select Village</em>
                            </MenuItem>

                            {/* ➕ ADD VILLAGE OPTION */}
                            <MenuItem
                                value="__add_village__"
                                sx={{ fontWeight: 600, color: "primary.main" }}
                            >
                                ➕ Add New Village
                            </MenuItem>

                            {/* Existing Villages */}
                            {villages.map(v => (
                                <MenuItem key={v.id} value={v.id}>
                                    {v.name}
                                </MenuItem>
                            ))}
                        </TextField>

                        {/* Show Distance */}
                        {selectedVillageDistance && (
                            <Typography
                                variant="body2"
                                sx={{ mt: 1, fontWeight: 600, color: "primary.main" }}
                            >
                                Approx Distance: {selectedVillageDistance} KM
                            </Typography>
                        )}
                    </Grid>


                    <Grid item xs={3}>
                        <TextField
                            fullWidth
                            label="ITEM"
                            name="item"
                            value={invoiceData.item}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                            sx={{
                                "& .MuiInputLabel-root": {
                                    fontWeight: 700,   // ✅ Bold Label
                                },
                                "& .MuiOutlinedInput-root": {
                                    minHeight: 56,
                                },
                            }}
                        />
                    </Grid>

                    <Grid item xs={3}>
                        <TextField
                            fullWidth
                            label="BRASS"
                            type="number"
                            name="brass"
                            value={invoiceData.brass}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                            sx={{
                                "& .MuiInputLabel-root": {
                                    fontWeight: 700,   // ✅ Bold Label
                                },
                                "& .MuiOutlinedInput-root": {
                                    minHeight: 56,
                                },
                            }}
                        />
                    </Grid>


                    <Grid item xs={3}>
                        <TextField
                            fullWidth
                            label="AMOUNT"
                            type="number"
                            name="amount"
                            value={invoiceData.amount}
                            onChange={(e) => {
                                const value = e.target.value;

                                setInvoiceData(prev => ({
                                    ...prev,
                                    amount: value,
                                }));

                                if (Number(value) < minimumAmount) {
                                    setAmountError(
                                        `Minimum amount should be ₹ ${minimumAmount}`
                                    );
                                } else {
                                    setAmountError("");
                                }
                            }}
                            error={Boolean(amountError)}
                            helperText={amountError}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    minHeight: 56,
                                },
                                "& .MuiInputLabel-root": {
                                    fontWeight: 700,
                                },
                            }}
                        />
                    </Grid>


                    <Grid item xs={3}>
                        <TextField
                            select
                            fullWidth
                            label="VEHICLE NO"
                            value={selectedVehicleId || ""}
                            onChange={(e) => {
                                const id = e.target.value;
                                const vehicle = vehicles.find(v => v.id === id);

                                setSelectedVehicleId(id);

                                setInvoiceData(prev => ({
                                    ...prev,
                                    vehicleNo: vehicle?.vehicle_number || "",
                                }));
                            }}
                            InputLabelProps={{ shrink: true }}
                            SelectProps={{ displayEmpty: true }}
                            sx={{
                                minWidth: 180,   // 👈 Added minimum width
                                "& .MuiOutlinedInput-root": {
                                    width: "100%",
                                    minHeight: 56,
                                },
                                "& .MuiInputBase-root": {
                                    width: "100%",
                                },
                                "& .MuiInputLabel-root": {
                                    fontWeight: 700,
                                },
                            }}
                        >
                            <MenuItem value="">
                                <em>Select Vehicle</em>
                            </MenuItem>

                            {vehicles.map((v) => (
                                <MenuItem key={v.id} value={v.id}>
                                    {v.vehicle_number}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>



                    <Grid item xs={3}>
                        <TextField
                            select
                            fullWidth
                            label="MR NAME"
                            value={selectedMrId || ""}
                            onChange={(e) => {
                                const mrId = e.target.value;
                                const mr = mrs.find((m) => m.id === mrId);

                                setSelectedMrId(mrId);
                                setSelectedMrName(mr?.name || "");
                            }}
                            InputLabelProps={{ shrink: true }}
                            SelectProps={{ displayEmpty: true }}
                            sx={{
                                minWidth: 180,   // 👈 Added minimum width
                                "& .MuiOutlinedInput-root": {
                                    width: "100%",
                                    minHeight: 56,
                                },
                                "& .MuiInputBase-root": {
                                    width: "100%",
                                },
                                "& .MuiInputLabel-root": {
                                    fontWeight: 700,
                                },
                            }}
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
                    {/* <Grid item xs={3}>
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
                    </Grid> */}
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
                        MEGHANA STONE CRUSHER & M SAND
                    </Typography>
                    {/* <Typography fontWeight={600}>
                        STONE CRUSHER & M SAND
                    </Typography> */}
                    <Typography variant="body2">
                        {/* Manufacturer of Stone M20, M40, All Mix, M Sand & Dust */}
                        MANUFACTURER OF STONE M20, M40, ALL MIX, M SAND & DUST
                    </Typography>
                    <Typography variant="caption" display="block">
                        CHIMEGAON, TQ. KAMALANAGAR, DIST. BIDAR, KARNATAKA - 585417
                        {/* Chimegaon, Tq. Kamalanagar, Dist. Bidar, Karnataka - 585417 */}
                    </Typography>
                    <Typography variant="caption" display="block">
                        EMAIL: MEGHANACONSTRUCTIONS12@GMAIL.COM &nbsp; CONTACT NO: 6360589990
                        {/* Email: meghanaconstructions12@gmail.com &nbsp; Contact No: 6360589990 */}
                    </Typography>
                </Box>

                <Box sx={{ borderBottom: "2px solid #000", my: 1 }} />

                {/* BILL INFO */}
                <Box display="flex" border="1px solid #000">
                    <Box flex={1} p={1} borderRight="1px solid #000">
                        <Typography fontWeight={600}>TO,</Typography>
                        <Typography>{invoiceData.customerName || "CUSTOMER NAME"}</Typography>
                        <Typography>{selectedVillageName || "VILLAGE NAME"}</Typography>
                        {/* <Typography>{villages.customerAddress || "Customer Address"}</Typography> */}
                    </Box>

                    <Box flex={1} p={1}>
                        <Typography>
                            BILL NO : <b>{billNumber}</b>
                        </Typography>
                        <Typography>DATE : {new Date().toLocaleDateString()}</Typography>
                        <Typography>VEHICLE NO : {invoiceData.vehicleNo}</Typography>
                        <Typography>GST NO : 29AZVPB1008H1ZG</Typography>

                        {/* ✅ PAYMENT TYPE SHOWN IN BILL */}
                        <Typography >
                            MR NAME : {selectedMrName || "MR Name"}
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
                            {["SR.NO", "PARTICULARS", "BRASS", "AMOUNT"].map((h) => (
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
                                {invoiceData.amount}
                            </td>
                            {/* <td style={{ border: "1px solid #000", textAlign: "center" }}>
                                {amount}
                            </td> */}
                        </tr>
                    </tbody>
                </table>

                {/* TOTALS */}
                <Box display="flex" justifyContent="flex-end" mt={1}>
                    <table style={{ width: "40%", borderCollapse: "collapse", textAlign: "center" }}>
                        {[
                            ["SUB TOTAL", invoiceData.amount],
                            ["CGST", 0],
                            ["SGST", 0],
                            ["IGST", 0],
                            ["GRAND TOTAL", invoiceData.amount],
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
                                        textAlign: "center"
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
                        <Box sx={{ width: 200 }} />
                        <Typography>RECEIVER SIGNATURE</Typography>
                    </Box>

                    <Box textAlign="center">
                        <Typography fontWeight={600}>FOR MEGHANA CONSTRUCTION</Typography>
                        <Box sx={{ width: 200, mt: 2 }} />
                        <Typography>AUTHORISED SIGNATURE</Typography>
                    </Box>
                </Box>
            </Paper>

            <Box textAlign="right" mt={3} display="flex" gap={2} justifyContent="flex-end">
                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={saved || saving}
                >
                    {saving ? "Saving..." : "SAVE"}
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
