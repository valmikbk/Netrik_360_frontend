import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";

import MeghanaLogo from "../Logo/Meghana_stone_logo.png";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  /* ================= WIDER SCADA NAV STYLE ================= */
  const getNavBoxStyle = (path) => {
  const active = location.pathname.includes(path);

  return {
    textDecoration: "none",
    marginLeft: "6px",
    marginRight: "6px",
    borderRadius: "8px",

    // 🔽 Reduced more
    padding: "8px 16px",
    minHeight: "40px",

    background: active
      ? "linear-gradient(145deg, #1361e7ff, #1361e7ff)"
      : "linear-gradient(145deg, #1361e7ff, #1361e7ff)",

    border: active
      ? "2px solid #00e676"
      : "1px solid rgba(255,255,255,0.1)",

    color: "#ffffff",
    fontWeight: 600,
    fontSize: "0.82rem",
    letterSpacing: "0.5px",

    transition: "all 0.3s ease",

    boxShadow: active
      ? "0 0 12px rgba(0,230,118,0.6)"
      : "0 0 6px rgba(0,0,0,0.4)",

    textAlign: "center",
    minWidth: "85px",

    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  };
};


  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      <AppBar
  position="fixed"
  sx={{
    background:
      "linear-gradient(90deg, #d5d8ddff 0%, #bec0c2ff 50%, #b5bbc4ff 100%)",
    borderBottom: "3px solid #1976d2",
    boxShadow: "0 4px 20px rgba(0,0,0,0.6)",
    height: "100px",
  }}
>
  <Toolbar
    sx={{
      position: "relative",
      minHeight: "100px !important", // override default 64px
      display: "flex",
      alignItems: "center", // 🔥 vertical center everything
      justifyContent: "center", // 🔥 center nav horizontally
    }}
  >
    {/* LEFT LOGO */}
    <Box
      component="img"
      src={MeghanaLogo}
      alt="Logo"
      sx={{
        height: 45,
        cursor: "pointer",
        position: "absolute",
        left: 25,        // 🔥 fixed left
        top: "50%",
        transform: "translateY(-50%)", // 🔥 perfect vertical center
      }}
      onClick={() => navigate("/home")}
    />

    {/* CENTER NAVIGATION */}
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
      }}
    >
      <Link to="/home" style={getNavBoxStyle("/home")}>
        HOME
      </Link>

      {role === "admin" && (
        <>
          <Link to="/master" style={getNavBoxStyle("/master")}>MASTER</Link>
          <Link to="/blasting" style={getNavBoxStyle("/blasting")}>BLASTING</Link>
          <Link to="/payments" style={getNavBoxStyle("/payments")}>PAYMENTS</Link>
          <Link to="/fuel-in-out" style={getNavBoxStyle("/fuel-in-out")}>FUEL IN/OUT</Link>
          <Link to="/daily-purchase" style={getNavBoxStyle("/daily-purchase")}>DAILY PURCHASE</Link>
          <Link to="/salary" style={getNavBoxStyle("/salary")}>SALARY</Link>
          <Link to="/electricity-bill" style={getNavBoxStyle("/electricity-bill")}>ELECTRICITY BILL</Link>
          <Link to="/reports" style={getNavBoxStyle("/reports")}>REPORTS</Link>
        </>
      )}
    </Box>

    {/* RIGHT PROFILE ICON */}
    <Avatar
      onClick={handleProfileClick}
      sx={{
        height: 42,
        width: 42,
        cursor: "pointer",
        bgcolor: "#2b3038",
        border: "2px solid #1976d2",
        boxShadow: "0 0 10px rgba(25,118,210,0.6)",
        position: "absolute",
        right: 25,         // 🔥 fixed right
        top: "50%",
        transform: "translateY(-50%)", // 🔥 perfect vertical center
      }}
    >
      <AccountCircleIcon sx={{ color: "#ffffff" }} />
    </Avatar>
  </Toolbar>
</AppBar>


      <Toolbar />

      <Menu
  anchorEl={anchorEl}
  open={open}
  onClose={handleClose}
  anchorOrigin={{
    vertical: "bottom",
    horizontal: "right",
  }}
  transformOrigin={{
    vertical: "top",
    horizontal: "right",
  }}
  PaperProps={{
    elevation: 6,
    sx: {
      mt: 1.5,
      borderRadius: 2,
      minWidth: 180,
      boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
    },
  }}
>
  {/* <MenuItem disabled sx={{ fontWeight: 600 }}>
    {user?.username || "Profile"}
  </MenuItem>

  <Divider /> */}

  <MenuItem onClick={handleLogout}>
    <LogoutIcon sx={{ mr: 1 }} />
    Logout
  </MenuItem>
</Menu>
    </>
  );
}

export default Header;
