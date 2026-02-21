import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./Components/Home/Home";
import Dashboard from "./Components/Dashboard/Dashboard";
import Login from "./Components/Auth/Login";
import ProtectedRoute from "./Components/Auth/ProtectedRoute";

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
import PurchaseBillEntry from "./Components/Home/PurchaseBillEntry";
import AddFuelType from "./Components/Master/AddFuelType";
import Payments from "./Components/payments/payments";
import CustomerPayments from "./Components/payments/CustomerPayments";
import HomeAddCutomer from "./Components/Home/HomeAddCutomer";
import Signup from "./Components/Auth/Signup";
import AddVillage from "./Components/Home/AddVillage";

function App() {
  return (
    // <Router>
      <Routes>
        {/* 🔓 LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* 🔐 PROTECTED ROUTES */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/invoice-generation" element={<ProtectedRoute><InvoiceGeneration /></ProtectedRoute>} />
        <Route path="/purchase-bill" element={<ProtectedRoute><PurchaseBillEntry /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard/truck-details" element={<ProtectedRoute><TruckDetails /></ProtectedRoute>} />
        <Route path="/dashboard/material-details" element={<ProtectedRoute><MaterialDetails /></ProtectedRoute>} />
        <Route path="/dashboard/sales-details" element={<ProtectedRoute><SalesDetails /></ProtectedRoute>} />
        <Route path="/dashboard/diesel-details" element={<ProtectedRoute><DieselDetails /></ProtectedRoute>} />
        <Route path="/master" element={<ProtectedRoute><Master /></ProtectedRoute>} />
        <Route path="/blasting" element={<ProtectedRoute><Blasting /></ProtectedRoute>} />
        <Route path="/blasting-payments" element={<ProtectedRoute><BlastingPayments /></ProtectedRoute>} />
        <Route path="/daily-purchase" element={<ProtectedRoute><DailyPurchase /></ProtectedRoute>} />
        <Route path="/fuel-in-out" element={<ProtectedRoute><Fuel /></ProtectedRoute>} />
        <Route path="/salary" element={<ProtectedRoute><Salary /></ProtectedRoute>} />
        <Route path="/electricity-bill" element={<ProtectedRoute><ElectricityBill /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
        <Route path="/master/add-customer" element={<ProtectedRoute><AddCustomer /></ProtectedRoute>} />
        <Route path="/invoice-generation/home/add-customer" element={<ProtectedRoute><HomeAddCutomer /></ProtectedRoute>} />
        <Route path="/master/add-fuel-type" element={<ProtectedRoute><AddFuelType /></ProtectedRoute>} />
        <Route path="/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
        <Route path="/customer-payments" element={<ProtectedRoute><CustomerPayments /></ProtectedRoute>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/add-village" element={<ProtectedRoute><AddVillage /></ProtectedRoute>} />
      </Routes>
    // </Router>
  );
}

export default App;
