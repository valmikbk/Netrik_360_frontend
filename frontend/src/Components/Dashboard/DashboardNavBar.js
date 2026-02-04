import React, { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CategoryIcon from "@mui/icons-material/Category";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";

// Import your page components
import TruckDetails from "./TruckDetails/TruckDetails";
import MaterialDetails from "./MaterialDetails/MaterialDetails";
import SalesDetails from "./SalesDetails/SalesDetails";
// import DieselDetails from "./DieselDetails/DieselDetails";

function DashboardNavBar() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

  const drawerWidth = open ? 220 : 70;

  const menuItems = [
    { text: "Truck Details", icon: <LocalShippingIcon /> },
    { text: "Material Details", icon: <CategoryIcon /> },
    { text: "Sales Details", icon: <MonetizationOnIcon /> },
    // { text: "Diesel Details", icon: <LocalGasStationIcon /> },
  ];

  // Dynamically render the selected page
  const renderContent = () => {
  switch (selected) {
    case "Truck Details":
      return <TruckDetails />;
    case "Material Details":
      return <MaterialDetails />;
    case "Sales Details":
      return <SalesDetails />;
    // case "Diesel Details":
    //   return <DieselDetails />;
    default:
      return <TruckDetails />; // no need for welcome message
  }
};

  return (
    <Box
      sx={{
        display: "flex",
        // height: "100vh",
        overflow: "hidden",
        fontFamily: "Roboto, Arial, sans-serif",
        // zIndex:1000,
      }}
    >
      {/* Sidebar Drawer */}
      <Drawer
        variant="permanent"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          whiteSpace: "nowrap",
          transition: "width 0.3s ease",
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            background: "linear-gradient(180deg, #1e293b 0%, #334155 100%)",
            color: "#fff",
            borderRight: "none",
            transition: "width 0.3s ease",
            overflowX: "hidden",
          },
        }}
      >
        {/* Sidebar Header */}
        

        {/* Menu Items */}
        <List
  sx={{
    mt: '64px', // offset from top equal to header height
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start', // keep items stacked from top
  }}
>
  {menuItems.map((item, index) => (
    <ListItem key={index} disablePadding sx={{ display: 'block' }}>
      <Tooltip title={!open ? item.text : ''} placement="right">
        <ListItemButton
          onClick={() => setSelected(item.text)}
          sx={{
            minHeight: 48,
            justifyContent: open ? 'initial' : 'center',
            px: 2.5,
            borderRadius: 1,
            backgroundColor:
              selected === item.text
                ? 'rgba(147,197,253,0.15)'
                : 'transparent',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.1)',
            },
          }}
        >
          <ListItemIcon
            sx={{
              color:
                selected === item.text ? '#93c5fd' : 'rgba(255,255,255,0.7)',
              minWidth: 0,
              mr: open ? 2 : 'auto',
              justifyContent: 'center',
            }}
          >
            {item.icon}
          </ListItemIcon>
          {open && (
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{
                fontSize: '0.95rem',
                fontWeight: selected === item.text ? 600 : 500,
              }}
            />
          )}
        </ListItemButton>
      </Tooltip>
    </ListItem>
  ))}
</List>

      </Drawer>

      {/* Main Content Area */}
      <Box
        sx={{
          flex: 1,
          backgroundColor: "#f8fafc",
          p: 4,
          overflow: "auto",
          transition: "margin-left 0.3s ease",
        }}
      >
        {renderContent()}
      </Box>
    </Box>
  );
}

export default DashboardNavBar;
