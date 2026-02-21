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

import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

import Header from "../Header/Header";
import FuelIn from "./FuelIn";
import FuelOut from "./FuelOut";
import TotalFuelIn from "./TotalFuelIn";

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

function Fuel() {
  const [activePage, setActivePage] = useState("total");

  const renderContent = () => {
    switch (activePage) {
      case "in":
        return <FuelIn />;
      case "out":
        return <FuelOut />;
      case "total":
        return <TotalFuelIn />;
      default:
        return <TotalFuelIn />;
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
              sx={navItemStyle(activePage === "total")}
              onClick={() => setActivePage("total")}
            >
              <ListItemIcon>
                <LocalGasStationIcon />
              </ListItemIcon>
              <ListItemText primary="FUEL IN" />
            </ListItemButton>

            <ListItemButton
              sx={navItemStyle(activePage === "out")}
              onClick={() => setActivePage("out")}
            >
              <ListItemIcon>
                <TrendingDownIcon />
              </ListItemIcon>
              <ListItemText primary="FUEL OUT" />
            </ListItemButton>
          </List>
        </Drawer>

        {/* Content */}
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

export default Fuel;
