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

function Fuel() {
  const [activePage, setActivePage] = useState("in");

  const renderContent = () => {
    switch (activePage) {
      case "in":
        return <FuelIn />;
      case "out":
        return <FuelOut />;
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
              sx={navItemStyle(activePage === "in")}
              onClick={() => setActivePage("in")}
            >
              <ListItemIcon>
                <LocalGasStationIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Fuel In" />
            </ListItemButton>

            <ListItemButton
              sx={navItemStyle(activePage === "out")}
              onClick={() => setActivePage("out")}
            >
              <ListItemIcon>
                <TrendingDownIcon color="error" />
              </ListItemIcon>
              <ListItemText primary="Fuel Out" />
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

export default Fuel;
