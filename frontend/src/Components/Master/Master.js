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

import PersonAddIcon from "@mui/icons-material/PersonAdd";
import BusinessIcon from "@mui/icons-material/Business";
import BadgeIcon from "@mui/icons-material/Badge";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

import Header from "../Header/Header";

// Pages
import AddCustomer from "./AddCustomer";
import AddSupplier from "./AddSupplier";
import AddEmployee from "./AddEmployee";
import AddVehicleVillages from "./AddVehicleVillages";
import UpdateEmployeeSalary from "./UpdateEmployeeSalary";
import AddFuelType from "./AddFuelType";
import UpdateRates from "./UpdateRates";

const drawerWidth = 260;

/* ================= BLUE OPTION STYLE ================= */
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


function Master() {
  const [activePage, setActivePage] = useState("customer");

  const renderContent = () => {
    switch (activePage) {
      case "customer":
        return <AddCustomer />;
      case "supplier":
        return <AddSupplier />;
      case "employee":
        return <AddEmployee />;
      case "vehicle":
        return <AddVehicleVillages />;
      case "salary":
        return <UpdateEmployeeSalary />;
      case "fuel-type":
        return <AddFuelType />;
      case "rates":
        return <UpdateRates />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", }}>
      {/* Header */}
      <Header />

      {/* Layout */}
      <Box sx={{ display: "flex", flexGrow: 1, zIndex:0 }}>
        {/* Sidebar */}
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              backgroundColor: "#f5f6fa", // 🔹 keep sidebar light
              borderRight: "1px solid #e0e0e0",
            },
          }}
        >
          <Toolbar />

          <List sx={{ mt: 7 }}>
            <ListItemButton
              sx={navItemStyle(activePage === "customer")}
              onClick={() => setActivePage("customer")}
            >
              <ListItemIcon>
                <PersonAddIcon />
              </ListItemIcon>
              <ListItemText primary="ADD CUSTOMER" />
            </ListItemButton>

            <ListItemButton
              sx={navItemStyle(activePage === "supplier")}
              onClick={() => setActivePage("supplier")}
            >
              <ListItemIcon>
                <BusinessIcon />
              </ListItemIcon>
              <ListItemText primary="ADD SUPPLIER" />
            </ListItemButton>

            <ListItemButton
              sx={navItemStyle(activePage === "employee")}
              onClick={() => setActivePage("employee")}
            >
              <ListItemIcon>
                <BadgeIcon />
              </ListItemIcon>
              <ListItemText primary="ADD EMPLOYEE" />
            </ListItemButton>

            <ListItemButton
              sx={navItemStyle(activePage === "vehicle")}
              onClick={() => setActivePage("vehicle")}
            >
              <ListItemIcon>
                <DirectionsCarIcon />
              </ListItemIcon>
              <ListItemText primary="ADD VEHICLE / VILLAGE" />
            </ListItemButton>

            <ListItemButton
              sx={navItemStyle(activePage === "salary")}
              onClick={() => setActivePage("salary")}
            >
              <ListItemIcon>
                <CurrencyRupeeIcon />
              </ListItemIcon>
              <ListItemText primary="UPDATE/DELETE EMPLOYEE SALARY" />
            </ListItemButton>

            <ListItemButton
              sx={navItemStyle(activePage === "rates")}
              onClick={() => setActivePage("rates")}
            >
              <ListItemIcon>
                <CurrencyRupeeIcon />
              </ListItemIcon>
              <ListItemText primary="UPDATE RATES" />
            </ListItemButton>

            <ListItemButton
              sx={navItemStyle(activePage === "fuel-type")}
              onClick={() => setActivePage("fuel-type")}
            >
              <ListItemIcon>
                <CurrencyRupeeIcon />
              </ListItemIcon>
              <ListItemText primary="ADD FUEL TYPE" />
            </ListItemButton>
          </List>
        </Drawer>

        {/* Content Area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            backgroundColor: "#fafafa", // 🔹 keep main part light
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

export default Master;
