import React, { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
} from "@mui/material";

import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import PaymentsIcon from "@mui/icons-material/Payments";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import PaidIcon from "@mui/icons-material/Paid";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import SpeedIcon from "@mui/icons-material/Speed";
import FactoryIcon from "@mui/icons-material/Factory";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BarChartIcon from "@mui/icons-material/BarChart";

import Header from "../Header/Header";

// Pages
import SalarySheet from "./SalarySheet";
import AllInOneReport from "./AllInOneReport";
import AllStocks from "./AllStocks";
import BlastingOutstanding from "./BlastingOutstanding";
import BlastingPaidPayment from "./BlastingPaidPayment";
import CutomerOutstanding from "./CutomerOutstanding";
import DailyPurchase from "./DailyPurchase";
import FuelInVsOut from "./FuelInVsOut";
import PurchaseReport from "./PurchaseReport";
import SalesInvoice from "./SalesInvoice";
import SalesVsPurchases from "./SalesVsPurchases";
import FuelVsKilometer from "./FuelVsKilometer";
import SalesDetails from "./SalesDetails";
import CustomerRecievedpayment from "./CustomerRecievedpayment";
import ProductionReport from "./ProductionReport";
import SalesSheet from "./SalesSheet";
import FuelPurchaseReport from "./FuelPurchaseReport";

const drawerWidth = 270;

/* ================= COLOR THEMES ================= */
const COLORS = {
  sales: { light: "#e3f2fd", main: "#bbdefb", dark: "#1976d2" },
  finance: { light: "#e8f5e9", main: "#c8e6c9", dark: "#2e7d32" },
  fuel: { light: "#fff3e0", main: "#ffe0b2", dark: "#ef6c00" },
  production: { light: "#f3e5f5", main: "#e1bee7", dark: "#8e24aa" },
  purchase: { light: "#ede7f6", main: "#d1c4e9", dark: "#5e35b1" },
};

/* ================= NAV STYLE ================= */
const navItemStyle = (active) => ({
  // 🔥 More spacing between items
  mx: 2,
  my: 1.8,          // increased vertical spacing
  borderRadius: 2,

  background: active
    ? "linear-gradient(145deg, #1361e7, #0d47a1)"
    : "linear-gradient(145deg, #1976d2, #1565c0)",

  color: "#ffffff",

  border: active
    ? "2px solid #00e676"
    : "1px solid rgba(255,255,255,0.2)",

  boxShadow: active
    ? "0 0 12px rgba(0,230,118,0.6)"
    : "0 4px 8px rgba(0,0,0,0.15)",

  // 🔥 Increase button height slightly
  padding: "12px 14px",

  transition: "all 0.3s ease",

  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 0 16px rgba(25,118,210,0.6)",
  },

  "& .MuiListItemIcon-root": {
    color: "#ffffff",
    minWidth: 40,
    fontSize: "1.2rem",   // slightly bigger icon
  },

  "& .MuiListItemText-primary": {
    fontWeight: 700,
    fontSize: "1rem",     // 🔥 increased font size
    letterSpacing: "0.5px",
  },
});

