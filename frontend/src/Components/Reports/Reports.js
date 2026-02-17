import React, { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
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

const drawerWidth = 260;

const navItemStyle = (active) => ({
  m: 1,
  borderRadius: 2,
  backgroundColor: active ? "#e3f2fd" : "#ffffff",
  border: "1px solid #e0e0e0",
  boxShadow: active
    ? "inset 0px 3px 6px rgba(0,0,0,0.25)"
    : "0px 4px 8px rgba(0,0,0,0.15)",
  transition: "all 0.25s ease",

  "&:hover": {
    boxShadow: "0px 8px 16px rgba(0,0,0,0.25)",
    transform: "translateY(-2px)",
    backgroundColor: "#f9fafb",
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
      default: return null;
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header />

      <Box sx={{ display: "flex", flexGrow: 1, zIndex:0 }}>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              backgroundColor: "#f5f6fa",
            },
          }}
        >
          <Toolbar />

          <List>
            {/* <ListItemButton sx={navItemStyle(activePage === "sales-invoice")} onClick={() => setActivePage("sales-invoice")}>
              <ListItemIcon><ReceiptLongIcon /></ListItemIcon>
              <ListItemText primary="Sales Invoice" />
            </ListItemButton> */}

            <ListItemButton sx={navItemStyle(activePage === "sales-details")} onClick={() => setActivePage("sales-details")}>
              <ListItemIcon><BarChartIcon /></ListItemIcon>
              <ListItemText primary="SALES DETAILS" />
            </ListItemButton>

            <ListItemButton sx={navItemStyle(activePage === "all-stocks")} onClick={() => setActivePage("all-stocks")}>
              <ListItemIcon><Inventory2Icon /></ListItemIcon>
              <ListItemText primary="ALL STOCKS" />
            </ListItemButton>

            <ListItemButton sx={navItemStyle(activePage === "sales-sheet")} onClick={() => setActivePage("sales-sheet")}>
              <ListItemIcon><Inventory2Icon /></ListItemIcon>
              <ListItemText primary="Sales Sheet" />
            </ListItemButton>

            <ListItemButton sx={navItemStyle(activePage === "salary-sheet")} onClick={() => setActivePage("salary-sheet")}>
              <ListItemIcon><PaymentsIcon /></ListItemIcon>
              <ListItemText primary="SALARY SHEET" />
            </ListItemButton>

            <ListItemButton sx={navItemStyle(activePage === "blasting-outstanding")} onClick={() => setActivePage("blasting-outstanding")}>
              <ListItemIcon><PendingActionsIcon /></ListItemIcon>
              <ListItemText primary="BLASTING OUTSTANDING" />
            </ListItemButton>

            <ListItemButton sx={navItemStyle(activePage === "blasting-paid-payment")} onClick={() => setActivePage("blasting-paid-payment")}>
              <ListItemIcon><PaidIcon /></ListItemIcon>
              <ListItemText primary="BLASTING PAID PAYMENT" />
            </ListItemButton>

            <ListItemButton sx={navItemStyle(activePage === "customer-outstanding")} onClick={() => setActivePage("customer-outstanding")}>
              <ListItemIcon><AccountBalanceWalletIcon /></ListItemIcon>
              <ListItemText primary="CUSTOMER OUTSTANDING" />
            </ListItemButton>

            <ListItemButton sx={navItemStyle(activePage === "customer-received-payment")} onClick={() => setActivePage("customer-received-payment")}>
              <ListItemIcon><AccountBalanceWalletIcon /></ListItemIcon>
              <ListItemText primary="CUSTOMER RECEIVED PAYMENT" />
            </ListItemButton>

            <ListItemButton sx={navItemStyle(activePage === "daily-purchase")} onClick={() => setActivePage("daily-purchase")}>
              <ListItemIcon><ShoppingCartIcon /></ListItemIcon>
              <ListItemText primary="DAILY PURCHASE" />
            </ListItemButton>

            <ListItemButton sx={navItemStyle(activePage === "fuel-in-vs-out")} onClick={() => setActivePage("fuel-in-vs-out")}>
              <ListItemIcon><LocalGasStationIcon /></ListItemIcon>
              <ListItemText primary="FUEL IN VS OUT" />
            </ListItemButton>

            <ListItemButton sx={navItemStyle(activePage === "fuel-vs-km")} onClick={() => setActivePage("fuel-vs-km")}>
              <ListItemIcon><SpeedIcon /></ListItemIcon>
              <ListItemText primary="FUEL VS KM" />
            </ListItemButton>

            <ListItemButton sx={navItemStyle(activePage === "purchase-report")} onClick={() => setActivePage("purchase-report")}>
              <ListItemIcon><FactoryIcon /></ListItemIcon>
              <ListItemText primary="PURCHASE REPORT" />
            </ListItemButton>

            <ListItemButton sx={navItemStyle(activePage === "sales-vs-purchases")} onClick={() => setActivePage("sales-vs-purchases")}>
              <ListItemIcon><CompareArrowsIcon /></ListItemIcon>
              <ListItemText primary="SALES VS PURCHASES" />
            </ListItemButton>

            <ListItemButton sx={navItemStyle(activePage === "all-in-one-report")} onClick={() => setActivePage("all-in-one-report")}>
              <ListItemIcon><DashboardIcon /></ListItemIcon>
              <ListItemText primary="ALL IN ONE REPORT" />
            </ListItemButton>
          </List>
        </Drawer>

        <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: "#fafafa", overflow: "auto" }}>
          <Toolbar />
          {renderContent()}
        </Box>
      </Box>
    </Box>
  );
}

export default Reports;
