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

import PaymentsIcon from "@mui/icons-material/Payments";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

import Header from "../Header/Header";

import BlastingPayments from "../Blasting/BlastingPayments";
import CustomerPayments from "./CustomerPayments";

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

function Payments() {
  const [activePage, setActivePage] = useState("customer");

  const renderContent = () => {
    switch (activePage) {
      case "blasting":
        return <BlastingPayments />;
      case "customer":
        return <CustomerPayments />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header />

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
              <ListItemIcon>
                <PaymentsIcon color="succuss" />
              </ListItemIcon>
              <ListItemText primary="Customer Payments" />
            </ListItemButton>

            <ListItemButton
              sx={navItemStyle(activePage === "blasting")}
              onClick={() => setActivePage("blasting")}
            >
              <ListItemIcon>
                <ReceiptLongIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Blasting Payments" />
            </ListItemButton>
          </List>
        </Drawer>

        {/* Content */}
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

export default Payments;