function Reports() {
  const [activePage, setActivePage] = useState("sales-details");

  const renderContent = () => {
    switch (activePage) {
      case "sales-invoice": return <SalesInvoice />;
      case "sales-details": return <SalesDetails />;
      case "all-stocks": return <AllStocks />;
      case "sales-sheet": return <SalesSheet />;
      case "salary-sheet": return <SalarySheet />;
      case "blasting-outstanding": return <BlastingOutstanding />;
      case "blasting-paid-payment": return <BlastingPaidPayment />;
      case "customer-outstanding": return <CutomerOutstanding />;
      case "customer-received-payment": return <CustomerRecievedpayment />;
      case "daily-purchase": return <DailyPurchase />;
      case "fuel-in-vs-out": return <FuelInVsOut />;
      case "fuel-vs-km": return <FuelVsKilometer />;
      case "purchase-report": return <PurchaseReport />;
      case "production-report": return <ProductionReport />;
      case "sales-vs-purchases": return <SalesVsPurchases />;
      case "all-in-one-report": return <AllInOneReport />;
      case "fuel-purchase": return <FuelPurchaseReport />;
      default: return null;
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header />

      <Box sx={{ display: "flex", flexGrow: 1, zIndex:0 }}>
        {/* SIDEBAR */}
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              background: "#f4f6fa",
              borderRight: "1px solid #e0e0e0",
              boxShadow: "4px 0px 15px rgba(0,0,0,0.05)",
              overflowY: "auto",
            },
          }}
        >
          <Toolbar />
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              REPORT MODULE
            </Typography>
          </Box>
          <Divider />

          <List>

            {/* SALES */}
            {/* <ListItemButton
              sx={navItemStyle(activePage === "sales-invoice", COLORS.sales)}
              onClick={() => setActivePage("sales-invoice")}
            >
              <ListItemIcon><ReceiptLongIcon /></ListItemIcon>
              <ListItemText primary="SALES INVOICE" />
            </ListItemButton> */}

            <ListItemButton
              sx={navItemStyle(activePage === "sales-details", COLORS.sales)}
              onClick={() => setActivePage("sales-details")}
            >
              <ListItemIcon><BarChartIcon /></ListItemIcon>
              <ListItemText primary="SALES DETAILS" />
            </ListItemButton>

            <ListItemButton
              sx={navItemStyle(activePage === "all-stocks", COLORS.sales)}
              onClick={() => setActivePage("all-stocks")}
            >
              <ListItemIcon><Inventory2Icon /></ListItemIcon>
              <ListItemText primary="ALL STOCKS" />
            </ListItemButton>

            <ListItemButton
              sx={navItemStyle(activePage === "sales-sheet", COLORS.sales)}
              onClick={() => setActivePage("sales-sheet")}
            >
              <ListItemIcon><Inventory2Icon /></ListItemIcon>
              <ListItemText primary="SALES SHEET" />
            </ListItemButton>

            {/* FINANCE */}
            <ListItemButton
              sx={navItemStyle(activePage === "salary-sheet", COLORS.finance)}
              onClick={() => setActivePage("salary-sheet")}
            >
              <ListItemIcon><PaymentsIcon /></ListItemIcon>
              <ListItemText primary="SALARY SHEET" />
            </ListItemButton>

            <ListItemButton
              sx={navItemStyle(activePage === "blasting-outstanding", COLORS.finance)}
              onClick={() => setActivePage("blasting-outstanding")}
            >
              <ListItemIcon><PendingActionsIcon /></ListItemIcon>
              <ListItemText primary="BLASTING OUTSTANDING" />
            </ListItemButton>

            <ListItemButton
              sx={navItemStyle(activePage === "blasting-paid-payment", COLORS.finance)}
              onClick={() => setActivePage("blasting-paid-payment")}
            >
              <ListItemIcon><PaidIcon /></ListItemIcon>
              <ListItemText primary="BLASTING PAID PAYMENT" />
            </ListItemButton>

            <ListItemButton
              sx={navItemStyle(activePage === "customer-outstanding", COLORS.finance)}
              onClick={() => setActivePage("customer-outstanding")}
            >
              <ListItemIcon><AccountBalanceWalletIcon /></ListItemIcon>
              <ListItemText primary="CUSTOMER OUTSTANDING" />
            </ListItemButton>

            <ListItemButton
              sx={navItemStyle(activePage === "customer-received-payment", COLORS.finance)}
              onClick={() => setActivePage("customer-received-payment")}
            >
              <ListItemIcon><AccountBalanceWalletIcon /></ListItemIcon>
              <ListItemText primary="CUSTOMER RECEIVED PAYMENT" />
            </ListItemButton>

            {/* PURCHASE */}
            <ListItemButton
              sx={navItemStyle(activePage === "daily-purchase", COLORS.purchase)}
              onClick={() => setActivePage("daily-purchase")}
            >
              <ListItemIcon><ShoppingCartIcon /></ListItemIcon>
              <ListItemText primary="DAILY PURCHASE" />
            </ListItemButton>

            <ListItemButton
              sx={navItemStyle(activePage === "purchase-report", COLORS.purchase)}
              onClick={() => setActivePage("purchase-report")}
            >
              <ListItemIcon><FactoryIcon /></ListItemIcon>
              <ListItemText primary="RAW MATERIALS" />
            </ListItemButton>

            {/* FUEL */}
            <ListItemButton
              sx={navItemStyle(activePage === "fuel-purchase", COLORS.fuel)}
              onClick={() => setActivePage("fuel-purchase")}
            >
              <ListItemIcon><LocalGasStationIcon /></ListItemIcon>
              <ListItemText primary="FUEL PURCHASE" />
            </ListItemButton>

            {/* FUEL */}
            <ListItemButton
              sx={navItemStyle(activePage === "fuel-in-vs-out", COLORS.fuel)}
              onClick={() => setActivePage("fuel-in-vs-out")}
            >
              <ListItemIcon><LocalGasStationIcon /></ListItemIcon>
              <ListItemText primary="FUEL IN VS OUT" />
            </ListItemButton>

            <ListItemButton
              sx={navItemStyle(activePage === "fuel-vs-km", COLORS.fuel)}
              onClick={() => setActivePage("fuel-vs-km")}
            >
              <ListItemIcon><SpeedIcon /></ListItemIcon>
              <ListItemText primary="FUEL VS KM" />
            </ListItemButton>

            {/* PRODUCTION */}
            {/* <ListItemButton
              sx={navItemStyle(activePage === "production-report", COLORS.production)}
              onClick={() => setActivePage("production-report")}
            >
              <ListItemIcon><FactoryIcon /></ListItemIcon>
              <ListItemText primary="PRODUCTION REPORT" />
            </ListItemButton> */}

            <ListItemButton
              sx={navItemStyle(activePage === "sales-vs-purchases", COLORS.sales)}
              onClick={() => setActivePage("sales-vs-purchases")}
            >
              <ListItemIcon><CompareArrowsIcon /></ListItemIcon>
              <ListItemText primary="SALES VS PURCHASES" />
            </ListItemButton>

            <ListItemButton
              sx={navItemStyle(activePage === "all-in-one-report", COLORS.finance)}
              onClick={() => setActivePage("all-in-one-report")}
            >
              <ListItemIcon><DashboardIcon /></ListItemIcon>
              <ListItemText primary="ALL IN ONE" />
            </ListItemButton>

          </List>
        </Drawer>

        {/* MAIN CONTENT */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 2,
            backgroundColor: "#fafafa",
            overflow: "auto",
          }}
        >
          <Toolbar />
          {renderContent()}
        </Box>
      </Box>
    </Box>
  );
}

export default Reports;