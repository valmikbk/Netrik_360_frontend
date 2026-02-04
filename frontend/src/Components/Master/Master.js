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
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
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
              backgroundColor: "#f5f6fa",
            },
          }}
        >
          <Toolbar />

          <List>
            <ListItemButton
              sx={navItemStyle(activePage === "customer")}
              onClick={() => setActivePage("customer")}
            >
              <ListItemIcon><PersonAddIcon /></ListItemIcon>
              <ListItemText primary="Add Customer" />
            </ListItemButton>

            <ListItemButton
              sx={navItemStyle(activePage === "supplier")}
              onClick={() => setActivePage("supplier")}
            >
              <ListItemIcon><BusinessIcon /></ListItemIcon>
              <ListItemText primary="Add Supplier" />
            </ListItemButton>

            <ListItemButton
              sx={navItemStyle(activePage === "employee")}
              onClick={() => setActivePage("employee")}
            >
              <ListItemIcon><BadgeIcon /></ListItemIcon>
              <ListItemText primary="Add Employee" />
            </ListItemButton>

            <ListItemButton
              sx={navItemStyle(activePage === "vehicle")}
              onClick={() => setActivePage("vehicle")}
            >
              <ListItemIcon><DirectionsCarIcon /></ListItemIcon>
              <ListItemText primary="Add Vehicle / Villages" />
            </ListItemButton>

            <ListItemButton
              sx={navItemStyle(activePage === "salary")}
              onClick={() => setActivePage("salary")}
            >
              <ListItemIcon><CurrencyRupeeIcon /></ListItemIcon>
              <ListItemText primary="Update Employee Salary" />
            </ListItemButton>

            <ListItemButton
              sx={navItemStyle(activePage === "fuel-type")}
              onClick={() => setActivePage("fuel-type")}
            >
              <ListItemIcon><CurrencyRupeeIcon /></ListItemIcon>
              <ListItemText primary="Add Fuel Type" />
            </ListItemButton>
          </List>
        </Drawer>

        {/* Content Area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
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

export default Master;
