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

/* ================= MASTER STYLE NAV ================= */
const navItemStyle = (active) => ({
  mx: 2,
  my: 1.8,
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

  padding: "12px 14px",

  transition: "all 0.3s ease",

  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 0 16px rgba(25,118,210,0.6)",
  },

  "& .MuiListItemIcon-root": {
    color: "#ffffff",
    minWidth: 40,
  },

  "& .MuiListItemText-primary": {
    fontWeight: 700,
    fontSize: "0.95rem",
    letterSpacing: "0.5px",
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
      {/* Header */}
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
                <PaymentsIcon />
              </ListItemIcon>
              <ListItemText primary="CUSTOMER RECEIVED PAYMENTS" />
            </ListItemButton>

            <ListItemButton
              sx={navItemStyle(activePage === "blasting")}
              onClick={() => setActivePage("blasting")}
            >
              <ListItemIcon>
                <ReceiptLongIcon />
              </ListItemIcon>
              <ListItemText primary="BLASTING PAID PAYMENTS" />
            </ListItemButton>
          </List>
        </Drawer>

        {/* Content Area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 4,
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
