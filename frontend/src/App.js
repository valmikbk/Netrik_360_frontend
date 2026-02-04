import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AppBar, Toolbar, Button, Container } from "@mui/material";

import Main from "./Components/Main/Main";
import Home from "./Components/Home/Home";
import Dashboard from "./Components/Dashboard/Dashboard";

import TruckDetails from "./Components/Dashboard/TruckDetails/TruckDetails";
import MaterialDetails from "./Components/Dashboard/MaterialDetails/MaterialDetails";
import SalesDetails from "./Components/Dashboard/SalesDetails/SalesDetails";
import DieselDetails from "./Components/Dashboard/DieselDetails/DieselDetails";
import InvoiceGeneration from "./Components/Home/InvoiceGeneration";
import Master from "./Components/Master/Master";
import Blasting from "./Components/Blasting/Blasting";
import BlastingPayments from "./Components/Blasting/BlastingPayments";
import DailyPurchase from "./Components/DailyPurchase/DailyPurchase";
import Fuel from "./Components/Fuel/Fuel";
import Salary from "./Components/Salary/Salary";
import ElectricityBill from "./Components/Electricity/ElectricityBill";
import Reports from "./Components/Reports/Reports";
import AddCustomer from "./Components/Master/AddCustomer";
import PurchaseBill from "./Components/Home/PurchaseBillEntry";
import PurchaseBillEntry from "./Components/Home/PurchaseBillEntry";
import AddFuelType from "./Components/Master/AddFuelType";
import Payments from "./Components/payments/payments";
import CustomerPayments from "./Components/payments/CustomerPayments";


function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/home" element={<Home />} />
          <Route path="/invoice-generation" element={<InvoiceGeneration />} />
          <Route path="/purchase-bill" element={<PurchaseBillEntry />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/truck-details" element={<TruckDetails />} />
          <Route path="/dashboard/material-details" element={<MaterialDetails />} />
          <Route path="/dashboard/sales-details" element={<SalesDetails />} />
          <Route path="/dashboard/diesel-details" element={<DieselDetails />} />
          <Route path="/master" element={<Master />} />
          <Route path="/blasting" element={<Blasting />} />
          <Route path="/blasting-payments" element={<BlastingPayments />} />
          <Route path="/daily-purchase" element={<DailyPurchase />} />
          <Route path="/fuel-in-out" element={<Fuel />} />
          <Route path="/salary" element={<Salary />} />
          <Route path="/electricity-bill" element={<ElectricityBill />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/master/add-customer" element={<AddCustomer />} />
          <Route path="/master/add-fuel-type" element={<AddFuelType />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/customer-payments" element={<CustomerPayments />} />
        </Routes>
    </Router>
  );
}

export default App;
